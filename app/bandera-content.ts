/**
 * Bandera / Flying L Ranch trip facts.
 * Researched Monday, Nov 23, 2026, America/Chicago (CST).
 * Every factual claim carries a source. Unconfirmed items set unverified: true.
 * Do not invent hours, menus, prices, or times.
 */

export type SourceLink = {
  href: string;
  label: string;
};

export type Dish = {
  name: string;
  detail: string;
  unverified?: boolean;
  unverifiedReason?: string;
  skip?: boolean;
  skipReason?: string;
};

export type FoodCard = {
  rank: number;
  name: string;
  blurb: string;
  address: string;
  phone?: string;
  hours: string;
  hoursUnverified?: boolean;
  dishes: Dish[];
  ask: string[];
  sources: SourceLink[];
  notes?: string[];
  imageId?: string;
};

export type BlockKind = "drive" | "food" | "activity" | "event" | "rest";

export type ItineraryItem = {
  id: string;
  time: string;
  title: string;
  shortTitle: string;
  body: string;
  kind: BlockKind;
  startMin: number;
  endMin: number;
  windowNote?: string;
  hoursNote?: string;
  optional?: boolean;
  imageId?: string;
  address?: string;
  unverified?: boolean;
  unverifiedReason?: string;
  callToConfirm?: string;
  sources: SourceLink[];
  options?: ItineraryItem[];
};

export type DayPlan = {
  id: string;
  date: string;
  weekday: string;
  short: string;
  title: string;
  weather: { high: string; low?: string; sky: string };
  items: ItineraryItem[];
};

export type TripEvent = {
  id: string;
  when: string;
  dates: string[];
  title: string;
  where: string;
  detail: string;
  unverified?: boolean;
  unverifiedReason?: string;
  sources: SourceLink[];
  imageId?: string;
};

export type DriveRow = {
  id: string;
  place: string;
  drive: string;
  reservations: string;
  reserve?: boolean;
  unverified?: boolean;
  unverifiedReason?: string;
  notes: string;
  sources: SourceLink[];
  imageId?: string;
  group: "in-town" | "nearby" | "i10" | "longer";
};

export type PlacePhoto = {
  id: string;
  src: string;
  alt: string;
  credit: string;
  license: string;
  licenseHref: string;
  commonsHref: string;
  note: string;
};

export type AlertItem = {
  id: string;
  tone: "warn" | "info";
  title: string;
  body: string;
  unverified?: boolean;
  unverifiedReason?: string;
  sources: SourceLink[];
};

export const S = {
  flyingl: { href: "https://flyingl.com/", label: "flyingl.com" },
  flyinglContact: { href: "https://flyingl.com/contact-us/", label: "Flying L contact" },
  flyinglActivities: {
    href: "https://flyingl.com/vacation-ownership/",
    label: "Flying L vacation ownership / activities",
  },
  flyinglRestaurant: {
    href: "https://flyingl.com/wild-west-bar-grill/",
    label: "Wild West Bar & Grill",
  },
  booking: {
    href: "https://www.booking.com/hotel/us/flying-l-guest-ranch.html",
    label: "Booking.com listing (OTA, not official)",
  },
  priceline: {
    href: "https://www.priceline.com/hotel-deals/en-us/P3000020867/H18266504/flying-l-ranch-resort-golf-course.ssp",
    label: "Priceline listing (OTA, not official)",
  },
  mapsDrive: {
    href: "https://www.google.com/maps/dir/Katy,+TX/675+Flying+L+Dr,+Bandera,+TX+78003",
    label: "Google Maps: Katy to Flying L",
  },
  mapsDriveBack: {
    href: "https://www.google.com/maps/dir/675+Flying+L+Dr,+Bandera,+TX+78003/Katy,+TX",
    label: "Google Maps: Flying L to Katy",
  },
  osrm: {
    href: "https://router.project-osrm.org/",
    label: "OSRM routing (computed Nov 23, 2026, no traffic)",
  },
  osrmOut: {
    href: "https://router.project-osrm.org/route/v1/driving/-95.8243956,29.7857853;-99.0481450,29.7126941?overview=false",
    label: "OSRM Katy to Flying L (no traffic)",
  },
  osrmBack: {
    href: "https://router.project-osrm.org/route/v1/driving/-99.0481450,29.7126941;-95.8243956,29.7857853?overview=false",
    label: "OSRM Flying L to Katy (no traffic)",
  },
  papsMaps: {
    href: "https://www.google.com/maps/search/?api=1&query=Pap%27s+Italian+Grill+632+TX-16+Bandera+TX+78003",
    label: "Google Maps: Pap's Italian Grill",
  },
  papsMenuWeb: {
    href: "http://menusweb.com/restaurants/paps-italian-grill-menu-bandera",
    label: "Menusweb Pap's menu (third-party)",
  },
  papsSlice: {
    href: "https://papsitaliangrillbandera.com/",
    label: "Pap's Italian Grill order page",
  },
  papsCounty: {
    href: "https://amlegdistrict21.us/news-events/20260320_DECBanderaEateries.pdf",
    label: "Bandera County eateries list (June 2025 PDF)",
  },
  frontierTimes: {
    href: "https://www.frontiertimesmuseum.org/",
    label: "Frontier Times Museum",
  },
  frontierEvents: {
    href: "https://www.frontiertimesmuseum.org/events",
    label: "Frontier Times Museum events",
  },
  banderaNhm: {
    href: "https://www.banderanhm.org/",
    label: "Bandera Natural History and Art Museum",
  },
  loveCreek: { href: "https://lovecreekorchards.com/", label: "Love Creek Orchards" },
  loveCreekHours: {
    href: "https://lovecreekorchards.com/?page_id=1639",
    label: "Love Creek hours / contact",
  },
  cibolo: {
    href: "https://www.cibolo.org/cibolo-nature-center",
    label: "Cibolo Nature Center (The Cibolo)",
  },
  buceesFaq: {
    href: "https://buc-ees.com/about/frequently-asked-questions/",
    label: "Buc-ee's FAQ (hours and kitchen)",
  },
  buceesLocations: { href: "https://buc-ees.com/locations/", label: "Buc-ee's locations" },
  fox4heb: {
    href: "https://www.fox4news.com/news/thanksgiving-day-store-hours-2026-which-dfw-grocery-stores-retailers-open",
    label: "FOX 4: H-E-B Thanksgiving 2026 hours (Nov 19, 2026)",
  },
  nwsPoint: {
    href: "https://forecast.weather.gov/MapClick.php?lat=29.7269&lon=-99.0738",
    label: "NWS point forecast for Bandera",
  },
  nwsZone: {
    href: "https://forecast.weather.gov/product.php?issuedby=EWX&product=ZFP&site=EWX",
    label: "NWS Austin/San Antonio zone forecast (TXZ187)",
  },
  tjs: { href: "https://tjsoldforge.com/", label: "TJ's @ The Old Forge" },
  tjsMenu: {
    href: "https://tjsoldforge.com/wp-content/uploads/2026/06/Main-Menu-May-2026-Revision-1_bleed-2.pdf",
    label: "TJ's Main Menu May 2026 Revision (PDF)",
  },
  paniolo: { href: "https://www.paniolowinerytx.com/", label: "Paniolo Winery" },
  panioloMenu: {
    href: "https://www.paniolowinerytx.com/menu?menu=menu",
    label: "Paniolo menu",
  },
  chinaBowl: { href: "https://www.chinabowlbandera.com/", label: "China Bowl" },
  chinaBowlMenu: { href: "https://www.chinabowlbandera.com/menu/", label: "China Bowl official menu page" },
  menupix: {
    href: "https://www.menupix.com/menudirectory/menu.php?id=4305468&type=6",
    label: "Menupix China Bowl transcript (third-party)",
  },
  ost: { href: "https://www.ostbandera.com/", label: "OST Restaurant" },
  mamacitas: { href: "https://mamacitas.com/food-menu", label: "Mamacita's food menu" },
  lowes: {
    href: "https://www.lowesmarket.com/StoreLocator/Store/?L=102",
    label: "Lowe's Market store 102, Bandera",
  },
  heb: { href: "https://www.heb.com/", label: "H-E-B" },
  khou: {
    href: "https://www.khou.com/article/news/nation-world/thanksgiving-day-store-hours-whats-open-closed/507-21ce3069-0339-4818-9711-a6541c05424b",
    label: "KHOU Thanksgiving 2026 store hours (Nov 20, 2026)",
  },
  cityCal: {
    href: "https://www.banderatx.gov/calendar/month/2026-11",
    label: "City of Bandera calendar, Nov 2026",
  },
  prophet: { href: "https://www.banderaprophet.com/", label: "Bandera Prophet" },
  prophetNews: { href: "https://www.banderaprophet.com/news.html", label: "Bandera Prophet news" },
  prophetCommunity: {
    href: "https://www.banderaprophet.com/community.html",
    label: "Bandera Prophet community",
  },
  prophetBurnBan: {
    href: "https://www.banderaprophet.com/uploads/1/2/4/1/12411578/261002_burn_ban_lifted_pdf.pdf",
    label: "Burn-ban lifted PDF (Prophet)",
  },
  bbaChristmas: {
    href: "https://banderabusiness.com/2026-cowboy-christmas",
    label: "BBA 2026 Cowboy Christmas",
  },
  gillTeich: {
    href: "https://gillteichgroup.com/blog/banderas-trail-of-lights-is-meant-to-grow-this-year-heres-how-the-holiday-season-lines-up",
    label: "Gill Teich Group, Nov 5, 2026",
  },
  dickens: {
    href: "https://holidaysinboerne.com/dickens-on-main",
    label: "Dickens on Main (official)",
  },
  dickensChamber: {
    href: "https://business.boerne.org/events/details/2026-dickens-on-main-34453",
    label: "Greater Boerne Chamber: 2026 Dickens on Main",
  },
  kerrvilleMarket: {
    href: "https://kerrvillecrafted.com/event/christmas-indian-market-at-mowa/2026-11-26/",
    label: "Kerrville CVB: Christmas Indian Market at MOWA",
  },
  mowa: { href: "https://www.museumofwesternart.com/", label: "Museum of Western Art" },
  eleventh: {
    href: "https://11thstreetcowboybar.com/event-schedule/",
    label: "11th Street Cowboy Bar event schedule",
  },
  outhouse: {
    href: "https://events.outhousetickets.com/e/11th-street-cowboy-bar-kin-faux-112826",
    label: "Outhouse tickets: Kin Faux Nov 28",
  },
  rickRice: { href: "https://rickriceband.com/events", label: "Rick Rice Band events" },
  onat8: {
    href: "https://onat8.com/article/hill-country-kin-faux-brings-fiddle-and-family-to-banderas-11th-street-cowboy-bar-on-nov-28",
    label: "ONAT8 Kin Faux preview, Nov 20",
  },
  saHolidays: {
    href: "https://www.sa.gov/Directory/News-Releases/Celebrate-the-Holidays-in-Downtown-San-Antonio-2026",
    label: "City of San Antonio holiday release, Nov 18, 2026",
  },
  goDowntown: { href: "https://www.sa.gov/GoDowntown", label: "SA.gov/GoDowntown" },
  hillCountrySun: {
    href: "https://events.hillcountrysun.com/events/260806f3-5963-4d06-abe0-578b749c718d",
    label: "Hill Country Sun: Christmas Lighting in Bandera City Park",
  },
  cvbNov: {
    href: "https://www.banderacowboycapital.com/events/november",
    label: "Bandera CVB November events (403 at fetch time)",
  },
  hillCountryAi: {
    href: "https://hillcountry.ai/bandera/downtown/",
    label: "hillcountry.ai downtown Bandera (secondary)",
  },
  hillCountrySna: {
    href: "https://tpwd.texas.gov/state-parks/hill-country",
    label: "TPWD Hill Country SNA",
  },
  lostMaples: {
    href: "https://tpwd.texas.gov/state-parks/lost-maples",
    label: "TPWD Lost Maples SNA",
  },
  lostMaplesFoliage: {
    href: "https://tpwd.texas.gov/state-parks/lost-maples/foliage-reports",
    label: "Lost Maples foliage reports",
  },
  lostMaplesAlert: {
    href: "https://tpwd.texas.gov/state-parks/lost-maples/alert",
    label: "Lost Maples alerts",
  },
  garner: { href: "https://tpwd.texas.gov/state-parks/garner", label: "TPWD Garner State Park" },
  guadalupe: {
    href: "https://tpwd.texas.gov/state-parks/guadalupe-river",
    label: "TPWD Guadalupe River State Park",
  },
  enchantedRock: {
    href: "https://tpwd.texas.gov/state-parks/enchanted-rock",
    label: "TPWD Enchanted Rock SNA",
  },
  dayPassFaqs: {
    href: "https://tpwd.texas.gov/state-parks/park-reservation-information/day-pass-faqs",
    label: "TPWD day pass FAQs",
  },
  reserveAmerica: {
    href: "https://texasstateparks.reserveamerica.com/",
    label: "Texas State Parks reservations",
  },
  cave: { href: "https://www.cavewithoutaname.com/", label: "Cave Without a Name" },
  nbc: { href: "https://www.naturalbridgecaverns.com/", label: "Natural Bridge Caverns" },
  nbcFaqs: { href: "https://www.naturalbridgecaverns.com/faqs/", label: "Natural Bridge Caverns FAQs" },
  nbcHours: { href: "https://naturalbridgecaverns.com/park-hours/", label: "Natural Bridge Caverns park hours" },
} as const satisfies Record<string, SourceLink>;

export const SOURCE_CATALOG: SourceLink[] = Object.values(S);

const PHOTO_NOTE =
  "Resized and compressed to WebP from the Wikimedia Commons original. Not a current-hours photo.";

