/**
 * New Orleans trip facts.
 * Researched Tuesday, Nov 24, 2026, America/Chicago (CST).
 * Every factual claim carries a source. Unconfirmed items set unverified: true.
 * Do not invent hours, menus, prices, or times.
 *
 * Sources were fetched Nov 24, 2026. Christmas Day hours close many kitchens
 * and tours; this plan puts swamp and river cruises on Fri Dec 26 unless an
 * operator page clearly says it sails Dec 25.
 */

import type {
  AlertItem,
  DayPlan,
  DriveRow,
  FoldNote,
  FoodCard,
  PlacePhoto,
  SourceLink,
  TripContent,
  TripEvent,
} from "./trip-types";

export type { SourceLink } from "./trip-types";

export const S = {
  mapsDrive: {
    href: "https://www.google.com/maps/dir/Katy,+TX/Jackson+Square,+New+Orleans,+LA",
    label: "Google Maps: Katy to Jackson Square",
  },
  mapsDriveBack: {
    href: "https://www.google.com/maps/dir/Jackson+Square,+New+Orleans,+LA/Katy,+TX",
    label: "Google Maps: Jackson Square to Katy",
  },
  osrm: {
    href: "https://router.project-osrm.org/",
    label: "OSRM routing (computed Nov 24, 2026, no traffic)",
  },
  osrmOut: {
    href: "https://router.project-osrm.org/route/v1/driving/-95.8243956,29.7857853;-90.064410,29.958400?overview=false",
    label: "OSRM Katy to Jackson Square (no traffic)",
  },
  osrmBack: {
    href: "https://router.project-osrm.org/route/v1/driving/-90.064410,29.958400;-95.8243956,29.7857853?overview=false",
    label: "OSRM Jackson Square to Katy (no traffic)",
  },
  nwsPoint: {
    href: "https://forecast.weather.gov/MapClick.php?lat=29.9584&lon=-90.0644",
    label: "NWS point forecast for New Orleans (Jackson Square)",
  },
  cafeHistory: {
    href: "https://shop.cafedumonde.com/history/",
    label: "Cafe Du Monde history (hours; closed Christmas Day)",
  },
  cafeLocations: {
    href: "https://shop.cafedumonde.com/locations/",
    label: "Cafe Du Monde locations and posted hours",
  },
  cafeFrenchMarket: {
    href: "https://www.frenchmarket.org/shopping/cafe-du-monde/",
    label: "French Market District: Cafe Du Monde",
  },
  cathedral: { href: "https://www.stlouiscathedral.org/", label: "St. Louis Cathedral" },
  cathedralMass: {
    href: "https://www.stlouiscathedral.org/mass-times",
    label: "St. Louis Cathedral mass times",
  },
  cathedralXmas2024: {
    href: "https://stlouiscathedral.org/news/cathedral-holiday-mass-schedule",
    label: "Cathedral holiday mass schedule (Dec 23, 2024 news; 2026 not posted)",
  },
  cathedralClosed2024: {
    href: "https://stlouiscathedral.org/news/christmas-holiday-closures",
    label: "Cathedral Christmas holiday closures (Dec 23, 2024 news)",
  },
  oaks: { href: "https://celebrationintheoaks.com/", label: "Celebration in the Oaks (official)" },
  oaksCityPark: {
    href: "https://neworleanscitypark.org/blog/celebration-in-the-oaks-returns-with-more-holiday-magic/",
    label: "City Park Conservancy: Celebration in the Oaks 2026 dates",
  },
  natchez: { href: "https://www.steamboatnatchez.com/", label: "New Orleans Steamboat Company / Natchez" },
  natchezFaq: {
    href: "https://www.steamboatnatchez.com/about/frequently-asked-questions.html",
    label: "Steamboat Natchez FAQ (boarding times; vessel substitution)",
  },
  natchezXmasEve: {
    href: "https://www.steamboatnatchez.com/cruises-2/holiday-cruise/christmas-eve-jazz-cruise.html",
    label: "Christmas Eve Jazz Cruise on Riverboat CITY of NEW ORLEANS (Dec 24)",
  },
  natchezHolidays: {
    href: "https://www.steamboatnatchez.com/cruises/holiday-cruise/index.htm",
    label: "Steamboat Natchez holiday cruises index",
  },
  natchezGroupon: {
    href: "https://www.groupon.com/deals/steamboat-natchez-1",
    label: "Groupon: Steamboat Natchez harbor cruise",
  },
  creoleQueen: { href: "https://www.creolequeen.com/", label: "Creole Queen (official)" },
  creoleQueenTours: { href: "https://www.creolequeen.com/tours/", label: "Creole Queen tours" },
  creoleQueenXmasEve: {
    href: "https://www.creolequeen.com/tours/christmas-eve-party.html",
    label: "Creole Queen Christmas Eve Holiday Party Cruise (Dec 24)",
  },
  creoleQueenGroupon: {
    href: "https://www.groupon.com/deals/creole-queen-5-new-orleans",
    label: "Groupon: Creole Queen dinner jazz cruise",
  },
  creoleQueenHistoricGroupon: {
    href: "https://www.groupon.com/deals/creole-queen-4",
    label: "Groupon: Creole Queen historic cruise",
  },
  creoleQueenGoCity: {
    href: "https://gocity.com/en/new-orleans/attractions/paddlewheeler-cruise",
    label: "Go City: Creole Queen hours; 24–25 Dec closed",
  },
  cajunPride: { href: "https://www.cajunprideswamptours.com/", label: "Cajun Pride Swamp Tours" },
  cajunPrideQ: {
    href: "https://www.cajunprideswamptours.com/questions",
    label: "Cajun Pride Q&A (closed Mardi Gras, Thanksgiving, Christmas)",
  },
  cajunPrideGroupon: {
    href: "https://www.groupon.com/deals/gl-cajun-pride-swamp-tours-1",
    label: "Groupon: Cajun Pride swamp tour for two",
  },
  jeanLafitte: {
    href: "https://www.jeanlafitteswamptour.com/",
    label: "Jean Lafitte Swamp Tours (official)",
  },
  jeanLafitteTours: {
    href: "https://www.jeanlafitteswamptour.com/tours/",
    label: "Jean Lafitte swamp tours page",
  },
  jeanLafitteBigEasy: {
    href: "https://bigeasy.com/attractions/jean-lafitte-swamp-tours/swamp-tour",
    label: "BigEasy.com: Jean Lafitte swamp tour times",
  },
  jeanLafitteGroupon: {
    href: "https://www.groupon.com/deals/jean-lafitte-tours-4",
    label: "Groupon: Jean Lafitte 90-minute swamp tour",
  },
  honeyIsland: {
    href: "https://www.cajunencounters.com/tours/swamp-tour-new-orleans",
    label: "Cajun Encounters Honey Island swamp tour",
  },
  honeyIslandDock: {
    href: "https://www.cajunencounters.com/locations/55345-us-90",
    label: "Cajun Encounters Honey Island dock hours",
  },
  nortaHoliday: {
    href: "https://www.norta.com/ride-with-us/know-before-you-go/holiday-service",
    label: "RTA holiday service (Christmas Day = Sunday schedule)",
  },
  nortaFares: {
    href: "https://www.norta.com/ride-with-us/how-to-pay/fares",
    label: "RTA fares (streetcar single ride $1.25 adult)",
  },
  nortaStCharlesPdf: {
    href: "https://www.norta.com/RTA/media/RTABusPDFSchedules/route_12.pdf",
    label: "RTA Fall 2026 streetcar PDF (St. Charles / holidays)",
  },
  twoPhat: { href: "https://2phatvegans.com/", label: "2 Phat Vegans (official)" },
  gambitVegan2026: {
    href: "https://www.nola.com/gambit/food_drink/restaurant_guide/gambits-summer-2026-dining-issue-new-orleans-spots-for-vegan-mediterranean-food-and-more/article_a93bbff4-5688-4098-874e-7b962c703c72.html",
    label: "Gambit Summer 2026 dining issue (2 Phat Vegans, Sweet Soulfood)",
  },
  killerMenu: {
    href: "https://www.killerpoboys.com/big-killer-menu",
    label: "Killer PoBoys Big Killer menu (Dauphine)",
  },
  killerLocations: {
    href: "https://www.killerpoboys.com/locations",
    label: "Killer PoBoys locations and hours",
  },
  sweetSoul: { href: "https://sweetvegansoulfood.com/", label: "Sweet Soulfood (official)" },
  sweetSoulMenu: {
    href: "https://sweetvegansoulfood.com/new-orleans-sweet-soulfood-food-menu",
    label: "Sweet Soulfood rotating menu",
  },
  satsuma: { href: "https://satsumacafe.com/", label: "Satsuma Café Dauphine" },
  satsumaMenus: { href: "https://satsumacafe.com/menus/", label: "Satsuma Café menus" },
  satsumaPdf: { href: "https://satsumacafe.com/menu.pdf", label: "Satsuma Café menu PDF" },
  snugClosed: {
    href: "https://snugjazz.com/tm-event/were-closed-for-christmas-day/",
    label: "Snug Harbor: closed Christmas Day 2026; open Dec 26",
  },
  spottedCat: { href: "https://www.spottedcatmusicclub.com/", label: "The Spotted Cat Music Club" },
  dba: { href: "https://www.dbaneworleans.com/", label: "d.b.a. New Orleans" },
  tujaguesReveillon: {
    href: "https://tujaguesrestaurant.com/news-and-events/2023-reveillon-menu/",
    label: "Tujague's 2026 Réveillon (Dec 1–24; not Christmas Day)",
  },
  galatoiresReveillon: {
    href: "https://www.galatoires.com/menus/reveillon",
    label: "Galatoire's Réveillon 2026 (Dec 1–24)",
  },
  murielsReveillon: {
    href: "https://muriels.com/portfolio/reveillon-2026/",
    label: "Muriel's Réveillon 2026 (Dec 1–23)",
  },
  windsorReveillon: {
    href: "https://thewindsorcourt.com/holiday-traditions-new-orleans/",
    label: "Windsor Court Grill Room holiday dining (Réveillon excludes Dec 24–25)",
  },
  longueVueClosed: {
    href: "https://longuevue.com/event/longue-vue-closed-9/",
    label: "Longue Vue closed Dec 25, 2026; reopen Dec 26 8:00 AM",
  },
  marriottCity: {
    href: "https://activities.marriott.com/north-america/usa/louisiana/new-orleans/activities/new_orleans_steamboat_natchez_jazz_cruise-XLS64L",
    label: "Marriott/Gray Line: Nov 2, 2026–Jan 31, 2027 cruises on CITY of NEW ORLEANS",
  },
} as const satisfies Record<string, SourceLink>;

