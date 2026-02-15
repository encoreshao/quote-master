import manifest from "./../resources/manifest.json";

export const APP = {
  /** Short display name, e.g. "Nexus Tab" */
  shortName: manifest.short_name,
  /** Full name, e.g. "Nexus Tab: Your Daily Command Center" */
  name: manifest.name,
  /** Semver version, e.g. "2.0.1" */
  version: manifest.version,
  /** Author name */
  authorName: manifest.author.name,
  /** Author email */
  authorEmail: manifest.author.email,
  /** Homepage URL */
  homepageUrl: manifest.homepage_url,
  /** Description */
  description: manifest.description,
};

// Keep backward-compatible global for content scripts
export const NexusTab = APP;
Object.assign(window, { NexusTab: APP });