export const photos: PlacePhoto[] = [
  {
    id: "downtown-bandera",
    src: "/images/downtown-bandera.webp",
    alt: "Bandera County Courthouse on Main Street in Bandera, Texas",
    credit: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Bandera_county_courthouse.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "frontier-times",
    src: "/images/frontier-times.webp",
    alt: "Frontier Times Museum building in Bandera, Texas",
    credit: "Billy Hathorn",
    license: "CC BY-SA 3.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Frontier_Times_Museum,_Bandera,_TX_Picture_091.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "hill-country-sna",
    src: "/images/hill-country-sna.webp",
    alt: "Overlook at Hill Country State Natural Area in Bandera County, Texas",
    credit: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Overlook_View_Hill_Country_SNA_Texas_2023.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "lost-maples",
    src: "/images/lost-maples.webp",
    alt: "Scenic overlook at Lost Maples State Natural Area",
    credit: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Lost_Maples_Scenic_Overlook_2021.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "medina-river",
    src: "/images/medina-river.webp",
    alt: "Bald cypress on the Medina River at Bandera Park, Bandera, Texas",
    credit: "Stewart Tomlinson, U.S. Geological Survey",
    license: "Public domain (USGS)",
    licenseHref: "https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Medina_river_bandera_texas.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "ost",
    src: "/images/ost.webp",
    alt: "Counter at the Old Spanish Trail Restaurant in Bandera, Texas",
    credit: "Myotus",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Old_Spanish_Trail_Restaurant-counter.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "bucees-luling",
    src: "/images/bucees-luling.webp",
    alt: "Interior of Buc-ee's in Luling, Texas, the I-10 stop between Katy and Bandera",
    credit: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Bucees_Interior_Luling_Texas_2024.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "river-walk",
    src: "/images/river-walk.webp",
    alt: "San Antonio River Walk at night with holiday lights (December 2014)",
    credit: "Nan Palmero",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    commonsHref:
      "https://commons.wikimedia.org/wiki/File:San_Antonio_Riverwalk_at_Night_with_Christmas_Lights_(2014-12-12_22.36.46_by_Nan_Palmero).jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "cave",
    src: "/images/cave.webp",
    alt: "Entrance to Cave Without a Name near Boerne, Texas",
    credit: "Pi3.124",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Cave_Without_A_Name_entrance.jpg",
    note: PHOTO_NOTE,
  },
  {
    id: "boerne-main",
    src: "/images/boerne-main.webp",
    alt: "Main Street in Boerne, Texas, site of Dickens on Main",
    credit: "Larry D. Moore",
    license: "CC BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    commonsHref: "https://commons.wikimedia.org/wiki/File:Boerne_Main_Street_2026.jpg",
    note: PHOTO_NOTE,
  },
];

export const photosById: Record<string, PlacePhoto> = Object.fromEntries(photos.map((photo) => [photo.id, photo]));

export const photoGaps = [
  "Flying L Ranch Resort (no reusable photo found on Wikimedia Commons)",
  "Pap's Italian Grill",
  "TJ's @ The Old Forge",
  "Paniolo Winery",
  "China Bowl",
  "Mamacita's, Kerrville",
  "H-E-B in Katy (no store-specific reusable photo; city name only)",
  "Buc-ee's Katy (the Luling photo is the I-10 store, not Katy)",
  "Bandera Natural History and Art Museum",
  "11th Street Cowboy Bar",
  "Arkey Blue's Silver Dollar",
  "Cibolo Nature Center",
  "Love Creek Orchards",
  "Museum of Western Art / Kerrville Christmas Indian Market",
];

const PLANNING =
  "Suggested planning window, not a confirmed reservation or guaranteed clock time.";

export const meta = {
  title: "Flying L Ranch · Bandera, TX",
  dates: "Thu Nov 26 to Sun Nov 29, 2026",
  timezone: "America/Chicago",
  timezoneNote: "All times America/Chicago (CST on these dates).",
  researchedAsOf: "Nov 23, 2026",
  researchedAsOfLong: "Monday, Nov 23, 2026",
  stayName: "Flying L Ranch Resort",
  stayAddress: "675 Flying L Dr, Bandera, TX 78003",
  stayPhone: "(830) 796-7745",
  stayPhoneTel: "tel:+18307967745",
  originCity: "Katy, TX",
};

export const resort = {
  hours:
    "Listed Flying L Ranch Hours: Mon-Thu 8am-9pm; Fri-Sat 8am-10pm; Sun 8am-9pm. Sources do not clearly label these as front-desk vs. restaurant hours.",
  checkIn: {
    summary:
      "Check-in and check-out times are not published on flyingl.com (pages fetched Nov 23). Booking.com: check-in from 4:00 PM to 9:00 PM; check-out from 7:00 AM to 10:00 AM; photo ID and credit card at check-in; tell the property arrival time in advance. Priceline: check-in after 4:00 PM, check-out before 10:00 AM.",
    unverified: true,
    unverifiedReason:
      "UNVERIFIED on the official site. Confirm with the front desk at (830) 796-7745. The itinerary uses 4:00 PM check-in and 10:00 AM checkout only as a working assumption from OTAs.",
    sources: [S.flyingl, S.flyinglContact, S.booking, S.priceline],
  },
  pool: {
    summary: "Main House Pool, 9 am-9 pm daily.",
    note: "Forecast highs are only 62-73°F with nights in the 30s-40s, so the pool is optional.",
    sources: [S.flyinglActivities],
  },
  activities: {
    summary:
      "Included: multiple sport courts; campfire and s'mores Tue-Sat; wagon rides Tue-Sat; basketball, tennis, sand volleyball, ping-pong, outdoor shuffleboard, horseshoes, pickleball, catch-and-release fishing. For this stay, campfire/s'mores and wagon rides are listed for Thu, Fri, Sat, not Sunday.",
    unverified: true,
    unverifiedReason: "Times of day for campfire, s'mores, and wagon rides are UNVERIFIED.",
    sources: [S.flyinglActivities],
  },
  dining: {
    summary:
      "The onsite restaurant is open Tuesday-Sunday with live music most weekends. Chuckwagon Dinner & Show is Available Seasonally (additional cost). Horseback rides are offsite (additional cost). The restaurant page is titled Wild West Bar & Grill; the fetched page had no menu and no restaurant-specific hours. Booking.com also names Branding Iron Bar & Grill and Wild West Bar & Grill.",
    unverified: true,
    unverifiedReason:
      "Menu, vegetarian items, and Thanksgiving hours are UNVERIFIED. Call (830) 796-7745. Do not invent a resort Thanksgiving dinner or chuckwagon show for this weekend; none found on flyingl.com.",
    sources: [S.flyinglActivities, S.flyinglRestaurant, S.booking],
  },
  otaAddressNote:
    "Some OTAs list 566 Flying L Drive. Use the official 675 address. OpenStreetMap also places the golf course / guest ranch at 675 Flying L Drive.",
  sources: [S.flyingl, S.flyinglContact, S.flyinglActivities, S.flyinglRestaurant],
};

export const weather = {
  updated: "1:42 pm CST Mon Nov 23, 2026",
  valid: "Forecast valid 1pm CST Nov 23 through 6pm CST Nov 29, 2026",
  pointLabel: "Point Forecast: Bandera TX 29.72°N 99.06°W (Elev. 1257 ft)",
  zoneIssued: "Zone forecast issued 108 PM CST Mon Nov 23, 2026",
  freezeWarning:
    "A Freeze Warning is in effect midnight Tuesday night (Nov 24) through 9 AM CST Wednesday, Nov 25. That is before arrival, not during the stay.",
  takeaway:
    "Dry, warming weekend. Cold nights and chilly Thanksgiving, then pleasant Saturday and Sunday. Pack layers, a warm jacket for evenings (especially Thursday and Friday nights in the mid-30s), and sun protection. No precipitation is in this Bandera forecast for Nov 26-29. Re-check the NWS link the morning of departure.",
  sources: [S.nwsPoint, S.nwsZone],
  days: [
    {
      id: "thu",
      label: "Thu 26",
      name: "Thanksgiving",
      sky: "Sunny",
      high: "62°F",
      low: "35°F",
      detail:
        "Sunny, high near 62°F. North wind around 5 mph becoming calm. Thursday night: partly cloudy, low around 35°F, calm.",
      zone: "Mostly sunny, highs around 60. Thursday night and Friday: partly cloudy, lows mid 30s, highs lower 60s.",
    },
    {
      id: "fri",
      label: "Fri 27",
      name: "Friday",
      sky: "Mostly sunny",
      high: "63°F",
      low: "38°F",
      detail:
        "Mostly sunny, high near 63°F. Light and variable wind becoming south-southwest 5-10 mph in the afternoon. Friday night: mostly clear, low around 38°F.",
      zone: "Fri night mostly clear, lows upper 30s.",
    },
    {
      id: "sat",
      label: "Sat 28",
      name: "Saturday",
      sky: "Sunny",
      high: "71°F",
      low: "44°F",
      detail: "Sunny, high near 71°F. Saturday night: mostly clear, low around 44°F.",
      zone: "Friday night and Saturday: clear. Highs in the upper 60s. Lows mid 40s Saturday night.",
    },
    {
      id: "sun",
      label: "Sun 29",
      name: "Sunday",
      sky: "Sunny",
      high: "73°F",
      detail: "Sunny, high near 73°F. Sunday night is not fully spelled out on the point page.",
      zone: "Partly cloudy in the morning, then clearing. Highs in the lower 70s.",
    },
  ],
};

export const diet = {
  title: "Strict ovo-lacto vegetarian",
  summary:
    "Eggs and dairy OK. No meat, fish, poultry, or meat broths. Ask every kitchen about stock, lard in refried beans, fish sauce, oyster sauce, chicken powder, bacon fat, and Caesar dressing (often contains anchovy).",
  coconut:
    "Coconut: no coconut was listed on the official TJ's (May 2026) or Paniolo menus reviewed. Still ask, especially at Asian kitchens and coffee shops. A Bandera coffee shop is named Coconut Cowboys; no official menu was retrieved, so coconut use there is UNVERIFIED.",
  coconutUnverified: true,
  coconutUnverifiedReason:
    "Coconut Cowboys, 410 Main St (directory listings): name contains coconut; no menu retrieved. Flag and ask if visiting.",
  sources: [S.tjs, S.tjsMenu, S.panioloMenu, S.chinaBowl],
};

export const driveIn = {
  blurb:
    "Starts and ends in Katy, TX. I-10 west through San Antonio, then Loop 1604 and TX-16/173 to the ranch.",
  osrmShort: "OSRM no-traffic: 3 hours 57 minutes, 218 miles outbound; 3 hours 56 minutes back.",
  osrm:
    "OSRM estimate (no live traffic), Nov 23, 2026: about 3 hours 57 minutes, 218 miles (237.1 minutes, 217.58 miles) from Katy, TX (city point 29.7857853, -95.8243956) to 675 Flying L Drive (29.7126941, -99.0481450).",
  osrmBack:
    "Return, same method: about 3 hours 56 minutes, 218 miles (235.6 minutes, 217.78 miles).",
  route:
    "OSRM's chosen highway sequence (simplified): I-10 west (Katy Freeway) through the San Antonio side, Loop 1604 West (Anderson Loop), FM 1560 / TX-16 Bandera Road, TX-173, then Wharton's Dock Road to Flying L Drive.",
  traffic:
    "Planning estimate only. Thanksgiving traffic, especially on I-10 and the San Antonio loops, can add time. Use the live Google Maps links.",
  wharton:
    "The route uses Wharton's Dock Road, where Bandera County recently lowered the speed limit from 45 mph to 35 mph for 1.4 miles southbound from Hwy 173 S.",
  grocery:
    "Bandera's in-town supermarket (Lowe's Market) is closed Thanksgiving. Shop at an H-E-B in Katy before noon on Thursday. Chain-wide Thanksgiving hours are reported as 6 a.m. to noon; UNVERIFIED for the specific Katy store. Do not count on a Bandera kitchen until someone confirms it is open.",
  sources: [S.mapsDrive, S.mapsDriveBack, S.osrm, S.osrmOut, S.osrmBack, S.prophetNews, S.lowes, S.khou, S.fox4heb, S.heb],
};

