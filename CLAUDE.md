# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Automatically analyze user feedback form submissions and send personalized Gmail replies. The agent reads pending feedback from `data/feedback-inbox.json`, analyzes sentiment/category/urgency, composes a personalized reply using the appropriate template, sends it via Gmail MCP, and logs the result.

## Required MCP Server

This project requires the Gmail MCP server. Configure it in `%APPDATA%\Claude\mcp_settings.json`:

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gmail"],
      "env": {
        "GMAIL_CREDENTIALS_PATH": "~/.claude/gmail-credentials.json"
      }
    }
  }
}
```

Gmail OAuth credentials must be saved at `~/.claude/gmail-credentials.json` (Google Cloud project with Gmail API enabled, OAuth 2.0 Desktop App credentials).

## Agent Workflow

Triggered via `/process-feedback` command or manually:

1. Read `data/feedback-inbox.json` → find entries with `status: "pending"`
2. For each: run `skills/analyze-feedback.md` to get `{sentiment, category, urgency, key_points}`
3. Select template from `templates/` based on category
4. Personalize and send via Gmail MCP (subject: `Re: Your Feedback — [Category]`)
5. Append result to `data/feedback-log.json`
6. Update entry in `feedback-inbox.json` from `"pending"` to `"replied"`

## Analysis Rules

**Sentiment:** positive (praise/thanks/great) | negative (bug/broken/angry) | neutral (question/suggestion)

**Categories → Templates:**
- `compliment` → `templates/positive-reply.md`
- `bug_report` → `templates/negative-reply.md`
- `complaint` → `templates/negative-reply.md`
- `feature_request` → `templates/feature-request-reply.md`
- `question` → `templates/general-reply.md`

**Urgency:** HIGH (urgent/broken/can't use/lost data) | MEDIUM (issue/not working) | LOW (suggestion/question)

## Behavioral Rules

- Always analyze sentiment before composing a reply
- Never send a reply without logging it to `feedback-log.json`
- Always address the user by name from the form
- Every reply must reference the specific feedback content — never be generic
- If urgency is HIGH, flag the entry with `"urgent": true` in the log

## Feedback Entry Schema

```json
{
  "id": "fb_001",
  "timestamp": "2026-02-23T10:30:00Z",
  "name": "John Smith",
  "email": "john@example.com",
  "subject": "Issue with login",
  "rating": 2,
  "message": "I cannot log in after the latest update...",
  "status": "pending"
}
```

## Project Structure

```
feedback-agent/
├── CLAUDE.md
├── .claude/commands/process-feedback.md   ← /process-feedback slash command
├── skills/
│   ├── analyze-feedback.md               ← Sentiment & category analysis
│   └── send-reply.md                     ← Gmail reply composition
├── data/
│   ├── feedback-inbox.json               ← Incoming submissions (read/write)
│   └── feedback-log.json                 ← Processed feedback log (append-only)
└── templates/
    ├── positive-reply.md
    ├── negative-reply.md
    ├── feature-request-reply.md
    └── general-reply.md
```
