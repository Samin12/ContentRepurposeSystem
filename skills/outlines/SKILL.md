---
name: outlines
description: "Generate full YouTube video outlines in your format — hook, structured body with talking points, visual aid callouts, source citations, time budgets, and production notes. Trigger on phrases like 'outline this video', 'write an outline for', 'structure this video', 'create a video outline', 'help me outline', or any request to plan or structure a YouTube video for recording."
---

# YouTube Video Outline Generator

Generate recording-ready video outlines in your exact format. Includes hooks, structured body sections with talking points, visual aid placeholders, source citations, time budgets, competitive differentiation, and production notes.

## When This Skill Activates

**Activate when the user wants to:**
- Structure a video for recording
- Turn research or an idea brief into a filmable outline
- Create a full video plan with talking points
- Organize raw notes into a video format

**Example triggers:**
- "Outline this video about RAG concepts"
- "Turn this research into a video outline"
- "Write the outline for tomorrow's video"
- `/outlines` or `/outlines <topic>`

## Input

The user provides one or more of:
- **Topic or idea brief** — from `/ideation` or described verbally
- **Research notes** — vault files, brain dumps, or pasted research
- **Hook** — from `/hooks` (optional — will generate one if not provided)
- **Target length** — how long the video should be (default: 12-18 minutes)

Always check the vault for related research: search `research/` and `projects/` for files on the topic.

## Workflow

### Step 1 — Determine Video Format

Classify the video structure based on the content:

**Concept/Educational** — explaining ideas with escalating depth
- Structure: Hook → Concept 1 → Concept 2 → ... → Big Picture Closer
- Example: "7 RAG Concepts Every Claude Code User Should Know"
- Per concept: core idea (one-liner) → explanation → analogy → source

**Level-Based** — progressive mastery/identity arc
- Structure: Hook → Level 1 → Level 2 → ... → Master Level
- Example: "6 Levels of Claude Code"
- Per level: what it is → the shift → narrative arc (early/mid/late) → demos → key mantra → transition

**Tool/Product Demo** — showing how something works
- Structure: Hook → Problem/Context → Tool Intro → Demo → Honest Limitations → CTA
- Example: "This Free Tool Replaced My $200/month Software"
- Heavy on screen recording, light on talking head

**Contrarian/Opinion** — challenging conventional wisdom
- Structure: Hook (contrarian claim) → Evidence → Counter-arguments → Resolution → Implications
- Example: "CLAUDE.md Is Ruining Your Code"
- Needs strong authority right after the claim

**Case Study** — documenting a specific result or process
- Structure: Hook (result reveal) → Context → Process → Results → Lessons → CTA
- Example: "How I Automated 90% of Social Media with Claude Code"
- Heavy on demos and proof

**Listicle** — curated collection
- Structure: Hook → Item 1 → Item 2 → ... → Best/Most Important Last
- Example: "5 Open Source AI Projects You Need to Know"
- Per item: what it is → why it matters → demo moment → who it's for

**Head-to-Head** — comparing two approaches
- Structure: Hook → Contender A → Contender B → Direct Comparison → Verdict
- Example: "RAG vs Agentic Search"
- Must be fair, give clear recommendation

### Step 2 — Build the Outline

```markdown
# [Video Title] — Video Outline

- **Date:** YYYY-MM-DD
- **Target publish:** YYYY-MM-DD
- **Format:** [Format type]
- **Target length:** [X-Y minutes]
- **Related:** [[wikilink]], [[wikilink]]

---

## Hook (~30-90 seconds)

[If hook provided from /hooks, insert with Three Hook Alignment]

[If no hook, generate one:]
- **Desire mapping:** [Core Desire] → [Proxy Desire]
- **Spoken hook:** "[The actual words]"
- **Visual hook:** [What's on screen]
- **Text overlay:** "[The text]"

---

## [Section 1 Title] (~X minutes)

**The core idea:** [One sentence — what the viewer should understand]

**Talking points:**
- [Specific point with data/example]
- [Specific point with data/example]
- [Transition to next section]

**Visual aid:** → [excalidraw or screen recording description]

**Demo:** [What to show on screen, if applicable]

**Source:** [Citation with URL]

---

## [Section 2 Title] (~X minutes)
[Same structure...]

---

## Outro / CTA (~30-60 seconds)

**Recap:** [One-line per section — rapid fire]

**CTA:** [Subscribe, comment, community link]

---

## Production Notes

### Competitive Landscape
- [Creator] — [Video title] ([X views]) — [How ours differs]
- [Creator] — [Video title] ([X views]) — [How ours differs]

### Title Ideas
1. [Option 1]
2. [Option 2]
3. [Option 3]

### Thumbnail Moments
- [Section where a good thumbnail frame could come from]
- [Key visual that would work as a thumbnail]

### Honest Limitations
- [What the video doesn't cover or where advice breaks down]

### Total Estimated Length: [X minutes]
```

### Step 3 — Apply Narrative Principles

While building, apply the Kallaway dopamine ladder:

1. **Stimulation** — the hook (visual stun gun, first 1-2 seconds)
2. **Captivation** — plant the core curiosity question early
3. **Anticipation** — build toward the key reveal (don't give the best insight first)
4. **Validation** — deliver the payoff (must be non-obvious)
5. **Affection** — honest limitations, personal experience (likability)
6. **Revelation** — big-picture closer that reframes everything

**Curiosity loops per section:**
- Each section opens a mini-loop (question/tension) and closes it
- Best sections close one loop while opening the next
- Use "head fakes" / misdirection to delay payoff where it serves the story

**Law of Interestingness:**
- Front-load the most surprising facts (shock score 70+)
- Broadest context first (the "bedrock")
- Most perspective-shifting insight saved for the ending

**Fifth-grade reading level for spoken content.** Short sentences. Common words. Define technical terms immediately.

### Step 4 — Time Budget

Assign time estimates per section. Total must match target length.

- **Hook:** 30-90 seconds (never longer)
- **Individual section:** 2-4 minutes each
- **Demo segments:** 3-7 minutes
- **Outro:** 30-60 seconds

If outline runs long, cut the weakest section rather than rushing everything.

### Step 5 — Competitive Check

> **Optional step.** This uses a separate `yt-search` helper script that does not ship with this plugin. If it isn't installed, fill in the competitive landscape from what you already know about the space (or skip it) — the outline is complete without it.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/yt-search/scripts/search.py" <topic> --count 10 --months 3
```

Add 2-3 entries to Production Notes. For each competitor: their angle, performance, how yours differs.

### Step 6 — Save to Vault

Save to `YOUR_VAULT_PATH/projects/YYYY-MM-DD-<slug>-video.md`.

Link to research files and idea briefs with wiki links.

## Key Principles

- **Outlines are for speaking, not reading.** Talking points are things you would say out loud. No academic language.
- **Every section earns its spot.** If it doesn't advance understanding or open/close a curiosity loop, cut it.
- **Visual aids are not optional.** Flag every section needing a diagram, screen recording, or visual. No talking head longer than 60 seconds without a visual change.
- **Sources build credibility.** Specific numbers, papers, people, tools. "Studies show..." is worse than no citation.
- **Honest limitations build trust.** At least one "here's where this breaks down" moment per video.
- **Production notes are for you.** Title ideas, thumbnail moments, competitive landscape — filming and publishing decisions.