export const foodPicks: FoodCard[] = [
  {
    rank: 1,
    name: "TJ's @ The Old Forge",
    blurb: "Best in-town sit-down option with a current official menu.",
    address: "807 Main Street, Bandera, TX 78003",
    phone: "(830) 796-9990",
    hours:
      "Regular hours (official): Mon-Thu 11:00 AM-9:00 PM; Fri-Sat 11:00 AM-10:00 PM; Sun 11:00 AM-8:00 PM. Thanksgiving Day opening is UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Vegetarian Pasta",
        detail:
          "Angel hair with sun-dried tomatoes, mushrooms, and spinach in a creamy garlic-infused white wine sauce, served with garlic toast ($11.99).",
      },
      {
        name: "Beyond Burger",
        detail:
          "Grilled plant-based patty \"made with 100% vegetables,\" lettuce, tomato, and red onion; add cheese $2.00 ($16.99). Ask them to hold bacon and confirm the bun and any sauce.",
      },
      {
        name: "Fried Mushrooms",
        detail:
          "Hand-breaded, served with ranch; add white gravy $1.25 ($11.99). Confirm the batter and gravy have no meat stock.",
      },
      {
        name: "TJ's House Salad",
        detail:
          "Lettuce mix with walnuts, tomato, red onion, bleu cheese crumbles, and dried cranberries, balsamic vinaigrette. Confirm croutons/dressing if ordered as a meal.",
      },
      {
        name: "Meatless standard sides (as listed)",
        detail:
          "Corn, baked potato, baked sweet potato, french fries, green beans, cole slaw, mashed potatoes, wild rice, mixed vegetables, hushpuppies; plus steamed broccoli, garlic sauteed spinach, fried okra, onion rings, macaroni & cheese, etc. Ask whether green beans, mashed potatoes, gravy, or rice are made with ham, bacon, or stock.",
      },
    ],
    ask: [
      "Hold bacon on the Beyond Burger; confirm bun and sauce.",
      "Confirm fried-mushroom batter and gravy have no meat stock.",
      "Ask whether green beans, mashed potatoes, gravy, or rice use ham, bacon, or stock.",
    ],
    notes: [
      "Theme nights listed on the homepage (Monday Madness, Tuesday boneless wings, Wine Wednesday, Thursday free live trivia, Friday all-you-can-eat fish, Saturday prime rib) are not vegetarian events.",
    ],
    sources: [S.tjs, S.tjsMenu],
  },
  {
    rank: 2,
    name: "Pap's Italian Grill",
    blurb:
      "The owner's old Italian / pizza place in Bandera. Inexpensive sit-down pasta and pizza. Suggested dinner Friday or Saturday, not Thursday unless they confirm they are open.",
    address: "632 TX-16, Bandera, TX 78003",
    phone: "(830) 796-9400",
    hours:
      "Google Maps hours: Mon closed; Tue-Sat 11 a.m.-9 p.m.; Sun 11 a.m.-8 p.m. A June 2025 Bandera County eateries PDF lists Tue-Sun 11 a.m.-9 p.m., closed Monday (Sunday close disagrees with Google Maps). Thanksgiving Thursday hours are UNVERIFIED. Call (830) 796-9400 before treating Thursday as an option.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Cheese ravioli",
        detail:
          "Third-party listing: ricotta-filled ravioli with tomato sauce. Order-page name: Cheese Ravioli ($14.99). Confirm the sauce has no meat stock.",
        unverified: true,
        unverifiedReason: "Vegetarian status UNVERIFIED. Sauces and broth are unconfirmed.",
      },
      {
        name: "Spinach manicotti",
        detail:
          "Menusweb lists manicotti filled with ricotta and spinach, baked in marinara with mozzarella. The order page only says Manicotti ($14.99), without spinach. Confirm filling and sauce.",
        unverified: true,
        unverifiedReason: "Spinach filling is from a third-party menu, not the order page. Vegetarian status UNVERIFIED.",
      },
      {
        name: "Fettuccine alfredo",
        detail:
          "Listed on both Menusweb and the order page (Fettuccine Alfredo, $14.99). Cream sauce: dairy is likely, meat stock is UNVERIFIED. The owner is strict ovo-lacto, so ask whether the Alfredo (and any marinara) uses meat broth.",
        unverified: true,
        unverifiedReason: "Sauces and broth unconfirmed.",
      },
      {
        name: "Cheese bread / garlic cheese bread",
        detail:
          "Menusweb: cheese bread. Order page: Garlic Cheese Bread ($9.99) and Breadsticks with marinara ($12.99). Confirm butter/sauce.",
        unverified: true,
        unverifiedReason: "Vegetarian status UNVERIFIED.",
      },
      {
        name: "Cheese pizza",
        detail:
          "Order page: Cheese Pizza, classic cheese or create your own ($14.99). Skip meat toppings. Confirm the crust and sauce have no meat products.",
        unverified: true,
        unverifiedReason: "Crust and sauce ingredients UNVERIFIED.",
      },
      {
        name: "Other meat-free-looking order-page names",
        detail:
          "Eggplant Parmigiana, Spaghetti with Marinara Sauce, Spaghetti with Mushrooms, Mozzarella Caprese, Bruschetta, Greek Salad, Pap's Salad. Still ask about stock, lard, and shared fryers. Skip Caesar (dressing often contains anchovy).",
        unverified: true,
        unverifiedReason: "Sauces, broth, and fryer oil UNVERIFIED.",
      },
    ],
    ask: [
      "Call (830) 796-9400. Do not assume they are open Thanksgiving Thursday.",
      "Ask whether marinara, Alfredo, and any soup/broth use meat stock.",
      "Confirm manicotti filling (spinach vs cheese only) if that matters.",
      "Skip Caesar unless they confirm no anchovy.",
    ],
    notes: [
      "Google Maps listing cited for this roadbook: 4.6 stars from 893 reviews; inexpensive. Rating and review count can change.",
      "Slot as Friday or Saturday dinner. Sunday regular hours (Google Maps: 11 a.m.-8 p.m.) are a fallback only if still in town; still call.",
    ],
    sources: [S.papsMaps, S.papsMenuWeb, S.papsSlice, S.papsCounty],
  },
  {
    rank: 3,
    name: "Paniolo Winery",
    blurb: "Tapas and wine; strong meat-free small plates. Venue is labeled 21+.",
    address: "1003 Maple Street, Bandera, TX",
    hours:
      "Hours were not clearly listed on the official homepage or menu page fetched Nov 23. Weekly hours and Thanksgiving hours UNVERIFIED. Third-party listings often show it closed Tuesday-Thursday. Do not assume it is open Thursday.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Focaccia Bread",
        detail: "Herb focaccia with extra virgin olive oil and aged balsamic ($9).",
      },
      {
        name: "Mozzarella Stuffed Garlic Bread",
        detail: "Served with signature vodka sauce ($9). Confirm the vodka sauce has no meat.",
      },
      {
        name: "Caprese Salad",
        detail:
          "Roma tomatoes, fresh mozzarella, basil sauce, olive oil, balsamic pearls ($12). Menu tags it Vegetarian.",
      },
      {
        name: "House made Hummus",
        detail: "Olive oil and sesame seeds, naan mini-dippers; add seasonal vegetables ($10-$12).",
      },
      {
        name: "Charcuterie Plate 1, Small (Meat-Free)",
        detail:
          "Cheddar, Colby Jack, Pepper Jack, seedless grapes, nuts, crackers ($13). Do not order the Large (adds prosciutto and salami).",
      },
      {
        name: "Charcuterie Plate 2, Small (Meat-Free)",
        detail:
          "Blue cheese with honey, Gouda, goat cheese, fig jam, apple slices, roasted pistachios ($13). Same warning on the Large.",
      },
      {
        name: "Gelato",
        detail:
          "Tagged Vegetarian ($6). Listed flavors: Salted Caramel, Tirimisu (spelling as on the menu). Ask about coconut and gelatin.",
      },
      {
        name: "Pistachio & Ricotta Cake / Chocolate Temptation Cake",
        detail:
          "$7 each. Chocolate Temptation Cake contains eggs, wheat, tree nuts, soy. Dairy/egg desserts.",
      },
    ],
    ask: [
      "Confirm vodka sauce has no meat.",
      "Order Small meat-free cheese plates only, never the Large.",
      "Ask about coconut and gelatin in gelato.",
    ],
    notes: [
      "Flag, not vegetarian as written: Caesar Salad (house creamy Caesar; often contains anchovy; the fetched menu even showed a Fish tag). Chicken skewers, bacon-wrapped dates, cold ginger chicken, escargot, foie gras, bourbon candied bacon.",
      "No coconut was listed on this menu.",
    ],
    sources: [S.paniolo, S.panioloMenu],
  },
  {
    rank: 4,
    name: "China Bowl",
    blurb:
      "Most tofu / vegetable entree names, but confirm broth and sauces. Official menu page did not render dish names to the fetch tool (likely a JS ordering widget).",
    address: "1203 Pecan Street, Bandera, TX 78003",
    phone: "(830) 796-8494",
    hours:
      "Official hours: Sun-Thu 11:00 AM-9:00 PM; Fri-Sat 11:00 AM-10:00 PM. Thanksgiving hours UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Sesame Tofu, Grandmom Spicy Tofu, Home Style Tofu, Vegetables Delight",
        detail: "$14.00 each on the Menupix transcript. Confirm no meat broth, oyster sauce, or fish sauce.",
        unverified: true,
        unverifiedReason: "Dish names from Menupix, a third-party transcript, not the restaurant's rendered online-order page.",
      },
      {
        name: "Vegetable Egg Roll (2) / Edamame",
        detail: "$3.99 / $5.99 on that transcript. Regular egg rolls are described as beef and vegetables; use the vegetable egg roll only.",
        unverified: true,
        unverifiedReason: "Third-party menu transcript.",
      },
      {
        name: "Vegetable Tofu Soup",
        detail: "$10.99, homemade broth. Ask: vegetable or meat broth?",
        unverified: true,
        unverifiedReason: "Broth type UNVERIFIED.",
      },
      {
        name: "Pho with vegetables / no meat / tofu",
        detail:
          "Traditional pho broth is beef. Ask whether a vegetable broth is actually used. If not, skip pho.",
        unverified: true,
        unverifiedReason: "Vegetable pho broth is UNVERIFIED.",
      },
      {
        name: "Pad Thai Noodles",
        detail:
          "$15.50 lists bean sprout, napa, carrot, celery, egg, green onion, lime, crushed peanut. Ovo-lacto possible, but fish sauce / shrimp paste is common and UNVERIFIED here. Ask, or skip.",
        unverified: true,
        unverifiedReason: "Fish sauce / shrimp paste UNVERIFIED.",
      },
      {
        name: "Egg Drop Soup",
        detail: "May be ovo-lacto if the stock is not meat. UNVERIFIED. Hot and sour and wonton soups on that menu include pork.",
        unverified: true,
        unverifiedReason: "Stock type UNVERIFIED.",
      },
    ],
    ask: [
      "Confirm every dish and that no meat broth, oyster sauce, or fish sauce is used.",
      "Skip pho unless a vegetable broth is actually used.",
      "Skip Pad Thai if they cannot confirm no fish sauce or shrimp paste.",
    ],
    notes: [
      "Menupix itself says information is collected from third-party sources and may not be current. Confirm at the restaurant.",
    ],
    sources: [S.chinaBowl, S.chinaBowlMenu, S.menupix],
  },
  {
    rank: 5,
    name: "Mamacita's, Kerrville",
    blurb: "Nearby official-menu option (~40 min / 28.4 mi). Items can be vegetarian if prepared without lard, meat stock, or meat toppings.",
    address: "215 Junction Highway, Kerrville, TX 78028",
    phone: "(830) 895-2441",
    hours:
      "Hours as listed: Sun-Thu 11:00 AM-9:30 PM; Fri-Sat 11:00 AM-10:00 PM. Thanksgiving hours UNVERIFIED.",
    hoursUnverified: true,
    dishes: [
      {
        name: "Chile con Queso",
        detail: "Melted cheese, onions, tomatoes, bell peppers, tostadas, pico. Confirm no meat.",
      },
      {
        name: "Quesadillas, spinach option",
        detail:
          "Flour tortillas, Monterey Jack and cheddar, green onions and tomatoes, guacamole, sour cream, jalapeños. Order spinach, not beef/chicken/shrimp.",
      },
      {
        name: "Nachos de Frijoles",
        detail:
          "Tostadas, refried beans, melted cheddar, jalapeños. Ask if the beans are vegetarian (no lard) and if the tostadas are fried in a shared meat-fat fryer.",
      },
      {
        name: "Chalupas, Frijoles (Bean)",
        detail:
          "Crispy corn tortilla, refried beans, cheese, lettuce, tomatoes, guacamole. Same bean/lard question.",
      },
      {
        name: "Poquito de Todo",
        detail:
          "Includes a cheese enchilada as one component, but the plate also includes a tamale with chili con carne and a crispy beef taco. Do not order this plate as written. Ask whether a cheese enchilada (or bean/cheese combo) can be served with rice and beans without chili con carne.",
        skip: true,
        skipReason: "Do not order this plate as written.",
      },
    ],
    ask: [
      "Ask about lard in refried beans and meat stock in rice or \"la charra\" beans.",
      "Tortilla soup is described as chicken tortilla soup. Skip soups unless a vegetable version is confirmed.",
    ],
    sources: [S.mamacitas],
  },
  {
    rank: 6,
    name: "Cook from Lowe's Market / an H-E-B stop",
    blurb:
      "Essential on Thanksgiving, when Lowe's Market is closed and restaurant hours are unverified.",
    address: "Lowe's Market: 907 Main Street, Bandera, TX 78003",
    phone: "(830) 796-4401",
    hours:
      "Lowe's Market: Sun-Sat 7 a.m.-10 p.m. Officially closed Thanksgiving (also Easter and Christmas). Closes 6 p.m. Christmas Eve.",
    dishes: [
      {
        name: "Lowe's Market (in Bandera)",
        detail:
          "Drive from ranch: ~7 min / 2.8 mi. Store services listed: Subway Shop, deli, tortilleria, bakery, prepared meals, flowers, beer and wine, hunting & fishing gear, plus UberEats / DoorDash / Instacart. Closed Thanksgiving.",
      },
      {
        name: "H-E-B Boerne",
        detail:
          "420 W Bandera Road, Boerne, TX 78006. ~36 min / 25.4 mi from the ranch. Confirm hours on heb.com. Chain-wide Thanksgiving hours reported 6 a.m.-noon; UNVERIFIED for this store specifically.",
        unverified: true,
        unverifiedReason: "UNVERIFIED for the Boerne store specifically. Call or check heb.com.",
      },
      {
        name: "H-E-B Kerrville",
        detail:
          "OSM lists stores at 300 Main Street and 313 Sidney Baker Street South, Kerrville. ~40 min / 28.1 mi. Confirm the exact store and hours on heb.com.",
        unverified: true,
        unverifiedReason: "Confirm the exact store and hours on heb.com.",
      },
    ],
    ask: [
      "No H-E-B was verified inside Bandera city limits from official H-E-B Plus location lists or OpenStreetMap.",
      "Best Thursday move: shop at an H-E-B in Katy before noon (chain-wide hours reported 6 a.m.-noon; UNVERIFIED for the specific store), then cook or snack at the ranch.",
      "OTA listings say some Flying L units have kitchenettes or full kitchens; UNVERIFIED for this specific unit.",
    ],
    sources: [S.lowes, S.heb, S.khou, S.fox4heb],
  },
];

export const otherFoodNotes = {
  ost: {
    name: "OST (Old Spanish Trail) Restaurant",
    imageId: "ost",
    address: "311 Main Street, Bandera. Phone 830-796-3836.",
    hours:
      "Regular hours: Sun-Mon 7 a.m.-8 p.m.; Tue-Wed 7 a.m.-2 p.m.; Thu-Sat 7 a.m.-8 p.m. Thanksgiving hours UNVERIFIED.",
    detail:
      "BYOB (no alcohol served; setups available). Wheelchair ramp on request. The official page lists meat-heavy lunch and evening specials only. It does mention a salad bar (add $5.95). No named vegetarian entrees were published on the homepage. Breakfast is implied by the 7 a.m. opening, but menu items were not listed. Treat this as a maybe-breakfast / salad-bar option after calling.",
    unverified: true,
    unverifiedReason: "Thanksgiving hours UNVERIFIED. No named vegetarian entrees on the homepage.",
    sources: [S.ost],
  },
  weaker: [
    "Cowboy Capital Pizza Company, 1110 Hackberry St: third-party menus mention a Tenderfoot veggie pizza. UNVERIFIED on an official menu.",
    "The Hen's Nest, 1134C Main St: third-party writeups mention a veggie scramble and limited hours (often listed Thu-Sun mornings). UNVERIFIED.",
    "Mendoza Cafe, Brick's River Cafe, Subway (inside or beside Lowe's Market per the Lowe's store services list), Cowgirl Coffee Company (often described as upstairs at TJ's). Menus not confirmed here.",
    "Coconut Cowboys, 410 Main St (directory listings): name contains coconut; no menu retrieved. Flag and ask if visiting.",
  ],
  communityMeals: {
    detail:
      "The Bandera Prophet says free and potluck meals on Nov 26 include the 15th annual Community Thanksgiving Dinner, Monte Alteza, Last Chance Saloon, Ridin' the River Cowboy Fellowship, and Wildhorse Saloon.",
    unverified: true,
    unverifiedReason:
      "These are almost certainly turkey-centered. Vegetarian options, times, and whether visitors are welcome are UNVERIFIED. Not a reliable plan for this diet.",
    sources: [S.prophet, S.prophetNews],
  },
};

