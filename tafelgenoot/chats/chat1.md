# Website Design for Elderly Users

_Started 2026-05-18 18:16 UTC_

---

## User

Build the website based on the description attached. Build it in a user friendly way so that elderly people can use it too. First Brainstorm in terms of design choices and exact set up

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

I'll brainstorm the design approach first, then build. Let me lay out my thinking.

## Design brainstorm

**Aesthetic direction**
The brief gives a clear palette (warm off-white, teal, purple AI accent) and warm/human positioning. This isn't a generic "app" — it's about heritage, slow cooking, intergenerational warmth. So I want to avoid:
- Heavy shadows / glassmorphism / startup gradients (too cold)
- Dense data UIs (too clinical)
- Emoji-heavy decoration (cheesy)

And lean into:
- **Generous whitespace + soft 1px borders** instead of shadows → feels like a printed cookbook
- **A subtle warm undertone** in neutrals (off-white #FAFAF8, warm grey borders #E8E6E0, charcoal text not pure black) → cozy, not sterile
- **Serif accent for emotional moments** (dish names, story quotes) paired with system-ui for UI chrome → "Fraunces or similar" gives warmth to the cooking content while keeping nav crisp. I'll use a warm humanist serif for headings (let me use Lora or Source Serif — Fraunces was flagged as overused).

Actually, per the system prompt I should avoid Fraunces/Inter. I'll pair:
- **System-ui** for UI/navigation/buttons (matches the spec)
- **"Source Serif 4"** for dish names, story italics, greeting → warm, editorial, evokes recipe cards

**Elderly-friendly accessibility choices**
- Base font size **17px** (not 16) — slightly larger
- Headings start at 22px+, dish names 24px+
- Tap targets **minimum 56px** for buttons (CTA), 48px for tabs
- High contrast: text #2A2A28 on #FAFAF8 (passes WCAG AAA for body)
- No tiny secondary text under 14px
- Bottom tabs with **labels always visible**, not icon-only
- Form fields on host dashboard: 56px tall, 18px text
- Clear focus states (2px teal outline)

**Color system extension**
- Primary teal `#1D9E75` (CTAs, elder accents, active states)
- AI purple `#7F77DD` (sparkle, match badges, AI nudges)
- Amber `#E8A33D` for the loneliness nudge banner (warm, not alarming)
- Coral `#E26A5C` for "spots left" pill (gentle urgency)
- Text scale: #2A2A28 primary, #6B6862 secondary, #A09C95 muted
- Border #E8E6E0, divider #F0EEE8

**Component vocabulary**
- **Avatars** = circles with initials in soft tinted backgrounds (no fake photos)
- **Image areas** = soft gradient placeholders with monospace "[dish photo]" hint — honest about being a prototype
- **Match bars** = thin 4px rounded fills, purple
- **AI badges** = pill with tiny sparkle SVG (3-dot star, hand-drawable simple shape)
- **Checkboxes** = 28px tap area, custom circle that fills teal when checked, strikethrough on the text

**Information architecture**
- Phone frame on desktop (430px wide, centered, soft outer background) so it reads as mobile
- Bottom tabs: Discover · Sessies · Berichten · Profiel
- Single-file React app with `screen` state ('discover' | 'detail' | 'shopping' | 'messages' | 'profile') and `selectedSession` state for the detail flow
- Toast component for "Bevestig deelname" success

**Tweaks panel**
Since the user didn't ask for variations, I'll add a small Tweaks panel with 2-3 useful elderly-focused toggles:
- Text size (Normaal / Groter / Grootst)
- Accent palette (Teal default / Warm rust alt)
- Compact vs Spacious card density

**File structure**
- `Tafelgenoot.html` — main React app, all screens
- `tweaks-panel.jsx` — copied starter
- Single file to keep it simple; if it grows past 1000 lines I'll split screens out

Let me set up and start building.

_[tool: read_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now let me build the main file. I'll keep all screens in one file for simplicity.Now the screens file:

_[tool: write_file]_

_[tool: write_file]_

_[tool: grep]_

_[tool: read_file]_

Good, TweakRadio supports `{value, label}` objects. Let me check that the page loads cleanly.

_[tool: show_html]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Built. A few notes on what's there:

**Aesthetic decisions** — Warm off-white #FAFAF8 background, **Source Serif 4** (Google Fonts) for dish names, story quotes and greetings; **system-ui** for UI chrome. Teal #1D9E75 for actions/elder elements, purple #7F77DD for AI moments, amber for the loneliness nudge, coral for spots-left urgency. Cards use 1px borders, no shadows — feels printed, not digital.

**Elderly-friendly choices baked in:** 17px base text, 56px CTA buttons, 48px+ tap targets, high-contrast charcoal on warm white, bottom tabs always show labels, form fields on the host dashboard are oversized.

**5 screens wired, all connected:**
- **Ontdek** — amber loneliness nudge banner → greeting → scrollable filter pills → "Aanbevolen voor jou" with AI badges → "Nieuw toegevoegd"
- **Session detail** — gradient hero with dish name, elder row + stars, italic full story, meta card (when/where/group), purple AI match card with 3 bar rows + reason, sticky CTA
- **Boodschappenlijst** — teal "your ticket" banner, two tap-to-strike sections, host-brings note, two CTAs (confirm shows toast and returns to Ontdek)
- **Berichten** — purple AI assistant header, two date-divided threads with two-tone bubbles + the "deel/privé" action buttons, disabled input footer
- **Profiel** — Leerling/Gastheer toggle. Leerling = stats + erfgoed-archief. Gastheer = stats, active session card, large form with story textarea + AI helper hint + chip-style group size picker

**Bonus tabs:** added a small **Sessies** tab (upcoming + past sessions) so all 4 bottom tabs work.

**Tweaks** — text size (Normaal/Groter/Grootst) and density. Open the Tweaks toggle in the toolbar.

Possible next steps if you want them: real photo slots for dishes, a confirmation screen between sign-up and shopping list, or fleshing out the host's "Beheren" detail.

## User

Change the language of the website to english and the name to Simma. The website should be a website for the computer, not an app (yet). Take those 6 pictures as example users for people that want to cook something: https://plus.unsplash.com/premium_photo-1675034345146-99e96fd1a000?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1663429122432-c2769373768f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1587040273238-9ba47c714796?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1625690988276-0a7b0cdf3d5d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D. Take these 6 pictures for people that want to learn to cook: https://images.unsplash.com/photo-1725866546799-4cc16f6cba23?q=80&w=749&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1520998116484-6eeb2f72b5b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1520423465871-0866049020b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1583596608816-20dc8b46fced?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D . In terms of design, take some inspiration from https://www.vacation.inc/ , I like their vintage touch. I also have some pictures of food here: https://plus.unsplash.com/premium_photo-1728412897842-06f0fc4c2ec6?q=80&w=1245&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D (Full dining table, birs view) , https://plus.unsplash.com/premium_photo-1694336203192-c9e7f2891b95?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D (Apple cake), https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D (Lasagna) .

## Assistant

_[tool: set_project_title]_

_[tool: delete_file]_

_[tool: unregister_assets]_

Big rebrand — let me think through this before building.

## Rebrand brainstorm

**Name:** Simma (presumably "simmer" — slow, warm, communal cooking — perfect for the platform's ethos)

**Design direction** — vacation.inc has a warm 70s/80s resort vintage feel: cream/sand palette, sun-bleached colors, bold display serifs, generous photography, editorial layouts with rule lines and small-caps section labels. For Simma (a cooking platform), I'll translate that into **vintage cookbook meets modern editorial**:

- **Palette** — warm cream paper #F2E8D2 (bg), ivory cards #FAF3E0, deep umber ink #2A1F12, rust/terracotta primary #B14A2C, vintage teal #2D6E70, mustard accent #D4A24C
- **Type** — *DM Serif Display* for the wordmark, dish names, and section heads (chunky vintage display, free on Google Fonts, less overused than Fraunces); *Work Sans* for UI/body
- **Vocabulary** — hairline rules, small-caps section eyebrows, numeric callouts ("01 / 02 / 03"), thin double borders, tinted photography, framed images like a cookbook plate

**Desktop-first restructuring** — out goes the phone frame and bottom tabs. In:
- Slim top nav (logo · Discover · Cooks · Sessions · Messages · profile avatar)
- 1240px max-width content with generous gutters
- 3-column grids for session cards, 6-up rows for cook portraits
- Detail/shopping pages = 2-column with sticky right sidebar
- Messages = narrow centered editorial column

**Photo placement plan**
- 6 host photos → "Meet your cooks" grid + each cook's detail bio + small avatars on session cards
- 6 learner photos → community section ("Recent learners near you") + "Who's joining" on session detail + heritage archive cooks-you've-met
- 3 food photos → mapped to specific dishes:
  - Lasagna → Giovanna's Italian lasagna (new cook)
  - Apple cake → Anneke's Dutch appeltaart (new cook)
  - Birds-eye table → hero/aspirational on home + bonus dish

**Cook roster** (6 total — paired to your 6 host photos in order; you can shuffle):
1. Lena — Surinamese — Pom
2. Mirza — Bosnian — Burek
3. Fatma — Turkish — Gözleme
4. Giovanna — Italian — Lasagna *(lasagna photo)*
5. Anneke — Dutch — Appeltaart *(apple cake photo)*
6. Mei — Cantonese — Steamed buns

Let me build.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Rebuilt as **Simma** — desktop website, English, vintage-cookbook aesthetic.

**What changed**
- **Brand & language** — wordmark "Sim·ma" in DM Serif Display rust, all UI copy in English, dropped the phone frame for a proper 1240px desktop layout with sticky top nav (Discover · Cooks · Messages · Profile) and a four-column footer.
- **Aesthetic** — warm cream paper background, ivory cards, rust/teal/mustard/plum vintage palette, hairline rules, eyebrow labels in small caps, italic "No. 01" callouts on cards, tinted photography. DM Serif Display + Work Sans pairing.
- **Photography** — your 6 host portraits power the "Meet your cooks" row, the cook bio on session detail, and the small avatars on session cards. The 6 learner photos drive "Learners near you" + "Who's joining" + the profile hero. Apple cake → Anneke's appeltaart, lasagna → Giovanna's lasagna, dining table → home hero.
- **Six cooks added** — Lena (Surinamese), Mirza (Bosnian), Fatma (Turkish), Giovanna (Italian — new), Anneke (Dutch — new), Mei (Cantonese — new) with bios, signature dishes, ratings.
- **Screens redesigned for desktop**
  - **Discover** — split hero (greeting + dining table photo), filter pills, 3-up recommended grid, 6-up cook portraits, newly added grid, "Learners near you" community row
  - **Cooks list** — full roster page with 2-column feature cards including portrait + bio + signature
  - **Session detail** — 2-column with sticky right sidebar (when/where/group + AI match + sign-up CTA); full bio block, "Who's joining" with stacked learner faces
  - **Shopping list** — numbered checklist (01, 02…), live progress card in sidebar, cook reminder
  - **Messages** — centered editorial column, double-rule dividers, rust user bubbles
  - **Profile** — large portrait + Student/Host toggle, stats with serif numerals, heritage archive list, host dashboard with form

**Tweaks** — text size (Normal/Larger/Largest) and accent color (Rust/Teal/Mustard/Plum) so you can audition the palette.

Verifier is doing a screenshot pass; I'll surface anything it flags.

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Also patching the same pattern in the SessionDetail bio block and StudentView/HostView grids to avoid similar overflows:

_[tool: done]_

Fixed the overflow on the Cooks page — the right column of each cook feature card was missing `min-width: 0`, so the title and bio were pushing the grid past its allotted column. Same fix applied preemptively to the cook-bio block on Session Detail and the upcoming-session row on Profile (same pattern). Clean now.

## User

Okay looks great so far. Just a couple changes: Rename Fatma to Carl, and the dish is Ona`s appletaart. Rename Anneke, 74 to Fatma, 44 and the dish is Gözleme. Rename Mei, 70 to Mike, 38. For Gözleme, take this picture: https://images.unsplash.com/photo-1588765907995-47867ce30312?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D. For bao, take this: https://plus.unsplash.com/premium_photo-1664647949561-45a3555fb736?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D. For Burek, take this: https://images.unsplash.com/photo-1617806501736-fc7cab7c05bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D. Rename Yusuf into Mira.

## Assistant

_[tool: str_replace_edit]_

Working through these one at a time. The two name swaps (Fatma↔Carl/Fatma44) mean the dishes effectively swap cooks — appletaart now belongs to Carl, gözleme now belongs to the new younger Fatma. I'll also rename the cook/session IDs to match for clarity.Now the sessions — swap dishes between Carl/Fatma, add the three new food photos, rename ids, update Yusuf → Mira:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

Done. Summary of the swap:

- **Carl van Dijk, 69** (was Fatma) — Dutch, signature **Ona's appletaart**. Story rewritten to mention his grandmother Ona.
- **Fatma Kaya, 44** (was Anneke) — Turkish, signature **Gözleme**. Younger persona, story now references her grandmother's garden outside Konya rather than mother-in-law.
- **Mike Lin, 38** (was Mei) — Cantonese, **char siu bao**. Bio/story rewritten for younger Hong Kong → Vancouver → Rotterdam arc.
- **Mira** (was Yusuf) — same learner, just renamed.
- **Real food photos** wired up for Gözleme, Char siu bao, and Burek (replacing the gradient placeholders).
- IDs renamed to stay aligned (`appletaart-carl`, `bao-mike`); the heritage archive in Profile now points to `appletaart-carl`.

