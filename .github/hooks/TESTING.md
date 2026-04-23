# Testing GitHub Copilot Agent Hooks

This guide explains how to test the GitHub Copilot agent hooks configuration.

## Automated Testing

Run the automated test script to validate the configuration:

```bash
bash .github/hooks/test-hooks.sh
```

This script will:
- ✓ Verify security.json exists
- ✓ Validate JSON syntax
- ✓ Check logs directory exists
- ✓ Verify example log files
- ✓ Display hook configuration summary
- ✓ Show sample log entries

## Manual Testing

### 1. Verify Configuration File

```bash
# Display the security.json file
cat .github/hooks/security.json

# Validate JSON syntax
python3 -m json.tool .github/hooks/security.json
```

### 2. Check Log Files

```bash
# List log directory contents
ls -la .github/logs/

# View sample session log (JSONL format)
cat .github/logs/session.sample.log

# View sample tool usage log (JSONL format)
cat .github/logs/tool-usage.sample.log

# View actual logs if they exist
cat .github/logs/session.log 2>/dev/null || echo "No active session log yet"
cat .github/logs/tool-usage.log 2>/dev/null || echo "No active tool usage log yet"
```

### 3. Test with Copilot Coding Agent

To test the hooks in action:

1. **Assign a task to GitHub Copilot Coding Agent**
   - Create a new issue or task in the repository
   - Assign it to the Copilot agent
   - Let the agent perform some actions

2. **Monitor the logs**
   ```bash
   # Watch session log in real-time
   tail -f .github/logs/session.log
   
   # Watch tool usage log in real-time
   tail -f .github/logs/tool-usage.log
   ```

3. **Review the captured data**
   - Session starts should be logged in session.log
   - All tool executions should be logged in tool-usage.log
   - Sensitive data should be redacted according to security patterns

### 4. Parse and Analyze Logs

JSONL (JSON Lines) logs can be parsed line-by-line:

```bash
# Count session starts
grep -c '"event":"sessionStart"' .github/logs/session.log

# Count tool executions
grep -c '"event":"preToolUse"' .github/logs/tool-usage.log

# List all tools used
grep -o '"toolName":"[^"]*"' .github/logs/tool-usage.log | sort | uniq

# Pretty-print each log entry
while IFS= read -r line; do
  echo "$line" | python3 -m json.tool
  echo "---"
done < .github/logs/session.sample.log

# Using jq (if available) for advanced queries
cat .github/logs/tool-usage.sample.log | jq '.toolName'
```

## Expected Behavior

### sessionStart Hook

When a Copilot agent session starts, a log entry should be created with:
- Timestamp (ISO 8601 format)
- Unique session ID
- User/agent identifier
- Environment details (repository, branch, etc.)
- Metadata about the hook

### preToolUse Hook

Before each tool execution, a log entry should be created with:
- Timestamp (ISO 8601 format)
- Session ID (matching the current session)
- Tool name being invoked
- Tool arguments (with sensitive data redacted)
- Whether the tool was allowed or denied
- User/agent identifier

## Security Validation

### Test Sensitive Data Redaction

Create a test scenario that would normally log sensitive data:

1. The hooks should automatically redact patterns matching:
   - password
   - api_key
   - secret
   - token
   - credential

2. Verify redacted entries show `[REDACTED]` instead of actual values

### Test Tool Whitelisting

The configuration allows these tools:
- bash
- view
- edit
- create
- grep
- glob
- task
- web_search
- github-mcp-server-*

Any tool not in this list should be denied (if enforcement is active).

## Troubleshooting

### Logs Not Being Created

- Check if the `.github/logs/` directory exists
- Verify write permissions on the logs directory
- Ensure the hooks are properly configured in security.json

### Invalid JSON Errors

```bash
# Validate and show any JSON errors
python3 -m json.tool .github/hooks/security.json
```

### Log Files Too Large

- Check the `maxLogSize` setting in security.json
- Implement log rotation as configured in the `rotationPolicy`
- Review and clean up old log files based on `retentionDays`

## Example Test Session

```bash
# 1. Clean existing logs (optional, for fresh test)
> .github/logs/session.log
> .github/logs/tool-usage.log

# 2. Trigger a Copilot agent task
# (Assign a task to the agent through GitHub UI or API)

# 3. Wait for agent to start and perform actions

# 4. Verify logs were created
cat .github/logs/session.log
cat .github/logs/tool-usage.log

# 5. Count entries
echo "Session starts: $(grep -c sessionStart .github/logs/session.log)"
echo "Tool uses: $(grep -c preToolUse .github/logs/tool-usage.log)"
```

## Success Criteria

The hooks are working correctly if:

- ✓ security.json is valid JSON
- ✓ sessionStart hook logs when agent sessions begin
- ✓ preToolUse hook logs all tool executions
- ✓ Sensitive data is properly redacted
- ✓ Log files are in JSONL (JSON Lines) format - one JSON object per line
- ✓ Timestamps are in ISO 8601 format
- ✓ Session IDs are unique and consistent
- ✓ Tool arguments are captured (with redaction)
- ✓ Logs are stored in the configured directory

## Next Steps

After successful testing:

1. Monitor logs regularly for security auditing
2. Adjust hook configuration as needed
3. Update allowed tools list based on requirements
4. Implement log rotation and cleanup procedures
5. Integrate log analysis into CI/CD pipelines