export const days: DayPlan[] = [
  {
    id: "thu",
    date: "Thursday, Nov 26, 2026",
    weekday: "Thu",
    short: "Thu 26",
    title: "Katy to Flying L",
    weather: { high: "62°F", low: "35°F", sky: "Sunny" },
    items: [
      {
        id: "thu-bucees-katy",
        kind: "food",
        startMin: 450,
        endMin: 495,
        optional: true,
        shortTitle: "Buc-ee's Katy",
        title: "Optional: Buc-ee's Katy",
        time: "7:30 to 8:15 AM",
        windowNote: PLANNING,
        hoursNote: "Official FAQ: all Buc-ee's open 24 hours a day, 365 days a year. Kitchen: breakfast 4:00 to 10:30 a.m.; BBQ sandwiches and chicken tenders from 10:30 a.m.",
        address: "27700 Katy Fwy, Katy, TX 77494",
        body: "27700 Katy Fwy, Katy, TX 77494. On I-10 at the start of the drive (~4 min / 2.1 mi from the Katy city point). Official FAQ: all Buc-ee's open 24 hours a day, 365 days a year. Kitchen: breakfast 4:00–10:30 a.m.; BBQ sandwiches and chicken tenders from 10:30 a.m. Vegetarian-aware: beaver nuggets, chips, fudge, fruit cups, and some cold items are the safer bets; BBQ sandwiches are meat. Cold sandwiches, wraps, and salads: ingredients UNVERIFIED. OSRM Katy Buc-ee's to Flying L: about 3 hours 54 minutes, 216 miles (no traffic). Skip this stop if going straight to H-E-B.",
        sources: [S.buceesFaq, S.buceesLocations, S.osrm, S.mapsDrive],
      },
      {
        id: "thu-heb",
        kind: "food",
        startMin: 495,
        endMin: 540,
        shortTitle: "H-E-B in Katy",
        title: "H-E-B in Katy before noon",
        time: "8:15 to 9:00 AM",
        windowNote: PLANNING,
        hoursNote:
          "Chain-wide Thanksgiving hours are reported 6 a.m. to noon (pharmacies closed; curbside 7 to 11 a.m. in those roundups). UNVERIFIED for the specific Katy store: check heb.com or call. This block is a grocery stop, not the store's open window.",
        address: "H-E-B in Katy, TX",
        body: "Shop an H-E-B in Katy before leaving. Chain-wide Thanksgiving hours are reported 6 a.m.–noon (pharmacies closed; curbside 7–11 a.m. in those roundups). UNVERIFIED for the specific Katy store: check heb.com or call. Lowe's Market in Bandera is closed today. Same morning, call ahead: Flying L front desk (830) 796-7745 for check-in, restaurant hours, and whether campfire/s'mores or a wagon ride are on tonight. TJ's (830) 796-9990. China Bowl (830) 796-8494. OST (830) 796-3836. Pap's (830) 796-9400 only to ask hours: do not treat Pap's as Thursday dinner unless they confirm they are open.",
        unverified: true,
        unverifiedReason:
          "H-E-B chain-wide Thanksgiving hours are from Nov 19–20, 2026 news roundups (KHOU/TEGNA, FOX 4). UNVERIFIED for the specific store.",
        callToConfirm: "Call to confirm. Do not assume any Bandera kitchen is open Thursday.",
        sources: [S.khou, S.fox4heb, S.heb, S.lowes, S.flyinglContact, S.tjs, S.chinaBowl, S.ost, S.papsMaps],
      },
      {
        id: "thu-drive",
        kind: "drive",
        startMin: 540,
        endMin: 777,
        shortTitle: "Katy to Flying L",
        title: "Katy to Flying L on I-10 west",
        time: "9:00 AM to 12:57 PM",
        windowNote:
          "Working plan from the roadbook: leave around 9:00 a.m., OSRM no-traffic arrival near 12:57 p.m. Not a verified clock.",
        address: "Katy, TX to 675 Flying L Dr, Bandera, TX 78003",
        body: "Live route: Google Maps (Katy, TX to 675 Flying L Dr). OSRM no-traffic, Nov 23, 2026: 3 hours 57 minutes, 218 miles (237.1 min, 217.58 mi). Highway sequence: I-10 W (Katy Freeway) through the San Antonio side, Loop 1604 W (Anderson Loop), FM 1560 / TX-16 Bandera Road, TX-173, Wharton's Dock Road (35 mph zone), Flying L Drive. Working plan, not a verified clock: if the car leaves Katy around 9:00 a.m. after shopping, OSRM puts arrival near 12:57 p.m. Thanksgiving traffic can add time; do not treat 12:57 as a promise. Optional stop on I-10: Buc-ee's Luling, 10070 West IH 10, Luling, TX 78648. OSRM: Katy to this store 1 hour 55 minutes / 109.2 miles; store to Flying L 2 hours 6 minutes / 109.0 miles. Routing Katy to this store to Flying L is 4 hours 1 minute / 218.3 miles, about 4 minutes longer than the direct OSRM path. Same 24/7 / 365 hours as the FAQ. Same vegetarian caveat as Katy.",
        sources: [S.mapsDrive, S.osrm, S.osrmOut, S.prophetNews, S.buceesFaq, S.buceesLocations],
      },
      {
        id: "thu-arrive",
        kind: "activity",
        startMin: 780,
        endMin: 825,
        shortTitle: "Arrive in Bandera",
        title: "Arrive in the Bandera area",
        time: "1:00 to 1:45 PM",
        windowNote: PLANNING,
        address: "Bandera, TX",
        imageId: "downtown-bandera",
        body: "If the room is not ready, picnic from the cooler in town or at a scenic pull-off. Do not count on a restaurant until someone confirms it is open. Confirm check-in with the front desk.",
        unverified: true,
        unverifiedReason: "Thursday restaurant openings in Bandera are UNVERIFIED. Check-in time is OTA-based.",
        sources: [S.tjs, S.chinaBowl, S.ost, S.flyinglActivities, S.booking],
      },
      {
        id: "thu-main",
        kind: "activity",
        startMin: 840,
        endMin: 885,
        optional: true,
        shortTitle: "Main Street walk",
        title: "Easy walk on Main Street",
        time: "2:00 to 2:45 PM",
        windowNote: PLANNING,
        hoursNote:
          "Frontier Times Museum lists Mon-Sat 10:00 a.m. to 4:30 p.m.; Thanksgiving Day hours are UNVERIFIED. Bandera Natural History and Art Museum lists Wed-Sat 10 a.m. to 5 p.m.; Thanksgiving hours UNVERIFIED. Hill Country SNA HQ closes at noon.",
        address: "Main Street, Bandera, TX",
        imageId: "downtown-bandera",
        body: "After dark, courthouse lights at 500 Main St. Hill Country SNA is open again from 6:00 a.m., but daylight will be short and HQ closes at noon; better saved for Friday or Sunday if the drive already ate the day. Frontier Times Museum lists Mon–Sat 10:00 a.m.–4:30 p.m.; Thanksgiving Day hours are UNVERIFIED (a third-party museum guide says closed Thanksgiving). Bandera Natural History and Art Museum lists Wed–Sat 10 a.m.–5 p.m.; Thanksgiving hours UNVERIFIED.",
        unverified: true,
        unverifiedReason: "Thanksgiving hours for both museums are UNVERIFIED on the official pages fetched.",
        sources: [S.bbaChristmas, S.hillCountrySna, S.frontierTimes, S.banderaNhm],
      },
      {
        id: "thu-checkin",
        kind: "rest",
        startMin: 960,
        endMin: 1005,
        shortTitle: "Check in",
        title: "Check in at 675 Flying L Dr",
        time: "4:00 to 4:45 PM",
        windowNote: "OTA working assumption (4:00 p.m.), not published on flyingl.com.",
        address: "675 Flying L Dr, Bandera, TX 78003",
        body: "Working assumption from OTAs only. Confirm check-in with the front desk.",
        unverified: true,
        unverifiedReason: "Check-in/out not published on flyingl.com.",
        callToConfirm: "Call (830) 796-7745 to confirm check-in.",
        sources: [S.flyinglContact, S.booking, S.priceline],
      },
      {
        id: "thu-dinner",
        kind: "food",
        startMin: 1080,
        endMin: 1125,
        shortTitle: "Dinner",
        title: "Cooler first, then whoever confirmed they are open",
        time: "6:00 to 6:45 PM",
        windowNote: PLANNING,
        hoursNote: "Thursday restaurant openings in Bandera are UNVERIFIED. Pap's is not the Thursday plan unless they confirm they are open.",
        body: "First choice: food from the cooler in the unit. Second: whatever in-town kitchen confirmed it is open (TJ's Vegetarian Pasta or Beyond Burger; China Bowl tofu dishes if they are open and confirm no meat broth). Third: Flying L restaurant only if they confirm a vegetarian plate. Pap's is not the Thursday plan unless they confirm they are open.",
        unverified: true,
        unverifiedReason: "Thursday restaurant openings, Flying L menu, unit kitchenette, and Pap's Thanksgiving hours are UNVERIFIED.",
        sources: [S.tjsMenu, S.menupix, S.flyinglActivities, S.papsMaps],
      },
      {
        id: "thu-evening",
        kind: "rest",
        startMin: 1140,
        endMin: 1215,
        shortTitle: "Campfire",
        title: "Jacket weather (low around 35°F)",
        time: "7:00 to 8:15 PM",
        windowNote: PLANNING,
        body: "If the ranch is running campfire and s'mores (listed Tue–Sat), that is the on-site plan. S'mores are typically vegetarian; confirm marshmallows/gelatin if that matters. Courthouse lights if not already seen.",
        unverified: true,
        unverifiedReason: "Campfire and s'mores times of day are UNVERIFIED.",
        sources: [S.flyinglActivities, S.nwsPoint, S.bbaChristmas],
      },
    ],
  },
  {
    id: "fri",
    date: "Friday, Nov 27, 2026",
    weekday: "Fri",
    short: "Fri 27",
    title: "Hikes, Dickens or Cibolo, Pap's dinner",
    weather: { high: "63°F", low: "38°F", sky: "Mostly sunny" },
    items: [
      {
        id: "fri-ost",
        kind: "food",
        startMin: 420,
        endMin: 465,
        shortTitle: "OST breakfast",
        title: "OST breakfast (call first)",
        time: "7:00 to 7:45 AM",
        windowNote: PLANNING,
        hoursNote: "Regular hours include Friday 7 a.m. to 8 p.m. This block is a breakfast stop, not those hours.",
        address: "311 Main Street, Bandera, TX",
        imageId: "ost",
        body: "Old Spanish Trail Restaurant, 311 Main Street, (830) 796-3836. Regular hours include Friday 7 a.m.–8 p.m. Breakfast is implied by the 7 a.m. opening; named vegetarian breakfast items were not on the homepage. Salad bar is mentioned (add $5.95). Treat as a maybe-breakfast after calling. BYOB.",
        unverified: true,
        unverifiedReason: "No named vegetarian breakfast items on the official homepage. Confirm Friday hours.",
        sources: [S.ost],
      },
      {
        id: "fri-morning-options",
        kind: "activity",
        startMin: 480,
        endMin: 720,
        shortTitle: "Hike options",
        title: "Morning hike options",
        time: "8:00 AM to 12:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Lost Maples park hours 8:30 a.m. to 4:30 p.m. (day pass). Hill Country SNA reopened 6:00 a.m. Thursday. Those are park hours, not this block's length. Pick one.",
        body: "Pick one outdoor block. Lost Maples is the longer day. Hill Country SNA is closer (~21 min / 12.3 mi). Lost Maples eats most of the afternoon; SNA leaves room for town or Boerne later.",
        options: [
          {
            id: "fri-lost-maples",
            kind: "activity",
            startMin: 480,
            endMin: 720,
            shortTitle: "Lost Maples",
            title: "Option A: Lost Maples (needs a day pass)",
            time: "8:00 AM to 12:00 PM",
            address: "37221 FM 187, Vanderpool, TX",
            imageId: "lost-maples",
            hoursNote: "Park hours 8:30 a.m. to 4:30 p.m. Leave the ranch by 7:30 to 8:00 a.m.",
            body: "Leave the ranch by 7:30–8:00 a.m. for Lost Maples (open 8:30–4:30, ~54 min / 41.5 mi). Hike, picnic from the cooler. Recheck the foliage line and trail status. Be back on the road early enough for the evening plan. Reserve a day pass; Thanksgiving week is called out as busy. Cell service is not available in the natural area. Optional stop in Medina at Love Creek Orchards (store/bakery 9 a.m.–5 p.m. every day on the contact page; patio cafe 11 a.m.–3 p.m.). That page also says Closed for Holidays: Friday hours UNVERIFIED. Cafe lists burgers, sandwiches, and grilled/fried items; vegetarian plates UNVERIFIED. Bakery pies and ice cream may be ovo-lacto; coconut/gelatin UNVERIFIED. OSRM Flying L to Love Creek: about 20 min / 15.1 mi.",
            unverified: true,
            unverifiedReason: "Love Creek holiday hours and vegetarian cafe items UNVERIFIED.",
            sources: [S.lostMaples, S.lostMaplesFoliage, S.dayPassFaqs, S.reserveAmerica, S.loveCreek, S.loveCreekHours],
          },
          {
            id: "fri-sna",
            kind: "activity",
            startMin: 480,
            endMin: 720,
            shortTitle: "Hill Country SNA",
            title: "Option B: Hill Country SNA (shorter, closer)",
            time: "8:00 AM to 12:00 PM",
            address: "10600 Bandera Creek Rd, Bandera, TX",
            imageId: "hill-country-sna",
            hoursNote: "Reopened 6:00 a.m. Thursday after the hunt. HQ Thanksgiving 8:15 a.m. to 12:00 p.m.",
            body: "~21 min / 12.3 mi. West Peak Overlook is a staff favorite (steep). Bring water. No park store. Day-use reservations highly recommended. Adult $6; 12 and under free. Reopened 6:00 a.m. Thursday after the hunt.",
            sources: [S.hillCountrySna, S.dayPassFaqs, S.reserveAmerica],
          },
        ],
        sources: [S.lostMaples, S.hillCountrySna, S.dayPassFaqs, S.reserveAmerica],
      },
      {
        id: "fri-lunch",
        kind: "food",
        startMin: 720,
        endMin: 765,
        shortTitle: "Lunch",
        title: "Cooler picnic or Bandera kitchen",
        time: "12:00 to 12:45 PM",
        windowNote: PLANNING,
        body: "Picnic at the park, or back in Bandera at China Bowl (confirm broth) or TJ's.",
        sources: [S.chinaBowl, S.tjs],
      },
      {
        id: "fri-afternoon-options",
        kind: "activity",
        startMin: 810,
        endMin: 1020,
        shortTitle: "Afternoon options",
        title: "Afternoon options: town, Boerne, or San Antonio",
        time: "1:30 to 5:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Frontier Times: Mon-Sat 10:00 a.m. to 4:30 p.m. Dickens on Main: Friday 12:00 p.m. to 9:00 p.m. (tree lighting 6:00 to 6:30 p.m.). Cibolo trails dawn to dusk; visitor center Mon-Fri 9 a.m. to 4:30 p.m. Those are venue hours, not this block's length. Pick one.",
        body: "Pick one. Frontier Times is the in-town museum stop. Dickens on Main in Boerne is the recommended festive block (pairs with Cibolo). Downtown San Antonio is the longer alternative and conflicts with Pap's at a reasonable hour and may skip 11th Street. Staying in Boerne for the 6:00 p.m. tree lighting means a late return.",
        options: [
          {
            id: "fri-frontier",
            kind: "activity",
            startMin: 810,
            endMin: 1020,
            shortTitle: "Frontier Times",
            title: "Frontier Times Museum",
            time: "1:30 to 5:00 PM",
            hoursNote: "Official hours Monday–Saturday 10:00 a.m.–4:30 p.m. (closed Sunday). This block is a visit, not those hours.",
            address: "510 13th Street, Bandera, TX",
            imageId: "frontier-times",
            body: "510 13th Street, Bandera, (830) 796-3864. Official hours Monday–Saturday 10:00 a.m.–4:30 p.m. (closed Sunday). Admission: adults $10, seniors $8, military $8, ages 6–17 $5, under 6 free. OSRM from the ranch: about 4 min / 2.2 mi. Friday is a regular open day on that schedule. The bigger programmed event is Saturday's Native American Heritage Day.",
            sources: [S.frontierTimes, S.frontierEvents],
          },
          {
            id: "fri-dickens",
            kind: "event",
            startMin: 810,
            endMin: 1020,
            shortTitle: "Dickens on Main",
            title: "Recommended: Dickens on Main, Boerne",
            time: "1:30 to 5:00 PM",
            hoursNote: "Festival listed Friday, Nov 27, 12:00 p.m. to 9:00 p.m. Tree lighting 6:00 to 6:30 p.m. at the gazebo. This block is a daytime visit; staying for the lighting means a late return.",
            address: "Downtown Boerne, TX",
            imageId: "boerne-main",
            body: "Friday, Nov 27, 12:00 p.m.–9:00 p.m., downtown Boerne. Drive ~39 min / 26.7 mi. Market and lights in daylight; tree lighting 6:00–6:30 p.m. at the gazebo. Eat before or after at a known kitchen (Pap's in Bandera is the suggested dinner, so either return for Pap's or inspect Boerne vendor food carefully). Vegetarian options at food vendors are UNVERIFIED. See the official page for the full grid rather than treating this as a complete schedule. Pairs with Cibolo Nature Center trails, 140 City Park Road, Boerne: trails free, dawn to dusk every day; visitor center Monday–Friday 9 a.m.–4:30 p.m. Black Friday visitor-center hours UNVERIFIED. OSRM from Flying L: about 40 min / 28.7 mi. Do not also add San Antonio the same night.",
            unverified: true,
            unverifiedReason: "Dickens food-vendor vegetarian options UNVERIFIED. Visitor-center hours on Nov 27 UNVERIFIED.",
            sources: [S.dickens, S.dickensChamber, S.cibolo],
          },
          {
            id: "fri-riverwalk",
            kind: "event",
            startMin: 810,
            endMin: 1020,
            shortTitle: "River Walk lights",
            title: "Downtown San Antonio: first night of River Walk lights",
            time: "1:30 to 5:00 PM",
            hoursNote: "River Walk holiday lights illuminated November 27–January 11 (dawn). Fri Nov 27, 6:00 p.m.: Ford Holiday River Parade (ticketed). Fri Nov 27, 4:00–7:00 p.m. (tree lighting at 6:00 p.m.): H-E-B Christmas Tree Lighting at Travis Park.",
            address: "Downtown San Antonio, TX",
            imageId: "river-walk",
            body: "River Walk holiday lights are illuminated November 27–January 11 (dawn). They are not yet on Thanksgiving night. Fri Nov 27, 6:00 p.m.: 45th Annual Ford Holiday River Parade (ticketed). Fri Nov 27, 4:00–7:00 p.m. (tree lighting at 6:00 p.m.): free H-E-B Christmas Tree Lighting at Travis Park. Check SA.gov/GoDowntown for closures. About 70 min / 51.4 mi each way and a late return. Conflicts with Dickens' 6:00 p.m. tree lighting, Cibolo, Pap's at a reasonable hour, and may skip 11th Street.",
            sources: [S.saHolidays, S.goDowntown],
          },
        ],
        sources: [S.frontierTimes, S.dickens, S.cibolo, S.saHolidays],
      },
      {
        id: "fri-paps",
        kind: "food",
        startMin: 1080,
        endMin: 1125,
        shortTitle: "Pap's dinner",
        title: "Pap's Italian Grill (suggested Friday dinner)",
        time: "6:00 to 6:45 PM",
        windowNote: PLANNING,
        hoursNote: "Google Maps hours: Tue-Sat 11 a.m. to 9 p.m. (closed Monday). This block is dinner, not those hours.",
        address: "632 TX-16, Bandera, TX 78003",
        body: "632 TX-16, Bandera, (830) 796-9400. Google Maps hours: Tue–Sat 11 a.m.–9 p.m. (closed Monday). OSRM from the ranch: about 5 min / 2.4 mi. Inexpensive pasta and pizza. Ask about meat stock in marinara and Alfredo. Named dishes on third-party and order pages include cheese ravioli, manicotti, fettuccine Alfredo, garlic cheese bread, and cheese pizza; vegetarian status of sauces and broth is UNVERIFIED. Call before driving over. Backup: TJ's (regular Friday until 10 p.m.; confirm) or Paniolo if it is open (hours UNVERIFIED).",
        unverified: true,
        unverifiedReason: "Confirm Friday hours. Pap's sauces/broth and Paniolo weekly hours UNVERIFIED.",
        sources: [S.papsMaps, S.papsMenuWeb, S.papsSlice, S.tjs, S.paniolo],
      },
      {
        id: "fri-rick-rice",
        kind: "event",
        startMin: 1230,
        endMin: 1470,
        shortTitle: "Rick Rice Band",
        title: "Rick Rice Band at 11th Street Cowboy Bar",
        time: "8:30 PM to 12:30 AM",
        address: "307 11th Street, Bandera, TX",
        body: "Fri Nov 27, 8:30 p.m.–12:30 a.m. 307 11th Street, Bandera, (830) 796-4849.",
        sources: [S.rickRice, S.eleventh],
      },
    ],
  },
  {
    id: "sat",
    date: "Saturday, Nov 28, 2026",
    weekday: "Sat",
    short: "Sat 28",
    title: "Museum day, cave or Kerrville, Pap's if not Friday, Kin Faux",
    weather: { high: "71°F", low: "44°F", sky: "Sunny" },
    items: [
      {
        id: "sat-ost",
        kind: "food",
        startMin: 420,
        endMin: 465,
        shortTitle: "OST breakfast",
        title: "OST or the cooler",
        time: "7:00 to 7:45 AM",
        windowNote: PLANNING,
        hoursNote: "OST regular Saturday hours 7 a.m. to 8 p.m. This block is breakfast, not those hours.",
        address: "311 Main Street, Bandera, TX",
        imageId: "ost",
        body: "OST regular Saturday hours 7 a.m.–8 p.m.; still no named vegetarian breakfast on the homepage. Call (830) 796-3836.",
        unverified: true,
        unverifiedReason: "Named vegetarian breakfast items UNVERIFIED.",
        sources: [S.ost],
      },
      {
        id: "sat-day-options",
        kind: "activity",
        startMin: 540,
        endMin: 840,
        shortTitle: "Day options",
        title: "Day options: Heritage Day, cave, Kerrville, or Lost Maples",
        time: "9:00 AM to 2:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Heritage Day is 11:00 a.m. to 2:00 p.m. (official). Cave winter hours 10 a.m. to 5 p.m., last tour 4 p.m., tour about 60 minutes. Kerrville market 10:00 a.m. to 4:00 p.m. Lost Maples 8:30 a.m. to 4:30 p.m. Those are venue hours. Pick one.",
        body: "Pick one. Native American Heritage Day at Frontier Times is the in-town recommended event (11:00 a.m. to 2:00 p.m.). Cave Without a Name, Kerrville's Christmas Indian Market, or Lost Maples (if skipped Friday) replace that event.",
        options: [
          {
            id: "sat-heritage",
            kind: "event",
            startMin: 660,
            endMin: 840,
            shortTitle: "Heritage Day",
            title: "Frontier Times Museum: Native American Heritage Day",
            time: "11:00 AM to 2:00 PM",
            hoursNote: "Event 11:00 a.m. to 2:00 p.m. Regular museum hours that day remain 10:00 a.m. to 4:30 p.m.",
            address: "510 13th Street, Bandera, TX",
            imageId: "frontier-times",
            body: "Saturday, Nov 28, 11:00 a.m.–2:00 p.m. at 510 13th Street. Official events page: first Native American Heritage Day; frybread over a campfire, beaded bracelets, arrowhead digging, atlatl, demonstrators. Regular museum hours that day are still 10:00 a.m.–4:30 p.m. Frybread is often made with lard; vegetarian status UNVERIFIED. Ask before eating anything at the event.",
            unverified: true,
            unverifiedReason: "Event food (including frybread) is UNVERIFIED for a strict ovo-lacto diet.",
            sources: [S.frontierEvents, S.frontierTimes],
          },
          {
            id: "sat-cave",
            kind: "activity",
            startMin: 540,
            endMin: 840,
            shortTitle: "Cave Without a Name",
            title: "Cave Without a Name (book a tour)",
            time: "9:00 AM to 2:00 PM",
            hoursNote: "Winter-season hours (Labor Day–Memorial Day): 10 a.m. to 5 p.m., last tour 4 p.m. About 60-minute guided tour.",
            address: "325 Kreutzberg Rd, Boerne, TX",
            imageId: "cave",
            body: "325 Kreutzberg Rd, Boerne. Winter-season hours (Labor Day–Memorial Day): 10 a.m.–5 p.m., last tour 4 p.m. About 60-minute guided tour; 66°F inside. Arrive 15–20 minutes early. Closed Thanksgiving Day and Christmas Day (not today). ~68 min / 37.5 mi. Combine with more Dickens on Main (noon–9 p.m.) because the cave is on the Boerne side.",
            sources: [S.cave, S.dickens],
          },
          {
            id: "sat-kerrville",
            kind: "activity",
            startMin: 540,
            endMin: 840,
            shortTitle: "Kerrville market",
            title: "Kerrville Christmas Indian Market at MOWA, then Mamacita's",
            time: "9:00 AM to 2:00 PM",
            hoursNote: "Market listed Fri Nov 27 and Sat Nov 28, 10:00 a.m. to 4:00 p.m. Confirm hours with the museum.",
            address: "1550 Bandera Highway, Kerrville, TX",
            body: "1550 Bandera Highway, Kerrville, (830) 896-2553. Usable days are Fri Nov 27 and Sat Nov 28, 10:00 a.m.–4:00 p.m. (hours within that window should be confirmed with the museum). Then Mamacita's: spinach quesadilla / bean nachos or chalupas, after asking about lard and stock. Kerrville ~38 min / 27.7 mi; Mamacita's ~40 min.",
            sources: [S.kerrvilleMarket, S.mowa, S.mamacitas],
          },
          {
            id: "sat-lost-maples",
            kind: "activity",
            startMin: 540,
            endMin: 840,
            shortTitle: "Lost Maples",
            title: "If Lost Maples was skipped Friday",
            time: "9:00 AM to 2:00 PM",
            hoursNote: "Lost Maples 8:30 a.m. to 4:30 p.m. Day pass required.",
            address: "37221 FM 187, Vanderpool, TX",
            imageId: "lost-maples",
            body: "Lost Maples or Garner (Garner is a longer 83 min drive). Optional Love Creek Orchards stop in Medina on the way (store/bakery 9–5 daily on the contact page; Closed for Holidays, so Saturday UNVERIFIED). Guadalupe River SP is a middle-distance trail day; Honey Creek tour would need prior registration. Do not try to add Enchanted Rock or Natural Bridge Caverns plus Dickens plus a dance hall in the same day.",
            unverified: true,
            unverifiedReason: "Love Creek holiday/Saturday hours UNVERIFIED.",
            sources: [S.lostMaples, S.garner, S.guadalupe, S.enchantedRock, S.nbc, S.loveCreekHours],
          },
        ],
        sources: [S.frontierEvents, S.cave, S.kerrvilleMarket, S.lostMaples],
      },
      {
        id: "sat-nhm",
        kind: "activity",
        startMin: 870,
        endMin: 915,
        optional: true,
        shortTitle: "History museum",
        title: "Bandera Natural History and Art Museum",
        time: "2:30 to 3:15 PM",
        windowNote: PLANNING,
        hoursNote: "Official Saturday hours 10 a.m. to 5 p.m. This block is a visit, not those hours.",
        address: "267 Old San Antonio Rd, Bandera, TX",
        body: "267 Old San Antonio Rd, Bandera, (830) 328-5090. Official hours: Wednesday–Saturday 10 a.m.–5 p.m.; Sunday noon–5 p.m.; closed Monday and Tuesday. Admission: adult $14; seniors 65+ / military & vet $12; student with ID $10; youth 4–12 $9; 3 and under free; Bandera County students free. DinoWalk outdoor models, dioramas, New Spain art. OSRM from the ranch: about 5 min / 2.5 mi. Saturday is a regular open day.",
        sources: [S.banderaNhm],
      },
      {
        id: "sat-river",
        kind: "activity",
        startMin: 945,
        endMin: 990,
        optional: true,
        shortTitle: "Medina River",
        title: "Back to the ranch, or more Main Street / Medina River",
        time: "3:45 to 4:30 PM",
        windowNote: PLANNING,
        hoursNote: "City Park hours UNVERIFIED after a recent ordinance change.",
        address: "1102 Maple Street, Bandera, TX",
        imageId: "medina-river",
        body: "Wagon ride / campfire if still offered (listed through Saturday). Bandera City Park / Medina River at 1102 Maple Street: river access; park hours UNVERIFIED after a recent ordinance change. Stay away from dams and private banks; check water conditions.",
        unverified: true,
        unverifiedReason: "Wagon ride and campfire times of day UNVERIFIED. City Park hours UNVERIFIED.",
        sources: [S.flyinglActivities, S.cityCal, S.prophetNews],
      },
      {
        id: "sat-dinner",
        kind: "food",
        startMin: 1080,
        endMin: 1125,
        shortTitle: "Dinner",
        title: "Pap's if Friday did not happen; otherwise TJ's or Paniolo",
        time: "6:00 to 6:45 PM",
        windowNote: PLANNING,
        hoursNote: "Pap's Google Maps Saturday 11 a.m. to 9 p.m. TJ's regular Saturday until 10 p.m. This block is dinner.",
        address: "632 TX-16, Bandera, TX 78003",
        body: "Pap's is the suggested Saturday dinner if Friday went to Dickens late or San Antonio. Same Google Maps hours (Sat 11 a.m.–9 p.m.). Call (830) 796-9400. Otherwise TJ's Vegetarian Pasta or Beyond Burger (regular Saturday hours until 10 p.m.; confirm), or Paniolo small plates if open.",
        unverified: true,
        unverifiedReason: "Confirm Saturday hours. Pap's sauces/broth and Paniolo weekly hours UNVERIFIED.",
        sources: [S.papsMaps, S.papsMenuWeb, S.papsSlice, S.tjs, S.tjsMenu, S.panioloMenu],
      },
      {
        id: "sat-music-options",
        kind: "event",
        startMin: 1200,
        endMin: 1320,
        shortTitle: "Music options",
        title: "Evening music options",
        time: "8:00 to 10:00 PM",
        windowNote: PLANNING,
        hoursNote: "Kin Faux: doors 7:00 p.m., show 8:00 p.m.; end time is not published. Arkey Blue listed 8:00 p.m. on secondary calendars (UNVERIFIED). This block is a planning window.",
        body: "Pick one. Kin Faux at 11th Street is the ticketed show. Arkey Blue's Silver Dollar is an unverified Saturday residency at the same hour.",
        options: [
          {
            id: "sat-kin-faux",
            kind: "event",
            startMin: 1200,
            endMin: 1320,
            shortTitle: "Kin Faux",
            title: "Kin Faux at 11th Street",
            time: "8:00 to 10:00 PM",
            hoursNote: "Doors 7:00 p.m., show 8:00 p.m. End time is not published.",
            address: "307 11th Street, Bandera, TX",
            body: "Sat Nov 28, 8:00 p.m., doors 7:00 p.m. Tickets via Outhouse: GA $15 advance / $20 day of show, plus reserved and VIP table options. Rain-or-shine, non-refundable as stated on the ticket page. Buy tickets in advance.",
            sources: [S.outhouse, S.eleventh, S.onat8],
          },
          {
            id: "sat-arkey",
            kind: "event",
            startMin: 1200,
            endMin: 1320,
            optional: true,
            shortTitle: "Arkey Blue's",
            title: "Arkey Blue's Silver Dollar",
            time: "8:00 to 10:00 PM",
            hoursNote: "Secondary calendars list 8:00 p.m. End time is not published. Treat as UNVERIFIED.",
            address: "308 Main Street, Bandera, TX",
            body: "308 Main Street. A Saturday-night residency for Arkey Blue and the Blue Cowboys at 8:00 p.m., including Nov 28, is repeated on secondary calendars. Treat Nov 28 at 8:00 p.m. as UNVERIFIED until confirmed with the venue or a Bandera Bulletin / CVB calendar for that week. No official venue page with a Nov 26–29 grid was confirmed.",
            unverified: true,
            unverifiedReason: "Treat Nov 28 at 8:00 p.m. as UNVERIFIED until confirmed with the venue.",
            sources: [S.hillCountryAi, S.cvbNov],
          },
        ],
        sources: [S.outhouse, S.eleventh, S.onat8, S.hillCountryAi, S.cvbNov],
      },
    ],
  },
  {
    id: "sun",
    date: "Sunday, Nov 29, 2026",
    weekday: "Sun",
    short: "Sun 29",
    title: "Checkout, then early Katy return or Country Christmas",
    weather: { high: "73°F", sky: "Sunny" },
    items: [
      {
        id: "sun-morning",
        kind: "activity",
        startMin: 480,
        endMin: 555,
        optional: true,
        shortTitle: "Morning walk",
        title: "Nicest weather of the trip (sunny, high near 73°F)",
        time: "8:00 to 9:15 AM",
        windowNote: PLANNING,
        hoursNote: "Frontier Times is closed Sunday. Bandera Natural History and Art Museum is listed Sunday noon to 5 p.m. OST regular Sunday 7 a.m. to 8 p.m.; TJ's 11 a.m. to 8 p.m.; Pap's Google Maps Sunday 11 a.m. to 8 p.m. Confirm kitchens.",
        imageId: "hill-country-sna",
        body: "Short hike at Hill Country SNA, or coffee and a walk at Bandera City Park / Medina River, or a last look at Main Street. Frontier Times is closed Sunday (Mon–Sat only). Bandera Natural History and Art Museum is listed Sunday noon–5 p.m. If a late brunch kitchen is open (OST regular Sunday 7 a.m.–8 p.m., TJ's 11 a.m.–8 p.m.; confirm), use a known vegetarian item or the cooler. Pap's Google Maps Sunday hours are 11 a.m.–8 p.m.; still not the planned dinner unless Friday and Saturday both missed it, and still call.",
        unverified: true,
        unverifiedReason: "Confirm Sunday restaurant hours. City Park hours UNVERIFIED.",
        sources: [S.nwsPoint, S.hillCountrySna, S.ost, S.tjs, S.frontierTimes, S.banderaNhm, S.papsMaps, S.prophetNews],
      },
      {
        id: "sun-checkout",
        kind: "rest",
        startMin: 555,
        endMin: 600,
        shortTitle: "Checkout",
        title: "Checkout",
        time: "9:15 to 10:00 AM",
        windowNote: "OTA working assumption (checkout by 10:00 a.m.), not published on flyingl.com.",
        hoursNote: "Checkout by 10:00 a.m. is the OTA window. This block is the leave-the-room stop, not a 7 a.m. to 10 a.m. stay.",
        address: "675 Flying L Dr, Bandera, TX 78003",
        body: "Ask if bags can be held if staying for the 4:30 p.m. event. Confirm checkout with the front desk.",
        unverified: true,
        unverifiedReason: "Checkout by 10:00 a.m. is OTA-based, not published on flyingl.com.",
        callToConfirm: "Call to confirm checkout and bag hold.",
        sources: [S.flyinglContact, S.booking, S.priceline],
      },
      {
        id: "sun-return-options",
        kind: "drive",
        startMin: 720,
        endMin: 840,
        shortTitle: "Return options",
        title: "Return options: leave around noon, or stay for Country Christmas",
        time: "12:00 to 2:00 PM",
        windowNote: PLANNING,
        hoursNote:
          "Plan A: leave around noon; OSRM no-traffic arrival in Katy about 3:56 p.m. (a 1:00 p.m. departure about 4:56 p.m.). Plan B stays for Country Christmas 4:30 to 6:30 p.m., then the night drive. Pick one.",
        body: "Pick one. The early return misses the tree lighting. Staying means a night drive after 6:30 p.m.",
        options: [
          {
            id: "sun-return-a",
            kind: "drive",
            startMin: 720,
            endMin: 956,
            shortTitle: "Leave for Katy",
            title: "Earlier return to Katy",
            time: "12:00 to 3:56 PM",
            windowNote:
              "Working plan: leave around noon. OSRM no-traffic arrival in Katy about 3:56 p.m. Not a verified clock.",
            address: "675 Flying L Dr, Bandera, TX 78003 to Katy, TX",
            body: "Leave Bandera around 12:00–1:00 p.m. OSRM no-traffic return is 3 hours 56 minutes (235.6 min, 217.78 mi), so a noon departure lands in Katy about 3:56 p.m.; a 1:00 p.m. departure about 4:56 p.m. Live Google Maps: Flying L to Katy. Misses the tree lighting; courthouse lights were already visible earlier in the weekend. Optional Buc-ee's Luling on I-10 east.",
            sources: [S.mapsDriveBack, S.osrm, S.osrmBack, S.cityCal, S.prophetCommunity, S.buceesLocations],
          },
          {
            id: "sun-stay",
            kind: "event",
            startMin: 720,
            endMin: 840,
            shortTitle: "Stay for Christmas",
            title: "Stay for Country Christmas, then night drive",
            time: "12:00 to 2:00 PM",
            hoursNote: "Country Christmas is 4:30 to 6:30 p.m. Night drive after 6:30 p.m. is a later block if you pick this option.",
            address: "Bandera City Park, 1102 Maple Street, Bandera, TX",
            imageId: "medina-river",
            body: "Stay in Bandera through the afternoon. Eat a vegetarian early dinner (TJ's is regularly open until 8 p.m. Sunday; Pap's Google Maps Sunday 11 a.m.–8 p.m.; confirm either) or pack car food. Then Country Christmas in the Park 4:30–6:30 p.m. and the night drive after.",
            sources: [S.cityCal, S.prophetCommunity, S.gillTeich, S.tjs, S.papsMaps],
          },
        ],
        sources: [S.mapsDriveBack, S.osrm, S.osrmBack, S.cityCal, S.prophetCommunity],
      },
      {
        id: "sun-christmas",
        kind: "event",
        startMin: 990,
        endMin: 1110,
        optional: true,
        shortTitle: "Country Christmas",
        title: "Country Christmas in the Park",
        time: "4:30 to 6:30 PM",
        address: "Bandera City Park, 1102 Maple Street, Bandera, TX",
        imageId: "medina-river",
        body: "Sunday, Nov 29, 4:30–6:30 p.m., Bandera City Park entrance, 1102 Maple Street. Admission free. Official tree and trail lighting. Skip this if the noon return was chosen. Eat a vegetarian early dinner in Bandera (TJ's is regularly open until 8 p.m. Sunday; Pap's Google Maps Sunday 11 a.m.–8 p.m.; confirm either) or pack car food for the night drive.",
        sources: [S.cityCal, S.prophetCommunity, S.gillTeich, S.tjs, S.papsMaps, S.mapsDriveBack, S.osrmBack],
      },
      {
        id: "sun-return-b",
        kind: "drive",
        startMin: 1110,
        endMin: 1346,
        optional: true,
        shortTitle: "Night drive",
        title: "Night drive to Katy after Country Christmas",
        time: "6:30 to 10:26 PM",
        windowNote:
          "Working plan: leave 6:30 p.m. after the lighting. OSRM no-traffic arrival in Katy about 10:26 p.m. A 7:00 p.m. departure is about 10:56 p.m. Not a verified clock.",
        address: "675 Flying L Dr, Bandera, TX 78003 to Katy, TX",
        body: "Same OSRM no-traffic return as plan A: 3 hours 56 minutes (235.6 min, 217.78 mi). Leave town soon after 6:30–7:00 p.m. A 6:30 p.m. departure arrives in Katy about 10:26 p.m.; a 7:00 p.m. departure about 10:56 p.m. Sunday-weekend traffic can add time. Optional Buc-ee's Luling on I-10 east. Live Google Maps: Flying L to Katy.",
        sources: [S.mapsDriveBack, S.osrm, S.osrmBack, S.buceesLocations],
      },
    ],
  },
];

