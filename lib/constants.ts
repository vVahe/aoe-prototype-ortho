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
    duration: '12–24 maanden',
    targetAudience: 'Kinderen & tieners',
    faq: [
      {
        q: 'Is een vaste beugel pijnlijk?',
        a: 'De eerste dagen voel je wat spanning. Dit trekt snel weg.',
      },
      {
        q: 'Wordt dit vergoed?',
        a: 'Kinderen tot 18 jaar kunnen aanspraak maken op vergoeding bij indicatie. Wij controleren dit gratis.',
      },
    ],
  },
  {
    id: 'transparante-aligner',
    icon: 'Layers',
    title: 'Transparante Aligner',
    description:
      'Bijna onzichtbare plastic trays die je tanden stap voor stap recht zetten. Uitneembaar, comfortabel en ideaal voor volwassenen.',
    priceFrom: '€3.200',
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
      'Het is nooit te laat voor een rechte lach. Wij behandelen dagelijks volwassenen — met een aanpak die past bij jouw leven en schema.',
    priceFrom: '€2.800',
    duration: '12–30 maanden',
    targetAudience: 'Volwassenen 18+',
    faq: [
      {
        q: 'Kan ik als volwassene een beugel krijgen?',
        a: 'Absoluut. Meer dan 30% van onze patiënten is ouder dan 18.',
      },
      {
        q: 'Zijn er avondafspraken?',
        a: 'Ja, wij bieden wekelijks avond- en zaterdagafspraken aan.',
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
    question: 'Wordt een beugel vergoed door mijn zorgverzekeraar?',
    answer:
      'Kinderen tot 18 jaar kunnen aanspraak maken op vergoeding vanuit de basisverzekering, mits er een orthodontische indicatie is. Volwassenen worden in de meeste gevallen niet vergoed via de basisverzekering, maar sommige aanvullende verzekeringen dekken een deel van de kosten. Wij controleren uw vergoedingsrecht gratis tijdens het eerste consult.',
  },
  {
    question: 'Kan ik als volwassene nog een beugel krijgen?',
    answer:
      'Ja, absoluut. Er is geen leeftijdsgrens voor orthodontische behandeling. Meer dan 30% van onze patiënten is ouder dan 18 jaar. Zowel vaste beugels als transparante aligners zijn uitstekend geschikt voor volwassenen, en het resultaat is vergelijkbaar met behandelingen bij jongeren.',
  },
  {
    question: 'Hoe lang duurt een orthodontische behandeling?',
    answer:
      'De behandelduur varieert per persoon en per type behandeling. Een gemiddelde vaste beugel bij jongeren duurt 18 tot 24 maanden. Transparante aligners voor volwassenen duren vaak 6 tot 18 maanden. Tijdens het kennismakingsgesprek geven wij een persoonlijke tijdsindicatie.',
  },
  {
    question: 'Wat is het verschil tussen Invisalign en een vaste beugel?',
    answer:
      'Een vaste beugel bestaat uit brackets die aan de tanden zijn bevestigd en verbonden zijn met een draad. Invisalign (en vergelijkbare systemen) maakt gebruik van uitneembare doorzichtige trays. Aligners zijn bijna onzichtbaar en gemakkelijker te reinigen, maar vaste beugels zijn soms effectiever bij complexere tandstanden. Welke behandeling het beste bij u past, bespreken we tijdens het consult.',
  },
  {
    question: 'Doet een beugel pijn?',
    answer:
      'De meeste patiënten ervaren de eerste 2 tot 4 dagen na het plaatsen of aanpassen van een beugel enige druk of spanning. Dit is normaal en trekt snel weg. Bij transparante aligners is het ongemak doorgaans minder. Ernstige pijn is niet normaal — neem dan contact met ons op.',
  },
  {
    question: 'Wat kost een orthodontische behandeling?',
    answer:
      'De kosten hangen af van het type behandeling en de complexiteit van uw geval. Een vaste beugel begint vanaf €2.400, transparante aligners vanaf €3.200. Wij bieden altijd een gratis intake aan, waarbij u een exacte prijsopgave ontvangt. Gespreide betaling is mogelijk.',
  },
  {
    question: 'Hoe vaak moet ik op controle komen?',
    answer:
      'Bij een vaste beugel plannen wij doorgaans om de 6 tot 8 weken een controlesessie. Bij aligners kom je minder frequent — gemiddeld eens per 8 tot 12 weken. Alle controleafspraken zijn inbegrepen in de behandelprijs.',
  },
  {
    question: 'Hebben jullie ook avond- of zaterdagafspraken?',
    answer:
      'Ja. We begrijpen dat school en werk overdag lastig kunnen zijn. Wij bieden wekelijks avondafspraken (tot 19:00) en zaterdagse spreekuren aan. Geef uw voorkeur aan bij het inplannen van uw consult.',
  },
];
