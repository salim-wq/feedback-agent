# /process-feedback — Run the Feedback Agent

When this command is triggered:

1. Read `data/feedback-inbox.json`
2. Find all entries where `status` is `"pending"`
3. If no pending entries exist, report "No pending feedback to process." and stop
4. For each pending feedback entry:
   a. Run the analyze-feedback skill (`skills/analyze-feedback.md`) on the entry
   b. Run the send-reply skill (`skills/send-reply.md`) using the entry + analysis result
5. Report a summary: how many emails were processed, replied, and any that failed