const PLANNING =
  "Suggested planning window, not a confirmed reservation or guaranteed clock time.";

const PHOTO_NOTE =
  "Resized and compressed to WebP from the Wikimedia Commons original. Not a current-hours photo.";

export const photos: PlacePhoto[] = [
  {
    id: "jackson-square",
    src: "/images/jackson-square.webp",
    alt: "Jackson Square and St. Louis Cathedral in the French Quarter, New Orleans",
    credit: "Roller Coaster Philosophy",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:New_Orleans_early_June_2023_-_Cathedral_and_Jackson_Square.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "cafe-du-monde",
    src: "/images/cafe-du-monde.webp",
    alt: "Cafe du Monde on Decatur Street in the French Quarter, New Orleans",
    credit: "Infrogmation of New Orleans",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Cafe_du_Monde_French_Quarter_-_Tiger_Rag_01.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "steamboat-natchez",
    src: "/images/steamboat-natchez.webp",
    alt: "Steamboat Natchez paddlewheeler on the Mississippi River at New Orleans, March 2024",
    credit: "Gildardo",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Natchez_Paddlewheel_Boat_on_the_Mississippi_River,_New_Orleans_March_2024.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "st-charles-streetcar",
    src: "/images/st-charles-streetcar.webp",
    alt: "St. Charles Avenue streetcar entering the Garden District, New Orleans",
    credit: "JasonParis",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_(Garden_District)_-_St_Charles_Streetcar_on_the_tracks_2011.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "garden-district",
    src: "/images/garden-district.webp",
    alt: "A house in the Garden District, New Orleans, April 2023",
    credit: "Infrogmation of New Orleans",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Garden_District_house,_New_Orleans,_April_2023_-_2.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "frenchmen-street",
    src: "/images/frenchmen-street.webp",
    alt: "Frenchmen Street 600 block at night, New Orleans, November 2025",
    credit: "Jeremy Thompson",
    license: "CC BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Frenchmen_Street,_New_Orleans,_November_2025_-_600_block_at_night.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "celebration-oaks",
    src: "/images/celebration-oaks.webp",
    alt: "Tunnel of Light during Celebration in the Oaks in New Orleans City Park",
    credit: "Bart Everson",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Tunnel_of_Light_-_Celebration_in_the_Oaks,_New_Orleans.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "city-park",
    src: "/images/city-park.webp",
    alt: "Live oaks in New Orleans City Park, March 2024",
    credit: "Paul Lowry",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Live_Oaks_in_New_Orleans_City_Park,_March_2024.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "honey-island",
    src: "/images/honey-island.webp",
    alt: "Honey Island Swamp tour boat among cypress trees, Louisiana, July 2023",
    credit: "Daniel Lobo",
    license: "CC0 1.0",
    licenseHref: "https://creativecommons.org/publicdomain/zero/1.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:Honey_Island_Swamp_Tour,_Louisiana_July_2023_-_9.jpg",
    note: PHOTO_NOTE,
  },
];

export const photoGaps = [
  "2 Phat Vegans",
  "Killer PoBoys",
  "Sweet Soulfood",
  "Satsuma Café",
  "Cajun Pride Swamp Tours launch (LaPlace)",
  "Jean Lafitte Swamp Tours launch (Marrero)",
  "Riverboat CITY of NEW ORLEANS (no separate reusable photo used; Natchez photo is the sister vessel)",
  "Paddlewheeler Creole Queen (reusable Commons files exist; not copied in this pass)",
  "Snug Harbor Jazz Bistro",
  "The Spotted Cat Music Club",
  "St. Louis Cathedral interior",
  "Overnight lodging (the owner's booking; no hotel is named on this page)",
];

export const meta = {
  tripId: "nola" as const,
  title: "New Orleans · NOLA",
  dates: "Thu Dec 25 to Fri Dec 26, 2026",
  timezone: "America/Chicago",
  timezoneNote: "All times America/Chicago (CST on these dates).",
  researchedAsOf: "Nov 24, 2026",
  researchedAsOfLong: "Tuesday, Nov 24, 2026",
  stayName: "New Orleans",
  originCity: "Katy, TX",
  spanAllLabel: "All days",
  mapsOutboundLabel: "Maps: Katy to Jackson Square",
  mapsReturnLabel: "Maps: Jackson Square to Katy",
  foodLead:
    "Strict ovo-lacto. Named dishes come from the linked menus. Call to confirm Christmas Day hours. Never assume a kitchen is open. Traditional red beans and rice is not treated as meatless unless a vegan kitchen lists it.",
  attractionsLead:
    "Real places only. Drives are OSRM no-traffic from Jackson Square unless noted. Photos are Wikimedia Commons files that allow reuse; places without a reusable photo use a placeholder.",
  eventsLead:
    "Only Thu Dec 25 and Fri Dec 26, 2026. Christmas Eve Réveillon and St. James Parish bonfires are the night before this stay.",
  stayFoldTitle: "Stay and planning notes",
  hoursWarning: "Call to confirm these hours, especially Christmas Day.",
  driveAssumption:
    "Assumption on this page: start and return from Katy, TX, about 5 hours each way via I-10. Overnight lodging is the owner's booking; this page does not name a hotel.",
  groupLabels: {
    "in-town": "French Quarter and the river",
    nearby: "Streetcar, Garden District, City Park",
    i10: "Swamp tours (day trips)",
    longer: "On the I-10 drive",
  },
};

