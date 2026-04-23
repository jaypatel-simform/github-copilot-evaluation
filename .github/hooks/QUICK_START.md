# Quick Start Guide - GitHub Copilot Agent Hooks

## ✅ What's Been Implemented

This repository now has GitHub Copilot agent hooks configured for security logging.

## 📁 Files Created

```
.github/
├── hooks/
│   ├── security.json       # Main configuration file
│   ├── README.md           # Comprehensive documentation
│   ├── TESTING.md          # Testing guide
│   ├── test-hooks.sh       # Automated test script
│   └── QUICK_START.md      # This file
└── logs/
    ├── session.log         # Session start logs (JSONL format)
    ├── tool-usage.log      # Tool execution logs (JSONL format)
    ├── session.sample.log  # Sample session log (committed)
    ├── tool-usage.sample.log # Sample tool usage log (committed)
    └── .gitignore          # Log management
```

## 🚀 Quick Commands

### Validate Configuration
```bash
bash .github/hooks/test-hooks.sh
```

### View Logs
```bash
# Sample session logs (JSONL format)
cat .github/logs/session.sample.log

# Sample tool usage logs (JSONL format)
cat .github/logs/tool-usage.sample.log

# Actual logs (if they exist)
cat .github/logs/session.log 2>/dev/null || echo "No active logs yet"
cat .github/logs/tool-usage.log 2>/dev/null || echo "No active logs yet"
```

### Monitor in Real-Time
```bash
# Watch session logs
tail -f .github/logs/session.log

# Watch tool usage logs
tail -f .github/logs/tool-usage.log
```

### Analyze Logs
```bash
# Count session starts (JSONL format)
grep -c "sessionStart" .github/logs/session.log 2>/dev/null || echo "0"

# Count tool executions (JSONL format)
grep -c "preToolUse" .github/logs/tool-usage.log 2>/dev/null || echo "0"

# List all tools used
grep -o '"toolName":"[^"]*"' .github/logs/tool-usage.log 2>/dev/null | sort | uniq

# Pretty-print a log entry
head -n 1 .github/logs/session.sample.log | python3 -m json.tool
```

## 🔧 Configuration Overview

### sessionStart Hook
- **Purpose**: Logs when agent sessions begin
- **Log File**: `.github/logs/session.log`
- **Log Format**: JSONL (JSON Lines) - one JSON object per line
- **Captures**: timestamp, sessionId, user, environment

### preToolUse Hook
- **Purpose**: Logs all tool executions
- **Log File**: `.github/logs/tool-usage.log`
- **Log Format**: JSONL (JSON Lines) - one JSON object per line
- **Captures**: timestamp, toolName, toolArguments, sessionId, user
- **Allowed Tools**: bash, view, edit, create, grep, glob, task, web_search, github-mcp-server-*

## 🔒 Security Features

1. ✅ Sensitive data redaction (passwords, API keys, secrets, tokens)
2. ✅ Tool whitelisting
3. ✅ Complete audit trail
4. ✅ JSONL (JSON Lines) format for easy line-by-line parsing
5. ✅ Session tracking

## 📊 Testing

The implementation has been tested and validated:

```bash
$ bash .github/hooks/test-hooks.sh

=== Testing GitHub Copilot Agent Hooks Configuration ===

✓ security.json exists
✓ security.json is valid JSON
✓ logs directory exists
✓ session.sample.log exists
✓ tool-usage.sample.log exists

=== All Tests Passed ✓ ===
```

## 📚 Documentation

- **Complete Guide**: See `.github/hooks/README.md`
- **Testing Guide**: See `.github/hooks/TESTING.md`
- **Configuration**: See `.github/hooks/security.json`

## 🎯 Next Steps

1. **Review the PR**: Check PR #3 for all changes
2. **Test with Agent**: Assign a task to Copilot and monitor logs
3. **Customize**: Adjust `allowedTools` and security settings as needed
4. **Monitor**: Set up regular log review and rotation

## 🔗 Links

- PR: https://github.com/jaypatel-simform/github-copilot-evaluation/pull/3
- GitHub Copilot Agent Hooks Docs: https://docs.github.com/en/copilot/github-copilot-workspaces

## ℹ️ Version

- Configuration Version: 1.0.0
- Created: 2026-04-23
- Repository: jaypatel-simform/github-copilot-evaluation
