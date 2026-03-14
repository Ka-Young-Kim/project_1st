#!/usr/bin/env bash

set -euo pipefail

APP_PORT="${APP_PORT:-3000}"

pick_lan_ip() {
  if command -v ip >/dev/null 2>&1; then
    ip route get 1.1.1.1 2>/dev/null | awk '/src/ {for (i = 1; i <= NF; i++) if ($i == "src") {print $(i + 1); exit}}'
  fi
}

check_http_port() {
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "( sport = :${APP_PORT} )" | tail -n +2 | grep -q .
    return
  fi

  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "${APP_PORT}"
    return
  fi

  echo "Neither ss nor nc is available to check port ${APP_PORT}." >&2
  exit 1
}

main() {
  local lan_ip app_url

  lan_ip="$(pick_lan_ip)"

  if [[ -z "${lan_ip}" ]]; then
    echo "Could not determine a LAN IP automatically." >&2
    exit 1
  fi

  if ! check_http_port; then
    echo "Application does not appear to be listening on port ${APP_PORT}." >&2
    exit 1
  fi

  app_url="http://${lan_ip}:${APP_PORT}"

  cat <<EOF
Project site is reachable on this machine.

App URL
  ${app_url}

Windows browser
  ${app_url}

Windows PowerShell connectivity check
  Test-NetConnection ${lan_ip} -Port ${APP_PORT}

If the Windows PC is on the same LAN, open the URL above in a browser.
EOF
}

main "$@"
