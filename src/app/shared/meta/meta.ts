export interface MetaOptions {
  description?: string;
  type?: string;
  title?: string;
  image?: string;
  url?: string;
  site?: string;
  creator?: string;
}

export function createMeta({ description, title, site, creator, ...optionsog }: MetaOptions): Map<string, string> {
  const items = new Map<string, string>();
  if (description) {
    items.set('og:description', description).set('twitter:description', description);
  }
  if (title) {
    items.set('og:title', title).set('twitter:title', title);
  }
  if (site) {
    items.set('og:site_name', site).set('twitter:site', site);
  }
  if (creator) {
    items.set('twitter:creator', creator);
  }
  for (const [name, content] of Object.entries(optionsog)) {
    items.set('og:' + name, content);
  }
  return items;
}