export const events: TripEvent[] = [
  {
    id: "courthouse-lights",
    when: "Every evening after dark, Thu Nov 26-Sun Nov 29 (already on)",
    dates: ["2026-11-26", "2026-11-27", "2026-11-28", "2026-11-29"],
    title: "Bandera County Courthouse Christmas lights",
    imageId: "downtown-bandera",
    where: "500 Main Street, Bandera",
    detail:
      "Bandera Business Association: Christmas lights at Bandera County Courthouse, every evening after dark, Nov 23, 2026-Jan 1, 2027. Courthouse lights should be viewable after dark Thu-Sun.",
    sources: [S.bbaChristmas],
  },
  {
    id: "city-park-lights",
    when: "Sources disagree for Thu-Sat; official celebration is Sunday",
    dates: ["2026-11-26", "2026-11-27", "2026-11-28", "2026-11-29"],
    title: "City Park / Trail of Lights timing",
    imageId: "medina-river",
    where: "Bandera City Park, Hwy 173 Bridge along Maple Street / 1102 Maple Street",
    detail:
      "Do not collapse these into one fact. BBA: Bandera Christmas in the City Park, every evening weather permitting, Nov 23, 2026-Jan 1, 2027, gates open dusk to dawn. City calendar + Gill Teich summary of the city listing: official tree and trail lighting is Nov 29, 4:30-6:30 p.m.; Trail of Lights then open daily 4-10 p.m., Mon Nov 30-Sun Jan 3. A Hill Country Sun listing also mentions Christmas Lighting in Bandera City Park on Thursday, Nov 26, for viewing lights at the park and courthouse. Safe wording: the official tree lighting celebration is Sunday 4:30-6:30 p.m. Whether the full City Park trail is already lit Thu-Sat is not consistent across sources; check on arrival or use the courthouse lawn Thursday night.",
    unverified: true,
    unverifiedReason:
      "Whether the full City Park trail is already lit Thu-Sat is not consistent across sources.",
    sources: [S.bbaChristmas, S.cityCal, S.gillTeich, S.hillCountrySun],
  },
  {
    id: "dickens-fri",
    when: "Fri Nov 27, 12:00 p.m.-9:00 p.m.",
    dates: ["2026-11-27"],
    title: "Dickens on Main (Friday)",
    imageId: "boerne-main",
    where: "Downtown Boerne",
    detail:
      "This Thanksgiving Weekend, downtown Boerne transforms into a vintage holiday wonderland, complete with live music and performers, lights, food, kids activities and SNOW along Main Street. Highlights (not exhaustive; see the official page): Christmas market and food 12:00-9:00 p.m.; tree lighting at the gazebo 6:00-6:30 p.m.; ice carving show 6:30-7:30 p.m.; ice carving battle 8:00-9:00 p.m.; snow/ice slides 6:00-9:00 p.m.; Santa 3:00-8:00 p.m. Drive from Flying L about 39 min / 26.7 mi. Some attractions list a fee. Food vendors: vegetarian options UNVERIFIED.",
    unverified: true,
    unverifiedReason: "Dickens food-vendor vegetarian options UNVERIFIED.",
    sources: [S.dickens, S.dickensChamber],
  },
  {
    id: "dickens-sat",
    when: "Sat Nov 28, 12:00 p.m.-9:00 p.m.",
    dates: ["2026-11-28"],
    title: "Dickens on Main (Saturday)",
    imageId: "boerne-main",
    where: "Downtown Boerne",
    detail:
      "Same market hours 12:00-9:00 p.m. Stage includes Guy Vincent, SuperSquad, Nutcracker scenes, Marcy Grace Band, ice carving show and battle. Santa 3:00-8:00 p.m.; snow/ice slides and kids crafts as listed on the official page. Link out for the full grid.",
    sources: [S.dickens, S.dickensChamber],
  },
  {
    id: "rick-rice",
    when: "Fri Nov 27, 8:30 p.m.-12:30 a.m.",
    dates: ["2026-11-27"],
    title: "Rick Rice Band at 11th Street Cowboy Bar",
    where: "307 11th Street, Bandera, (830) 796-4849",
    detail: "Listed on the band's own schedule. Thu Nov 26 and Sun Nov 29: no shows listed on the venue schedule fetched Nov 23.",
    sources: [S.rickRice, S.eleventh],
  },
  {
    id: "kin-faux",
    when: "Sat Nov 28, 8:00 p.m. (doors 7:00 p.m.)",
    dates: ["2026-11-28"],
    title: "Kin Faux at 11th Street Cowboy Bar",
    where: "307 11th Street, Bandera",
    detail:
      "Tickets via Outhouse: GA $15 advance / $20 day of show, plus reserved and VIP table options. Rain-or-shine, non-refundable as stated on the ticket page.",
    sources: [S.outhouse, S.eleventh, S.onat8],
  },
  {
    id: "arkey-blue",
    when: "Sat Nov 28, 8:00 p.m. (treat as UNVERIFIED)",
    dates: ["2026-11-28"],
    title: "Arkey Blue and the Blue Cowboys (unverified)",
    where: "Arkey Blue's Silver Dollar, 308 Main Street",
    detail:
      "A Saturday-night residency at 8:00 p.m., including Nov 28, is repeated on secondary calendars. No official venue page with a Nov 26-29 grid was confirmed in this pass.",
    unverified: true,
    unverifiedReason: "UNVERIFIED until confirmed with the venue or a Bandera Bulletin / CVB calendar for that week.",
    sources: [S.hillCountryAi, S.cvbNov],
  },
  {
    id: "kerrville-market",
    when: "Fri Nov 27 and Sat Nov 28, 10:00 a.m.-4:00 p.m.",
    dates: ["2026-11-27", "2026-11-28"],
    title: "Christmas Indian Market at the Museum of Western Art",
    where: "1550 Bandera Highway, Kerrville, (830) 896-2553",
    detail:
      "Listed as Nov 26, 10:00 a.m. through Nov 28, 4:00 p.m., and explicitly closed on Thanksgiving Day. So the usable days are Fri-Sat. Hours within that window should be confirmed with the museum. Items for sale include silver and turquoise jewelry, Navajo rugs, baskets, beadwork, pottery, and more. Kerrville's main Holiday Lighted Parade / courthouse lighting is described on local calendars as having already taken place (Nov 21 in search results). Do not advertise a Kerrville parade during Nov 26-29 unless a primary calendar confirms a new one.",
    sources: [S.kerrvilleMarket, S.mowa],
  },
  {
    id: "sa-lights",
    when: "Fri Nov 27 onward (not Thanksgiving night)",
    dates: ["2026-11-27", "2026-11-28", "2026-11-29"],
    title: "San Antonio River Walk holiday lights and Friday events",
    imageId: "river-walk",
    where: "Downtown San Antonio (~70 min / 51.4 mi)",
    detail:
      "Official city release, Nov 18, 2026: River Walk holiday lights illuminated November 27-January 11 (dawn). Fri Nov 27, 6:00 p.m.: 45th Annual Ford Holiday River Parade (ticketed), theme Holiday Wishes Come True, starts at the Tobin Center; live broadcast 7:05 p.m. from the Arneson River Theatre; this is also the official river lighting ceremony. Fri Nov 27, 4:00-7:00 p.m. (tree lighting at 6:00 p.m.): free H-E-B Christmas Tree Lighting at Travis Park, 301 East Travis St. Sat Nov 28, 10:00 a.m.-6:00 p.m.: free Celebración Musical at Historic Market Square, 514 W. Commerce St. Downtown will be very busy Nov 27-29. Check road closures and parking at SA.gov/GoDowntown.",
    sources: [S.saHolidays, S.goDowntown],
  },
  {
    id: "country-christmas",
    when: "Sun Nov 29, 4:30-6:30 p.m.",
    dates: ["2026-11-29"],
    title: "Country Christmas in the Park and official tree lighting",
    imageId: "medina-river",
    where: "Bandera City Park entrance, 1102 Maple Street. Admission free.",
    detail:
      "The third annual Country Christmas in the Park and official Christmas tree lighting. City calendar lists Country Christmas in the Park all day Nov 29, and Trail of Lights: Country Christmas in the Park at 5:00 p.m. Nov 29. Local write-up summarizing the city's announcement: crafts, food vendors, bounce house, snow globes, reindeer, shopping, hot cocoa, live music, tree lighting, cookie competition; free admission. This is the main Bandera event of the stay, but it is Sunday late afternoon. If the return to Katy is mid-afternoon, this will be missed. OSRM no-traffic after a 6:30 p.m. departure is about 10:26 p.m. in Katy; after 7:00 p.m. about 10:56 p.m. Weekend traffic can add time.",
    sources: [S.cityCal, S.prophet, S.prophetCommunity, S.gillTeich, S.osrmBack, S.mapsDriveBack],
  },
  {
    id: "frontier-heritage",
    when: "Sat Nov 28, 11:00 a.m.-2:00 p.m.",
    dates: ["2026-11-28"],
    title: "Frontier Times Museum Native American Heritage Day",
    imageId: "frontier-times",
    where: "510 13th Street, Bandera, (830) 796-3864",
    detail:
      "Official events calendar: Saturday, Nov 28, 11:00 a.m.-2:00 p.m. First Native American Heritage Day at the museum. Listed activities include frybread over a campfire, beaded bracelets, arrowhead digging, atlatl, demonstrators and reenactors. Regular museum hours that day remain Monday-Saturday 10:00 a.m.-4:30 p.m. Frybread and other event food: vegetarian status UNVERIFIED (frybread is often made with lard). Ask before eating.",
    unverified: true,
    unverifiedReason: "Event food vegetarian status UNVERIFIED.",
    sources: [S.frontierEvents, S.frontierTimes],
  },
];

