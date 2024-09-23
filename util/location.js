
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Function to get a map preview image URL
export function getMapPreview(lat, lng) {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap
&markers=color:red%7Clabel:S%7C${lat},${lng}
&key=${GOOGLE_API_KEY}`;
  return imagePreviewUrl;
}

// Function to get address from latitude and longitude
export async function getAddress(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch address!');
  }

  const data = await response.json();

  // Check if results array is not empty
  if (data.results.length === 0) {
    throw new Error('No address found for the given coordinates.');
  }

  // Return the formatted address
  const address = data.results[0].formatted_address;
  return address;
}
