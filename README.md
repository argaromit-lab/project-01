# Leonida Waypoint

An original, offline-first PlayStation 5 trophy guide and local progress tracker for Grand Theft Auto VI. All 55 launch-list trophies include their published title, description and grade, a sourced guide, spoiler-aware browsing, and optional manual counters.

The static app opens directly at `app/index.html` or from any static web server. It sends no requests. Progress stays in this browser until you export it; no PlayStation account is connected.

## Use

Open `app/index.html`. Search and filter the list, select a trophy to read its guide and sources, and tick it when earned. The chapter-one meditation is called out as a precaution: the cited guides disagree on whether it is required for the trophy. Roadmap notes distinguish confirmed list requirements from uncertain community reports.

Use **Export** to save a progress file. To restore it, choose a file, select **Merge** (combine earned trophies and keep the higher counter values) or **Replace** (overwrite this browser's tracker), then apply. Import validates the game, format, trophy names and counters before changing anything.

## Run and verify

```sh
node main.ts
```

The publisher copies `app/` and `screenshots/` to `/output`; set `MAKEFUN_OUTPUT_DIR` to choose another folder. `node generate-data.mjs --check` confirms the browser's compact, file-open-compatible data script matches the canonical JSON. `node validate.mjs` checks list facts, citations, local references and asset limits.

## Sources and accuracy

Official trophy names, descriptions, grades, hidden flags and tracked targets come from the competition kit's frozen PS5 list dated 2026-11-18. Its provenance records agreement with Exophase and PSNProfiles; Exophase is linked in the source notes. Guides cite PowerPyx and Output Lag beside the claim they support. Unconfirmed triggers are explicitly marked instead of presented as fact. Source links open only when selected.

## make.fun

This project was built for [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01).

[![make.fun competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/argaromit-lab/project-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/argaromit-lab/project-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

## License

MIT. See [LICENSE](LICENSE).