export const afterThisTrip = {
  title: "After this trip (not this weekend)",
  items: [
    {
      text: "Cowboy Christmas Parade and Jubilee are Dec 11-12, after this trip. Do not treat them as this weekend's events.",
      sources: [S.bbaChristmas],
    },
    {
      text: "Bandera Christmas Market on the courthouse grounds is Dec 12, after this trip.",
      sources: [S.bbaChristmas],
    },
    {
      text: "Albert & Bessie Kronkosky State Natural Area (Pipe Creek) opens Dec 1, after this trip. Do not list it as an option for Nov 26-29.",
      sources: [S.prophetNews],
    },
  ],
};

export const drives: DriveRow[] = [
  {
    id: "main-street",
    group: "in-town",
    imageId: "downtown-bandera",
    place: "Bandera Main Street / downtown",
    drive: "~6 min / 2.5 mi",
    reservations: "n/a",
    notes: "OST, TJ's, 11th Street, Arkey Blue's, courthouse lights, general store area.",
    sources: [S.ost, S.tjs, S.eleventh, S.bbaChristmas],
  },
  {
    id: "paps",
    group: "in-town",
    place: "Pap's Italian Grill, 632 TX-16, Bandera",
    drive: "~5 min / 2.4 mi",
    reservations: "No reservation found. Call (830) 796-9400. Thanksgiving hours UNVERIFIED.",
    unverified: true,
    unverifiedReason: "Thanksgiving hours UNVERIFIED. Google Maps vs county PDF disagree on Sunday close.",
    notes: "Suggested Friday or Saturday dinner. Not Thursday unless they confirm they are open.",
    sources: [S.papsMaps, S.papsSlice, S.papsMenuWeb, S.papsCounty],
  },
  {
    id: "frontier",
    group: "in-town",
    imageId: "frontier-times",
    place: "Frontier Times Museum, 510 13th Street",
    drive: "~4 min / 2.2 mi",
    reservations: "Walk-up. Adults $10. Mon-Sat 10:00 a.m.-4:30 p.m.; closed Sunday. Thanksgiving hours UNVERIFIED.",
    unverified: true,
    unverifiedReason: "Thanksgiving Day hours UNVERIFIED on the official site.",
    notes: "Saturday Nov 28, 11:00 a.m.-2:00 p.m.: Native American Heritage Day (official events page).",
    sources: [S.frontierTimes, S.frontierEvents],
  },
  {
    id: "nhm",
    group: "in-town",
    place: "Bandera Natural History and Art Museum, 267 Old San Antonio Rd",
    drive: "~5 min / 2.5 mi",
    reservations: "Tickets on the official site. Wed-Sat 10 a.m.-5 p.m.; Sun noon-5 p.m.; closed Mon-Tue. Thanksgiving hours UNVERIFIED.",
    unverified: true,
    unverifiedReason: "Thanksgiving Day hours UNVERIFIED.",
    notes: "DinoWalk, dioramas, New Spain art. Adult $14 as listed on banderanhm.org.",
    sources: [S.banderaNhm],
  },
  {
    id: "love-creek",
    group: "nearby",
    place: "Love Creek Orchards, 14024 State Highway 16 North, Medina",
    drive: "~20 min / 15.1 mi",
    reservations: "n/a",
    unverified: true,
    unverifiedReason: "Contact page says Closed for Holidays. Thanksgiving and weekend holiday hours UNVERIFIED.",
    notes:
      "Store and bakery listed 9 a.m.-5 p.m. every day; patio cafe 11 a.m.-3 p.m. every day. Cafe describes burgers, sandwiches, grilled and fried items; vegetarian plates UNVERIFIED. Useful stop toward Lost Maples.",
    sources: [S.loveCreek, S.loveCreekHours, S.lostMaples],
  },
  {
    id: "cibolo",
    group: "nearby",
    place: "Cibolo Nature Center, 140 City Park Road, Boerne",
    drive: "~40 min / 28.7 mi",
    reservations: "Trails free; donations appreciated. Trails dawn to dusk daily. Visitor center Mon-Fri 9 a.m.-4:30 p.m.",
    unverified: true,
    unverifiedReason: "Visitor-center hours on Friday Nov 27 (day after Thanksgiving) UNVERIFIED.",
    notes: "Pairs with Dickens on Main. Dogs leashed. Picnic tables. No bicycles on trails.",
    sources: [S.cibolo, S.dickens],
  },
  {
    id: "bucees-katy",
    group: "i10",
    place: "Buc-ee's Katy, 27700 Katy Fwy",
    drive: "~4 min / 2.1 mi from the Katy city point (start of the I-10 drive)",
    reservations: "n/a. Official: 24 hours, 365 days.",
    notes:
      "Fuel and snacks before leaving Katy. BBQ sandwiches are meat. Vegetarian-aware snacks (beaver nuggets, chips, fudge, fruit cups); other kitchen items UNVERIFIED.",
    sources: [S.buceesFaq, S.buceesLocations],
  },
  {
    id: "bucees-luling",
    group: "i10",
    imageId: "bucees-luling",
    place: "Buc-ee's Luling, 10070 West IH 10",
    drive: "On I-10: ~1 hr 55 min / 109.2 mi from Katy; ~2 hr 6 min / 109.0 mi onward to Flying L",
    reservations: "n/a. Official: 24 hours, 365 days.",
    notes:
      "Via-Luling OSRM total Katy to Flying L is 4 hours 1 minute / 218.3 miles, about 4 minutes over the direct no-traffic path.",
    sources: [S.buceesFaq, S.buceesLocations, S.osrm],
  },
  {
    id: "city-park",
    group: "in-town",
    imageId: "medina-river",
    place: "Bandera City Park / Medina River",
    drive: "a few minutes into town (1102 Maple St)",
    reservations: "Park hours UNVERIFIED after a recent ordinance change",
    unverified: true,
    unverifiedReason: "Park hours UNVERIFIED after a recent ordinance change. Confirm restrooms and any entrance rules.",
    notes:
      "River access, and the Sunday tree lighting. Stay away from dams and private banks; check water conditions.",
    sources: [S.cityCal, S.prophetNews],
  },
  {
    id: "hill-country-sna",
    group: "nearby",
    imageId: "hill-country-sna",
    place: "Hill Country State Natural Area, 10600 Bandera Creek Rd",
    drive: "~21 min / 12.3 mi",
    reservations:
      "Day-use reservations highly recommended. Adult $6; 12 and under free. Closed for public hunt until 6:00 a.m. Nov 26. HQ Thanksgiving 8:15 a.m.-12:00 p.m.; self-pay after. Office normally 8:15 a.m.-4:45 p.m.",
    reserve: true,
    notes: "Closest serious hike from the ranch. Trails may close when wet. Bring water; no park store.",
    sources: [S.hillCountrySna, S.dayPassFaqs, S.reserveAmerica],
  },
  {
    id: "lost-maples",
    group: "nearby",
    imageId: "lost-maples",
    place: "Lost Maples State Natural Area, 37221 FM 187, Vanderpool",
    drive: "~54 min / 41.5 mi",
    reservations:
      "Reserve a day pass. Adult $6. Park hours 8:30 a.m.-4:30 p.m. Capacity is reached daily in Oct-Nov; Thanksgiving week is called out as busy. Cell service is not available in the natural area.",
    reserve: true,
    notes:
      "Fall color as of Nov 17 was still mild/mostly green; a freeze arrives just before the trip, so color may improve. Recheck the foliage report or call (830) 966-3413, option 3. Lost Maples alerts page shows a hunter closure in January, not this weekend.",
    sources: [S.lostMaples, S.lostMaplesFoliage, S.lostMaplesAlert, S.reserveAmerica],
  },
  {
    id: "medina-town",
    group: "nearby",
    place: "Medina, TX",
    drive: "~22 min / 15.9 mi",
    reservations: "n/a",
    notes:
      "Small town on the way toward Lost Maples. No verified vegetarian restaurant was confirmed here (an ItSo Vegan Medina lead did not check out; official ItSo Vegan is in Grand Prairie).",
    sources: [S.lostMaples],
  },
  {
    id: "cave",
    group: "nearby",
    imageId: "cave",
    place: "Cave Without a Name, 325 Kreutzberg Rd, Boerne",
    drive: "~68 min / 37.5 mi",
    reservations:
      "Book a tour. Limited size; arrive 15-20 minutes early. Closed Thanksgiving Day and Christmas Day. Winter-season hours (Labor Day-Memorial Day): 10 a.m.-5 p.m., last tour 4 p.m.",
    reserve: true,
    notes: "About 60-minute guided tour; 66°F inside.",
    sources: [S.cave],
  },
  {
    id: "boerne",
    group: "nearby",
    imageId: "boerne-main",
    place: "Boerne (Dickens on Main)",
    drive: "~39 min / 26.7 mi",
    reservations: "No reservation for walking the festival; some attractions have fees",
    notes: "Best Fri-Sat daytime/evening event within a short drive.",
    sources: [S.dickens],
  },
  {
    id: "kerrville",
    group: "nearby",
    place: "Kerrville",
    drive: "~38 min / 27.7 mi",
    reservations: "Indian Market closed Thanksgiving",
    notes: "Pair a Friday or Saturday market visit with Mamacita's (ask about beans/stock).",
    sources: [S.kerrvilleMarket, S.mamacitas],
  },
  {
    id: "guadalupe",
    group: "longer",
    place: "Guadalupe River State Park, 3350 Park Road 31, Spring Branch",
    drive: "~60 min / 42.4 mi",
    reservations:
      "Day pass recommended. Adult $7. Gate 8 a.m.-10 p.m. HQ Sep-May 8 a.m.-4:30 p.m. daily. Discovery Center: Thu-Fri 10-2, Sat-Sun 10-4 (hours may vary on holidays).",
    reserve: true,
    notes:
      "Swimming/tubing is off-season and water will be cold (highs only 60s-70s; river colder). Fine for trails. Honey Creek guided hikes are Saturday (and some Sunday) mornings and require registration.",
    sources: [S.guadalupe, S.dayPassFaqs, S.reserveAmerica],
  },
  {
    id: "fredericksburg",
    group: "longer",
    place: "Fredericksburg",
    drive: "~65 min / 51.3 mi",
    reservations: "n/a",
    notes: "Shopping / German-heritage town. Can combine with Enchanted Rock, but that is a long day from Bandera.",
    sources: [S.enchantedRock],
  },
  {
    id: "river-walk",
    group: "longer",
    imageId: "river-walk",
    place: "San Antonio River Walk",
    drive: "~70 min / 51.4 mi",
    reservations: "Parade is ticketed; lights viewing is not",
    notes: "Lights start Fri Nov 27. Expect heavy downtown traffic and possible road closures.",
    sources: [S.saHolidays, S.goDowntown],
  },
  {
    id: "garner",
    group: "longer",
    place: "Garner State Park, 234 RR 1050, Concan",
    drive: "~83 min / 51.0 mi",
    reservations: "Day pass recommended, especially holidays. Age 13+ $8. Open 8 a.m.-10 p.m.",
    reserve: true,
    unverified: true,
    unverifiedReason: "Whether the summer dance runs this weekend is UNVERIFIED.",
    notes: "Frio River, 16 miles of trails, CCC buildings. Water will be cold.",
    sources: [S.garner, S.dayPassFaqs, S.reserveAmerica],
  },
  {
    id: "nbc",
    group: "longer",
    place: "Natural Bridge Caverns, 26495 Natural Bridge Caverns Rd, San Antonio 78266",
    drive: "~86 min / 65.0 mi",
    reservations:
      "Advance tickets recommended to lock price and tour time; not required for Discovery, Hidden Wonders, or Combo. Adventure Tours and groups require reservations: 210-651-6101 ext. 1211.",
    reserve: true,
    unverified: true,
    unverifiedReason:
      "Official park-hours page was JS-rendered (times not captured). Thanksgiving Day hours UNVERIFIED on the official pages fetched; do not assume open or closed.",
    notes: "Buy via naturalbridgecaverns.com.",
    sources: [S.nbc, S.nbcFaqs, S.nbcHours],
  },
  {
    id: "enchanted-rock",
    group: "longer",
    place: "Enchanted Rock State Natural Area, 16710 Ranch Rd 965, Fredericksburg",
    drive: "~96 min / 68.2 mi",
    reservations:
      "Reserve a day pass. Very popular; may sell out days ahead. Adult $8. Open 6:30 a.m.-10 p.m.; gate 6:30 a.m.-8 p.m. Trails generally close 30 minutes after sunset except the Loop Trail (open until 10 p.m.).",
    reserve: true,
    notes:
      "All trails were listed open when the park page was fetched. Bring drinking water (drought). Pets only in designated picnic/camp areas and on the Loop Trail.",
    sources: [S.enchantedRock, S.dayPassFaqs, S.reserveAmerica],
  },
  {
    id: "helotes",
    group: "longer",
    place: "Helotes",
    drive: "~42 min / 32.1 mi",
    reservations: "n/a",
    notes: "Optional stop toward San Antonio; no official vegetarian menu was confirmed in this pass.",
    sources: [S.saHolidays],
  },
];