export const weather = {
  updated: "NWS 7-day forecast retrieved Nov 24, 2026",
  valid: "No point forecast for Dec 25–26, 2026 was available on Nov 24, 2026.",
  pointLabel: "Point Forecast: New Orleans LA (Jackson Square 29.96°N 90.06°W)",
  takeaway:
    "Do not pack from a made-up forecast. Re-check the NWS New Orleans point forecast the week of the trip.",
  sources: [S.nwsPoint],
  days: [
    {
      id: "thu",
      label: "Thu 25",
      name: "Christmas Day",
      sky: "NWS not issued yet",
      high: "re-check",
      detail:
        "NWS 7-day products retrieved Nov 24 do not reach Christmas Day. Re-check forecast.weather.gov before leaving Katy.",
    },
    {
      id: "fri",
      label: "Fri 26",
      name: "Friday",
      sky: "NWS not issued yet",
      high: "re-check",
      detail:
        "Same gap: Dec 26 is outside the Nov 24 NWS 7-day window. Re-check the morning of the swamp or river cruise.",
    },
  ],
};

export const diet = {
  title: "Strict ovo-lacto vegetarian",
  summary:
    "Eggs and dairy OK. No meat, fish, poultry, shellfish, or animal stock. Ask every kitchen about stock, lard, fish sauce, oyster sauce, chicken powder, bacon fat, and Caesar dressing (often contains anchovy). Traditional New Orleans red beans are usually cooked with ham hock or sausage unless a vegan kitchen lists them.",
  coconut:
    "Coconut: Satsuma Café's vegan curry scramble is listed with green coconut curry on the official menu PDF. Killer PoBoys' Thai BBQ Tofu is listed with coconut on the Big Killer menu. Ask at both. Cafe du Monde does not list coconut on the fetched location pages.",
  coconutUnverified: true,
  coconutUnverifiedReason:
    "Coconut use at Cafe du Monde, 2 Phat Vegans, and Sweet Soulfood was not fully inventoried from official pages. Ask if coconut is a problem.",
  sources: [S.satsumaPdf, S.killerMenu, S.twoPhat, S.sweetSoul, S.cafeLocations],
};

export const driveIn = {
  blurb:
    "Assumption labeled on this page: start and return from Katy, TX, about 5 hours each way via I-10. Overnight lodging is the owner's booking (no hotel is named).",
  osrmShort:
    "OSRM no-traffic Nov 24, 2026: 7 hours 2 minutes, 376 miles outbound; 7 hours 3 minutes, 377 miles back. Live I-10 time is often closer to the 5-hour planning figure. Use the Google Maps links on the day.",
  sources: [S.mapsDrive, S.mapsDriveBack, S.osrm, S.osrmOut, S.osrmBack],
};

export const foodPicks: FoodCard[] = [
  {
    rank: 1,
    name: "Cafe du Monde (French Market)",
    blurb:
      "Beignets and cafe au lait at the original stand. Official history page: closed only on Christmas Day and for an occasional hurricane.",
    address: "800 Decatur Street, New Orleans, LA 70116",
    phone: "(504) 587-0833",
    hours:
      "Posted French Market hours: 7:15 AM–11 PM Sunday–Thursday; 7:15 AM–12 AM Friday–Saturday. Closed Christmas Day (Dec 25). Friday Dec 26 follows the Friday posted window unless they post a holiday change.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Beignets",
        detail:
          "Fried dough with powdered sugar. Dough ingredients (eggs, milk, lard vs vegetable oil) were not on the fetched location pages.",
        unverified: true,
        unverifiedReason: "Beignet dough ingredients UNVERIFIED on the official pages fetched Nov 24.",
      },
      {
        name: "Cafe au lait",
        detail:
          "Chicory coffee with milk. Milk is ovo-lacto. Order without milk if you want it black.",
      },
    ],
    ask: ["Confirm Dec 26 hours.", "Ask about eggs, milk, and frying fat in the beignets if that matters."],
    sources: [S.cafeHistory, S.cafeLocations, S.cafeFrenchMarket],
    imageId: "cafe-du-monde",
  },
  {
    rank: 2,
    name: "2 Phat Vegans",
    blurb:
      "Official site: 100% vegan New Orleans deli-style food, French Quarter. Christmas Day hours are UNVERIFIED even though the site lists daily hours.",
    address: "1303 Decatur Street, New Orleans, LA 70116",
    phone: "(504) 239-7801",
    hours:
      "Official site: Monday–Sunday 11:00 AM–9:00 PM. Christmas Day (Thu) and Dec 26 hours UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Phat Slab sandwich",
        detail:
          "Gambit Summer 2026 listing: barbecue jackfruit “ribs” with vegan mayo, pickles, tomatoes, mustard, ketchup, lettuce, and onions on a kaiser bun. Lunch and dinner daily; no reservations.",
      },
      {
        name: "Mushroom po'boy",
        detail:
          "Named on third-party listings. Not quoted from the official homepage (the homepage does not publish a full menu).",
        unverified: true,
        unverifiedReason: "Mushroom po'boy is UNVERIFIED on the official site; confirm in person.",
      },
    ],
    ask: ["Call (504) 239-7801 for Christmas Day hours before walking over.", "Confirm the bread has no lard."],
    sources: [S.twoPhat, S.gambitVegan2026],
  },
  {
    rank: 3,
    name: "Killer PoBoys (Dauphine)",
    blurb:
      "French Quarter po'boys with named vegetarian plates on the official Big Killer menu. Christmas hours UNVERIFIED.",
    address: "219 Dauphine Street, New Orleans, LA 70112",
    phone: "(504) 439-7445",
    hours:
      "Official locations page: 219 Dauphine 11 AM–8 PM Wednesday–Monday. 811 Conti (back of Erin Rose): 12–8 PM Mon/Wed, 12–10 PM Thu, 10 AM–12 AM Fri–Sat, 10 AM–10 PM Sun. Christmas Day hours UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Thai BBQ Tofu po'boy",
        detail:
          "Official menu: locally made tofu marinated in a Thai BBQ sauce with lemongrass and Thai chili mirliton slaw, spiced peanuts, and coconut ($14). Coconut is in the listed dish.",
      },
      {
        name: "Roasted Cauliflower po'boy",
        detail:
          "Official menu: roasted cauliflower with pickled radish, avocado, dried kale, romesco sauce ($13). Can be made on whole grain bread.",
      },
      {
        name: "Roasted Sweet Potato po'boy",
        detail:
          "Official menu: spiced roasted sweet potato with braised collard greens, black eyed pea and pecan spread ($12). Collard greens in New Orleans kitchens often include pork; vegetarian status of these greens is UNVERIFIED.",
        unverified: true,
        unverifiedReason: "Ask whether the collard greens are cooked with pork or animal stock.",
      },
      {
        name: "Whiskey Grilled Cheese / Pecan Butter & Jelly",
        detail:
          "Official menu: whiskey grilled cheese $9; pecan butter and jelly $8 on toasted whole grain bread. Ovo-lacto if you skip meat add-ons.",
      },
    ],
    ask: [
      "Christmas Day hours.",
      "Collard greens: pork or stock?",
      "Romesco and Thai BBQ sauce: fish sauce or shrimp paste?",
    ],
    sources: [S.killerMenu, S.killerLocations],
  },
  {
    rank: 4,
    name: "Sweet Soulfood",
    blurb:
      "Official site: vegan, organic, soy-free, dairy-free. Rotating cafeteria plates. This is the kitchen to use if you want meatless red beans, and only when that plate is on the board.",
    address: "1025 North Broad Street, New Orleans, LA 70119",
    phone: "(504) 821-2669",
    hours:
      "Official hours: Monday–Saturday 11:00 AM–5:00 PM; Sunday closed. Dec 25 is a Thursday on that calendar; Christmas Day hours are still UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Thursday rotating plates (published menu)",
        detail:
          "Official Thursday list fetched Nov 24: stuffed bell peppers, orange cauliflower, fried cauliflower, veggie fried rice, cashew mac, jambalaya, yakamein, okra gumbo, cornbread dressing, collard greens, sweet potatoes, bread pudding, potato salad. Pick-one and pick-three plates. All vegan on this menu.",
      },
      {
        name: "Red beans and rice",
        detail:
          "Gambit Summer 2026 says Sweet Soulfood menus often include red beans. The Thursday published list fetched Nov 24 does not name red beans. Do not count on red beans Dec 25 unless they confirm the board.",
        unverified: true,
        unverifiedReason: "Red beans not on the Thursday list fetched Nov 24. Friday board UNVERIFIED.",
      },
    ],
    ask: ["Christmas Day hours.", "What is on the board Dec 25 and Dec 26.", "Coconut in desserts or juices."],
    sources: [S.sweetSoul, S.sweetSoulMenu, S.gambitVegan2026],
  },
  {
    rank: 5,
    name: "Satsuma Café (Dauphine)",
    blurb: "Bywater breakfast and lunch cafe, closer to the Quarter than the Maple Street shop. Christmas hours UNVERIFIED.",
    address: "3218 Dauphine Street, New Orleans, LA 70117",
    phone: "(504) 304-5962",
    hours: "Official homepage: 8 AM–3 PM daily. Christmas Day hours UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Vegan curry scramble",
        detail:
          "Official menu PDF: quinoa or tofu with broccoli, onions, sesame, and green coconut curry, lime, sourdough toast ($9.50). Coconut is in the listed dish.",
      },
      {
        name: "Mexican breakfast plate (hold pork)",
        detail:
          "Official PDF: creamy black beans, 2 eggs, roasted tomato salsa, avocado, Cotija cheese, corn tortillas ($9.50); pork is an add-on. Ovo-lacto if you skip pork. Ask whether the beans use lard or animal stock.",
        unverified: true,
        unverifiedReason: "Bean cooking fat UNVERIFIED.",
      },
      {
        name: "Black bean burger / roasted veggie wrap",
        detail:
          "Official PDF: black bean burger with romesco, spinach, avocado mash ($9.50); roasted veggie wrap with baba ganoush, spinach, cucumbers, sumac onions ($9). Confirm romesco has no fish.",
      },
    ],
    ask: ["Christmas Day hours.", "Coconut in the curry scramble.", "Lard or stock in black beans."],
    sources: [S.satsuma, S.satsumaMenus, S.satsumaPdf],
  },
];

