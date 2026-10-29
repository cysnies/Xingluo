import config from "@/config";

/** 当前语言下的站点标题（titleByLocale 优先） */
export function getSiteTitle(locale?: string): string {
  const lang = locale ?? config.site.lang;
  return config.site.titleByLocale?.[lang] ?? config.site.title;
}

/** 当前语言下的站点描述 */
export function getSiteDescription(locale?: string): string {
  const lang = locale ?? config.site.lang;
  return config.site.descriptionByLocale?.[lang] ?? config.site.description;
}
