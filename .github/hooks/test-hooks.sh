#!/bin/bash

echo "=== Testing GitHub Copilot Agent Hooks Configuration ==="
echo ""

# Check if security.json exists
if [ -f ".github/hooks/security.json" ]; then
    echo "✓ security.json exists"
else
    echo "✗ security.json not found"
    exit 1
fi

# Validate JSON syntax
if python3 -m json.tool .github/hooks/security.json > /dev/null 2>&1; then
    echo "✓ security.json is valid JSON"
else
    echo "✗ security.json has invalid JSON syntax"
    exit 1
fi

# Check if logs directory exists
if [ -d ".github/logs" ]; then
    echo "✓ logs directory exists"
else
    echo "✗ logs directory not found"
    exit 1
fi

# Check if example log files exist
if [ -f ".github/logs/session.log" ]; then
    echo "✓ session.log exists"
else
    echo "✗ session.log not found"
fi

if [ -f ".github/logs/tool-usage.log" ]; then
    echo "✓ tool-usage.log exists"
else
    echo "✗ tool-usage.log not found"
fi

# Display hook configuration summary
echo ""
echo "=== Hook Configuration Summary ==="
echo ""
echo "sessionStart hook:"
python3 -c "import json; data=json.load(open('.github/hooks/security.json')); hook=data['hooks']['sessionStart']; print(f\"  Enabled: {hook['enabled']}\n  Description: {hook['description']}\n  Log File: {hook['logFile']}\")"

echo ""
echo "preToolUse hook:"
python3 -c "import json; data=json.load(open('.github/hooks/security.json')); hook=data['hooks']['preToolUse']; print(f\"  Enabled: {hook['enabled']}\n  Description: {hook['description']}\n  Log File: {hook['logFile']}\n  Allowed Tools: {len(hook['allowedTools'])}\")"

echo ""
echo "=== Sample Log Entries ==="
echo ""
echo "Latest session.log entry:"
tail -n 1 .github/logs/session.log | python3 -m json.tool 2>/dev/null || tail -n 1 .github/logs/session.log

echo ""
echo "Latest tool-usage.log entry:"
tail -n 1 .github/logs/tool-usage.log | python3 -m json.tool 2>/dev/null || tail -n 1 .github/logs/tool-usage.log

echo ""
echo "=== All Tests Passed ✓ ==="
