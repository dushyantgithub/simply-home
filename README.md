# Simply Home

<p align="center">
  <img src="img/icon.png" alt="Simply Home icon" width="128">
</p>

[![build](https://img.shields.io/github/actions/workflow/status/dushyantgithub/simply-home/release.yml?style=flat-square)](https://github.com/dushyantgithub/simply-home/actions)
[![release](https://img.shields.io/github/v/release/dushyantgithub/simply-home?style=flat-square)](https://github.com/dushyantgithub/simply-home/releases)
[![platform](https://img.shields.io/badge/Linux-arm64%20%7C%20x64-0f766e?style=flat-square)](https://github.com/dushyantgithub/simply-home/releases)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

Simply Home is a touch-first Electron kiosk for Home Assistant dashboards. It runs fullscreen on a Linux touchscreen, remembers the dashboard login, provides touch navigation and an on-screen control widget, and can expose the panel as an MQTT device in Home Assistant.

![Simply Home displaying a Home Assistant dashboard](img/display.png)

## Highlights

- Fullscreen, touch-optimized Home Assistant webview
- Multiple dashboard/page URLs with touch navigation
- Theme and zoom controls
- Optional on-screen keyboard integration
- Screen wake, power, and brightness controls where supported
- MQTT discovery for panel controls and diagnostics
- Network, CPU, memory, temperature, audio, and uptime sensors
- Remote refresh, reboot, shutdown, screenshots, and page switching
- Debian packages for arm64 and x64, plus portable zip builds

See [HARDWARE.md](HARDWARE.md) for platform-specific capabilities and limitations.

## Raspberry Pi 4: server and panel on one device

Do not install Home Assistant OS when this Raspberry Pi must also run the kiosk. Home Assistant OS is an appliance image and does not provide the Raspberry Pi desktop session required by Electron.

Use this layout instead:

1. Raspberry Pi OS 64-bit Desktop supplies the touchscreen and Wayland desktop.
2. Home Assistant Container runs locally with Docker.
3. Mosquitto runs beside Home Assistant for optional panel controls.
4. Simply Home opens `http://127.0.0.1:8123` in the local desktop session.

The complete, copy-pasteable walkthrough is in [docs/RASPBERRY_PI.md](docs/RASPBERRY_PI.md). A ready Docker Compose stack is included under [`deploy/home-assistant`](deploy/home-assistant).

## Install Simply Home

On a 64-bit Debian-based desktop, including Raspberry Pi OS, run this as the normal desktop user (not as root):

```bash
bash <(wget -qO- https://raw.githubusercontent.com/dushyantgithub/simply-home/main/install.sh)
```

The installer downloads the correct release package, installs it, creates `simply-home.service`, enables startup, and opens the first-run setup.

Useful service commands:

```bash
systemctl --user status simply-home.service
systemctl --user restart simply-home.service
systemctl --user stop simply-home.service
```

Run setup again at any time:

```bash
simply-home --setup
```

Settings, browser data, and logs live under `~/.config/simply-home/`.

## Configuration

### Web options

| Argument | Default | Purpose |
| --- | --- | --- |
| `--web-url` | required | One URL, or comma-separated URLs, to display |
| `--web-theme` | `dark` | `light` or `dark` |
| `--web-zoom` | `1.25` | Browser zoom; `1.0` is 100% |
| `--web-widget` | `true` | Show or hide the side control widget |

Example:

```bash
simply-home --web-url=http://127.0.0.1:8123 --web-theme=dark --web-zoom=1.0
```

### MQTT options

| Argument | Default | Purpose |
| --- | --- | --- |
| `--mqtt-url` | unset | Broker URL such as `mqtt://127.0.0.1:1883` |
| `--mqtt-user` | unset | Dedicated broker username |
| `--mqtt-password` | unset | Dedicated broker password |
| `--mqtt-discovery` | `homeassistant` | Home Assistant discovery prefix |

Example:

```bash
simply-home \
  --web-url=http://127.0.0.1:8123 \
  --mqtt-url=mqtt://127.0.0.1:1883 \
  --mqtt-user=kiosk
```

Avoid entering the MQTT password directly in a shell command because it may be saved in shell history. Use `simply-home --setup` instead. The saved argument file should still be treated as sensitive.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Control+Left` / `Control+Right` | Previous / next configured page |
| `Control+Num_Subtract` / `Control+Num_Add` | Decrease / increase zoom |
| `Alt+Left` / `Alt+Right` | Back / forward in web history |

## Development

Node.js 22 and Yarn Classic are used by the release workflow.

```bash
git clone https://github.com/dushyantgithub/simply-home.git
cd simply-home
yarn install --frozen-lockfile
yarn start
```

Build distributable packages with:

```bash
yarn build
```

When launching from SSH into a Raspberry Pi desktop session, these variables may be required:

```bash
export DISPLAY=:0
export WAYLAND_DISPLAY=wayland-0
```

## Troubleshooting

- Application log: `~/.config/simply-home/logs/main.log`
- Electron log: start with `simply-home --enable-logging`
- Webview developer tools: start with `simply-home --app-debug`
- Live service log: `journalctl --user -u simply-home.service -f`
- GPU rendering trouble: test `simply-home --disable-gpu`

Open an issue with the application version, Raspberry Pi OS version, display server, screen model, and the relevant log excerpt.

## License

MIT. See [LICENSE](LICENSE). The retained copyright notice in that file is required for redistribution of the inherited MIT-licensed portions.
