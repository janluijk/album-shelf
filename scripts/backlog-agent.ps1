$repo = Split-Path $PSScriptRoot -Parent
$backlogDir = Join-Path (Split-Path $repo -Parent) 'album-shelf-backlog'

if (-not (Test-Path $backlogDir)) {
  $origin = git -C $repo remote get-url origin
  git clone $origin $backlogDir
}

git -C $backlogDir pull --rebase origin main
Set-Location $backlogDir
claude --agent backlog --effort low --name backlog --dangerously-skip-permissions