export const extraFoodCards: FoodCard[] = [];

export const weakerFood = {
  title: "Weaker leads and skip-as-written",
  lines: [
    "Traditional red beans and rice: usually a Monday ham-hock or sausage pot. Do not order it as vegetarian unless a vegan kitchen (Sweet Soulfood) has it on the board.",
    "Riverboat dinner buffets (Natchez / CITY of NEW ORLEANS / Creole Queen): Creole buffets are meat- and seafood-heavy. The Natchez Christmas Eve page says staff can point to items without meat but cannot prepare separate meals. Treat dinner-cruise food as UNVERIFIED for this diet; buy the sightseeing ticket or eat on land.",
    "Réveillon 2026 menus checked (Tujague's Dec 1–24, Galatoire's Dec 1–24, Muriel's Dec 1–23, Windsor Court Réveillon excluding Dec 24–25) are meat and seafood prix-fixe. No vegetarian Réveillon menu was found. Tujague's states the Réveillon menu is not available Christmas Day.",
    "Carmo (527 Julia) closed after Dec 21, 2024. Do not plan it.",
  ],
  unverifiedReason: "Christmas Day restaurant hours citywide are UNVERIFIED except Cafe du Monde's published Christmas closure.",
  sources: [S.tujaguesReveillon, S.galatoiresReveillon, S.murielsReveillon, S.windsorReveillon, S.natchezXmasEve],
};

