#!/bin/bash
# ============================================
# Smarttask Backend Development Setup Script
# ============================================
# Dieses Skript bereitet die Entwicklungsumgebung vor

set -e

echo "========================================"
echo "Smarttask Backend Setup"
echo "========================================"
echo ""

# 1. Java Version prüfen
echo "1️⃣  Prüfe Java Version..."
java -version
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "✅ Java Version: $JAVA_VERSION"
echo ""

# 2. Maven prüfen
echo "2️⃣  Prüfe Maven..."
mvn -version | head -1
echo "✅ Maven gefunden"
echo ""

# 3. PostgreSQL Connection testen
echo "3️⃣  Teste PostgreSQL Verbindung..."
if command -v psql &> /dev/null; then
    PGPASSWORD=smarttask_password psql -h localhost -U smarttask_user -d smarttask_db -c "SELECT version();" 2>/dev/null && echo "✅ PostgreSQL läuft" || echo "⚠️  PostgreSQL nicht erreichbar - bitte starten"
else
    echo "⚠️  PostgreSQL CLI nicht installiert (optional)"
fi
echo ""

# 4. Keycloak prüfen
echo "4️⃣  Prüfe Keycloak..."
if curl -s http://localhost:8080/admin 2>/dev/null | grep -q "keycloak"; then
    echo "✅ Keycloak läuft"
else
    echo "⚠️  Keycloak nicht erreichbar - bitte mit Docker starten:"
    echo "   docker run -d -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev"
fi
echo ""

# 5. Maven Dependencies laden
echo "5️⃣  Lade Maven Dependencies..."
mvn clean dependency:resolve -DskipTests > /dev/null 2>&1
echo "✅ Dependencies geladen"
echo ""

# 6. Build testen
echo "6️⃣  Teste Maven Build..."
mvn clean compile -DskipTests > /dev/null 2>&1
echo "✅ Build erfolgreich"
echo ""

echo "========================================"
echo "✅ Setup abgeschlossen!"
echo "========================================"
echo ""
echo "🚀 Nächste Schritte:"
echo "   1. Starte Spring Boot:"
echo "      mvn spring-boot:run"
echo ""
echo "   2. Öffne Swagger UI:"
echo "      http://localhost:8081/swagger-ui.html"
echo ""
echo "   3. Logge dich mit Bearer Token an (siehe CONFIGURATION.md)"
echo ""
echo "📝 Hilfreich:"
echo "   - Logs ansehen: tail -f /tmp/smarttask.log"
echo "   - Tests laufen: mvn test"
echo "   - Nur Tests: mvn clean verify -DskipTests=false"
echo ""

