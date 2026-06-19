/**
 * 模板字符串替换工具
 * 将 {{key}} 占位符替换为传入的变量值，便于翻译时自由调整占位符顺序
 */
export function tplStr(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}
