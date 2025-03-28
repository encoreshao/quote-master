# Quote Master: Browser Enhancement & Productivity Tool

**Quote Master** is a comprehensive browser extension designed to transform your new tab experience into a productivity hub. It combines task management, inspirational quotes, bookmark organization, and GitLab integration into a single, customizable interface.

## Features

### Core Functionality

- **Customizable Dashboard**: Personalize your new tab page with the features you use most
- **Beautiful UI**: Clean, modern interface with customizable background images
- **Tab-Based Navigation**: Easy access to all features through an intuitive tabbed interface

### Productivity Tools

- **Task Management**:

  - Create and organize tasks with due dates
  - Mark tasks as completed with a double-click
  - Visual indicators for task status (completed tasks are strikethrough)
  - Easily remove tasks when no longer needed

- **Inspirational Quotes**:
  - Display random inspirational quotes
  - Refresh to see new quotes with a single click
  - Sourced from a curated collection of motivational content

### Browser Integration

- **Bookmark Management**:

  - Access and search your browser bookmarks
  - Quick search functionality to find specific bookmarks
  - Organized display of your bookmark hierarchy
  - Add bookmarks directly from any webpage via context menu

- **Task Integration**:

  - Add tasks directly from any webpage via context menu
  - Capture webpage title and URL automatically

- **Quick Access**:
  - Direct links to Downloads and Extensions pages
  - Gmail integration for quick access to your inbox
  - Customizable links to frequently used websites

### GitLab Integration

- **Activity Tracking**: View your recent GitLab activity
- **Issue Management**: Access and track your assigned GitLab issues
- **Project Access**: Quick links to your contributed projects
- **Team Collaboration**: View and connect with team members

### AI Tools Integration

- **ChatBot Links**: Configurable quick access to AI assistants:
  - OpenAI (ChatGPT)
  - DeepSeek
  - Google Gemini
  - Grok

## Customization

Quote Master offers extensive customization options:

- **Personal Information**: Set your name and contact details
- **Background Image**: Customize the visual appearance with your preferred background
- **Feature Toggles**: Enable/disable specific features based on your needs
- **External Links**: Configure links to your GitHub, GitLab, BambooHR, and other services
- **Navigation Options**: Customize which navigation elements appear in the header

## Screenshots

- ![Quotes](https://raw.githubusercontent.com/encoreshao/quote-master/main/src/assets/images/quotes.png)

- ![Tasks Management](https://raw.githubusercontent.com/encoreshao/quote-master/main/src/assets/images/tasks-management.png)

- ![Bookmark Manager](https://raw.githubusercontent.com/encoreshao/quote-master/main/src/assets/images/bookmark-manager.png)

- ![Settings](https://raw.githubusercontent.com/encoreshao/quote-master/main/src/assets/images/settings.png)

## Technical Details

- Built with React and TypeScript
- Uses FontAwesome for icons
- Implements responsive design principles
- Chrome extension API integration for browser features

### Extension Architecture

- **Background Service Worker**: Manages context menus, handles bookmark operations, and processes tab events
- **Content Scripts**: Inject UI components into webpages for adding tasks and bookmarks
- **New Tab Override**: Replaces the default new tab page with the Quote Master dashboard
- **Context Menu Integration**: Right-click on any webpage to quickly add tasks or bookmarks
- **Chrome API Integration**: Utilizes bookmarks, storage, tabs, and notifications APIs

### User Experience Features

- **In-page Forms**: Clean, modal forms appear directly on the webpage when adding tasks or bookmarks
- **Smart Defaults**: Forms pre-populate with the current page title and URL
- **Folder Selection**: When adding bookmarks, choose from your existing bookmark folders
- **Priority Settings**: Set task priorities (low, medium, high) when adding from webpages
- **Notification System**: Unobtrusive notifications confirm successful actions

## Installation

Quote Master can be installed in a few different ways:

1. **Chrome Web Store**: _(Coming soon)_
2. **Manual Installation**:
   - Download or clone the repository
   - Build the extension using `npm run build`
   - Load the unpacked extension in Chrome from the `dist` directory
   - See [INSTALLATION.md](INSTALLATION.md) for detailed instructions

## Version History

Current version: 1.2.4

### Recent Updates

- **v1.2.4**: Added context menu integration for adding tasks from any webpage
- **v1.2.0**: Added X.com Grok Chat Link and enhanced task management capabilities
- **v1.2.0**: Added Google Gemini Chat Link and streamlined the interface
- **v1.1.9**: Added DeepSeek Chat Link and improved tab navigation with icons

See [CHANGELOG.md](CHANGELOG.md) for a complete history of changes.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/encoreshao/quote-master. This project is intended to be a safe, welcoming space for collaboration.

To see all contributors: https://github.com/encoreshao/quote-master/graphs/contributors

### Contributors

- [Encore Shao](https://github.com/encoreshao)

## License

Quote Master is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
