$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo
git pull --rebase origin main
claude --agent dev --name dev --dangerously-skip-permissions
