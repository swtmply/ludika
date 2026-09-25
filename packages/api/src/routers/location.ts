import { TRPCError } from "@trpc/server";
import z from "zod";

import { publicProcedure, router } from "../index";

// TODO: Move to @ludika/env/server before building for production.
const PHOTON_BASE_URL = "https://photon.komoot.io";

// Metro Manila centroid — biases Photon results toward the NCR.
// TODO: Expand to a wider bounding box (or make it configurable) once we
//       support deliveries outside Metro Manila.
const METRO_MANILA_LAT = 14.5995;
const METRO_MANILA_LON = 120.9842;

const TAG = "[location]";

type PhotonFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    osm_id?: number;
    osm_type?: string;
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    type?: string;
  };
};

type PhotonResponse = {
  type: "FeatureCollection";
  features: PhotonFeature[];
};

function buildAddress(props: PhotonFeature["properties"]): string {
  const parts: string[] = [];
  if (props.housenumber) parts.push(props.housenumber);
  if (props.street) parts.push(props.street);
  if (props.district) parts.push(props.district);
  if (props.city) parts.push(props.city);
  if (props.state) parts.push(props.state);
  return parts.join(", ") || props.county || props.country || "Unknown address";
}

function buildCategory(props: PhotonFeature["properties"]): string {
  const type = props.type ?? "";
  const map: Record<string, string> = {
    house: "Address",
    street: "Street",
    locality: "Neighborhood",
    district: "District",
    city: "City",
    county: "County",
    state: "Province",
    country: "Country",
  };
  return map[type] ?? "Place";
}

export const locationRouter = router({
  ping: publicProcedure.query(() => {
    console.log(`${TAG} ping hit`);
    return { ok: true, ts: new Date().toISOString() };
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(20).default(10),
      }),
    )
    .query(async ({ input }) => {
      const url = new URL("/api/", PHOTON_BASE_URL);
      url.searchParams.set("q", input.query);
      url.searchParams.set("limit", String(input.limit));
      // Bias toward Metro Manila.
      url.searchParams.set("lat", String(METRO_MANILA_LAT));
      url.searchParams.set("lon", String(METRO_MANILA_LON));

      console.log(
        `${TAG} search → query="${input.query}" url=${url.toString()}`,
      );

      let res: Response;
      try {
        res = await fetch(url.toString());
      } catch (err) {
        console.error(`${TAG} fetch threw:`, err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to reach the geocoding service. Check your connection.",
        });
      }

      console.log(`${TAG} Photon responded status=${res.status} ok=${res.ok}`);

      if (!res.ok) {
        const body = await res.text().catch(() => "(unreadable)");
        console.error(`${TAG} Photon error body:`, body);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Geocoding service returned ${res.status}.`,
        });
      }

      const data = (await res.json()) as PhotonResponse;
      console.log(`${TAG} Photon returned ${data.features.length} feature(s)`);

      return data.features.map((feature, index) => {
        const [lon, lat] = feature.geometry.coordinates;
        const props = feature.properties;
        return {
          id: `photon-${props.osm_type ?? "n"}-${props.osm_id ?? index}`,
          name:
            props.name ??
            props.street ??
            props.district ??
            props.city ??
            "Unknown",
          address: buildAddress(props),
          category: buildCategory(props),
          latitude: lat,
          longitude: lon,
        };
      });
    }),
});
