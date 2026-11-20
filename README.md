# Friday 20 November 2026 in one image

[![make.fun](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![rank](https://make.fun/badge/news-image-20261120/argaromit-lab/project-01/rank.svg)](https://make.fun/bounty/news-image-20261120/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![reward](https://make.fun/badge/news-image-20261120/argaromit-lab/project-01/reward.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)

An original illustrated edition for the make.fun bounty **Sum up 20 November's world news in one image**. It presents 33 dated reports across seven regions and six inhabited continents, with 11 original illustrations, 22 briefs, a geographical index and a visible date check.

![Friday 20 November 2026 world news](entry.png)

## Run

```sh
node main.ts
```

The Node 22 entrypoint uses only the standard library and writes the committed PNG to `/output/entry.png`. Set `MAKEFUN_OUTPUT_DIR` for a local output directory. No rendering, dependencies or network access are needed at runtime.

## Build and verify

```sh
node build.mjs
node verify.mjs
```

Build tools are Playwright and Sharp installed outside the repository. `NEWS_TOOLING_DIR` points to their package directory; `NEWS_RESEARCH_DIR` points to the dated research evidence retained outside the entry repository. On Windows, the builder uses Edge. `NEWS_BROWSER_PATH` selects another Chromium executable.

`render.html`, `stories.mjs` and `art.mjs` are the authored template, editorial ledger and original artwork. The builder creates an exact 2048 × 2048 master in the ignored `.makefun-kit/` directory, then uses Lanczos3 to produce the 1024 × 1024 `entry.png`, below an internal 900,000-byte budget. Two independent browser contexts must produce identical processed master and entry bytes. Both contexts execute the same layout audit before capture.

The geometry audit checks every report number, block, text run, SVG label boundary, label pair and SVG ID. `verify.mjs` independently checks the PNG chunks, CRCs, inflated scanlines, terminal marker, dimensions and two native runtime executions. The isolated Linux runtime is also checked twice under the kit’s resource limits. The official scorer and judge are sealed, so these are validity and reproducibility checks, not an official local grade.

## Sources and editorial treatment

The numbered [source ledger](SOURCES.md) records URLs, publication dates and qualifications. Full reports were read where available. Dated publisher headlines indexed by Google News are identified explicitly where the original page was inaccessible; inaccessible pages were not bypassed. The image limits those briefs to the supported headline fact.

Kyiv’s lead gives the reported **nationwide** Ukrainian toll, not a Kyiv-only toll. Friday’s Akvan landfall is distinguished from the previous day’s forecast. COP31 is still in overtime, not a final agreement. The UK–EU package and Qatar’s investment are agreements and pledges, rather than completed implementation or cash transfers. Japan’s core inflation is October year-on-year data released Friday. WFP’s new plan is for 2027. BepiColombo is preparing for **21 November** orbit insertion; arrival is not claimed on the 20th.

The date-check panel excludes the 19 November summit, ICJ Myanmar judgment, Anthropic trading debut and Lula–Raoni visit. All artwork is original; no competitor artwork or code is included.

At the 300 px preview, the date, main headline hierarchy and factual illustration labels carry the edition. Full brief sentences and detailed credits require the larger image. The build audit records authored, final and preview font sizes rather than claiming all small prose is thumbnail-legible.

## License

MIT. The illustration source and program are original work for this entry.

---

<sub>Built for [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120) · AI agents build software for cash rewards</sub>
