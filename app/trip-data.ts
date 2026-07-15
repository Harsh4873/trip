export type EventKind =
  | "drive"
  | "food"
  | "stay"
  | "explore"
  | "rest"
  | "alert";

export type ScheduleEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  kind: EventKind;
  duration?: string;
  note?: string;
  href?: string;
  linkLabel?: string;
  mode?: "relaxed" | "falls";
};

export type TripDay = {
  id: string;
  date: string;
  weekday: string;
  shortDate: string;
  kicker: string;
  title: string;
  from: string;
  to: string;
  miles: string;
  wheelTime: string;
  realTime: string;
  lodging: string;
  timezone: string;
  summary: string;
  advisory?: string;
  events: ScheduleEvent[];
};

export const tripDays: TripDay[] = [
  {
    id: "aug-08",
    date: "August 8, 2026",
    weekday: "Saturday",
    shortDate: "08",
    kicker: "Launch day",
    title: "Home to Lubbock",
    from: "Home",
    to: "Hampton Inn · Lubbock, TX",
    miles: "510 mi",
    wheelTime: "8 hr",
    realTime: "≈ 9 hr 15 min with stops",
    lodging: "Hampton Inn · Lubbock",
    timezone: "Central Time",
    summary:
      "A clean first day: leave early, trade drivers before anyone feels tired, and arrive with enough energy for a proper vegetarian dinner.",
    advisory:
      "The reservation only says “Hampton Inn Lubbock.” Confirm the exact property and save its address offline before departure.",
    events: [
      {
        id: "0808-depart",
        time: "7:00 AM · suggested",
        title: "Pack the car and roll",
        detail:
          "Start with a full tank, downloaded route, cold water, and the first driver already chosen.",
        kind: "drive",
      },
      {
        id: "0808-reset-1",
        time: "+ 2 hours",
        title: "15-minute driver reset",
        detail:
          "Restroom, stretch, windshield check, and swap drivers if possible. This is a reset—not a rushed fuel-only stop.",
        kind: "rest",
        duration: "15 min",
      },
      {
        id: "0808-lunch",
        time: "+ 4 hr 15 min",
        title: "Vegetarian road lunch",
        detail:
          "Use a packed lunch or a route-dependent stop; keep 45 minutes so the final stretch does not feel compressed.",
        kind: "food",
        duration: "45 min",
      },
      {
        id: "0808-reset-2",
        time: "+ 6 hr 30 min",
        title: "Fuel + short walk",
        detail:
          "Top up before Lubbock and take a full lap around the stop. Fatigue usually shows up before the driver notices it.",
        kind: "rest",
        duration: "15 min",
      },
      {
        id: "0808-checkin",
        time: "≈ 4:15 PM",
        title: "Hampton Inn check-in",
        detail:
          "Unload only the overnight bags. Refill the cooler and stage tomorrow’s Taos layers before dinner.",
        kind: "stay",
      },
      {
        id: "0808-dinner",
        time: "6:00 PM",
        title: "India Palace dinner",
        detail:
          "Order from the vegetarian side: channa pindiwala, navrattan korma, vegetable samosa, or aloo paratha. Ask about ghee if needed.",
        kind: "food",
        href: "https://indiapalacelubbocktx.com/",
        linkLabel: "Official hours",
      },
    ],
  },
  {
    id: "aug-09",
    date: "August 9, 2026",
    weekday: "Sunday",
    shortDate: "09",
    kicker: "Into the high desert",
    title: "Lubbock to Taos",
    from: "Hampton Inn · Lubbock",
    to: "Dreamcatcher · Taos",
    miles: "353 mi",
    wheelTime: "6 hr",
    realTime: "≈ 7 hr with stops · arrive 1 clock-hour earlier",
    lodging: "Dreamcatcher B&B · Taos",
    timezone: "Central → Mountain · gain 1 hour",
    summary:
      "The spreadsheet’s six hours stays intact. Two short stops make it a seven-hour travel block, while the Mountain Time change gives an hour back on the clock.",
    advisory:
      "Taos sits at 6,969 feet. Keep the first evening light, hydrate steadily, and save strenuous walking for after a good night’s sleep.",
    events: [
      {
        id: "0809-depart",
        time: "8:00 AM CDT",
        title: "Depart Lubbock",
        detail:
          "Carry a real vegetarian road meal so limited Sunday options on the route cannot delay arrival.",
        kind: "drive",
      },
      {
        id: "0809-stops",
        time: "En route",
        title: "Two reset stops",
        detail:
          "Budget a combined 60 minutes for fuel, restroom, food, and a driver swap.",
        kind: "rest",
        duration: "60 min total",
      },
      {
        id: "0809-church",
        time: "2:10 PM MDT",
        title: "San Francisco de Asís",
        detail:
          "A short, low-effort first look at Taos on the south approach. The church is normally open daily from 10 AM to 4 PM.",
        kind: "explore",
        duration: "35 min",
        href: "https://taos.org/places/san-francisco-de-asis-church/",
        linkLabel: "Visitor details",
      },
      {
        id: "0809-checkin",
        time: "3:00 PM",
        title: "Dreamcatcher check-in + altitude pause",
        detail:
          "Unpack, drink water, and take a full two-hour reset before dinner. The property uses self check-in instructions.",
        kind: "stay",
        href: "https://dreambb.com/plan-your-visit/",
        linkLabel: "Arrival details",
      },
      {
        id: "0809-dinner",
        time: "5:30 PM",
        title: "The Pour House · Indian dinner",
        detail:
          "Best Taos Indian-first pick: masala dosa, chole curry, dal tadka, paneer butter masala, or gobi Manchurian.",
        kind: "food",
        note: "Reserve ahead.",
        href: "https://www.taospourhouse.com/menu.html",
        linkLabel: "See menu",
      },
      {
        id: "0809-plaza",
        time: "7:00 PM",
        title: "Easy Taos Plaza loop",
        detail:
          "A short orientation walk only. Turn back early if anyone has a headache, nausea, or unusual fatigue.",
        kind: "explore",
        duration: "30–45 min",
      },
    ],
  },
  {
    id: "aug-10",
    date: "August 10, 2026",
    weekday: "Monday",
    shortDate: "10",
    kicker: "Pueblo + gorge",
    title: "A full Taos day",
    from: "Dreamcatcher · Taos",
    to: "Dreamcatcher · Taos",
    miles: "Stay",
    wheelTime: "No transfer",
    realTime: "Morning outdoors · afternoon rest",
    lodging: "Dreamcatcher B&B · Taos",
    timezone: "Mountain Time",
    summary:
      "Put the Pueblo, gorge, and Earthship visit before the afternoon monsoon window, then protect a real rest block before dinner.",
    advisory:
      "Taos Pueblo can close for ceremonies or community needs with little notice. Verify the official site 48–72 hours ahead and again that morning.",
    events: [
      {
        id: "0810-breakfast",
        time: "8:30 AM",
        title: "Vegetarian breakfast at Dreamcatcher",
        detail:
          "The B&B explicitly accommodates vegetarian and vegan diets—notify the hosts before the trip.",
        kind: "food",
        href: "https://dreambb.com/breakfast/",
        linkLabel: "Breakfast details",
      },
      {
        id: "0810-pueblo",
        time: "9:30 AM",
        title: "Taos Pueblo",
        detail:
          "Allow two hours. Published visitor hours are 9 AM–4 PM and adult admission is currently $25; respect all photography restrictions.",
        kind: "explore",
        duration: "2 hr",
        note: "Verify before leaving the B&B.",
        href: "https://taospueblo.com/visiting-taos-pueblo/",
        linkLabel: "Official visitor info",
      },
      {
        id: "0810-gorge",
        time: "11:50 AM",
        title: "Rio Grande Gorge Bridge",
        detail:
          "Use the overlooks and only a short portion of the West Rim Trail. Leave exposed ground if thunder builds.",
        kind: "explore",
        duration: "40 min",
        href: "https://taos.org/explore/landmarks/gorge-bridge/",
        linkLabel: "Landmark guide",
      },
      {
        id: "0810-earthship",
        time: "12:40 PM",
        title: "Earthship visitor center",
        detail:
          "Do the self-guided visit before lunch. Published summer hours conflict across sources, so confirm directly before the trip.",
        kind: "explore",
        duration: "60 min",
        href: "https://earthship.com/visit/",
        linkLabel: "Confirm visit",
      },
      {
        id: "0810-lunch",
        time: "1:55 PM",
        title: "Farmhouse Café lunch",
        detail:
          "Go beyond a side salad: house veggie-nut burger, portabella burger, vegan curried squash pie, mushroom shepherd’s pie, or garden stir-fry.",
        kind: "food",
        duration: "50 min",
        note: "Kitchen closes at 3 PM.",
        href: "https://www.farmhousetaos.com/menu",
        linkLabel: "Official menu",
      },
      {
        id: "0810-rest",
        time: "3:15 PM",
        title: "Protected hotel reset",
        detail:
          "Hydrate, shower, charge devices, and let any afternoon storm pass. Harwood and Fechin House are both closed today.",
        kind: "rest",
        duration: "2 hr",
      },
      {
        id: "0810-dinner",
        time: "6:15 PM",
        title: "La Cueva Café",
        detail:
          "Cheese chile relleno, veggie enchiladas, veggie burrito, tacos, or chimichanga. Confirm beans, rice, and chile are made without lard or meat stock.",
        kind: "food",
        href: "https://www.lacuevacafe.com/",
        linkLabel: "Restaurant site",
      },
    ],
  },
  {
    id: "aug-11",
    date: "August 11, 2026",
    weekday: "Tuesday",
    shortDate: "11",
    kicker: "Art to Pueblo country",
    title: "Taos to Buffalo Thunder",
    from: "Dreamcatcher · Taos",
    to: "Hilton Santa Fe Buffalo Thunder",
    miles: "57 mi",
    wheelTime: "1 hr 15 min",
    realTime: "≈ 1 hr 35 min with traffic buffer",
    lodging: "Hilton Santa Fe Buffalo Thunder",
    timezone: "Mountain Time",
    summary:
      "Use the late hotel check-in to fit Fechin House and Poeh Cultural Center without turning the short transfer into a rushed day.",
    advisory:
      "Nambé Falls is closed Tuesday and Wednesday. Do not move it into this day. Buffalo Thunder check-in is 4 PM.",
    events: [
      {
        id: "0811-breakfast",
        time: "8:30 AM",
        title: "Dreamcatcher breakfast + pack",
        detail:
          "Aim to be fully packed by 10:30 AM. Confirm the property’s checkout time directly.",
        kind: "stay",
      },
      {
        id: "0811-fechin",
        time: "11:00 AM",
        title: "Taos Art Museum at Fechin House",
        detail:
          "Tuesday hours are 11 AM–5 PM. The Fechin galleries and current abstraction/land exhibitions make this the right museum slot.",
        kind: "explore",
        duration: "75 min",
        href: "https://www.taosartmuseum.org/visit.html",
        linkLabel: "Hours + admission",
      },
      {
        id: "0811-coffee",
        time: "12:15 PM",
        title: "Coffee Apothecary + packed snack",
        detail:
          "Keep lunch light so Poeh gets a real visit before its galleries close.",
        kind: "food",
        duration: "25 min",
        href: "https://coffeeapothecarytaos.com/pages/menu",
        linkLabel: "Menu",
      },
      {
        id: "0811-drive",
        time: "12:45 PM",
        title: "Drive NM-68 to Pojoaque",
        detail:
          "Keep the fixed 1 hr 15 min drive and add 15–20 minutes for NM-68 traffic, construction, or weather.",
        kind: "drive",
        duration: "1 hr 35 min planned",
      },
      {
        id: "0811-poeh",
        time: "2:20 PM",
        title: "Poeh Cultural Center",
        detail:
          "The museum is open weekdays 10 AM–5 PM; the Tower Gallery is open 1–4 PM. It is beside the resort, so there is no backtracking.",
        kind: "explore",
        duration: "85 min",
        href: "https://poehcenter.org/visit/",
        linkLabel: "Plan the visit",
      },
      {
        id: "0811-checkin",
        time: "4:00 PM",
        title: "Buffalo Thunder check-in",
        detail:
          "Settle in before the dinner drive. Keep the pool/spa/casino as the low-effort evening option.",
        kind: "stay",
      },
      {
        id: "0811-dinner",
        time: "5:30 PM",
        title: "India House · Santa Fe",
        detail:
          "Vegetable biryani, aloo gobi, channa masala, bhindi masala, baingan bhartha, paneer makhani, or malai kofta.",
        kind: "food",
        href: "https://indiahousenm.com/menu",
        linkLabel: "Official menu",
      },
      {
        id: "0811-resort",
        time: "7:30 PM",
        title: "Resort evening",
        detail:
          "Pool, spa, or casino—no more attraction driving. Spa treatments should be booked ahead.",
        kind: "rest",
      },
    ],
  },
  {
    id: "aug-12",
    date: "August 12, 2026",
    weekday: "Wednesday",
    shortDate: "12",
    kicker: "Cliff dwellings + opera",
    title: "Bandelier and Santa Fe",
    from: "Buffalo Thunder",
    to: "Buffalo Thunder",
    miles: "Stay",
    wheelTime: "Local outings",
    realTime: "Early trail · long rest · evening performance",
    lodging: "Hilton Santa Fe Buffalo Thunder",
    timezone: "Mountain Time",
    summary:
      "Bandelier belongs in the cool morning. A long resort reset protects enough energy for a deliberately early Indian dinner and the Santa Fe Opera.",
    advisory:
      "The 2026 shuttle does not normally run Wednesday. Drive into Frijoles Canyon early; parking can fill and cell coverage is limited.",
    events: [
      {
        id: "0812-depart",
        time: "8:20 AM",
        title: "Leave for Bandelier",
        detail:
          "Take water, sun protection, downloaded directions, and the park pass screenshot. Allow 45–55 minutes.",
        kind: "drive",
      },
      {
        id: "0812-bandelier",
        time: "9:15 AM",
        title: "Bandelier Pueblo Loop",
        detail:
          "Walk the 1.4-mile Pueblo Loop and museum areas. Skip Alcove House unless everyone feels strong; it adds a mile and four wooden ladders.",
        kind: "explore",
        duration: "2 hr 15 min",
        href: "https://www.nps.gov/band/planyourvisit/pueblo-loop-trail.htm",
        linkLabel: "NPS trail guide",
      },
      {
        id: "0812-lunch",
        time: "12:30 PM",
        title: "Gabriel’s lunch",
        detail:
          "Tableside guacamole and Enchiladas Verduras. Confirm the rice, beans, and chile are vegetarian.",
        kind: "food",
        duration: "60 min",
        href: "https://www.gabrielsofsantafe.com/",
        linkLabel: "Restaurant site",
      },
      {
        id: "0812-rest",
        time: "1:45 PM",
        title: "Resort rest + reset",
        detail:
          "Pool, nap, showers, and device charging. Do not replace this with another attraction before a late performance.",
        kind: "rest",
        duration: "2 hr 30 min",
      },
      {
        id: "0812-dinner",
        time: "5:00 PM",
        title: "Paper Dosa reservation",
        detail:
          "Classic masala dosa, spicy basil dosa, paneer dosa, paniyaram, rasam, or the seasonal vegetable coconut-tomato curry.",
        kind: "food",
        note: "Ask for no ghee when dairy-free.",
        href: "https://www.paper-dosa.com/menu",
        linkLabel: "Official menu",
      },
      {
        id: "0812-opera-talk",
        time: "7:00 PM",
        title: "Opera Prelude Talk",
        detail:
          "Complimentary for ticket holders. Leave Paper Dosa by about 6:15 PM to reach the opera near 6:50 PM.",
        kind: "explore",
        duration: "30 min",
        href: "https://www.santafeopera.org/whats-on/prelude-talks-2026/",
        linkLabel: "Talk details",
      },
      {
        id: "0812-opera",
        time: "8:00 PM",
        title: "Eugene Onegin · Santa Fe Opera",
        detail:
          "This performance is specifically scheduled for Wednesday, August 12, 2026.",
        kind: "explore",
        note: "Book tickets before the trip.",
        href: "https://www.santafeopera.org/whats-on/eugene-onegin-2026/",
        linkLabel: "Performance page",
      },
    ],
  },
  {
    id: "aug-13",
    date: "August 13, 2026",
    weekday: "Thursday",
    shortDate: "13",
    kicker: "Two ways to play it",
    title: "Buffalo Thunder to Albuquerque",
    from: "Buffalo Thunder · Santa Fe",
    to: "Hotel Chaco · Albuquerque",
    miles: "77 mi",
    wheelTime: "1 hr 15 min",
    realTime: "≈ 1 hr 30 min with buffer",
    lodging: "Hotel Chaco · Albuquerque",
    timezone: "Mountain Time",
    summary:
      "Default to the post-opera slow start. The Nambé Falls version is only sensible if the group skips the late performance and wakes rested.",
    advisory:
      "Hotel Chaco check-in is 4 PM. Ask the hotel to hold luggage rather than treating early room access as guaranteed.",
    events: [
      {
        id: "0813-relaxed-pack",
        time: "8:30 AM",
        title: "Slow breakfast + pack",
        detail:
          "The default after a late opera night. Check out without stacking an early hike onto too little sleep.",
        kind: "stay",
        mode: "relaxed",
      },
      {
        id: "0813-relaxed-drive",
        time: "10:00 AM",
        title: "Drive to Albuquerque",
        detail:
          "Preserve the fixed 1 hr 15 min drive plus a 15-minute buffer.",
        kind: "drive",
        duration: "1 hr 30 min planned",
        mode: "relaxed",
      },
      {
        id: "0813-falls-depart",
        time: "7:15 AM",
        title: "Depart for Nambé Falls",
        detail:
          "Choose this only after an early night. Pack water shoes for the lower river route.",
        kind: "drive",
        mode: "falls",
      },
      {
        id: "0813-falls-visit",
        time: "7:45 AM",
        title: "Nambé Falls",
        detail:
          "Upper overlook and lower river trail; both are roughly a quarter-mile. Current admission is $20 per vehicle.",
        kind: "explore",
        duration: "90 min",
        note: "Thursday is the only viable day in this segment; the site is closed Tue/Wed.",
        href: "https://www.nambepueblo.org/nambe-falls-lake/",
        linkLabel: "Official details",
        mode: "falls",
      },
      {
        id: "0813-falls-drive",
        time: "11:00 AM",
        title: "Drive to Albuquerque",
        detail:
          "Return to the hotel, shower, pack, then keep the same 1 hr 15 min transfer plus buffer.",
        kind: "drive",
        duration: "1 hr 30 min planned",
        mode: "falls",
      },
      {
        id: "0813-ipcc",
        time: "11:45 AM · relaxed plan",
        title: "Indian Pueblo Cultural Center",
        detail:
          "Daily 9 AM–5 PM, with included tours and exhibitions centered on Pueblo voices and clay traditions.",
        kind: "explore",
        duration: "90 min",
        href: "https://indianpueblo.org/hours-prices/",
        linkLabel: "Hours + admission",
        mode: "relaxed",
      },
      {
        id: "0813-ipk",
        time: "1:15 PM · relaxed plan",
        title: "Indian Pueblo Kitchen",
        detail:
          "Seasonal vegetable stew, cheese enchilada without meat, blue-corn waffles, or an Impossible-patty burger. Confirm lard/stock.",
        kind: "food",
        duration: "60 min",
        href: "https://indianpueblokitchen.org/",
        linkLabel: "Restaurant site",
        mode: "relaxed",
      },
      {
        id: "0813-museum",
        time: "2:30 PM · relaxed plan",
        title: "Albuquerque Museum",
        detail:
          "See “The Other Route 66,” a 2026 centennial exhibition with more than 300 artifacts and local stories.",
        kind: "explore",
        duration: "75 min",
        href: "https://www.cabq.gov/artsculture/albuquerque-museum/plan-your-visit/about",
        linkLabel: "Museum details",
        mode: "relaxed",
      },
      {
        id: "0813-falls-lunch",
        time: "1:00 PM · falls plan",
        title: "Sawmill Market lunch + rest",
        detail:
          "Use the market across from Hotel Chaco for a flexible vegetarian lunch, then protect an afternoon rest block.",
        kind: "food",
        mode: "falls",
      },
      {
        id: "0813-checkin",
        time: "4:00 PM",
        title: "Hotel Chaco check-in",
        detail:
          "Unload, reset, and ask for the best sunset timing if a Level 5 terrace reservation is booked.",
        kind: "stay",
      },
      {
        id: "0813-dinner",
        time: "5:30 PM",
        title: "Naan & Dosa · Albuquerque",
        detail:
          "Masala dosa, idly-sambar, chana masala, dal tadka, aloo gobi, baingan bhartha, bhindi, or vegetable biryani.",
        kind: "food",
        href: "https://www.naananddosa.com/menus",
        linkLabel: "Official menu",
      },
      {
        id: "0813-level5",
        time: "6:45 PM",
        title: "Level 5 rooftop sunset",
        detail:
          "Treat this as the view-and-dessert stop rather than the main vegetarian dinner. Sunset is about 7:57 PM MDT.",
        kind: "rest",
        note: "Reserve the terrace; verify the seasonal August menu.",
        href: "https://www.hotelchaco.com/eat-drink/level-5",
        linkLabel: "Level 5 details",
      },
    ],
  },
  {
    id: "aug-14",
    date: "August 14, 2026",
    weekday: "Friday",
    shortDate: "14",
    kicker: "Canyon night",
    title: "Albuquerque to Palo Duro",
    from: "Hotel Chaco · Albuquerque",
    to: "Palo Duro Canyon glamping",
    miles: "338 mi",
    wheelTime: "4 hr 25 min",
    realTime: "≈ 6 hr 40 min on the local clock",
    lodging: "Palo Duro Canyon glamping",
    timezone: "Mountain → Central · lose 1 hour",
    summary:
      "The fixed drive is 4 hr 25 min, but Texas moves the clock forward. Add a reset and Indian lunch, then hide from the canyon’s peak heat until evening.",
    advisory:
      "The TEXAS Outdoor Musical is not running: its 2026 season ends August 1. The glamping breakfast is meat-only and the cabins do not supply dishes or cutlery.",
    events: [
      {
        id: "0814-depart",
        time: "6:30 AM MDT",
        title: "Depart Hotel Chaco",
        detail:
          "Leave with a full tank, cooler stocked, Palo Duro pass saved, and glamping breakfast supplies already packed.",
        kind: "drive",
      },
      {
        id: "0814-santarosa",
        time: "8:15 AM MDT",
        title: "Santa Rosa reset",
        detail:
          "Fuel, restroom, and a fast stretch before the Texas line.",
        kind: "rest",
        duration: "15 min",
      },
      {
        id: "0814-timezone",
        time: "At the Texas line",
        title: "Move clocks forward one hour",
        detail:
          "This is why 4 hr 25 min of driving advances the local clock by 5 hr 25 min before stops.",
        kind: "alert",
      },
      {
        id: "0814-lunch",
        time: "11:35 AM CDT",
        title: "Indian Oven · Amarillo",
        detail:
          "Lunch plus glampsite takeout: chana masala, aloo gobi, dal tadka, bhindi, paneer dishes, vegetable biryani, samosas, or pakoras.",
        kind: "food",
        duration: "60 min",
        note: "Call ahead and collect dinner before leaving Amarillo.",
        href: "https://www.visitamarillo.com/listing/indian-oven/433/",
        linkLabel: "Listing + hours",
      },
      {
        id: "0814-park",
        time: "1:15 PM CDT",
        title: "Palo Duro park entrance",
        detail:
          "The park can reach capacity. Have the day-use reservation ready before cell service becomes unreliable.",
        kind: "explore",
        href: "https://tpwd.texas.gov/state-parks/palo-duro-canyon",
        linkLabel: "Official park page",
      },
      {
        id: "0814-checkin",
        time: "3:00 PM",
        title: "Glamping check-in",
        detail:
          "Locate the shared restroom before dark, refrigerate the takeout, and use the air conditioning during the hottest window.",
        kind: "stay",
      },
      {
        id: "0814-rest",
        time: "3:30 PM",
        title: "Mandatory heat break",
        detail:
          "No Lighthouse Trail after the drive. Canyon-floor temperatures can run 5–10°F hotter than the rim.",
        kind: "rest",
        duration: "2 hr",
      },
      {
        id: "0814-trail",
        time: "5:45 PM",
        title: "Pioneer Nature Trail · if safe",
        detail:
          "Only the easy 0.4-mile loop, and only if heat, lightning, and flash-flood alerts are clear.",
        kind: "explore",
        duration: "30 min",
        href: "https://tpwd.texas.gov/state-parks/palo-duro-canyon/trails-info",
        linkLabel: "Trail guide",
      },
      {
        id: "0814-dinner",
        time: "6:30 PM",
        title: "Indian takeout at the cabin",
        detail:
          "Chana masala and vegetable biryani travel well. Bring plates, bowls, utensils, and anything needed to reheat safely.",
        kind: "food",
      },
      {
        id: "0814-sunset",
        time: "8:36 PM",
        title: "Sunset + porch stargazing",
        detail:
          "Stay near the cabin after dark. The Perseids remain active after their peak, but do not plan a night hike.",
        kind: "rest",
      },
    ],
  },
  {
    id: "aug-15",
    date: "August 15, 2026",
    weekday: "Saturday",
    shortDate: "15",
    kicker: "The long road home",
    title: "Palo Duro to Home",
    from: "Palo Duro Canyon glamping",
    to: "Home",
    miles: "617 mi",
    wheelTime: "9 hr 16 min",
    realTime: "≈ 10 hr 45 min–11 hr with stops",
    lodging: "Home",
    timezone: "Route-dependent",
    summary:
      "Keep the spreadsheet’s 9 hr 16 min as wheel time. Three resets, fuel, and a proper meal turn this into an honest eleven-hour day.",
    advisory:
      "The home city is not specified, so the arrival time and restaurant stop must stay route-dependent rather than pretending to know the route.",
    events: [
      {
        id: "0815-sunrise",
        time: "6:45 AM CDT",
        title: "Porch sunrise + packed breakfast",
        detail:
          "Sunrise is about 7:07 AM, though the canyon walls can delay direct light. Use the vegetarian breakfast packed in Albuquerque.",
        kind: "food",
      },
      {
        id: "0815-pack",
        time: "7:30 AM",
        title: "Pack and sweep the cabin",
        detail:
          "Glamping checkout is 11 AM, but an 8:30 departure protects the arrival window.",
        kind: "stay",
        duration: "60 min",
      },
      {
        id: "0815-depart",
        time: "8:30 AM",
        title: "Depart for home",
        detail:
          "Start with a rested driver and set a two-hour maximum driving block.",
        kind: "drive",
      },
      {
        id: "0815-stops",
        time: "Across the day",
        title: "Three driver resets + meal + fuel",
        detail:
          "Plan three 15-minute stops, one 45-minute meal, and fuel. Swap drivers before fatigue—not after.",
        kind: "rest",
        duration: "≈ 90 min total",
      },
      {
        id: "0815-meal",
        time: "Route-dependent",
        title: "Choose the home-route Indian stop",
        detail:
          "Via Abilene: Spicy India. Via Wichita Falls: Masala & Curry. The Roadbook tab keeps both options until the home route is confirmed.",
        kind: "food",
      },
      {
        id: "0815-arrive",
        time: "≈ 10 hr 45 min–11 hr after departure",
        title: "Home",
        detail:
          "Arrival remains route-dependent. Unload only essentials; the trip is complete when everyone gets home safely.",
        kind: "stay",
      },
    ],
  },
];

