#!/usr/bin/env bash
set -euo pipefail

FRONTEND_PORT="${FRONTEND_PORT:-5173}"
API_PORT="${API_PORT:-3001}"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required but not found in PATH." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not found in PATH." >&2
  exit 1
fi

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM

  if [[ -n "${frontend_pid:-}" ]] && kill -0 "$frontend_pid" 2>/dev/null; then
    kill "$frontend_pid" 2>/dev/null || true
  fi

  if [[ -n "${api_pid:-}" ]] && kill -0 "$api_pid" 2>/dev/null; then
    kill "$api_pid" 2>/dev/null || true
  fi

  wait 2>/dev/null || true
  exit "$exit_code"
}

trap cleanup EXIT INT TERM

echo "Starting frontend on http://localhost:${FRONTEND_PORT}"
npm run dev -- --port "$FRONTEND_PORT" --strictPort &
frontend_pid=$!

echo "Starting API runtime on http://localhost:${API_PORT}"
npx vercel dev --yes --listen "$API_PORT" &
api_pid=$!

while true; do
  if ! kill -0 "$frontend_pid" 2>/dev/null; then
    echo "Frontend process exited." >&2
    exit 1
  fi

  if ! kill -0 "$api_pid" 2>/dev/null; then
    echo "API process exited." >&2
    exit 1
  fi

  sleep 1
done
