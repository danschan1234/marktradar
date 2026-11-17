# MarktRadar Netlify Backend Pilot

## Inhalt
- `netlify/functions/status.mjs`: prüft nur, ob BEA_API_KEY und FMP_API_KEY konfiguriert sind (niemals Werte ausgeben)
- `netlify/functions/economy.mjs`: US-BIP aus BEA NIPA Tabelle T10105 Zeile 1 (quartalsweise)
- `netlify/functions/equities.mjs`: FMP-Unternehmensprofile ausgewählter KI-Aktien; angezeigte Preise sind **keine garantierten Echtzeitkurse**
- `public/index.html`: mobiloptimierte Diagnose-Oberfläche

## Deployment auf dem bestehenden Netlify-Projekt
1. Diese ZIP-Datei entpacken.
2. Repository in GitHub erstellen und Dateien im Repository-Root ablegen.
3. In Netlify im bestehenden Projekt `marktradar-c0qh` unter **Build & deploy** mit dem Repository verbinden (Import existing project / Link repository). `netlify.toml` definiert `public` und `netlify/functions`.
4. Bei Netlify prüfen, dass `BEA_API_KEY` und `FMP_API_KEY` beim Projekt hinterlegt sind und der Scope **Functions** einschließt; bei Änderung neu deployen.
5. Deploy abwarten; auf der Netlify-Site die drei Requests `/.netlify/functions/status`, `/economy`, `/equities` prüfen.

## Sicherheit
- API-Schlüssel gehören ausschließlich in Netlify Environment Variables und niemals in GitHub oder `public`.
- Die Endpunkte geben *keine* API-Schlüssel zurück.
- Diese Pilot-API liefert Daten öffentlich an Site-Besucher. Für Limits, Schutz vor Missbrauch und kommerzielle Datennutzung braucht es Zugangskontrolle und Lizenzprüfung.

## Grenzen
- Ein gültiger Schlüssel garantiert nicht, dass ein FMP-Endpunkt im gebuchten Tarif freigeschaltet ist.
- Ohne Netlify-Deploy wurden die externen Provider-Antworten noch nicht verifiziert.
- Andere Frühindikatoren und Scheduler sind noch nicht implementiert.
