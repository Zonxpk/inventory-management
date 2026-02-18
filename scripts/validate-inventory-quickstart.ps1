$ErrorActionPreference = 'Stop'

Write-Host 'Validating inventory quickstart structure...'

$requiredPaths = @(
  'backend/package.json',
  'frontend/package.json',
  'backend/src/inventory/inventory.service.ts',
  'frontend/src/app/inventory/page.tsx',
  'tests/csv/transactions-valid.csv',
  'tests/csv/transactions-invalid.csv',
  'specs/001-inventory-management/contracts/openapi.yaml'
)

$missing = @()
foreach ($path in $requiredPaths) {
  if (-not (Test-Path $path)) {
    $missing += $path
  }
}

if ($missing.Count -gt 0) {
  Write-Error "Missing required files:`n$($missing -join "`n")"
  exit 1
}

Write-Host 'Quickstart structure validation passed.'
exit 0
