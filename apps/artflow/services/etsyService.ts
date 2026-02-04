import { EtsyConfig, EtsyMetadata, GeneratedImage } from "../types";

/**
 * Etsy API v3 Draft Listing Pipeline
 * 1. Create Draft Listing: POST /v3/application/shops/{shop_id}/listings
 * 2. Upload Image: POST /v3/application/shops/{shop_id}/listings/{listing_id}/images
 * 3. Upload Video: POST /v3/application/shops/{shop_id}/listings/{listing_id}/videos
 */

export const uploadToEtsy = async (
  config: EtsyConfig,
  metadata: EtsyMetadata,
  image: GeneratedImage,
  videoBlob: Blob | null
): Promise<string> => {
  if (!config.shopId || !config.accessToken) {
    throw new Error("Etsy configuration missing Shop ID or Access Token.");
  }

  const baseUrl = `https://openapi.etsy.com/v3/application/shops/${config.shopId}`;
  const headers = {
    'Authorization': `Bearer ${config.accessToken}`,
    'x-api-key': config.apiKey,
    'Content-Type': 'application/json'
  };

  // 1. Create Listing
  const listingResponse = await fetch(`${baseUrl}/listings`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      quantity: metadata.quantity || 1,
      title: metadata.title,
      description: metadata.description,
      price: metadata.price || "10.00",
      who_made: "i_did",
      when_made: "made_to_order",
      taxonomy_id: 1, // Digital Prints category ID
      is_supply: false,
      state: "draft",
      tags: metadata.tags
    })
  });

  if (!listingResponse.ok) {
    const err = await listingResponse.json();
    throw new Error(`Etsy Listing Error: ${err.error || listingResponse.statusText}`);
  }

  const listingData = await listingResponse.json();
  const listingId = listingData.listing_id;

  // 2. Upload Image
  const imgFormData = new FormData();
  const imgBlob = await (await fetch(`data:${image.mimeType};base64,${image.base64}`)).blob();
  imgFormData.append('image', imgBlob, 'art.png');

  const imgHeaders = { ...headers };
  delete (imgHeaders as any)['Content-Type']; // Let browser set boundary

  const imgResponse = await fetch(`${baseUrl}/listings/${listingId}/images`, {
    method: 'POST',
    headers: imgHeaders,
    body: imgFormData
  });

  if (!imgResponse.ok) console.warn("Image upload to Etsy failed, but listing was created.");

  // 3. Upload Video
  if (videoBlob) {
    const vidFormData = new FormData();
    vidFormData.append('video', videoBlob, 'process.mp4');
    
    const vidResponse = await fetch(`${baseUrl}/listings/${listingId}/videos`, {
      method: 'POST',
      headers: imgHeaders,
      body: vidFormData
    });
    
    if (!vidResponse.ok) console.warn("Video upload to Etsy failed.");
  }

  return listingId.toString();
};
