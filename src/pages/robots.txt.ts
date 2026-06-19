import config from "@/config";

/** 生成 robots.txt，允许全部爬虫并指向 sitemap */
export function GET() {
  const site = config.site.url.replace(/\/+$/, "");
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
