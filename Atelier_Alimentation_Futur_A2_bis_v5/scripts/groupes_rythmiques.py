"""Découpe un texte français en groupes rythmiques et prépare le texte envoyé à Qwen3-TTS.

Pourquoi : le français n'a pas d'accent de mot. Le seul repère régulier est la FIN du groupe rythmique
(dernière syllabe plus longue, voix qui monte ou descend). Un apprenant qui cherche un accent dans chaque
mot ne le trouve pas ; il lui faut des groupes courts, nets et réguliers. On vise des groupes de 3 à 7
syllabes (au plus 9), ce qui donne à 4 syllabes par seconde des blocs de 0,75 à 2 s.

  phrases(texte)          -> liste de phrases
  groupes(texte)          -> liste de phrases ; chaque phrase = liste de (groupe, frontière)
                             frontière : "mineure" (ajoutée par le découpage), "virgule", "phrase"
  mise_en_forme(texte, m) -> texte envoyé au modèle (m = "brut", "v3", "ponctuation", "groupes")
"""
import re

VOYELLES = "aeiouyàâäéèêëîïôöùûüœæ"

# Mots qui s'appuient sur le mot suivant : ils ne finissent jamais un groupe.
PROCLITIQUES = set("""
le la les l un une des du de d au aux ce cet cette ces mon ton son ma ta sa mes tes ses notre votre leur nos vos leurs
quel quelle quels quelles chaque quelques plusieurs deux trois quatre cinq six sept huit neuf dix
à dans sur sous avec sans pour par chez vers entre en depuis pendant avant après comme selon parmi
et ou mais donc car ni que qu si quand puis or
je j tu il elle on nous vous ils elles me m te t se s lui y ne n ça c qui où dont
est sont a ont suis es êtes sommes va vais vont peut peux
très plus moins trop si aussi
""".split())
# Mots qui s'appuient sur le mot précédent.
ENCLITIQUES = {"pas", "plus", "jamais", "rien"}
# Une coupure est naturelle devant ces mots (début d'un nouveau complément ou d'une nouvelle proposition).
COUPE_FACILE = set("et ou mais donc car puis que qu qui où dont quand si pour avec sans dans sur sous chez vers entre depuis pendant avant après comme selon parmi à au aux en par".split())
COUPE_DIFFICILE = {"de", "d", "du", "des"}  # « de plus en plus de légumes » reste entier si possible

IDEAL, MAXI, PLAFOND = 5, 9, 11


def syllabes(mot):
    """Nombre de syllabes prononcées, estimé d'après l'orthographe (à ±1 près : suffisant pour découper)."""
    m = re.sub(r"[^a-zàâäéèêëîïôöùûüœæç0-9'’-]", "", mot.lower())
    if not m:
        return 0
    if m.isdigit():
        return max(1, len(m))
    n = 0
    for part in re.split(r"['’-]", m):
        if not part:
            continue
        p = part.replace("qu", "q").replace("gu", "g") if not part.startswith("gu") else part
        p = re.sub(r"(?<=[aeiouyàâéèêîôû])(?:es|e)$", "", p) if len(p) > 2 else p      # « mangée », « joue »
        p = re.sub(r"(?<=[^aeiouyàâäéèêëîïôöùûüœæ])(?:ent|es|e)$", "", p) if len(p) > 3 else p  # e muet final
        p = re.sub(r"eau|oeu|œu|oui|aie|eoi", "a", p)
        g = re.findall(rf"[{VOYELLES}]+", p)
        n += max(1, len(g)) if re.search(rf"[{VOYELLES}]", part) else 0
    return max(1, n)


def _nu(mot):
    return re.sub(r"[^a-zàâäéèêëîïôöùûüœæç]", "", mot.lower().split("'")[0].split("’")[0])


def phrases(texte):
    """Découpe après . ? ! … (le guillemet fermant reste avec sa phrase)."""
    t = re.sub(r"\s+([?!;:»])", r" \1", texte.strip())
    morceaux = re.split(r"(?<=[.?!…])(\s*»)?\s+(?=[«A-ZÀ-ÖØ-Þ0-9])", t)
    out, cur = [], ""
    for m in morceaux:
        if m is None:
            continue
        if m.strip() == "»":
            cur += " »"
            continue
        if cur:
            out.append(cur)
        cur = m
    if cur:
        out.append(cur)
    return out


def _jetons(phrase):
    """Mots avec leur ponctuation collée (« ? » et « » » rejoignent le mot d'avant, « « » le mot d'après)."""
    J, attente = [], ""
    for j in phrase.split():
        if re.fullmatch(r"[?!;:»…,.—–/·)]+", j) and J:
            J[-1] += (" " if j[0] in "?!;:»—–/·" else "") + j
        elif re.fullmatch(r"[«(—–/·]+", j):
            attente += j + " "
        else:
            J.append(attente + j)
            attente = ""
    return J


def _frontiere(jeton):
    f = jeton.rstrip(" »\")")
    if f[-1:] in ".?!…":
        return "phrase"
    if f[-1:] in ",;:—–" or jeton.endswith(")"):
        return "virgule"
    return None


