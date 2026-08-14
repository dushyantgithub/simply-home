#!/usr/bin/env bash

# Read arguments
ARG_EARLY=false
ARG_UPDATE=false
for arg in "$@"; do
  case "$arg" in
    early) ARG_EARLY=true ;;
    update) ARG_UPDATE=true ;;
  esac
done

# Determine system architecture
echo -e "Determining system architecture..."

BITS=$(getconf LONG_BIT)
case "$(uname -m)" in
    x86_64) ARCH="x64" ;;
    aarch64) ARCH="arm64" ;;
    *) { echo "Architecture $(uname -m) running $BITS-bit operating system is not supported."; exit 1; } ;;
esac

[ "$BITS" -eq 64 ] || { echo "Architecture $ARCH running $BITS-bit operating system is not supported."; exit 1; }
echo "Architecture $ARCH running $BITS-bit operating system is supported."

# Download the latest .deb package
echo -e "\nDownloading the latest release..."

TMP_DIR=$(mktemp -d)
chmod 755 "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT

JSON=$(wget -qO- "https://api.github.com/repos/dushyantgithub/simply-home/releases" | tr -d '\r\n')
if $ARG_EARLY; then
  DEB_REG='"prerelease":\s*(true|false).*?"browser_download_url":\s*"\K[^\"]*_'$ARCH'\.deb'
else
  DEB_REG='"prerelease":\s*false.*?"browser_download_url":\s*"\K[^\"]*_'$ARCH'\.deb'
fi

DEB_URL=$(echo "$JSON" | grep -oP "$DEB_REG" | head -n 1)
DEB_PATH="${TMP_DIR}/$(basename "$DEB_URL")"

[ -z "$DEB_URL" ] && { echo "Download url for .deb file not found."; exit 1; }
wget --show-progress -q -O "$DEB_PATH" "$DEB_URL" || { echo "Failed to download the .deb file."; exit 1; }

# Install the latest .deb package
echo -e "\nInstalling the latest release..."

command -v apt &> /dev/null || { echo "Package manager apt was not found."; exit 1; }
sudo apt install -y "$DEB_PATH" || { echo "Installation of .deb file failed."; exit 1; }

# Make the active Wi-Fi profile resilient across outages and reboots. A retry
# value of zero means NetworkManager keeps retrying indefinitely. Disabling
# Wi-Fi power saving avoids a common source of kiosk disconnects.
if command -v nmcli &> /dev/null; then
    WIFI_CONNECTION=$(nmcli -t -f NAME,TYPE,DEVICE connection show --active |
        awk -F: '$2 == "802-11-wireless" && $3 != "" { print $1; exit }')
    if [ -n "$WIFI_CONNECTION" ]; then
        sudo nmcli connection modify "$WIFI_CONNECTION" \
            connection.autoconnect yes \
            connection.autoconnect-priority 100 \
            connection.autoconnect-retries 0 \
            802-11-wireless.powersave 2
        echo "Wi-Fi autoconnect enabled with unlimited retries and power saving disabled."
    fi
fi

# Run Squeekboard as part of the graphical user session so touch users can
# always recover access to text fields without attaching a physical keyboard.
if command -v squeekboard &> /dev/null; then
    KEYBOARD_SERVICE_NAME="simply-home-keyboard.service"
    KEYBOARD_SERVICE_FILE="$HOME/.config/systemd/user/$KEYBOARD_SERVICE_NAME"
    mkdir -p "$(dirname "$KEYBOARD_SERVICE_FILE")" "$HOME/.config/systemd/user/simply-home.service.d"
    cat > "$KEYBOARD_SERVICE_FILE" <<'EOF'
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
    cat > "$HOME/.config/systemd/user/simply-home.service.d/keyboard.conf" <<EOF
[Unit]
Wants=$KEYBOARD_SERVICE_NAME
After=$KEYBOARD_SERVICE_NAME
EOF
    systemctl --user daemon-reload
    systemctl --user enable --now "$KEYBOARD_SERVICE_NAME"
    echo "On-screen keyboard service enabled."
fi

# Create the systemd user service
echo -e "\nCreating systemd user service..."

SERVICE_NAME="simply-home.service"
SERVICE_FILE="$HOME/.config/systemd/user/$SERVICE_NAME"
mkdir -p "$(dirname "$SERVICE_FILE")" || { echo "Failed to create directory for $SERVICE_FILE."; exit 1; }

SERVICE_CONTENT="[Unit]
Description=Simply Home
After=graphical-session.target network-online.target
Wants=graphical-session.target network-online.target

[Service]
Environment=DISPLAY=:0
Environment=WAYLAND_DISPLAY=wayland-0
ExecStart=/usr/bin/simply-home
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=default.target"

if $ARG_UPDATE; then
  if systemctl --user --quiet is-active "${SERVICE_NAME}"; then
    systemctl --user restart "${SERVICE_NAME}"
    echo "Existing $SERVICE_NAME restarted."
  else
    echo "Existing $SERVICE_NAME not running, start simply-home manually."
  fi
  exit 0
fi

SERVICE_CREATE=true
if [ -f "$SERVICE_FILE" ]; then
    read -p "Service $SERVICE_FILE exists, overwrite? (y/N) " overwrite
    [[ ${overwrite:-n} == [Yy]* ]] || SERVICE_CREATE=false
fi

if $SERVICE_CREATE; then
    echo "$SERVICE_CONTENT" > "$SERVICE_FILE" || { echo "Failed to write to $SERVICE_FILE."; exit 1; }
    systemctl --user enable "$(basename "$SERVICE_FILE")" || { echo "Failed to enable service $SERVICE_FILE."; exit 1; }
    echo "Service $SERVICE_FILE enabled."
else
    echo "Service $SERVICE_FILE not created."
fi

# Export display variables
echo -e "\nExporting display variables..."

if [ -z "$DISPLAY" ]; then
    export DISPLAY=":0"
    echo "DISPLAY was not set, defaulting to \"$DISPLAY\"."
else
    echo "DISPLAY is set to \"$DISPLAY\"."
fi

if [ -z "$WAYLAND_DISPLAY" ]; then
    export WAYLAND_DISPLAY="wayland-0"
    echo "WAYLAND_DISPLAY was not set, defaulting to \"$WAYLAND_DISPLAY\"."
else
    echo "WAYLAND_DISPLAY is set to \"$WAYLAND_DISPLAY\"."
fi

# Start the setup mode
read -p $'\nStart simply-home setup? (Y/n) ' setup

if [[ ${setup:-y} == [Yy]* ]]; then
    echo "/usr/bin/simply-home --setup"
    /usr/bin/simply-home --setup
else
    echo "/usr/bin/simply-home"
    /usr/bin/simply-home
fi

exit 0
