---
name: hooks
description: "Generate YouTube video hooks using the Kallaway desire-based framework. Produces Three Hook Alignment (visual + spoken + text), applies the Four Commandments, maps to core desires, and scores each hook. Trigger on phrases like 'write a hook for', 'hook ideas for my video', 'help me with the intro', 'generate hooks', 'write the opening for', or any request for YouTube video hooks, intros, or opening lines."
---

# YouTube Hook Generator — Kallaway Framework

Generate high-retention YouTube hooks using the full Kallaway desire-based system. Every hook is scored against the Four Commandments and delivered as a Three Hook Alignment (visual + spoken + text).

## When This Skill Activates

**Activate when the user wants to:**
- Write a hook for a video they're planning
- Generate opening lines or intro scripts
- Improve an existing hook
- Get multiple hook options to test

**Example triggers:**
- "Write hooks for my RAG video"
- "Hook ideas for 'How I Automated 90% of Social Media'"
- "Help me nail the intro for this video"
- `/hooks` or `/hooks <video concept>`

## Input

The user provides one or more of:
- **Video concept/topic** — what the video is about
- **Idea brief** — output from `/ideation`
- **Outline** — output from `/outlines`
- **Key talking points** — the most interesting facts/reveals

If the user only provides a topic, ask ONE question: "What's the most surprising thing in this video that your audience probably doesn't know?" That answer becomes the hook's core material.

## The Kallaway Framework

### Phase 1 — Identify the Desire

**Map to one of the Four Horsemen:**
- **Money** — making it, saving it, growing it
- **Time** — saving it, not wasting it, getting hours back
- **Health** — reducing stress, avoiding burnout, mental clarity
- **Status** — looking smart, being ahead, impressing peers

**Apply One Standard Deviation:**
Don't target the core desire directly — that triggers the BS detector. Package it one step away using a proxy desire.

| Core Desire | Direct (BS detector) | Proxy (one standard deviation) |
|------------|-------------------------------|-------------------------------|
| Money | "Make more money with AI" | "Automate your entire content pipeline" |
| Time | "Save 10 hours a week" | "Never start a Claude Code session from scratch" |
| Status | "Become an AI expert" | "Build what your team thinks requires a dev shop" |
| Health | "Reduce work stress" | "Stop manually doing what AI handles in seconds" |

### Phase 2 — Generate Hooks Using Five Desire-Based Variations

Generate at least one hook in EACH variation:

**1. About Me (looking backward)**
"I just [accomplished X] using [Y]"
- Example: "I just automated 90% of my social media workflow using Claude Code — and it took me a weekend."

**2. If I (looking forward)**
"If I wanted to [achieve X], I would [Y]"
- Example: "If I were starting a YouTube channel in 2026, this is the exact AI workflow I'd set up on day one."

**3. To You (viewer as character)**
"If you're trying to [X], use [Y]"
- Example: "If you're spending more than 30 minutes on social media content per video, you're doing it wrong."

**4. Can You (viewer as question)**
"Is it possible to [X] under [Y]?"
- Example: "Is it possible to go from one YouTube video to 10 pieces of content — automatically?"

**5. He/She Just Did (third party proof)**
"[Z] just accomplished [X] under [Y]"
- Example: "A creator with 500 subscribers just used Claude Code to build a content pipeline that rivals teams of five."

### Phase 3 — Apply Hook Formats

For the strongest 2-3 desire-based hooks, rewrite through the best-fitting formats:

1. **Secret Reveal** — tease unknown insights or future implications
2. **Case Study** — how a subject achieved a result unexpectedly
3. **Comparison** — instantly compare two versions to show optimal state
4. **Question** — directly implant curiosity
5. **Education** — introduce a step-by-step process
6. **List** — ordered set of items
7. **Contrarian** — bold take against the grain
8. **Personal Experience** — first-person story framing
9. **Problem** — agitate a pain point, then set up solution

Pick the 2-3 formats that match the content. Don't force all nine.

### Phase 4 — Score with Six Hook Power Words

For each hook, check it contains:

1. **Subject** — who the video is about (I, we, you, [brand])
2. **Action** — the verb (built, automated, replaced, discovered)
3. **Objective** — the end result/outcome
4. **Contrast** — comparing states (before vs. after, 0 to X, manual vs. automated)
5. **Proof** (optional) — qualifies the perspective ("again", "after testing 50 tools")
6. **Time** (optional) — adds urgency ("in one weekend", "in under 5 minutes")

### Phase 5 — Three Hook Alignment

For the top 3 hooks, generate the full alignment:

**Visual Hook** — What is shown on screen in the first 1-3 seconds?
- Triggers "bottoms-up processing" (subconscious visual response ~200ms)
- Colors, motion, unexpected imagery
- Example: Screen recording of Claude Code running 5 skills in rapid succession

**Spoken Hook** — What is said in the first 5-15 seconds?
- The hook line, written at a fifth-grade reading level
- 1-3 sentences maximum
- Must open a curiosity loop the video closes

**Text Hook** — What text overlay appears?
- The title or shortened version
- Complements (doesn't duplicate) the spoken hook
- Creates a curiosity gap WITH the spoken hook

**All three must point at the same idea simultaneously.**

### Phase 6 — Four Commandments Checklist

Score each top hook (pass/fail):

1. **Alignment** — Do visual, spoken, and text hooks match? ✓/✗
2. **Speed to Value** — Zero delay, zero fluff before the hook lands? ✓/✗
3. **Clarity** — Viewer knows exactly what the video is about in one sentence? ✓/✗
4. **Curiosity** — Opens a question in the viewer's mind? ✓/✗

Must pass ALL FOUR to recommend. If one fails, note the fix.

## Output Format

```
## Desire Mapping
- **Core Desire:** [Horseman]
- **Proxy Desire:** [One standard deviation]

## Top Hooks

### Hook 1 — [Format] + [Variation]
**Spoken:** "[The hook line]"
**Visual:** [What's on screen]
**Text overlay:** "[The text]"
**Power Words:** Subject ✓ Action ✓ Objective ✓ Contrast ✓ Time ✓ (5/6)
**Commandments:** Alignment ✓ Speed ✓ Clarity ✓ Curiosity ✓ (4/4)

### Hook 2 — ...
### Hook 3 — ...

## All Five Variations (for reference)
1. About Me: "..."
2. If I: "..."
3. To You: "..."
4. Can You: "..."
5. He/She Just Did: "..."

## Recommendation
[Which hook to use and why — direct and opinionated]
```

## Key Principles

- **The hook is the most important 15 seconds.** More time here than on 5 minutes of body content.
- **Fifth-grade reading level.** Short sentences. Common words. Complex language kills hooks.
- **Curiosity without clickbait.** The hook must promise something the video delivers. your audience bounces permanently on oversell.
- **Contrarian hooks need authority.** "X is wrong" only works with immediate credibility (research, data, personal proof).
- **Negative framing pulls harder.** "You're wasting 5 hours a week" outperforms "Save 5 hours a week." Loss aversion is real.
- **One hook per video.** Don't cram multiple angles into the opening. Pick one. Commit.
