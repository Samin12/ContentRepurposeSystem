---
name: yt-titles
description: Generate high-performing YouTube title ideas based on the user's video content description, cross-referenced with your recent top-performing videos. Use this skill whenever the user wants YouTube title suggestions, asks "what should I title this video", "give me title ideas", "title options for my video about...", "help me name this video", brainstorming video titles, or any request involving YouTube title generation or optimization. Also trigger when the user mentions titling, naming, or headlining a YouTube video even casually.
---

# YouTube Title Generator

Generate YouTube title options for your channel by analyzing what's already working and applying those patterns to new content.

## Why this approach works

YouTube titles aren't random — channels develop signature patterns that their audience responds to. By looking at your actual performance data (not generic "YouTube tips"), the titles this skill generates are grounded in what's proven to work for YOUR audience specifically. This matters because a title style that crushes it for a coding tutorial channel might flop on a business channel, even in the same niche.

## Workflow

### Step 1: Pull your channel performance data

Run the channel performance script to get your recent top performers:

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/yt-titles/scripts/channel_performance.py" --months 3 --count 30
```

This returns your videos from the last 3 months sorted by views, with views/day, engagement ratio, and like ratio. The views/day metric is especially important — it normalizes for upload date so a video posted yesterday isn't penalized against one from 2 months ago.

### Step 2: Analyze your title patterns

Look at the top 10 performers and identify:

- **Hooks**: What opening words/phrases pull people in? (e.g., "I built...", "Stop...", "This...", "How I...")
- **Structure**: What format do the titles follow? (e.g., "Hook + specific outcome", "Question format", "Number + result")
- **Length**: What character count range do top titles fall in?
- **Specificity signals**: Do they mention tools by name? Time frames? Dollar amounts? Results?
- **Emotional triggers**: Curiosity gaps, contrarian takes, urgency, authority?

Also note patterns in the BOTTOM performers — what to avoid.

### Step 3: Scout the competition

See what titles already exist for the same topic:

> **Optional step.** This uses a separate `yt-search` helper script that does not ship with this plugin. If it isn't installed, skip it — Steps 1, 2, and 4 (your own performance data + pattern analysis + generation) are the core of this skill and work on their own.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/yt-search/scripts/search.py" <topic keywords> --count 10 --months 3
```

This helps you:
- Avoid duplicating titles that already exist (YouTube deprioritizes near-duplicates)
- Find angles competitors missed
- Identify which framings are getting the most views in the space right now

### Step 4: Generate titles

Produce **10-15 title options** organized into tiers:

**Tier 1 — High confidence (3-5 titles)**
These follow your proven patterns most closely. They're the safe bet — formats you know work for your audience.

**Tier 2 — Calculated risks (3-5 titles)**
These remix your successful patterns with angles from top-performing competitor videos or trending formats. Higher ceiling, slightly less predictable.

**Tier 3 — Swing for the fences (3-5 titles)**
Contrarian angles, pattern breaks, or hooks you haven't tried yet. These might 10x or they might underperform — but testing new formats is how channels grow.

For each title, include a one-line note explaining:
- Which pattern from your data it's based on (or what new angle it's trying)
- Why it should work for the described content

### Title principles

These are patterns that consistently perform on YouTube, especially in the AI/tech space:

- **Front-load the hook** — The first 3-5 words determine if someone reads the rest. Put the most compelling element first.
- **Specific > vague** — "I Automated My Entire Business in 4 Hours" beats "How to Use AI for Business Automation"
- **Curiosity gaps work** — But only when paired with a credibility signal. "This AI Tool..." is weak. "This Free AI Tool Replaced My $2,000/month Software" has both.
- **Keep it under 60 characters** when possible — Longer titles get truncated on mobile, which is where most YouTube browsing happens.
- **Avoid clickbait that can't deliver** — your audience is savvy. The title should be the most compelling honest framing of what the video actually contains.
- **Match search intent when relevant** — If people are searching for "how to use Claude Code", having those words in the title helps. But don't force SEO at the expense of click-through rate.
- **Capitalize principal words** — Title Case reads better in YouTube's UI than sentence case or ALL CAPS.

### What NOT to do

- Don't use generic filler words: "Ultimate Guide", "Everything You Need to Know", "Complete Tutorial"
- Don't start with the channel name or "How to" unless the search intent demands it
- Don't use more than one emoji (if any) — your brand is clean and direct
- Don't use brackets like [FULL GUIDE] or [2026] unless there's a strong reason — they waste precious character space
- Don't generate titles that sound like every other AI YouTuber — the goal is to stand out in the feed

### Thumbnail text principles

Thumbnail text is NOT the title — it's the 2-5 words on the thumbnail image that work WITH the title to create a curiosity gap.

- **2-5 words maximum.** Thumbnails are tiny on mobile — if you can't read it at a glance, it's too long.
- **Complement, don't duplicate.** If the title says "How I Automated 90% of Social Media", the thumbnail should NOT say "90% Automated". It should say something like "ONE COMMAND" or "THE PIPELINE" — the thing that makes them click to find out how.
- **Create a gap with the title.** Title + thumbnail text should form an incomplete story that makes the viewer click. Title: "7 RAG Concepts..." + Thumbnail: "YOU'RE ALREADY DOING #2" = curiosity.
- **ALL CAPS reads better** on thumbnails at small sizes.
- **Emotion or reaction words work.** "WAIT WHAT", "GAME OVER", "IT'S FREE", "RIP [TOOL]"
- **Numbers and specifics.** "$0/month", "10 MINUTES", "7 SKILLS" — concrete beats abstract on thumbnails.

## Output format

Present the results like this:

```
## Your Top Performers (last 3 months)
[Brief summary of the top 5 with views and what title patterns stand out]

## Competitor Landscape
[What's already out there on this topic, and what angles are open]

## Title Options

### Tier 1 — High Confidence
1. **Title Here**
   Based on: [pattern reference] — [why it works for this content]

### Tier 2 — Calculated Risks
...

### Tier 3 — Swing for the Fences
...

## Thumbnail Text Options

For each Tier 1 title, generate 3-5 thumbnail text options:

### For: "[Title 1]"
1. **[2-3 WORDS]** — [why this works with the title]
2. **[2-3 WORDS]** — [why this works with the title]
3. **[2-3 WORDS]** — [why this works with the title]
```

After presenting, ask the user if they want to refine any direction or generate more variations on a specific title.
