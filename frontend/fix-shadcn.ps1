if (Test-Path "@") {
    Copy-Item -Path "@\components\ui\*" -Destination "src\components\ui\" -Recurse -Force

    if (Test-Path "@\lib") {
        Copy-Item -Path "@\lib\*" -Destination "src\lib\" -Recurse -Force
    }

    Remove-Item -Path "@" -Recurse -Force

    Write-Host "Fixed. Files moved to src\components\ui" -ForegroundColor Green
} else {
    Write-Host "No @ folder found. Nothing to fix." -ForegroundColor Yellow
}