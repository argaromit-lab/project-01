# Final review · 20 November news edition

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
