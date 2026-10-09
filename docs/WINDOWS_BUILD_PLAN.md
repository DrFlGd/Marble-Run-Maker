# Windows Electron executable — implementation and validation plan

## Scope

The goal is a fully offline Windows x64 app with the *existing* 3D editor and 3MF exports working without account login, manual profile upload, Python, or internet access. The HTML/CSS/JS and the exact user-supplied Plain/Japandi model files remain unmodified inside the desktop package.

## Phase 1 — Repository and reproducible dependencies

- Keep the repository private while checking original app + model redistribution rights.
- Check in the `Marbles/` published site, `electron/`, `tests/`, `.github/workflows/windows.yml`, and this plan.
- Store `Marbles/assets/profiles/*.3mf` in **Git LFS**; verify `git lfs pull` downloads files, not pointer stubs.
- Run `npm install` on an internet-connected machine and **commit `package-lock.json`**. `npm ci` depends on this lockfile.
- Run `npm run check` locally and in CI.

**Gate:** website assets and both model archives are present; server smoke tests pass.

## Phase 2 — Desktop integration

- Electron loads the site via an HTTP server bound to `127.0.0.1` on an ephemeral port. Do not use `file://` because model loading uses fetch.
- Disable Node.js integration, keep context isolation and sandboxing, block external navigation and permission requests.
- Ensure exported 3MF downloads work as expected. If a particular Electron version has different download behavior, add a scoped `will-download` handler and native Save dialog.
- Check startup, model-load indicator, Plain/Japandi toggle, editor interaction, save/load, Undo/Redo, 3MF all-level export, individual plates and one-piece exports.

**Gate:** every exported file opens in Bambu Studio / PrusaSlicer and matches expected parts at print resolution.

## Phase 3 — Windows build + CI

- Run `npm run dist:win` on Windows x64 to generate both **NSIS Setup EXE** and **portable EXE**.
- Run the GitHub Actions workflow on `windows-latest`; confirm `actions/checkout` fetches Git LFS assets, and generated artifacts download successfully.
- Smoke-test clean Windows 10/11 machines *without* Python, Node.js, or Internet access: application startup, output permissions, and high-resolution profiles.
- Record memory usage loading both profiles (about 138 MB compressed combined) and test the loading indicator and timeouts.

**Gate:** both unsigned artifacts launch and export valid 3MF offline.

## Phase 4 — Distribution hardening

- Add product icon, app versioning, changelog, and installer metadata.
- Purchase/obtain a Windows code-signing certificate and sign EXE installers; consider Windows Smart App Control / SmartScreen reputation.
- Only after verifying redistribution rights, decide whether to publish a release and enable automatic updates. For private usage, manual updates are simpler and safer.
- Optionally split high-resolution archives into per-part assets if startup/memory becomes a problem, and build fully automated UI tests.

## Notes and risks

- This repository is a *modified minified web distribution*, not the original TypeScript/Vite source; adding features is harder until the original source is available.
- The high-resolution Plain and Japandi archives are ~66 MB and ~72 MB respectively; installers and GitHub Actions artifacts will be appreciably larger.
- GitHub LFS has separate bandwidth/storage quotas, and private Actions workflows have usage limits.
- No executable was built or signed in this preparation environment. Windows UI and 3MF slicer validation are required.
