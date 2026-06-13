# ignamiranda.github.io

Personal website built on GitHub Pages. Author writes content in Markdown, framework handles flashy presentation.

## Language

**Personal website**:
A single-page site that will grow organically with writing, projects, notes, and experiments.
_Avoid_: Portfolio, blog, resume site

**Content**:
Authored in Markdown (.md) and rendered by the framework. May take the form of notes (shorter, informal) or long-form notes in the style of articles (deeper explorations, essays).
_Avoid_: Posts, blog entries

**Skeleton**:
A minimal but polished first version — dark theme, neon accents, single home page — deployed immediately and iterated over time.
_Avoid_: MVP, prototype

**Flashy**:
Smooth animations, bold visual design, interactive elements, and dynamic visuals over the long term — not all at once on day one.
_Avoid_: Fancy, cool effects

**Playground**:
Low-friction creative space for experiments, sketches, interactive toys, and unfinished things. The site itself invites creation.
_Avoid_: Portfolio gallery, polished showcase

**Domain**:
Software, writing, design/visual art, and games/interactive — multi-disciplinary, not siloed.

**Name Generator**:
Client-side Markov-chain tool for creating custom name generators from one user-provided example list, with advanced controls. First content piece — acts as a reference implementation that demonstrates how the site can host interactive tools. Lives at `/notes/name-generator`, linked from the Generators section on the home page.
_Avoid_: Fixed race lists, server-side generation, syllable tables

**Shared World Villains**:
A draft note on a game design idea for MMORPGs — a designer-toolkit for persistent NPC villains that evolve based on collective player actions, without infringing the Nemesis System patent. Lives under `src/content/notes/shared-world-villains.md`.

**Draft**:
A saved generator configuration — name, example list, and settings. One per generator, stored in browser localStorage, auto-saved debounced. User names each draft on creation. Auto-restores last active draft on return, with ability to switch.

**Example Generators**:
Two built-in pre-loaded generators so first-time visitors can immediately use the tool: a fantasy name generator (combined race names) and a sci-fi name generator. These serve as both demos and starting points.

**Generators**:
A section on the home page listing interactive tools. Currently holds the Name Generator card.

**Generative Art**:
Code that produces visuals — outputs displayed on the site as galleries or live canvases. The site's own design (dark theme, neon accents, animations) is itself a design statement.

## Example dialogue

**Dev**: Should I scaffold a blog or a portfolio?
**Domain expert**: Neither. Start with a single home page. You'll add pages when you have content that needs them — not before.
