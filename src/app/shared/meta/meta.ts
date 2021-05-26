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
  const itens = new Map<string, string>();
  if (description) {
    itens.set('og:description', description).set('twitter:description', description);
  }
  if (title) {
    itens.set('og:title', title).set('twitter:title', title);
  }
  if (site) {
    itens.set('og:site_name', site).set('twitter:site', site);
  }
  if (creator) {
    itens.set('twitter:creator', creator);
  }
  for (const [name, content] of Object.entries(optionsog)) {
    itens.set('og:' + name, content);
  }
  return itens;
}
