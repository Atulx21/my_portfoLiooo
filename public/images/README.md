# Portfolio Images

Place the following image files in this directory before deploying.
All images should be optimised (compressed) before committing.

| File | Dimensions | Usage |
|------|-----------|-------|
| `about.jpg` | 840 × 1040 px | About section – main portrait photo |
| `og-image.jpg` | 1200 × 630 px | Open Graph / social share card |
| `projects/ai-tutor.jpg` | 1600 × 900 px | AI-Tutor project card background |
| `projects/unilink.jpg` | 1600 × 900 px | UniLink project card background |
| `projects/moodtunes.jpg` | 1600 × 900 px | MoodTunes project card background |

## Notes

- `about.jpg` — ideally a professional headshot or workspace photo.
  High contrast works best against the `#001D39` background.
- `og-image.jpg` — can be a branded graphic with name + title overlay.
- Project images are currently **disabled** (using placeholder colours).
  To enable them, uncomment the `<Image>` block in
  `src/components/sections/Projects.tsx` inside each `ProjectCard`.
- `hero-bg.jpg` is not currently used — the hero uses a Three.js particle
  field instead.
