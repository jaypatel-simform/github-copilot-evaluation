# GitHub Copilot Agent Hooks Configuration

This directory contains the security and logging configuration for GitHub Copilot agent hooks.

## Overview

The `security.json` file configures two main hooks for the GitHub Copilot coding agent:

1. **sessionStart Hook** - Logs when agent sessions begin
2. **preToolUse Hook** - Logs all tool executions before they are invoked

## Configuration File Structure

### security.json

The configuration file contains the following sections:

#### Hooks Configuration

- **sessionStart**: Records session initialization with timestamp, session ID, user, and environment details
- **preToolUse**: Logs tool invocations including tool name, arguments, and user context

#### Logging Configuration

- **enabled**: Master switch for all logging
- **logDirectory**: Directory where log files are stored (`.github/logs`)
- **maxLogSize**: Maximum size for log files before rotation
- **rotationPolicy**: How often to rotate logs (daily)
- **retentionDays**: How long to keep old log files

#### Security Configuration

- **auditEnabled**: Enable security auditing
- **sensitiveDataFiltering**: Automatically redact sensitive information
- **redactPatterns**: Patterns to redact from logs (passwords, API keys, tokens, etc.)

## Log Files

Logs are stored in the `.github/logs/` directory:

- **session.log**: Records agent session starts
- **tool-usage.log**: Records all tool executions
- **session.sample.log**: Sample session log (committed to repository)
- **tool-usage.sample.log**: Sample tool usage log (committed to repository)

### Log Format

Logs are written in **JSONL (JSON Lines)** format, also known as NDJSON (Newline Delimited JSON). Each line is a complete, valid JSON object representing a single log entry. This format is easy to parse line-by-line and append to without loading the entire file.

Example JSONL entry (one line per log event):
```json
{"timestamp":"2026-04-23T03:49:00.000Z","sessionId":"session-001","event":"sessionStart","user":"copilot-agent","environment":{"repository":"jaypatel-simform/github-copilot-evaluation","branch":"main","nodeVersion":"v18.0.0"},"metadata":{"hookVersion":"1.0.0","triggeredBy":"agent-initialization"}}
```

Each log entry includes:
- `timestamp`: ISO 8601 timestamp
- `sessionId`: Unique session identifier
- `event`: Event type (sessionStart or preToolUse)
- `user`: User or agent identifier
- Additional context specific to the event type

## Testing the Hooks

To test the hooks configuration:

1. **Verify the configuration file exists**:
   ```bash
   cat .github/hooks/security.json
   ```

2. **Check the log directory**:
   ```bash
   ls -la .github/logs/
   ```

3. **Review session logs**:
   ```bash
   cat .github/logs/session.log
   # Or view sample log
   cat .github/logs/session.sample.log
   ```

4. **Review tool usage logs**:
   ```bash
   cat .github/logs/tool-usage.log
   # Or view sample log
   cat .github/logs/tool-usage.sample.log
   ```

5. **Assign a task to Copilot Coding Agent** and observe the logs being updated

## Example Log Entries

### Session Start Log Entry (JSONL format - single line)

```json
{"timestamp":"2026-04-23T03:49:00.000Z","sessionId":"session-001","event":"sessionStart","user":"copilot-agent","environment":{"repository":"jaypatel-simform/github-copilot-evaluation","branch":"copilot/create-github-hooks-security-json","nodeVersion":"v18.0.0"},"metadata":{"hookVersion":"1.0.0","triggeredBy":"agent-initialization"}}
```

For readability, the same entry formatted:
```json
{
  "timestamp": "2026-04-23T03:49:00.000Z",
  "sessionId": "session-001",
  "event": "sessionStart",
  "user": "copilot-agent",
  "environment": {
    "repository": "jaypatel-simform/github-copilot-evaluation",
    "branch": "copilot/create-github-hooks-security-json",
    "nodeVersion": "v18.0.0"
  },
  "metadata": {
    "hookVersion": "1.0.0",
    "triggeredBy": "agent-initialization"
  }
}
```

### Tool Usage Log Entry (JSONL format - single line)

```json
{"timestamp":"2026-04-23T03:49:15.000Z","sessionId":"session-001","event":"preToolUse","toolName":"bash","toolArguments":{"command":"mkdir -p .github/hooks","description":"Create .github/hooks directory"},"user":"copilot-agent","allowed":true}
```

For readability, the same entry formatted:
```json
{
  "timestamp": "2026-04-23T03:49:15.000Z",
  "sessionId": "session-001",
  "event": "preToolUse",
  "toolName": "bash",
  "toolArguments": {
    "command": "mkdir -p .github/hooks",
    "description": "Create .github/hooks directory"
  },
  "user": "copilot-agent",
  "allowed": true
}
```

### Parsing JSONL Logs

Each line is a complete JSON object, so you can parse line-by-line:

```bash
# Read all entries
while IFS= read -r line; do
  echo "$line" | python3 -m json.tool
done < .github/logs/session.log

# Or using jq (if available)
cat .github/logs/tool-usage.log | jq '.'
```

## Allowed Tools

The following tools are whitelisted for use by the agent:

- bash
- view
- edit
- create
- grep
- glob
- task
- web_search
- github-mcp-server-* (all GitHub MCP server tools)

## Security Features

1. **Sensitive Data Redaction**: Automatically filters out passwords, API keys, secrets, tokens, and credentials
2. **Audit Trail**: Maintains a complete audit trail of all agent activities
3. **Tool Whitelisting**: Controls which tools the agent can use
4. **Session Tracking**: Tracks all agent sessions with unique identifiers

## Maintenance

- Review logs regularly for security auditing
- Rotate logs according to the configured policy
- Update the `allowedTools` list as needed
- Monitor log file sizes and adjust `maxLogSize` if necessary

## Version

Current configuration version: 1.0.0
Created: 2026-04-23

## Repository

jaypatel-simform/github-copilot-evaluation