export const days: DayPlan[] = [
  {
    id: "thu",
    date: "Thursday, Dec 25, 2026 (Christmas Day)",
    weekday: "Thu",
    short: "Thu 25",
    title: "Drive from Katy, Quarter on foot, streetcar, Celebration in the Oaks",
    weather: { high: "verify", sky: "NWS not yet issued" },
    items: [
      {
        id: "thu-drive",
        kind: "drive",
        startMin: 360,
        endMin: 780,
        shortTitle: "Katy to NOLA",
        title: "Drive Katy to New Orleans (I-10 assumption)",
        time: "6:00 AM to 1:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Page assumption: about 5 hours via I-10. OSRM no-traffic Nov 24: 7 hours 2 minutes, 376 miles. Leave earlier if you use the OSRM figure or if I-10 is slow.",
        address: "Katy, TX to Jackson Square, New Orleans, LA",
        body: "Assumption labeled on this page: start in Katy, TX, I-10 east to New Orleans. No hotel is named; lodging is the owner's booking. Grocery and coffee in Katy before leaving, because Cafe du Monde is closed Christmas Day and many kitchens will be UNVERIFIED. Optional very early departure (about 4:00 AM) if you want to try for Christmas Mass; 2026 cathedral times were not posted on Nov 24.",
        sources: [S.mapsDrive, S.osrmOut, S.cafeHistory, S.cathedralMass],
      },
      {
        id: "thu-arrive-lunch",
        kind: "food",
        startMin: 780,
        endMin: 840,
        shortTitle: "Christmas lunch",
        title: "Vegetarian lunch after arrival (call first)",
        time: "1:00 to 2:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Cafe du Monde is closed Christmas Day. 2 Phat Vegans official hours include Thursday 11 AM–9 PM; Christmas Day still UNVERIFIED. Killer PoBoys Dauphine lists Wednesday–Monday 11 AM–8 PM; Christmas Day UNVERIFIED. Sweet Soulfood lists Monday–Saturday 11 AM–5 PM; Christmas Day UNVERIFIED.",
        body: "Do not count on Cafe du Monde. Call 2 Phat Vegans (Decatur, fully vegan) or Killer PoBoys before walking over. Sweet Soulfood on N. Broad is the vegan cafeteria if you have a car and they confirm they are open. Pack a cooler backup from Katy.",
        unverified: true,
        unverifiedReason: "Christmas Day hours for these kitchens are UNVERIFIED.",
        callToConfirm: "Call before you drive across town for lunch.",
        sources: [S.cafeHistory, S.twoPhat, S.killerLocations, S.sweetSoul],
      },
      {
        id: "thu-quarter",
        kind: "activity",
        startMin: 840,
        endMin: 990,
        shortTitle: "French Quarter",
        title: "French Quarter, Jackson Square, St. Louis Cathedral",
        time: "2:00 to 4:30 PM",
        windowNote: PLANNING,
        hoursNote:
          "Regular visitor hours: cathedral open daily 9:30 AM–4:00 PM, last entry 3:45 PM, with holiday variations. 2026 Christmas visitor hours were not posted Nov 24. 2024 Christmas Day news: cathedral open 8 AM–1 PM for Mass (9:00 and 11:00 AM that year). If 2026 matches 2024, a mid-afternoon arrival misses the interior.",
        address: "Jackson Square, 615 Pere Antoine Alley, New Orleans, LA",
        imageId: "jackson-square",
        body: "Walk Jackson Square, the Cabildo and Presbytere exteriors, and the cathedral facade. 2026 Christmas Mass times were not on stlouiscathedral.org on Nov 24. Use the 2024 pattern only as context (Christmas Eve vigil / midnight; Christmas Day morning Masses) and verify the 2026 bulletin. Hats off, no food or drink inside. Cafe du Monde across Decatur is closed today.",
        unverified: true,
        unverifiedReason: "2026 Christmas Mass times and visitor hours UNVERIFIED.",
        sources: [S.cathedral, S.cathedralMass, S.cathedralXmas2024, S.cathedralClosed2024, S.cafeHistory],
      },
      {
        id: "thu-streetcar",
        kind: "activity",
        startMin: 990,
        endMin: 1110,
        shortTitle: "Streetcar / Garden District",
        title: "St. Charles streetcar and Garden District stroll",
        time: "4:30 to 6:30 PM",
        windowNote: PLANNING,
        hoursNote:
          "RTA: Christmas Day uses the Sunday schedule. Adult streetcar single ride $1.25 (two-hour transfer). 1-day Jazzy Pass $3.00. Fall 2026 PDF notes a bus bridge on the Carrollton-to-Claiborne end until that project finishes; St. Charles Avenue itself is the garden-view ride.",
        address: "St. Charles Avenue / Garden District, New Orleans, LA",
        imageId: "st-charles-streetcar",
        body: "Ride the St. Charles line out and walk a few Garden District blocks. Longue Vue is closed Dec 25 (reopens Dec 26 at 8:00 AM). Lafayette Cemetery tours are a separate booking; do not assume walk-in Christmas access. This block is the walk-and-ride, not a paid house tour.",
        sources: [S.nortaHoliday, S.nortaFares, S.nortaStCharlesPdf, S.longueVueClosed],
      },
      {
        id: "thu-oaks",
        kind: "event",
        startMin: 1140,
        endMin: 1320,
        shortTitle: "Celebration in the Oaks",
        title: "Celebration in the Oaks (Christmas hours)",
        time: "7:00 to 10:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Official 2026 season: Nov 27–Jan 1. Closed Dec 7, 14, 24, and 31. Christmas Hours: 5 PM–10 PM (driving and walking tours). Friday–Saturday regular hours are also 5 PM–10 PM. You can enter from 5 PM; this block is the evening visit.",
        address: "New Orleans City Park (walking tour 7 Victory Avenue; driving tour 4 Friederichs Avenue)",
        imageId: "celebration-oaks",
        body: "City Park's light festival. Walking tour includes the amusement-park rides area and Botanical Garden per the official page. Buy tickets on celebrationintheoaks.com; prices were not copied here because the ticket calendar can change. Eat before you go: park food vegetarian options UNVERIFIED.",
        unverified: true,
        unverifiedReason: "2026 ticket prices and Christmas Night crowds UNVERIFIED in this pass.",
        sources: [S.oaks, S.oaksCityPark],
      },
      {
        id: "thu-skip-frenchmen",
        kind: "rest",
        startMin: 1320,
        endMin: 1440,
        shortTitle: "No Frenchmen (Christmas)",
        title: "Skip Frenchmen Street tonight",
        time: "10:00 PM to 12:00 AM",
        optional: true,
        body: "Snug Harbor's official calendar lists closed Christmas Day 2026, open again Dec 26. The Spotted Cat site says open 7 days, 2 PM–2 AM, with an asterisk that hours can change; a January 2026 French Quarter Journal piece says it is closed Christmas. d.b.a. lists daily hours with no Christmas note. Do not count on live music tonight. Rest, or a second Oaks loop if tickets allow.",
        unverified: true,
        unverifiedReason: "Spotted Cat and d.b.a. Christmas hours UNVERIFIED on their official pages.",
        sources: [S.snugClosed, S.spottedCat, S.dba],
      },
    ],
  },
  {
    id: "fri",
    date: "Friday, Dec 26, 2026",
    weekday: "Fri",
    short: "Fri 26",
    title: "Beignets, swamp or river, Frenchmen or drive back",
    weather: { high: "verify", sky: "NWS not yet issued" },
    items: [
      {
        id: "fri-beignets",
        kind: "food",
        startMin: 435,
        endMin: 510,
        shortTitle: "Cafe du Monde",
        title: "Cafe du Monde beignets (Dec 26)",
        time: "7:15 to 8:30 AM",
        windowNote: PLANNING,
        hoursNote:
          "Posted Friday hours 7:15 AM–12 AM. Official history: closed only Christmas Day and for an occasional hurricane. Dec 26 hours still worth a look at the door.",
        address: "800 Decatur Street, New Orleans, LA 70116",
        imageId: "cafe-du-monde",
        body: "The original stand is the Christmas-week beignet stop because Dec 25 is the published closure. Powdered sugar, cafe au lait. Dough ingredients UNVERIFIED on the fetched pages. If the line is long, this is still the right first stop before a swamp dock.",
        unverified: true,
        unverifiedReason: "Dec 26 opening and beignet ingredients UNVERIFIED at the door.",
        sources: [S.cafeHistory, S.cafeLocations],
      },
      {
        id: "fri-swamp-options",
        kind: "activity",
        startMin: 510,
        endMin: 780,
        shortTitle: "Swamp options",
        title: "Swamp tour options (not Christmas Day)",
        time: "8:30 AM to 1:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Cajun Pride: closed Christmas Day; winter boats 9:30 AM, 12:00 PM, 2:15 PM. Jean Lafitte: Groupon voucher not valid Christmas Day; winter boats 10 AM, 12 PM, 2 PM (4 PM seasonal, not winter). Honey Island: boats 9:30 AM, 12:15 PM, 2:45 PM; dock page says open every day 7:30 AM–9 PM, Christmas Day still UNVERIFIED. Pick one. Arrive 30 minutes early if self-driving.",
        body: "Christmas Day is the wrong swamp day (Cajun Pride closed; Jean Lafitte Groupon blacked out; Honey Island Christmas UNVERIFIED). Friday is the plan. Winter alligator sightings are not promised. Book direct or with the linked Groupon, then call to confirm Dec 26.",
        options: [
          {
            id: "fri-cajun-pride",
            kind: "activity",
            startMin: 510,
            endMin: 780,
            shortTitle: "Cajun Pride",
            title: "Option A: Cajun Pride (Manchac / LaPlace)",
            time: "8:30 AM to 1:00 PM",
            address: "110 Frenier Road, LaPlace, LA 70068",
            hoursNote:
              "Winter 9:30 AM, 12:00 PM, 2:15 PM. Closed Christmas Day. Q&A fetched Oct 24, 2026: call to confirm holiday schedule.",
            body: "Official: private Manchac swamp, about 27 miles from downtown / the Quarter; hotel shuttle 1.5 hours before tour time. OSRM from Jackson Square Nov 24: about 42 minutes, 29 miles. Groupon live Nov 24: swamp boat tour for two adults $39.99 (from $49.99; BLACKFRIDAY code also shown). Need-to-know: reservation required, all sales final, not within 24 hours. Official Q&A: extra coupons may not stack on already-discounted online rates. Book one or the other, not both stacked.",
            unverified: true,
            unverifiedReason: "Dec 26 departure and Groupon calendar UNVERIFIED; call (504) 467-0758.",
            sources: [S.cajunPride, S.cajunPrideQ, S.cajunPrideGroupon, S.osrm],
          },
          {
            id: "fri-jean-lafitte",
            kind: "activity",
            startMin: 510,
            endMin: 780,
            shortTitle: "Jean Lafitte",
            title: "Option B: Jean Lafitte Swamp Tours (Marrero / Barataria)",
            time: "8:30 AM to 1:00 PM",
            address: "6601 Leo Kerner Lafitte Parkway, Marrero, LA 70072",
            hoursNote:
              "BigEasy.com: daily 10 AM, 12 PM, 2 PM; 4 PM seasonal and does not run in winter. Groupon: not valid Christmas Day, New Year's Day, Mardi Gras, or special events.",
            body: "Official: about 25 minutes from New Orleans, Barataria Preserve area. OSRM from Jackson Square Nov 24: about 30 minutes, 17 miles. Groupon live Nov 24: 90-minute tour $23 (from $32); extra promo codes were also showing. Drive-up; hotel transportation is extra and seasonal. Christmas Day voucher blackout is why this sits on Dec 26. Operator Christmas Day sailing without a voucher is UNVERIFIED.",
            unverified: true,
            unverifiedReason: "Dec 26 times UNVERIFIED; call (504) 689-4186.",
            sources: [S.jeanLafitte, S.jeanLafitteBigEasy, S.jeanLafitteGroupon, S.osrm],
          },
          {
            id: "fri-honey-island",
            kind: "activity",
            startMin: 510,
            endMin: 780,
            shortTitle: "Honey Island",
            title: "Option C: Cajun Encounters Honey Island (Slidell)",
            time: "8:30 AM to 1:00 PM",
            address: "55345 US-90, Slidell, LA 70461",
            imageId: "honey-island",
            hoursNote:
              "Boats daily 9:30 AM, 12:15 PM, 2:45 PM. Dock page: 7:30 AM–9:00 PM every day. Christmas Day exception not stated; still UNVERIFIED for Dec 25. Use Dec 26.",
            body: "Official Original tour from $39.99/person, about 2 hours on the water, covered boats. OSRM from Jackson Square Nov 24: about 48 minutes, 35 miles. No Honey Island / Cajun Encounters Groupon was listed on the New Orleans or Slidell Groupon things-to-do pages fetched Nov 24. Hotel pickup is an add-on. Winter is a bird-and-cypress trip more than an alligator trip.",
            unverified: true,
            unverifiedReason: "Dec 26 inventory UNVERIFIED; call (504) 834-1770.",
            sources: [S.honeyIsland, S.honeyIslandDock, S.osrm],
          },
        ],
        sources: [S.cajunPrideQ, S.jeanLafitteGroupon, S.honeyIsland],
      },
      {
        id: "fri-lunch",
        kind: "food",
        startMin: 780,
        endMin: 840,
        shortTitle: "Lunch",
        title: "Lunch back in town",
        time: "1:00 to 2:00 PM",
        windowNote: PLANNING,
        body: "If Cafe du Monde was breakfast, use 2 Phat Vegans, Killer PoBoys, or Sweet Soulfood (open Saturday hours on the regular calendar; Friday 11 AM–5 PM posted). Confirm Friday hours. Do not order traditional red beans unless Sweet Soulfood has vegan red beans on the board.",
        unverified: true,
        unverifiedReason: "Friday hours UNVERIFIED.",
        sources: [S.twoPhat, S.killerLocations, S.sweetSoul],
      },
      {
        id: "fri-afternoon-options",
        kind: "activity",
        startMin: 840,
        endMin: 1020,
        shortTitle: "River or streetcar",
        title: "Afternoon options: river cruise or Garden District",
        time: "2:00 to 5:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Natchez / CITY of NEW ORLEANS FAQ: board 11:00 AM, 2:00 PM, 6:00 PM; depart 11:30 AM, 2:30 PM, 7:00 PM. Homepage also advertises 75-minute sightseeing cruises daily. Creole Queen historic cruise Groupon: board 1:30 PM, depart 2:00 PM, return 4:30 PM. Go City lists Creole Queen closed Dec 24–25. Pick one. A 2:30 river cruise fights a morning swamp unless the swamp was the 9:30 boat and the drive back was clean.",
        body: "Friday is the river day if the swamp ran in the morning. Christmas Eve jazz cruises are Dec 24 (CITY of NEW ORLEANS and Creole Queen), before this stay. Do not treat Dec 24 as part of this roadbook.",
        options: [
          {
            id: "fri-natchez",
            kind: "activity",
            startMin: 840,
            endMin: 1020,
            shortTitle: "Natchez / CITY",
            title: "Option A: Steamboat Natchez or Riverboat CITY of NEW ORLEANS",
            time: "2:00 to 5:00 PM",
            address: "400 Toulouse Street, New Orleans, LA 70130",
            imageId: "steamboat-natchez",
            hoursNote:
              "FAQ boarding 2:00 PM for the 2:30 PM cruise (also 11:30 AM and 7:00 PM). Operator may substitute NATCHEZ and CITY of NEW ORLEANS with no refund. Marriott/Gray Line listing: all cruises Nov 2, 2026–Jan 31, 2027 aboard CITY of NEW ORLEANS. Confirm the vessel and duration (FAQ describes 2-hour jazz cruises; homepage also says 75-minute sightseeing) when you book.",
            body: "New Orleans Steamboat Company, Toulouse Street Wharf. Groupon live Nov 24: daytime harbor cruise $38.15 (from $43.50), not valid for Sunday brunch or meal cruises; extra 2:30 PM boarding is listed in need-to-know. Christmas Day sailing is not clearly posted on the official FAQ (a third-party schedule page claims Christmas Day has only the 11:30 AM cruise). This plan uses Friday. Skip the dinner buffet for this diet unless they confirm vegetarian plates; FAQ and the Christmas Eve page say they can point to items without meat but cannot cook separate meals.",
            unverified: true,
            unverifiedReason: "Dec 26 vessel, duration, and vegetarian food UNVERIFIED. Call 504.569.1401.",
            sources: [S.natchez, S.natchezFaq, S.natchezGroupon, S.marriottCity, S.natchezXmasEve],
          },
          {
            id: "fri-creole-queen",
            kind: "activity",
            startMin: 840,
            endMin: 1020,
            shortTitle: "Creole Queen",
            title: "Option B: Creole Queen historic or jazz cruise",
            time: "2:00 to 5:00 PM",
            address: "1 Poydras Street, New Orleans, LA 70130 (Riverwalk / Canal Street dock)",
            hoursNote:
              "Historic cruise Groupon: daily board 1:30 PM, depart 2:00 PM, return 4:30 PM. Dinner jazz: board about 6:15–6:45 PM, sail 7:00–9:00 PM. Go City: closed 24–25 Dec. Official site still sells a Christmas Eve party cruise, so treat Dec 25 as closed and Dec 26 as call-ahead.",
            body: "Paddlewheeler from the Riverwalk. Groupon live Nov 24: dinner jazz cruise $54 (from $60) or jazz-only options; historic cruise about $18 (from $20). Vouchers are not accepted for specialty cruises. Groupon marketing mentions vegetarian buffet items; named vegetarian dishes were not on the official tours page fetched Nov 24. Prefer the historic / no-dinner ticket for this diet, then eat on land.",
            unverified: true,
            unverifiedReason: "Dec 26 operation and vegetarian buffet items UNVERIFIED. Call 504.529.4567.",
            sources: [S.creoleQueenTours, S.creoleQueenGroupon, S.creoleQueenHistoricGroupon, S.creoleQueenGoCity],
          },
          {
            id: "fri-streetcar",
            kind: "activity",
            startMin: 840,
            endMin: 1020,
            shortTitle: "Garden District",
            title: "Option C: Garden District and streetcar (if skipped Thursday)",
            time: "2:00 to 5:00 PM",
            address: "St. Charles Avenue / Garden District, New Orleans, LA",
            imageId: "garden-district",
            hoursNote:
              "Friday is not an RTA Sunday-schedule holiday. Longue Vue reopens Dec 26 at 8:00 AM. St. Charles adult fare $1.25.",
            body: "If Thursday was only the Quarter and Oaks, use Friday afternoon for the avenue and Garden District walk. Do not stack this on a 2:30 river cruise.",
            sources: [S.nortaFares, S.longueVueClosed, S.nortaStCharlesPdf],
          },
        ],
        sources: [S.natchezFaq, S.creoleQueenTours, S.nortaFares],
      },
      {
        id: "fri-evening-options",
        kind: "event",
        startMin: 1080,
        endMin: 1320,
        shortTitle: "Return options",
        title: "Evening options: Frenchmen, Oaks, or drive back",
        time: "6:00 to 10:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Snug Harbor: dining Sunday–Thursday 5–10 PM, Friday–Saturday 5–11 PM; music 7 PM and 9 PM; open Dec 26 after the Christmas closure. Oaks Friday 5–10 PM. I-10 return is the 5-hour assumption (OSRM 7 hours 3 minutes).",
        body: "Pick one. Frenchmen Street is the music night that Christmas blocked. Oaks is the second chance if Thursday was too late. Driving back to Katy Friday night is long after a swamp morning; Saturday morning return is the gentler option if the owner booked a second night.",
        options: [
          {
            id: "fri-frenchmen",
            kind: "event",
            startMin: 1080,
            endMin: 1320,
            shortTitle: "Frenchmen Street",
            title: "Frenchmen Street music (Snug Harbor open Dec 26)",
            time: "6:00 to 10:00 PM",
            address: "Frenchmen Street, Faubourg Marigny, New Orleans, LA",
            imageId: "frenchmen-street",
            body: "Snug Harbor, 626 Frenchmen Street, (504) 949-0696: official post says closed Christmas Day 2026 and open Dec 26. The Spotted Cat, 623 Frenchmen: posted 2 PM–2 AM seven days, hours subject to change. d.b.a., 618 Frenchmen: open daily 6 PM–1 AM (Saturday 2 PM–1 AM). Check each door's board. Eat vegan/vegetarian before the clubs (2 Phat Vegans is on Decatur, a short walk).",
            unverified: true,
            unverifiedReason: "Dec 26 lineups UNVERIFIED. Cover charges UNVERIFIED.",
            sources: [S.snugClosed, S.spottedCat, S.dba, S.twoPhat],
          },
          {
            id: "fri-oaks",
            kind: "event",
            startMin: 1080,
            endMin: 1320,
            shortTitle: "Oaks again",
            title: "Celebration in the Oaks (Friday 5–10 PM)",
            time: "6:00 to 10:00 PM",
            address: "New Orleans City Park",
            imageId: "celebration-oaks",
            hoursNote: "Friday hours 5 PM–10 PM driving and walking tours. Not a closed night (closed nights are Dec 7, 14, 24, 31).",
            body: "Use Friday if Christmas Night was too late after the drive. Same official ticket site.",
            sources: [S.oaks],
          },
          {
            id: "fri-drive-back",
            kind: "drive",
            startMin: 1080,
            endMin: 1320,
            shortTitle: "Drive to Katy",
            title: "Drive back to Katy (I-10 assumption)",
            time: "6:00 to 10:00 PM",
            hoursNote:
              "Page assumption: about 5 hours via I-10. OSRM no-traffic Nov 24: 7 hours 3 minutes, 377 miles. A 6:00 PM departure is a late Katy arrival either way.",
            body: "Assumption labeled on this page: return to Katy, TX, via I-10. Overnight lodging in New Orleans is the owner's booking if you wait until Saturday morning instead.",
            sources: [S.mapsDriveBack, S.osrmBack],
          },
        ],
        sources: [S.snugClosed, S.oaks, S.mapsDriveBack],
      },
    ],
  },
];

