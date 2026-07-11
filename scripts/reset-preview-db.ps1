param(
  [Parameter(Mandatory = $true)]
  [int]$Pr
)

$projectId = "purple-dawn-20749038"
$branch = "preview/pr-$Pr"

Write-Host "Resetting Neon branch $branch to its parent (production state)..."
npx neonctl branches reset $branch --project-id $projectId --parent
