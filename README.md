# Nexus Tab — Your Daily Command Center

**Nexus Tab** is a Chrome extension that replaces your new tab with a modular, beautiful productivity dashboard. Glassmorphism cards in a bento grid layout, customizable widgets, and preset layouts to match your workflow.

## Features

### Modular Widget System

Every feature is a self-contained widget card. Toggle them on or off per layout, and customize each one independently.

| Widget | Description |
|--------|-------------|
| **Clock & Greeting** | Live time, date, and personalized greeting |
| **Search Bar** | Search the web or enter URLs directly |
| **Tasks** | Full task management with kanban board and list views |
| **Quick Links** | Customizable link grid with favicons — add/remove links |
| **Bookmarks** | Browse and search Chrome bookmarks with tree navigation |
| **Notes** | Persistent scratchpad for quick notes |
| **Pomodoro Timer** | Focus timer with work/break phases and circular progress |
| **Weather** | Current weather via OpenWeather API |
| **RSS Feeds** | Add feed URLs, auto-refresh articles |
| **GitLab Activity** | View issues, events, and projects *(coming soon)* |
| **GitHub Activity** | PRs, issues, contributions *(coming soon)* |
| **Custom Embed** | Embed any URL in an iframe *(coming soon)* |
| **Keyboard Shortcuts** | Quick launcher for power users *(coming soon)* |

### Three Preset Layouts

Switch between layouts with one click — each remembers its own widget selection.

- **Focus** — Minimal. Large clock, search bar, quick links and tasks. For a clean new tab.
- **Dashboard** — Full bento grid. All active widgets visible at a glance.
- **Workflow** — Split view. Tasks on the left, stacked widgets on the right. For deep work.

### Glassmorphism Design

- Frosted glass cards over your custom background image
- Dark overlay for readability
- Customizable accent color with preset options
- Inter font for clean typography
- Custom scrollbars and smooth transitions

### AI Assistant

- **Voice-style commands** — Open with a keyboard shortcut (e.g. Alt+Space) and type natural requests
- **Add or remove** — Add tasks, links, notes, RSS feeds; remove links, clear notes; switch layouts
- **Smart intent** — AI interprets "clean up notes" as clearing notes, not adding text
- **Optional confirmation** — Destructive actions (delete, clear) can require confirmation; add actions run immediately
- **Multi-provider** — OpenAI, Claude, or Gemini — bring your own API key

### Browser Integration

- **Context Menu** — Right-click on any page to add tasks or bookmarks
- **Content Scripts** — Modal forms appear on any webpage for quick capture
- **Chrome APIs** — Bookmarks, storage, tabs, and notifications

### Customization

- **Background Image** — Set any URL as your background
- **Accent Color** — Pick from presets or choose your own
- **Widget Toggles** — Enable/disable widgets per layout
- **Quick Links** — Add, remove, and reorder your favorite links
- **RSS Feeds** — Add any RSS/Atom feed URL with auto-refresh

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/encoreshao/quote-master.git
cd quote-master

# Install dependencies
npm install

# Build
npm run build

# Development (watch mode)
npm run watch
```

Then load as an unpacked extension:

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` directory

See [INSTALLATION.md](INSTALLATION.md) for detailed instructions.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Build | Webpack 5 |
| Target | Chrome Extension (Manifest v3) |
| Storage | `chrome.storage.local` |

### Architecture

- **Widget System** — Each widget is a self-contained React component with its own storage namespace (`nexus.widget.*`)
- **Layout Engine** — Three preset CSS grid layouts (Focus, Dashboard, Workflow)
- **Storage** — Clean `nexus.*` namespaced keys in `chrome.storage.local`
- **Migration** — Automatic data migration from Quote Master v1.x on first load
- **Background Worker** — Service worker for context menus and bookmark operations
- **Content Scripts** — Injected forms for adding tasks/bookmarks from any page

## Version History

Current version: **2.0.3**

### v2.0.3 — AI Assistant & UX
- **AI Assistant** — Natural-language commands to add/remove tasks, links, notes, RSS; switch layouts
- OpenAI, Claude, or Gemini support with your API key
- Add actions run immediately; destructive actions optionally require confirmation
- Widget icons in Settings; CpuChip icon for AI

### v2.0.0 — Nexus Tab (Complete Rebuild)
- Rebranded from Quote Master to Nexus Tab
- New glassmorphism + bento grid design system
- Replaced Bulma with Tailwind CSS
- Modular widget architecture (13 widgets)
- Three preset layouts (Focus, Dashboard, Workflow)
- Slide-out settings panel with widget toggles
- RSS Feed reader with auto-refresh
- Pomodoro focus timer
- Weather widget
- Notes/scratchpad widget
- Automatic migration from Quote Master data

### Previous Versions (Quote Master)
- **v1.2.4**: Context menu integration for tasks
- **v1.2.0**: Grok/Gemini chat links, enhanced task management
- **v1.1.9**: DeepSeek chat link, improved navigation

See [CHANGELOG.md](CHANGELOG.md) for full history.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/encoreshao/quote-master.

### Contributors

- [Encore Shao](https://github.com/encoreshao)

## License

Nexus Tab is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
