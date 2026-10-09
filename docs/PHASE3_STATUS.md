# Phase 3 — Windows build status

## Build targets

- **NSIS installer**: `Marble-Run-Maker-Setup-0.1.0-x64.exe`
- **Portable executable**: `Marble-Run-Maker-Portable-0.1.0-x64.exe`
- **Checksums**: `SHA256SUMS.txt` (SHA-256 for each executable)

The Windows workflow validates each PE executable, the bundled site, and both high-resolution 3MF profiles before publishing an Actions artifact named `Marble-Run-Maker-Windows`.

## Blocker

**No Windows executable has been generated or tested yet.** This repository initially contains only the Electron scaffolding. The following have not been committed:

- `Marbles/index.html` and accompanying site assets
- `Marbles/assets/profiles/plain.3mf` (Git LFS)
- `Marbles/assets/profiles/japandi.3mf` (Git LFS)

These assets exist in the **complete project ZIP** supplied in the ChatGPT conversation. The GitHub connection cannot upload the two large binary files directly. Git LFS is required.

## Unblock and start CI on Windows

1. Install Git for Windows, Git LFS and Node.js 22+ (Node.js is necessary only if building locally).
2. Extract the complete ZIP.
3. Open PowerShell in the extracted folder; run:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\publish-to-github.ps1
   ```

4. Once the push succeeds, the `Marbles/**` change triggers **Build Windows desktop app** under **GitHub → Actions**. You can also choose **Run workflow** manually.
5. When its steps complete successfully, download **Marble-Run-Maker-Windows** from the run's **Artifacts** section. Extract it to find the Setup and Portable executables plus the checksums.
6. Test on Windows 10/11 offline and confirm both editions load and exported 3MF files open correctly in the slicer.

### Alternative: build directly on Windows without pushing files

With Node.js 22+ installed, double-click `build-windows.cmd` in the complete extracted ZIP. The executables will appear under `dist/` and **will not be uploaded automatically**.

## Testing to date

- Offline site/model asset integrity check: **passed locally**.
- Node HTTP server test: **passed locally**.
- Electron dependency installation: **not run here; this environment cannot reach npm**.
- Windows `.exe` generation: **not run here**.
- Real Windows UI/3MF export smoke tests: **not run here**.
- The source application is a mirrored published build; upstream redistribution rights have not been independently verified. The GitHub repository should remain private.
