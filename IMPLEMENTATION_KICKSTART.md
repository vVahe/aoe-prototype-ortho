# Orthodontiepraktijk De Boog - Implementation Plan

**Project:** Orthodontic practice website (single-page prototype)  
**Client:** Orthodontiepraktijk De Boog, Utrecht, Netherlands  
**Technology:** Next.js 16 + Tailwind CSS + shadcn/ui  
**Target:** Mobile-first (iPhone 375px) → Desktop (1080px)  
**Language:** Dutch throughout  
**Approach:** Premium, confidence-inspiring, conversion-focused — sell the outcome, not the procedure

---

## 1. Project Structure

```
aoe-prototype-ortho/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, schema
│   ├── page.tsx                # Single-page entry point
│   └── globals.css             # Design tokens, color system
├── components/
│   ├── Navbar.tsx              # Sticky navigation (desktop) - hidden on mobile
│   ├── Hero.tsx                # H1, objection-handling tagline, CTA
│   ├── TrustBar.tsx            # 4-signal trust indicators (ANO, patients, score)
│   ├── TreatmentCard.tsx       # 3x treatment cards with pricing + mini-FAQ
│   ├── BeforeAfter.tsx         # Results grid: before/after cases
│   ├── AuthorityBio.tsx        # Orthodontist credentials + testimonials
│   ├── FAQ.tsx                 # Accordion with 8 AEO-optimized questions
│   ├── LocationSection.tsx     # Address, parking, OV, hours, evening/Saturday slots
│   ├── CTASection.tsx          # Repeated CTA (hero, after treatments, bottom)
│   ├── BookingModal.tsx        # Popup modal for free consultation (mocked)
│   └── Footer.tsx              # NAP + links + contact
├── lib/
│   ├── constants.ts            # All static data (contact, hours, treatments, testimonials)
│   └── utils.ts                # Existing Tailwind utilities
├── public/
│   ├── images/
│   │   ├── hero.jpg                  # Generated: confident smile, modern setting
│   │   ├── doctor.jpg                # Generated: orthodontist portrait
│   │   ├── before-after-1.jpg        # Generated: before case 1 (teen, vaste beugel)
│   │   ├── before-after-1-after.jpg  # Generated: after case 1
│   │   ├── before-after-2.jpg        # Generated: before case 2 (adult 32, aligner)
│   │   ├── before-after-2-after.jpg  # Generated: after case 2
│   │   ├── before-after-3.jpg        # Generated: before case 3 (adult 45, beugel)
│   │   └── before-after-3-after.jpg  # Generated: after case 3
│   └── favicon.ico
└── next.config.mjs             # Next.js 16 config
```

---

## 2. Technology Stack Confirmation

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 16 (App Router) | React 19, Server Components, Turbopack, latest caching |
| **Styling** | Tailwind CSS 4 | Utility-first, mobile-first, CSS-variable-based theming |
| **Components** | shadcn/ui | Accessible, unstyled-first (customizable) |
| **Fonts** | Plus Jakarta Sans + Inter (see section 3) | Heading + body pairing, premium feel |
| **Images** | AI-generated or stock photos | Orthodontic-specific: smiles, aligners, before/after |
| **Backend** | None (prototype) | Static data in `lib/constants.ts`, mocked booking modal |
| **Schema** | JSON-LD via next/script | SEO, local business, FAQPage schema |
| **Deployment** | Vercel (ready for production) | Native Next.js 16 support |

---

## 3. Typography System

### Font Selection
- **Headings (H1–H6):** Plus Jakarta Sans Bold — geometric, modern, premium feel
- **Body copy:** Inter Regular — clean, readable, trustworthy

**Rationale:** Plus Jakarta Sans signals a premium brand (used by modern Dutch health brands) without being clinical. Inter as body ensures readability at all sizes. No serif, no script, no decorative choices.

### Type Scale (Tailwind)
```
H1: text-4xl md:text-5xl font-bold  (hero title)
H2: text-3xl md:text-4xl font-bold  (section heads)
H3: text-2xl md:text-3xl font-semibold  (card titles)
Body: text-base leading-relaxed     (16px, 1.6 line-height)
Small: text-sm                      (metadata, labels, price ranges)
```

---

## 4. Color Palette

### Design Decision
Avoid the baby blue used by every generic tandarts/orthodontist site. Use deep teal — it signals modern healthcare, trust, and premium positioning simultaneously.

### Design Tokens in `globals.css`

