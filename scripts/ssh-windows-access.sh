#!/usr/bin/env bash

set -euo pipefail

SSH_PORT="${SSH_PORT:-22}"
MODE="lan"

usage() {
  cat <<'EOF'
Usage: scripts/ssh-windows-access.sh [--lan] [--help]

Options:
  --lan       Print direct LAN SSH connection info for a Windows PC. (default)
  --help      Show this help text.

Environment:
  SSH_PORT  Local SSH server port to expose. Default: 22
EOF
}

for arg in "$@"; do
  case "$arg" in
    --lan)
      MODE="lan"
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      usage >&2
      exit 1
      ;;
  esac
done

pick_lan_ip() {
  if command -v ip >/dev/null 2>&1; then
    ip route get 1.1.1.1 2>/dev/null | awk '/src/ {for (i = 1; i <= NF; i++) if ($i == "src") {print $(i + 1); exit}}'
  fi
}

check_ssh_port() {
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "( sport = :${SSH_PORT} )" | tail -n +2 | grep -q .
    return
  fi

  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "${SSH_PORT}"
    return
  fi

  echo "Neither ss nor nc is available to check the SSH port." >&2
  exit 1
}

print_lan_info() {
  local lan_ip current_user
  lan_ip="$(pick_lan_ip)"
  current_user="$(id -un)"

  if [[ -z "${lan_ip}" ]]; then
    echo "Could not determine a LAN IP automatically." >&2
    exit 1
  fi

  if ! check_ssh_port; then
    echo "SSH does not appear to be listening on port ${SSH_PORT}." >&2
    exit 1
  fi

  cat <<EOF
Local SSH is reachable on this machine.

Linux host
  user: ${current_user}
  host: ${lan_ip}
  port: ${SSH_PORT}

Windows PowerShell command
  ssh ${current_user}@${lan_ip}

Windows PowerShell connectivity check
  Test-NetConnection ${lan_ip} -Port ${SSH_PORT}

This only needs to be on the same LAN. No SSH tunnel or router port-forwarding is required.
If the Windows PC is on a different network, you need separate network exposure such as router port-forwarding or a managed tunnel service.
EOF
}

case "${MODE}" in
  lan)
    print_lan_info
    ;;
esac
