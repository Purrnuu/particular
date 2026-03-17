# Project TODO

- [x] Add support for Image to Particles mapping
- [x] Make burst presets pretty
- [ ] Support 3d objects
- [x] Toggleable idle effect for image particles — enable/disable breathing, wiggle, wave, and pulse animations at runtime via controller method or config flag
- [x] Better looking explosion effects — improve child particle visuals (color variation, velocity spread, shapes, glow) for more cinematic explode() results
- [x] Intro effect for image-to-particles — progressive resolution reveal with triangles cross-dissolving into final shape at increasing resolutions
- [x] Better triangle rendering for image-to-particles — reduce gaps in tessellated triangle grids, improve alternating up/down packing, and tune size/spacing for tighter coverage
- [ ] Container glow/pulse — given a container (or text element), surround it with glowing, pulsing particles that gently flow outward from its edges. Soft ambient halo effect. Should work with arbitrary DOM elements and text.
- [ ] Mouse trail — particles that emit from the mouse position, inheriting cursor velocity, leaving a trail/streak of magic wisps. Configurable trail length, particle style, and fade behavior.
- [ ] Image chunk explosion — instead of splitting an image into individual dot/shape particles, cut it into random irregular polygon chunks (like shattered glass) where each chunk is a particle. More visually dramatic and more efficient than hundreds of tiny particles.
- [ ] Showcase: interactive effect gallery — expand the Showcase story to include all major effects as clickable/interactive sections. Currently has: snow, text particles, river, fireworks, boundaries, mouse force. Missing: explosions (click to detonate), attractors (interactive point forces), image-to-particles, element-to-particles (dissolve a card), burst presets (shape variety), scatter. Each effect should be a visible section with a label/description that activates on click or interaction, so the Showcase serves as a complete interactive catalog of everything the library can do.
