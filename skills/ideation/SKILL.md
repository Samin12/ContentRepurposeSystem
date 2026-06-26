---
name: ideation
description: "Generate positioned YouTube video ideas with competitive gaps, desire mapping, and shock scores. Consumes research from yt-pipeline or firecrawl-search — does NOT redo deep research. Trigger on phrases like 'video ideas for', 'what should I make a video about', 'brainstorm video ideas', 'ideation for', 'content ideas about', 'what videos should I do about X', or any request for YouTube video concept generation."
---

# Video Ideation Engine

Generate positioned YouTube video ideas grounded in existing research and competitive analysis. Outputs structured idea briefs ready to feed into `/hooks` and `/outlines`.

**This skill is strategy, not research.** It consumes research outputs from `/yt-pipeline`, `/firecrawl-search`, or vault notes. It does NOT replicate deep research — if no research exists yet, it runs a lightweight competitive scan only.

## When This Skill Activates

**Activate when the user wants to:**
- Brainstorm video ideas on a topic
- Figure out what video to make next
- Find angles on a trending topic
- Generate content ideas from research they've already done

**Example triggers:**
- "Give me video ideas about RAG"
- "What should I make a video about this week?"
- "Brainstorm some Claude Code video angles"
- `/ideation` or `/ideation <topic>`

## Workflow

### Step 1 — Gather Existing Context

Check what research already exists before doing anything:

1. **Search the vault** — look in `research/` and `projects/` for files related to the topic
2. **Check for recent yt-pipeline or firecrawl-search outputs** — these are your primary source material
3. **If the user references specific notes**, read them

**If research exists:** Use it as the foundation. Do NOT re-research the topic.

**If no research exists:** Do a lightweight competitive scan only (Step 2). Suggest the user run `/yt-pipeline <topic>` or `/firecrawl-search <topic>` first if they want deeper analysis.

### Step 2 — Lightweight Competitive Scan

Quick YouTube search to see what exists — this is positioning intel, not deep research:

> **Optional step.** This uses a separate `yt-search` helper script that does not ship with this plugin. If it isn't installed, skip the scan and generate ideas from the user's described topic and any vault/research context instead — the rest of the skill works fine without it.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/yt-search/scripts/search.py" <topic keywords> --count 15 --months 3
```

From results, extract:
- **Saturated angles** — what's been covered to death?
- **Open gaps** — what has NO or weak coverage?
- **Performance outliers** — high views-to-subs ratio signals a hot angle
- **Key creators** — who's covering this, how big are they?

Present the landscape in 3-5 bullets. Don't dump raw search results.

### Step 3 — Generate Idea Angles

Produce **7-10 video ideas** with full positioning for each:

**Title (working):** A rough title — not final, just enough to capture the angle.

**Angle:** What makes this different from what exists? One sentence.

**Core Desire:** Map to one of the Four Horsemen:
- **Money** — will this help the viewer make or save money?
- **Time** — will this save them time or eliminate wasted effort?
- **Health** — does this reduce stress, burnout, or cognitive load?
- **Status** — does this make them look smart, capable, or ahead of the curve?

**Proxy Desire (One Standard Deviation):** Don't target the core desire directly — that triggers the BS detector. Package it one step away.
- Core: "Make more money" → Proxy: "Automate your entire content pipeline"
- Core: "Save time" → Proxy: "Never start a Claude Code session from scratch again"
- Core: "Status" → Proxy: "Build what your team thinks requires a dev shop"

**Shock Score (1-100):** How surprising is this to your audience? Rate by the Law of Interestingness — distance between what the viewer believes and what this video reveals. Target 70+.

**Format:** What video structure fits?
- Concept/Educational ("7 RAG Concepts...")
- Level-Based ("6 Levels of...")
- Tool Demo ("I Built X with Y")
- Contrarian Take ("X Is Ruining Your Y")
- Case Study ("How I Did X")
- Listicle ("5 Tools That...")
- Tutorial ("How to Set Up X")
- Head-to-Head ("X vs Y")

**Competitive gap:** What specific gap does this fill? Reference the landscape from Step 2.

### Step 4 — Rank and Recommend

Sort into three tiers:

**Tier 1 — High Confidence (2-3 ideas)**
Clear competitive gaps, high shock scores, proven formats. "Film tomorrow" options.

**Tier 2 — Strong With Conditions (2-3 ideas)**
Good angles that need research, a demo build, or timing. Worth planning for.

**Tier 3 — Experimental (2-3 ideas)**
Higher risk, higher ceiling. New formats, contrarian takes, untested angles.

### Step 5 — Output Structured Briefs

For each Tier 1 idea, output:

```
## [Working Title]

- **Angle:** [One sentence positioning]
- **Core Desire:** [Money / Time / Health / Status]
- **Proxy Desire:** [One standard deviation away]
- **Shock Score:** [X/100]
- **Format:** [Video structure type]
- **Competitive Gap:** [What's missing from existing coverage]
- **Why Now:** [Timeliness signal — trending, just launched, community buzz]
- **Research Depth:** [Sufficient / Thin — see Step 5b]
- **Related vault notes:** [[wikilink]] [[wikilink]]
```

### Step 5b — Deepen Research via NotebookLM (If Needed)

When the user selects a Tier 1 idea, check whether the existing research actually covers that specific angle well enough to build a video.

**Signs research is sufficient:**
- The vault research notes directly address the chosen angle's key claims
- There are specific stats, sources, or examples that support the talking points
- You could write an outline right now without guessing

**Signs research is thin:**
- The angle is a subset or twist on the broader topic that wasn't explored in depth
- Key claims in the idea brief don't have supporting data yet
- You'd need to speculate or hand-wave in an outline

**If research is thin and a NotebookLM notebook already exists** (from a prior `/yt-pipeline` run):

1. Find the notebook — check recent vault research files for a NotebookLM notebook ID, or list notebooks:
   ```bash
   notebooklm list --json
   ```

2. Set the notebook context:
   ```bash
   notebooklm use <notebook_id>
   ```

3. Run 2-3 targeted follow-up questions against the existing sources:
   ```bash
   notebooklm ask "What specific data or examples support [the chosen angle]?" --new
   notebooklm ask "What counterarguments or limitations exist for [the chosen angle]?"
   notebooklm ask "What's the most surprising or non-obvious insight about [the chosen angle]?"
   ```

4. Use the answers to refine the idea brief — update the shock score, fill in missing competitive gaps, and add specific talking points.

**If no notebook exists**, suggest the user run `/yt-pipeline <topic>` first, or proceed with lighter research via `/firecrawl-search`.

**If research is sufficient**, skip this step and move to `/hooks` or `/outlines`.

### Step 6 — Save to Vault (Optional)

If the user wants to save: `YOUR_VAULT_PATH/projects/YYYY-MM-DD-ideation-<topic>.md`

## Key Principles

- **This is strategy, not research.** Don't replicate what `/yt-pipeline` or `/firecrawl-search` already do. Consume their outputs.
- **Differentiation is everything.** An idea without a competitive gap is a wasted video. Always explain WHY this angle is different.
- **Desire mapping is not optional.** Every idea maps to a Horseman + proxy desire. No map = too abstract.
- **Don't pitch ideas you have already done.** Check `projects/` and `projects/archive/` before suggesting.
- **Be opinionated.** "Film this one first because..." is more useful than a flat list.
