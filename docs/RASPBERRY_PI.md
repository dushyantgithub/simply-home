# Raspberry Pi 4 installation

This guide turns one Raspberry Pi 4 (8 GB) with the official 7-inch Touch Display 1 into both a local Home Assistant server and a wall/tabletop touchscreen panel.

## The installation model

Use **Raspberry Pi OS 64-bit Desktop**, not Home Assistant OS and not Raspberry Pi OS Lite.

Home Assistant OS is the best choice for a dedicated Home Assistant appliance, but it does not provide the graphical desktop needed by this kiosk. Running both jobs on one Pi requires:

- Raspberry Pi OS Desktop for the display and touch session
- Home Assistant Container for the server
- Mosquitto Container for optional MQTT control
- Simply Home for the fullscreen panel

This means there is no Home Assistant add-on store. Services that would normally be add-ons must run as separate containers. Home Assistant itself, integrations, dashboards, automations, backups, and updates still work.

## 1. Prepare the hardware

You need:

- Raspberry Pi 4, 8 GB
- Official Raspberry Pi 7-inch Touch Display 1 (800×480)
- Correct DSI ribbon cable, with the contacts oriented per the display and Pi connector markings
- Reliable Raspberry Pi USB-C power supply
- 32 GB or larger storage; a USB 3 SSD is strongly preferred for database reliability
- Temporary keyboard, or SSH enabled in Raspberry Pi Imager

Connect the display to the Pi 4 DSI connector while power is disconnected. The Display 1 is supported by Raspberry Pi OS without a manual display overlay on a standard Pi 4.

## 2. Flash Raspberry Pi OS

