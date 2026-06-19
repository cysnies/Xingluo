/**
 * 社交/分享图标按名称解析
 *
 * 通过 import.meta.glob 静态收集 src/assets/icons/socials 下的全部图标组件，
 * 配置中只需给出图标名称即可匹配，无需手动维护映射表
 */

/** 图标组件的渲染类型（.astro 默认导出） */
type IconComponent = (props: Record<string, unknown>) => unknown;

const modules = import.meta.glob<{ default: IconComponent }>(
  "../assets/icons/socials/*.astro",
  { eager: true },
);

/** 按图标名称索引的组件表 */
const iconMap: Record<string, IconComponent> = {};
for (const [path, mod] of Object.entries(modules)) {
  const name = path
    .split("/")
    .pop()!
    .replace(/\.astro$/, "");
  iconMap[name] = mod.default;
}

/** 根据名称获取社交图标组件，不存在时返回 undefined */
export function getSocialIcon(name: string): IconComponent | undefined {
  return iconMap[name];
}

/** 将名称首字母大写，用于自动生成的链接标题 */
export function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