Tailwind CSS 4 uses CSS-first configuration — no `tailwind.config.ts` needed. All custom tokens are defined with `@theme` inside `globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #0F5F6E;      /* Deep Teal — headings, authority, trust */
  --color-secondary: #E6F4F6;    /* Soft Teal — section backgrounds, cards */
  --color-accent: #E8654A;       /* Warm Coral — CTA buttons */
  --color-neutral: #1E2A32;      /* Dark Slate — body text */
  --color-muted: #5A6A72;        /* Muted — labels, metadata */
  --color-border: #D1E8EC;       /* Subtle teal border */
  --color-surface: #FFFFFF;      /* Card / hero background */

  /* Fonts */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

These map directly to Tailwind utilities: `bg-primary`, `text-accent`, `border-border`, `font-heading`, etc. No config file needed.

### Accessibility Notes
- Body text (#1E2A32) on Soft Teal (#E6F4F6) = WCAG AA compliant ✓
- Accent coral (#E8654A) on white = WCAG AA compliant ✓
- White text on Primary teal (#0F5F6E) = WCAG AAA compliant ✓

---

## 5. Component Breakdown & Content

### 5.1 Navbar (Desktop Only, Hidden on Mobile)
**File:** `components/Navbar.tsx`

- **Visibility:** `hidden md:flex`
- **Structure:**
  - Practice logo/name (left)
  - Navigation links (center): Home, Behandelingen, Resultaten, Over ons, FAQ, Contact
  - Sticky to top, `sticky top-0 z-40`
- **Styling:**
  - Background: white with subtle bottom shadow
  - Text: primary teal (#0F5F6E)
  - Active/hover: coral accent underline
- **Functionality:** Smooth scroll to section anchors

---

### 5.2 Hero Section
**File:** `components/Hero.tsx`

- **Layout:**
  - Mobile (< 768px): Text stacked above image, full-width
  - Desktop (768px+): 50/50 side-by-side (text left, image right)
- **Content:**
  - **H1:** "De orthodontist in Utrecht voor een rechte lach, op elke leeftijd."
  - **Tagline (objection-handler):** "Of je nu 14 of 44 bent — wij behandelen kinderen én volwassenen met de modernste technieken. Inclusief transparante aligners."
  - **CTA Button:** "Plan een gratis kennismaking" → opens `BookingModal`
  - **Micro-copy below CTA:** "Geen wachtlijst · Geen verplichtingen · Antwoord binnen 24 uur"
- **Image:**
  - Path: `/images/hero.jpg`
  - Subject: confident adult with straight teeth, modern clean background — NOT a plastic model jaw
  - Alt: "Rechte tanden na orthodontische behandeling bij De Boog Utrecht"
  - Aspect ratio: 16:9 (desktop), full-width (mobile)
- **Background:** White, generous padding

---

### 5.3 Trust Bar
**File:** `components/TrustBar.tsx`

**Layout:** Horizontal 4-column grid, responsive stacking  
**Placement:** Immediately below hero — visible before first scroll

**Signals (4 items):**
1. **Certification:** "ANO-lid" + "Associatie Nederlandse Orthodontisten"
2. **Patients:** "2.400+" + "behandelde patiënten"
3. **Experience:** "12 jaar" + "gespecialiseerde orthodontie"
4. **Score:** "4.9/5" + "187 Google-recensies"

**Styling:**
- Background: soft teal (#E6F4F6)
- Numbers: Bold, primary teal (#0F5F6E)
- Labels: Muted (#5A6A72), small text
- Mobile: 2x2 grid; Desktop: 1x4

---

### 5.4 Treatment Cards (3 Cards)
**File:** `components/TreatmentCard.tsx`

**Orthodontic treatments — not generic dentistry:**

```
Card 1: Vaste Beugel
Card 2: Transparante Aligner (Invisalign-stijl)
Card 3: Volwassenen Orthodontie
```

**Each Card Layout:**
- **Icon:** Lucide icon from `constants.ts` (`Braces`, `Layers`, `UserCheck` per treatment)
- **Title (H3):** Treatment name
- **Description:** 2–3 sentences (who it's for, how it works, duration range)
- **Price indication:** "vanaf €2.400" — shown explicitly, builds trust, differentiates from competitors who hide pricing
- **Duration:** "Behandelduur: 12–24 maanden" (estimate)
- **Mini-FAQ:** 1–2 collapsible questions specific to that treatment
- **CTA:** "Gratis consult aanvragen" (opens BookingModal)

**Card Content:**

*Vaste Beugel*
- Desc: De klassieke vaste beugel voor kinderen en tieners. Nauwkeurig, bewezen effectief, en geschikt voor complexe gevallen.
- Price: vanaf €2.400
- Duration: 12–24 maanden
- Mini-FAQ:
  - "Is een vaste beugel pijnlijk?" → "De eerste dagen kun je wat spanning voelen. Na elke correctie wennen de tanden snel."
  - "Wordt dit vergoed?" → "Kinderen tot 18 jaar hebben recht op vergoeding vanuit de basisverzekering bij indicatie. Wij controleren dit voor je."

*Transparante Aligner*
- Desc: Bijna onzichtbare plastic trays die je tanden stap voor stap recht zetten. Uitneembaar, comfortabel en ideaal voor volwassenen.
- Price: vanaf €3.200
- Duration: 6–18 maanden
- Mini-FAQ:
  - "Kan ik de aligner uitdoen tijdens eten?" → "Ja, je verwijdert hem bij het eten en poetsen — dat is juist een groot voordeel."
  - "Is dit hetzelfde als Invisalign?" → "Wij werken met vergelijkbare gecertificeerde alignersystemen, inclusief Invisalign."

*Volwassenen Orthodontie*
- Desc: Het is nooit te laat voor een rechte lach. Wij behandelen dagelijks volwassenen — met een aanpak die past bij jouw leven en schema.
- Price: vanaf €2.800
- Duration: 12–30 maanden afhankelijk van behandeling
- Mini-FAQ:
  - "Kan ik als volwassene een beugel krijgen?" → "Absoluut. Ruim 30% van onze patiënten is ouder dan 18."
  - "Is het anders dan bij kinderen?" → "De techniek is hetzelfde, maar we plannen meer avond- en zaterdagafspraken voor werkende volwassenen."

**Styling:**
- White cards, subtle teal left border (4px, primary color)
- Price: Bold, primary teal, prominent
- Hover: subtle shadow lift
- Mobile: 1 column; Desktop: 3 columns

---

### 5.5 Before/After Results Section
**File:** `components/BeforeAfter.tsx`

**Purpose:** Orthodontie is a visual product. This section is the emotional closer — the patient imagines their own result.

**Layout:**
- Section H2: "Wat onze patiënten bereikten"
- Subline: "Echte behandelingen, echte resultaten."
- 3-card grid — each card shows a before/after pair

**Each Case Card:**
- Before image (left half) + After image (right half) with divider
- **Treatment label:** "Behandeling: Transparante aligner"
- **Duration:** "Behandelduur: 18 maanden"
- **Age group:** "Leeftijd patiënt: 32 jaar" (shows adults get results too)
- No patient names — privacy-appropriate

**Case mix to show:**
1. Teen, vaste beugel, 20 maanden
2. Adult (32), transparante aligner, 14 maanden
3. Adult (45), vaste beugel + retainer, 24 maanden

**Styling:**
- Section background: white
- Cards: soft teal background, rounded corners
- Before/after label: small badge overlay on image
- Mobile: 1 column stacked; Desktop: 3 columns

---

### 5.6 Authority/Bio Block
**File:** `components/AuthorityBio.tsx`

**Layout (Side-by-Side on Desktop, Stacked on Mobile)**

**Left (50%):**
- Doctor image: `/images/doctor.jpg`
- Alt: "Dr. Emma van den Berg, orthodontist in Utrecht"

**Right (50%):**
- **H2:** "Dr. Emma van den Berg, orthodontist"
- **Credentials (bullet list):**
  - ANO-lid (Associatie Nederlandse Orthodontisten)
  - Specialisatie orthodontie — ACTA Amsterdam
  - Gecertificeerd Invisalign Provider
  - 12+ jaren orthodontische ervaring
  - Behandelt kinderen én volwassenen
- **Bio paragraph (80–100 words, first person, warm):**
  "Ik ben orthodontist geworden omdat ik zie hoe een rechte lach iemands zelfvertrouwen verandert — op elke leeftijd. Bij De Boog neem ik de tijd om je situatie echt te begrijpen, voordat we samen een plan maken. Of je nu een tiener bent of net je vijftigste verjaardag hebt gevierd: iedereen verdient een behandeling die bij zijn of haar leven past."
- **Testimonials (3–4, carousel or list):**
  - "Op mijn 38ste durfde ik eindelijk te kiezen voor aligners. Dr. Van den Berg legde alles helder uit en het resultaat is precies wat ik wilde." ⭐⭐⭐⭐⭐ — *Sophie M.*
  - "Onze dochter was zenuwachtig, maar voelt zich nu helemaal op haar gemak. Na 18 maanden is het resultaat prachtig." ⭐⭐⭐⭐⭐ — *Familie Jansen*
  - "Eindelijk een orthodontist die ook avondafspraken aanbiedt. Heel fijn als je fulltime werkt." ⭐⭐⭐⭐⭐ — *Mark V.*

**Styling:**
- Background: soft teal (#E6F4F6)
- Image: rounded, subtle shadow
- Quote marks: coral accent

---

### 5.7 FAQ Accordion (8 Questions — AEO Optimized)
**File:** `components/FAQ.tsx`

**Section intro:** "Veelgestelde vragen over orthodontie" — written to be cited verbatim by AI assistants. Questions mirror exact Dutch patient search queries.

**Questions (8 total):**

1. **"Wordt een beugel vergoed door mijn zorgverzekeraar?"**
   Kinderen tot 18 jaar kunnen aanspraak maken op vergoeding vanuit de basisverzekering, mits er een orthodontische indicatie is. Volwassenen worden in de meeste gevallen niet vergoed via de basisverzekering, maar sommige aanvullende verzekeringen dekken een deel van de kosten. Wij controleren uw vergoedingsrecht gratis tijdens het eerste consult.

2. **"Kan ik als volwassene nog een beugel krijgen?"**
   Ja, absoluut. Er is geen leeftijdsgrens voor orthodontische behandeling. Meer dan 30% van onze patiënten is ouder dan 18 jaar. Zowel vaste beugels als transparante aligners zijn uitstekend geschikt voor volwassenen, en het resultaat is vergelijkbaar met behandelingen bij jongeren.

3. **"Hoe lang duurt een orthodontische behandeling?"**
   De behandelduur varieert per persoon en per type behandeling. Een gemiddelde vaste beugel bij jongeren duurt 18 tot 24 maanden. Transparante aligners voor volwassenen duren vaak 6 tot 18 maanden. Tijdens het kennismakingsgesprek geven wij een persoonlijke tijdsindicatie.

4. **"Wat is het verschil tussen Invisalign en een vaste beugel?"**
   Een vaste beugel bestaat uit brackets die aan de tanden zijn bevestigd en verbonden zijn met een draad. Invisalign (en vergelijkbare systemen) maakt gebruik van uitneembare doorzichtige trays. Aligners zijn bijna onzichtbaar en gemakkelijker te reinigen, maar vaste beugels zijn soms effectiever bij complexere tandstanden. Welke behandeling het beste bij u past, bespreken we tijdens het consult.

5. **"Doet een beugel pijn?"**
   De meeste patiënten ervaren de eerste 2 tot 4 dagen na het plaatsen of aanpassen van een beugel enige druk of spanning. Dit is normaal en trekt snel weg. Bij transparante aligners is het ongemak doorgaans minder. Ernstige pijn is niet normaal — neem dan contact met ons op.

6. **"Wat kost een orthodontische behandeling?"**
   De kosten hangen af van het type behandeling en de complexiteit van uw geval. Een vaste beugel begint vanaf €2.400, transparante aligners vanaf €3.200. Wij bieden altijd een gratis intake aan, waarbij u een exacte prijsopgave ontvangt. Gespreide betaling is mogelijk.

7. **"Hoe vaak moet ik op controle komen?"**
   Bij een vaste beugel plannen wij doorgaans om de 6 tot 8 weken een controlesessie. Bij aligners kom je minder frequent — gemiddeld eens per 8 tot 12 weken. Alle controleafspraken zijn inbegrepen in de behandelprijs.

8. **"Hebben jullie ook avond- of zaterdagafspraken?"**
   Ja. We begrijpen dat school en werk overdag lastig kunnen zijn. Wij bieden wekelijks avondafspraken (tot 19:00) en zaterdagse spreekuren aan. Geef uw voorkeur aan bij het inplannen van uw consult.

**Component Details:**
- shadcn `Accordion` component
- Mobile: Full-width accordion, collapsed by default
- Desktop: Same layout (accordion works on all sizes)
- Smooth animation, `ChevronDown` rotation on open

**Styling:**
- White cards on soft teal section background
- Question: font-semibold
- Answer: `leading-relaxed`, text-base, 3–5 sentences each (citeable)

---

### 5.8 Location & Accessibility Section
**File:** `components/LocationSection.tsx`

**Purpose:** Dutch patients always check logistics. Working adults and parents need to know about parking, OV, and flexible hours before they commit.

**Layout:** 2-column on desktop (info left, visual map placeholder right), stacked on mobile

**Content:**
- **H2:** "Makkelijk te bereiken in Utrecht"
- **Address:** Leidseweg 12, 3531 BG Utrecht
- **Parking:** "Gratis parkeren voor de deur (P-schijf 2 uur) · Betaald parkeren P+R Transferium op 5 min loopafstand"
- **Public transport:** "5 minuten lopen van Bushalte Leidseweg (lijn 2, 12) · 10 minuten fietsen van Utrecht Centraal"
- **Opening hours:**
  - Ma–Vr: 08:00–19:00 (avondafspraken beschikbaar)
  - Zaterdag: 09:00–14:00
  - Zondag: Gesloten
- **Highlight badge:** "Avond- en zaterdagafspraken beschikbaar" (prominent, calls out the differentiator)

**Right column:** Static map placeholder image OR a clean illustrated location card — no Google Maps embed

**Styling:**
- Background: white
- Hours table: clean grid, teal highlights for evening/Saturday slots
- Badge: coral accent background, white text

---

### 5.9 CTA Section (Repeated)
**File:** `components/CTASection.tsx`

**Placement (3 appearances):**
1. Inside `Hero.tsx` — the primary CTA button (not a separate CTASection instance)
2. Below Treatment Cards — standalone `CTASection` instance (mid-page decision point)
3. Above Footer — standalone `CTASection` instance (final conversion opportunity)

**Content:**
- **H2:** "Klaar voor een rechte lach?"
- **Large Coral Button:** "Plan een gratis kennismaking"
- **Subtext:** "Geen verplichtingen · Antwoord binnen 24 uur · Ook avond- en zaterdagafspraken"

**Styling:**
- Center-aligned, full-width container
- Button: `text-lg`, coral accent (#E8654A), white text, generous padding
- Hover: slightly darker coral, subtle scale

---

### 5.10 Booking Modal
**File:** `components/BookingModal.tsx`

**Trigger:** "Plan een gratis kennismaking" button throughout page

**Modal Title:** "Plan uw gratis kennismaking"

**Fields:**
1. Naam (text input)
2. Telefoonnummer (tel input)
3. Behandeling interesse (dropdown: Vaste beugel / Transparante aligner / Volwassenen orthodontie / Weet ik nog niet)

**Behavior:**
- Modal overlay with backdrop blur
- Mobile: Full-height scrollable; Desktop: center dialog
- Validation: Name and phone required
- Success: "Bedankt! We nemen binnen 24 uur contact op om uw afspraak te bevestigen." + close button
- No backend: logs to console + success state

---

### 5.11 Footer
**File:** `components/Footer.tsx`

**NAP Block:**
- **Name:** Orthodontiepraktijk De Boog
- **Address:** Leidseweg 12, 3531 BG Utrecht
- **Phone:** +31-30-000-0000 (placeholder)
- **Email:** info@orthodeboog.nl (placeholder)

**3 Columns (Desktop), Stacked (Mobile):**

1. **Contact:**
   - Phone (`tel:` link)
   - Email (`mailto:` link)
   - Address
   - Hours: "Ma–Vr 8:00–19:00, Za 9:00–14:00"

2. **Behandelingen:**
   - Vaste Beugel
   - Transparante Aligner
   - Volwassenen Orthodontie
   - Retainers & Nazorg

3. **Informatie:**
   - ANO-lidmaatschap
   - Vergoedingen & Verzekeringen
   - Privacy Policy
   - Contact

**Bottom Bar:**
- "© 2026 Orthodontiepraktijk De Boog · ANO-gecertificeerd"
- Optional social icons: Instagram (orthodontie is visual), Facebook, Google Reviews

**Styling:**
- Background: Primary teal (#0F5F6E)
- Text: White
- Links: Coral accent on hover

---

## 6. Data Structure (Mocking)

**File:** `lib/constants.ts`

```typescript
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
    ],
  },
};

