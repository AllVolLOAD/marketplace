param(
  [switch]$SkipInstall
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "enatega-multivendor-web"

function Start-NodeService {
  param(
    [string]$WorkingDirectory,
    [string]$Command,
    [string]$Title
  )

  $args = "-NoExit","-Command","cd `"$WorkingDirectory`"; $Command"
  Write-Host "Launching $Title in new window..."
  Start-Process -FilePath "powershell.exe" -ArgumentList $args
}

if (-not $SkipInstall) {
  Write-Host "Installing dependencies for backend and frontend..."
  Push-Location $backendDir
  npm.cmd install
  Pop-Location
  Push-Location $frontendDir
  npm.cmd install
  Pop-Location
}

Write-Host "Ensuring MongoDB is up via docker-compose..."
Push-Location $backendDir
docker compose up -d mongo
Pop-Location

Start-NodeService -WorkingDirectory $backendDir -Command "npm.cmd run dev" -Title "Backend (port 4000)"
Start-NodeService -WorkingDirectory $frontendDir -Command "npm.cmd run dev" -Title "Frontend (port 3000)"

Write-Host "All services launched; use the new terminal windows to watch logs."
