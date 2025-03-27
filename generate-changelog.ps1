# Definir el rango de fechas HACER COMMIT DE TODO ANTES DE USARLO
$since = "2025-03-14"
$until = "2025-03-27"

# Obtener los commits en el rango de fechas
$commits = git log --since="$since" --until="$until" --pretty=format:"%H"

# Si no hay commits, salir del script
if (-not $commits) {
    Write-Host "No hay commits en el rango de fechas seleccionado."
    exit
}

# Obtener el primer commit del rango
$firstCommit = $commits | Select-Object -Last 1

# Crear y cambiar a la rama temporal basada en el primer commit del rango
git checkout -b temp-changelog $firstCommit

# Hacer cherry-pick de todos los commits en el rango
$commits -split "`n" | ForEach-Object { git cherry-pick $_ }

# Generar el changelog
npx conventional-changelog-cli -p angular -i CHANGELOG.md -s

# Volver a la rama principal
git checkout main

# Eliminar la rama temporal
git branch -D temp-changelog

Write-Host "Changelog generado exitosamente en CHANGELOG.md"
