const COLORS = {
  bg: "#111111",
  card: "#1c1c1c",
  text: "#e1e1e1",
  muted: "rgba(225,225,225,.45)",
  faint: "rgba(225,225,225,.06)",
  blue: "#03a9f4",
  amber: "#ffc107",
  purple: "#926bc7",
  green: "#4caf50",
  orange: "#ff9800",
  red: "#f44336",
};

const NAV_ITEMS = [
  ["home", "mdi:home", "mdi:home-outline", "Home", "/wall-panel/homepage"],
  ["devices", "mdi:view-grid", "mdi:view-grid-outline", "Devices", "/wall-panel/devices"],
  ["security", "mdi:shield-home", "mdi:shield-home-outline", "Security", "/wall-panel/security"],
  ["settings", "mdi:tune-variant", "mdi:tune-variant", "Settings", "/wall-panel/settings"],
];

const LIGHT_ENTITIES = [
  "light.bedroom_tubelight",
  "light.gaming_room_tubelight",
  "switch.hall_switch_switch_1",
  "switch.hall_switch_switch_2",
  "switch.hall_switch_switch_3",
  "switch.dining_room_switch_switch_1",
  "switch.dining_room_switch_switch_2",
  "switch.kitchen_switch_switch_1",
  "switch.kitchen_switch_switch_2",
  "switch.gaming_room_switch_switch_1",
  "switch.gaming_room_switch_switch_2",
  "switch.gaming_room_switch_switch_3",
  "switch.gaming_room_switch_switch_4",
];

const ALL_CONTROLLABLE = [
  ...LIGHT_ENTITIES,
  "switch.bedroom_aircon_socket_1",
  "switch.bedroom_switch_switch_1",
  "switch.bedroom_switch_switch_2",
  "switch.bedroom_switch_switch_3",
  "switch.bedroom_extension_socket_1",
  "switch.bedroom_extension_socket_2",
  "switch.bedroom_extension_socket_3",
  "switch.bedroom_extension_socket_4",
  "switch.geyser_socket_1",
];

