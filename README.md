> **Initial upload status:** The Electron scaffolding, tests, Windows workflow, and plan are committed. The large website assets and high-resolution 3MF binaries are **not yet in this repository**. Use the full ZIP supplied in this chat and run `scripts/publish-to-github.ps1` to upload everything via Git LFS. Builds will not pass before that upload.\n\n# Marble Run Maker (offline desktop)

A **private, customized local mirror** of the 16 mm Marble Run Builder, packaged with an Electron Windows wrapper and the two user-supplied high-resolution 3MF profiles. This project is a *modified published build*, **not** the original website's source repository.

## Features

- Runs without a MakerWorld account, cloud hosting, or Internet access at runtime.
- Built-in 3MF profiles: **Plain** and **Japandi**, automatically loaded from `Marbles/assets/profiles/`.
- Existing 3MF export actions for print plates and the combined run.
- Native Windows desktop wrapper using Electron and an internal loopback HTTP server; no `file://` restrictions and no Python prerequisite after packaging.

## Run / develop

Install **Node.js 22+**, then:

```powershell
npm install
npm run check
npm start
```

An Electron window should open. Allow the high-resolution profiles to load before exporting.

## Build Windows `.exe`

On a **Windows** computer (after running `npm install` at least once to generate `package-lock.json`):

```powershell
npm ci
npm run check
npm run dist:win
```

Find an **unsigned NSIS installer** and **unsigned portable executable** in `dist/`. Windows SmartScreen may warn until the application is code-signed. The workflow at `.github/workflows/windows.yml` can also create these binaries from GitHub Actions; download them from **Actions → Build Windows desktop app → Artifacts**.

## Repository setup and Git LFS

The Plain and Japandi 3MF archives exceed 50 MB apiece. They are intentionally tracked with **Git LFS** rather than normal Git objects. Install [Git LFS](https://git-lfs.com/) before uploading. To publish the full ZIP contents to your GitHub repository from Windows, run `powershell -ExecutionPolicy Bypass -File .\scripts\publish-to-github.ps1` from the extracted project folder. This automatically clones the repository, copies the assets and pushes using Git LFS. Or, if you are already working inside a clone, do:

```powershell
git lfs install
git add .
git commit -m "Add Marble Run website, models and Electron app"
git push origin main
```

If this GitHub repository already has the initial scaffold, **clone it first and copy the contents of this project folder into that clone** (do not copy a `.git` directory). Run `npm install` once on a network-connected machine to generate `package-lock.json`, then commit the lockfile to make future installs reproducible (the automated workflow currently uses `npm install` until the lockfile is committed).

## Rights and safety

This repository includes a mirrored/minified application and user-supplied 3MF models. The upstream licensing / model redistribution rights have **not been independently verified**. Keep the repository private until you have confirmed you can redistribute the software and profiles. The bundled UI and exporters have not undergone full Windows interactive or slicer validation; verify any 3MF in a slicer before printing.

More details: [`docs/WINDOWS_BUILD_PLAN.md`](docs/WINDOWS_BUILD_PLAN.md).