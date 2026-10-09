# Run from PowerShell on Windows after extracting the complete Marble Run Maker ZIP.
# Requires Git for Windows (credential manager recommended) and Git LFS.
$ErrorActionPreference = 'Stop'
$Repository = 'https://github.com/DrFlGd/Marble-Run-Maker.git'
$Project = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$TemporaryClone = Join-Path ([IO.Path]::GetTempPath()) ('Marble-Run-Maker-upload-' + [guid]::NewGuid().ToString('N'))

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Install Git for Windows before running this script: https://git-scm.com/download/win'
}
& git lfs version | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw 'Install Git LFS before uploading the two large 3MF files: https://git-lfs.com/'
}

Write-Host 'Cloning your private GitHub repository...'
& git clone $Repository $TemporaryClone
if ($LASTEXITCODE -ne 0) { throw 'Git clone failed. Make sure you have access to the private repository.' }

Write-Host 'Copying the app and high-resolution assets into the clone...'
& robocopy $Project $TemporaryClone /E /NFL /NDL /NP /NJH /NJS /XD (Join-Path $Project '.git') (Join-Path $Project 'node_modules') (Join-Path $Project 'dist') | Out-Null
if ($LASTEXITCODE -gt 7) { throw 'Unable to copy project files.' }

Push-Location $TemporaryClone
try {
    & git lfs install --local
    if ($LASTEXITCODE -ne 0) { throw 'Unable to initialize Git LFS.' }
    & git add -A
    if ($LASTEXITCODE -ne 0) { throw 'Unable to stage files.' }
    Write-Host 'The following assets will be stored with Git LFS:'
    & git lfs ls-files
    & git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        & git commit -m 'Upload complete Marbles website and high-resolution 3MF profiles'
        if ($LASTEXITCODE -ne 0) { throw 'Git commit failed. Configure git user.name and user.email.' }
        Write-Host 'Uploading project to GitHub...'
        & git push origin main
        if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Check credentials and Git LFS quota.' }
    } else {
        Write-Host 'The GitHub repository already has the same files.'
    }
    Write-Host 'Upload complete: https://github.com/DrFlGd/Marble-Run-Maker'
    Write-Host 'Windows build: GitHub > Actions > Build Windows desktop app'
} finally {
    Pop-Location
}