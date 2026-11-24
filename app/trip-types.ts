export type TripId = "bandera" | "nola";

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

export type DriveGroup = "in-town" | "nearby" | "i10" | "longer";

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
  group: DriveGroup;
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

export type WeatherDay = {
  id: string;
  label: string;
  name?: string;
  sky: string;
  high: string;
  low?: string;
  detail: string;
  zone?: string;
};

export type FoldNote = {
  title: string;
  body: string;
  unverified?: boolean;
  unverifiedReason?: string;
  sources?: SourceLink[];
};

export type TripMeta = {
  tripId: TripId;
  title: string;
  dates: string;
  timezone: string;
  timezoneNote: string;
  researchedAsOf: string;
  researchedAsOfLong?: string;
  stayName: string;
  stayAddress?: string;
  originCity: string;
  spanAllLabel: string;
  mapsOutboundLabel: string;
  mapsReturnLabel: string;
  foodLead: string;
  attractionsLead: string;
  eventsLead: string;
  stayFoldTitle: string;
  hoursWarning: string;
  driveAssumption: string;
  groupLabels: Record<DriveGroup, string>;
};

export type TripContent = {
  meta: TripMeta;
  weather: {
    updated: string;
    valid: string;
    pointLabel: string;
    takeaway: string;
    freezeWarning?: string;
    sources: SourceLink[];
    days: WeatherDay[];
  };
  diet: {
    title: string;
    summary: string;
    coconut: string;
    coconutUnverified?: boolean;
    coconutUnverifiedReason?: string;
    sources: SourceLink[];
  };
  driveIn: {
    blurb: string;
    osrmShort: string;
    sources: SourceLink[];
  };
  foodPicks: FoodCard[];
  days: DayPlan[];
  events: TripEvent[];
  drives: DriveRow[];
  alerts: AlertItem[];
  photos: PlacePhoto[];
  photoGaps: string[];
  foldNotes: FoldNote[];
  extraFoodCards?: FoodCard[];
  weakerFood?: { title: string; lines: string[]; note?: string; unverifiedReason?: string; sources?: SourceLink[] };
};
