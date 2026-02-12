# Nexus Tab — Installation Guide

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (included with Node.js)
- Google Chrome browser

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Webpack 5
- Chrome Extension Manifest v3

## Build from Source

### 1. Clone the repository

```bash
git clone https://github.com/encoreshao/quote-master.git
cd quote-master
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

This creates a `dist/` directory with the compiled extension.

For development with auto-rebuild on file changes:

```bash
npm run watch
```

### 4. Load the extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** using the toggle in the top-right corner
3. Click **Load unpacked**
4. Select the `dist/` directory from the project

### 5. Verify

Open a new tab — you should see the Nexus Tab dashboard with the glassmorphism interface.

## Project Structure

```
src/
├── index.tsx                  # React entry point
├── App.tsx                    # Main app with layout engine
├── assets/
│   ├── icons/                 # Extension icons (16, 32, 48, 128)
│   └── styles/index.css       # Tailwind CSS + glassmorphism components
├── background/                # Service worker (context menus, bookmarks)
├── content_scripts/           # Injected scripts (add task/bookmark from any page)
├── components/
│   ├── layouts/               # FocusLayout, DashboardLayout, WorkflowLayout
│   ├── widgets/               # All widget components
│   ├── LayoutSwitcher.tsx     # Layout toggle (top-right)
│   └── SettingsPanel.tsx      # Slide-out settings (top-left)
├── types/index.ts             # TypeScript type definitions
├── utils/
│   ├── storage.ts             # nexus.* storage system + migration
│   ├── index.ts               # GitLab API utilities
│   └── common.ts              # Extension metadata
└── resources/manifest.json    # Chrome extension manifest
```

## Updating

When updating to v2.0.0 from Quote Master v1.x:

- Your existing tasks, bookmarks, and settings will be **automatically migrated** on first load
- Old data is mapped to the new `nexus.*` storage namespace
- Quote-related data is dropped (no longer needed)

## Troubleshooting

### Extension not loading
- Make sure you selected the `dist/` directory (not the project root)
- Check that Developer mode is enabled
- Look for errors in `chrome://extensions/`

### New tab not showing
- Check if another extension is overriding the new tab
- Disable other new-tab extensions temporarily

### Build errors
- Delete `node_modules/` and run `npm install` again
- Make sure you're using Node.js v18+
