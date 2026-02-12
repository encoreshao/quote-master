# Nexus Tab — Product Design

**Date:** 2026-02-12
**Status:** Approved
**Replaces:** Quote Master v1.2.4

## Product Identity

- **Name:** Nexus Tab
- **Tagline:** Your daily command center
- **Description:** Chrome extension that replaces new tab with a modular glassmorphism productivity dashboard
- **Author:** Encore Shao

## Core Principles

- **Instant** — Loads fast, no API blocking
- **Personal** — Custom background, widgets, layout
- **Modular** — Everything is a widget card
- **Offline-first** — Core features work without internet

## Visual Design

- **Style:** Glassmorphism + Bento grid
- **Background:** Custom photo with dark overlay, or default gradient (navy → purple)
- **Cards:** `backdrop-blur-xl bg-white/10 border border-white/20`
- **Accent:** Customizable, default electric blue `#3B82F6`
- **Text:** White primary, `white/60` secondary
- **Font:** Inter (Google Fonts)

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS (replaces Bulma)
- Webpack 5 (existing config)
- Chrome Extension Manifest v3

## Widget Catalog (13 widgets)

| Widget | Size | Data Source | Refresh |
|--------|------|-------------|---------|
| Clock & Greeting | Medium | Local | Every second |
| Search Bar | Wide | Google/custom | On demand |
| Tasks | Large | chrome.storage | On change |
| Quick Links | Medium | chrome.storage | On change |
| Bookmarks | Medium | Chrome API | On open |
| Notes / Scratchpad | Medium | chrome.storage | On change |
| Pomodoro Timer | Small | Local | Every second |
| Weather | Small | OpenWeather API | Every 30 min |
| GitLab Activity | Medium | GitLab API | Every 5 min |
| GitHub Activity | Medium | GitHub API | Every 5 min |
| RSS Feeds | Large | Fetch + CORS proxy | Every 15 min |
| Custom Embed | Large | iframe URL | On load |
| Keyboard Shortcuts | Small | Local | Static |

## Layouts

### Focus — Clean and calm
Large clock/greeting, search bar, quick links + small task list.

### Dashboard — Everything visible
Full bento grid with all active widgets.

### Workflow — Deep work
Split: tasks on left, stacked widgets on right.

## Navigation

- Top-right: Layout switcher (3 icons)
- Top-left: Settings gear → slide-out panel
- No traditional navbar/footer

## Storage Schema

```
nexus.profile         — { username, greeting, backgroundUrl, accentColor }
nexus.activeLayout    — "focus" | "dashboard" | "workflow"
nexus.layouts         — per-layout widget visibility
nexus.widget.{id}     — per-widget config and data
```

## Migration

- Detect old Quote Master keys on first load
- Map to new `nexus.*` namespace
- Preserve tasks, bookmarks config, GitLab config
- Drop quote-related data
- Set migrated flag

## Implementation Phases

### Phase 1 — Foundation
Tailwind, WidgetCard, layout engine, settings panel, storage, migration, manifest rename, background.

### Phase 2 — Core Widgets
Clock, Search, Quick Links, Tasks, Notes, Bookmarks.

### Phase 3 — Extended Widgets
Pomodoro, Weather, RSS, GitLab, GitHub, Embed, Shortcuts.

### Phase 4 — Polish
Onboarding, transitions, performance, icons, README.
