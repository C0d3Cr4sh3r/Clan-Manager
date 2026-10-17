# ClanOps: Gaming Clan & Ablauf-Planer

Ein umfassendes Management- und Ablauf-Planungssystem für Gaming-Clans, Gilden und Koop-Gruppen (mit Fokus auf Survival- und Crafting-Spiele wie Grounded, Palworld, Valheim, Rust, Ark etc.). Ermöglicht das Anlegen von Projekten, das Zuweisen von Aufgaben an Mitglieder (z. B. Max sammelt 50 Grasplatten, Susi 100 Spinnenfäden) und das präzise Erfassen von Vorrat, Zielmenge und noch benötigten Restmengen.

## User Review & Critical Decisions

> [!IMPORTANT]
> Alle Kernentscheidungen wurden auf Basis deiner Antworten abgestimmt:
> - **Vorlagen & Freie Spiele**: Integrierte Start-Vorlagen (u. a. Grounded, Palworld, Valheim, Rust, Minecraft) mit typischen Ressourcen und Bauvorhaben sowie vollständige Freiheit, eigene Spiele, Kategorien und Items anzulegen.
> - **Clan- & Mitgliederverwaltung**: Clan-Profile mit Rollen (Clan-Leiter, Offizier, Sammler, Baumeister, Raider), Aktivitätsstatus und direkter Aufgabenzuweisung.
> - **Aufgabentypen**: Sammeln von Ressourcen mit Vorrat/Bedarf-Zähler, mehrstufige Bauprojekte, Crafting-Listen und Boss-Raids mit Vorbereitungs-Checklisten.

- **Bestätigte Entscheidung 1**: Spiele-Vorlagenbibliothek inklusive Grounded (Grasplatten, Spinnenfäden, Marienkäfer-Brocken, Eichelschalen etc.) + Freiform-Editor für jedes beliebige Game.
- **Bestätigte Entscheidung 2**: Mitgliederverwaltung mit Echtzeit-Fortschritt pro Spieler (Max, Susi etc.), Quoten-Erfüllung und individueller Spieler-Ansicht ("Meine Aufgaben").
- **Offener Punkt / Empfehlung**: Lokaler Speicher mit automatischem JSON-Export/Import und "Clan-Sync Link", damit Mitspieler denselben Clan-Plan teilen und abgleichen können ohne externe Serverkosten.

---

## 1. Overview & Core Concept

- **Was die App leistet**: 
  Clans und Spielergruppen strukturieren ihre Sessions und Großprojekte. Anstatt im Discord-Chat den Überblick zu verlieren, wer wie viel Holz, Erz oder Boss-Trophäen hat, bietet die App ein zentrales Dashboard:
  - Definieren von Zielen (z. B. "Grounded: Große Eichen-Baumbasis bauen" oder "Brutmutter-Raid Vorbereitung").
  - Aufteilung in konkrete Einzelaufgaben mit Zielmenge, aktuellem Stand (`Haben`), noch benötigter Menge (`Fehlt noch`) und Fortschrittsbalken.
  - Zuweisung an Clan-Mitglieder (z. B. Max: 50 Grasplatten; Susi: 100 Spinnenfäden).
  - Schnelles Aufstocken/Reduzieren per Klick (`+1`, `+5`, `+10`, `+50`, Direkteingabe).
  - Statusanzeigen (In Arbeit, Erledigt, Dringend).

- **Zielgruppe**: 
  Clan-Leiter, Gaming-Cliquen, Gilden und Koop-Teams, die zielorientiert zusammen Survival- und MMO-Spiele spielen.

- **Kernwert**: 
  Transparenz und Zeitersparnis: Jeder weiß auf einen Blick, was für das aktuelle Vorhaben noch fehlt und wer woran arbeitet.

---

## 2. User Experience & Visual Design

### A. Haupt-Workflows

1. **Dashboard & Spiele-Umschalter**:
   - Schnellwahl zwischen aktiven Spielen (z. B. Grounded, Palworld, Valheim oder eigenes Spiel).
   - Oben: Clan-Gesamtziel & Fortschritts-Tracker (z. B. "Basis-Erweiterung Stufe 2: 78% abgeschlossen").
   - Filterleiste: Nach Status (Alle, In Arbeit, Erledigt), Typ (Ressourcen, Bau, Crafting, Raid) oder Mitglied (z. B. nur "Max").

2. **Aufgaben- & Ressourcen-Ansicht**:
   - Tabellarische & Karten-Darstellung der Ressourcen:
     - Icon & Gegenstandsname (z. B. 🌿 Grasplatte, 🕸️ Spinnenfaden, 🪵 Hartholz).
     - Zugewiesenes Mitglied mit Avatar & Rolle (z. B. `Max [Sammler]`).
     - Zähler: `32 / 50` | `Noch benötigt: 18`.
     - Direkte Schnell-Aktionen: `+1`, `+5`, `+10`, Zahl anpassen oder als "Erledigt" abhaken.
     - Fortschrittsbalken mit Farbindikator.

3. **Clan- & Mitglieder-Hub**:
   - Übersicht aller Clan-Mitglieder (z. B. Max, Susi, Alex, Sarah) mit vergebenen Rollen.
   - Statistiken pro Mitglied: Anzahl zugewiesener Aufgaben, erledigte Quoten, gesammelte Ressourcen.
   - Schnelle Spieler-Perspektive: Ein Klick auf "Susi" filtert das gesamte Dashboard auf Susis offene To-Dos.

