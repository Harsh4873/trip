// Photos for attractions, keyed by place id. Files live in public/images and
// are referenced RELATIVELY ("images/…") so they resolve under both the dev
// server root and the /trip GitHub Pages base path. All photos are free
// licenses (public domain / CC BY / CC BY-SA) from Wikimedia Commons; the
// credit string carries the required attribution.

export type PlaceImage = {
  src: string;
  alt: string;
  credit: string;
};

export const placeImages: Record<string, PlaceImage> = {
  "san-francisco-de-asis": {
    src: "images/san-francisco-de-asis.jpg",
    alt: "Adobe walls of San Francisco de Asís Mission Church in Ranchos de Taos",
    credit: "Travis K. Witt · CC BY-SA 3.0",
  },
  "taos-plaza": {
    src: "images/taos-plaza.jpg",
    alt: "Taos Plaza with shops and trees",
    credit: "CaroleHenson · CC BY-SA 4.0",
  },
  "taos-pueblo": {
    src: "images/taos-pueblo.jpg",
    alt: "Multi-story adobe buildings of Taos Pueblo",
    credit: "Luca Galuzzi · CC BY-SA 2.5",
  },
  "gorge-bridge": {
    src: "images/gorge-bridge.jpg",
    alt: "Rio Grande Gorge Bridge spanning the deep gorge",
    credit: "Daniel Schwen · CC BY-SA 4.0",
  },
  earthship: {
    src: "images/earthship.jpg",
    alt: "Earthship Biotecture visitor center with earth-bermed walls",
    credit: "Reettamarjaana · CC BY-SA 4.0",
  },
  "fechin-house": {
    src: "images/fechin-house.jpg",
    alt: "The Fechin House, home of the Taos Art Museum",
    credit: "Bill Johnson · CC BY-SA 4.0",
  },
  bandelier: {
    src: "images/bandelier.jpg",
    alt: "Cliff dwellings at Bandelier National Monument",
    credit: "Daniel Mayer · CC BY-SA 3.0",
  },
  "santa-fe-opera": {
    src: "images/santa-fe-opera.jpg",
    alt: "The open-air Crosby Theatre at the Santa Fe Opera",
    credit: "Vivaverdi · CC BY-SA 3.0",
  },
  "poeh-center": {
    src: "images/poeh-center.jpg",
    alt: "Adobe tower of the Poeh Cultural Center in Pojoaque",
    credit: "Thomson M · CC BY 3.0",
  },
  "nambe-falls": {
    src: "images/nambe-falls.jpg",
    alt: "Nambé Falls dropping between rock walls",
    credit: "theturquoisetable · CC BY-SA 2.0",
  },
  "sf-farmers-market": {
    src: "images/sf-farmers-market.jpg",
    alt: "Produce stands at the Santa Fe Farmers' Market",
    credit: "Bob Nichols, USDA · Public domain",
  },
  "meow-wolf": {
    src: "images/meow-wolf.jpg",
    alt: "Meow Wolf Santa Fe entrance",
    credit: "John Phelan · CC BY-SA 4.0",
  },
  ipcc: {
    src: "images/ipcc.jpg",
    alt: "Indian Pueblo Cultural Center in Albuquerque",
    credit: "Chris English · CC BY-SA 3.0",
  },
  "albuquerque-museum": {
    src: "images/albuquerque-museum.jpg",
    alt: "Entrance of the Albuquerque Museum",
    credit: "Kenneth C. Zirkel · CC BY 4.0",
  },
  "cadillac-ranch": {
    src: "images/cadillac-ranch.jpg",
    alt: "Painted Cadillacs planted nose-down at Cadillac Ranch, Amarillo",
    credit: "Gorup de Besanez · CC BY-SA 4.0",
  },
  "palo-duro": {
    src: "images/palo-duro.jpg",
    alt: "Red rock walls of Palo Duro Canyon",
    credit: "Gail Frederick · CC BY 2.0",
  },
};