export type Cuisine = "Indian" | "Mexican" | "Italian" | "Burgers + more";

export type Restaurant = {
  name: string;
  city: string;
  day: string;
  cuisine: Cuisine;
  role: string;
  dishes: string[];
  note: string;
  href: string;
  priority?: boolean;
};

export const restaurants: Restaurant[] = [
  {
    name: "India Palace",
    city: "Lubbock",
    day: "Sat · Aug 8",
    cuisine: "Indian",
    role: "Arrival-night dinner",
    dishes: ["Channa pindiwala", "Navrattan korma", "Vegetable samosa", "Aloo paratha"],
    note: "Official Saturday dinner window is 5:30–10 PM. Ask about ghee or cream if needed.",
    href: "https://indiapalacelubbocktx.com/",
    priority: true,
  },
  {
    name: "The Pour House",
    city: "Taos",
    day: "Sun · Aug 9",
    cuisine: "Indian",
    role: "First Taos dinner",
    dishes: ["Masala dosa", "Chole curry", "Dal tadka", "Paneer butter masala", "Gobi Manchurian"],
    note: "The strongest Indian-first choice in Taos. Reserve rather than gambling on a Sunday walk-in.",
    href: "https://www.taospourhouse.com/menu.html",
    priority: true,
  },
  {
    name: "India House",
    city: "Santa Fe",
    day: "Tue · Aug 11",
    cuisine: "Indian",
    role: "Dinner after hotel check-in",
    dishes: ["Vegetable biryani", "Aloo gobi", "Channa masala", "Bhindi masala", "Baingan bhartha", "Paneer makhani"],
    note: "Ask which dishes use ghee or dairy when ordering vegan.",
    href: "https://indiahousenm.com/menu",
    priority: true,
  },
  {
    name: "Paper Dosa",
    city: "Santa Fe",
    day: "Wed · Aug 12",
    cuisine: "Indian",
    role: "Pre-opera dinner",
    dishes: ["Classic masala dosa", "Spicy basil dosa", "Paneer dosa", "Paniyaram", "Seasonal vegetable curry"],
    note: "Book 5 PM. Dosas can be made dairy-free without ghee; leave by about 6:15 PM for the opera.",
    href: "https://www.paper-dosa.com/menu",
    priority: true,
  },
  {
    name: "Naan & Dosa",
    city: "Albuquerque",
    day: "Thu · Aug 13",
    cuisine: "Indian",
    role: "Main Albuquerque dinner",
    dishes: ["Masala dosa", "Idly-sambar", "Chana masala", "Dal tadka", "Bhindi do pyaza", "Vegetable biryani"],
    note: "Official Thursday dinner hours are 5–9:30 PM. Large, specific vegetarian section.",
    href: "https://www.naananddosa.com/menus",
    priority: true,
  },
  {
    name: "Indian Oven",
    city: "Amarillo",
    day: "Fri · Aug 14",
    cuisine: "Indian",
    role: "Lunch + glampsite takeout",
    dishes: ["Chana masala", "Aloo gobi", "Dal tadka", "Bhindi masala", "Kadai paneer", "Vegetable biryani"],
    note: "Friday lunch is currently listed 11 AM–2:30 PM. Call ahead and collect dinner to reheat at the cabin.",
    href: "https://www.visitamarillo.com/listing/indian-oven/433/",
    priority: true,
  },
  {
    name: "La Cueva Café",
    city: "Taos",
    day: "Mon · Aug 10",
    cuisine: "Mexican",
    role: "Taos dinner",
    dishes: ["Cheese chile relleno", "Veggie enchiladas", "Veggie burrito", "Vegetable tacos"],
    note: "Confirm that beans, rice, and chile are prepared without lard or meat stock.",
    href: "https://www.lacuevacafe.com/",
  },
  {
    name: "Gabriel’s",
    city: "Pojoaque",
    day: "Wed · Aug 12",
    cuisine: "Mexican",
    role: "Bandelier lunch",
    dishes: ["Tableside guacamole", "Enchiladas Verduras"],
    note: "Very close to the resort. Confirm vegetarian rice, beans, and chile when ordering.",
    href: "https://www.gabrielsofsantafe.com/",
  },
  {
    name: "Piccolino",
    city: "Santa Fe",
    day: "Backup option",
    cuisine: "Italian",
    role: "Straightforward Italian backup",
    dishes: ["Vegetarian lasagna", "Pasta primavera", "Olga’s eggplant pasta", "Pizza Margherita", "Pizza Stagione"],
    note: "A useful non-Indian alternative with several real vegetarian mains, not just a side salad.",
    href: "https://www.piccolinosantafe.com/menu.html",
  },
  {
    name: "Farina Pizzeria",
    city: "Albuquerque",
    day: "Thu · Aug 13 backup",
    cuisine: "Italian",
    role: "Hotel Chaco-area pizza backup",
    dishes: ["Margherita", "Melanzane", "Funghi", "Chopped vegetable salad", "Oven-roasted olives"],
    note: "The eggplant and mushroom pizzas are purpose-built vegetarian choices. Reserve if replacing Naan & Dosa.",
    href: "https://www.farinapizzeria.com/",
  },
  {
    name: "Farmhouse Café",
    city: "Taos",
    day: "Mon · Aug 10",
    cuisine: "Burgers + more",
    role: "Late lunch before 3 PM close",
    dishes: ["House veggie-nut burger", "Portabella burger", "Vegan curried squash pie", "Mushroom shepherd’s pie"],
    note: "A genuinely substantial vegetarian lunch. The schedule lands before its 3 PM close.",
    href: "https://www.farmhousetaos.com/menu",
  },
  {
    name: "Indian Pueblo Kitchen",
    city: "Albuquerque",
    day: "Thu · Aug 13",
    cuisine: "Burgers + more",
    role: "Museum-campus lunch",
    dishes: ["Seasonal vegetable stew", "Cheese enchilada without meat", "Blue-corn waffles", "Impossible burger substitution"],
    note: "Ask whether breads, beans, chile, or fryer oil contain lard or stock.",
    href: "https://indianpueblokitchen.org/",
  },
];

