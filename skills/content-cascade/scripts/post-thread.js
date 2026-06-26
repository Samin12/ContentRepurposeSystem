#!/usr/bin/env node
// Posts a Twitter/X thread from a file and optionally appends a YouTube link as a final reply.
// Usage: node post-thread.js <thread-file> [youtube-url]
//
// SETUP: npm install twitter-api-v2
//        Set these environment variables (or put them in a .env file):
//        - TWITTER_API_KEY
//        - TWITTER_API_SECRET
//        - TWITTER_ACCESS_TOKEN
//        - TWITTER_ACCESS_TOKEN_SECRET

const path = require("path");
const fs = require("fs");

// Load .env file if it exists (check skill directory first, then cwd)
const envLocations = [
  path.join(__dirname, "..", ".env"),
  path.join(process.cwd(), ".env"),
];

for (const envPath of envLocations) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex);
      const val = trimmed.slice(eqIndex + 1);
      if (!process.env[key]) process.env[key] = val;
    }
    break;
  }
}

// Try to load twitter-api-v2 from common locations
let TwitterApi;
const modulePaths = [
  process.env.TWITTER_MODULE_PATH,
  path.join(__dirname, "..", "node_modules"),
  path.join(process.cwd(), "node_modules"),
].filter(Boolean);

for (const mp of modulePaths) {
  try {
    TwitterApi = require(path.join(mp, "twitter-api-v2")).TwitterApi;
    break;
  } catch (e) {}
}

if (!TwitterApi) {
  console.error("Could not find twitter-api-v2. Install with: npm install twitter-api-v2");
  process.exit(1);
}

const threadFile = process.argv[2];
const youtubeUrl = process.argv[3];

if (!threadFile) {
  console.error("Usage: node post-thread.js <thread-file> [youtube-url]");
  process.exit(1);
}

function parseTweets(content) {
  // Split on numbered tweet markers (1/, 2/, etc.) at the start of a line
  const parts = content.split(/(?:^|\n)(?=\d+\/\s)/);
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .map((block) => block.replace(/^\d+\/\s*/, "").trim());
}

async function main() {
  const content = fs.readFileSync(threadFile, "utf8");
  const tweets = parseTweets(content);

  if (tweets.length === 0) {
    console.error("No tweets found in file");
    process.exit(1);
  }

  const twitter = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  console.log(`Posting thread (${tweets.length} tweets)...`);

  // Post first tweet
  const first = await twitter.v2.tweet(tweets[0]);
  let lastTweetId = first.data.id;
  console.log(`  1/${tweets.length} posted`);

  // Chain replies
  for (let i = 1; i < tweets.length; i++) {
    const reply = await twitter.v2.reply(tweets[i], lastTweetId);
    lastTweetId = reply.data.id;
    console.log(`  ${i + 1}/${tweets.length} posted`);
  }

  // Append YouTube link as final self-reply
  if (youtubeUrl) {
    await twitter.v2.reply(`Watch the full video \u{1F447}\n${youtubeUrl}`, lastTweetId);
    console.log("  Video link reply posted");
  }

  const me = await twitter.v2.me();
  const url = `https://x.com/${me.data.username}/status/${first.data.id}`;
  console.log(`\nThread live: ${url}`);
}

main().catch((err) => {
  console.error("Failed to post thread:", err.message);
  process.exit(1);
});
