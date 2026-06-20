/** 面包屑单项：标签与可选链接（相对或绝对路径） */
interface Crumb {
  label: string;
  href?: string;
}

/** BreadcrumbList 结构化数据项 */
interface ListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

/**
 * 构造面包屑的 BreadcrumbList 结构化数据（JSON-LD）。
 *
 * 每个面包屑项对应一个 ListItem，position 按出现顺序递增。
 * - 有 href 的项：item 解析为基于站点根的绝对 URL
 * - 无 href 的末项（当前页）：item 使用当前页 URL，便于搜索引擎定位
 * - 无 href 的非末项：不输出 item 字段
 *
 * @param items 面包屑项列表
 * @param site 站点根 URL（Astro.site）
 * @param currentUrl 当前页 URL（Astro.url）
 */
export function buildBreadcrumbJsonLd(
  items: Crumb[],
  site: URL,
  currentUrl: URL,
): {
  "@context": string;
  "@type": "BreadcrumbList";
  itemListElement: ListItem[];
} {
  const lastIndex = items.length - 1;

  const itemListElement: ListItem[] = items.map((crumb, index) => {
    const listItem: ListItem = {
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
    };

    if (crumb.href) {
      listItem.item = new URL(crumb.href, site).href;
    } else if (index === lastIndex) {
      // 末项无显式链接时回退到当前页 URL
      listItem.item = currentUrl.href;
    }

    return listItem;
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}