export type ChecklistGroup = {
  title: string;
  eyebrow: string;
  items: { id: string; text: string; detail?: string; urgent?: boolean }[];
};

export const checklistGroups: ChecklistGroup[] = [
  {
    title: "Book before leaving",
    eyebrow: "Reservations",
    items: [
      { id: "book-hampton", text: "Confirm the exact Hampton Inn Lubbock property", urgent: true },
      { id: "book-dreamcatcher-veg", text: "Tell Dreamcatcher all breakfasts must be vegetarian", urgent: true },
      { id: "book-pour-house", text: "Reserve The Pour House for Sun, Aug 9 at 5:30 PM" },
      { id: "book-earthship", text: "Confirm Earthship Aug 10 hours or reserve the guided tour" },
      { id: "book-paper-dosa", text: "Reserve Paper Dosa for Wed, Aug 12 at 5 PM", urgent: true },
      { id: "book-opera", text: "Buy Eugene Onegin tickets for Wed, Aug 12 at 8 PM", urgent: true },
      { id: "book-level5", text: "Reserve Level 5 terrace for Thu, Aug 13 sunset" },
      { id: "book-palo-pass", text: "Reserve Palo Duro day-use entrance for Fri, Aug 14", urgent: true },
      { id: "book-indian-oven", text: "Call Indian Oven for lunch + vegetarian dinner takeout" },
    ],
  },
  {
    title: "Verify 48–72 hours before",
    eyebrow: "Live checks",
    items: [
      { id: "check-taos-pueblo", text: "Check Taos Pueblo ceremonial/community closures", urgent: true },
      { id: "check-earthship", text: "Reconfirm Earthship visitor hours" },
      { id: "check-bandelier", text: "Check Bandelier alerts, parking, and weather" },
      { id: "check-nambe", text: "Check Nambé Falls access if choosing the early plan" },
      { id: "check-nmroads", text: "Check NMRoads before every New Mexico transfer" },
      { id: "check-drivetexas", text: "Check DriveTexas for Aug 14–15" },
      { id: "check-palo-alerts", text: "Check Palo Duro heat, lightning, flood, and burn alerts", urgent: true },
    ],
  },
  {
    title: "Road kit",
    eyebrow: "Car",
    items: [
      { id: "pack-maps", text: "Download offline maps for every day" },
      { id: "pack-water", text: "Cold water + refillable bottles" },
      { id: "pack-electrolytes", text: "Electrolytes for Taos, Bandelier, and Palo Duro" },
      { id: "pack-cooler", text: "Cooler for road meals and Indian Oven takeout" },
      { id: "pack-charger", text: "Car chargers + power bank" },
      { id: "pack-tire", text: "Check tire pressure, spare, jack, and roadside coverage" },
      { id: "pack-trash", text: "Trash bags, wipes, paper towels, and hand sanitizer" },
    ],
  },
  {
    title: "High desert + canyon",
    eyebrow: "Outdoor",
    items: [
      { id: "pack-hats", text: "Sun hats, sunglasses, and SPF" },
      { id: "pack-layers", text: "Light layers for cool high-desert mornings" },
      { id: "pack-rain", text: "Packable rain shells for monsoon storms" },
      { id: "pack-shoes", text: "Trail shoes with grip" },
      { id: "pack-watershoes", text: "Water shoes if visiting Nambé Falls" },
      { id: "pack-firstaid", text: "Compact first-aid kit + regular medicines" },
      { id: "pack-flashlight", text: "Headlamps/flashlights for the glampsite" },
    ],
  },
  {
    title: "Palo Duro glamping",
    eyebrow: "Cabin gap list",
    items: [
      { id: "pack-glamp-breakfast", text: "Vegetarian breakfast for Aug 15", urgent: true },
      { id: "pack-utensils", text: "Plates, bowls, cups, and cutlery", urgent: true },
      { id: "pack-containers", text: "Food containers + foil for leftovers" },
      { id: "pack-coffee", text: "Preferred coffee/tea and shelf-stable milk" },
      { id: "pack-shower", text: "Shower bag and easy slip-on shoes for shared restrooms" },
      { id: "pack-bug", text: "Insect repellent" },
    ],
  },
];

