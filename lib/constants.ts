export const PRACTICE_INFO = {
  name: 'Orthodontiepraktijk De Boog',
  address: 'Leidseweg 12, 3531 BG Utrecht',
  phone: '+31-30-000-0000',
  email: 'info@orthodeboog.nl',
  hours: {
    monday: '08:00 - 19:00',
    tuesday: '08:00 - 19:00',
    wednesday: '08:00 - 19:00',
    thursday: '08:00 - 19:00',
    friday: '08:00 - 19:00',
    saturday: '09:00 - 14:00',
    sunday: 'Gesloten',
  },
  transport: {
    parking: 'Gratis parkeren voor de deur (P-schijf 2 uur)',
    bus: '5 min lopen van bushalte Leidseweg (lijn 2, 12)',
    bike: '10 min fietsen van Utrecht Centraal',
  },
  doctor: {
    name: 'Dr. Emma van den Berg',
    credentials: [
      'ANO-lid (Associatie Nederlandse Orthodontisten)',
      'Specialisatie orthodontie — ACTA Amsterdam',
      'Gecertificeerd Invisalign Provider',
      '12+ jaren orthodontische ervaring',
      'Behandelt kinderen én volwassenen',
    ],
    bio: 'Ik ben orthodontist geworden omdat ik zie hoe een rechte lach iemands zelfvertrouwen verandert — op elke leeftijd. Bij De Boog neem ik de tijd om je situatie echt te begrijpen, voordat we samen een plan maken. Of je nu een tiener bent of net je vijftigste verjaardag hebt gevierd: iedereen verdient een behandeling die bij zijn of haar leven past.',
  },
  trustSignals: {
    patients: '2.400+',
    experience: '12 jaar',
    rating: '4.9/5',
    reviewCount: '187',
  },
};

export const TREATMENTS = [
  {
    id: 'vaste-beugel',
    icon: 'Braces',
    title: 'Vaste Beugel',
    description:
      'De klassieke vaste beugel voor kinderen en tieners. Nauwkeurig, bewezen effectief, en geschikt voor complexe gevallen.',
    priceFrom: '€2.400',
    insuranceNote:
      'Mogelijk (deels) vergoed via aanvullende verzekering — wij checken dit voor je.',
    duration: '12–24 maanden',
    targetAudience: 'Kinderen & tieners',
    faq: [
      {
        q: 'Is een vaste beugel pijnlijk?',
        a: 'De eerste dagen voel je wat spanning. Dit trekt snel weg.',
      },
      {
        q: 'Hoe lang duurt een behandeling met een vaste beugel?',
        a: 'Gemiddeld 18 tot 24 maanden, afhankelijk van de complexiteit. Bij kinderen en tieners verloopt de tandverplaatsing vaak iets sneller dan bij volwassenen.',
      },
    ],
  },
  {
    id: 'transparante-aligner',
    icon: 'Layers',
    title: 'Transparante Aligner',
    description:
      'Bijna onzichtbare plastic trays — ook bekend als Invisalign. Uitneembaar, comfortabel en ideaal voor volwassenen die discreet willen behandelen.',
    priceFrom: '€3.200',
    insuranceNote:
      'Mogelijk (deels) vergoed via aanvullende verzekering — wij checken dit voor je.',
    duration: '6–18 maanden',
    targetAudience: 'Volwassenen & tieners',
    faq: [
      {
        q: 'Kan ik de aligner uitdoen tijdens eten?',
        a: 'Ja, je verwijdert hem bij het eten en poetsen — dat is een groot voordeel.',
      },
      {
        q: 'Is dit hetzelfde als Invisalign?',
        a: 'Wij werken met gecertificeerde alignersystemen, inclusief Invisalign.',
      },
    ],
  },
  {
    id: 'volwassenen-orthodontie',
    icon: 'UserCheck',
    title: 'Volwassenen Orthodontie',
    description:
      'Het is nooit te laat voor een rechte lach. Meer dan 30% van onze patiënten is volwassen — zelfbetalend, bewust gekozen, en klaar voor een resultaat dat blijft.',
    priceFrom: '€2.800',
    duration: '12–30 maanden',
    targetAudience: 'Volwassenen 18+',
    faq: [
      {
        q: 'Welke behandeling past bij mijn situatie?',
        a: 'Dat hangt af van uw tandstand en voorkeur. Transparante aligners zijn populair bij volwassenen: bijna onzichtbaar en uitneembaar. Een vaste beugel is effectiever bij complexere gevallen. We bepalen dit samen tijdens de gratis intake.',
      },
      {
        q: 'Hoe lang duurt behandeling voor volwassenen?',
        a: 'Gemiddeld 12 tot 18 maanden met aligners, 18 tot 30 maanden met een vaste beugel. U krijgt een persoonlijke tijdsindicatie tijdens het eerste consult.',
      },
    ],
  },
];

