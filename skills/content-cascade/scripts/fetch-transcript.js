#!/usr/bin/env node
// Fetches YouTube transcript using the youtube-transcript package
// Usage: node fetch-transcript.js <youtube-url-or-video-id>
//
// SETUP: npm install youtube-transcript
//        Then set TRANSCRIPT_MODULE_PATH to the directory containing node_modules,
//        or run this script from that directory.

const modulePath = process.env.TRANSCRIPT_MODULE_PATH || process.cwd();
const { YoutubeTranscript } = require(
  require("path").join(modulePath, "node_modules", "youtube-transcript")
);

const input = process.argv[2];
if (!input) {
  console.error("Usage: node fetch-transcript.js <youtube-url-or-video-id>");
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
  // Assume it's a raw video ID if 11 chars
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  return null;
}

const videoId = extractVideoId(input);
if (!videoId) {
  console.error("Could not extract video ID from:", input);
  process.exit(1);
}

YoutubeTranscript.fetchTranscript(videoId)
  .then((segments) => {
    if (!segments.length) {
      console.error("No captions available for this video");
      process.exit(1);
    }
    console.log(segments.map((s) => s.text).join(" "));
  })
  .catch((err) => {
    console.error("Transcript fetch failed:", err.message);
    process.exit(1);
  });
