import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({});
const apiKey = process.env.GOOGLE_MAPS_API_KEY!;

export interface PlaceResult {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
}

export async function geocodePlace(input: PlaceInputType): Promise<PlaceResult[]> {
    const response = await client.findPlaceFromText({
        params: {
            input: input,
            inputtype: PlaceInputType.textQuery,
            fields: ['name', 'formatted_address', 'geometry', 'place_id'],
            key: apiKey
        },
        timeout: 10000
    });

    return (response.data.candidates ?? []).map(p => ({
        name: p.name ?? '',
        address: p.formatted_address ?? '',
        latitude: p.geometry?.location.lat ?? 0,
        longitude: p.geometry?.location.lng ?? 0,
        placeId: p.place_id ?? ''
    })) || [];
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await client.reverseGeocode({
    params: { latlng: { lat, lng }, key: apiKey }
  });
  return res.data.results[0]?.formatted_address ?? `${lat}, ${lng}`;
}
