# Upload the bundled Marbles website to GitHub

The bundled Plain and Japandi profiles are **66,068,896 bytes** and **71,683,028 bytes**. GitHub's browser upload form cannot accept files this large. **Do not upload the website ZIP itself.**

Use Git for Windows and Git LFS to push the extracted **Marbles/** directory into the private `DrFlGd/Marble-Run-Maker` repository. Install [Git for Windows](https://git-scm.com/download/win) and [Git LFS](https://git-lfs.com/).

The high-resolution ZIP supplied in the ChatGPT conversation is named `marbles-local-3mf-high-resolution-bundled.zip`. It contains `Marbles/index.html`, `Marbles/assets/index-DF_hGqP7.js`, approximately 190 supporting assets, and `Marbles/assets/profiles/{plain,japandi}.3mf`.

On Windows, use the upload helper from the ChatGPT conversation (`UPLOAD_MARBLES_TO_GITHUB.bat` and `upload-marbles-from-zip.ps1`). Place the ZIP in Downloads and double-click the BAT file, or drag the ZIP onto it. It safely extracts the files, clones this private repository, configures Git LFS, and pushes the website. A GitHub sign-in may be required.

Alternatively, manually extract the ZIP and:

```powershell
git clone https://github.com/DrFlGd/Marble-Run-Maker.git
cd Marble-Run-Maker
git lfs install
# Copy the extracted Marbles folder into this directory.
git add .gitattributes Marbles
git lfs ls-files
git commit -m "Add bundled Marbles website and high-resolution profiles"
git push origin main
```

Confirm **both `plain.3mf` and `japandi.3mf` appear in `git lfs ls-files`** before committing.

Pushing the new `Marbles/**` files will trigger `.github/workflows/windows.yml`, which is configured to create unsigned Windows setup and portable executables. Until these assets are pushed, the workflow's build checks will fail.
