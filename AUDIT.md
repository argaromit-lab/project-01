# Baseline review · 20 November news edition

The entry contains 33 reports: Asia 6, Europe 6, Middle East 4, Americas 6, Africa 4, Oceania 3 and World/space 4. There are eleven original illustrations and twenty-two briefs. The source ledger records exact source links, dates and qualifications, including when only an indexed publisher headline was accessible.

## Validity and reproducibility

- The master is 2048 × 2048. The submitted PNG is 1024 × 1024 and **799,913 bytes**, below 900,000 bytes and the official 1 MiB limit. Its SHA-256 is `01942411b8a78b895157c01c53142d8e620f782261e96a95dee046e76b0e4275`.
- Every PNG chunk CRC, inflated scanline and terminal chunk is checked by `verify.mjs`.
- Two independent Chromium contexts run identical geometry reads and produce identical master and entry bytes. CPU rasterization and integer lead-column widths avoid inconsistent subpixel drawing.
- Geometry checks cover page and container bounds, text runs, paragraph overlap, SVG labels, label pairs, duplicate SVG IDs and the report sequence. The final candidate has zero findings.
- Two separate offline Linux Node 22 containers, each at 1 CPU, 512 MB, 64 processes, read-only `/bot` and writable `/output`, reproduce the submitted PNG bytes. Native executions are checked separately.
- The official scorer and judge are not published in the kit. No official local score is claimed.

## Reference evidence and three focused passes

References, metadata, comparison sheets and critic logs are retained outside the repository in `G:/kits/news-image-20261120-samples/`; runtime logs are in the ignored `.makefun-kit/` directory. Native 1024-wide and exact 300-wide contact sheets preserve aspect ratios and label entries by date, rank and our commit rather than entrant identity.

At the final public refresh, **2026-11-20T23:18:29.206Z**, the development board showed:

| Rank | Rate | 90% interval | Image bytes | Phase |
| --- | ---: | ---: | ---: | --- |
| 1 | 99.2057% | 98.9952–99.4163% | 466,875 | Development, provisional |
| 2 | 99.1652% | 98.9417–99.3887% | 742,756 | Development, provisional |
| 3 | 99.1429% | 98.9172–99.3686% | 418,538 | Development, provisional |

These overlapping intervals do not establish a decisive difference. The prior-day top three were also collected and refreshed separately, and were still provisional. Public submission details, artifact URLs, original dimensions and retrieval times are recorded with the samples.

The baseline was committed locally as `ec72d58`. The three focused passes were:

1. Recompose eight supporting illustrations for their real card proportions, enlarge their factual labels, replace an illustrative market squiggle with the actual reported index losses, and align map coastlines and pins to one projection.
2. Enlarge the date and figures, increase map-label contrast and repair the remaining measured layout problems.
3. Widen the two brief columns and increase brief type from 18 to 19 authored pixels while keeping every report and qualification. Separately tighten the cricket item to the exact AP lunch snapshot: 317–6 at lunch, Phillips out for 118. This is the only factual-copy change during the layout passes.

During the layout-only passes the ledger and generated source file retained identical SHA-256 values. The subsequent cricket edit was an explicit source-precision correction, not a relabelling of an older result.

Groq/Qwen, Mistral/Ministral and Gemini critiques were design feedback only. Final pass feedback against the initially sampled leader was **58/100** from Qwen and **88/100** from Ministral, below the critic tool’s 92-point decisive-improvement threshold. An additional Gemini review of pass 2 was 48/100. A final Qwen comparison against the refreshed #1 gave **54/100**. These inconsistent judgments do not establish a win over the leaderboard. Allegations of clipping or absent map keys were checked against the image and geometry audit rather than accepted as facts. No result here is a make.fun grade or win probability.

## Deterministic design check

**Verdict: SLOP (initial template severity 8) → clean after fixes.**