export const BEFORE_AFTER_CASES = [
  {
    id: 'case-1',
    treatment: 'Vaste beugel',
    duration: '20 maanden',
    age: 'Patiënt: 15 jaar',
    image: '/images/before-after-1.jpg',
  },
  {
    id: 'case-2',
    treatment: 'Transparante aligner',
    duration: '14 maanden',
    age: 'Patiënt: 32 jaar',
    image: '/images/before-after-2.jpg',
  },
  {
    id: 'case-3',
    treatment: 'Vaste beugel & retainer',
    duration: '24 maanden',
    age: 'Patiënt: 45 jaar',
    image: '/images/before-after-3.jpg',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    text: 'Op mijn 38ste durfde ik eindelijk te kiezen voor aligners. Dr. Van den Berg legde alles helder uit en het resultaat is precies wat ik wilde.',
    stars: 5,
  },
  {
    name: 'Familie Jansen',
    text: 'Onze dochter was zenuwachtig, maar voelt zich nu helemaal op haar gemak. Na 18 maanden is het resultaat prachtig.',
    stars: 5,
  },
  {
    name: 'Mark V.',
    text: 'Eindelijk een orthodontist die ook avondafspraken aanbiedt. Heel fijn als je fulltime werkt.',
    stars: 5,
  },
];

