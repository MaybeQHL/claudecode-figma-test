# figma-test — Agent Guide

2026 世界杯主题 H5 活动页。移动端优先（375px 视口），深色霓虹运动风，含竞猜、赛事、球星榜、点球小游戏等模块。

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`globals.css`) |
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
| `/worldcup` | `src/app/worldcup/page.tsx` | Server Component，渲染 `WorldCupClient` |

## Directory Layout

```
src/app/worldcup/
├── page.tsx              # Server Component 入口（~5 行）
├── WorldCupClient.tsx    # Client 壳：modal 状态 + section 组装
├── lib/
│   ├── data.ts           # Mock 数据与类型（唯一数据源）
│   ├── motion.ts         # Framer Motion 变体
│   └── types.ts          # 共享类型（ModalType 等）
└── _components/          # 私有目录，不生成路由
    ├── sections/         # TopBar, Hero, MatchSection, PenaltyGame 等
    ├── ui/               # GlassCard, NeonButton, CountUp 等
    └── modals/           # BetModal, RulesModal, PrizesModal, ModalShell
```

**修改活动页时**：在 `_components/sections/` 或 `_components/modals/` 中改对应模块；页面组装逻辑在 `WorldCupClient.tsx`；数据统一维护在 `lib/data.ts`。

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

色彩与动画定义在 [`src/app/globals.css`](src/app/globals.css)：

- `@theme` 颜色令牌：`neon`、`cyan`、`gold`、`flame` 等
- 工具类：`.glass`、`.flow-border`、`.grad-text-gold`、`.text-glow-neon` 等
- 动画：`animate-breathe`、`animate-modal-in`、`animate-check-pop` 等

主色参考：`#00FF87`（neon）、`#00D2FF`（cyan）、`#FFD700`（gold）、`#0A1F1A` / `#0B1026`（背景）。

## Coding Conventions

1. **Scope**：只改与任务相关的文件，不顺手重构无关模块
2. **Client vs Server**：交互、动画、`useState`/`useEffect` 放在 `"use client"` 组件；`page.tsx` 保持 Server Component
3. **移动端**：主容器 `max-w-[375px]`，`overflow-x: hidden`；触控区域 ≥ 44px
4. **数据**：Mock 数据统一在 `lib/data.ts`；新接口接入时扩展该文件的类型与导出
5. **动画**：尊重 `prefers-reduced-motion`（`globals.css` 已处理）；新动画优先 CSS keyframes，复杂交互用 Framer Motion
6. **中文**：用户可见文案、metadata 使用简体中文
7. **组件目录**：业务组件放 `_components/`（下划线前缀），避免被 App Router 当成路由

## Deployment

推送到 `main` 触发 `.github/workflows/deploy.yml`：

1. `npm ci` + `npm run lint`
2. `NEXT_PUBLIC_BASE_PATH=/claudecode-figma-test npm run build`
3. `touch out/.nojekyll`
4. 发布 `out/` 到 `gh-pages` 分支

## Common Pitfalls

- 访问 `localhost:3000` 报 404 → 确认未在本地设置 `NEXT_PUBLIC_BASE_PATH`
- `next dev` 启动失败 → 检查 Node 版本（需 >= 20.9）
- 3000 端口占用 → `lsof -ti :3000 | xargs kill -9` 后重启
- 静态导出构建失败 → 检查是否引入了不兼容的服务端特性
- 在 `app/` 下新建 `components/page.tsx` 会意外生成路由 → 使用 `_components/` 目录