export const alerts: AlertItem[] = [
  {
    id: "lowes-closed",
    tone: "warn",
    title: "Lowe's Market closed Thanksgiving",
    body: "Officially closed Thanksgiving (also Easter and Christmas). Shop at an H-E-B in Katy before noon (chain-wide hours reported 6 a.m.-noon; UNVERIFIED for the specific store).",
    unverified: true,
    unverifiedReason: "H-E-B Thanksgiving hours UNVERIFIED for the specific Katy store.",
    sources: [S.lowes, S.khou, S.fox4heb, S.heb],
  },
  {
    id: "hill-country-hunt",
    tone: "warn",
    title: "Hill Country SNA reopens 6:00 a.m. Thursday after a public hunt",
    body: "Park and all trails closed from Nov 23 until 6:00 a.m. Thu Nov 26. Headquarters Thanksgiving hours: 8:15 a.m.-12:00 p.m. Nov 26; the park stays open via self-pay outside headquarters holiday hours. Alert updated 8:15 a.m., Nov 23, 2026.",
    sources: [S.hillCountrySna],
  },
  {
    id: "lost-maples-pass",
    tone: "warn",
    title: "Lost Maples: reserve a day pass and recheck foliage",
    body: "Peak-season operations (capacity / day-pass system). Latest official foliage report on the site as of this research is Nov 17, 2026: trees still mostly green, a few starting to color; sycamores yellow and dropping; staff said a freeze would help the maples. A freeze is now forecast Tue night/Wed morning after that report. Recheck foliage reports or call (830) 966-3413, option 3.",
    sources: [S.lostMaples, S.lostMaplesFoliage, S.lostMaplesAlert],
  },
  {
    id: "wharton",
    tone: "warn",
    title: "Wharton's Dock Road 35 mph",
    body: "Speed limit reduced to 35 mph for 1.4 miles southbound from Hwy 173 S. This road is on the OSRM route into Flying L.",
    sources: [S.prophetNews, S.osrm],
  },
  {
    id: "riverwalk-friday",
    tone: "info",
    title: "River Walk lights start Friday, not Thanksgiving night",
    body: "Illuminated November 27-January 11 (dawn). Downtown San Antonio road closures and parking are likely Fri-Sun if visiting. Use SA.gov/GoDowntown.",
    sources: [S.saHolidays, S.goDowntown],
  },
  {
    id: "kronkosky",
    tone: "info",
    title: "Kronkosky SNA is not open until Dec 1",
    body: "Albert & Bessie Kronkosky State Natural Area (Pipe Creek) opens Dec 1, after this trip. Do not treat it as an option for Nov 26-29.",
    sources: [S.prophetNews],
  },
  {
    id: "cave-thu",
    tone: "warn",
    title: "Cave Without a Name closed Thanksgiving Day",
    body: "Officially closed Thanksgiving Day and Christmas Day.",
    sources: [S.cave],
  },
  {
    id: "city-hall-libraries",
    tone: "info",
    title: "City Hall and libraries closed Thursday (and more)",
    body: "City Hall is listed closed Nov 26 on the city calendar (the November grid also shows a closed listing on the Friday cell labeled 11/26, which may be a Thanksgiving-plus-Friday closure). Bandera Kronkosky Public Library closed Thu and Fri Nov 26-27; Medina Community Library closed Thu-Sat Nov 26-28.",
    sources: [S.cityCal, S.prophet],
  },
  {
    id: "burn-ban",
    tone: "info",
    title: "No countywide burn ban",
    body: "Lifted effective Oct 1, 2026. TPWD still warns that fire danger can change quickly at Hill Country SNA; check before building a fire, and use fire rings only, with firewood you bring.",
    sources: [S.prophet, S.prophetBurnBan, S.hillCountrySna],
  },
  {
    id: "screwworm",
    tone: "info",
    title: "New World screwworm in Bandera County (livestock / animal health)",
    body: "A horse tested positive. Bandera and Medina counties designated Infested Zone 31 under a Nov 10 executive order. This is a livestock/animal-health issue, not a typical visitor-illness risk, but it is local news. Do not approach livestock or wildlife.",
    sources: [S.prophetNews],
  },
  {
    id: "park-hours",
    tone: "info",
    title: "City Park hours and restrooms",
    body: "City Council approved an ordinance to identify consistent open hours for all City of Bandera park areas. The exact new hours were not in the homepage blurb. A Prophet news headline says City Park restrooms may be closed until further notice due to vandalism/theft. Tone of the blurb is punny; date of the item was not confirmed in this pass. Verify restroom status before planning a long river stop.",
    unverified: true,
    unverifiedReason: "City Park hours UNVERIFIED; restroom status not confirmed with a date in this pass.",
    sources: [S.prophetNews],
  },
  {
    id: "medina-lake",
    tone: "info",
    title: "Medina Lake level snapshot",
    body: "Reported on the Prophet homepage at 1,019.80 feet, 27.9% capacity (snapshot when fetched; not a swimming recommendation).",
    sources: [S.prophet],
  },
];