export const events: TripEvent[] = [
  {
    id: "oaks-xmas",
    when: "Thu Dec 25, 5–10 PM (Christmas hours)",
    dates: ["2026-12-25"],
    title: "Celebration in the Oaks, Christmas Night",
    where: "New Orleans City Park",
    detail:
      "Official 2026 season Nov 27–Jan 1. Closed Dec 7, 14, 24, 31. Christmas Hours 5–10 PM for driving and walking tours. This is the holiday event that is actually open Christmas Night.",
    sources: [S.oaks, S.oaksCityPark],
    imageId: "celebration-oaks",
  },
  {
    id: "oaks-fri",
    when: "Fri Dec 26, 5–10 PM",
    dates: ["2026-12-26"],
    title: "Celebration in the Oaks, Friday",
    where: "New Orleans City Park",
    detail: "Friday–Saturday hours 5–10 PM. Backup if the Christmas Night drive ran late.",
    sources: [S.oaks],
    imageId: "celebration-oaks",
  },
  {
    id: "cathedral-context",
    when: "Christmas Mass context (verify 2026 bulletin)",
    dates: ["2026-12-25"],
    title: "St. Louis Cathedral Christmas Mass / visitor hours",
    where: "St. Louis Cathedral, Jackson Square",
    detail:
      "2026 Christmas Mass times were not posted on Nov 24. Regular visitor hours are 9:30 AM–4:00 PM with holiday variations. 2024 published pattern: Christmas Eve vigil and midnight Mass; Christmas Day 9:00 AM and 11:00 AM, building open 8 AM–1 PM that year. Treat 2026 as UNVERIFIED. A Katy departure at 6:00 AM will not make morning Mass.",
    unverified: true,
    unverifiedReason: "2026 Christmas Mass times UNVERIFIED.",
    sources: [S.cathedral, S.cathedralMass, S.cathedralXmas2024, S.cathedralClosed2024],
    imageId: "jackson-square",
  },
  {
    id: "snug-26",
    when: "Fri Dec 26, music 7 PM and 9 PM (posted)",
    dates: ["2026-12-26"],
    title: "Snug Harbor open again (closed Christmas Day)",
    where: "626 Frenchmen Street",
    detail:
      "Official event: closed Christmas Day 2026 so staff and musicians can be off; open Dec 26. Dining Friday 5–11 PM; music room showtimes 7 PM and 9 PM on the hours blurb. Lineup UNVERIFIED.",
    unverified: true,
    unverifiedReason: "Dec 26 performers UNVERIFIED.",
    sources: [S.snugClosed],
    imageId: "frenchmen-street",
  },
  {
    id: "bonfires-note",
    when: "Wed Dec 24 (the night before this trip)",
    dates: ["2026-12-24"],
    title: "Bonfires on the levee (not this stay)",
    where: "St. James Parish / River Road, not New Orleans",
    detail:
      "Christmas Eve bonfires on the Mississippi River levees are a St. James Parish tradition on Dec 24. This roadbook is Dec 25–26 from Katy. Mentioned only so nobody plans them for Christmas Night in the Quarter. They are not a New Orleans French Quarter event.",
    sources: [S.natchezHolidays],
  },
];