export const TREATMENTS = [
  {
    id: 'vaste-beugel',
    icon: 'Braces',
    title: 'Vaste Beugel',
    description: 'De klassieke vaste beugel voor kinderen en tieners. Nauwkeurig, bewezen effectief, en geschikt voor complexe gevallen.',
    priceFrom: '€2.400',
    duration: '12–24 maanden',
    targetAudience: 'Kinderen & tieners',
    faq: [
      { q: 'Is een vaste beugel pijnlijk?', a: 'De eerste dagen voel je wat spanning. Dit trekt snel weg.' },
      { q: 'Wordt dit vergoed?', a: 'Kinderen tot 18 jaar kunnen aanspraak maken op vergoeding bij indicatie. Wij controleren dit gratis.' },
    ],
  },
  {
    id: 'transparante-aligner',
    icon: 'Layers',
    title: 'Transparante Aligner',
    description: 'Bijna onzichtbare plastic trays die je tanden stap voor stap recht zetten. Uitneembaar, comfortabel en ideaal voor volwassenen.',
    priceFrom: '€3.200',
    duration: '6–18 maanden',
    targetAudience: 'Volwassenen & tieners',
    faq: [
      { q: 'Kan ik de aligner uitdoen tijdens eten?', a: 'Ja, je verwijdert hem bij het eten en poetsen — dat is een groot voordeel.' },
      { q: 'Is dit hetzelfde als Invisalign?', a: 'Wij werken met gecertificeerde alignersystemen, inclusief Invisalign.' },
    ],
  },
  {
    id: 'volwassenen-orthodontie',
    icon: 'UserCheck',
    title: 'Volwassenen Orthodontie',
    description: 'Het is nooit te laat voor een rechte lach. Wij behandelen dagelijks volwassenen — met een aanpak die past bij jouw leven en schema.',
    priceFrom: '€2.800',
    duration: '12–30 maanden',
    targetAudience: 'Volwassenen 18+',
    faq: [
      { q: 'Kan ik als volwassene een beugel krijgen?', a: 'Absoluut. Meer dan 30% van onze patiënten is ouder dan 18.' },
      { q: 'Zijn er avondafspraken?', a: 'Ja, wij bieden wekelijks avond- en zaterdagafspraken aan.' },
    ],
  },
];