const ROOM_DATA = [
  {
    id: "living",
    name: "Living Area",
    icon: "mdi:sofa-outline",
    color: COLORS.amber,
    entities: ["switch.hall_switch_switch_1", "switch.hall_switch_switch_2", "switch.hall_switch_switch_3"],
    devices: [
      ["switch.hall_switch_switch_1", "mdi:ceiling-light", COLORS.amber, "lights"],
      ["switch.hall_switch_switch_2", "mdi:string-lights", COLORS.amber, "lights"],
      ["switch.hall_switch_switch_3", "mdi:television", COLORS.purple, "media"],
      ["camera.home_360", "mdi:cctv", COLORS.blue, "other", "more-info"],
      ["switch.home_360_motion_alarm", "mdi:motion-sensor", COLORS.orange, "other"],
      ["switch.home_360_privacy_mode", "mdi:eye-off", COLORS.purple, "other"],
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "mdi:fridge-outline",
    color: "#00bcd4",
    entities: ["switch.kitchen_switch_switch_1", "switch.kitchen_switch_switch_2"],
    devices: [
      ["switch.kitchen_switch_switch_1", "mdi:ceiling-light", "#00bcd4", "lights"],
      ["switch.kitchen_switch_switch_2", "mdi:wall-sconce-flat", "#00bcd4", "lights"],
    ],
  },
  {
    id: "dining",
    name: "Dining Area",
    icon: "mdi:silverware-fork-knife",
    color: COLORS.muted,
    entities: ["switch.dining_room_switch_switch_1", "switch.dining_room_switch_switch_2"],
    devices: [
      ["switch.dining_room_switch_switch_1", "mdi:ceiling-light", COLORS.amber, "lights"],
      ["switch.dining_room_switch_switch_2", "mdi:wall-sconce-flat", COLORS.amber, "lights"],
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: "mdi:bed-outline",
    color: COLORS.blue,
    entities: [
      "light.bedroom_tubelight",
      "switch.bedroom_aircon_socket_1",
      "switch.bedroom_switch_switch_1",
      "switch.bedroom_switch_switch_2",
      "switch.bedroom_switch_switch_3",
      "switch.bedroom_extension_socket_1",
      "switch.bedroom_extension_socket_2",
      "switch.bedroom_extension_socket_3",
      "switch.bedroom_extension_socket_4",
    ],
    devices: [
      ["switch.bedroom_aircon_socket_1", "mdi:air-conditioner", COLORS.blue, "climate"],
      ["light.bedroom_tubelight", "mdi:ceiling-light", COLORS.amber, "lights"],
      ["switch.bedroom_switch_switch_1", "mdi:lightbulb-outline", COLORS.amber, "lights"],
      ["switch.bedroom_switch_switch_2", "mdi:ceiling-fan", COLORS.blue, "climate"],
      ["switch.bedroom_switch_switch_3", "mdi:light-switch", COLORS.amber, "lights"],
      ["switch.bedroom_extension_socket_1", "mdi:power-socket", COLORS.muted, "other"],
      ["switch.bedroom_extension_socket_2", "mdi:power-socket", COLORS.muted, "other"],
      ["switch.bedroom_extension_socket_3", "mdi:power-socket", COLORS.muted, "other"],
      ["switch.bedroom_extension_socket_4", "mdi:power-socket", COLORS.muted, "other"],
    ],
  },
  {
    id: "gaming",
    name: "Gaming Room",
    icon: "mdi:controller",
    color: COLORS.purple,
    entities: [
      "light.gaming_room_tubelight",
      "switch.gaming_room_switch_switch_1",
      "switch.gaming_room_switch_switch_2",
      "switch.gaming_room_switch_switch_3",
      "switch.gaming_room_switch_switch_4",
    ],
    devices: [
      ["light.gaming_room_tubelight", "mdi:ceiling-light", COLORS.amber, "lights"],
      ["switch.gaming_room_switch_switch_1", "mdi:ceiling-light", COLORS.amber, "lights"],
      ["switch.gaming_room_switch_switch_2", "mdi:desk-lamp", COLORS.amber, "lights"],
      ["switch.gaming_room_switch_switch_3", "mdi:controller", COLORS.purple, "media"],
      ["switch.gaming_room_switch_switch_4", "mdi:light-switch", COLORS.muted, "other"],
    ],
  },
  {
    id: "washroom",
    name: "Common Washroom",
    icon: "mdi:shower",
    color: COLORS.muted,
    entities: ["switch.geyser_socket_1"],
    devices: [["switch.geyser_socket_1", "mdi:water-boiler", COLORS.orange, "climate"]],
  },
];

class SimplyHomeDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._expandedRooms = new Set(["living", "bedroom"]);
    this._filter = "all";
    this._signature = "";
    this._nightDismissedUntil = 0;
    this._forecastData = { daily: [], hourly: [] };
    this._forecastFetchedAt = 0;
    this._forecastRequest = null;
    this._handleClick = (event) => this.handleClick(event);
  }

  setConfig(config) {
    this.config = config || {};
    this.render(true);
  }

  set hass(value) {
    this._hass = value;
    this.render();
  }

  connectedCallback() {
    this._clockTimer = setInterval(() => this.render(true), 30000);
    this.render(true);
  }

  disconnectedCallback() {
    clearInterval(this._clockTimer);
  }

  getCardSize() {
    return 12;
  }

  getLayoutOptions() {
    return { grid_rows: 12, grid_columns: 12 };
  }

  state(entityId) {
    return this._hass?.states?.[entityId];
  }

  isOn(entityId) {
    return this.state(entityId)?.state === "on";
  }

  available(entityId) {
    const value = this.state(entityId)?.state;
    return value != null && !["unknown", "unavailable"].includes(value);
  }

  entityLabel(entityId) {
    const state = this.state(entityId)?.state;
    if (!state) return "Unavailable";
    if (state === "unavailable") return "Unavailable";
    if (state === "unknown") return "Unknown";
    if (state === "on") return "On";
    if (state === "off") return "Off";
    return state.charAt(0).toUpperCase() + state.slice(1);
  }

  entityName(entityId) {
    const friendlyName = this.state(entityId)?.attributes?.friendly_name;
    if (friendlyName) return friendlyName;
    return entityId
      .split(".")
      .pop()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  number(entityId) {
    const value = Number.parseFloat(this.state(entityId)?.state);
    return Number.isFinite(value) ? value : 0;
  }

  escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  icon(name, className = "") {
    return `<ha-icon class="${className}" icon="${name}"></ha-icon>`;
  }

  entityIcon(entityId, fallback = "mdi:help-circle-outline", className = "") {
    return this.icon(this.state(entityId)?.attributes?.icon || fallback, className);
  }

  presenceLabel(entityId) {
    const state = this.state(entityId)?.state;
    if (state === "home") return "Home";
    if (state === "not_home") return "Away";
    return this.entityLabel(entityId);
  }

  spotifyEntityId() {
    const mediaPlayers = Object.keys(this._hass?.states || {}).filter((id) => id.startsWith("media_player."));
    return (
      mediaPlayers.find((id) => id.includes("spotifyplus")) || mediaPlayers.find((id) => id.includes("spotify")) || null
    );
  }

  style() {
    return `
      :host { display:block; width:100%; height:100%; }
      * { box-sizing:border-box; }
      button { font:inherit; }
      .panel {
        width:100%; max-width:480px; height:100vh; min-height:720px; margin:0 auto;
        position:relative; overflow:hidden; background:${COLORS.bg}; color:${COLORS.text};
        font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        -webkit-font-smoothing:antialiased; font-weight:400;
      }
      .scroll {
        position:absolute; inset:0; overflow-y:auto; overflow-x:hidden; scrollbar-width:none;
        padding:18px 16px 96px; display:flex; flex-direction:column; gap:14px;
      }
      .scroll::-webkit-scrollbar { display:none; }
      .home-scroll { overflow-y:auto; }
      .top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex:0 0 auto; }
      .greeting { font-size:15px; line-height:18px; font-weight:500; color:rgba(225,225,225,.55); letter-spacing:.01em; }
      .clock { font-size:58px; line-height:58px; font-weight:300; color:${COLORS.text}; letter-spacing:-.02em; }
      .date { margin-top:4px; font-size:13px; line-height:17px; color:rgba(225,225,225,.4); }
      .weather { padding-top:4px; display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
      .weather-main { display:flex; align-items:center; gap:8px; }
      .weather-main ha-icon { width:30px; height:30px; color:${COLORS.amber}; }
      .temperature { font-size:34px; line-height:34px; font-weight:300; }
      .weather-detail { font-size:12px; line-height:15px; color:rgba(225,225,225,.4); text-align:right; }
      .chips { display:flex; align-items:center; gap:8px; flex:0 0 auto; }
      .chip {
        min-width:0; flex:1 1 0; height:38px; border-radius:19px; border:1px solid ${COLORS.faint};
        background:${COLORS.card}; display:inline-flex; align-items:center; justify-content:center; gap:7px;
        color:${COLORS.text}; font-size:13px; line-height:1; font-weight:500; white-space:nowrap;
      }
      .chip-icon { width:18px; height:18px; flex:0 0 18px; display:grid; place-items:center; line-height:0; }
      .chip-icon ha-icon { width:17px; height:17px; display:block; --mdc-icon-size:17px; }
      .chip-label { display:block; line-height:16px; }
      .chip:nth-child(1) .chip-icon { color:#2196f3; }
      .chip:nth-child(2) .chip-icon,.chip:nth-child(3) .chip-icon { color:${COLORS.amber}; }
      .chip:nth-child(4) .chip-icon { color:${COLORS.green}; }
      .forecast-card { flex:0 0 auto; padding:14px; border-radius:16px; border:1px solid ${COLORS.faint}; background:${COLORS.card}; }
      .forecast-head { display:flex; align-items:center; justify-content:space-between; gap:12px; }
      .forecast-current { display:flex; align-items:center; gap:9px; min-width:0; }
      .forecast-current > ha-icon { width:28px; height:28px; color:${COLORS.amber}; }
      .forecast-current-copy b { display:block; font-size:15px; line-height:18px; font-weight:500; text-transform:capitalize; }
      .forecast-current-copy span { display:block; margin-top:2px; color:${COLORS.muted}; font-size:11px; line-height:14px; }
      .forecast-temp { font-size:30px; line-height:32px; font-weight:300; }
      .weather-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-top:12px; }
      .weather-metric { min-width:0; min-height:48px; padding:7px 6px; border-radius:11px; background:rgba(225,225,225,.045); display:flex; align-items:center; gap:7px; }
      .weather-metric ha-icon { width:17px; height:17px; flex:0 0 17px; color:${COLORS.blue}; }
      .weather-metric-copy { min-width:0; }
      .weather-metric-copy b { display:block; overflow:hidden; text-overflow:ellipsis; font-size:11px; line-height:14px; font-weight:500; white-space:nowrap; }
      .weather-metric-copy span { display:block; margin-top:1px; color:${COLORS.muted}; font-size:9px; line-height:12px; text-transform:uppercase; letter-spacing:.04em; }
      .forecast-section { margin-top:12px; }
      .forecast-label { margin-bottom:7px; color:${COLORS.muted}; font-size:10px; line-height:12px; font-weight:500; text-transform:uppercase; letter-spacing:.08em; }
      .forecast-strip { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; }
      .forecast-item { min-width:0; padding:7px 2px; border-radius:10px; background:rgba(225,225,225,.035); display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center; }
      .forecast-item span { max-width:100%; overflow:hidden; color:${COLORS.muted}; font-size:9px; line-height:11px; text-overflow:ellipsis; white-space:nowrap; }
      .forecast-item ha-icon { width:19px; height:19px; color:rgba(225,225,225,.72); }
      .forecast-item b { font-size:11px; line-height:13px; font-weight:500; }
      .forecast-empty { padding:9px 0 2px; color:${COLORS.muted}; font-size:11px; text-align:center; }
      .camera-card { flex:0 0 auto; overflow:hidden; border-radius:16px; background:${COLORS.card}; border:1px solid ${COLORS.faint}; }
      .camera {
        height:150px; position:relative; display:flex; align-items:center; justify-content:center;
        background-color:#1a1a1a; background-size:cover; background-position:center;
        background-image:repeating-linear-gradient(135deg,#212121 0 10px,#1a1a1a 10px 20px);
      }
      .camera-fallback { position:absolute; inset:0; z-index:0; width:100%; height:100%; display:block; object-fit:cover; }
      .native-camera-host { position:absolute; inset:0; z-index:1; overflow:hidden; pointer-events:none; }
      .native-camera-host > * { width:100%; height:100%; display:block; }
      .camera.has-picture::after { content:""; position:absolute; inset:0; z-index:2; pointer-events:none; background:rgba(0,0,0,.08); }
      .camera-placeholder { position:relative; z-index:1; color:rgba(225,225,225,.35); font:11px "Roboto Mono",monospace; letter-spacing:.06em; }
      .live-label,.camera-age { position:absolute; z-index:3; border-radius:12px; background:rgba(0,0,0,.58); }
      .live-label { top:10px; left:10px; padding:4px 9px; display:flex; align-items:center; gap:6px; font-size:11px; font-weight:500; letter-spacing:.03em; }
      .live-dot { width:7px; height:7px; border-radius:50%; background:${COLORS.red}; }
      .camera-age { right:10px; bottom:10px; padding:4px 9px; color:rgba(225,225,225,.6); font:11px "Roboto Mono",monospace; }
      .camera-status { height:42px; padding:10px 12px; display:flex; align-items:center; gap:8px; }
      .status-part { min-width:0; flex:1 1 0; display:flex; align-items:center; gap:8px; font-size:13px; white-space:nowrap; }
      .status-part ha-icon { width:19px; height:19px; }
      .divider { width:1px; height:18px; background:rgba(225,225,225,.1); }
      .quick-grid { flex:0 0 auto; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .quick {
        min-width:0; height:68px; padding:12px; border-radius:14px; border:1px solid ${COLORS.faint};
        background:${COLORS.card}; color:${COLORS.text}; display:flex; align-items:center; gap:12px; text-align:left;
      }
      .quick.active-amber { background:linear-gradient(180deg,rgba(255,193,7,.14),rgba(255,193,7,.06)),${COLORS.card}; border-color:rgba(255,193,7,.22); }
      .quick.active-blue { background:linear-gradient(180deg,rgba(3,169,244,.14),rgba(3,169,244,.06)),${COLORS.card}; border-color:rgba(3,169,244,.22); }
      .quick-icon { width:44px; height:44px; flex:0 0 auto; border-radius:13px; display:flex; align-items:center; justify-content:center; background:rgba(225,225,225,.08); }
      .quick-icon ha-icon { width:23px; height:23px; }
      .quick-text { display:block; min-width:0; }
      .quick-name { display:block; font-size:14px; line-height:18px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .quick-state { display:block; margin-top:1px; font-size:12px; line-height:16px; color:rgba(225,225,225,.5); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .media-card { min-height:76px; flex:0 0 auto; padding:12px; border-radius:16px; background:${COLORS.card}; border:1px solid ${COLORS.faint}; display:flex; align-items:center; gap:12px; color:${COLORS.text}; text-align:left; }
      .album { width:52px; height:52px; flex:0 0 auto; overflow:hidden; border-radius:13px; display:flex; align-items:center; justify-content:center; background:repeating-linear-gradient(135deg,#2a2a2a 0 6px,#232323 6px 12px); }
      .album img { width:100%; height:100%; object-fit:cover; display:block; }
      .album ha-icon { width:22px; height:22px; color:rgba(225,225,225,.35); }
      .media-copy { min-width:0; flex:1 1 0; }
      .media-title { font-size:14px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .media-sub { font-size:12px; color:rgba(225,225,225,.5); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .progress { height:3px; margin-top:8px; border-radius:2px; background:rgba(225,225,225,.12); }
      .progress > span { display:block; width:0; height:100%; border-radius:2px; background:${COLORS.blue}; }
      .media-actions { display:flex; align-items:center; gap:2px; }
      .media-action { width:34px; height:34px; padding:0; border:0; border-radius:50%; background:transparent; color:rgba(225,225,225,.66); display:grid; place-items:center; }
      .media-action.primary { background:rgba(30,215,96,.15); color:#1ed760; }
      .media-action ha-icon { width:21px; height:21px; display:block; }
      .alert { min-height:44px; flex:0 0 auto; padding:11px 14px; border-radius:14px; background:rgba(255,152,0,.09); border:1px solid rgba(255,152,0,.25); display:flex; align-items:center; gap:10px; font-size:13px; }
      .alert ha-icon { width:20px; height:20px; color:${COLORS.orange}; }
      .alert span { flex:1 1 0; }
      .nav { position:absolute; z-index:20; left:0; right:0; bottom:0; height:80px; padding:0 8px 10px; display:flex; align-items:center; justify-content:space-around; background:linear-gradient(180deg,rgba(17,17,17,0) 0%,rgba(17,17,17,.92) 34%,${COLORS.bg} 60%); }
      .nav-item { width:88px; min-height:56px; padding:8px 0; border:0; border-radius:16px; background:transparent; color:rgba(225,225,225,.45); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; }
      .nav-item.active { color:${COLORS.blue}; background:rgba(3,169,244,.14); }
      .nav-item ha-icon { width:24px; height:24px; }
      .nav-item span { font-size:11px; line-height:13px; font-weight:500; }
      .device-header { padding:14px 16px 8px; display:flex; flex-direction:column; gap:10px; }
      .title-row { display:flex; align-items:center; justify-content:space-between; }
      .screen-title { font-size:23px; line-height:28px; font-weight:500; letter-spacing:-.01em; }
      .header-actions { display:flex; align-items:center; gap:8px; }
      .active-count { height:34px; padding:0 12px; border-radius:17px; background:rgba(255,193,7,.15); display:flex; align-items:center; gap:6px; color:${COLORS.amber}; font-size:12px; font-weight:500; }
      .active-count i { width:7px; height:7px; border-radius:50%; background:${COLORS.amber}; }
      .round-action { width:38px; height:38px; border:1px solid ${COLORS.faint}; border-radius:50%; background:${COLORS.card}; color:rgba(225,225,225,.6); display:flex; align-items:center; justify-content:center; }
      .round-action ha-icon { width:21px; height:21px; }
      .filters { display:flex; align-items:center; gap:8px; overflow:hidden; }
      .filter { height:34px; padding:0 13px; border-radius:17px; border:1px solid ${COLORS.faint}; background:${COLORS.card}; color:rgba(225,225,225,.7); display:inline-flex; align-items:center; justify-content:center; gap:7px; font-size:13px; line-height:1; white-space:nowrap; }
      .filter.active { background:${COLORS.blue}; color:#0c0d0f; border-color:${COLORS.blue}; font-weight:500; }
      .filter-icon { width:18px; height:18px; flex:0 0 18px; display:grid; place-items:center; line-height:0; }
      .filter-icon ha-icon { width:16px; height:16px; display:block; --mdc-icon-size:16px; }
      .filter-label { display:block; line-height:16px; }
      .rooms { position:absolute; inset:104px 0 0; padding:4px 16px 96px; overflow-y:auto; scrollbar-width:none; display:flex; flex-direction:column; gap:10px; }
      .rooms::-webkit-scrollbar { display:none; }
      .room { flex:0 0 auto; border:1px solid ${COLORS.faint}; border-radius:16px; background:${COLORS.card}; overflow:hidden; }
      .room-head { width:100%; min-height:58px; padding:10px 14px; border:0; background:transparent; color:${COLORS.text}; display:flex; align-items:center; gap:11px; text-align:left; }
      .room-expand { min-width:0; flex:1 1 0; align-self:stretch; padding:0; border:0; background:transparent; color:${COLORS.text}; display:flex; align-items:center; gap:11px; text-align:left; }
      .room-icon { width:36px; height:36px; flex:0 0 36px; border-radius:11px; display:grid; place-items:center; line-height:0; }
      .room-icon ha-icon { width:20px; height:20px; display:block; --mdc-icon-size:20px; }
      .room-copy { min-width:0; flex:1 1 0; }
      .room-name { display:block; font-size:15px; line-height:18px; font-weight:500; }
      .room-meta { display:block; margin-top:2px; font-size:12px; line-height:15px; color:rgba(225,225,225,.45); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .toggle { width:46px; height:28px; flex:0 0 auto; padding:0; border:0; border-radius:14px; background:rgba(225,225,225,.14); position:relative; }
      .toggle::after { content:""; position:absolute; top:3px; left:3px; width:22px; height:22px; border-radius:50%; background:rgba(225,225,225,.55); transition:.18s ease; }
      .toggle.on::after { left:21px; background:${COLORS.bg}; }
      .chevron { width:22px; height:22px; color:rgba(225,225,225,.35); }
      .chevron-button { width:22px; height:32px; flex:0 0 auto; padding:0; border:0; background:transparent; color:inherit; display:flex; align-items:center; justify-content:center; }
      .device-tiles { padding:0 12px 10px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
      .device-tile { min-height:58px; min-width:0; padding:8px 10px; border-radius:12px; border:1px solid ${COLORS.faint}; background:rgba(225,225,225,.05); color:${COLORS.text}; display:flex; align-items:center; justify-content:flex-start; gap:9px; text-align:left; }
      .device-tile ha-icon { width:22px; height:22px; flex:0 0 22px; display:block; --mdc-icon-size:22px; }
      .device-copy { min-width:0; display:block; }
      .device-name { display:block; max-width:100%; font-size:11px; line-height:13px; font-weight:500; white-space:normal; overflow-wrap:anywhere; }
      .device-state { display:block; margin-top:2px; font-size:10px; line-height:11px; color:rgba(225,225,225,.45); }
      .bedroom-details { padding:0 12px 10px; display:flex; flex-direction:column; gap:8px; }
      .bedroom-device-grid { padding:0; grid-template-columns:repeat(2,minmax(0,1fr)); }
      .empty-filter { padding:40px 16px; color:rgba(225,225,225,.45); font-size:13px; text-align:center; }
      .climate-row { min-height:52px; padding:10px 12px; border-radius:12px; background:rgba(3,169,244,.12); border:1px solid rgba(3,169,244,.22); display:flex; align-items:center; gap:12px; }
      .climate-row > ha-icon { width:22px; height:22px; color:${COLORS.blue}; }
      .climate-copy { min-width:0; flex:1 1 0; }
      .climate-copy b { display:block; font-size:13px; line-height:16px; font-weight:500; }
      .climate-copy span { display:block; font-size:11px; line-height:14px; color:rgba(225,225,225,.45); }
      .climate-control { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500; }
      .circle-mini { width:30px; height:30px; border:0; border-radius:50%; background:rgba(225,225,225,.08); color:${COLORS.text}; display:flex; align-items:center; justify-content:center; }
      .circle-mini ha-icon { width:16px; height:16px; }
      .security-scroll,.settings-scroll { overflow-y:auto; }
      .section-title { margin:2px 0 -2px; font-size:15px; font-weight:500; color:${COLORS.text}; }
      .control-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .control-card { min-height:62px; padding:10px 12px; border-radius:14px; border:1px solid ${COLORS.faint}; background:${COLORS.card}; color:${COLORS.text}; display:flex; align-items:center; gap:10px; text-align:left; }
      .control-card ha-icon { width:22px; height:22px; color:rgba(225,225,225,.45); }
      .control-copy { min-width:0; flex:1 1 0; }
      .control-copy b { display:block; font-size:13px; font-weight:500; }
      .control-copy span { display:block; margin-top:2px; font-size:11px; color:rgba(225,225,225,.45); }
      .person-row,.system-row { min-height:60px; padding:10px 14px; border-radius:16px; border:1px solid ${COLORS.faint}; background:${COLORS.card}; display:flex; align-items:center; gap:11px; }
      .person-icon { width:38px; height:38px; border-radius:50%; background:rgba(225,225,225,.08); display:flex; align-items:center; justify-content:center; }
      .person-icon ha-icon { width:22px; height:22px; color:rgba(225,225,225,.55); }
      .row-copy { min-width:0; flex:1 1 0; }
      .row-copy b { display:block; font-size:14px; font-weight:500; }
      .row-copy span { display:block; margin-top:2px; font-size:12px; color:rgba(225,225,225,.45); }
      .energy-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .energy { min-height:92px; padding:13px; border-radius:16px; border:1px solid ${COLORS.faint}; background:${COLORS.card}; }
      .energy-head { display:flex; align-items:center; justify-content:space-between; color:rgba(225,225,225,.55); font-size:12px; }
      .energy-head ha-icon { width:18px; height:18px; }
      .energy-value { margin-top:12px; font-size:29px; line-height:32px; font-weight:300; }
      .energy-unit { font-size:12px; color:rgba(225,225,225,.45); }
      .night { position:absolute; inset:0; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; color:rgba(225,225,225,.42); }
      .night-time { font-size:96px; line-height:96px; font-weight:200; letter-spacing:-.03em; }
      .night-date { font-size:15px; color:rgba(225,225,225,.22); letter-spacing:.02em; }
      .night-status { margin-top:26px; display:grid; grid-template-columns:repeat(3,minmax(76px,auto)); align-items:center; justify-content:center; column-gap:18px; }
      .night-status-item { min-width:0; height:24px; display:inline-flex; align-items:center; justify-content:center; gap:7px; color:rgba(225,225,225,.3); font-size:14px; line-height:18px; white-space:nowrap; }
      .night-status-icon { width:18px; height:18px; flex:0 0 18px; display:grid; place-items:center; line-height:0; }
      .night-status-icon ha-icon { width:17px; height:17px; display:block; color:rgba(225,225,225,.22); --mdc-icon-size:17px; }
      .night-status-label { display:block; line-height:18px; }
      .wake { position:absolute; bottom:44px; left:0; right:0; text-align:center; color:rgba(225,225,225,.16); font:11px "Roboto Mono",monospace; letter-spacing:.08em; }
    `;
  }

  signature() {
    const screen = this.config?.screen || "home";
    const spotify = this.spotifyEntityId();
    const ids =
      screen === "home"
        ? ALL_CONTROLLABLE.concat([
            "weather.forecast_home",
            "person.dushyant",
            "camera.home_360",
            "sensor.bedroom_aircon_power",
            "sensor.geyser_power",
          ])
        : ALL_CONTROLLABLE.concat([
            "weather.forecast_home",
            "person.dushyant",
            "camera.home_360",
            "switch.home_360_motion_alarm",
            "switch.home_360_motion_tracking",
            "switch.home_360_video_recording",
            "switch.home_360_privacy_mode",
            "select.home_360_night_vision",
            "sensor.bedroom_aircon_power",
            "sensor.bedroom_aircon_total_energy",
            "sensor.geyser_power",
            "sensor.geyser_total_energy",
            "update.hacs_update",
          ]);
    if (spotify) ids.push(spotify);
    return `${screen}|${new Date().toISOString().slice(0, 16)}|${ids
      .map((id) => {
        const state = this.state(id);
        return [
          state?.state,
          state?.last_updated,
          state?.attributes?.icon,
          state?.attributes?.friendly_name,
          state?.attributes?.media_title,
        ].join("~");
      })
      .join("|")}`;
  }

  render(force = false) {
    if (!this.shadowRoot || !this.config || !this._hass) return;
    const signature = this.signature();
    if (!force && signature === this._signature) return;
    this._signature = signature;
    const screen = this.config.screen || "home";
    const hour = new Date().getHours();
    const forceAwake = new URLSearchParams(window.location.search).get("awake") === "1";
    const night =
      screen === "home" && !forceAwake && (hour >= 23 || hour < 7) && Date.now() > this._nightDismissedUntil;
    const content = night
      ? this.nightScreen()
      : screen === "devices"
        ? this.devicesScreen()
        : screen === "security"
          ? this.securityScreen()
          : screen === "settings"
            ? this.settingsScreen()
            : this.homeScreen();
    this.shadowRoot.innerHTML = `<style>${this.style()}</style><div class="panel">${content}</div>`;
    this.shadowRoot
      .querySelectorAll("[data-action]")
      .forEach((element) => element.addEventListener("click", this._handleClick));
    if (screen === "home") void this.ensureForecasts();
    void this.setupCameraCards();
  }

  forecastEntries(response) {
    const entityId = "weather.forecast_home";
    return (
      response?.[entityId]?.forecast ||
      response?.response?.[entityId]?.forecast ||
      response?.service_response?.[entityId]?.forecast ||
      []
    );
  }

  async ensureForecasts() {
    if (!this._hass?.callWS || this._forecastRequest || Date.now() - this._forecastFetchedAt < 30 * 60 * 1000) return;
    this._forecastRequest = Promise.all(
      ["hourly", "daily"].map(async (type) => {
        const response = await this._hass.callWS({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type },
          target: { entity_id: "weather.forecast_home" },
          return_response: true,
        });
        return [type, this.forecastEntries(response)];
      }),
    );
    try {
      const forecasts = await this._forecastRequest;
      this._forecastData = Object.fromEntries(forecasts);
      this._forecastFetchedAt = Date.now();
      this.render(true);
    } catch (error) {
      console.warn("Unable to load weather forecasts", error);
    } finally {
      this._forecastRequest = null;
    }
  }

  async setupCameraCards() {
    const stateObj = this.state("camera.home_360");
    const hosts = [...this.shadowRoot.querySelectorAll("[data-camera-host]")];
    if (!stateObj || !hosts.length || typeof window.loadCardHelpers !== "function") return;
    try {
      const helpers = await window.loadCardHelpers();
      for (const host of hosts) {
        if (!host.isConnected) continue;
        const card = await helpers.createCardElement({
          type: "picture-entity",
          entity: "camera.home_360",
          camera_view: "live",
          fit_mode: "cover",
          show_name: false,
          show_state: false,
          tap_action: { action: "none" },
          hold_action: { action: "none" },
        });
        card.hass = this._hass;
        host.replaceChildren(card);
      }
    } catch (error) {
      console.warn("Unable to load the Home 360 camera card", error);
    }
  }

  nav(active) {
    return `<nav class="nav">${NAV_ITEMS.map(([key, onIcon, offIcon, label, path]) => `<button class="nav-item ${key === active ? "active" : ""}" data-action="navigate" data-path="${path}" aria-label="${label}">${this.icon(key === active ? onIcon : offIcon)}<span>${label}</span></button>`).join("")}</nav>`;
  }

  formatClock() {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  }

  formatDate() {
    const now = new Date();
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(now);
    const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(now);
    return `${weekday}, ${date}`;
  }

  weatherIcon(condition) {
    const icons = {
      clear: "mdi:weather-sunny",
      sunny: "mdi:weather-sunny",
      cloudy: "mdi:weather-cloudy",
      rainy: "mdi:weather-rainy",
      pouring: "mdi:weather-pouring",
      lightning: "mdi:weather-lightning",
      fog: "mdi:weather-fog",
      snowy: "mdi:weather-snowy",
      partlycloudy: "mdi:weather-partly-cloudy",
    };
    return icons[condition] || "mdi:weather-partly-cloudy";
  }

  cameraFrame(label, height = 150) {
    const camera = this.state("camera.home_360");
    const picture = camera?.attributes?.entity_picture || "";
    return `<div class="camera ${picture ? "has-picture" : ""}" style="height:${height}px">
      ${picture ? `<img class="camera-fallback" src="${this.escape(picture)}" alt="${this.escape(this.entityName("camera.home_360"))}">` : '<span class="camera-placeholder">camera.home_360 · live snapshot</span>'}
      ${camera ? '<div class="native-camera-host" data-camera-host></div>' : ""}
      <div class="live-label"><i class="live-dot"></i><span>${this.escape(label)}</span></div><div class="camera-age">live</div>
    </div>`;
  }

  forecastItem(entry, type) {
    const date = new Date(entry?.datetime);
    const label = Number.isNaN(date.getTime())
      ? "--"
      : new Intl.DateTimeFormat("en-GB", type === "daily" ? { weekday: "short" } : { hour: "2-digit" }).format(date);
    const temperature = Number(entry?.temperature);
    const temperatureText = Number.isFinite(temperature) ? `${Math.round(temperature)}°` : "--";
    const condition = entry?.condition || "partlycloudy";
    return `<div class="forecast-item"><span>${this.escape(label)}</span>${this.icon(this.weatherIcon(condition))}<b>${temperatureText}</b></div>`;
  }

  weatherCard(weather) {
    const attributes = weather?.attributes || {};
    const condition = weather?.state || "partlycloudy";
    const temperature = Number(attributes.temperature);
    const temperatureText = Number.isFinite(temperature) ? `${Math.round(temperature)}°` : "--";
    const humidity = attributes.humidity == null ? "--" : `${Math.round(Number(attributes.humidity))}%`;
    const pressure =
      attributes.pressure == null
        ? "--"
        : `${Number(attributes.pressure).toFixed(1)} ${attributes.pressure_unit || ""}`.trim();
    const wind =
      attributes.wind_speed == null
        ? "--"
        : `${Number(attributes.wind_speed).toFixed(1)} ${attributes.wind_speed_unit || ""}`.trim();
    const hourly = (this._forecastData.hourly || []).slice(0, 5);
    const daily = (this._forecastData.daily || []).slice(0, 5);
    return `<section class="forecast-card">
      <div class="forecast-head"><div class="forecast-current">${this.entityIcon("weather.forecast_home", this.weatherIcon(condition))}<div class="forecast-current-copy"><b>${this.escape(condition.replaceAll("-", " "))}</b><span>Current conditions</span></div></div><div class="forecast-temp">${temperatureText}</div></div>
      <div class="weather-metrics">
        <div class="weather-metric">${this.icon("mdi:gauge")}<div class="weather-metric-copy"><b>${this.escape(pressure)}</b><span>Pressure</span></div></div>
        <div class="weather-metric">${this.icon("mdi:water-percent")}<div class="weather-metric-copy"><b>${this.escape(humidity)}</b><span>Humidity</span></div></div>
        <div class="weather-metric">${this.icon("mdi:weather-windy")}<div class="weather-metric-copy"><b>${this.escape(wind)}</b><span>Wind</span></div></div>
      </div>
      <div class="forecast-section"><div class="forecast-label">Hourly</div>${hourly.length ? `<div class="forecast-strip">${hourly.map((entry) => this.forecastItem(entry, "hourly")).join("")}</div>` : '<div class="forecast-empty">Loading hourly forecast…</div>'}</div>
      <div class="forecast-section"><div class="forecast-label">Daily</div>${daily.length ? `<div class="forecast-strip">${daily.map((entry) => this.forecastItem(entry, "daily")).join("")}</div>` : '<div class="forecast-empty">Loading daily forecast…</div>'}</div>
    </section>`;
  }

  mediaCard() {
    const entity = this.spotifyEntityId();
    if (!entity) {
      return `<button class="media-card" data-action="navigate" data-path="/config/integrations/dashboard/add?domain=spotifyplus"><div class="album">${this.icon("mdi:spotify")}</div><div class="media-copy"><div class="media-title">Connect SpotifyPlus</div><div class="media-sub">Finish setup in Home Assistant integrations</div><div class="progress"><span></span></div></div>${this.icon("mdi:chevron-right")}</button>`;
    }
    const state = this.state(entity);
    const attributes = state?.attributes || {};
    const playing = state?.state === "playing";
    const title = attributes.media_title || this.entityName(entity);
    const artist = attributes.media_artist || attributes.media_album_name || this.entityLabel(entity);
    const picture = attributes.entity_picture;
    const duration = Number(attributes.media_duration);
    const position = Number(attributes.media_position);
    const progress =
      Number.isFinite(duration) && duration > 0 && Number.isFinite(position)
        ? Math.min(100, (position / duration) * 100)
        : 0;
    return `<section class="media-card"><div class="album">${picture ? `<img src="${this.escape(picture)}" alt="">` : this.entityIcon(entity, "mdi:spotify")}</div><div class="media-copy"><div class="media-title">${this.escape(title)}</div><div class="media-sub">${this.escape(artist)}</div><div class="progress"><span style="width:${progress.toFixed(1)}%;background:#1ed760"></span></div></div><div class="media-actions"><button class="media-action" data-action="media-action" data-entity="${entity}" data-service="media_previous_track" aria-label="Previous track">${this.icon("mdi:skip-previous")}</button><button class="media-action primary" data-action="media-action" data-entity="${entity}" data-service="${playing ? "media_pause" : "media_play"}" aria-label="${playing ? "Pause" : "Play"}">${this.icon(playing ? "mdi:pause" : "mdi:play")}</button><button class="media-action" data-action="media-action" data-entity="${entity}" data-service="media_next_track" aria-label="Next track">${this.icon("mdi:skip-next")}</button></div></section>`;
  }

  homeScreen() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const weather = this.state("weather.forecast_home");
    const temp = Math.round(Number(weather?.attributes?.temperature) || 0);
    const humidity = weather?.attributes?.humidity;
    const condition = weather?.state || "partlycloudy";
    const power =
      this.number("sensor.bedroom_aircon_power") +
      this.number("sensor.geyser_power") +
      this.number("sensor.bedroom_extension_power");
    const powerText = power >= 1000 ? `${(power / 1000).toFixed(1)} kW` : `${power.toFixed(1)} W`;
    const lightsOn = LIGHT_ENTITIES.filter((id) => this.isOn(id)).length;
    const peopleHome = ["person.dushyant"].filter((id) => this.state(id)?.state === "home").length;
    const motionOn = this.isOn("switch.home_360_motion_alarm");
    const recordingOn = this.isOn("switch.home_360_video_recording");
    return `
      <main class="scroll home-scroll">
        <section class="top">
          <div><div class="greeting">${greeting}</div><div class="clock">${this.formatClock()}</div><div class="date">${this.formatDate()}</div></div>
          <div class="weather"><div class="weather-main">${this.entityIcon("weather.forecast_home", this.weatherIcon(condition))}<span class="temperature">${temp}°</span></div><div class="weather-detail">${this.escape(condition.replaceAll("-", " "))} · ${humidity == null ? "Weather" : `${humidity}% RH`}</div></div>
        </section>
        <section class="chips">
          <div class="chip"><span class="chip-icon">${this.icon("mdi:water-percent")}</span><span class="chip-label">${humidity == null ? "--" : `${humidity}%`}</span></div>
          <div class="chip"><span class="chip-icon">${this.icon("mdi:flash")}</span><span class="chip-label">${powerText}</span></div>
          <div class="chip"><span class="chip-icon">${this.icon("mdi:lightbulb")}</span><span class="chip-label">${lightsOn} on</span></div>
          <div class="chip"><span class="chip-icon">${this.icon("mdi:account-group")}</span><span class="chip-label">${peopleHome}</span></div>
        </section>
        ${this.weatherCard(weather)}
        <section class="camera-card" data-action="navigate" data-path="/wall-panel/security">
          ${this.cameraFrame("HOME CAMERA")}
          <div class="camera-status">
            <div class="status-part">${this.icon("mdi:record-rec")}<span>${recordingOn ? "Recording" : "Standby"}</span></div><i class="divider"></i>
            <div class="status-part">${this.icon("mdi:motion-sensor")}<span>${motionOn ? "Motion on" : "No alarm"}</span></div><i class="divider"></i>
            <div class="status-part">${this.icon("mdi:shield-home")}<span>Home</span></div>
          </div>
        </section>
        <section class="quick-grid">
          ${this.quickTile("switch.hall_switch_switch_1", "Living lights", "mdi:sofa", "amber")}
          ${this.quickTile("switch.bedroom_switch_switch_1", "Bedroom fan", "mdi:ceiling-fan", "neutral")}
          ${this.quickTile("switch.bedroom_aircon_socket_1", "Bedroom AC", "mdi:air-conditioner", "blue", `${this.entityLabel("switch.bedroom_aircon_socket_1")} · ${this.number("sensor.bedroom_aircon_power").toFixed(1)} W`)}
          <button class="quick" data-action="all-off"><span class="quick-icon">${this.icon("mdi:power")}</span><span class="quick-text"><span class="quick-name">Everything off</span><span class="quick-state">${ALL_CONTROLLABLE.length} devices</span></span></button>
        </section>
        ${this.mediaCard()}
        <section class="alert" data-action="navigate" data-path="/wall-panel/security">${this.icon(motionOn ? "mdi:motion-sensor" : "mdi:shield-check")}<span>${motionOn ? "Home camera motion alarm is enabled" : "Security monitoring is ready"}</span>${this.icon("mdi:chevron-right")}</section>
      </main>${this.nav("home")}`;
  }

  quickTile(entity, name, icon, color, stateText = null) {
    const on = this.isOn(entity);
    const tone = color === "blue" ? COLORS.blue : color === "amber" ? COLORS.amber : "rgba(225,225,225,.45)";
    const activeClass = on && color !== "neutral" ? `active-${color}` : "";
    const iconBg = on && color !== "neutral" ? `${tone}33` : "rgba(225,225,225,.08)";
    return `<button class="quick ${activeClass}" data-action="toggle" data-entity="${entity}"><span class="quick-icon" style="background:${iconBg};color:${on ? tone : "rgba(225,225,225,.45)"}">${this.entityIcon(entity, icon)}</span><span class="quick-text"><span class="quick-name">${name}</span><span class="quick-state">${stateText || this.entityLabel(entity)}</span></span></button>`;
  }

  devicesScreen() {
    const active = ALL_CONTROLLABLE.filter((id) => this.isOn(id)).length;
    const rooms = ROOM_DATA.map((room) => this.roomCard(room)).filter(Boolean);
    return `
      <header class="device-header"><div class="title-row"><div class="screen-title">Devices</div><div class="header-actions"><div class="active-count"><i></i>${active} active</div><button class="round-action">${this.icon("mdi:magnify")}</button></div></div><div class="filters">${this.filterButton("all", "mdi:shape", "All")}${this.filterButton("lights", "mdi:lightbulb-outline", "Lights")}${this.filterButton("climate", "mdi:thermostat", "Climate")}${this.filterButton("media", "mdi:play-box-outline", "Media")}</div></header>
      <main class="rooms">${rooms.length ? rooms.join("") : '<div class="empty-filter">No devices in this category</div>'}</main>${this.nav("devices")}`;
  }

  filterButton(id, icon, label) {
    return `<button class="filter ${this._filter === id ? "active" : ""}" data-action="filter" data-filter="${id}"><span class="filter-icon">${this.icon(icon)}</span><span class="filter-label">${label}</span></button>`;
  }

  roomDevices(room) {
    if (this._filter === "all") return room.devices;
    return room.devices.filter((device) => device[3] === this._filter);
  }

  roomCard(room) {
    const devices = this.roomDevices(room);
    if (!devices.length) return "";
    const visibleEntities = [...new Set(devices.map((device) => device[0]).filter(Boolean))];
    const toggleEntities = this.roomToggleEntities(room);
    const onCount = visibleEntities.filter((id) => this.isOn(id)).length;
    const availableCount = visibleEntities.filter((id) => this.available(id)).length;
    const groupOn = onCount > 0;
    const expanded = this._expandedRooms.has(room.id);
    const meta =
      availableCount === 0
        ? `${devices.length} devices unavailable`
        : onCount
          ? `${onCount} of ${devices.length} on`
          : `${devices.length} devices · all off`;
    let details = "";
    if (expanded) {
      details =
        room.id === "bedroom"
          ? this.bedroomDetails(devices)
          : `<div class="device-tiles">${devices.map((device) => this.deviceTile(device)).join("")}</div>`;
    }
    return `<section class="room"><div class="room-head"><button class="room-expand" data-action="expand" data-room="${room.id}" aria-expanded="${expanded}"><span class="room-icon" style="background:${room.color}25;color:${room.color}">${this.icon(room.icon)}</span><span class="room-copy"><span class="room-name">${room.name}</span><span class="room-meta">${meta}</span></span></button>${toggleEntities.length ? `<button class="toggle ${groupOn ? "on" : ""}" style="${groupOn ? `background:${room.color}` : ""}" data-action="room-toggle" data-room="${room.id}" aria-label="Toggle ${room.name}"></button>` : ""}<button class="chevron-button" data-action="expand" data-room="${room.id}" aria-label="${expanded ? "Collapse" : "Expand"} ${room.name}">${this.icon(expanded ? "mdi:chevron-up" : "mdi:chevron-down", "chevron")}</button></div>${details}</section>`;
  }

  roomToggleEntities(room) {
    const visibleEntities = new Set(
      this.roomDevices(room)
        .filter((device) => device[4] !== "more-info")
        .map((device) => device[0]),
    );
    return room.entities.filter((entity) => visibleEntities.has(entity) && this.available(entity));
  }

  deviceTile([entity, icon, color, , action = "toggle"]) {
    const on = this.isOn(entity);
    return `<button class="device-tile" style="${on ? `background:${color}1f;border-color:${color}40` : ""}" data-action="${action}" data-entity="${entity}">${this.entityIcon(entity, icon)}<span class="device-copy"><span class="device-name">${this.escape(this.entityName(entity))}</span><span class="device-state">${this.entityLabel(entity)}</span></span></button>`;
  }

  bedroomDetails(devices) {
    const aircon = devices.find((device) => device[0] === "switch.bedroom_aircon_socket_1");
    const otherDevices = devices.filter((device) => device !== aircon);
    const airconRow = aircon
      ? `<div class="climate-row" data-action="toggle" data-entity="switch.bedroom_aircon_socket_1">${this.entityIcon("switch.bedroom_aircon_socket_1", "mdi:air-conditioner")}<div class="climate-copy"><b>${this.escape(this.entityName("switch.bedroom_aircon_socket_1"))}</b><span>${this.entityLabel("switch.bedroom_aircon_socket_1")} · ${this.number("sensor.bedroom_aircon_power").toFixed(1)} W</span></div><div class="climate-control"><span>Power</span><span class="toggle ${this.isOn("switch.bedroom_aircon_socket_1") ? "on" : ""}" style="${this.isOn("switch.bedroom_aircon_socket_1") ? `background:${COLORS.blue}` : ""}"></span></div></div>`
      : "";
    const deviceGrid = otherDevices.length
      ? `<div class="device-tiles bedroom-device-grid">${otherDevices.map((device) => this.deviceTile(device)).join("")}</div>`
      : "";
    return `<div class="bedroom-details">${airconRow}${deviceGrid}</div>`;
  }

  securityScreen() {
    return `<main class="scroll security-scroll"><div class="screen-title">Security</div><div class="date" style="margin-top:-10px">Home camera and alerts</div><section class="camera-card">${this.cameraFrame("HOME 360", 250)}</section><div class="control-grid">${this.controlCard("switch.home_360_motion_alarm", "Motion alarm", "mdi:motion-sensor", COLORS.orange)}${this.controlCard("switch.home_360_motion_tracking", "Tracking", "mdi:target-account", COLORS.blue)}${this.controlCard("switch.home_360_video_recording", "Recording", "mdi:record-rec", COLORS.red)}${this.controlCard("switch.home_360_privacy_mode", "Privacy", "mdi:eye-off", COLORS.purple)}</div><section class="person-row"><span class="person-icon">${this.entityIcon("person.dushyant", "mdi:account")}</span><div class="row-copy"><b>${this.escape(this.entityName("person.dushyant"))}</b><span>${this.presenceLabel("person.dushyant")}</span></div><span style="color:${this.state("person.dushyant")?.state === "home" ? COLORS.green : COLORS.muted}">${this.entityIcon("person.dushyant", "mdi:home-account")}</span></section><section class="system-row" data-action="more-info" data-entity="siren.home_360_siren"><span class="room-icon" style="background:${COLORS.red}20;color:${COLORS.red}">${this.entityIcon("siren.home_360_siren", "mdi:alarm-light")}</span><div class="row-copy"><b>${this.escape(this.entityName("siren.home_360_siren"))}</b><span>${this.entityLabel("siren.home_360_siren")} · tap for controls</span></div>${this.icon("mdi:chevron-right", "chevron")}</section><div class="section-title">Camera preferences</div><section class="system-row" data-action="select-next" data-entity="select.home_360_night_vision"><span class="room-icon" style="background:${COLORS.blue}20;color:${COLORS.blue}">${this.entityIcon("select.home_360_night_vision", "mdi:weather-night")}</span><div class="row-copy"><b>${this.escape(this.entityName("select.home_360_night_vision"))}</b><span>${this.entityLabel("select.home_360_night_vision")} · tap to change</span></div>${this.icon("mdi:swap-horizontal", "chevron")}</section></main>${this.nav("security")}`;
  }

  controlCard(entity, name, icon, color) {
    const on = this.isOn(entity);
    return `<button class="control-card" data-action="toggle" data-entity="${entity}" style="${on ? `border-color:${color}45;background:${color}14` : ""}"><span style="color:${on ? color : COLORS.muted}">${this.entityIcon(entity, icon)}</span><span class="control-copy"><b>${name}</b><span>${this.entityLabel(entity)}</span></span><span class="toggle ${on ? "on" : ""}" style="${on ? `background:${color}` : ""}"></span></button>`;
  }

  settingsScreen() {
    return `<main class="scroll settings-scroll"><div class="screen-title">Settings</div><div class="date" style="margin-top:-10px">Energy, utilities and system</div><div class="section-title">Energy</div><div class="energy-grid">${this.energyCard("sensor.bedroom_aircon_power", "Aircon power", "mdi:flash", "W")}${this.energyCard("sensor.geyser_power", "Geyser power", "mdi:water-boiler", "W")}${this.energyCard("sensor.bedroom_aircon_total_energy", "Aircon energy", "mdi:lightning-bolt", "kWh")}${this.energyCard("sensor.geyser_total_energy", "Geyser energy", "mdi:water-boiler", "kWh")}</div><div class="section-title">Utilities</div><div class="control-grid">${this.controlCard("switch.bedroom_aircon_socket_1", "Air conditioner", "mdi:air-conditioner", COLORS.blue)}${this.controlCard("switch.geyser_socket_1", "Geyser", "mdi:water-boiler", COLORS.orange)}</div><div class="section-title">System</div>${this.hacsInfo()}${this.systemInfo("sensor.backup_backup_manager_state", "Backup manager", "mdi:backup-restore", COLORS.green)}<section class="system-row"><span class="room-icon" style="background:${COLORS.purple}20;color:${COLORS.purple}">${this.icon("mdi:weather-night")}</span><div class="row-copy"><b>Night display</b><span>Automatic from 23:00 to 07:00</span></div></section></main>${this.nav("settings")}`;
  }

  energyCard(entity, name, icon, fallbackUnit) {
    const state = this.state(entity);
    const raw = state?.state;
    const value = raw && !["unknown", "unavailable"].includes(raw) ? raw : "--";
    const unit = state?.attributes?.unit_of_measurement || fallbackUnit;
    return `<section class="energy" data-action="more-info" data-entity="${entity}"><div class="energy-head"><span>${name}</span>${this.entityIcon(entity, icon)}</div><div class="energy-value">${this.escape(value)} <span class="energy-unit">${this.escape(unit)}</span></div></section>`;
  }

  systemInfo(entity, name, icon, color) {
    return `<section class="system-row" data-action="more-info" data-entity="${entity}"><span class="room-icon" style="background:${color}20;color:${color}">${this.entityIcon(entity, icon)}</span><div class="row-copy"><b>${name}</b><span>${this.entityLabel(entity)}</span></div>${this.icon("mdi:chevron-right", "chevron")}</section>`;
  }

  hacsInfo() {
    const update = this.state("update.hacs_update");
    const installed = update?.attributes?.installed_version;
    const latest = update?.attributes?.latest_version;
    const status =
      update?.state === "on"
        ? `Update available${latest ? ` · ${latest}` : ""}`
        : update?.state === "off"
          ? `Up to date${installed ? ` · ${installed}` : ""}`
          : this.entityLabel("update.hacs_update");
    const color = update?.state === "on" ? COLORS.amber : COLORS.green;
    return `<section class="system-row"><span class="room-icon" style="background:${color}20;color:${color}">${this.entityIcon("update.hacs_update", update?.state === "on" ? "mdi:store-alert" : "mdi:store-check")}</span><div class="row-copy"><b>HACS</b><span>${this.escape(status)}</span></div>${this.icon(update?.state === "on" ? "mdi:alert-circle-outline" : "mdi:check-circle-outline", "chevron")}</section>`;
  }

  nightScreen() {
    const weather = this.state("weather.forecast_home");
    const tempValue = Number(weather?.attributes?.temperature);
    const temp = Number.isFinite(tempValue) ? `${Math.round(tempValue)}°` : "--";
    const condition = weather?.state || "partlycloudy";
    const presence = this.presenceLabel("person.dushyant");
    const lightsOn = LIGHT_ENTITIES.filter((id) => this.isOn(id)).length;
    return `<section class="night" data-action="wake"><div class="night-time">${this.formatClock()}</div><div class="night-date">${this.formatDate()}</div><div class="night-status"><span class="night-status-item"><span class="night-status-icon">${this.entityIcon("weather.forecast_home", this.weatherIcon(condition))}</span><span class="night-status-label">${temp}</span></span><span class="night-status-item"><span class="night-status-icon">${this.entityIcon("person.dushyant", presence === "Home" ? "mdi:home-account" : "mdi:account-arrow-right")}</span><span class="night-status-label">${this.escape(presence)}</span></span><span class="night-status-item"><span class="night-status-icon">${this.icon(lightsOn ? "mdi:lightbulb" : "mdi:lightbulb-off-outline")}</span><span class="night-status-label">${lightsOn ? `${lightsOn} on` : "All off"}</span></span></div><div class="wake">TAP ANYWHERE TO WAKE</div></section>`;
  }

  async handleClick(event) {
    const target = event.currentTarget?.dataset?.action
      ? event.currentTarget
      : event.composedPath().find((item) => item?.dataset?.action);
    if (!target || !this._hass) return;
    event.stopPropagation();
    const action = target.dataset.action;
    if (action === "navigate") {
      history.pushState(null, "", target.dataset.path);
      window.dispatchEvent(new Event("location-changed"));
      return;
    }
    if (action === "toggle") {
      await this._hass.callService("homeassistant", "toggle", { entity_id: target.dataset.entity });
      return;
    }
    if (action === "media-action") {
      await this._hass.callService("media_player", target.dataset.service, {
        entity_id: target.dataset.entity,
      });
      return;
    }
    if (action === "all-off") {
      await this._hass.callService("homeassistant", "turn_off", { entity_id: ALL_CONTROLLABLE });
      return;
    }
    if (action === "room-toggle") {
      const room = ROOM_DATA.find((item) => item.id === target.dataset.room);
      const entities = this.roomToggleEntities(room);
      if (!entities.length) return;
      const turnOn = !entities.some((entity) => this.isOn(entity));
      await this._hass.callService("homeassistant", turnOn ? "turn_on" : "turn_off", { entity_id: entities });
      return;
    }
    if (action === "expand") {
      const id = target.dataset.room;
      if (this._expandedRooms.has(id)) this._expandedRooms.delete(id);
      else this._expandedRooms.add(id);
      this.render(true);
      return;
    }
    if (action === "filter") {
      this._filter = target.dataset.filter;
      this.render(true);
      return;
    }
    if (action === "select-next") {
      const entity = target.dataset.entity;
      const state = this.state(entity);
      const options = state?.attributes?.options || [];
      if (!options.length) return;
      const currentIndex = options.indexOf(state.state);
      const option = options[(currentIndex + 1) % options.length];
      await this._hass.callService("select", "select_option", { entity_id: entity, option });
      return;
    }
    if (action === "more-info") {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: target.dataset.entity },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    if (action === "wake") {
      this._nightDismissedUntil = Date.now() + 15 * 60 * 1000;
      this.render(true);
    }
  }
}

if (!customElements.get("simply-home-dashboard")) {
  customElements.define("simply-home-dashboard", SimplyHomeDashboard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "simply-home-dashboard",
  name: "Simply Home Dashboard",
  description: "Pixel-matched 480×800 wall panel dashboard",
  preview: true,
});
