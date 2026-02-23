# Skill: Send Feedback Reply

## Purpose
Compose and send a personalized reply email via Gmail MCP, then log the result.

## Input
- Original feedback object (from `data/feedback-inbox.json`)
- Analysis result: `{sentiment, category, urgency, key_points}`

## Steps

1. Select the correct template based on `category`:
   - `compliment` → `templates/positive-reply.md`
   - `bug_report` → `templates/negative-reply.md`
   - `complaint` → `templates/negative-reply.md`
   - `feature_request` → `templates/feature-request-reply.md`
   - `question` → `templates/general-reply.md`

2. Personalize the template:
   - Replace `[NAME]` with the user's name from the feedback entry
   - Reference their specific subject or topic
   - Incorporate the `key_points` from the analysis into the response
   - If `urgency` is `high`, open with a priority acknowledgment line

3. Send via Gmail MCP:
   - **To:** user's email from the feedback entry
   - **Subject:** `Re: Your Feedback — [Category]` (use title-case category, e.g. "Bug Report")
   - **Body:** the personalized reply

4. Append to `data/feedback-log.json`:
   ```json
   {
     "id": "<feedback id>",
     "timestamp_processed": "<ISO timestamp>",
     "name": "<user name>",
     "email": "<user email>",
     "category": "<category>",
     "sentiment": "<sentiment>",
     "urgency": "<urgency>",
     "key_points": ["..."],
     "reply_sent": true,
     "urgent": <true if urgency is high, else false>
   }
   ```

5. Update the entry in `data/feedback-inbox.json`: set `status` from `"pending"` to `"replied"`