export const BEFORE_AFTER_CASES = [
  {
    id: 'case-1',
    treatment: 'Vaste beugel',
    duration: '20 maanden',
    age: 'Patiënt: 15 jaar',
    beforeImage: '/images/before-after-1.jpg',
    afterImage: '/images/before-after-1-after.jpg',
  },
  {
    id: 'case-2',
    treatment: 'Transparante aligner',
    duration: '14 maanden',
    age: 'Patiënt: 32 jaar',
    beforeImage: '/images/before-after-2.jpg',
    afterImage: '/images/before-after-2-after.jpg',
  },
  {
    id: 'case-3',
    treatment: 'Vaste beugel & retainer',
    duration: '24 maanden',
    age: 'Patiënt: 45 jaar',
    beforeImage: '/images/before-after-3.jpg',
    afterImage: '/images/before-after-3-after.jpg',
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
    answer: 'Kinderen tot 18 jaar kunnen aanspraak maken op vergoeding vanuit de basisverzekering, mits er een orthodontische indicatie is. Volwassenen worden in de meeste gevallen niet vergoed via de basisverzekering, maar sommige aanvullende verzekeringen dekken een deel van de kosten. Wij controleren uw vergoedingsrecht gratis tijdens het eerste consult.',
  },
  {
    question: 'Kan ik als volwassene nog een beugel krijgen?',
    answer: 'Ja, absoluut. Er is geen leeftijdsgrens voor orthodontische behandeling. Meer dan 30% van onze patiënten is ouder dan 18 jaar. Zowel vaste beugels als transparante aligners zijn uitstekend geschikt voor volwassenen, en het resultaat is vergelijkbaar met behandelingen bij jongeren.',
  },
  {
    question: 'Hoe lang duurt een orthodontische behandeling?',
    answer: 'De behandelduur varieert per persoon en per type behandeling. Een gemiddelde vaste beugel bij jongeren duurt 18 tot 24 maanden. Transparante aligners voor volwassenen duren vaak 6 tot 18 maanden. Tijdens het kennismakingsgesprek geven wij een persoonlijke tijdsindicatie.',
  },
  {
    question: 'Wat is het verschil tussen Invisalign en een vaste beugel?',
    answer: 'Een vaste beugel bestaat uit brackets die aan de tanden zijn bevestigd en verbonden zijn met een draad. Invisalign (en vergelijkbare systemen) maakt gebruik van uitneembare doorzichtige trays. Aligners zijn bijna onzichtbaar en gemakkelijker te reinigen, maar vaste beugels zijn soms effectiever bij complexere tandstanden. Welke behandeling het beste bij u past, bespreken we tijdens het consult.',
  },
  {
    question: 'Doet een beugel pijn?',
    answer: 'De meeste patiënten ervaren de eerste 2 tot 4 dagen na het plaatsen of aanpassen van een beugel enige druk of spanning. Dit is normaal en trekt snel weg. Bij transparante aligners is het ongemak doorgaans minder. Ernstige pijn is niet normaal — neem dan contact met ons op.',
  },
  {
    question: 'Wat kost een orthodontische behandeling?',
    answer: 'De kosten hangen af van het type behandeling en de complexiteit van uw geval. Een vaste beugel begint vanaf €2.400, transparante aligners vanaf €3.200. Wij bieden altijd een gratis intake aan, waarbij u een exacte prijsopgave ontvangt. Gespreide betaling is mogelijk.',
  },
  {
    question: 'Hoe vaak moet ik op controle komen?',
    answer: 'Bij een vaste beugel plannen wij doorgaans om de 6 tot 8 weken een controlesessie. Bij aligners kom je minder frequent — gemiddeld eens per 8 tot 12 weken. Alle controleafspraken zijn inbegrepen in de behandelprijs.',
  },
  {
    question: 'Hebben jullie ook avond- of zaterdagafspraken?',
    answer: 'Ja. We begrijpen dat school en werk overdag lastig kunnen zijn. Wij bieden wekelijks avondafspraken (tot 19:00) en zaterdagse spreekuren aan. Geef uw voorkeur aan bij het inplannen van uw consult.',
  },
];
```

---

## 7. Schema Markup (JSON-LD via next/script)

**File:** `app/layout.tsx`

```typescript
const schemaMarkup = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalBusiness',
      name: 'Orthodontiepraktijk De Boog',
      medicalSpecialty: 'Orthodontics',
      description: 'Orthodontist in Utrecht voor kinderen en volwassenen. Vaste beugel, transparante aligners, volwassenen orthodontie.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Leidseweg 12',
        addressLocality: 'Utrecht',
        postalCode: '3531 BG',
        addressCountry: 'NL',
      },
      telephone: '+31-30-000-0000',
      openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-14:00'],
      priceRange: '€€',
    },
    {
      '@type': 'LocalBusiness',
      name: 'Orthodontiepraktijk De Boog',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '187',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_QUESTIONS.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    },
  ],
};
```

---

## 8. Metadata & SEO

**File:** `app/layout.tsx`

```typescript
export const metadata = {
  title: 'Orthodontist in Utrecht | De Boog — Beugel & Aligners',
  description:
    'Orthodontist in Utrecht voor kinderen én volwassenen. Vaste beugel vanaf €2.400, transparante aligners vanaf €3.200. ANO-gecertificeerd. Gratis kennismaking.',
  keywords: 'orthodontist Utrecht, beugel Utrecht, Invisalign Utrecht, transparante aligner, volwassenen orthodontie',
  og: {
    title: 'Orthodontist in Utrecht | De Boog',
    description: 'Rechte tanden op elke leeftijd. Gratis kennismaking.',
    image: '/images/hero.jpg',
  },
};
```

---

## 9. Mobile Responsiveness Strategy

### Breakpoints (Tailwind)
- **Mobile (0–767px):** iPhone SE (375px), standard width
- **Tablet (768–1023px):** iPad, intermediate
- **Desktop (1024px+):** 1080px target

### Key Responsive Changes

| Component | Mobile | Desktop |
|-----------|--------|---------|
| **Navbar** | Hidden | Sticky, flex |
| **CTA Button** | Fixed bottom sticky bar | Inside hero section |
| **Hero** | Text above image, full-width | 50/50 grid |
| **Trust Bar** | 2x2 grid | 1x4 grid |
| **Treatment Cards** | 1 column | 3 columns |
| **Before/After** | 1 column stacked | 3 columns |
| **Bio Section** | Stacked (image top) | Side-by-side |
| **Location** | Stacked | 2 columns |
| **Footer** | 1 column | 3 columns |

### Mobile CTA Bar (Replaces Navbar)
- **Position:** Fixed bottom, mobile only
- **Content:** Practice name (left) + "Gratis kennismaking" button (right)
- **Background:** Coral accent (#E8654A)
- **Sticky:** `bottom-0 z-50`

---

## 10. Image Generation Plan

**8 images to generate:**

1. **Hero (`/public/images/hero.jpg`)**
   - Prompt: "Confident adult with a natural, straight smile, modern clean background, warm lifestyle photography, no visible dental equipment, soft natural lighting — NOT a plastic dental model"
   - Size: 1920x1080

2. **Doctor (`/public/images/doctor.jpg`)**
   - Prompt: "Professional portrait of female orthodontist, white coat, friendly warm smile, confident, approachable, modern clinic background, headshot"
   - Size: 600x600

3–8. **Before/After Cases (3 pairs — separate before and after files):**
   Each case needs 2 images: one before, one after. Component renders them side-by-side.
   - `before-after-1.jpg` / `before-after-1-after.jpg` — teen patient, crowded teeth before, straight after
   - `before-after-2.jpg` / `before-after-2-after.jpg` — adult (32), mild misalignment before, aligned after
   - `before-after-3.jpg` / `before-after-3-after.jpg` — adult (45), spacing gaps before, corrected after
   - Each prompt: "Close-up natural smile, clean bright photography, professional clinical result — not cartoon or illustration"
   - Size: 400x300 per image

---

## 11. Page Section Order

The one-page layout flows in this order to guide the patient from awareness to conversion:

```
1. Navbar (desktop only, sticky)
2. Hero — H1 + objection-handling tagline + CTA
3. Trust Bar — ANO, patients, years, score
4. Treatment Cards — 3 treatments with pricing
5. CTA Section (repeat 1)
6. Before/After Results — visual proof
7. Authority Bio — Dr. Van den Berg + testimonials
8. FAQ Accordion — 8 AEO-optimized questions
9. CTA Section (repeat 2)
10. Location & Accessibility — hours, parking, OV
11. Footer
12. Mobile sticky CTA bar (fixed, bottom)
```

---

## 12. Implementation Sequence (Step-by-Step)

### Phase 1: Foundation
1. Create `lib/constants.ts` with all static data
2. Update `app/layout.tsx` with metadata, fonts, schema
3. Update `globals.css` with `@import "tailwindcss"` and `@theme` design tokens (no `tailwind.config.ts` needed — Tailwind 4 is CSS-first)

### Phase 2: Static Components
5. Build `Footer.tsx`
6. Build `Navbar.tsx` (desktop-only)
7. Build `TrustBar.tsx`
8. Build `LocationSection.tsx`

### Phase 3: Core Conversion Components
9. Build `TreatmentCard.tsx` (3 cards, pricing displayed)
10. Build `BeforeAfter.tsx` (3-case grid)
11. Build `CTASection.tsx`

### Phase 4: Interactive Components
12. Build `BookingModal.tsx` (gratis kennismaking form)
13. Build `FAQ.tsx` (8 AEO-optimized questions)

### Phase 5: Complex Sections
14. Build `AuthorityBio.tsx` (orthodontist bio + testimonials)
15. Build `Hero.tsx` (responsive, CTA trigger)

### Phase 6: Integration & Polish
16. Build `page.tsx` (assemble all components in order)
17. Source images (AI-generated or stock) and place in `/public/images/`
18. Test mobile (375px) & desktop (1080px)
19. Verify contrast & accessibility (WCAG AA)
20. Deploy & iterate

---

## 13. Assumptions & Constraints

✅ **Confirmed:**
- Next.js 16 (App Router, React 19)
- Tailwind CSS 4 (CSS-first config via `@theme` in `globals.css`, no `tailwind.config.ts`)
- Typography: Plus Jakarta Sans (headings) + Inter (body), loaded via `next/font/google`
- Color palette: deep teal, soft teal, white, dark slate, coral — defined as CSS variables
- Mobile-first: 375px → 1080px
- Prototype (no real backend, mocked booking)
- Dutch language throughout
- Schema markup via `next/script`
- Pricing displayed — "vanaf €2.400" per treatment (deliberate differentiator)
- ANO certification prominently featured
- Adults explicitly included in hero and treatments
- Evening + Saturday availability highlighted
- Before/after section included (visual product)
- Sticky CTA bar on mobile replaces navbar

⚠️ **Constraints:**
- No authentication
- No database
- No payment processing
- No email sending (form logs to console)
- Booking modal: mocked success state
- Before/after images: generated placeholders

---

## 14. Success Criteria

- [ ] Hero H1 positions as orthodontist in Utrecht explicitly
- [ ] Hero tagline addresses adult patients directly (objection handled)
- [ ] CTA reads "Plan een gratis kennismaking" — not generic "contact"
- [ ] Trust bar visible above fold with ANO certification
- [ ] 3 orthodontic treatment cards displayed (vaste beugel / aligner / volwassenen)
- [ ] Pricing shown on each treatment card ("vanaf €X")
- [ ] Before/after section shows 3 cases including 2 adult patients
- [ ] Doctor bio includes ANO + Invisalign credentials
- [ ] FAQ accordion with 8 questions covering insurance, adult eligibility, duration, Invisalign vs beugel, pain, cost, frequency, evening hours
- [ ] Location section includes parking, OV, and evening/Saturday callout
- [ ] CTA repeated 3× (hero, mid-page, above footer)
- [ ] Booking modal has 3 fields: naam, telefoonnummer, behandeling interesse (dropdown)
- [ ] Footer NAP correct, orthodontic treatments listed
- [ ] Schema markup: MedicalBusiness with `Orthodontics` specialty
- [ ] Mobile sticky bar visible, CTA accessible on thumb
- [ ] WCAG AA contrast maintained
- [ ] Page loads < 2s on 4G mobile
- [ ] All text in Dutch

---

## 15. Post-Implementation Handoff

Once prototype is complete:
1. Replace placeholder contact details in `lib/constants.ts`
2. Swap generated images with real clinical photos
3. Update testimonials with real patient quotes (first names only)
4. Replace before/after placeholders with real case photography
5. Connect booking modal to Calendly iframe or booking API
6. Confirm ANO membership details are accurate
7. Deploy to Vercel for production

---

**Status:** ✅ Ready for implementation approval  
**Next Step:** User approves plan, then Claude Code begins implementation (Phase 1 onward)