| Guard | Hits | Action | Why it matters |
| --- | ---: | --- | --- |
| `redundant-border` | 2 | Applied the detector-generated border removal | Separates filled surfaces without redundant boxes |
| `wide-body-tracking` | 2 | Applied the detector-generated 0.01em spacing | Keeps compact metadata readable |
| `tight-line-height` | 4 | Applied the detector-generated line-height fixes, then checked actual glyph bounds | Prevents crowding and clipping |
| `oversized-number` | 7 | Applied the generated compact-number convention to visible text | 300K and 100K preserve the exact counts with less width |
| `multiline-row-meta` | 2 advisory | Retained intentional multi-line reporting | News briefs require complete attributed sentences |
| `cream-default-wash` | 1 advisory | Retained the chosen editorial paper background | A deliberate newspaper convention for this specific brief |
| `row-kicker-eyebrow` | 14 advisory in rendered output | Retained geographical and factual scene labels | They identify places, indices and reported figures |
| `overstuffed-row` | 38 advisory in rendered output | Reviewed against the real image | The static detector counts SVG objects as repeated UI slots |

The final template and rendered output have zero gating findings, severity 0 and no external stylesheets. The rendered output retains 55 advisory hits across the four advisory guards above. Those advisories are genre-dependent, not measured overflow or overlap.

## Limits

The date, lead headlines, illustrated figures and hierarchy carry the 300 px preview. Complete briefs and source credits require the larger image. Planned orbit insertion, pledges, monthly releases, the global-aid target and reported casualty counts retain their qualifications. A final win or paid placement depends on make.fun’s post-deadline judgment.

## Local upgrade checkpoint · 21 November 2026

This section supersedes the baseline artifact measurements above for the new local candidate. The submitted snapshot remains `c0e008af7f0aa4ba27c1aafef296103d91acb94a`. Its official **development/provisional** rate is **98.2873%**, with a 90% interval of **97.5996–98.9751%**. The upgrade has no official score.

The level-33 kit and current requirements were checked before edits. The API lists ordinary transcript bundles, with no strict-recording requirement or recording IDs; no live recording is required. Account status allowed submissions. The previous day's final results were still withheld (`finalized_at: null`, `scores_visible: false`), so its separately dated development references were used as provisional design evidence.

The refreshed 20 November development Top 1–3 at 2026-11-21T12:24:37.553Z were:

| Rank | Rate | 90% interval | Original bytes |
| --- | ---: | ---: | ---: |
| 1 | 99.2057% | 98.9952–99.4163% | 466,875 |
| 2 | 99.1696% | 98.9499–99.3894% | 300,055 |
| 3 | 99.1652% | 98.9417–99.3887% | 742,756 |

Their intervals overlap. Public house-game margins do not prove which layout choice caused a rate difference. Metadata, public submission IDs, original dimensions, UTC retrieval times, dated prior-day references and native/300px comparison sheets are retained outside the repository under `G:/kits/news-image-20261120-samples/`.

### Three measured passes

| Candidate | Change and measured result | Geometry | PNG bytes | Groq feedback vs public #1 |
| --- | --- | ---: | ---: | ---: |
| H0 | Exact submitted baseline; supporting title 31px, supporting illustration 126px | 0 findings | 799,913 | 58/100 |
| H1 | Supporting title 34px (+9.7%); illustration 134px (+6.3%); both brief columns retain 19 lines | 0 findings | 813,879 | 58/100 |
| H2 | Recompose lead SVGs from 600×240 to 600×184; useful illustration width grows from 505px to approximately 658px (+30.3%); supporting caption 25→29 SVG pixels | 0 findings | 838,202 | 58/100 |
| H3 | Retain H1/H2, increase feature credit type/contrast, map numbers 21→26 SVG pixels; 9.96 SVG-unit minimum gap between numbered map circles | 0 findings | 840,793 | 58/100 |

H3 initially enlarged brief credits too; one report then overlapped DATE CHECK. That size increase was rejected. Final brief credits retain their original size with stronger contrast, and the columns remain balanced at 19 lines each. The build now rejects geometry failures before replacing `entry.png`.

Final source credit type is 19px for leads and 17px for supporting features, respectively 9.5px and 8.5px at delivery. Supporting headings are 34px authored / 17px delivered / 4.98px at 300px. The date is 100 / 50 / 14.65px. Briefs remain 19 / 9.5 / 2.78px: complete sentences require the larger image.

