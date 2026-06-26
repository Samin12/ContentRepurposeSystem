#!/usr/bin/env node
// Fetches YouTube transcript using the Apify karamelo~youtube-transcripts actor
// Usage: node fetch-transcript-apify.js <youtube-url-or-video-id>
//
// SETUP: Set the APIFY_API_TOKEN environment variable with your Apify API token.
//        Get one free at https://apify.com (the free tier includes enough credits).

const input = process.argv[2];
if (!input) {
  console.error("Usage: node fetch-transcript-apify.js <youtube-url-or-video-id>");
  process.exit(1);
}

// Extract video ID from URL or use directly
function extractVideoId(input) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  return null;
}

const videoId = extractVideoId(input);
if (!videoId) {
  console.error("Could not extract video ID from:", input);
  process.exit(1);
}

const token = process.env.APIFY_API_TOKEN;
if (!token) {
  console.error("Error: APIFY_API_TOKEN environment variable is not set.");
  console.error("Get a free API token at https://apify.com and set it:");
  console.error("  export APIFY_API_TOKEN=your_token_here");
  process.exit(1);
}

const url = "https://api.apify.com/v2/acts/karamelo~youtube-transcripts/run-sync-get-dataset-items";

const body = JSON.stringify({
  channelIDBoolean: false,
  channelNameBoolean: false,
  commentsBoolean: false,
  datePublishedBoolean: false,
  dateTextBoolean: false,
  descriptionBoolean: false,
  keywordsBoolean: false,
  likesBoolean: false,
  maxRetries: 8,
  proxyOptions: {
    useApifyProxy: true,
    apifyProxyGroups: ["BUYPROXIES94952"]
  },
  relativeDateTextBoolean: false,
  thumbnailBoolean: false,
  urls: [`https://www.youtube.com/watch?v=${videoId}`],
  viewCountBoolean: false
});

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: body
})
  .then(res => {
    if (!res.ok) throw new Error(`Apify API returned ${res.status}: ${res.statusText}`);
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("No results returned from Apify");
      process.exit(1);
    }
    const captions = data[0].captions;
    if (!captions || (Array.isArray(captions) && captions.length === 0)) {
      console.error("No captions found in Apify response");
      process.exit(1);
    }
    // Captions can be a string or an array of strings — handle both
    let text = Array.isArray(captions) ? captions.join(" ") : captions;
    // Decode HTML entities (e.g., &#39; -> ')
    text = text.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
    console.log(text);
  })
  .catch(err => {
    console.error("Apify transcript fetch failed:", err.message);
    process.exit(1);
  });
