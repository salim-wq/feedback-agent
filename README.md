# Feedback Agent

An AI-powered feedback analyzer and auto-reply system built with Claude Code + Gmail MCP. Automatically reads user feedback submissions, analyzes sentiment and intent, and sends personalized replies via Gmail.

## How it works

1. User submits feedback via the HTML form
2. Submission is saved to `data/feedback-inbox.json` with `status: "pending"`
3. Run `/process-feedback` in Claude Code to process all pending entries
4. Claude analyzes each entry (sentiment, category, urgency) and sends a personalized Gmail reply
5. Entry is logged to `data/feedback-log.json` and marked `"replied"`

## Setup

### Requirements
- [Claude Code](https://claude.ai/code)
- Node.js (for the form server and Gmail MCP)
- A Google Cloud project with the Gmail API enabled

### Gmail MCP
Register the Gmail MCP server with Claude Code:
```bash
claude mcp add gmail -e GMAIL_CREDENTIALS_PATH="~/.claude/gmail-credentials.json" -- npx -y @modelcontextprotocol/server-gmail
```

Save your OAuth 2.0 Desktop App credentials to `~/.claude/gmail-credentials.json`. The first `/process-feedback` run will trigger a one-time browser authorization.

### Feedback form
```bash
node server.js
```
Opens at `http://localhost:3000`. Submissions are appended to `data/feedback-inbox.json` automatically.

## Usage

Add feedback entries to `data/feedback-inbox.json` (via the form or manually), then run in Claude Code:

```
/process-feedback
```

Claude will process all pending entries, send replies, and update the log.

## Project structure

```
├── CLAUDE.md                          ← Agent instructions
├── feedback-form.html                 ← Feedback form UI
├── server.js                          ← Local form server (port 3000)
├── .claude/commands/
│   └── process-feedback.md            ← /process-feedback slash command
├── skills/
│   ├── analyze-feedback.md            ← Sentiment & category detection
│   └── send-reply.md                  ← Email composition & send logic
├── templates/
│   ├── positive-reply.md
│   ├── negative-reply.md
│   ├── feature-request-reply.md
│   └── general-reply.md
└── data/
    ├── feedback-inbox.json            ← Incoming submissions
    └── feedback-log.json              ← Processed feedback log
```

## Feedback categories

| Category | Template used |
|---|---|
| Bug report | `negative-reply.md` |
| Complaint | `negative-reply.md` |
| Feature request | `feature-request-reply.md` |
| Compliment | `positive-reply.md` |
| Question | `general-reply.md` |
