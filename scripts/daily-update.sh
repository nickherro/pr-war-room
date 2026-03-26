#!/bin/bash
# PR War Room — Daily Update Script
# Runs Claude to research and add new entries for active disputes

set -e

PROJECT_DIR="/Users/nickherro/Projects/pr-war-room"
LOG_DIR="$PROJECT_DIR/scripts/logs"
LOG_FILE="$LOG_DIR/update-$(date +%Y-%m-%d).log"
CLAUDE="/usr/local/bin/claude"

mkdir -p "$LOG_DIR"

echo "=== PR War Room Daily Update ===" >> "$LOG_FILE"
echo "Started: $(date)" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# Run Claude with the update prompt
$CLAUDE -p "$(cat CLAUDE_UPDATE_PROMPT.md)" \
  --allowedTools "Edit,Read,Bash,Grep,Glob,Write,WebSearch,WebFetch" \
  >> "$LOG_FILE" 2>&1

echo "Finished: $(date)" >> "$LOG_FILE"
echo "===" >> "$LOG_FILE"

# Keep only last 30 days of logs
find "$LOG_DIR" -name "update-*.log" -mtime +30 -delete