1. Install [Raspberry Pi Imager](https://www.raspberrypi.com/software/) on another computer.
2. Select **Raspberry Pi 4**.
3. Select **Raspberry Pi OS (64-bit)** with the desktop environment. Do not select Lite.
4. Select the SD card or SSD.
5. In OS customisation, set:
   - hostname: `simply-home`
   - your normal username and a strong password
   - Wi-Fi and country, if Ethernet is not used
   - timezone and keyboard layout
   - SSH enabled with public-key authentication if possible
6. Write the image, insert/connect the storage, and boot the Pi.

## 3. Update the operating system

Open a terminal on the touchscreen desktop or connect over SSH:

```bash
sudo apt update
sudo apt full-upgrade -y
sudo reboot
```

After the reboot, verify that touch and display both work. For landscape orientation, open **Preferences → Control Centre → Screens**, right-click the DSI display, choose the orientation, and apply it. Raspberry Pi documents this display as `DSI-1` on current systems.

Set Desktop Autologin so the graphical kiosk session starts after a power failure:

```bash
sudo raspi-config
```

Choose **System Options → Boot / Auto Login → Desktop Autologin**, then finish and reboot.

## 4. Give the Pi a stable network address

Find the current address:

```bash
hostname -I
```

Reserve that address for `simply-home` in your router's DHCP settings. A reservation is preferable to hard-coding a static address on the Pi.

Home Assistant will later be available at:

```text
http://simply-home.local:8123
```

If mDNS is unavailable on a client, use `http://PI_ADDRESS:8123`.

## 5. Install Docker Engine and Compose

Raspberry Pi OS 64-bit is Debian arm64, so use Docker's Debian repository:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $VERSION_CODENAME stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
sudo reboot
```

Membership in the `docker` group is effectively root-level access. Only grant it to trusted local users.

After reboot:

```bash
docker version
docker compose version
```

## 6. Download this project

```bash
cd ~
git clone https://github.com/dushyantgithub/simply-home.git
cd simply-home/deploy/home-assistant
cp .env.example .env
```

Edit `.env` if your timezone is not `Asia/Kolkata`:

```bash
nano .env
```

## 7. Create the MQTT account

MQTT is optional for showing the dashboard, but it enables the panel controls and sensors. Create the local data folders and a dedicated broker password:

```bash
mkdir -p home-assistant/config mosquitto/data mosquitto/log
docker run --rm -it \
  --entrypoint mosquitto_passwd \
  -v "$PWD/mosquitto/config:/mosquitto/config" \
  eclipse-mosquitto:2 \
  -c /mosquitto/config/password_file kiosk
```

Enter a strong, unique password when prompted. The generated password file and Home Assistant data are ignored by Git and must never be committed.

## 8. Start Home Assistant and Mosquitto

```bash
docker compose pull
docker compose up -d
docker compose ps
```

Watch initial startup if needed:

```bash
docker compose logs -f homeassistant
```

Press `Ctrl+C` to leave the log view; the containers keep running. They restart automatically after reboots.

Open `http://127.0.0.1:8123` on the Pi, or `http://simply-home.local:8123` from another device. Initial startup can take several minutes.

## 9. Complete Home Assistant onboarding

1. Create the Home Assistant owner account.
2. Set the home name, location, unit system, and timezone.
3. Review auto-discovered devices.
4. In Home Assistant, create a separate non-admin local user for the wall panel. Use that account when the kiosk shows the login page.

The Home Assistant owner login and the MQTT `kiosk` login are separate accounts.

## 10. Add MQTT to Home Assistant

1. Go to **Settings → Devices & services**.
2. Select **Add Integration**.
3. Search for and select **MQTT**.
4. Enter:
   - broker: `127.0.0.1`
   - port: `1883`
   - username: `kiosk`
   - password: the password created in step 7
5. Finish setup. MQTT discovery is enabled by default.

## 11. Install the kiosk

From the Raspberry Pi desktop terminal, as the normal desktop user:

```bash
bash <(wget -qO- https://raw.githubusercontent.com/dushyantgithub/simply-home/main/install.sh)
```

In the setup prompts, use:

- web URL: `http://127.0.0.1:8123`
- theme: `dark` or `light`
- zoom: start with `1.0` on the 800×480 Display 1
- widget: `true`
- MQTT URL: `mqtt://127.0.0.1:1883`
- MQTT user: `kiosk`
- MQTT password: the broker password from step 7
- discovery prefix: `homeassistant`

When the Home Assistant login appears, sign in with the dedicated non-admin panel user and choose to stay signed in.

The service should now be enabled:

```bash
systemctl --user status simply-home.service
```

Reboot once to verify end-to-end startup:

```bash
sudo reboot
```

Expected order: Raspberry Pi OS boots, desktop auto-login starts, Docker restores Home Assistant and Mosquitto, and Simply Home opens the local dashboard. A temporary connection screen while Home Assistant starts is normal.

### Keep Wi-Fi and the on-screen keyboard available

Run the bundled system configuration once after connecting the Pi to Wi-Fi:

```bash
cd ~/simply-home
bash deploy/raspberry-pi/configure-system.sh
```

The script updates the active NetworkManager Wi-Fi profile to connect automatically, retry indefinitely after an outage, and disable Wi-Fi power saving. The Wi-Fi password remains in NetworkManager's protected connection profile and is not copied into the repository.

It also enables `simply-home-keyboard.service`, which starts Squeekboard with the graphical session and restarts it if it fails. The kiosk's side keyboard button can then show or hide the keyboard.

Verify both settings with:

```bash
nmcli -g connection.autoconnect,connection.autoconnect-retries,802-11-wireless.powersave connection show "$(nmcli -t -f NAME,TYPE connection show --active | awk -F: '$2 == "802-11-wireless" { print $1; exit }')"
systemctl --user status simply-home-keyboard.service
```

## 12. Build a dashboard for 800×480

The original Display 1 is 800×480, so keep the dashboard compact:

- use one or two columns
- avoid dense charts on the landing view
- prefer large buttons and tiles
- hide unused sidebar entries for the panel user
- start with kiosk zoom `1.0`, then adjust in 0.05 increments
- keep destructive actions such as locks and alarms away from screen edges

## 13. Verify MQTT panel controls

After the kiosk connects, go to **Settings → Devices & services → Devices** and search for **Simply Home**. The exact entities depend on detected hardware and permissions. On the official DSI Display 1, display power and brightness should be available.

If the device does not appear:

```bash
journalctl --user -u simply-home.service -f
cd ~/simply-home/deploy/home-assistant
docker compose logs -f mosquitto
```

Confirm that both use `127.0.0.1:1883`, the username is `kiosk`, and the passwords match.

## 14. Updates

Update Home Assistant and Mosquitto:

```bash
cd ~/simply-home/deploy/home-assistant
docker compose pull
docker compose up -d
docker image prune -f
```

Update Simply Home:

```bash
bash <(wget -qO- https://raw.githubusercontent.com/dushyantgithub/simply-home/main/install.sh) update
```

Update Raspberry Pi OS regularly:

```bash
sudo apt update
sudo apt full-upgrade -y
sudo reboot
```

## 15. Backups

Home Assistant data is under:

```text
~/simply-home/deploy/home-assistant/home-assistant/config
```

For a filesystem-level backup, stop the stack briefly and copy the persistent folders to another device:

```bash
cd ~/simply-home/deploy/home-assistant
docker compose stop
tar -czf "$HOME/home-assistant-backup-$(date +%F).tar.gz" \
  home-assistant/config mosquitto/config mosquitto/data
docker compose start
```

Move the resulting archive off the Pi. A backup stored only on the same SD card or SSD is not a recovery plan.

## 16. Troubleshooting

### Kiosk does not start after reboot

```bash
systemctl --user status simply-home.service
journalctl --user -u simply-home.service -b
echo "$XDG_SESSION_TYPE $WAYLAND_DISPLAY $DISPLAY"
```

Confirm Desktop Autologin is enabled and a graphical desktop is visible.

### Home Assistant is unavailable

```bash
cd ~/simply-home/deploy/home-assistant
docker compose ps
docker compose logs --tail=200 homeassistant
curl -I http://127.0.0.1:8123
```

### Touch or orientation is wrong

The Home screen exposes 0°, 90°, 180°, and 270° controls when MQTT discovery and `wlr-randr` (Wayland) or `xrandr` (X11) are available. The selected angle is restored when Simply Home restarts. Automatic rotation requires an orientation sensor exposed by the operating system; most fixed Raspberry Pi touch panels, including the official DSI display, do not provide one.

If the MQTT control is unavailable, use **Preferences → Control Centre → Screens**. Avoid old `lcd_rotate` tutorials unless the current Raspberry Pi display documentation specifically requires a boot setting for your configuration.

### Screen power or brightness is missing

```bash
ls -l /sys/class/backlight/
cat /sys/class/backlight/*/brightness
```

Disconnect any active VNC session while testing Wayland display power control; screen capture can interfere with DSI power commands.

### Add-ons are missing

That is expected with Home Assistant Container. Run the required service as another Docker container, or use a second dedicated device with Home Assistant OS if the managed add-on experience is more important than using one Pi for both server and panel.

## Official references

- [Home Assistant Container installation](https://www.home-assistant.io/installation/alternative#install-home-assistant-container)
- [Home Assistant MQTT integration](https://www.home-assistant.io/integrations/mqtt/)
- [Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
- [Raspberry Pi Touch Display documentation](https://www.raspberrypi.com/documentation/accessories/display.html)
