export const site = {
  name: "Background Production",
  tagline: "We are Professional Creative Innovative Experienced",
  taglineWords: ["Professional", "Creative", "Innovative", "Experienced"],
  description:
    "Professional music & movie producing, big projects, corporate events, dinner galas, concerts, grand openings, anniversaries, conferences, forums, private and government events. Physical, hybrid, and virtual events.",
  philosophy: `Event planning is all about the behind scene "magic". It's about tiny details and logistics and emotions that should be carefully thought and mapped out to create a memorable experience.`,
  vision:
    "Create events that are unique, distinctive, impressive, stupendous, one of a kind.",
  about: {
    paragraphs: [
      "Background Production is an Armenia-based, full-service firm specializing in music and film production, event planning, and project management — operating locally and across the CIS and European regions.",
      "We are process-driven, idea-oriented and results focused. We listen to the customer and translate their offer into mind-blowing ideas — committed to take each project through from start to finish while keeping the vision, goals, budget and client's needs in mind.",
      "From dinner galas and grand openings to government ceremonies and continental championships, we deliver stress-free experiences built on proven expertise and reputation.",
    ],
    aside: "We love details!",
  },
  /* derived from the portfolio — keep in sync with content/portfolio.ts */
  stats: [
    { value: "13+", label: "Landmark events produced" },
    { value: "3", label: "Continental championships staged" },
    { value: "3", label: "Regions — Armenia · CIS · Europe" },
  ],
  clients: [
    "EBRD",
    "Junior Eurovision",
    "Yerevan Municipality",
    "Khazer Music Awards",
    "European Karate Federation",
    "Altezza",
    "Gyumri Beer Factory",
  ],
  principles: [
    {
      title: "Professional",
      text: "Protocol-grade delivery, from government ceremonies to continental sport. No detail unowned, no deadline missed.",
    },
    {
      title: "Creative",
      text: "We translate a brief into ideas the room has never seen before — then engineer them until they work.",
    },
    {
      title: "Innovative",
      text: "Physical, hybrid or fully virtual — we build the format around the audience, not the other way round.",
    },
    {
      title: "Experienced",
      text: "Years of productions across Armenia, the CIS and Europe, carried by reputation rather than promises.",
    },
  ],
  process: [
    {
      title: "Listen & translate",
      text: "We start with your goals, audience and budget — and translate them into a concept worth remembering.",
    },
    {
      title: "Design & plan",
      text: "Every tiny detail, logistic and emotion is mapped out in advance. This is the behind-scene magic.",
    },
    {
      title: "Produce & deliver",
      text: "On show day you are a guest at your own event. We run the room, end to end, stress-free.",
    },
  ],
  faqs: [
    {
      q: "What kinds of events do you produce?",
      a: "Corporate events, dinner galas, concerts, grand openings, anniversaries, conferences, international forums, sports championships, private and government events — plus music and film production.",
    },
    {
      q: "Do you work outside Armenia?",
      a: "Yes. We operate locally and across the CIS and European regions, and have produced continental-scale events end to end.",
    },
    {
      q: "Can an event be hybrid or virtual?",
      a: "All three formats — physical, hybrid and virtual. We design the format around your audience and goals.",
    },
    {
      q: "How do we start?",
      a: "Write to info@background.am or call +374 55 605070. Tell us the occasion, the date and the ambition — we take it from there.",
    },
  ],
  contact: {
    email: "info@background.am",
    emailHref: "mailto:info@background.am",
    phone: "+374 55 605070",
    phoneHref: "tel:+37455605070",
    location: "Yerevan, Armenia",
  },
  social: [
    { label: "Facebook", href: "https://www.facebook.com/backgroundproduction" },
    { label: "Instagram", href: "https://www.instagram.com/background.production" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/background-production" },
    { label: "YouTube", href: "https://www.youtube.com/@backgroundproduction" },
  ],
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
} as const;
