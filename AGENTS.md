# figma-test — Agent Guide

2026 世界杯主题 H5 活动页。移动端优先（375px 视口），深色霓虹运动风，含竞猜、赛事、球星榜、点球小游戏等模块。

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`globals.css` + inline styles) |
| Animation | Framer Motion, CSS keyframes, canvas-confetti |
| Deploy | Static export → GitHub Pages (`gh-pages` branch) |

## Requirements

- **Node.js >= 20.9**（项目 `.nvmrc` 为 22）
- 启动前执行 `nvm use`

```bash
nvm use
npm install
npm run dev          # http://localhost:3000 → /worldcup
npm run build        # 输出到 out/
npm run lint
```

## Routing

| Path | File | Notes |
|------|------|-------|
| `/` | `src/app/page.tsx` | `redirect("/worldcup")` |
| `/worldcup` | `src/app/worldcup/page.tsx` | 主活动页（当前入口） |

## Directory Layout

```
src/
├── app/
│   ├── layout.tsx          # 根布局、metadata、viewport
│   ├── globals.css         # Tailwind v4 设计令牌与工具类
│   ├── page.tsx            # 首页重定向
│   └── worldcup/
│       ├── page.tsx        # ★ 当前线上使用的单文件页面
│       ├── lib/            # 活动页专用 data / motion
│       └── components/     # 模块化拆分（sections/ + ui/），供重构使用
│           ├── page.tsx    # 与 page.tsx 同结构的备用实现
│           ├── sections/   # Hero, MatchSection, PenaltyGame 等
│           └── ui/         # GlassCard, NeonButton, CountUp 等
└── lib/
    ├── data.ts             # 共享 Mock 数据与类型
    └── motion.ts           # Framer Motion 变体
```

**修改活动页时**：优先改 `src/app/worldcup/page.tsx`（当前实际渲染）。若做模块化重构，改用 `components/` 下的 section/ui 组件，并复用 `src/lib/data.ts` 与 `src/lib/motion.ts`。

## Static Export & basePath

`next.config.ts` 使用 `output: "export"`，**不支持**服务端 API、动态路由、`next/image` 优化。

| 环境 | `NEXT_PUBLIC_BASE_PATH` | 访问地址 |
|------|-------------------------|----------|
| 本地开发 | 未设置（空） | `http://localhost:3000/worldcup` |
| GitHub Pages CI | `/claudecode-figma-test` | `https://maybeqhl.github.io/claudecode-figma-test/` |

规则：

- 本地**不要**硬编码 `basePath`；由 CI 通过环境变量注入
- 链接与 `redirect()` 使用根路径（如 `/worldcup`），Next.js 会自动加 `basePath`
- 图片使用 `unoptimized: true` 或静态资源，避免依赖 Image Optimization API

## Design Tokens

色彩与动画定义在两处，修改时保持一致：

- `src/app/globals.css` — Tailwind `@theme`、`.glass`、`.flow-border` 等工具类
- `src/app/worldcup/page.tsx` 内联常量 `t`（green/blue/orange/gold/red）及 `<style>` 注入的 keyframes

主色参考：`#00FF87`（neon）、`#00D2FF`（cyan）、`#FFD700`（gold）、`#0A1F1A` / `#0B1026`（背景）。

## Coding Conventions

1. **Scope**：只改与任务相关的文件，不顺手重构无关模块
2. **Client vs Server**：交互、动画、`useState`/`useEffect` 放在 `"use client"` 组件；layout/metadata 保持 Server Component
3. **移动端**：主容器 `maxWidth: 375`，`overflow-x: hidden`；触控区域 ≥ 44px
4. **数据**：当前为 Mock 静态数据；新接口接入时优先扩展 `src/lib/data.ts` 的类型与导出
5. **动画**：尊重 `prefers-reduced-motion`（`globals.css` 已处理）；新动画优先 CSS keyframes，复杂交互用 Framer Motion
6. **中文**：用户可见文案、metadata 使用简体中文

## Deployment

推送到 `main` 触发 `.github/workflows/deploy.yml`：

1. `npm ci` + `NEXT_PUBLIC_BASE_PATH=/claudecode-figma-test npm run build`
2. `touch out/.nojekyll`
3. 发布 `out/` 到 `gh-pages` 分支

## Common Pitfalls

- 访问 `localhost:3000` 报 404 → 确认未在本地设置 `NEXT_PUBLIC_BASE_PATH`
- `next dev` 启动失败 → 检查 Node 版本（需 >= 20.9）
- 3000 端口占用 → `lsof -ti :3000 | xargs kill -9` 后重启
- 静态导出构建失败 → 检查是否引入了 `getServerSideProps`、动态 API 路由等不兼容特性
