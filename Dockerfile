# syntax=docker/dockerfile:1.7
# 星罗（Xingluo）Dockerfile
# 构建期：Node 22 安装依赖并产出静态站点；运行期：nginx:alpine 托管 dist/

# ===== 阶段 1：依赖安装 =====
# 单独分层以利用 Docker 缓存，依赖未变时跳过安装
FROM node:22-alpine AS deps
WORKDIR /app

# 启用 corepack 以使用项目锁定的 pnpm
RUN corepack enable

# 仅复制清单文件，最大化利用层缓存
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 以生产意向安装（保留 devDependencies，构建期需要 astro/check/pagefind 等）
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ===== 阶段 2：构建静态站点 =====
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

# 复制已安装的 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 构建参数：允许 CI 注入站点 URL 与子路径
# 不传则使用 xingluo.config.ts 默认值
ARG CI_SITE_URL=""
ARG CI_BASE_URL=""
ENV CI_SITE_URL=${CI_SITE_URL}
ENV CI_BASE_URL=${CI_BASE_URL}
ENV PUBLIC_GOOGLE_SITE_VERIFICATION=${PUBLIC_GOOGLE_SITE_VERIFICATION}

# 执行完整构建：astro check + astro build + pagefind 索引 + 孤儿资源清理
RUN pnpm run build

# ===== 阶段 3：运行时 nginx =====
FROM nginx:alpine AS runtime

# 安装 tini 作为 1 号进程，正确处理信号与僵尸进程
RUN apk add --no-cache tini

# 移除默认配置与无用的默认静态文件
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# 注入星罗专用 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 运行于 80 端口
EXPOSE 80

# 健康检查：根路径返回 200
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1

# 以 tini 启动 nginx 前台运行
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["nginx", "-g", "daemon off;"]
