---
name: short-form
description: "Repurpose a long-form YouTube video into short-form clips for Reels, Shorts, and TikTok. Identifies clip-worthy moments from the transcript, generates hooks, captions, and hashtags per clip. Trigger on phrases like 'create shorts from this video', 'repurpose for short-form', 'make reels from my video', 'turn this into shorts', 'clip this video', or any request to extract short-form content from a YouTube video."
---

# Short-Form Repurposing Engine

Turn a long-form YouTube video into 3-5 short-form clips optimized for Reels, Shorts, and TikTok. Identifies the most clip-worthy moments, generates platform-specific hooks and captions, and provides timestamps for editing.

## When This Skill Activates

**Activate when the user wants to:**
- Create Reels, Shorts, or TikTok clips from a YouTube video
- Repurpose long-form content into short-form
- Identify the best clips from a video
- Generate captions and hooks for short-form content

**Example triggers:**
- "Create shorts from my latest video"
- "Repurpose this for short-form"
- "What are the best clips from this video?"
- `/short-form` or `/short-form <youtube-url>`

## Pipeline

### Step 1 — Get the Transcript

**If the user provided a YouTube URL**, use it.

**If the user said "latest video"**, auto-detect:
```bash
yt-dlp --flat-playlist --playlist-end 1 --print url --print title "https://www.youtube.com/channel/YOUR_CHANNEL_ID/videos"
```

Confirm with user: "Found your latest video: [TITLE]. Pulling clips from this one."

Fetch transcript using these methods in order:

**Method 1 — Apify:**
```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/content-cascade/scripts/fetch-transcript-apify.js" "<youtube-url>"
```

**Method 2 — youtube-transcript:**
```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/content-cascade/scripts/fetch-transcript.js" "<youtube-url>"
```

**Method 3 — yt-dlp subtitles:**
```bash
yt-dlp --write-sub --sub-lang en-orig --skip-download --sub-format json3 -o "$TEMP/yt-transcript" "<youtube-url>"
```

Fall back to `--write-auto-sub --sub-lang en` if `en-orig` unavailable.

Parse json3:
```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = process.env.TEMP;
const file = fs.readdirSync(dir).find(f => f.startsWith('yt-transcript') && f.endsWith('.json3'));
if (!file) { console.error('No subtitle file found'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
const text = data.events.filter(e => e.segs).map(e => e.segs.map(s => s.utf8 || '').join('')).join(' ').replace(/\n/g, ' ').replace(/\\s+/g, ' ').trim();
console.log(text);
"
```

**Validation:** Sanity-check first 1-2 sentences against video title. Wrong transcript → try next method.

If all methods fail: "Captions aren't available yet — YouTube takes 30-60 minutes after upload. Try again later."

### Step 2 — Identify Clip-Worthy Moments

Scan the transcript for **3-5 best short-form moments**. Each clip: **30-90 seconds** when spoken (~75-225 words).

**What makes a clip-worthy moment:**

1. **Self-contained insight** — makes sense without the full video
2. **High shock value** — surprising stat, counterintuitive claim, unexpected result (70+ shock score)
3. **Emotional peak** — passion, frustration, excitement, humor in delivery
4. **Quotable statement** — a line worth screenshotting and sharing
5. **Demo moment** — visual reveal or before/after that works vertical
6. **Contrarian take** — bold opinion that sparks comments/debate

**NOT clip-worthy:**
- Setup/context without payoff
- References to other parts of the video ("as I mentioned earlier...")
- Technical walkthroughs needing wide screen context
- Transitions between topics

### Step 3 — Generate Content Per Clip

For each clip:

**Clip Title:** Working title for internal reference.

**Approximate Timestamps:** Start → End (from original video). If no json3 timestamps available, estimate at ~150 words per minute.

**Transcript Excerpt:** The exact words from this segment.

**Short-Form Hook (first 1-3 seconds):**
The scroll-stopper. Apply Kallaway framework:
- **Text overlay:** 2-5 words, maximum impact. First frame.
- **Spoken opening:** First sentence. Immediate curiosity or tension.
- Map to a Horseman desire
- Fifth-grade reading level

**Rewritten Script (if needed):**
If the transcript segment has tangents or loose pacing for short-form, provide a tightened version. If the original is already tight, skip.

**Caption:**
Platform-ready. Short, punchy:
- One-line hook (complements, doesn't duplicate the video hook)
- 1-2 lines of context or value tease
- CTA ("Follow for more Claude Code tips" or "Full breakdown linked in bio")

**Hashtags:**
5-10 relevant. Mix of:
- Broad reach: #ai #claudecode #programming #tech
- Niche: #claudecodetips #aiautomation #ragpipeline
- Trending (if applicable)

**Platform Notes:**
- **Reels:** Polished editing, text overlays throughout, trending audio optional
- **Shorts:** YouTube algorithm favors rewatchability — should make sense on loop
- **TikTok:** Raw/authentic > polished, conversation-starter hooks, stitch/duet bait

### Step 4 — Rank Clips

1. **Best for reach** — highest viral potential (broadest appeal, highest shock)
2. **Best for conversions** — drives traffic to full video or your paid community
3. **Best for engagement** — sparks the most comments/debate

### Step 5 — Output

```
## Video: [Title]
**Source:** [YouTube URL]
**Clips identified:** [N]

---

### Clip 1: [Clip Title] — Best for [reach/conversions/engagement]

**Timestamps:** [MM:SS — MM:SS]
**Duration:** ~[X] seconds

**Hook:**
- Text overlay: "[2-5 words]"
- Spoken: "[First sentence]"

**Transcript excerpt:**
> [Exact words from this segment]

**Rewritten script:** [Tightened version, or "Original is tight — use as-is"]

**Caption:**
[Ready-to-paste]

**Hashtags:** #tag1 #tag2 #tag3 #tag4 #tag5

---

### Clip 2: [Clip Title]
[Same structure...]
```

### Step 6 — Save to Vault (Optional)

Save to `YOUR_VAULT_PATH/content/short-form/YYYY-MM-DD-<slug>-shorts.md`:

```markdown
---
title: "Short-Form Clips — [Video Title]"
date: YYYY-MM-DD
youtube_video_id: VIDEO_ID
source_video: "[Video Title]"
clips: [N]
status: draft
---

[Full clip breakdown]
```

## Key Principles

- **First frame decides everything.** Short-form lives or dies in 1 second. Text overlay + opening words must stop the scroll.
- **Self-contained > teaser.** Deliver value in the clip itself. "Watch the full video for the answer" kills completion rate. Give value, THEN mention the full video.
- **Vertical thinking.** Not everything translates to short-form. Only pick moments that genuinely work in the format.
- **Comments = algorithm fuel.** Contrarian takes, surprising stats, and hot takes drive comments, which drive reach.
- **3-5 clips per video is the sweet spot.** More and quality drops. Fewer and you're leaving content on the table.
- **Don't over-produce.** Captions should sound natural, not copywritten. your voice is direct and conversational.
