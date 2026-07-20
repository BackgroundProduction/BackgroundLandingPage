import type { Content } from "./en";

/* Armenian (default locale). Translations of our own site copy  review and
   adjust tone freely; structure must mirror en.ts exactly. */
export const hy: Content = {
  meta: {
    title: "Բեքգրաունդ Փրոդաքշն  Միջոցառումների կազմակերպում և արտադրություն",
    description:
      "Երաժշտության և կինոյի արտադրություն, կորպորատիվ միջոցառումներ, գալա ընթրիքներ, համերգներ, բացման արարողություններ, կոնֆերանսներ, ֆորումներ, մասնավոր և պետական միջոցառումներ՝ ֆիզիկական, հիբրիդ և վիրտուալ ձևաչափերով։",
  },
  nav: [
    { label: "Մեր մասին", href: "#about" },
    { label: "Աշխատանքներ", href: "#work" },
    { label: "Գործընթաց", href: "#process" },
    { label: "Ծառայություններ", href: "#services" },
    { label: "Կապ", href: "#contact" },
  ],
  ui: {
    startProject: "Սկսել հիմա",
    seeWork: "Մեր աշխատանքները",
    sound: "Ձայն",
    soundOn: "միացված",
    soundOff: "անջատված",
    // reviewer note: keep only the arrow
    dragSideways: "→",
    trustedFor: "Մեզ վստահել են",
    menu: "Մենյու",
    studio: "Ստուդիա",
    follow: "Հետևեք",
    showreelLabel: "Շոուրիլ  տեսանյութը շուտով",
    stepLabel: "Քայլ",
    skipToContent: "Անցնել բովանդակությանը",
    clientStories: "Կարծիքներ հաճախորդներից",
  },
  hero: {
    eyebrow: "Միջոցառումների կազմակերպում  Երևան, Հայաստան",
    title: "Այստեղ են ստեղծվում թոփ միջոցառումները",
    titleParts: ["Այստեղ են ստեղծվում ", "թոփ միջոցառումները", ""],
    sub: "Background Production-ը ունի տարիների փորձ ոլորտում և կազմակերպում է միջոցառումներ Հայաստանում, ԱՊՀ երկրներում և Եվրոպայում",
    cues: ["ՔՅՈՒ 01  ՁԱՅՆ ✓", "ՔՅՈՒ 02  ԼՈՒՅՍԵՐ ✓", "ՔՅՈՒ 03  ԴՌՆԵՐԸ ԲԱՑ ԵՆ ✓", "ՍԿԻԶԲ"],
    rig: {
      design: "01 ՆԱԽԱԳԻԾ",
      rigging: "02 ՄՈՆՏԱԺ",
      sound: "03 ՁԱՅՆ",
      lights: "04 ԼՈՒՅՍԵՐ",
      live: "ՈՒՂԻՂ",
    },
    hud: {
      drag: "Քաշեք՝ պտտելու համար",
      location: "40.18°N  44.51°E · Երևան",
      scroll: "Ներքև",
      figure: "նկ. 01  բեմը ուղիղ եթերում",
    },
  },
  about: {
    eyebrow: "Մեր մասին",
    heading: "Այն, ինչ չեք տեսնում, հենց մենք ենք անում",
    philosophy:
      "Ամեն միջոցառում մեզ մոտ սկսվում է ամիսների մանրակրկիտ աշխատանքից ու դառնում պատմություն։ Մարդիկ հիշում են Ձեր բրենդն ու օրը",
    paragraphs: [
      "Background Production-ը Հայաստանում թոփ միջոցառումներ կազմակերպող ընկերություն է՝ մասնավոր և պետական մակարդակի իվենթներից մինչև պրոդյուսավորում և կինոարտադրություն",
      "Մենք աշխատում ենք Հայաստանում, ԱՊՀ երկրներում և Եվրոպայում։ Սկսելով ձեր կարիքներից՝ մենք օգնում ենք ստեղծել այն, ինչ համապատասխանում է ձեր նպատակին, թիրախին, բյուջեին ու բրենդին",
    ],
    aside: "Խոսե՞նք թվերով",
  },
  stats: [
    { value: "13+", label: "Խոշոր միջոցառում" },
    { value: "1,000,000+", label: "Ընդհանուր կենդանի լսարան մեր միջոցառումներին" },
    { value: "3", label: "Մայրցամաքային առաջնություն" },
    { value: "3", label: "Տարածաշրջան՝ Հայաստան · ԱՊՀ · Եվրոպա" },
  ],
  clients: [
    { name: "ՎԶԵԲ (EBRD)", logo: "/assets/logos/ebrd.svg" },
    { name: "Երևանի քաղաքապետարան", logo: "/assets/logos/yerevan-municipality.svg" },
    { name: "«Խազեր» մրցանակաբաշխություն", logo: "/assets/logos/khazer.svg" },
    { name: "Կարատեի եվրոպական ֆեդերացիա", logo: "/assets/logos/ekf.png" },
    { name: "ՀՀ կառավարություն", logo: "/assets/logos/armenia-gov.png" },
    { name: "Հրաձգության եվրոպական կոնֆեդերացիա", logo: "/assets/logos/european-shooting.jpeg" },
  ],
  principles: {
    eyebrow: "Ինչու հենց մենք",
    heading: "Ինչու հենց մենք",
    splitLeft: "Մենք ձեր",
    splitRight: "մասին ենք",
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
        title: "Պրոֆեսիոնալ",
        text: "Մեզ հետ դետալները չեն կորում։ Պետական միջոցառումներից մինչև միջազգային սպորտային իվենթներ, մենք ամեն ինչ անում ենք բարձր մակարդակով",
      },
      {
        title: "Փորձառու",
        text: "Ունենք տարիների փորձ ոլորտում և աշխատել ենք խոշորագույն բրենդների հետ Հայաստանում, ԱՊՀ-ում ու Եվրոպայում",
      },
      {
        title: "Ստեղծագործ",
        text: "Մենք վաղուց մոռացել ենք հասարակի ու կրկնվողի մասին։ Մենք շուկա ենք բերում ստեղծարար գաղափարներ, որոնք աշխատում են ու զարմացնում",
      },
      {
        title: "Նորարար",
        text: "Մենք ներկայում ենք, որ ձեր միջոցառումները տարբերվեն նորարարությամբ ու ռազմավարությամբ",
      },
    ],
  },
  work: {
    eyebrow: "Ընտրված աշխատանքներ",
    heading: "Հենց մենք էինք այս իվենթների ետևում",
  },
  marquee: [
    "Կորպորատիվ միջոցառումներ",
    "Համերգներ",
    "Պետական արարողություններ",
    "Առաջնություններ",
    "Միջազգային ֆորումներ",
    "Բացման արարողություններ",
    "Գալա ընթրիքներ",
    "Երաժշտության և կինոյի արտադրություն",
  ],
  success: {
    eyebrow: "Մեր պատմությունը",
    heading: "Ինչպե՞ս ենք հնարավոր դարձնում անհնարինը",
    items: [
      {
        slug: "ebrd-2024-annual-meeting",
        badge: "2024",
        result: "Տարվա ամենամեծ միջազգային գործարար հավաքը Հայաստանում",
        detail:
          "ՎԶԵԲ-ի տարեկան ժողովն ու գործարար ֆորումը Երևան բերեցին պատվիրակություններ բանկի բոլոր տարածաշրջաններից՝ կազմակերպված սկզբից մինչև վերջ։",
        video: null,
        youtube: "t_RVnYgDibo",
        youtubeStart: null,
      },
      {
        slug: "junior-eurovision-20th",
        badge: "20-րդ թողարկում",
        result: "Համաեվրոպական հեռարձակման պահ",
        detail:
          "«Մանկական Եվրատեսիլ» երգի մրցույթի 20-ամյակը՝ բեմադրված միջազգային հեռուստալսարանի համար։",
        video: null,
        youtube: "3JSdLgAoyAs",
        youtubeStart: 4573,
      },
      {
        slug: "european-weightlifting-championships",
        badge: "3 միջոցառում՝ 1-ում",
        result: "Մայրցամաքային առաջնության ամբողջական ցիկլ",
        detail:
          "Բացման արարողություն, մրցումային բոլոր օրերը և ֆեդերացիայի կոնգրեսը՝ մեկ արտադրություն, զրո վրիպում։",
        video: null,
        youtube: "FwqsGl5hMpg",
        youtubeStart: 26,
      },
      {
        slug: "khazer-music-awards-2025",
        badge: "Ուղիղ եթեր",
        result: "Ազգային երաժշտական դաշտը մեկ բեմի վրա",
        detail:
          "«Խազեր» երաժշտական մրցանակաբաշխությունը՝ արարողություն, շոու և հեռարձակում որպես մեկ ամբողջություն։",
        video: null,
        youtube: "h0aPl0RB6YE",
        youtubeStart: null,
      },
      {
        slug: "european-karate-championships-60",
        badge: "60-րդ առաջնություն",
        result: "Մայրցամաքային հոբելյանը բացվեց Երևանում",
        detail:
          "Կարատեի Եվրոպայի 60-րդ առաջնության բացման արարողությունը՝ հոբելյանական միջոցառում ամբողջ մայրցամաքի համար։",
        video: null,
        youtube: "EYruedH2xEk",
        youtubeStart: 291,
      },
      {
        slug: "european-shooting-championship-2026",
        badge: "2026",
        result: "Եվրոպայի հրաձիգները հայկական հողի վրա",
        detail:
          "Հրաձգության Եվրոպայի առաջնությունը Երևանում՝ ճշգրտության սպորտ՝ հեռարձակման մակարդակի արտադրությամբ։",
        video: null,
        youtube: "9_u4uPG9qko",
        youtubeStart: 57,
      },
    ],
  },
  /* PLACEHOLDER հաճախորդների մեջբերումներ  փոխարինեք իրական, հրապարակելու
     թույլտվությամբ մեջբերումներով։ */
  testimonials: [
    {
      quote:
        "Բեքգրաունդը մայրցամաքային առաջնությունը վարեց այնպես, կարծես ամենօրյա գործ լիներ՝ ամեն արարողություն, ամեն եթերային ազդանշան՝ անթերի։ Ճնշումը վերցնում են իրենց վրա, որ դու չզգաս։",
      author: "Ֆեդերացիայի գործընկեր",
      role: "Մարզական առաջնություն, Երևան",
    },
    {
      quote:
        "Անորոշ բրիֆը վերածեցին սրահի, որից ոչ ոք չէր ուզում հեռանալ։ Դետալներ, որոնց մասին մենք չէինք էլ մտածի, արդեն արված էին, նախքան կհարցնեինք։",
      author: "Կորպորատիվ հաճախորդ",
      role: "Գործարար ֆորում, Երևան",
    },
    {
      quote:
        "Գաղափարից մինչև վերջնական հեռարձակում՝ մեկ ամբողջական արտադրություն։ Պրոֆեսիոնալ, հանգիստ և իսկապես ստեղծագործ՝ հենց այն գործընկերը, որ պետք է կարևոր միջոցառմանը։",
      author: "Հեռարձակման գործընկեր",
      role: "Երաժշտական մրցանակաբաշխություն, Երևան",
    },
  ],
  services: {
    eyebrow: "Մեր ծառայությունները",
    heading: "Ցանկացած բեմ, ցանկացած մասշտաբ",
    items: [
      {
        slug: "music-film-production",
        title: "Երաժշտության և կինոյի արտադրություն",
        description:
          "Պրոֆեսիոնալ երաժշտական և կինոարտադրություն՝ գաղափարից ու պարտիտուրայից մինչև վերջնական մոնտաժ՝ կինեմատոգրաֆիկ ճշգրտությամբ։",
        image: "/assets/help-images/move-production.jpg",
      },
      {
        slug: "concerts-grand-openings",
        title: "Համերգներ և բացման արարողություններ",
        description:
          "Համերգներ, բացումներ և հոբելյաններ՝ բեմադրված որպես անմոռանալի տեսարաններ. լույս, ձայն և հույզ՝ կատարյալ համաժամանակության մեջ։",
        image: "/assets/help-images/concert.webp",
      },
      {
        slug: "conferences-forums",
        title: "Կոնֆերանսներ և ֆորումներ",
        description:
          "Կորպորատիվ միջոցառումներ, գալա ընթրիքներ, կոնֆերանսներ և միջազգային ֆորումներ՝ ֆիզիկական, հիբրիդ և վիրտուալ, կատարված անթերի՝ սկզբից մինչև վերջ։",
        image: "/assets/help-images/private-events.webp",
      },
      {
        slug: "government-private-events",
        title: "Պետական և մասնավոր միջոցառումներ",
        description:
          "Պետական արարողություններ, պաշտոնական երդմնակալություններ և մասնավոր տոնակատարություններ՝ զսպվածությամբ, արարողակարգով և վեհությամբ։",
        image: "/assets/help-images/goverment-private.webp",
      },
    ],
  },
  process: {
    eyebrow: "Ինչպես է աշխատում",
    bigTitle: "Որակ 3 քայլով",
    heading: "Երեք քայլ բրիֆից մինչև հիշողություն",
    steps: [
      {
        title: "Լսում ենք",
        text: "Սկսում ենք ձեր նպատակից, լսարանից ու բյուջեից, դրանք վերածում ենք ռազմավարության, հետո միջոցառման, որը չի մոռացվում",
        video: "/assets/journey/step-1.mp4",
        poster: "/images/portfolio/ebrd.jpg",
        youtube: null,
        youtubeStart: null,
      },
      {
        title: "Պլանավորում ենք",
        text: "Դուք դիմում եք, մենք անում ենք ամեն ինչ ձեր փոխարեն՝ հաշվի առնելով բոլոր դետալները",
        video: "/assets/journey/step-2.mp4",
        poster: "/images/portfolio/ebrd.jpg",
        youtube: null,
        youtubeStart: null,
      },
      {
        title: "Իրականացնում ենք",
        text: "Միջոցառման օրը դուք կլինեք հյուր ձեր իսկ տոնին, որովհետև ամեն ինչ պլանավորված է",
        video: "/assets/journey/step-3.mp4",
        poster: "/images/portfolio/ebrd.jpg",
        youtube: null,
        youtubeStart: null,
      },
    ],
  },
  faq: {
    eyebrow: "Հաճախ տրվող հարցեր",
    heading: "Ինչ իմանալ մինչ սկսելը",
    moreTitle: "Ունե՞ք հարցեր",
    moreText: "Դիմեք մեզ հիմա",
    bookCall: "Ամրագրել զանգ",
    items: [
      {
        q: "Ի՞նչ միջոցառումներ եք կազմակերպում",
        a: "Կորպորատիվ միջոցառումներ, գալա ընթրիքներ, համերգներ, բացման արարողություններ, հոբելյաններ, կոնֆերանսներ, միջազգային ֆորումներ, մարզական առաջնություններ, մասնավոր և պետական միջոցառումներ, ինչպես նաև երաժշտության և կինոյի արտադրություն",
      },
      {
        q: "Գործու՞մ եք Հայաստանից դուրս",
        a: "Այո, մենք աշխատում ենք Հայաստանում, ԱՊՀ տարածաշրջանում և Եվրոպայում, և ունենք մայրցամաքային մասշտաբի միջոցառումների փորձ",
      },
      {
        q: "Կազմակերպու՞մ եք հիբրիդային կամ վիրտուալ միջոցառումներ",
        a: "Մենք առաջարկում ենք բոլոր երեք ձևաչափերը՝ ֆիզիկական, հիբրիդ և վիրտուալ։ Ձևաչափը կառուցում ենք ձեր լսարանի և նպատակների շուրջ",
      },
      {
        q: "Ինչպե՞ս դիմել",
        a: "Կապվեք մեզ հետ info@background.am էլ. հասցեով կամ զանգահարեք +374 55 605070։ Պատմեք Ձեր նպատակի մասին, մնացածը կանենք մենք",
      },
    ],
  },
  contactSection: {
    eyebrow: "Կապ",
    heading: "Հաջորդը ձեր մասին են խոսելու",
    sub: "Կապվեք հիմա, պատմեք միջոցառման մասին, մնացածը կանենք մենք",
  },
  footer: {
    blurb: "Միջոցառումների ամբողջական արտադրություն՝ ֆիզիկական, հիբրիդ և վիրտուալ։",
  },
  contact: {
    email: "info@background.am",
    emailHref: "mailto:info@background.am",
    phone: "+374 55 605070",
    phoneHref: "tel:+37455605070",
    location: "Երևան, Հայաստան",
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
      title: "Հրաձգության Եվրոպայի առաջնություն",
      category: "Մարզական առաջնություն",
      location: "Երևան, Հայաստան",
      date: "2026",
      image: {
        src: "/images/portfolio/placeholder-sports.svg",
        alt: "Հրաձգության Եվրոպայի առաջնություն, Երևան 2026",
        isPlaceholder: true,
      },
    },
    {
      slug: "asian-regional-forum-2025",
      title:
        "Արժութային պահուստների կառավարման ասիական տարածաշրջանային ֆորում",
      category: "Գործարար համաժողով",
      location: "Դիլիջան, Հայաստան",
      date: "Հոկտեմբերի 8–10, 2025",
      image: {
        src: "/images/portfolio/placeholder-conference.svg",
        alt: "Ասիական տարածաշրջանային ֆորում 2025, Դիլիջան",
        isPlaceholder: true,
      },
    },
    {
      slug: "european-karate-championships-60",
      title: "Կարատեի Եվրոպայի 60-րդ առաջնություն",
      category: "Մարզական առաջնություն",
      location: "Երևան, Հայաստան",
      date: "2025",
      image: {
        src: "/images/portfolio/placeholder-sports.svg",
        alt: "Կարատեի Եվրոպայի 60-րդ առաջնություն, Երևան",
        isPlaceholder: true,
      },
    },
    {
      slug: "khazer-music-awards-2025",
      title: "«Խազեր» երաժշտական մրցանակաբաշխություն",
      category: "Երաժշտական մրցանակաբաշխություն",
      location: "Երևան, Հայաստան",
      date: "2025",
      image: {
        src: "/images/portfolio/placeholder-awards.svg",
        alt: "«Խազեր» երաժշտական մրցանակաբաշխություն 2025",
        isPlaceholder: true,
      },
    },
    {
      slug: "ebrd-2024-annual-meeting",
      title: "ՎԶԵԲ-ի տարեկան ժողով և գործարար ֆորում",
      category: "Գործարար համաժողով",
      location: "Երևան, Հայաստան",
      date: "2024",
      image: {
        src: "/images/portfolio/ebrd.jpg",
        alt: "ՎԶԵԲ 2024 տարեկան ժողով և գործարար ֆորում",
        isPlaceholder: false,
      },
    },
    {
      slug: "hero-of-our-times-2023",
      title: "«Մեր ժամանակների հերոսը» մրցանակաբաշխություն",
      category: "Մրցանակաբաշխություն",
      location: "Երևան, Հայաստան",
      date: "2023",
      image: {
        src: "/images/portfolio/placeholder-awards.svg",
        alt: "«Մեր ժամանակների հերոսը» մրցանակաբաշխություն 2023",
        isPlaceholder: true,
      },
    },
    {
      slug: "yerevan-mayor-inauguration",
      title: "Երևանի քաղաքապետի երդմնակալության պաշտոնական արարողություն",
      category: "Պետական արարողություն",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/placeholder-ceremony.svg",
        alt: "Երևանի քաղաքապետի երդմնակալության արարողություն",
        isPlaceholder: true,
      },
    },
    {
      slug: "international-jazz-day-concert",
      title: "Ջազ համերգ՝ նվիրված Ջազի միջազգային օրվան",
      category: "Համերգ",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/placeholder-concert.svg",
        alt: "Ջազի միջազգային օրվան նվիրված համերգ",
        isPlaceholder: true,
      },
    },
    {
      slug: "european-weightlifting-championships",
      title: "Ծանրամարտի Եվրոպայի առաջնություն",
      category: "Մարզական առաջնություն",
      location: "Երևան, Հայաստան",
      description:
        "Բացման արարողություն, մրցումային օրեր և ֆեդերացիայի կոնգրես։",
      image: {
        src: "/images/portfolio/placeholder-sports.svg",
        alt: "Ծանրամարտի Եվրոպայի առաջնության բացման արարողություն",
        isPlaceholder: true,
      },
    },
    {
      slug: "junior-eurovision-20th",
      title: "«Մանկական Եվրատեսիլ» երգի մրցույթի 20-ամյակ",
      category: "Երաժշտական մրցույթ",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/placeholder-concert.svg",
        alt: "«Մանկական Եվրատեսիլ» երգի մրցույթի 20-ամյակ",
        isPlaceholder: true,
      },
    },
    {
      slug: "arthur-grigoryan-memorial-concert",
      title: "Համերգ՝ նվիրված Արթուր Գրիգորյանի հիշատակին",
      category: "Հիշատակի համերգ",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/placeholder-concert.svg",
        alt: "Արթուր Գրիգորյանի հիշատակին նվիրված համերգ",
        isPlaceholder: true,
      },
    },
    {
      slug: "altezza-opening-ceremony",
      title: "«Ալտեցցա» բացման արարողություն",
      category: "Բացման միջոցառում",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/placeholder-ceremony.svg",
        alt: "«Ալտեցցա» բացման արարողություն",
        isPlaceholder: true,
      },
    },
    {
      slug: "gyumri-beer-factory-pavilion",
      title: "Գյումրու գարեջրի գործարանի տաղավար",
      category: "Կորպորատիվ միջոցառում",
      location: "Գյումրի, Հայաստան",
      image: {
        src: "/images/portfolio/placeholder-corporate.svg",
        alt: "Գյումրու գարեջրի գործարանի տաղավարի կառուցում",
        isPlaceholder: true,
      },
    },
  ],
};
