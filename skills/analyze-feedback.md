# Skill: Analyze Feedback

## Purpose
Read a single feedback entry and return a structured analysis.

## Input
A single feedback object from `data/feedback-inbox.json`

## Steps

1. Read the `message` and `subject` fields
2. Determine **sentiment**:
   - `positive`: praise, thanks, love, great, excellent, amazing, helpful
   - `negative`: problem, bug, broken, angry, frustrated, terrible, can't, lost
   - `neutral`: question, suggestion, how to, wondering, curious
3. Determine **category**:
   - `bug_report`: broken, error, crash, not working, issue, bug
   - `feature_request`: would be nice, please add, suggestion, could you, wish
   - `compliment`: love, great, excellent, thank you, amazing, fantastic
   - `complaint`: disappointed, unhappy, frustrated, terrible, unacceptable
   - `question`: how do I, can I, what is, does it, is there
4. Determine **urgency**:
   - `high`: urgent, broken, can't use, lost data, immediately, critical, down
   - `medium`: issue, not working, problem, slow, incorrect
   - `low`: suggestion, would be nice, question, wondering
5. Extract 2–3 key points summarizing the core of the message

## Output

Return a JSON object:
```json
{
  "sentiment": "negative",
  "category": "bug_report",
  "urgency": "high",
  "key_points": ["login broken after update", "happening since yesterday", "affects all users"]
}
```