export const FAQ_QUESTIONS = [
  {
    question: 'Wat kost een orthodontische behandeling?',
    answer:
      'De kosten zijn afhankelijk van het type behandeling en de complexiteit van uw situatie. Als richtlijn: een vaste beugel begint vanaf €2.400, gedeeltelijke behandelingen (één kaak) liggen lager. Transparante aligners beginnen vanaf €3.200 voor een volledige behandeling. Voor een exacte prijsopgave is een intake nodig — deze is bij ons gratis en vrijblijvend. Gespreide betaling is mogelijk, zodat de kosten over de behandelperiode worden verdeeld.',
  },
  {
    question: 'Wordt een beugel vergoed door mijn zorgverzekeraar?',
    answer:
      'Kinderen en jongeren tot 18 jaar hebben recht op vergoeding vanuit de basisverzekering, mits de behandeling medisch noodzakelijk is en er een orthodontische indicatie bestaat. Belangrijk: de vergoeding geldt zolang de behandeling vóór het 18e jaar start. Wacht u te lang met aanmelden, dan kan uw kind de vergoeding mislopen. Volwassenen worden in de meeste gevallen niet vergoed via de basisverzekering. Sommige aanvullende verzekeringen vergoeden een deel — dit verschilt per verzekeraar en pakket. Wij controleren uw vergoedingsrecht gratis tijdens het eerste consult.',
  },
  {
    question: 'Kan ik als volwassene nog een beugel krijgen?',
    answer:
      'Ja, absoluut — er is geen leeftijdsgrens voor orthodontische behandeling. Meer dan 30% van onze patiënten is ouder dan 18 jaar. Volwassen patiënten kiezen vaak voor transparante aligners omdat deze nauwelijks zichtbaar zijn en passen bij een professionele uitstraling. Het resultaat van orthodontische behandeling is bij volwassenen even goed als bij jongeren, al kan de behandelduur iets langer zijn bij complexere gevallen.',
  },
  {
    question: 'Ziet iemand dat ik een beugel draag?',
    answer:
      'Dat hangt af van het type behandeling dat u kiest. Transparante aligners zoals Invisalign zijn in dagelijks gebruik nauwelijks zichtbaar — collega\'s en klanten merken vaak niets. Keramische brackets (tandkleurige brackets bij een vaste beugel) vallen minder op dan metalen brackets. Wilt u een zo onopvallend mogelijke behandeling? Geef dat aan bij uw intake, dan bekijken we samen welke optie het beste bij uw situatie past.',
  },
  {
    question: 'Kan ik bij jullie terecht als ik tandartsangst heb?',
    answer:
      'Ja. Wij werken regelmatig met patiënten die spanning of angst ervaren rond tandheelkundige behandelingen. Ons team neemt de tijd om u rustig voor te bereiden op elke stap. U bent altijd welkom om vooraf vragen te stellen, en we stemmen het tempo van de behandeling af op wat voor u comfortabel voelt. Geef bij het plannen van uw afspraak aan dat u dit fijn vindt om te vermelden — dan houden wij hier rekening mee.',
  },
  {
    question: 'Wat is het verschil tussen Invisalign en een vaste beugel?',
    answer:
      'Een vaste beugel heeft brackets die permanent aan de tanden zijn bevestigd en verbonden zijn via een draad. Transparante aligners zoals Invisalign zijn uitneembare doorzichtige trays die u zelf in- en uitdoet. Aligners zijn vrijwel onzichtbaar, makkelijker schoon te houden en comfortabeler bij sporten. Vaste beugels zijn soms effectiever bij complexere tandstanden en vereisen minder eigen discipline. Welke behandeling het beste bij u past, bespreken we altijd op basis van uw gebit en uw wensen — niet op basis van wat duurder of goedkoper is.',
  },
  {
    question: 'Hoe lang duurt een orthodontische behandeling?',
    answer:
      'De behandelduur hangt af van de complexiteit van uw tandstand en het type beugel. Een gemiddelde vaste beugel bij jongeren duurt 18 tot 24 maanden. Transparante aligners voor milde tot gemiddelde correcties duren vaak 6 tot 18 maanden. Na de actieve behandeling volgt een retentiefase met een retainer om het resultaat vast te houden. Tijdens het kennismakingsgesprek geven wij een persoonlijke tijdsindicatie op basis van uw situatie.',
  },
  {
    question: 'Doet een beugel pijn?',
    answer:
      'De meeste patiënten ervaren de eerste 2 tot 4 dagen na het plaatsen of aanpassen van een beugel enige druk of spanning op de tanden. Dit is normaal en trekt vanzelf over. Ibuprofen of paracetamol helpt als het ongemak lastig is. Bij transparante aligners is het ongemak doorgaans minder uitgesproken. Ernstige of aanhoudende pijn is niet normaal — neem dan contact met ons op zodat we kunnen helpen.',
  },
  {
    question: 'Wat gebeurt er na de behandeling? Blijven mijn tanden recht?',
    answer:
      'Na de actieve behandeling volgt een retentiefase. U krijgt een retainer — een dunne, onzichtbare beugel die u \'s nachts draagt — om te voorkomen dat tanden terugschuiven naar hun oude positie. Zonder retainer verschuiven tanden bij vrijwel iedereen geleidelijk terug. Wij begeleiden u ook in deze fase en geven duidelijke instructies over hoe lang en hoe vaak u de retainer moet dragen.',
  },
  {
    question: 'Hoe vaak moet ik op controle komen?',
    answer:
      'Bij een vaste beugel plannen wij controlesessies om de 6 tot 8 weken. Tijdens deze afspraken wordt de beugel bijgesteld en de voortgang beoordeeld. Bij transparante aligners is de tussentijd langer — gemiddeld eens per 8 tot 12 weken. Alle controleafspraken zijn inbegrepen in de behandelprijs; u betaalt niet per bezoek.',
  },
  {
    question: 'Hebben jullie ook avond- of zaterdagafspraken?',
    answer:
      'Ja. We begrijpen dat school en werk overdag lastig kunnen zijn. Wij bieden wekelijks avondafspraken aan tot 19:00 uur en zaterdagse spreekuren. Geef uw voorkeur aan bij het inplannen van uw consult, dan houden wij daar rekening mee.',
  },
  {
    question: 'Hoe weet ik of mijn kind nu al naar de orthodontist moet?',
    answer:
      'Een eerste beoordeling is zinvol zodra de meeste blijvende tanden zijn doorgekomen, meestal tussen 10 en 13 jaar. Vroeg beginnen heeft voordelen: bij groeiende kaken zijn bepaalde correcties eenvoudiger en goedkoper. Bovendien geldt de zorgverzekeringsdekking alleen voor behandelingen die vóór het 18e jaar starten. Twijfelt u? Plan een vrijblijvend kennismaking — wij beoordelen of en wanneer behandeling nodig is.',
  },
  {
    question: 'Hoe lang is de wachttijd voor een eerste afspraak?',
    answer:
      'Onze wachttijd voor een eerste kennismakingsgesprek is momenteel [X weken]. Voor een volledige behandelstart geldt een gemiddelde wachttijd van [Y maanden]. Wilt u niet te lang wachten? Plan uw intake zo vroeg mogelijk in — zeker als uw kind richting de 18 jaar gaat en vergoeding nog van toepassing is.',
  },
  {
    question: 'Wat is een vrijblijvend kennismaking precies?',
    answer:
      'Tijdens het vrijblijvend kennismaking bekijken wij uw gebit en bespreken we uw wensen en verwachtingen. U ontvangt een eerste behandelindicatie, een indicatieve tijdsduur en een transparante prijsopgave. Er is geen verplichting om te starten. Het gesprek duurt ongeveer 30 minuten en is bedoeld om u alle informatie te geven die u nodig heeft om een weloverwogen beslissing te maken.',
  },
];
