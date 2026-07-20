export const en = {
  meta: {
    title: "Background Production — Event Production & Management",
    description:
      "Professional music & movie producing, corporate events, dinner galas, concerts, grand openings, conferences, forums, private and government events. Physical, hybrid, and virtual.",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
  ui: {
    startProject: "Start a project",
    seeWork: "See the work",
    sound: "Sound",
    soundOn: "on",
    soundOff: "off",
    // reviewer note: keep only the arrow
    dragSideways: "→",
    trustedFor: "Trusted for",
    menu: "Menu",
    studio: "Studio",
    follow: "Follow",
    showreelLabel: "Showreel — video coming soon",
    photoLabel: "Production still — photography coming",
    stepLabel: "Step",
    skipToContent: "Skip to content",
    clientStories: "Real client stories",
  },
  hero: {
    eyebrow: "Event production — Yerevan, Armenia",
    title: "We produce top events that move people and make days special",
    // headline split for the serif-italic accent word (pre · accent · post)
    titleParts: ["We produce top events that ", "move people", " and make days special"],
    sub: "Background Production plans and produces corporate events, concerts, dinner galas, grand openings, conferences and government ceremonies across Armenia, the CIS and Europe",
    // stage-manager cue lines for the hero boot sequence
    cues: ["CUE 01 — SOUND CHECK ✓", "CUE 02 — LIGHTS ✓", "CUE 03 — DOORS OPEN ✓", "SHOWTIME"],
    // phase labels for the self-drawing venue rig
    rig: {
      design: "01 DESIGN",
      rigging: "02 RIGGING",
      sound: "03 SOUND",
      lights: "04 LIGHTS",
      live: "LIVE",
    },
    // HUD chips over the interactive 3D venue
    hud: {
      drag: "Drag to orbit",
      location: "40.18°N — 44.51°E · Yerevan",
      scroll: "Scroll",
      figure: "fig. 01 — the venue, live",
    },
  },
  about: {
    eyebrow: "Who we are",
    heading: "Everything you don't see is our job",
    philosophy:
      "Every event we run starts with months of careful groundwork and ends up as a story. People remember your brand, and they remember the day",
    paragraphs: [
      "Background Production is an Armenia-based, full-service firm specializing in music and film production, event planning, and project management, operating locally and across the CIS and Europe",
      "From dinner galas and grand openings to government ceremonies and continental championships, we deliver stress-free experiences built on proven expertise and reputation",
    ],
    aside: "Should we talk numbers?",
  },
  stats: [
    { value: "13+", label: "Landmark events produced" },
    { value: "1,000,000+", label: "Total live audience across our events" },
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
  principles: {
    eyebrow: "Why choose us",
    heading: "Why choose us",
    // split statement for the expanding-image reveal (left ▪ image ▪ right).
    // The centre square flips through `images` as you scroll while it scales
    // to full-bleed — swap/extend these with real event photos (10+ reads best;
    // the first frame is the emblem shown at rest).
    splitLeft: "We make",
    splitRight: "moments",
    images: [
      "/assets/moments-emblem.svg",
      "/images/portfolio/placeholder-concert.svg",
      "/images/portfolio/ebrd.jpg",
      "/images/portfolio/placeholder-ceremony.svg",
      "/assets/about-bg.jpg",
      "/images/portfolio/placeholder-conference.svg",
      "/images/portfolio/placeholder-sports.svg",
      "/images/portfolio/placeholder-corporate.svg",
      "/images/portfolio/placeholder-awards.svg",
      "/images/portfolio/ebrd.jpg",
    ],
    items: [
      {
        title: "Professional",
        text: "From government ceremonies to continental sport, everything runs to protocol. Nothing gets missed, nothing runs late",
      },
      {
        title: "Creative",
        text: "We read the brief, then forget the obvious. We pitch ideas the room hasn't seen, and work them until they actually land",
      },
      {
        title: "Innovative",
        text: "Physical, hybrid, or fully virtual — we pick the format around the audience, not the other way around",
      },
      {
        title: "Experienced",
        text: "Years of production across Armenia, the CIS and Europe. Backed by track record, not talk",
      },
    ],
  },
  work: {
    eyebrow: "Selected work",
    heading: "We made all this special",
  },
  marquee: [
    "Corporate Events",
    "Concerts",
    "Government Ceremonies",
    "Championships",
    "International Forums",
    "Grand Openings",
    "Dinner Galas",
    "Music & Film Production",
  ],
  /* Success stories — stacked column rows. `slug` must match a portfolio
     entry (image/title come from there). `video`: set a path (e.g.
     "/assets/stories/ebrd.mp4") to show a looping video instead of the image.
     NOTE: `badge` + `result` lines are editorial placeholders — replace with
     your verified figures (attendance, countries, broadcast reach). */
  success: {
    eyebrow: "Success stories",
    heading: "How do we create masterpieces?",
    items: [
      {
        slug: "ebrd-2024-annual-meeting",
        badge: "2024",
        result: "Armenia’s largest international business gathering of the year",
        detail:
          "The EBRD Annual Meeting & Business Forum brought delegations from across the Bank’s regions to Yerevan — produced end to end.",
        video: null as string | null,
        youtube: "t_RVnYgDibo" as string | null,
        youtubeStart: null as number | null,
      },
      {
        slug: "junior-eurovision-20th",
        badge: "20th edition",
        result: "A pan-European broadcast moment",
        detail:
          "The 20th anniversary of the Junior Eurovision Song Contest, staged for an international television audience.",
        video: null as string | null,
        youtube: "3JSdLgAoyAs" as string | null,
        youtubeStart: 4573 as number | null,
      },
      {
        slug: "european-weightlifting-championships",
        badge: "3 events in 1",
        result: "A full continental championship cycle",
        detail:
          "Opening ceremony, every competition day and the Federation Congress — one production, zero missed cues.",
        video: null as string | null,
        youtube: "FwqsGl5hMpg" as string | null,
        youtubeStart: 26 as number | null,
      },
      {
        slug: "khazer-music-awards-2025",
        badge: "Live broadcast",
        result: "The national music scene on one stage",
        detail:
          "The “Khazer” Armenian Music Awards — ceremony, show and broadcast treated as one continuous piece.",
        video: null as string | null,
        youtube: "h0aPl0RB6YE" as string | null,
        youtubeStart: null as number | null,
      },
      {
        slug: "european-karate-championships-60",
        badge: "60th edition",
        result: "A continental anniversary opened in Yerevan",
        detail:
          "The opening ceremony of the 60th European Karate Senior Championships — a jubilee edition staged for the whole continent.",
        video: null as string | null,
        youtube: "EYruedH2xEk" as string | null,
        youtubeStart: 291 as number | null,
      },
      {
        slug: "european-shooting-championship-2026",
        badge: "2026",
        result: "Europe’s marksmen on Armenian ground",
        detail:
          "The European Shooting Championships in Yerevan — precision sport delivered with broadcast-grade production.",
        video: null as string | null,
        youtube: "9_u4uPG9qko" as string | null,
        youtubeStart: 57 as number | null,
      },
    ],
  },
  /* Client testimonials shown beside the services list. PLACEHOLDER quotes —
     replace `quote`, `author`, `role` with real client statements you are
     authorised to publish. */
  testimonials: [
    {
      quote:
        "Background handled a continental championship as if it were routine — every ceremony, every broadcast cue, flawless. They carry the pressure so you don't feel it.",
      author: "Federation Partner",
      role: "Sports Championship, Yerevan",
    },
    {
      quote:
        "They translated a vague brief into a room nobody wanted to leave. Details we'd never have thought of were already handled before we asked.",
      author: "Corporate Client",
      role: "Business Forum, Yerevan",
    },
    {
      quote:
        "From concept to the final broadcast, it was one seamless production. Professional, calm, and genuinely creative — exactly the partner a high-stakes event needs.",
      author: "Broadcast Partner",
      role: "Music Awards, Yerevan",
    },
  ],
  services: {
    eyebrow: "What we can help with",
    heading: "Every stage, every scale",
    /* `image`: shown in the right-hand panel on hover. Swap these paths for
       real photography/video posters per service when you have them. */
    items: [
      {
        slug: "music-film-production",
        title: "Music & Film Production",
        description:
          "Professional music and movie producing — from concept and score to final cut, crafted with cinematic precision.",
        image: "/images/portfolio/placeholder-concert.svg",
      },
      {
        slug: "concerts-grand-openings",
        title: "Concerts & Grand Openings",
        description:
          "Concerts, grand openings and anniversaries staged as unforgettable spectacles — lighting, sound and emotion in perfect sync.",
        image: "/images/portfolio/placeholder-ceremony.svg",
      },
      {
        slug: "conferences-forums",
        title: "Conferences & Forums",
        description:
          "Corporate events, dinner galas, conferences and international forums — physical, hybrid and virtual — executed flawlessly end to end.",
        image: "/images/portfolio/ebrd.jpg",
      },
      {
        slug: "government-private-events",
        title: "Government & Private Events",
        description:
          "State ceremonies, official inaugurations and private celebrations handled with discretion, protocol and grandeur.",
        image: "/images/portfolio/placeholder-corporate.svg",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    bigTitle: "3 Steps to Quality",
    heading: "Three steps between a brief and a memory",
    /* `video`: drop your clip at the path (e.g. "/assets/journey/step-1.mp4")
       and it plays in the sticky media panel. `poster` shows until the video
       loads (or if the file isn't there yet). */
    steps: [
      {
        title: "We Listen",
        text: "We start with your goals, your audience and your budget, and turn them into an idea worth remembering",
        video: "/assets/journey/step-1.mp4",
        poster: "/images/portfolio/ebrd.jpg",
        youtube: null as string | null,
        youtubeStart: null as number | null,
      },
      {
        title: "We Plan",
        text: "Every detail, every step, every emotion mapped out in advance. This is the real work the audience never sees",
        // Pexels video 18069235 (Pexels license — free commercial use)
        video: "/assets/journey/step-2.mp4",
        poster: "/images/portfolio/ebrd.jpg",
        youtube: null as string | null,
        youtubeStart: null as number | null,
      },
      {
        title: "We Deliver",
        text: "On the day of the event, you're a guest at your own celebration. We run the room, start to finish, stress-free",
        video: "/assets/journey/step-3.mp4",
        poster: "/images/portfolio/ebrd.jpg",
        youtube: null as string | null,
        youtubeStart: null as number | null,
      },
    ],
  },
  faq: {
    eyebrow: "FAQs",
    heading: "What to know before we begin",
    moreTitle: "Got more questions?",
    moreText: "Tell us about your event.",
    bookCall: "Book a call",
    items: [
      {
        q: "What kinds of events do you produce?",
        a: "We plan corporate events, dinner galas, concerts, grand openings, anniversaries, conferences, international forums, sports championships, private and government events, plus music and film production",
      },
      {
        q: "Do you work outside Armenia?",
        a: "Yes. We operate across Armenia, the CIS and Europe, and have delivered continental-scale events end to end",
      },
      {
        q: "Can an event be hybrid or virtual?",
        a: "Yes, we deliver everything — physical, hybrid, or fully virtual. We build the format around your audience and your goals",
      },
      {
        q: "How do we start?",
        a: "Write to info@background.am or call +374 55 605070. Tell us about the occasion and we'll take it from there",
      },
    ],
  },
  contactSection: {
    eyebrow: "Contact",
    heading: "Your best event hasn't happened yet",
    sub: "Write, call, or just tell us what you're thinking and let's nail it!",
  },
  footer: {
    blurb: "Full-service event production — physical, hybrid and virtual.",
  },
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
  portfolio: [
    {
      slug: "european-shooting-championship-2026",
      title: "European Shooting Championship",
      category: "Sports Championship",
      location: "Yerevan, Armenia",
      date: "2026",
      image: {
        src: "/images/portfolio/placeholder-sports.svg",
        alt: "European Shooting Championship, Yerevan 2026",
        isPlaceholder: true,
      },
    },
    {
      slug: "asian-regional-forum-2025",
      title:
        "Asian Regional Forum on Investment Management of Foreign Exchange Reserves",
      category: "Business Conference",
      location: "Dilijan, Armenia",
      date: "October 8–10, 2025",
      image: {
        src: "/images/portfolio/placeholder-conference.svg",
        alt: "Asian Regional Forum 2025 in Dilijan",
        isPlaceholder: true,
      },
    },
    {
      slug: "european-karate-championships-60",
      title: "60th European Karate Senior Championships",
      category: "Sports Championship",
      location: "Yerevan, Armenia",
      date: "2025",
      image: {
        src: "/images/portfolio/placeholder-sports.svg",
        alt: "60th European Karate Senior Championships in Yerevan",
        isPlaceholder: true,
      },
    },
    {
      slug: "khazer-music-awards-2025",
      title: "“Khazer” Armenian Music Awards",
      category: "Music Awards",
      location: "Yerevan, Armenia",
      date: "2025",
      image: {
        src: "/images/portfolio/placeholder-awards.svg",
        alt: "Khazer Armenian Music Awards 2025 ceremony",
        isPlaceholder: true,
      },
    },
    {
      slug: "ebrd-2024-annual-meeting",
      title: "EBRD Annual Meeting and Business Forum",
      category: "Business Conference",
      location: "Yerevan, Armenia",
      date: "2024",
      image: {
        src: "/images/portfolio/ebrd.jpg",
        alt: "EBRD 2024 Annual Meeting and Business Forum",
        isPlaceholder: false,
      },
    },
    {
      slug: "hero-of-our-times-2023",
      title: "“The Hero of Our Times” Awards",
      category: "Awards Ceremony",
      location: "Yerevan, Armenia",
      date: "2023",
      image: {
        src: "/images/portfolio/placeholder-awards.svg",
        alt: "The Hero of Our Times awards ceremony 2023",
        isPlaceholder: true,
      },
    },
    {
      slug: "yerevan-mayor-inauguration",
      title: "Official Inauguration Ceremony of the Mayor of Yerevan",
      category: "Government Ceremony",
      location: "Yerevan, Armenia",
      image: {
        src: "/images/portfolio/placeholder-ceremony.svg",
        alt: "Official inauguration ceremony of the new mayor of Yerevan",
        isPlaceholder: true,
      },
    },
    {
      slug: "international-jazz-day-concert",
      title: "Jazz Concert for International Jazz Day",
      category: "Music Concert",
      location: "Yerevan, Armenia",
      image: {
        src: "/images/portfolio/placeholder-concert.svg",
        alt: "Jazz concert dedicated to International Jazz Day",
        isPlaceholder: true,
      },
    },
    {
      slug: "european-weightlifting-championships",
      title: "European Weightlifting Championships",
      category: "Sports Championship",
      location: "Yerevan, Armenia",
      description:
        "Opening ceremony, competition days and the Federation Congress.",
      image: {
        src: "/images/portfolio/placeholder-sports.svg",
        alt: "European Weightlifting Championships opening ceremony",
        isPlaceholder: true,
      },
    },
    {
      slug: "junior-eurovision-20th",
      title: "20th Anniversary of “Junior Eurovision” Song Contest",
      category: "Music Competition",
      location: "Yerevan, Armenia",
      image: {
        src: "/images/portfolio/placeholder-concert.svg",
        alt: "20th anniversary of Junior Eurovision song contest",
        isPlaceholder: true,
      },
    },
    {
      slug: "arthur-grigoryan-memorial-concert",
      title: "Concert in Memory of Arthur Grigoryan",
      category: "Memorial Concert",
      location: "Yerevan, Armenia",
      image: {
        src: "/images/portfolio/placeholder-concert.svg",
        alt: "Memorial concert dedicated to Arthur Grigoryan",
        isPlaceholder: true,
      },
    },
    {
      slug: "altezza-opening-ceremony",
      title: "Altezza Opening Ceremony",
      category: "Opening Event",
      location: "Yerevan, Armenia",
      image: {
        src: "/images/portfolio/placeholder-ceremony.svg",
        alt: "Altezza opening ceremony",
        isPlaceholder: true,
      },
    },
    {
      slug: "gyumri-beer-factory-pavilion",
      title: "Gyumri Beer Factory Pavilion",
      category: "Corporate Event",
      location: "Gyumri, Armenia",
      image: {
        src: "/images/portfolio/placeholder-corporate.svg",
        alt: "Setup of Gyumri beer factory pavilion",
        isPlaceholder: true,
      },
    },
  ],
};

export type Content = typeof en;