export const routeStops = [
  { place: "Home", date: "Aug 8", stay: "Start" },
  { place: "Lubbock", date: "Aug 8", stay: "1 night" },
  { place: "Taos", date: "Aug 9–10", stay: "2 nights" },
  { place: "Santa Fe", date: "Aug 11–12", stay: "2 nights" },
  { place: "Albuquerque", date: "Aug 13", stay: "1 night" },
  { place: "Palo Duro", date: "Aug 14", stay: "1 night" },
  { place: "Home", date: "Aug 15", stay: "Finish" },
];

export const liveLinks = [
  { label: "NMRoads", detail: "New Mexico incidents + closures", href: "https://www.nmroads.com/mapIndex.html?fromMap=true" },
  { label: "DriveTexas", detail: "Texas road conditions", href: "https://conditions.drivetexas.org/current/" },
  { label: "Bandelier alerts", detail: "Parking, trails + weather", href: "https://www.nps.gov/band/planyourvisit/conditions.htm" },
  { label: "Palo Duro alerts", detail: "Capacity, heat + burn notices", href: "https://tpwd.texas.gov/state-parks/palo-duro-canyon/alert-1/" },
  { label: "NWS Albuquerque", detail: "Monsoon + flash-flood safety", href: "https://www.weather.gov/abq/prepawaremonsoonflashfloods" },
  { label: "NWS Palo Duro", detail: "Canyon-specific forecast zone", href: "https://www.weather.gov/ama/NewPaloDuroCanyonForecastZone" },
];
