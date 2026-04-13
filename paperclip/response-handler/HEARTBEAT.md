# HEARTBEAT.md -- Response Handler Heartbeat Checklist

Run this checklist on every heartbeat.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`.

## 2. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress`
- Prioritize `in_progress` first, then `todo`.

## 3. Check for Unprocessed Replies

1. `GET https://shieldhome.pro/api/outreach/prospects?status=REPLIED&limit=50`
2. For each replied prospect:
   - Check `replyLabel` -- is it `interested`, `not_interested`, `wrong_person`, `out_of_office`?
   - If `interested` and no `convertedLeadId` -- the auto-conversion may have failed. Create an issue to manually convert.
   - If `wrong_person` -- note the referral and create a re-prospecting issue.
   - If `not_interested` -- ensure they're on the suppression list.

## 4. Check for Interested Prospects Without CRM Leads

1. `GET https://shieldhome.pro/api/outreach/prospects?status=INTERESTED&limit=50`
2. For each: verify `convertedLeadId` is set. If not, flag for manual conversion.

## 5. Hot Lead Escalation

- For any newly converted leads with high buying signals, create an urgent issue:
  - Title: "HOT LEAD: {businessName} ({nicheSlug}) -- {what they want}"
  - Priority: Critical
  - Assign to CEO for routing

## 6. Weekly Report (Mondays only)

If today is Monday:
1. Pull campaign analytics from `GET https://shieldhome.pro/api/outreach/campaigns`
2. Compile: emails sent, open/click/reply rates by niche, conversions, top performers
3. Create an issue with the weekly report for the CEO

## 7. Exit

- Comment on any in_progress work before exiting.
- Exit cleanly.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Speed is critical for interested replies -- process within minutes.
- Never skip the suppression list check for negative replies.
