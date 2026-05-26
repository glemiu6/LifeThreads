export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { 'User-Agent': 'LifeThreads/1.0' } }
  );
  const data = await res.json();
  return data.display_name ?? `${lat}, ${lng}`;
}

export async function searchPlace(query: string): Promise<{ name: string; address: string; lat: number; lng: number }[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
    { headers: { 'User-Agent': 'LifeThreads/1.0' } }
  );
  const data = await res.json();
  return data.map((p: any) => ({
    name: p.display_name.split(',')[0],
    address: p.display_name,
    lat: Number(p.lat),
    lng: Number(p.lon)
  }));
}