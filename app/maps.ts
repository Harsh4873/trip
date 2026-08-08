// Google Maps deep links (keyless dir API). Shared by the schedule views and
// the full-screen deck.

import type { Place } from "./trip-data";

export function directionsHref(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function routeHref(route: { origin?: string; destination: string; waypoints?: string[] }) {
  const search = new URLSearchParams({ api: "1", destination: route.destination });
  if (route.origin) search.set("origin", route.origin);
  if (route.waypoints?.length) search.set("waypoints", route.waypoints.join("|"));
  return `https://www.google.com/maps/dir/?${search.toString()}`;
}

export function placeDirectionsHref(place: Place) {
  return directionsHref(`${place.name}, ${place.city}`);
}
