# HEARTBEAT.md -- Campaign Manager Heartbeat Checklist

Run this checklist on every heartbeat.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`.

## 2. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress`
- Prioritize `in_progress` first, then `todo`.

## 3. Process Queued Prospects

1. `GET https://shieldhome.pro/api/outreach/prospects?status=QUEUED&limit=100`
2. If zero results -- no new prospects to process. Skip to step 5.
3. Group prospects by `nicheSlug` + `dmaId`.
4. For each group:
   a. Check for existing active campaign for this niche+DMA
   b. Create new campaign if needed (in both our DB and Instantly)
   c. Set up email sequence from niche templates
   d. Upload prospects to Instantly with custom variables
   e. Activate campaign
   f. Update prospect statuses

## 4. Report Campaign Creation

Comment on task:
- Campaign: {name} | Niche: {nicheName} | DMA: {dmaName}
- Prospects loaded: {count}
- Campaign status: Active
- Instantly campaign ID: {id}

## 5. Monitor Active Campaigns

1. `GET https://shieldhome.pro/api/outreach/campaigns?status=ACTIVE`
2. For each active campaign:
   - Check Instantly analytics: open rate, bounce rate, reply rate
   - If bounce rate > 5%: PAUSE campaign, report issue
   - If open rate < 5% after 200 sends: PAUSE campaign, report issue
3. Log any actions taken.

## 6. Exit

- Comment on any in_progress work before exiting.
- Exit cleanly.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Never modify email templates -- they are defined in code.
- Never exceed sending limits.
