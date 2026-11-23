# NET FORGE v0.32.7 — Gameplay Audio

Game still supports offline HTML. The sound engine is built with Web Audio API using synthesized original tones. It does not download any sound files.

## Controls
- Open the fixed **Audio** button at lower right.
- Enable audio with a user click to unlock browser audio.
- Master volume and Gameplay SFX volume range from 0–100%.
- Independently toggle Iga alerts and click sounds.
- Use **Tes SFX** to verify browser output.

## Events
The simulator explicitly emits `netforge:gameplay-sound` for new devices, cable installation, saved configuration, ping results, chaos incidents, and mission completion. The audio manager uses short synthesized tones, cooldown limits, and does not change game simulation state.

## Limitations
- Most browsers block autoplay audio until the user interacts. Intro sound has its own opt-in switch from v0.32.6; both intro and gameplay obey the central master mute/volume.
- No background music yet.
- No audio is sent to a server.
- No gameplay sound if the browser has no AudioContext.