`stories.mjs` SHA-256 remains `ea0f3dc8c6f434096243b25f686d19af2506bf2a590814e8cfa3b8580d8e94fe`; `SOURCES.md` remains `fdb62f7375ecd4d321c4d67cc9887fc34f110d886c198ce0121da7a56cb3a934`. No factual claims or report sequence changed.

### Verification and interpretation

- Candidate: **1024×1024**, **840,793 bytes**, SHA-256 `14898f4743f98a9a7df7f76d55805a1b6902f4e6a9a27f249d10db96e08507aa`.
- Two independent Chromium contexts produce byte-identical masters and delivered images. The geometry audit covers 79 text blocks, text runs, SVG label bounds and overlaps, duplicate IDs, story sequence and all page/container bounds.
- The focused harness checks ledger identity, actual SVG bounds/letterboxing, typography, brief line counts, map-pin spacing and page errors. Injected unbroken text, duplicate SVG IDs and a missing report are each detected.
- PNG CRCs, full inflated scanlines, terminal chunk and two native executions pass. Two separate offline Node 22.23.4 Linux containers, each with 1 CPU, 512 MB, 64 PIDs and read-only `/bot`, produce the exact candidate hash. Their 734ms and 572ms wall times include Docker startup and are not official server runtimes.
- Final dual-model feedback is **58/100** from Groq/Qwen and **88/100** from Mistral/Ministral. Both remain below the critic tool's 92-point threshold. These opinions do not establish a decisive improvement over public #1, an official grade or a win probability. Some critiques incorrectly describe fonts, regional colors or the static map; no factual content was changed to satisfy those statements.
- Anti-slop: **PASS**, severity **0**, zero gating findings and zero external stylesheets. Template: 3 advisory hits; rendered image source: 55 advisory hits, the same genre-dependent rules recorded above. Their retention is an editorial decision, not evidence of clipped text.
- Tests, adversarial harness, pass records and critique logs are retained in the ignored `.makefun-kit/upgrade-*` files. The official scorer is server-only; no official local grade is available.

### Transcript checkpoint

The current CLI discovers both recorded OpenCode sessions, including this upgrade, without editing their store. Its bundle dry run reports that no session carries the actual system prompt; it also requires the explicit MCP declaration (no external MCP server was used). A complete new transcript bundle and its pre-submit check remain pending recovery of the authentic system-prompt setup. The prior build labelled AGENTS.md as its system prompt; that instruction file alone does not establish the actual harness prompt. Logs were not fabricated or rewritten to fill that gap. Local rendering and runtime verification are complete; this is a submission-preparation limitation.

## Second local upgrade · screenshot-guided editorial hierarchy

This is the current candidate; it supersedes the preceding artifact sizes and image hashes. Its anchor is local commit `da75807`, not a newly submitted entry. The user's design comparison prompted lighter paper/ink treatment, stronger emphasis on the three leads, simpler picture captions and more visible numeric context. The comparison was interpreted as qualitative feedback: the anchor's lead/support headlines were already different sizes (44/34px), and no stories were added merely to match a rival's count.

Requirements and quota were rechecked before edits: standard transcript mode, `can_submit: true`. Top 1–3 were collected again before editing and refreshed at **2026-11-21T13:16:06.154Z**. Their development rates and intervals remain those in the first upgrade table: **99.2057%, 99.1696%, 99.1652%**, with overlapping intervals. Prior-day references remain separately dated and phase-labelled. The only official score for our submitted snapshot remains **98.2873% development/provisional**; neither local upgrade has a new official score.

### Three focused passes, second cycle

| Candidate | Measured change | PNG bytes | Geometry findings | Ministral feedback vs public #1 |
| --- | --- | ---: | ---: | ---: |
| H0 | Exact `da75807` anchor; lead/support headline ratio 1.294; lead row 404px | 840,793 | 0 | 88/100 |
| H1 | Light masthead; lead headline 44→50px; lead row 404→444px; headline ratio 1.471 | 839,817 | 0 | 78/100 |
| H2 | Supporting caption 29→32 SVGpx; shorter concrete event labels; market losses 41→48 SVGpx; remove three unnecessary filled quote boxes | 842,135 | 0 | 88/100 |
| H3 | Fuse hierarchy/captions; lead prose 23→24px, source credits 19→21px; figure context 18→20px and numbers 40→42px | 846,548 | 0 | 88/100 |

