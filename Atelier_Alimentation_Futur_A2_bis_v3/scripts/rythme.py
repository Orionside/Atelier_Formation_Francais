"""Mise en forme du texte envoyé à Qwen3-TTS pour régler le débit (seul levier « en mots » du modèle Base)."""
import re

def phrases(texte):
    """Découpe après . ? ! … (en gardant le guillemet fermant avec sa phrase)."""
    morceaux = re.split(r"(?<=[.?!…])(\s*»)?\s+(?=[«A-ZÀ-ÖØ-Þ0-9])", texte.strip())
    out, cur = [], ""
    for m in morceaux:
        if m is None: continue
        if m.strip() == "»": cur += " »"; continue
        if cur: out.append(cur)
        cur = m
    if cur: out.append(cur)
    return out

def rythmer(texte, niveau):
    """0 : texte tel quel · 1 : une phrase par paragraphe · 2 : en plus, « ... » à la place des virgules et des deux-points."""
    if niveau == 0: return texte
    ph = phrases(texte)
    if niveau >= 2:
        ph = [re.sub(r"\s*,\s+", "... ", re.sub(r"\s+:\s+", "... ", p)) for p in ph]
    return "\n\n".join(ph)
