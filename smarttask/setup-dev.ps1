# ============================================
# Smarttask Backend Development Setup Script
# ============================================
# PowerShell Version für Windows
# Ausführen: .\setup-dev.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smarttask Backend Setup (Windows)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Java Version prüfen
Write-Host "1️⃣  Prüfe Java Version..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version" | Select-Object -First 1
    Write-Host "✅ $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java nicht gefunden. Bitte installiere JDK 26+" -ForegroundColor Red
    Exit 1
}
Write-Host ""

# 2. Maven prüfen
Write-Host "2️⃣  Prüfe Maven..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn -version | Select-Object -First 1
    Write-Host "✅ $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven nicht gefunden. Bitte installiere Maven 3.6+" -ForegroundColor Red
    Exit 1
}
Write-Host ""

# 3. PostgreSQL Connection testen
Write-Host "3️⃣  Teste PostgreSQL Verbindung..." -ForegroundColor Yellow
$pgFound = Get-Command psql -ErrorAction SilentlyContinue
if ($pgFound) {
    try {
        $env:PGPASSWORD = "smarttask_password"
        psql -h localhost -U smarttask_user -d smarttask_db -c "SELECT version();" 2>$null | Out-Null
        Write-Host "✅ PostgreSQL läuft" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  PostgreSQL nicht erreichbar - bitte starten" -ForegroundColor Yellow
        Write-Host "   - Öffne Services und starte 'postgresql-x64-15'" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  PostgreSQL CLI nicht installiert (optional)" -ForegroundColor Yellow
}
Write-Host ""

# 4. Keycloak prüfen
Write-Host "4️⃣  Prüfe Keycloak..." -ForegroundColor Yellow
try {
    $keycloakResponse = Invoke-WebRequest -Uri "http://localhost:8080/admin" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Content
    if ($keycloakResponse -like "*keycloak*") {
        Write-Host "✅ Keycloak läuft" -ForegroundColor Green
    } else {
        throw "Keycloak nicht erreichbar"
    }
} catch {
    Write-Host "⚠️  Keycloak nicht erreichbar - bitte mit Docker starten:" -ForegroundColor Yellow
    Write-Host "   docker run -d -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev" -ForegroundColor Gray
}
Write-Host ""

# 5. Maven Dependencies laden
Write-Host "5️⃣  Lade Maven Dependencies..." -ForegroundColor Yellow
Write-Host "   (Dies kann einige Minuten dauern beim ersten Mal...)" -ForegroundColor Gray
& mvn clean dependency:resolve -DskipTests -q
Write-Host "✅ Dependencies geladen" -ForegroundColor Green
Write-Host ""

# 6. Build testen
Write-Host "6️⃣  Teste Maven Build..." -ForegroundColor Yellow
& mvn clean compile -DskipTests -q
Write-Host "✅ Build erfolgreich" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Setup abgeschlossen!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Nächste Schritte:" -ForegroundColor Yellow
Write-Host "   1. Starte Spring Boot:" -ForegroundColor White
Write-Host "      mvn spring-boot:run" -ForegroundColor Cyan
Write-Host ""
Write-Host "   2. Öffne Swagger UI:" -ForegroundColor White
Write-Host "      http://localhost:8081/swagger-ui.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. Logge dich mit Bearer Token an (siehe CONFIGURATION.md)" -ForegroundColor White
Write-Host ""

Write-Host "📝 Hilfreich:" -ForegroundColor Yellow
Write-Host "   - Tests laufen: mvn test" -ForegroundColor Gray
Write-Host "   - Install Dependencies: mvn clean install" -ForegroundColor Gray
Write-Host "   - JAR erstellen: mvn clean package" -ForegroundColor Gray
Write-Host ""