The measured headline distinction and caption sizes support the intended readability improvement; the model feedback does not prove a higher official score. H1's lower feedback is retained explicitly rather than treated as a jury gain. H2/H3 recover the anchor's 88-point feedback while improving the measured hierarchy and text sizes.

Final authored / delivered / 300px-preview type: date **94 / 47 / 13.77px**; lead headlines **50 / 25 / 7.32px**; supporting headlines **34 / 17 / 4.98px**. The lighter masthead trades six percent of the previous date type size for larger leads. Brief prose remains **19 / 9.5 / 2.78px** and still needs the larger image. Both brief columns retain 19 lines. All 33 stories, seven regional counts, source URLs, factual qualifiers and ledger bytes remain unchanged; caption edits retain pledges, plans and the 21 November orbit date.

The design fixer's larger figure-label line height initially exposed six number-glyph container violations. The build rejected that render before replacing the deliverable. Final masthead height is154px and figures84px (82px inner figures), with sufficient number line height; all six violations are resolved. This is one hardening correction within H3.

### Current verification

- Final PNG: **1024×1024**, **846,548 bytes**, SHA-256 `13fe3a837fa7cd9192478da686c7508bb2793d0c3d386b50e754ef349aaf4f59`; below both the internal 900,000-byte budget and official 1 MiB limit.
- Two independent Chromium contexts produce byte-identical masters and entries; geometry has zero findings across 78 text blocks, all HTML text runs, SVG label boundaries/pairs, duplicate IDs and report sequence.
- Ledger hashes remain those recorded in the first upgrade. The adversarial harness again detects long unbroken labels, duplicate SVG IDs and a missing report. No page errors; map-number spacing and all 33 reports remain valid.
- PNG CRCs, complete inflated scanlines, terminal chunk and two native runtime executions pass. Two fresh offline Linux Node22.23.4 containers, 1CPU/512MB/64PIDs/read-only bot, reproduce the final hash. Local Docker-inclusive wall times are649ms and452ms, not server runtimes.
- Final successful vision review: **88/100**, `ministral-14b-2512`. Groq/Qwen, Mistral medium and the separately selected Mistral small returned HTTP429; Gemini Flash Lite returned503, and a different Gemini Flash attempt timed out before another503. **A second successful model audit is unavailable in this cycle.** No second score is invented; the 92-point decisive-improvement threshold has not been reached.
- Screenshot inputs are retained locally under ignored `opencode-images/`; the user-provided screenshot is not part of the deliverable.

### Deterministic design check, second cycle

**Verdict: SLOP (severity 2) → clean after fixes.** Final template and rendered output both pass at severity0, with zero gating findings and zero external stylesheets. Template advisory count3; rendered advisory count54.

| Guard | Hits | Action | Why it matters |
| --- | ---: | --- | --- |
| `redundant-border` | 1 | Applied the fixer's border removal to the paper masthead | Removes redundant filled-surface framing |
| `tight-line-height` | 1 | Applied its 1.4 line height, then allocated sufficient figure height and checked glyph bounds | Keeps figure labels and numbers within their containers |
| `row-kicker-eyebrow` | 13 advisory, rendered | Retained geographic and factual picture labels | Labels identify the news rather than decorate an app list |
| `multiline-row-meta` | 2 advisory | Retained complete reporting | Full sentences need more than one line |
| `overstuffed-row` | 38 advisory, rendered | Inspected rendered cards and SVG bounds; retained | Static slot counting includes authored illustration objects |
| `cream-default-wash` | 1 advisory | Retained the user-directed paper/ink treatment | The editorial palette is deliberate |

Round2 evidence is in ignored `.makefun-kit/round2-*`; baseline and every pass have separate source snapshots, images and native/300px sheets under `G:/kits/news-image-20261120-samples/round2-*`. The earlier transcript-system-prompt blocker remains unresolved; no complete new pre-submit bundle check is claimed.
