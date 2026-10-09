# Phase 3 — Windows build status

Build targets: `Marble-Run-Maker-Setup-0.1.0-x64.exe`, `Marble-Run-Maker-Portable-0.1.0-x64.exe` and `SHA256SUMS.txt`.

**Current blocker:** No Windows executable has been generated or tested. The GitHub repository still lacks `Marbles/index.html`, the website assets, and both 3MF archives (`Marbles/assets/profiles/{plain,japandi}.3mf`). The GitHub app cannot directly upload the two large binaries. The complete ZIP generated in the ChatGPT conversation contains these assets.

## Complete the build

1. Install Git for Windows and Git LFS, then extract the complete Phase 3 ZIP.
2. Open PowerShell in the extracted folder and run: `powershell -ExecutionPolicy Bypass -File .\scripts\publish-to-github.ps1`.
3. The `Marbles/**` push should automatically start **GitHub → Actions → Build Windows desktop app**. Alternatively select **Run workflow**.
4. After a successful run, download the **Marble-Run-Maker-Windows** artifact. It includes Setup and Portable EXEs and SHA-256 checksums.
5. Test the executables on Windows 10/11 without Internet access. Confirm Plain and Japandi profiles auto-load and 3MF exports open in your slicer.

Alternatively, with Node.js 22+ on Windows, run **`build-windows.cmd`** directly from the full ZIP; build outputs appear under `dist/`.

## Validation status

- Locally verified: website assets, both full-size 3MF ZIP headers, Node HTTP-server tests, and build configuration tests.
- Not verified: downloading Electron/npm dependencies or producing a Windows EXE (no npm/GitHub network access in this runtime), native Windows UI behavior, and actual slicer output.
- Keep the repository private pending verification of upstream redistribution rights.
