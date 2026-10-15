/* Contenus originaux de réemploi. Les pistes 27–32 du manuel ne sont pas reproduites. */
window.BON_SEJOUR = (() => {
const card=(id,prompt,model,hint='',tip='',icon='')=>({id,prompt,model,hint,tip,icon});
const hotel=[
['piscine','la piscine','Il y a une piscine.','Une piscine → la piscine.','pool'],
['chambre','la chambre','La chambre est confortable et moderne.','La chambre : féminin. Confortable et moderne ne changent pas.','bed'],
['bains','la salle de bains','Il y a une salle de bains privée.','Privée : féminin, comme la salle.','bath'],
['clim','la climatisation','Il y a la climatisation.','La climatisation : féminin.','snow'],
['tele','la télévision','Il y a une télévision.','Une télévision → la télévision.','tv'],
['minibar','le minibar','Il y a un minibar.','Un minibar → le minibar.','bottle'],
['wifi','le WiFi','Le WiFi est gratuit.','Gratuit : on ne paie pas pour le WiFi.','wifi'],
['dejeuner','le petit déjeuner','Le petit déjeuner est compris.','Compris : inclus dans le prix de la chambre.','cup'],
['parking','le parking','Est-ce qu’il y a un parking ?','On pose une question : le parking n’est pas indiqué sur la capture.','car'],
['ascenseur','l’ascenseur','Est-ce qu’il y a un ascenseur ?','L’ remplace le devant une voyelle.','lift'],
['cle','la clé','Voici la clé de la chambre.','Une clé, des clés.','key'],
['chdouble','une chambre double','J’ai une chambre double.','Une chambre simple : une personne. Double : deux personnes.','bed']
].map(([id,word,model,tip,icon])=>({...card('hotel-'+id,'Dites le mot, puis une phrase.',model,word,tip,icon),word}));
const objects=[
['portable','un portable','Je n’ai pas de portable.','phone'],
['chargeur','un chargeur','Je n’ai pas de chargeur.','plug'],
['lunettes','des lunettes','Je n’ai pas de lunettes.','glasses'],
['cles','des clés','Je n’ai pas de clés.','key'],
['mouchoirs','des mouchoirs','Je n’ai pas de mouchoirs.','tissue'],
['portefeuille','un portefeuille','Je n’ai pas de portefeuille.','wallet'],
['monnaie','un porte-monnaie','Je n’ai pas de porte-monnaie.','purse'],
['carte','une carte de crédit','Je n’ai pas de carte de crédit.','credit'],
['eau','une bouteille d’eau','Je n’ai pas de bouteille d’eau.','bottle'],
['gum','des chewing-gums','Je n’ai pas de chewing-gums.','gum'],
['passeport','un passeport','Je n’ai pas de passeport.','passport'],
['valise','une valise','Je n’ai pas de valise.','case'],
['identite','une carte d’identité','Je n’ai pas de carte d’identité.','credit'],
['bagages','des bagages','Je n’ai pas de bagages.','case']
].map(([id,word,negative,icon])=>({...card('objet-'+id,'Regardez. Dites le mot. Puis dites ce que vous avez sur vous.',`J’ai ${word}.`,word,'Dites une phrase vraie pour vous.',icon),word,negative}));
const constructions=[
card('avoir-je','Moi : une réservation.','J’ai une réservation.','je → j’ai','Je ai devient j’ai.'),
card('avoir-tu','Ton ami : des lunettes.','Tu as des lunettes.','tu → tu as'),
card('avoir-il','Le client : une valise.','Il a une valise.','il → il a'),
card('avoir-elle','La cliente : un passeport.','Elle a un passeport.','elle → elle a'),
card('avoir-on','Vous et votre ami : une chambre double. Utilisez « on ».','On a une chambre double.','on → on a','On peut remplacer nous dans une conversation. Le verbe reste au singulier : on a.'),
card('avoir-nous','Vous et votre ami : une chambre double. Utilisez « nous ».','Nous avons une chambre double.','nous → nous avons'),
card('avoir-vous','À la réception, parlez au client : la chambre 14.','Vous avez la chambre quatorze.','vous → vous avez','Vous est la forme polie pour une personne, ou la forme pour plusieurs personnes.'),
card('avoir-ils','Deux clients : des bagages.','Ils ont des bagages.','ils → ils ont'),
card('avoir-elles','Deux clientes : des clés.','Elles ont des clés.','elles → elles ont'),
card('neg-un','Dites non : « J’ai un passeport. »','Je n’ai pas de passeport.','je n’ai pas de…','Un, une et des deviennent de après je n’ai pas.'),
card('neg-des','Dites non : « J’ai des lunettes. »','Je n’ai pas de lunettes.','je n’ai pas de…'),
card('neg-une','Dites non : « J’ai une réservation. »','Je n’ai pas de réservation.','je n’ai pas de…'),
card('neg-d','Dites non : « J’ai de l’eau. »','Je n’ai pas d’eau.','pas d’…','Devant une voyelle : de devient d’.'),
card('ilya-pos','Dans cet hôtel d’entraînement : piscine présente.','Il y a une piscine.','il y a + un / une / des','Il y a décrit ce qui existe à un endroit.'),
card('ilya-neg','Dans cet hôtel d’entraînement : parking absent.','Il n’y a pas de parking.','il n’y a pas de…','C’est une situation inventée pour s’entraîner.'),
card('accord-grand','La chambre : grand ou grande ? Faites une phrase.','La chambre est grande.','la chambre → grande','Une chambre grande, une chambre petite. Un hôtel grand, un hôtel petit.'),
card('accord-petit','Le minibar : petit ou petite ? Faites une phrase.','Le minibar est petit.','le minibar → petit'),
card('articles','Vous présentez une piscine. Puis vous dites sa taille.','Il y a une piscine. La piscine est grande.','une piscine → la piscine','Une : on introduit. La : on reprend la piscine déjà connue.'),
card('adjectifs','La chambre : confortable + moderne.','La chambre est confortable et moderne.','la chambre est…'),
card('prix','Le prix de la capture : 154 € par nuit. Dites le prix.','C’est cent cinquante-quatre euros par nuit.','154 : cent cinquante-quatre','Ce prix dépasse 99 : il est facultatif à ce stade. Ce n’est pas le prix de tout le séjour.')
];
const questions=[
card('q-piscine','Posez une question : l’hôtel + une piscine.','Est-ce que l’hôtel a une piscine ?','est-ce que + phrase','Est-ce que sert à poser une question. On peut répondre oui ou non.'),
card('q-parking','Posez une question : il y a + un parking.','Est-ce qu’il y a un parking ?','est-ce qu’il y a…','Que devient qu’ devant il.'),
card('q-pdej','Demandez si le petit déjeuner est compris.','Est-ce que le petit déjeuner est compris ?','est-ce que le petit déjeuner…'),
card('q-chambre','Demandez si la chambre est grande.','Est-ce que la chambre est grande ?','est-ce que la chambre…'),
card('q-passeport','À la réception : demandez un passeport au client.','Est-ce que vous avez un passeport ?','est-ce que vous avez…'),
card('q-lunettes','À votre ami : demandez s’il a des lunettes.','Est-ce que tu as des lunettes ?','est-ce que tu as…'),
card('q-oui','Répondez oui : « Est-ce que vous avez une réservation ? »','Oui, j’ai une réservation.','oui, j’ai…'),
card('q-non','Répondez non : « Est-ce que vous avez un passeport ? »','Non, je n’ai pas de passeport.','non, je n’ai pas de…'),
card('q-commun','Votre ami a des clés. Vous aussi. Dites ce que vous avez en commun.','Nous avons des clés.','nous avons…','Vous pouvez aussi dire : on a des clés.'),
card('q-avis','Votre avis : cet hôtel est cher. Dites-le, puis dites si vous réservez.','C’est cher. Je ne réserve pas.','c’est cher / ce n’est pas cher ; je réserve / je ne réserve pas','C’est un exemple. Votre avis peut être différent.')
];
const phonetics=[
card('son-avez','Écoutez, puis répétez. Reliez les deux mots.','Vous avez une chambre double.','vous‿avez → « vou-z-avez »','La liaison entre vous et avez se prononce avec /z/.'),
card('son-avons','Écoutez, puis répétez. Reliez les deux mots.','Nous avons un parking.','nous‿avons → « nou-z-avons »','Pas de pause entre nous et avons.'),
card('son-ils','Écoutez, puis répétez. Reliez les deux mots.','Ils ont une réservation.','ils‿ont → « il-z-ont »','Le s final devient /z/ devant ont.'),
card('son-supp','Écoutez. Reliez « est » et « en ».','Le petit déjeuner est en supplément.','est‿en → « è-t-en »','La liaison se fait avec /t/. En supplément : on paie en plus.'),
card('son-question','Écoutez. Posez la question à une personne.','Est-ce qu’il y a un parking ?','est-ce qu’il y a / un parking ?','Pour cet entraînement, faites entendre la question avec une fin qui monte. Ce n’est pas une règle obligatoire pour toutes les questions.'),
card('son-reponse','Écoutez. Donnez une réponse.','Oui, il y a un parking.','oui / il y a un parking.','Une fin qui descend aide à entendre la réponse. Comparez avec la question.')
];
const numbers=[
[0,'zéro'],[1,'un'],[2,'deux'],[4,'quatre'],[14,'quatorze'],[17,'dix-sept'],[20,'vingt'],[21,'vingt et un'],[30,'trente'],[40,'quarante'],[50,'cinquante'],[60,'soixante'],[70,'soixante-dix'],[71,'soixante et onze'],[80,'quatre-vingts'],[81,'quatre-vingt-un'],[90,'quatre-vingt-dix'],[99,'quatre-vingt-dix-neuf']
].map(([n,t])=>card('nombre-'+n,`Dites le numéro de chambre : ${n}.`,t,'Un numéro, pas un calcul.','Les numéros sont des exemples d’entraînement.'));
const dialogue=[
{id:'d1',voice:'f',role:'La réceptionniste',text:'Bonjour monsieur.'},
{id:'d2',voice:'m',role:'Le client',text:'Bonjour. J’ai une réservation au nom de Martin.'},
{id:'d3',voice:'f',role:'La réceptionniste',text:'Une chambre double pour deux nuits ?'},
{id:'d4',voice:'m',role:'Le client',text:'Oui, pour deux personnes.'},
{id:'d5',voice:'f',role:'La réceptionniste',text:'Est-ce que vous avez un passeport ?'},
{id:'d6',voice:'m',role:'Le client',text:'Non, je n’ai pas de passeport. J’ai une carte d’identité.'},
{id:'d7',voice:'f',role:'La réceptionniste',text:'Merci. Vous avez la chambre quatorze. Voici la clé.'},
{id:'d8',voice:'m',role:'Le client',text:'Est-ce que le petit déjeuner est compris ?'},
{id:'d9',voice:'f',role:'La réceptionniste',text:'Oui, il est compris.'},
{id:'d10',voice:'m',role:'Le client',text:'Est-ce qu’il y a un parking ?'},
{id:'d11',voice:'f',role:'La réceptionniste',text:'Non, il n’y a pas de parking.'},
{id:'d12',voice:'m',role:'Le client',text:'D’accord. Merci. Je paie par carte.'}
];
const listening=[
{id:'ecoute-nuits',prompt:'La réservation est pour…',choices:['une nuit','deux nuits','quatre nuits'],correct:1,explain:'La réceptionniste demande : « Une chambre double pour deux nuits ? » Le client répond oui.'},
{id:'ecoute-chambre',prompt:'Le client a la chambre…',choices:['4','14','40'],correct:1,explain:'La réceptionniste dit : « Vous avez la chambre quatorze. »'},
{id:'ecoute-doc',prompt:'Quel document le client a-t-il ?',choices:['un passeport','une carte d’identité','aucun document'],correct:1,explain:'Il n’a pas de passeport. Il a une carte d’identité.'},
{id:'ecoute-dej',prompt:'Le petit déjeuner est…',choices:['compris','en supplément','absent'],correct:0,explain:'La réceptionniste répond : « Oui, il est compris. »'},
{id:'ecoute-parking',prompt:'Dans ce dialogue, il y a un parking.',choices:['Oui','Non'],correct:1,explain:'La réceptionniste dit : « Non, il n’y a pas de parking. »'},
{id:'ecoute-corrige',prompt:'Corrigez à voix haute : « Le client a un passeport. »',choices:['Il a un passeport.','Il n’a pas de passeport. Il a une carte d’identité.'],correct:1,explain:'Ne dites pas seulement « faux » : donnez l’information correcte.'}
];
const scenarios=[
{name:'Une arrivée simple',person:'Martin',people:'deux',nights:'deux',room:'quatorze',type:'double',document:'une carte d’identité',breakfast:true,parking:false},
{name:'Un autre séjour',person:'Lopez',people:'une',nights:'une',room:'vingt et un',type:'simple',document:'un passeport',breakfast:false,parking:true},
{name:'Une nouvelle chambre',person:'Diallo',people:'deux',nights:'trois',room:'quatre-vingt-un',type:'double',document:'une carte d’identité',breakfast:true,parking:true}
];
return {hotel,objects,constructions,questions,phonetics,numbers,dialogue,listening,scenarios,steps:[
['accueil','Je commence',''],['hotel','L’hôtel','4 min'],['objets','Mes objets','4 min'],['phrases','Je fais une phrase','5 min'],['questions','Je pose une question','4 min'],['sons','Je relie les mots','3 min'],['ecoute','Je comprends','4 min'],['roles','À la réception','5 min'],['mission','Mon séjour','3 min']
]};})();