4. **Projekt- & Aufgaben-Erstellung**:
   - Dialog "Neue Aufgabe erstellen": Spiel wählen, Aufgabentyp (Ressource, Bauen, Craften, Raid), Titel, Zielmenge, Einheiten, Zuweisung an Mitglied, Priorität.
   - Schnell-Import aus Vorlagen (z. B. Grounded-Basispaket mit 1 Klick hinzufügen).

5. **Daten-Export & Synchronisation**:
   - Vollständiger lokaler Speicher (kein Datenverlust beim Neuladen).
   - "Clan-Daten exportieren / importieren" (JSON oder Shareable Code), um den Plan mit dem restlichen Clan zu teilen.

### B. Visual Identity & Design-Richtung

- **Aesthetic Direction**: High-End Gaming Command Center & Clean Dashboard (angenehmer Dark-Mode mit tiefem Anthrazit, warmen Erdtönen/Grün-Akzenten passend zu Survival & Grounded).
- **Farbpalette**:
  - Canvas: `#0F172A` (Deep Slate Canvas)
  - Oberflächen & Panels: `#1E293B` und `#334155` mit feinen 1px Hairline Borders (`#475569` / `rgba(255,255,255,0.08)`)
  - Primärakzente: Smaragdgrün `#10B981` (für Natur/Survival & Erfolge), Amber `#F59E0B` (für offene Quoten), Cyan `#06B6D4` (für Raids/Crafting)
- **Typografie**:
  - Headings: `Plus Jakarta Sans` / `Outfit` (klar, modern)
  - Body: `DM Sans` / `Plus Jakarta Sans`
  - Zahlen & Mengenangaben: `tabular-nums font-mono` für perfekte Ausrichtung der Zähler (`32 / 50`).
- **Zero-Pill Discipline**: Statusanzeigen und Metadaten als saubere, unboxte Texte mit typografischen Trennern (`Max · Sammler · 18 verbleibend`), interaktive Filter als segmentierte Schalter.

---

## 3. Key Product Decisions & Trade-Offs

- **Lokale Speicherung mit Share/Export statt erzwungenem Cloud-Account**:
  - *Vorteil*: Sofort einsatzbereit ohne Registrierungszwang oder Login-Hürde für die Clan-Mitglieder.
  - *Zukunftssicher*: Einfacher JSON-Import/Export ermöglicht Weitergabe im Discord.
- **Duale Ansicht (Projekt-Dashboard + Spieler-Ansicht)**:
  - *Vorteil*: Der Clan-Leiter sieht den Gesamtfortschritt des Bauprojekts, während Max oder Susi in ihrer gefilterten Ansicht nur ihre konkreten Aufgaben abhaken.
- **Vordefinierte Vorlagen-Datenbank**:
  - *Vorteil*: Für Grounded, Palworld & Valheim sind typische Items und Standard-Aufgaben bereits hinterlegt, was lästiges Eintippen von Hand spart.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Navigation & Top Bar                        │
│  [ClanOps Wordmark]  —  [Grounded ▼] [Dashboard] [Mitglieder] [Vorlagen]│
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│       Clan & Project Store    │               │       Filter & View State     │
│ - Aktives Spiel (Grounded)    │               │ - Filter nach Spieler (Max)   │
│ - Projekte (z.B. Baumbasis)   │               │ - Filter nach Typ (Ressource) │
│ - Aufgaben & Mengen (32/50)   │               │ - Suche & Sortierung          │
│ - Mitglieder & Rollen         │               │ - Ansicht: Karten / Tabelle   │
└───────────────────────────────┘               └───────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│   Ressourcen-Tracker  │ │   Mitglieder-Hub      │ │   Projekt- & Raid-    │
│ - Haben / Brauchen    │ │ - Rollen (Leiter etc.)│ │     Vorbereitung      │
│ - Noch benötigt: X    │ │ - Aufgaben-Quoten     │ │ - Phasen-Checkliste   │
│ - Schnell-Buttons +10 │ │ - "Meine Aufgaben"    │ │ - Boss-Voraussetzung  │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌───────────────────────────────────────┐ ┌─────────────────────────────────────┐
│  LocalStorage Persistenz Engine       │ │  JSON & Link Export / Import Engine │
└───────────────────────────────────────┘ └─────────────────────────────────────┘
```

### Datenmodell

- **Game**: `id`, `name`, `icon`, `isCustom`, `categories`
- **Member**: `id`, `name`, `role` (Clan-Leiter, Offizier, Sammler, Baumeister, Raider), `avatarColor`, `notes`
- **Task**: 
  - `id`, `gameId`, `projectId`
  - `title` (z. B. "Grasplatten beschaffen")
  - `category` (Ressource, Bauen, Crafting, Boss-Raid)
  - `assignedMemberId` (z. B. Max)
  - `currentAmount` (z. B. 32)
  - `targetAmount` (z. B. 50)
  - `unit` (z. B. "Platten", "Stück", "Barren")
  - `priority` (Niedrig, Mittel, Hoch, Dringend)
  - `status` (Offen, In Arbeit, Erledigt)
  - `notes` (z. B. "Am großen Eichenbaum fällen")
  - `subtasks` (für Raids oder Bauphasen)
- **Project**: `id`, `gameId`, `title`, `description`, `targetDate`