export const afterThisTrip = {
  title: "Before and after these two days",
  items: [
    {
      text: "Christmas Eve (Dec 24) is outside this stay: St. James Parish bonfires, Creole Queen Christmas Eve party cruise, and the CITY of NEW ORLEANS Christmas Eve jazz cruise (boarding 6:00 PM, sailing 7:00–9:00 PM). Réveillon menus at Tujague's run Dec 1–24 only.",
      sources: [S.natchezXmasEve, S.creoleQueenXmasEve, S.tujaguesReveillon],
    },
  ],
};

export const drives: DriveRow[] = [
  {
    id: "jackson-square",
    place: "Jackson Square and St. Louis Cathedral",
    drive: "Walk from the French Quarter. No OSRM drive.",
    reservations: "Cathedral visitor entry is free during posted visitor hours. Mass is not a ticketed tour.",
    notes:
      "Regular visitor hours 9:30 AM–4:00 PM, last entry 3:45 PM, holiday variations. 2026 Christmas hours UNVERIFIED. 2024 Christmas Day open 8 AM–1 PM.",
    unverified: true,
    unverifiedReason: "2026 Christmas visitor hours UNVERIFIED.",
    sources: [S.cathedral, S.cathedralClosed2024],
    imageId: "jackson-square",
    group: "in-town",
  },
  {
    id: "cafe-du-monde",
    place: "Cafe du Monde, French Market",
    drive: "Walk from Jackson Square (across Decatur).",
    reservations: "No reservations. Closed Christmas Day.",
    notes: "Posted hours 7:15 AM–11 PM Sun–Thu, 7:15 AM–12 AM Fri–Sat. History page: closed only Christmas Day and for an occasional hurricane.",
    sources: [S.cafeHistory, S.cafeLocations],
    imageId: "cafe-du-monde",
    group: "in-town",
  },
  {
    id: "natchez",
    place: "Steamboat Natchez / Riverboat CITY of NEW ORLEANS",
    drive: "Walk from Jackson Square to 400 Toulouse Street.",
    reservations: "Book the ticketed cruise. Operator may substitute vessels.",
    reserve: true,
    notes:
      "FAQ: board 11:00 AM / 2:00 PM / 6:00 PM; depart 11:30 AM / 2:30 PM / 7:00 PM. Groupon harbor cruise $38.15 from $43.50 (Nov 24). Christmas Eve dinner jazz is Dec 24 on CITY of NEW ORLEANS. Dec 25 sailing UNVERIFIED; this plan uses Dec 26. Gray Line listing: Nov 2, 2026–Jan 31, 2027 cruises aboard CITY of NEW ORLEANS.",
    unverified: true,
    unverifiedReason: "Dec 26 vessel and whether NATCHEZ or CITY sails UNVERIFIED.",
    sources: [S.natchez, S.natchezFaq, S.natchezGroupon, S.marriottCity, S.natchezXmasEve],
    imageId: "steamboat-natchez",
    group: "in-town",
  },
  {
    id: "creole-queen",
    place: "Paddlewheeler Creole Queen",
    drive: "Walk or short ride to 1 Poydras Street (Riverwalk / Canal Street dock).",
    reservations: "Reservation required on the Groupon historic-cruise terms.",
    reserve: true,
    notes:
      "Go City lists closed Dec 24–25. Official site still lists a Christmas Eve party cruise. Groupon dinner jazz $54 from $60; historic cruise about $18 from $20 (Nov 24). Use Dec 26 and call. Vegetarian buffet items UNVERIFIED.",
    unverified: true,
    unverifiedReason: "Dec 26 operation UNVERIFIED.",
    sources: [S.creoleQueenTours, S.creoleQueenGoCity, S.creoleQueenGroupon, S.creoleQueenHistoricGroupon],
    group: "in-town",
  },
  {
    id: "frenchmen",
    place: "Frenchmen Street",
    drive: "Walk from the lower Quarter into Faubourg Marigny.",
    reservations: "Club cover varies; Snug Harbor is closed Christmas Day 2026.",
    notes: "Music night for this roadbook is Friday Dec 26. Skip Christmas Night as a plan.",
    sources: [S.snugClosed, S.spottedCat, S.dba],
    imageId: "frenchmen-street",
    group: "in-town",
  },
  {
    id: "streetcar",
    place: "St. Charles streetcar and Garden District",
    drive: "Streetcar from Canal / St. Charles. Adult $1.25 single ride; $3 1-day Jazzy Pass.",
    reservations: "No reservation for the streetcar. Christmas Day = Sunday schedule.",
    notes:
      "Fall 2026 PDF: bus bridge at the Carrollton and Claiborne end until that project finishes. Avenue ride is still the Garden District view. Longue Vue closed Dec 25, open Dec 26 8:00 AM.",
    sources: [S.nortaFares, S.nortaHoliday, S.nortaStCharlesPdf, S.longueVueClosed],
    imageId: "st-charles-streetcar",
    group: "nearby",
  },
  {
    id: "oaks",
    place: "Celebration in the Oaks, City Park",
    drive: "Streetcar Canal/City Park or drive. Walking tour 7 Victory Avenue; driving tour 4 Friederichs Avenue.",
    reservations: "Buy tickets on the official site. Closed Dec 7, 14, 24, 31.",
    reserve: true,
    notes: "2026 season Nov 27–Jan 1. Christmas Hours 5–10 PM. Friday 5–10 PM. Bike Nights are Nov 30–Dec 3, not this stay.",
    sources: [S.oaks, S.oaksCityPark],
    imageId: "celebration-oaks",
    group: "nearby",
  },
  {
    id: "cajun-pride",
    place: "Cajun Pride Swamp Tours",
    drive: "OSRM from Jackson Square Nov 24: about 42 minutes, 29 miles to 110 Frenier Road, LaPlace. Official: 27 miles from downtown.",
    reservations: "Reservations strongly recommended. Closed Christmas Day, Thanksgiving, Mardi Gras.",
    reserve: true,
    notes:
      "Winter 9:30 AM, 12:00 PM, 2:15 PM. Groupon for two $39.99 from $49.99 (Nov 24). Put this on Dec 26. Call (504) 467-0758.",
    sources: [S.cajunPride, S.cajunPrideQ, S.cajunPrideGroupon],
    group: "i10",
  },
  {
    id: "jean-lafitte",
    place: "Jean Lafitte Swamp Tours",
    drive: "OSRM from Jackson Square Nov 24: about 30 minutes, 17 miles to 6601 Leo Kerner Lafitte Parkway, Marrero. Official: about 25 minutes from New Orleans.",
    reservations: "Reservation required. Groupon not valid Christmas Day, New Year's Day, Mardi Gras, or special events.",
    reserve: true,
    notes: "Winter 10 AM, 12 PM, 2 PM. Groupon 90-minute tour $23 from $32 (Nov 24). Put this on Dec 26. Call (504) 689-4186.",
    sources: [S.jeanLafitte, S.jeanLafitteBigEasy, S.jeanLafitteGroupon],
    group: "i10",
  },
  {
    id: "honey-island",
    place: "Cajun Encounters Honey Island Swamp",
    drive: "OSRM from Jackson Square Nov 24: about 48 minutes, 35 miles to 55345 US-90, Slidell. Official: about 45 minutes from the Quarter.",
    reservations: "Book on cajunencounters.com. No Groupon listing found Nov 24 on NOLA or Slidell things-to-do pages.",
    reserve: true,
    notes:
      "Boats 9:30 AM, 12:15 PM, 2:45 PM. Original tour from $39.99/person. Dock page says open every day 7:30 AM–9 PM; still verify Christmas. This plan uses Dec 26. Call (504) 834-1770.",
    unverified: true,
    unverifiedReason: "Christmas Day operation UNVERIFIED despite daily hours.",
    sources: [S.honeyIsland, S.honeyIslandDock],
    imageId: "honey-island",
    group: "i10",
  },
  {
    id: "i10-drive",
    place: "I-10 from Katy",
    drive:
      "Assumption: about 5 hours each way via I-10. OSRM no-traffic Nov 24: 7 hours 2 minutes outbound, 376 miles; 7 hours 3 minutes return, 377 miles.",
    reservations: "None. Live traffic can beat or blow the assumption.",
    notes:
      "Labeled assumption on the page: Katy, TX start and return. Use the Google Maps links on travel day.",
    sources: [S.mapsDrive, S.mapsDriveBack, S.osrmOut, S.osrmBack],
    group: "longer",
  },
];

