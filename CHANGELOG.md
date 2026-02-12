# Change Log

## v2.0.0 (2026-02-12)

### Nexus Tab — Complete Rebuild

- **Rebrand**: Renamed from Quote Master to Nexus Tab
- **New Design**: Glassmorphism + bento grid design system with Tailwind CSS
- **Widget System**: Modular architecture with 13 widgets (9 functional, 4 placeholder)
  - Clock & Greeting
  - Search Bar
  - Tasks (kanban board + list view)
  - Quick Links (add/remove/favicon)
  - Bookmarks (tree browser + search)
  - Notes / Scratchpad
  - Pomodoro Focus Timer
  - Weather (OpenWeather API)
  - RSS Feeds (auto-refresh)
  - GitLab Activity (placeholder)
  - GitHub Activity (placeholder)
  - Custom Embed (placeholder)
  - Keyboard Shortcuts (placeholder)
- **Three Layouts**: Focus, Dashboard, and Workflow — switchable with one click
- **Settings Panel**: Slide-out panel with profile customization and per-layout widget toggles
- **Customization**: Background image, accent color (6 presets + custom), personalized greeting
- **Storage**: Clean `nexus.*` namespaced keys in `chrome.storage.local`
- **Migration**: Automatic data migration from Quote Master v1.x on first load
- **New Logo**: Geometric "N" nexus mark in electric blue on dark navy
- **Removed**: Bulma CSS, FontAwesome, inspirational quotes, old tab navigation
- **Tech Stack**: React 18 + TypeScript + Tailwind CSS + Webpack 5

---

## v1.2.4 (2025-03-23)

- New Feature: contextMenu to allow users to add the currently viewed page to the task

## v1.2.0 (2025-03-22)

- New Feature: Add X.com Grok Chat Link
- Enhancement: A more powerful task manager

## v1.2.0 (2025-02-06)

- New Feature: Add Google Gemini Chat Link
- Update: Removed search engine func & Dashboard page

## v1.1.9 (2025-01-29)

- New Feature: Add DeepSeek Chat Link
- Enhancement: Add icon for each tabs

## v1.1.8 (2024-09-02)

- New Feature: Add My activity lists to Gitlab, as default tab

## v1.1.7 (2024-09-02)

- Enhancement: Set maximum height for Gitlab users/projects

## v1.1.6 (2024-09-01)

- Enhancement: Able to search by keyword in Gitlab users/projects

## v1.1.5 (2024-08-28)

- New Feature: Add Gitlab screen to show users/projects/issues

## v1.1.3 (2024-07-20)

- Released a new version for new logo

## v1.1.2 (2024-07-20)

- UI Adjusted: move the page title to the header
- bug fix: pinned bookmarks are not displayed in the dashboard

## v1.1.0 (2024-07-14)

- Able to display pinned bookmarks on Dashboard
- UI Update: new date formatter on Overview

## v1.0.8 (2024-07-10)

- UI Improvements: add toast for settings updates
- Adjust page layout on overview & tasks pages

## v1.0.7 (2024-07-08)

- Add more search engine (Google, AOL, Baidu, etc) to Quote Master

## v1.0.6 (2024-07-06)

- Adding new search engine on overview page (Google)
- New feature: Allow users to quickly search by keyword in Quote Master to open Google

## v1.0.5 (2024-07-05)

### New tasks manager board

- Update: remove gitlab board
- New feature: add new board for the tasks manager
- New feature: allow users to customize background image URL
- Bug fixing: bookmarks management
