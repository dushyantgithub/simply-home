#!/usr/bin/env bash

set -euo pipefail

KEYBOARD_SERVICE="simply-home-keyboard.service"
USER_SYSTEMD_DIR="${HOME}/.config/systemd/user"

configure_wifi() {
  if ! command -v nmcli >/dev/null 2>&1; then
    echo "NetworkManager not found; skipping Wi-Fi reliability settings."
    return
  fi

  local connection
  connection=$(nmcli -t -f NAME,TYPE,DEVICE connection show --active |
    awk -F: '$2 == "802-11-wireless" && $3 != "" { print $1; exit }')

  if [[ -z "$connection" ]]; then
    echo "No active Wi-Fi connection found; skipping Wi-Fi reliability settings."
    return
  fi

  echo "Configuring Wi-Fi connection '${connection}' for automatic recovery..."
  sudo nmcli connection modify "$connection" \
    connection.autoconnect yes \
    connection.autoconnect-priority 100 \
    connection.autoconnect-retries 0 \
    802-11-wireless.powersave 2

  echo "Wi-Fi autoconnect enabled with unlimited retries and power saving disabled."
}

configure_keyboard() {
  if ! command -v squeekboard >/dev/null 2>&1; then
    echo "squeekboard is not installed; install it before enabling the on-screen keyboard." >&2
    return 1
  fi

  mkdir -p "$USER_SYSTEMD_DIR" "${USER_SYSTEMD_DIR}/simply-home.service.d"

  cat >"${USER_SYSTEMD_DIR}/${KEYBOARD_SERVICE}" <<'EOF'
[Unit]
Description=Simply Home on-screen keyboard
After=graphical-session.target
PartOf=graphical-session.target

[Service]
Environment=DISPLAY=:0
Environment=WAYLAND_DISPLAY=wayland-0
ExecStart=/usr/bin/squeekboard
Restart=on-failure
RestartSec=2s

[Install]
WantedBy=default.target
EOF

  cat >"${USER_SYSTEMD_DIR}/simply-home.service.d/keyboard.conf" <<EOF
[Unit]
Wants=${KEYBOARD_SERVICE}
After=${KEYBOARD_SERVICE}
EOF

  systemctl --user daemon-reload
  systemctl --user enable --now "$KEYBOARD_SERVICE"
  systemctl --user try-restart simply-home.service

  echo "On-screen keyboard service enabled and started."
}

configure_wifi
configure_keyboard