export const alerts: AlertItem[] = [
  {
    id: "xmas-closures",
    tone: "warn",
    title: "Christmas Day closures (plan around Dec 25)",
    body: "Cafe du Monde: closed Christmas Day (official). Cajun Pride: closed Christmas Day (official Q&A). Jean Lafitte Groupon: not valid Christmas Day. Creole Queen: Go City lists closed Dec 24–25 (official still lists a Dec 24 cruise; treat Dec 25 as closed). Snug Harbor: closed Christmas Day 2026. Longue Vue: closed Dec 25, open Dec 26 8:00 AM. Celebration in the Oaks: closed Dec 24, open Christmas Night 5–10 PM. St. James Parish bonfires are Dec 24, not this stay.",
    sources: [
      S.cafeHistory,
      S.cajunPrideQ,
      S.jeanLafitteGroupon,
      S.creoleQueenGoCity,
      S.snugClosed,
      S.longueVueClosed,
      S.oaks,
    ],
  },
  {
    id: "drive-assumption",
    tone: "info",
    title: "Katy start/return is an assumption",
    body: "This page assumes Katy, TX, about 5 hours each way on I-10. OSRM no-traffic is longer (about 7 hours 2 minutes, 376 miles). Lodging is the owner's booking and is not named.",
    sources: [S.mapsDrive, S.osrmOut],
  },
  {
    id: "weather-gap",
    tone: "info",
    title: "No NWS forecast for Dec 25–26 yet",
    body: "On Nov 24, 2026 the NWS 7-day point forecast does not reach these dates. Re-check the New Orleans point page the week of the trip. Do not pack from invented highs.",
    sources: [S.nwsPoint],
  },
  {
    id: "reveillon",
    tone: "info",
    title: "Réveillon is not a Christmas Day vegetarian plan",
    body: "Checked 2026 Réveillon menus are meat and seafood prix-fixe and end on or before Dec 24 (Tujague's last night Christmas Eve, not offered Dec 25; Muriel's through Dec 23; Galatoire's Dec 1–24; Windsor Court Réveillon excludes Dec 24–25). No vegetarian Réveillon menu was found.",
    sources: [S.tujaguesReveillon, S.galatoiresReveillon, S.murielsReveillon, S.windsorReveillon],
  },
];

export const foldNotes: FoldNote[] = [
  {
    title: "Lodging",
    body: "Overnight lodging is the owner's booking. This public page does not name a hotel, a neighborhood rental, or a personal address. City names only.",
  },
  {
    title: "Drive assumption",
    body: "Start and return from Katy, TX, about 5 hours each way via I-10. OSRM no-traffic Nov 24, 2026: 7 hours 2 minutes, 376 miles outbound; 7 hours 3 minutes, 377 miles back. Use live Google Maps on the day.",
    sources: [S.mapsDrive, S.mapsDriveBack, S.osrmOut, S.osrmBack],
  },
  {
    title: "Why the swamp and river sit on Friday",
    body: "Cajun Pride is closed Christmas Day. Jean Lafitte's Groupon is not valid Christmas Day. Creole Queen is listed closed Dec 24–25 on Go City. Cafe du Monde is closed Christmas Day. Celebration in the Oaks is the Christmas Night event that is actually posted open (5–10 PM). Friday Dec 26 is the tour day.",
    sources: [S.cajunPrideQ, S.jeanLafitteGroupon, S.creoleQueenGoCity, S.cafeHistory, S.oaks],
  },
  {
    title: "Bonfires on the levee",
    body: "Christmas Eve levee bonfires are Dec 24 in St. James Parish, upriver, not in the French Quarter. They are the night before this stay unless the owner drives on Christmas Eve. Not scheduled here.",
    sources: [S.natchezHolidays],
  },
];

export const content = {
  meta,
  weather,
  diet,
  driveIn,
  foodPicks,
  extraFoodCards,
  weakerFood,
  days,
  events,
  afterThisTrip,
  drives,
  alerts,
  photos,
  photoGaps,
  foldNotes,
} satisfies TripContent & { afterThisTrip: typeof afterThisTrip };

export type NolaContent = typeof content;