export const callSheet = [
  { name: "Flying L front desk", phone: "(830) 796-7745", tel: "tel:+18307967745", why: "Check-in, restaurant, campfire / wagon" },
  { name: "TJ's", phone: "(830) 796-9990", tel: "tel:+18307969990", why: "Thanksgiving hours" },
  { name: "China Bowl", phone: "(830) 796-8494", tel: "tel:+18307968494", why: "Thanksgiving hours and broth" },
  { name: "OST", phone: "(830) 796-3836", tel: "tel:+18307963836", why: "Thanksgiving hours" },
  { name: "Pap's Italian Grill", phone: "(830) 796-9400", tel: "tel:+18307969400", why: "Fri/Sat dinner; do not assume Thursday" },
];

export const tpwdNote =
  "Reserve Texas State Park day passes at the TPWD reservations portal or by calling (512) 389-8900. Day passes can be bought up to 30 days ahead, guarantee entry (not a specific parking lot), and are strongly recommended on holidays. Enchanted Rock may sell out days in advance.";

export const content = {
  meta,
  resort,
  weather,
  diet,
  driveIn,
  foodPicks,
  otherFoodNotes,
  days,
  events,
  afterThisTrip,
  drives,
  alerts,
  callSheet,
  tpwdNote,
  photos,
  photoGaps,
  sources: SOURCE_CATALOG,
};

export type BanderaContent = typeof content;

export function collectHrefs(value: unknown, acc: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectHrefs(item, acc);
    return acc;
  }
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.href === "string") acc.push(rec.href);
    for (const nested of Object.values(rec)) collectHrefs(nested, acc);
  }
  return acc;
}

export function collectUnverified(value: unknown, acc: unknown[] = []): unknown[] {
  if (Array.isArray(value)) {
    for (const item of value) collectUnverified(item, acc);
    return acc;
  }
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (rec.unverified === true || rec.hoursUnverified === true) acc.push(rec);
    for (const nested of Object.values(rec)) collectUnverified(nested, acc);
  }
  return acc;
}
