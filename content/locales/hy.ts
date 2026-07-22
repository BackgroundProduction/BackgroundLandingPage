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
    emailCopied: "Հասցեն պատճենվեց",
  },
  hero: {
    eyebrow: "Միջոցառումների կազմակերպում // Երևան, Հայաստան",
    title: "Կերտված՝ հիշվելու համար",
    titleParts: ["Կերտված՝ ", "հիշվելու", " համար"],
    sub: "Մեկ գործընկեր։ Անսահման հնարավորություն",
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
    heading: "Մեկ թիմ։ Մնայուն փորձառություն",
    philosophy:
      "Ոչ մի բաժանում, ոչ մի փոխանցում, ոչ մի արդարացում։ Մեկ թիմ՝ ձեր իվենթի համար՝ առաջին գաղափարից մինչև վերջին լույսի մարումը։",
    paragraphs: [
      "Background Production-ը երևանյան լիարժեք ցիկլի իվենթ ընկերություն է՝ ռազմավարություն, կրեատիվ, արտադրություն, ձայն, լույս և կինո՝ մեկ տանիքի տակ։",
      "Պետական արարողություններից մինչև մայրցամաքային սպորտ՝ աշխատել ենք Հայաստանում, ԱՊՀ-ում և Եվրոպայում։ Բավական համարձակ՝ փորձելու նորը։ Բավական փորձառու՝ որ ստացվի։",
    ],
    aside: "Խոսե՞նք թվերով",
  },
  stats: [
    { value: "60+", label: "Ընդհանուր միջոցառումներ" },
    { value: "1,000,000+", label: "Ընդհանուր կենդանի լսարան մեր միջոցառումներին" },
    { value: "10+", label: "Մայրցամաքային առաջնություն" },
    { value: "20+", label: "Տարածաշրջան՝ Հայաստան · ԱՊՀ · Եվրոպա" },
  ],
  clients: [
    { name: "ՎԶԵԲ (EBRD)", logo: "/assets/logos/ebrd.svg" },
    { name: "Երևանի քաղաքապետարան", logo: "/assets/logos/yerevan-municipality.svg" },
    { name: "«Խազեր» մրցանակաբաշխություն", logo: "/assets/logos/khazer.svg" },
    { name: "Կարատեի եվրոպական ֆեդերացիա", logo: "/assets/logos/ekf.png" },
    { name: "ՀՀ կառավարություն", logo: "/assets/logos/armenia-gov.png" },
    { name: "Հրաձգության եվրոպական կոնֆեդերացիա", logo: "/assets/logos/european-shooting.png" },
    { name: "ԿԳՄՍ նախարարություն", logo: "/assets/logos/kgms-logo.png" },
    { name: "Ասիական զարգացման բանկ", logo: "/assets/logos/asian-development-bank-seeklogo.png" },
    { name: "COP17 Երևան 2026", logo: "/assets/logos/cop17-logo.png" },
    { name: "Մանկական Եվրատեսիլ", logo: "/assets/logos/junior-evrovision.png" },
    { name: "Ակբա բանկ", logo: "/assets/logos/Acba-logo.png" },
    { name: "Eleiko", logo: "/assets/logos/Eleiko_Logo_2017.svg" },
  ],
  principles: {
    eyebrow: "Ինչու հենց մենք",
    heading: "Ինչու հենց մենք",
    splitLeft: "Մենք նախագծում ենք",
    splitRight: "պահերը",
    images: [
      "/assets/moments-emblem.svg",
      "/assets/about-bg.jpg",
      "/images/portfolio/khazer.jpg",
      "/images/portfolio/junior-evrovision.jpg",
      "/images/portfolio/wheight.jpg",
      "/images/portfolio/hero-of-our-time.jpg",
      "/images/portfolio/jazz.jpg",
      "/images/portfolio/inaguration.jpg",
    ],
    items: [
      {
        title: "Պրոֆեսիոնալ",
        text: "Պետական արարողություն թե մայրցամաքային սպորտ՝ ամեն ինչ ընթանում է արարողակարգով։ Ոչինչ բաց չի թողնվում։ Ոչինչ չի ուշանում։",
      },
      {
        title: "Փորձառու",
        text: "Տարիների փորձ Հայաստանում, ԱՊՀ-ում և Եվրոպայում։ Հիմքում՝ արդյունքը, ոչ թե խոսքը։",
      },
      {
        title: "Ստեղծագործ",
        text: "Կարդում ենք բրիֆը, հետո մոռանում ակնհայտը։ Գաղափարներ, որ սրահը դեռ չի տեսել՝ մշակված այնքան, մինչև ստացվեն։",
      },
      {
        title: "Նորարար",
        text: "Ֆիզիկական, հիբրիդ թե լիովին վիրտուալ՝ ձևաչափը կառուցում ենք լսարանի շուրջ, ոչ հակառակը։",
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
          "Երաժշտություն և կինո՝ սկզբից մինչև վերջ։ Գաղափար, պարտիտուր, նկարահանում, մոնտաժ՝ կինեմատոգրաֆիկ ճշգրտությամբ։",
        image: "/assets/help-images/move-production.jpg",
      },
      {
        slug: "concerts-grand-openings",
        title: "Համերգներ և բացման արարողություններ",
        description:
          "Համերգներ, բացումներ և հոբելյաններ՝ բեմադրված որպես տեսարան։ Լույս, ձայն և հույզ՝ կատարյալ սինխրոնում։",
        image: "/assets/help-images/concert.webp",
      },
      {
        slug: "conferences-forums",
        title: "Կոնֆերանսներ և ֆորումներ",
        description:
          "Կորպորատիվ միջոցառումներ, գալաներ, կոնֆերանսներ և միջազգային ֆորումներ։ Ֆիզիկական, հիբրիդ թե վիրտուալ՝ անթերի սկզբից մինչև վերջ։",
        image: "/assets/help-images/private-events.webp",
      },
      {
        slug: "government-private-events",
        title: "Պետական և մասնավոր միջոցառումներ",
        description:
          "Պետական արարողություններ, պաշտոնական երդմնակալություններ և մասնավոր տոներ՝ զսպվածությամբ, արարողակարգով և վեհությամբ։",
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
        text: "Ձեր նպատակը, լսարանն ու բյուջեն՝ վերածված գաղափարի, որ չի մոռացվում։",
        video: "/assets/journey/step-1.mp4",
        poster: "/images/portfolio/khazer.jpg",
        youtube: null,
        youtubeStart: null,
      },
      {
        title: "Պլանավորում ենք",
        text: "Ամեն դետալ, ամեն ազդանշան, ամեն հույզ՝ պլանավորված նախապես։ Իրական աշխատանքը, որ լսարանը երբեք չի տեսնում։",
        video: "/assets/journey/step-2.mp4",
        poster: "/images/portfolio/khazer.jpg",
        youtube: null,
        youtubeStart: null,
      },
      {
        title: "Իրականացնում ենք",
        text: "Միջոցառման օրը դուք հյուր եք ձեր իսկ տոնին։ Սրահը վարում ենք մենք՝ սկզբից մինչև վերջ։",
        video: "/assets/journey/step-3.mp4",
        poster: "/images/portfolio/khazer.jpg",
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
    sub: "Գրեք, զանգահարեք կամ պարզապես պատմեք, թե ինչ եք պատկերացնում։ Մնացածը մերն է։",
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
    { label: "Facebook", href: "https://www.facebook.com/share/17nPQfMmYH/?mibextid=wwXIfr" },
    { label: "Instagram", href: "https://www.instagram.com/background.evn" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/backgroundproduction/" },
    { label: "YouTube", href: "https://www.youtube.com/@backgroundproduction1258" },
  ],
  portfolio: [
    {
      slug: "vardavar-2026",
      video: "/images/portfolio/vardavar-intro.mp4",
      youtube: null,
      youtubeStart: null,
      title: "Վարդավառ",
      category: "Քաղաքային փառատոն",
      location: "Հանրապետության հրապարակ, Երևան",
      date: "12 հուլիսի, 2026",
      image: {
        src: "/images/portfolio/placeholder.svg",
        alt: "Վարդավառ 2026 Հանրապետության հրապարակում, Երևան",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "khazer-music-awards-2025",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "«Խազեր» երաժշտական մրցանակաբաշխություն",
      category: "Երաժշտական մրցանակաբաշխություն",
      location: "Երևան, Հայաստան",
      date: "2025",
      image: {
        src: "/images/portfolio/khazer.jpg",
        alt: "«Խազեր» երաժշտական մրցանակաբաշխություն 2025",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "ebrd-2024-annual-meeting",
      video: null as string | null,
      youtube: "Ulta39yn-uw",
      youtubeStart: 11,
      title: "ՎԶԵԲ-ի տարեկան ժողով և գործարար ֆորում",
      category: "Գործարար համաժողով",
      location: "Երևան, Հայաստան",
      date: "2024",
      image: {
        src: "/images/portfolio/placeholder.svg",
        alt: "ՎԶԵԲ 2024 տարեկան ժողով և գործարար ֆորում",
        position: "center",
        isPlaceholder: false,
      },
    },
    {
      slug: "hero-of-our-times-2023",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "«Մեր ժամանակների հերոսը» մրցանակաբաշխություն",
      category: "Մրցանակաբաշխություն",
      location: "Երևան, Հայաստան",
      date: "2023",
      image: {
        src: "/images/portfolio/hero-of-our-time.jpg",
        alt: "«Մեր ժամանակների հերոսը» մրցանակաբաշխություն 2023",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "yerevan-mayor-inauguration",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "Երևանի քաղաքապետի երդմնակալության պաշտոնական արարողություն",
      category: "Պետական արարողություն",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/inaguration.jpg",
        alt: "Երևանի քաղաքապետի երդմնակալության արարողություն",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "european-karate-championships-60",
      video: "/images/portfolio/karate-portfolio.mp4",
      youtube: null,
      youtubeStart: null,
      title: "Կարատեի Եվրոպայի 60-րդ առաջնություն",
      category: "Մարզական առաջնություն",
      location: "Երևան, Հայաստան",
      date: "2025",
      image: {
        src: "/images/portfolio/placeholder.svg",
        alt: "Կարատեի Եվրոպայի 60-րդ առաջնություն, Երևան",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "international-jazz-day-concert",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "Ջազ համերգ՝ նվիրված Ջազի միջազգային օրվան",
      category: "Համերգ",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/jazz.jpg",
        alt: "Ջազի միջազգային օրվան նվիրված համերգ",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "european-weightlifting-championships",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "Ծանրամարտի Եվրոպայի առաջնություն",
      category: "Մարզական առաջնություն",
      location: "Երևան, Հայաստան",
      description:
        "Բացման արարողություն, մրցումային օրեր և ֆեդերացիայի կոնգրես։",
      image: {
        src: "/images/portfolio/wheight.jpg",
        alt: "Ծանրամարտի Եվրոպայի առաջնության բացման արարողություն",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "junior-eurovision-20th",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "«Մանկական Եվրատեսիլ» երգի մրցույթի 20-ամյակ",
      category: "Երաժշտական մրցույթ",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/junior-evrovision.jpg",
        alt: "«Մանկական Եվրատեսիլ» երգի մրցույթի 20-ամյակ",
        position: "center",
        isPlaceholder: true,
      },
    },
    {
      slug: "arthur-grigoryan-memorial-concert",
      video: null as string | null,
      youtube: null,
      youtubeStart: null,
      title: "Համերգ՝ նվիրված Արթուր Գրիգորյանի հիշատակին",
      category: "Հիշատակի համերգ",
      location: "Երևան, Հայաստան",
      image: {
        src: "/images/portfolio/artur-grigorich.jpg",
        alt: "Արթուր Գրիգորյանի հիշատակին նվիրված համերգ",
        position: "center 8%",
        isPlaceholder: true,
      },
    }
    /* temporarily hidden — uncomment to restore
    ,
        {
          slug: "altezza-opening-ceremony",
          video: null as string | null,
          youtube: null,
          youtubeStart: null,
          title: "«Ալտեցցա» բացման արարողություն",
          category: "Բացման միջոցառում",
          location: "Երևան, Հայաստան",
          image: {
            src: "/images/portfolio/placeholder.svg",
            alt: "«Ալտեցցա» բացման արարողություն",
            position: "center",
            isPlaceholder: true,
          },
        }
    */

    /* temporarily hidden — uncomment to restore
    ,
        {
          slug: "asian-regional-forum-2025",
          video: null as string | null,
          youtube: null,
          youtubeStart: null,
          title:
            "Արժութային պահուստների կառավարման ասիական տարածաշրջանային ֆորում",
          category: "Գործարար համաժողով",
          location: "Դիլիջան, Հայաստան",
          date: "Հոկտեմբերի 8–10, 2025",
          image: {
            src: "/images/portfolio/placeholder.svg",
            alt: "Ասիական տարածաշրջանային ֆորում 2025, Դիլիջան",
            position: "center",
            isPlaceholder: true,
          },
        }
    */
,
    {
      slug: "european-shooting-championship-2026",
      video: "/images/portfolio/shoting-chempionshitp.mp4",
      youtube: null,
      youtubeStart: null,
      title: "Հրաձգության Եվրոպայի առաջնություն",
      category: "Մարզական առաջնություն",
      location: "Երևան, Հայաստան",
      date: "2026",
      image: {
        src: "/images/portfolio/placeholder.svg",
        alt: "Հրաձգության Եվրոպայի առաջնություն, Երևան 2026",
        position: "center",
        isPlaceholder: true,
      },
    },
  ],
};
