# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read this first

- Before changing prompt generation, media generation, or asset naming logic, read `web/docs/prompt-conventions.md`.
- For the end-to-end product flow and recommended workflow, read `web/docs/architecture.md` and `web/docs/tutorial.md`.
- There is an additional app-local instruction file at `web/AGENTS.md`. The key rule there is that this project uses a very new Next.js version; do not rely on older Next.js assumptions. Read the relevant guide in `web/node_modules/next/dist/docs/` before making framework-level changes.

## Repository layout

This repo is a two-service local system:

- `web/`: Next.js app for project management, prompt editing, the production studio UI, local file-backed state, and export.
- `ai-gateway/`: local Express service that uses Playwright/CDP against an already-open Chrome session and exposes standard REST endpoints for text generation, media generation, and TTS.

The normal development setup is running both services locally at the same time.

## Common commands

### Web app (`web/`)

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

### AI gateway (`ai-gateway/`)

```bash
npm install
npm run dev
npm run start
```

### Running both during development

In separate terminals:

```bash
cd ai-gateway && npm run dev
cd web && npm run dev
```

### Health check the gateway

```bash
curl http://localhost:4100/health
```

## Environment and runtime prerequisites

### Web app

`web/.env.example` defines the required runtime config:

- `WORKSPACE_PATH` is required. Project data is stored outside the repo in this external workspace directory.
- `AI_GATEWAY_URL` defaults to `http://localhost:4100` if unset.
- `MINIMAX_API_KEY` is still required by `web/src/app/api/generate-prompts/route.ts`, even though prompt generation is currently routed through the gateway.

### AI gateway

`ai-gateway/.env.example` defines the gateway runtime config:

- `CHROME_CDP_URL=http://127.0.0.1:9222`
- optional `PORT=4100`
- optional `API_SECRET`

### Browser prerequisites

The gateway assumes Chrome is already running with remote debugging enabled and the relevant sites are already open and logged in. See `ai-gateway/README.md` and the docs under `web/docs/` for the exact workflow.

This is not a fully headless system. Live browser state is part of the runtime dependency.

## High-level architecture

### Main user flow

The main app is a 4-phase production pipeline centered on a single project state object managed by `web/src/lib/ProjectContext.tsx`:

1. Writer room: generate or refine script material.
2. Casting room: create location anchors and character anchor images.
3. Storyboard panel: generate per-scene prompts, images, and videos.
4. Render room: generate voice, adjust timing, and export the final cut.

Primary routes:

- `web/src/app/page.tsx`: project list / entrypoint
- `web/src/app/studio/[projectId]/page.tsx`: per-project studio
- `web/src/app/prompt-studio/page.tsx`: prompt editing UI

Core UI modules:

- `web/src/components/WriterRoom.tsx`
- `web/src/components/CastingRoom.tsx`
- `web/src/components/StoryboardPanel.tsx`
- `web/src/components/RenderRoom.tsx`

### State and storage model

Project state is file-backed, not database-backed.

- `web/src/lib/db.ts` persists each project as a folder under `WORKSPACE_PATH`.
- Each project uses `project.json` plus asset folders such as `images/`, `videos/`, `audio/`, and `exports/`.
- The browser never reads workspace files directly; local assets are re-served through `web/src/app/api/serve/[...path]/route.ts`.

Keep in mind that code and generated assets are intentionally separated: repo code stays in Git, project content lives in the external workspace.

### API flow between services

The web app orchestrates the workflow and delegates generation to the gateway:

- `web/src/app/api/generate-prompts/route.ts` renders prompt templates and calls `ai-gateway /api/text/generate`
- `web/src/app/api/generate-assets/route.ts` calls `ai-gateway /api/media/generate`
- `web/src/app/api/generate-voice/route.ts` calls `ai-gateway /api/speech/generate`

Generated media is typically downloaded immediately into the local workspace and then served back via `/api/serve/...` so the UI and export pipeline use local files instead of temporary cloud URLs.

## Human-in-the-loop workflow is first-class

This codebase is not designed around full automation only.

The preferred workflow uses Studio plus a Chrome extension / inbox bridge:

- Studio sets the active generation context.
- Generation can run in `fireAndForget` mode.
- A human selects the best asset in Chrome.
- The extension pushes the selected asset back through the inbox endpoints.

Relevant endpoints:

- `web/src/app/api/extension/active-context/route.ts`
- `web/src/app/api/extension/inbox/route.ts`
- `web/src/app/api/extension/push-asset/route.ts`

When changing generation flows, avoid assuming the only valid path is synchronous server-side automation.

## Important invariants

### Prompt-token and naming rules are brittle

`web/docs/prompt-conventions.md` documents hard requirements that other parts of the system depend on. In particular:

- `{@场景}` must remain exactly `{@场景}` in image-related prompts.
- Character references use `{@角色名}` token syntax in image-related prompts.
- `videoPrompt` must not contain `{@...}` tokens.
- Asset naming conventions are fixed for location images, character images, scene start images, scene end images, and scene videos.

Do not “clean up” or rename these conventions casually. The extension workflow, prompt injection logic, and downstream asset matching depend on them.

### Gateway automation is intentionally serialized

`ai-gateway/src/middleware/serialQueue.ts` forces all browser automation requests through a single queue because they share one live Chrome session.

Do not design changes that assume safe parallel Playwright jobs against the same browser state unless you also change that architecture.

### Local-first asset persistence is intentional

The system tries to download generated assets into the workspace immediately and serve them locally afterwards. This avoids expiring cloud URLs and keeps playback/export stable.

If you touch asset generation or serving, preserve that local-first behavior.

## Platform assumptions and caveats

There are macOS-specific assumptions in the current codebase:

- `web/src/app/api/export/route.ts` uses `/System/Library/Fonts/PingFang.ttc` for subtitles.
- `web/src/lib/db.ts` currently deletes projects via `osascript` to move them to the macOS Trash.

Do not assume every path is cross-platform just because the stack is Node/Next.js.

## Files worth checking before major changes

- `web/src/lib/ProjectContext.tsx`: central state model and most workflow operations
- `web/src/lib/db.ts`: external workspace layout and persistence
- `web/src/app/api/generate-prompts/route.ts`: prompt rendering and text-generation orchestration
- `web/src/app/api/generate-assets/route.ts`: media-generation orchestration and asset download rules
- `web/src/app/api/export/route.ts`: final FFmpeg export pipeline
- `ai-gateway/src/server.ts`: gateway service entrypoint
- `ai-gateway/src/middleware/serialQueue.ts`: browser automation queueing model
- `ai-gateway/src/routes/*.ts`: REST surface area for text/media/speech generation

## Existing nested guidance

There is already a more app-specific handoff file at `web/CLAUDE.md`. Use the root file for repo-wide orientation and the nested file when working deeply inside the web app.