$docPath = "docs/specifications/drizzle-orm-schema-spec.md"
$bodyContent = [System.IO.File]::ReadAllText($docPath, [System.Text.Encoding]::UTF8)

$payloadObj = @{
    title = "HUM-W1-02: Persistence, API & Drizzle ORM Schema Specification"
    format = "markdown"
    body = $bodyContent
    baseRevisionId = $null
}

$jsonPayload = $payloadObj | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $($env:PAPERCLIP_API_KEY)"
    "Content-Type" = "application/json"
    "X-Paperclip-Run-Id" = $env:PAPERCLIP_RUN_ID
}

$url = "$($env:PAPERCLIP_API_URL)/api/issues/$($env:PAPERCLIP_TASK_ID)/documents/drizzle_orm_schema_spec"

Write-Output "Sending request to $url"
$response = Invoke-RestMethod -Uri $url -Method Put -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($jsonPayload))
$response | ConvertTo-Json -Depth 5
