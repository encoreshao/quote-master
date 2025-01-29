import manifest from "./../resources/manifest.json";

export const QuoteMaster = {
  name: manifest.name,
  version: manifest.version,
  authorName: manifest.author.name,
  authorEmail: manifest.author.email,
  homepageURL: manifest.homepage_url,
};

Object.assign(window, { QuoteMaster });