def _couper(aps):
    """aps : liste de (texte, syllabes, premier mot). Répartit en groupes de taille voisine de IDEAL."""
    n = len(aps)
    total = sum(a[1] for a in aps)
    if total <= 7 or n == 1:
        return [" ".join(a[0] for a in aps)]
    INF = float("inf")
    best, prev = [INF] * (n + 1), [0] * (n + 1)
    best[0] = 0
    for j in range(1, n + 1):
        for i in range(j):
            s = sum(a[1] for a in aps[i:j])
            if s > PLAFOND:
                continue
            c = (s - IDEAL) ** 2 + (40 if s > MAXI else 0) + (30 if s < 3 else 0)
            if i > 0:
                m = aps[i][2]
                c += 0 if m in COUPE_FACILE else 9 if m in COUPE_DIFFICILE else 4
            if best[i] + c < best[j]:
                best[j], prev[j] = best[i] + c, i
    if best[n] == INF:
        return [" ".join(a[0] for a in aps)]
    cuts, j = [], n
    while j > 0:
        cuts.append((prev[j], j))
        j = prev[j]
    return [" ".join(a[0] for a in aps[i:j]) for i, j in reversed(cuts)]


def charger_manuel(chemin):
    """Fichier texte : une ligne par texte annoté (« | » = frontière ajoutée). Renvoie {texte sans barres: texte annoté}."""
    M = {}
    for l in open(chemin, encoding="utf-8"):
        l = l.strip()
        if l and not l.startswith("#"):
            M[re.sub(r"\s*\|\s*", " ", l)] = l
    return M


def groupes(texte, manuel=None):
    """manuel : dictionnaire de charger_manuel(). Un texte annoté à la main n'est pas redécoupé automatiquement."""
    annote = (manuel or {}).get(texte.strip())
    auto = annote is None
    out = []
    for ph in phrases(annote or texte):
        G, troncon, ap = [], [], []

        def fermer_ap():
            if ap:
                troncon.append((" ".join(ap), sum(syllabes(x) for x in ap), _nu(ap[0])))
                ap.clear()

        def fermer_troncon(frontiere):
            fermer_ap()
            if not troncon:
                return
            parts = _couper(troncon) if auto else [" ".join(a[0] for a in troncon)]
            for k, p in enumerate(parts):
                G.append((p, frontiere if k == len(parts) - 1 else "mineure"))
            troncon.clear()

        J = _jetons(ph)
        for k, j in enumerate(J):
            if j == "|":
                fermer_troncon("mineure")
                continue
            if j.startswith("(") and (troncon or ap):
                fermer_troncon("virgule")
            f = _frontiere(j)
            nu = _nu(j)
            if nu in ENCLITIQUES and troncon and not ap:
                t, s, p = troncon.pop()
                troncon.append((t + " " + j, s + syllabes(j), p))
            else:
                ap.append(j)
                if f or nu not in PROCLITIQUES or "'" in j.rstrip("'’") and _nu(j.split("'")[-1]) not in PROCLITIQUES and len(j.split("'")[-1]) > 2:
                    fermer_ap()
            if f:
                fermer_troncon(f)
        if ap and troncon:  # proclitiques en fin de tronçon (« de plus en… ») : avec le groupe d'avant
            t, s, p = troncon.pop()
            troncon.append((t + " " + " ".join(ap), s + sum(syllabes(x) for x in ap), p))
            ap.clear()
        fermer_troncon("phrase")
        if G:
            G[-1] = (G[-1][0], "phrase")
            out.append(G)
    return out


def mise_en_forme(texte, mode, manuel=None):
    """Texte envoyé au modèle. `manuel` : dictionnaire de charger_manuel()."""
    if mode == "brut":
        return texte
    if mode == "v3":   # méthode de la bis v3 : une phrase par paragraphe, « ... » à la place des virgules
        ph = [re.sub(r"\s*,\s+", "... ", re.sub(r"\s+:\s+", "... ", p)) for p in phrases(texte)]
        return "\n\n".join(ph)
    if mode == "ponctuation":
        return "\n\n".join(phrases(texte))
    if mode == "groupes":  # une virgule à chaque frontière de groupe ajoutée
        L = []
        for G in groupes(texte, manuel):
            s = ""
            for g, f in G:
                s += g + (", " if f == "mineure" else " ")
            L.append(s.strip())
        return "\n\n".join(L)
    raise ValueError(mode)


if __name__ == "__main__":
    import json, sys
    E = json.load(open(sys.argv[1], encoding="utf-8"))["entries"]
    M = charger_manuel(sys.argv[2]) if len(sys.argv) > 2 else {}
    vus = set()
    for e in E:
        for t in ([s["text"] for s in e["segments"]] if e.get("segments") else [e["tts_text"]]):
            vus.add(t.strip())
            G = groupes(t, M)
            S = [sum(syllabes(m) for m in g.split()) for ph in G for g, f in ph]
            print(e["id"], "·", " ‖ ".join(" | ".join(g for g, f in ph) for ph in G), "·", max(S))
            assert re.sub(r"\s+", " ", " ".join(g for ph in G for g, f in ph)) == re.sub(r"\s+", " ", re.sub(r"\s+([?!;:»])", r" \1", t.strip())), t
    print("annotations manuelles sans texte correspondant :", [k for k in M if k not in vus])
