# HEARTBEAT.md -- Prospector Heartbeat Checklist

Run this checklist on every heartbeat.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`.

## 2. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress`
- Prioritize `in_progress` first, then `todo`.
- If `PAPERCLIP_TASK_ID` is set, prioritize that task.

## 3. Daily Prospecting Run

1. Call `POST https://shieldhome.pro/api/outreach/daily-run` with bearer token.
2. If response is `action: "skip"` -- comment "All niche+DMA combos in cooldown. Skipping today." and exit.
3. If response is `action: "proceed"` -- note the `nicheSlug`, `dmaId`, and `dmaName`.

## 4. Source Prospects

1. Use Instantly SuperSearch API to find businesses:
   - Filter by industry/category matching the niche
   - Filter by location matching the DMA
   - Filter by decision-maker title
   - Target 50-100 results with verified emails
2. Format results as prospect objects with all available fields.

## 5. Load Prospects

1. Call `POST https://shieldhome.pro/api/outreach/prospects` with the prospect array.
2. Record the response: `created` count and `skipped` count.

## 6. Report and Exit

1. Comment on your task with results:
   - Niche: {nicheName} | DMA: {dmaName}
   - Sourced: {total} | Created: {created} | Skipped: {skipped}
2. Mark task as done.
3. Exit cleanly.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- One niche, one DMA, one run per heartbeat. No exceptions.
- If any API call fails, log the error in your task comment and exit. Do not retry indefinitely.
