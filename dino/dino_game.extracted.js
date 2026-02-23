const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuHome = document.getElementById("menuHome");
    const shopView = document.getElementById("shopView");
    const titlesView = document.getElementById("titlesView");
    const globalRankingView = document.getElementById("globalRankingView");
    const prestigeView = document.getElementById("prestigeView");
    const aboutView = document.getElementById("aboutView");
    const profilesView = document.getElementById("profilesView");
    const menuTitle = document.getElementById("menuTitle");
    const menuText = document.getElementById("menuText");
    const weeklyBadge = document.getElementById("weeklyBadge");
    const menuBtn = document.getElementById("menuBtn");
    const prestigeBtn = document.getElementById("prestigeBtn");
    const profilesOpenBtn = document.getElementById("profilesOpenBtn");
    const prestigeBackBtn = document.getElementById("prestigeBackBtn");
    const prestigeExchangeBtn = document.getElementById("prestigeExchangeBtn");
    const prestigeLevelUpBtn = document.getElementById("prestigeLevelUpBtn");
    const prestigeLevelUp10Btn = document.getElementById("prestigeLevelUp10Btn");
    const prestigeLevelUp100Btn = document.getElementById("prestigeLevelUp100Btn");
    const aboutOpenBtn = document.getElementById("aboutOpenBtn");
    const aboutBackBtn = document.getElementById("aboutBackBtn");
    const profilesBackBtn = document.getElementById("profilesBackBtn");
    const profileCreateBtn = document.getElementById("profileCreateBtn");
    const profileDeleteBtn = document.getElementById("profileDeleteBtn");
    const titlesOpenBtn = document.getElementById("titlesOpenBtn");
    const titlesBackBtn = document.getElementById("titlesBackBtn");
    const globalRankingOpenBtn = document.getElementById("globalRankingOpenBtn");
    const globalRankingBackBtn = document.getElementById("globalRankingBackBtn");
    const titlesInfo = document.getElementById("titlesInfo");
    const globalRankingInfo = document.getElementById("globalRankingInfo");
    const shopOpenBtn = document.getElementById("shopOpenBtn");
    const shopBackBtn = document.getElementById("shopBackBtn");
    const skinList = document.getElementById("skinList");
    const titleText = document.getElementById("titleText");
    const achievementList = document.getElementById("achievementList");
    const missionList = document.getElementById("missionList");
    const rankingList = document.getElementById("rankingList");
    const globalRankingList = document.getElementById("globalRankingList");
    const weeklyList = document.getElementById("weeklyList");
    const allTitlesList = document.getElementById("allTitlesList");
    const prestigeInfo = document.getElementById("prestigeInfo");
    const prestigeList = document.getElementById("prestigeList");
    const prestigeExchangeInput = document.getElementById("prestigeExchangeInput");
    const profilesInfo = document.getElementById("profilesInfo");
    const profilesList = document.getElementById("profilesList");
    const profileNameInput = document.getElementById("profileNameInput");
    const marketInfo = document.getElementById("marketInfo");
    const marketOfferList = document.getElementById("marketOfferList");
    const upgradeInfo = document.getElementById("upgradeInfo");
    const upgradeList = document.getElementById("upgradeList");
    const exchangeInput = document.getElementById("exchangeInput");
    const exchangeBtn = document.getElementById("exchangeBtn");
    const exchangeAllBtn = document.getElementById("exchangeAllBtn");
    const commandPanel = document.getElementById("commandPanel");
    const commandInput = document.getElementById("commandInput");
    const commandMsg = document.getElementById("commandMsg");
    const commandHint = document.getElementById("commandHint");
    const nameOverlay = document.getElementById("nameOverlay");
    const nameInput = document.getElementById("nameInput");
    const nameSaveBtn = document.getElementById("nameSaveBtn");
    const nameError = document.getElementById("nameError");

    const GROUND_Y = 210;
    const GRAVITY = 0.72;
    const SKINS = [
      { id: "classic", name: "Classic", color: "#222", eye: "#fff", shape: "Normal", variant: "classic" },
      { id: "mario", name: "Mario", color: "#d22626", eye: "#fff", shape: "Gorra i bigoti", variant: "mario" },
      { id: "sonic", name: "Sonic", color: "#1d63d8", eye: "#f8f1de", shape: "Punxes", variant: "sonic" },
      { id: "hollow", name: "Hollow Knight", color: "#121212", eye: "#f6f6f6", shape: "Màscara i banyes", variant: "hollow" },
      { id: "silksong", name: "Silksong", color: "#d42b36", eye: "#fff7f7", shape: "Capa i agulles", variant: "silksong" },
      { id: "shrek", name: "Shrek", color: "#73a942", eye: "#fff8dc", shape: "Ogre", variant: "shrek" }
    ];

    const dino = {
      x: 86,
      y: GROUND_Y - 48,
      w: 42,
      h: 48,
      vy: 0,
      onGround: true,
      ducking: false
    };

    let speed = 7;
    let score = 0;
    let best = Number(localStorage.getItem("dino-best") || 0);
    let obstacles = [];
    let clouds = [];
    let hills = [];
    let particles = [];
    let frame = 0;
    let gameOver = false;
    let started = false;
    let inMenu = true;
    let inShop = false;
    let commandOpen = false;
    let commandHistory = [];
    let commandHistoryIndex = -1;
    let landingSquashFrames = 0;
    let impactFlashFrames = 0;
    let impactRingFrames = 0;
    let deathSpinFrames = 0;
    const DEFAULT_GOD_MODE = false;
    const DEFAULT_START_SPEED = 7;
    const DEFAULT_BASE_JUMP_VELOCITY = -13.3;
    const DEFAULT_JUMP_SPEED_FACTOR = 1;
    const DEFAULT_GRAVITY_VALUE = GRAVITY;
    let godMode = DEFAULT_GOD_MODE;
    let selectedSkinId = localStorage.getItem("dino-skin") || "classic";
    let jumpHeld = false;
    let jumpHoldFrames = 0;
    let baseJumpVelocity = DEFAULT_BASE_JUMP_VELOCITY;
    let jumpSpeedFactor = DEFAULT_JUMP_SPEED_FACTOR;
    let startSpeed = DEFAULT_START_SPEED;
    let gravityValue = DEFAULT_GRAVITY_VALUE;
    const SKIN_COIN_COSTS = {
      hollow: 350,
      silksong: 700
    };
    const DEFAULT_UNLOCKED_SKINS = ["classic", "mario", "sonic", "shrek"];
    let unlockedSkins = new Set();
    let coins = Number(localStorage.getItem("dino-coins") || 0);
    let missionPoints = Number(localStorage.getItem("dino-mission-points") || 0);
    let prestigeLevel = Number(localStorage.getItem("dino-prestige-level") || 0);
    let prestigePoints = Number(localStorage.getItem("dino-prestige-points") || 0);
    let runJumps = 0;
    let runMode = "normal";
    let shakeFrames = 0;
    let weeklyFinisherFrames = 0;
    let biomeFlash = 0;
    let currentBiomeId = "dawn";
    const BIOMES = [
      { id: "dawn", from: 0, sky: "#f7fbff", hill: "#ececec", cloud: "#f2f2f2", ground: "#fafafa", line: "#2d2d2d", dust: "#8c8c8c", cactus: "#2e6f3b", cactusLight: "#3f9850", bird: "#444" },
      { id: "day", from: 600, sky: "#e9f4ff", hill: "#dde7f2", cloud: "#f6fbff", ground: "#f4f8ff", line: "#2d3b47", dust: "#7e8ca0", cactus: "#2b7c52", cactusLight: "#4ca06d", bird: "#2d3b47" },
      { id: "sunset", from: 1800, sky: "#ffe8d6", hill: "#f6d2bf", cloud: "#fff1e7", ground: "#fff4ec", line: "#503739", dust: "#a08075", cactus: "#7b5a2d", cactusLight: "#a1763f", bird: "#503739" },
      { id: "night", from: 3200, sky: "#10182b", hill: "#1c2740", cloud: "#2a3553", ground: "#172033", line: "#aab6d6", dust: "#5a6688", cactus: "#3d8b77", cactusLight: "#5cb49f", bird: "#d6def5" }
    ];
    const ACHIEVEMENT_DEFS = [
      { id: "scout", title: "Explorador", desc: "Alcanza 500 puntos", check: (s) => s.best >= 500 },
      { id: "veteran", title: "Veterano", desc: "Alcanza 2000 puntos", check: (s) => s.best >= 2000 },
      { id: "collector", title: "Coleccionista", desc: "Consigue 1000 monedas", check: (s) => s.coins >= 1000 },
      { id: "jumper", title: "Saltador", desc: "Haz 300 saltos", check: (s) => s.totalJumps >= 300 },
      { id: "challenger", title: "Retador", desc: "Gana 3 desafíos semanales", check: (s) => s.challengeWins >= 3 }
    ];
    const TITLE_ORDER = ["Novato", "Explorador", "Veterano", "Coleccionista", "Saltador", "Retador"];
    const MISSION_TITLE_SHOP = [
      { id: "leyenda", title: "Leyenda", desc: "Título premium de misión", cost: 150 },
      { id: "sombra", title: "Sombra Rápida", desc: "Para corredores precisos", cost: 260 },
      { id: "rey", title: "Rey del Desierto", desc: "Dominador del bioma final", cost: 400 }
    ];
    const DAILY_EXCLUSIVES = [
      { id: "title_storm", type: "exclusive_title", title: "Tormenta Viva", label: "Título exclusivo: Tormenta Viva", value: "Tormenta Viva", cost: 220 },
      { id: "title_void", type: "exclusive_title", title: "Eco del Vacío", label: "Título exclusivo: Eco del Vacío", value: "Eco del Vacío", cost: 280 },
      { id: "title_royal", type: "exclusive_title", title: "Corona Dorada", label: "Título exclusivo: Corona Dorada", value: "Corona Dorada", cost: 340 },
      { id: "skin_exclusive", type: "exclusive_skin", label: "Skin exclusiva diaria", value: 1, cost: 320 },
      { id: "pp_exclusive", type: "exclusive_pp", label: "Pack exclusivo +20 PP", value: 20, cost: 260 }
    ];
    const COMMAND_CATALOG = [
      "help", "skin", "title", "buytitle", "prestige", "prestigestatus", "setprestige",
      "speed", "gravity", "jump", "score", "best", "resetbest", "resetrecord",
      "coins", "setcoins", "missionpoints", "mp", "setmissionpoints", "setmp",
      "missions", "missionnew", "newmissions", "missioncomplete", "missionprogress",
      "missiontarget", "missionreward", "market", "marketbuy", "upgrades", "upgradebuy",
      "profiles", "profileuse", "profilecreate", "profiledelete", "onlinestatus",
      "onlineconfig", "onlineclear", "onlinerank", "onlinesync", "myname", "setname",
      "globalrank", "grank", "resetglobalrank", "unlockall", "allunlock",
      "unlockeverything", "resetall", "fullreset", "god", "start", "menu", "reset", "clear"
    ];
    const RARITY_MULT = { common: 1, rare: 1.18, epic: 1.36, legendary: 1.62 };
    const RARITY_LABEL = { common: "COMUN", rare: "RARO", epic: "EPICO", legendary: "LEGENDARIO" };
    const UPGRADE_DEFS = [
      { id: "jump_core", name: "Nucleo de salto", desc: "+6% altura de salto por nivel", max: 10, baseCost: 85 },
      { id: "mission_boost", name: "Amplificador PM", desc: "+8% PM de misiones por nivel", max: 10, baseCost: 95 },
      { id: "coin_boost", name: "Iman de monedas", desc: "+15% monedas bonus por nivel", max: 8, baseCost: 110 }
    ];
    let achievementsUnlocked = new Set();
    let purchasedTitles = new Set();
    let unlockedExclusiveTitles = new Set();
    let unlockedExclusives = new Set();
    let activeTitle = "Novato";
    let rankings = [];
    let globalRanking = {};
    let machineGlobalRanking = {};
    let playerName = "";
    let stats = { games: 0, totalScore: 0, totalJumps: 0, challengeWins: 0 };
    let dailyMissions = null;
    let missionNotice = "";
    let weeklyProgress = { id: "", bestRun: 0, completed: false };
    let marketState = { day: "", offers: [] };
    let upgradeLevels = { jump_core: 0, mission_boost: 0, coin_boost: 0 };
    let runGhostFrames = [];
    let bestGhostFrames = [];
    let ghostBestScore = Number(localStorage.getItem("dino-ghost-best") || 0);
    let profilesState = { active: "Principal", list: ["Principal"], data: {} };
    let profileSwitching = false;
    let supabaseUrl = localStorage.getItem("dino-supabase-url") || "";
    let supabaseAnonKey = localStorage.getItem("dino-supabase-anon-key") || "";
    const ONLINE_TABLE = "dino_leaderboard";
    let supabaseClient = null;
    let onlineReady = false;
    let onlineLeaderboard = [];
    let onlineSyncInFlight = false;
    const WEEKLY = (() => {
      const now = new Date();
      const first = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const day = Math.floor((now - first) / 86400000);
      const week = Math.floor((day + first.getUTCDay()) / 7);
      const id = `${now.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
      const seed = week + now.getUTCFullYear();
      const speedMult = 1.12 + (seed % 4) * 0.05;
      const gravityMult = 1 + (seed % 3) * 0.06;
      const target = 1400 + (seed % 6) * 180;
      return { id, speedMult, gravityMult, target };
    })();
    const DINO_ASSETS = {
      classic: { src: "assets_dino/dino.png", w: 72, h: 72, yOffset: -20 },
      mario: { src: "assets_dino/mario.png", w: 72, h: 72, yOffset: -20 },
      sonic: { src: "assets_dino/sonic.png", w: 72, h: 72, yOffset: -20 },
      shrek: { src: "assets_dino/dino.png", w: 72, h: 72, yOffset: -20 },
      hollow: { src: "assets_dino/HollowKnight.png", w: 70, h: 78, yOffset: -24 },
      silksong: { src: "assets_dino/hornet.png", w: 66, h: 74, yOffset: -22 }
    };
    const loadedDinoAssets = {};
    const ASSET_VERSION = Date.now();

    for (const [variant, conf] of Object.entries(DINO_ASSETS)) {
      const img = new Image();
      img.src = `${conf.src}?v=${ASSET_VERSION}`;
      loadedDinoAssets[variant] = img;
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function initSky() {
      clouds = [];
      hills = [];
      for (let i = 0; i < 5; i++) {
        clouds.push({
          x: rand(40, canvas.width - 120),
          y: rand(25, 95),
          w: rand(48, 88),
          h: rand(16, 24)
        });
      }
      for (let i = 0; i < 4; i++) {
        hills.push({
          x: i * 260 + rand(-20, 40),
          w: rand(180, 250),
          h: rand(24, 48)
        });
      }
    }

    function saveRankings() {
      localStorage.setItem("dino-rankings", JSON.stringify(rankings));
    }

    function saveWeeklyProgress() {
      localStorage.setItem("dino-weekly-progress", JSON.stringify(weeklyProgress));
    }

    function loadWeeklyProgress() {
      try {
        const raw = JSON.parse(localStorage.getItem("dino-weekly-progress") || "{}");
        weeklyProgress = {
          id: String(raw.id || ""),
          bestRun: Number(raw.bestRun || 0),
          completed: Boolean(raw.completed)
        };
      } catch {
        weeklyProgress = { id: "", bestRun: 0, completed: false };
      }
      if (weeklyProgress.id !== WEEKLY.id) {
        weeklyProgress = { id: WEEKLY.id, bestRun: 0, completed: false };
        saveWeeklyProgress();
      }
    }

    function updateWeeklyMissionProgress(finalScore) {
      if (weeklyProgress.id !== WEEKLY.id) {
        weeklyProgress = { id: WEEKLY.id, bestRun: 0, completed: false };
      }
      const runScore = Math.floor(finalScore);
      if (runScore > weeklyProgress.bestRun) weeklyProgress.bestRun = runScore;
      if (runScore >= WEEKLY.target) weeklyProgress.completed = true;
      saveWeeklyProgress();
    }

    function loadRankings() {
      try {
        rankings = JSON.parse(localStorage.getItem("dino-rankings") || "[]");
      } catch {
        rankings = [];
      }
      if (!Array.isArray(rankings)) rankings = [];
    }

    function saveGlobalRanking() {
      localStorage.setItem("dino-global-ranking-machine", JSON.stringify(machineGlobalRanking));
      globalRanking = machineGlobalRanking;
    }

    function loadGlobalRanking() {
      try {
        const rawMachine = JSON.parse(localStorage.getItem("dino-global-ranking-machine") || "null");
        if (rawMachine && typeof rawMachine === "object") {
          machineGlobalRanking = rawMachine;
        } else {
          const rawLegacy = JSON.parse(localStorage.getItem("dino-global-ranking") || "{}");
          machineGlobalRanking = rawLegacy && typeof rawLegacy === "object" ? rawLegacy : {};
        }
        globalRanking = machineGlobalRanking;
      } catch {
        machineGlobalRanking = {};
        globalRanking = machineGlobalRanking;
      }
    }

    function loadPlayerName() {
      playerName = (localStorage.getItem("dino-player-name") || "").trim();
    }

    function savePlayerName(name) {
      playerName = name;
      localStorage.setItem("dino-player-name", playerName);
    }

    function showNamePrompt() {
      nameOverlay.classList.remove("hidden");
      nameError.textContent = "";
      nameInput.value = playerName || "";
      setTimeout(() => nameInput.focus(), 0);
    }

    function hideNamePrompt() {
      nameOverlay.classList.add("hidden");
    }

    function submitPlayerName() {
      const clean = (nameInput.value || "").trim().slice(0, 18);
      if (!clean) {
        nameError.textContent = "Escribe un nombre válido.";
        return false;
      }
      savePlayerName(clean);
      hideNamePrompt();
      renderGlobalRankingView();
      return true;
    }

    function ensurePlayerName() {
      if (playerName) return true;
      showNamePrompt();
      return false;
    }

    function buildStateSnapshot() {
      return {
        best: Math.floor(best),
        selectedSkinId,
        unlockedSkins: Array.from(unlockedSkins),
        coins: Math.floor(coins),
        missionPoints: Math.floor(missionPoints),
        prestigeLevel: Math.floor(prestigeLevel),
        prestigePoints: Math.floor(prestigePoints),
        rankings: Array.isArray(rankings) ? rankings : [],
        globalRanking: globalRanking && typeof globalRanking === "object" ? globalRanking : {},
        playerName: String(playerName || ""),
        stats: stats && typeof stats === "object" ? stats : { games: 0, totalScore: 0, totalJumps: 0, challengeWins: 0 },
        achievementsUnlocked: Array.from(achievementsUnlocked),
        purchasedTitles: Array.from(purchasedTitles),
        unlockedExclusiveTitles: Array.from(unlockedExclusiveTitles),
        unlockedExclusives: Array.from(unlockedExclusives),
        activeTitle: String(activeTitle || "Novato"),
        dailyMissions: dailyMissions || createDailyMissions(),
        weeklyProgress: weeklyProgress || { id: WEEKLY.id, bestRun: 0, completed: false },
        marketState: marketState || { day: "", offers: [] },
        upgradeLevels: upgradeLevels || { jump_core: 0, mission_boost: 0, coin_boost: 0 },
        bestGhostFrames: Array.isArray(bestGhostFrames) ? bestGhostFrames.slice(0, 6000) : [],
        ghostBestScore: Math.floor(ghostBestScore || 0)
      };
    }

    function applyStateSnapshot(snap) {
      const s = snap || {};
      best = Math.floor(Number(s.best || 0));
      selectedSkinId = String(s.selectedSkinId || "classic");
      unlockedSkins = new Set(Array.isArray(s.unlockedSkins) ? s.unlockedSkins : DEFAULT_UNLOCKED_SKINS);
      coins = Math.floor(Number(s.coins || 0));
      missionPoints = Math.floor(Number(s.missionPoints || 0));
      prestigeLevel = Math.floor(Number(s.prestigeLevel || 0));
      prestigePoints = Math.floor(Number(s.prestigePoints || 0));
      rankings = Array.isArray(s.rankings) ? s.rankings : [];
      globalRanking = s.globalRanking && typeof s.globalRanking === "object" ? s.globalRanking : {};
      playerName = String(s.playerName || "");
      stats = s.stats && typeof s.stats === "object" ? s.stats : { games: 0, totalScore: 0, totalJumps: 0, challengeWins: 0 };
      achievementsUnlocked = new Set(Array.isArray(s.achievementsUnlocked) ? s.achievementsUnlocked : []);
      purchasedTitles = new Set(Array.isArray(s.purchasedTitles) ? s.purchasedTitles : []);
      unlockedExclusiveTitles = new Set(Array.isArray(s.unlockedExclusiveTitles) ? s.unlockedExclusiveTitles : []);
      unlockedExclusives = new Set(Array.isArray(s.unlockedExclusives) ? s.unlockedExclusives : []);
      activeTitle = String(s.activeTitle || "Novato");
      dailyMissions = s.dailyMissions || createDailyMissions();
      weeklyProgress = s.weeklyProgress || { id: WEEKLY.id, bestRun: 0, completed: false };
      marketState = s.marketState || { day: "", offers: [] };
      upgradeLevels = s.upgradeLevels && typeof s.upgradeLevels === "object"
        ? {
            jump_core: Math.max(0, Math.floor(Number(s.upgradeLevels.jump_core || 0))),
            mission_boost: Math.max(0, Math.floor(Number(s.upgradeLevels.mission_boost || 0))),
            coin_boost: Math.max(0, Math.floor(Number(s.upgradeLevels.coin_boost || 0)))
          }
        : { jump_core: 0, mission_boost: 0, coin_boost: 0 };
      bestGhostFrames = Array.isArray(s.bestGhostFrames) ? s.bestGhostFrames.slice(0, 6000) : [];
      ghostBestScore = Math.floor(Number(s.ghostBestScore || 0));

      localStorage.setItem("dino-best", String(best));
      localStorage.setItem("dino-skin", selectedSkinId);
      localStorage.setItem("dino-player-name", playerName);
      saveUnlockedSkins();
      saveCoins();
      saveMissionPoints();
      savePrestige();
      saveRankings();
      saveGlobalRanking();
      saveStats();
      saveAchievements();
      saveDailyMissions();
      saveWeeklyProgress();
      saveUpgradeLevels();
      saveGhostData();

      if (!isSkinUnlocked(selectedSkinId)) {
        selectedSkinId = "classic";
        localStorage.setItem("dino-skin", selectedSkinId);
      }
      reset();
      renderSkinShop();
      renderMetaPanels();
    }

    function persistProfilesState() {
      localStorage.setItem("dino-profiles-state", JSON.stringify(profilesState));
    }

    function saveCurrentProfileState() {
      if (profileSwitching) return;
      profilesState.data[profilesState.active] = buildStateSnapshot();
      persistProfilesState();
    }

    function loadProfilesSystem() {
      try {
        const raw = JSON.parse(localStorage.getItem("dino-profiles-state") || "null");
        if (raw && Array.isArray(raw.list) && raw.data && typeof raw.data === "object") {
          profilesState = raw;
        }
      } catch {}

      if (!Array.isArray(profilesState.list) || profilesState.list.length === 0) {
        profilesState = { active: "Principal", list: ["Principal"], data: {} };
      }
      if (!profilesState.active || !profilesState.list.includes(profilesState.active)) {
        profilesState.active = profilesState.list[0];
      }
      if (!profilesState.data[profilesState.active]) {
        profilesState.data[profilesState.active] = buildStateSnapshot();
      }

      profileSwitching = true;
      applyStateSnapshot(profilesState.data[profilesState.active]);
      profileSwitching = false;
      persistProfilesState();
    }

    function switchProfile(name) {
      if (!name || !profilesState.list.includes(name)) return false;
      saveCurrentProfileState();
      profilesState.active = name;
      if (!profilesState.data[name]) {
        profilesState.data[name] = buildStateSnapshot();
      }
      profileSwitching = true;
      applyStateSnapshot(profilesState.data[name]);
      profileSwitching = false;
      persistProfilesState();
      renderProfilesView();
      setCommandMessage(`Perfil activo: ${name}`);
      return true;
    }

    function createProfile(name) {
      const clean = String(name || "").trim().slice(0, 18);
      if (!clean) return false;
      if (profilesState.list.includes(clean)) return false;
      saveCurrentProfileState();
      profilesState.list.push(clean);
      profilesState.data[clean] = {
        best: 0,
        selectedSkinId: "classic",
        unlockedSkins: [...DEFAULT_UNLOCKED_SKINS],
        coins: 0,
        missionPoints: 0,
        prestigeLevel: 0,
        prestigePoints: 0,
        rankings: [],
        globalRanking: {},
        playerName: clean,
        stats: { games: 0, totalScore: 0, totalJumps: 0, challengeWins: 0 },
        achievementsUnlocked: [],
        purchasedTitles: [],
        unlockedExclusiveTitles: [],
        unlockedExclusives: [],
        activeTitle: "Novato",
        dailyMissions: createDailyMissions(),
        weeklyProgress: { id: WEEKLY.id, bestRun: 0, completed: false },
        marketState: { day: "", offers: [] },
        upgradeLevels: { jump_core: 0, mission_boost: 0, coin_boost: 0 },
        bestGhostFrames: [],
        ghostBestScore: 0
      };
      persistProfilesState();
      switchProfile(clean);
      return true;
    }

    function deleteCurrentProfile() {
      if (profilesState.list.length <= 1) return false;
      const current = profilesState.active;
      profilesState.list = profilesState.list.filter((n) => n !== current);
      delete profilesState.data[current];
      const next = profilesState.list[0];
      profilesState.active = next;
      persistProfilesState();
      switchProfile(next);
      return true;
    }

    function renderProfilesView() {
      if (profilesInfo) profilesInfo.textContent = `Perfil activo: ${profilesState.active}`;
      if (!profilesList) return;
      profilesList.innerHTML = "";
      profilesState.list.forEach((name) => {
        const li = document.createElement("li");
        li.textContent = `${name}${name === profilesState.active ? " · ACTIVO" : ""}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Usar";
        btn.disabled = name === profilesState.active;
        btn.style.marginLeft = "8px";
        btn.addEventListener("click", () => switchProfile(name));
        li.appendChild(btn);
        profilesList.appendChild(li);
      });
    }

    function openProfilesView() {
      menuHome.classList.add("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
      profilesView.classList.remove("hidden");
      renderProfilesView();
    }

    function closeProfilesView() {
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
    }

    function createMarketForDay(dayKey) {
      const parts = dayKey.split("-").map(Number);
      const seed = (parts[0] || 0) * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
      const rarityA = "common";
      const rarityB = seed % 2 === 0 ? "rare" : "epic";
      const rarityC = seed % 3 === 0 ? "epic" : "rare";
      const offerA = { id: "mp_pack", label: `Pack misión +${100 + (seed % 4) * 25} PM`, type: "mission_points", value: 100 + (seed % 4) * 25, cost: Math.floor((35 + (seed % 5) * 8) * RARITY_MULT[rarityA]), rarity: rarityA, claimed: false };
      const offerB = { id: "pp_pack", label: `Pack prestigio +${2 + (seed % 3)} PP`, type: "prestige_points", value: 2 + (seed % 3), cost: Math.floor((80 + (seed % 4) * 12) * RARITY_MULT[rarityB]), rarity: rarityB, claimed: false };
      const offerC = { id: "skin_offer", label: "Desbloqueo skin premium", type: "skin_unlock", value: 1, cost: Math.floor((210 + (seed % 6) * 15) * RARITY_MULT[rarityC]), rarity: rarityC, claimed: false };
      const exclusive = DAILY_EXCLUSIVES[seed % DAILY_EXCLUSIVES.length];
      const baseOffer = {
        id: `daily_${exclusive.id}`,
        type: exclusive.type,
        label: exclusive.label,
        value: exclusive.value,
        cost: Math.floor((exclusive.cost + (seed % 5) * 10) * RARITY_MULT.legendary),
        rarity: "legendary",
        claimed: false,
        exclusive: true,
        exclusiveId: exclusive.id,
        title: exclusive.title || ""
      };
      return { day: dayKey, offers: [offerA, offerB, offerC, baseOffer] };
    }

    function ensureMarketState() {
      const today = getTodayKey();
      if (!marketState || marketState.day !== today || !Array.isArray(marketState.offers)) {
        marketState = createMarketForDay(today);
      }
      saveCurrentProfileState();
    }

    function buyMarketOffer(offerId) {
      ensureMarketState();
      const offer = marketState.offers.find((o) => o.id === offerId);
      if (!offer || offer.claimed) return false;
      if (coins < offer.cost) return false;

      if (offer.type === "skin_unlock") {
        const lockables = Object.keys(SKIN_COIN_COSTS).filter((id) => !isSkinUnlocked(id));
        if (lockables.length === 0) {
          missionPoints += 90;
          saveMissionPoints();
        } else {
          const skinId = lockables[Math.floor(Math.random() * lockables.length)];
          unlockedSkins.add(skinId);
          saveUnlockedSkins();
        }
      }
      if (offer.type === "mission_points") {
        missionPoints += offer.value;
        saveMissionPoints();
      }
      if (offer.type === "prestige_points") {
        prestigePoints += offer.value;
        savePrestige();
      }
      if (offer.type === "exclusive_title") {
        const titleName = String(offer.value || offer.title || "Exclusivo");
        if (unlockedExclusiveTitles.has(titleName)) {
          missionPoints += 120;
          saveMissionPoints();
        } else {
          unlockedExclusiveTitles.add(titleName);
          unlockedExclusives.add(String(offer.exclusiveId || offer.id));
          activeTitle = titleName;
          saveAchievements();
        }
      }
      if (offer.type === "exclusive_skin") {
        const lockables = Object.keys(SKIN_COIN_COSTS).filter((id) => !isSkinUnlocked(id));
        if (lockables.length === 0) {
          missionPoints += 150;
          saveMissionPoints();
        } else {
          const seed = Array.from(String(offer.exclusiveId || offer.id)).reduce((a, ch) => a + ch.charCodeAt(0), 0);
          const skinId = lockables[seed % lockables.length];
          unlockedSkins.add(skinId);
          unlockedExclusives.add(String(offer.exclusiveId || offer.id));
          saveUnlockedSkins();
          saveAchievements();
        }
      }
      if (offer.type === "exclusive_pp") {
        prestigePoints += Number(offer.value || 0);
        unlockedExclusives.add(String(offer.exclusiveId || offer.id));
        savePrestige();
        saveAchievements();
      }

      coins -= offer.cost;
      offer.claimed = true;
      saveCoins();
      saveCurrentProfileState();
      renderSkinShop();
      renderMetaPanels();
      return true;
    }

    function saveStats() {
      localStorage.setItem("dino-stats", JSON.stringify(stats));
    }

    function savePrestige() {
      localStorage.setItem("dino-prestige-level", String(Math.max(0, Math.floor(prestigeLevel))));
      localStorage.setItem("dino-prestige-points", String(Math.max(0, Math.floor(prestigePoints))));
    }

    function getPrestigePointsNeededForNextLevel(level = prestigeLevel) {
      return 25 + level * 10;
    }

    function getPrestigeMissionMultiplier() {
      return 1 + prestigeLevel * 0.08;
    }

    function getPrestigeCoinMultiplier() {
      return 1 + prestigeLevel * 0.12;
    }

    function getPrestigeGainPreview() {
      const byBest = Math.floor(best / 1200);
      const byCoins = Math.floor(coins / 300);
      const byMissions = Math.floor(missionPoints / 220);
      return Math.max(0, byBest + byCoins + byMissions);
    }

    function performPrestige() {
      const gain = getPrestigeGainPreview();
      if (gain <= 0) return false;

      prestigeLevel += 1;
      prestigePoints += gain;
      savePrestige();

      best = 0;
      score = 0;
      coins = 0;
      missionPoints = 0;
      achievementsUnlocked = new Set();
      purchasedTitles = new Set();
      activeTitle = "Novato";
      selectedSkinId = "classic";
      unlockedSkins = new Set(DEFAULT_UNLOCKED_SKINS);
      rankings = [];
      stats = { games: 0, totalScore: 0, totalJumps: 0, challengeWins: 0 };
      dailyMissions = createDailyMissions();
      missionNotice = "";

      localStorage.setItem("dino-best", "0");
      localStorage.setItem("dino-skin", "classic");
      saveUnlockedSkins();
      saveCoins();
      saveMissionPoints();
      saveAchievements();
      saveRankings();
      saveStats();
      saveDailyMissions();

      resetCommandTweaksToDefault();
      reset();
      renderSkinShop();
      renderMetaPanels();
      showMenu("start");
      return true;
    }

    function exchangeScoreToPrestigePoints(amount) {
      const numeric = Math.floor(Number(amount));
      const currentPoints = Math.floor(score);
      if (!Number.isFinite(numeric) || numeric <= 0) return false;
      if (numeric > currentPoints) return false;
      const gained = Math.floor(numeric / 500);
      if (gained <= 0) return false;
      const spent = gained * 500;
      score -= spent;
      prestigePoints += gained;
      savePrestige();
      renderMetaPanels();
      renderPrestigeView();
      setCommandMessage(`-${spent} puntos · +${gained} PP`);
      return true;
    }

    function levelUpPrestigeWithPoints() {
      const needed = getPrestigePointsNeededForNextLevel();
      if (prestigePoints < needed) return false;
      prestigePoints -= needed;
      prestigeLevel += 1;
      savePrestige();
      renderMetaPanels();
      renderPrestigeView();
      setCommandMessage(`Prestigio subido a nivel ${prestigeLevel}`);
      return true;
    }

    function levelUpPrestigeBulk(levels) {
      let gained = 0;
      for (let i = 0; i < levels; i++) {
        const needed = getPrestigePointsNeededForNextLevel(prestigeLevel + gained);
        if (prestigePoints < needed) break;
        prestigePoints -= needed;
        gained++;
      }
      if (gained <= 0) return 0;
      prestigeLevel += gained;
      savePrestige();
      renderMetaPanels();
      renderPrestigeView();
      return gained;
    }

    function loadStats() {
      try {
        const raw = JSON.parse(localStorage.getItem("dino-stats") || "{}");
        stats = {
          games: Number(raw.games || 0),
          totalScore: Number(raw.totalScore || 0),
          totalJumps: Number(raw.totalJumps || 0),
          challengeWins: Number(raw.challengeWins || 0)
        };
      } catch {
        stats = { games: 0, totalScore: 0, totalJumps: 0, challengeWins: 0 };
      }
    }

    function saveAchievements() {
      localStorage.setItem("dino-achievements", JSON.stringify(Array.from(achievementsUnlocked)));
      localStorage.setItem("dino-purchased-titles", JSON.stringify(Array.from(purchasedTitles)));
      localStorage.setItem("dino-exclusive-titles", JSON.stringify(Array.from(unlockedExclusiveTitles)));
      localStorage.setItem("dino-exclusive-items", JSON.stringify(Array.from(unlockedExclusives)));
      localStorage.setItem("dino-title", activeTitle);
    }

    function loadAchievements() {
      try {
        achievementsUnlocked = new Set(JSON.parse(localStorage.getItem("dino-achievements") || "[]"));
      } catch {
        achievementsUnlocked = new Set();
      }
      try {
        purchasedTitles = new Set(JSON.parse(localStorage.getItem("dino-purchased-titles") || "[]"));
      } catch {
        purchasedTitles = new Set();
      }
      try {
        unlockedExclusiveTitles = new Set(JSON.parse(localStorage.getItem("dino-exclusive-titles") || "[]"));
      } catch {
        unlockedExclusiveTitles = new Set();
      }
      try {
        unlockedExclusives = new Set(JSON.parse(localStorage.getItem("dino-exclusive-items") || "[]"));
      } catch {
        unlockedExclusives = new Set();
      }
      const savedTitle = localStorage.getItem("dino-title");
      if (savedTitle) activeTitle = savedTitle;
    }

    function getUnlockedTitleNames() {
      const unlocked = new Set(["Novato"]);
      for (const a of ACHIEVEMENT_DEFS) {
        if (achievementsUnlocked.has(a.id)) unlocked.add(a.title);
      }
      for (const item of MISSION_TITLE_SHOP) {
        if (purchasedTitles.has(item.id)) unlocked.add(item.title);
      }
      for (const exTitle of unlockedExclusiveTitles) {
        unlocked.add(exTitle);
      }
      return unlocked;
    }

    function buyMissionTitle(titleId) {
      const item = MISSION_TITLE_SHOP.find((t) => t.id === titleId);
      if (!item) return false;
      if (purchasedTitles.has(item.id)) return true;
      if (missionPoints < item.cost) return false;
      missionPoints -= item.cost;
      purchasedTitles.add(item.id);
      activeTitle = item.title;
      saveMissionPoints();
      saveAchievements();
      renderMetaPanels();
      return true;
    }

    function equipTitleByName(titleName) {
      evaluateAchievements();
      const unlockedTitles = getUnlockedTitleNames();
      if (!unlockedTitles.has(titleName)) return false;
      activeTitle = titleName;
      saveAchievements();
      renderMetaPanels();
      return true;
    }

    function evaluateAchievements() {
      const context = { best, coins, totalJumps: stats.totalJumps, challengeWins: stats.challengeWins };
      for (const a of ACHIEVEMENT_DEFS) {
        if (a.check(context)) achievementsUnlocked.add(a.id);
      }
      const unlockedTitles = getUnlockedTitleNames();
      if (!unlockedTitles.has(activeTitle)) {
        const ordered = TITLE_ORDER.filter((t) => unlockedTitles.has(t));
        activeTitle = ordered[ordered.length - 1] || "Novato";
      }
      saveAchievements();
    }

    function updateLocalRanking(finalScore) {
      rankings.push({
        score: Math.floor(finalScore),
        mode: runMode,
        date: new Date().toISOString().slice(0, 10)
      });
      rankings.sort((a, b) => b.score - a.score);
      rankings = rankings.slice(0, 10);
      saveRankings();
    }

    function updateGlobalRanking(finalScore) {
      if (!playerName) return;
      const previous = Number(machineGlobalRanking[playerName] || 0);
      const current = Math.floor(finalScore);
      if (current > previous) {
        machineGlobalRanking[playerName] = current;
        globalRanking = machineGlobalRanking;
        saveGlobalRanking();
      }
    }

    function getCurrentBiome() {
      let biome = BIOMES[0];
      for (const b of BIOMES) {
        if (score >= b.from) biome = b;
      }
      if (biome.id !== currentBiomeId) {
        currentBiomeId = biome.id;
        biomeFlash = 24;
      }
      return biome;
    }

    function getTodayKey() {
      return new Date().toISOString().slice(0, 10);
    }

    function initOnlineBackend() {
      onlineReady = false;
      supabaseClient = null;
      if (!supabaseUrl || !supabaseAnonKey) return;
      if (!window.supabase || typeof window.supabase.createClient !== "function") return;
      try {
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        onlineReady = true;
      } catch {
        onlineReady = false;
        supabaseClient = null;
      }
    }

    async function fetchOnlineLeaderboard() {
      if (!onlineReady || !supabaseClient) return false;
      try {
        const { data, error } = await supabaseClient
          .from(ONLINE_TABLE)
          .select("player_name,best_score")
          .order("best_score", { ascending: false })
          .limit(50);
        if (error) return false;
        onlineLeaderboard = (data || []).map((row) => ({
          name: String(row.player_name || "anon"),
          bestScore: Number(row.best_score || 0)
        }));
        return true;
      } catch {
        return false;
      }
    }

    async function syncOnlineScore(finalScore) {
      if (!onlineReady || !supabaseClient || !playerName) return;
      if (onlineSyncInFlight) return;
      onlineSyncInFlight = true;
      try {
        const safeName = playerName.trim().slice(0, 18);
        const scoreValue = Math.floor(finalScore);
        const { data: existing, error: readErr } = await supabaseClient
          .from(ONLINE_TABLE)
          .select("best_score")
          .eq("player_name", safeName)
          .maybeSingle();
        if (readErr) throw readErr;

        if (!existing) {
          const { error: insertErr } = await supabaseClient
            .from(ONLINE_TABLE)
            .insert({ player_name: safeName, best_score: scoreValue });
          if (insertErr) throw insertErr;
        } else if (scoreValue > Number(existing.best_score || 0)) {
          const { error: updateErr } = await supabaseClient
            .from(ONLINE_TABLE)
            .update({ best_score: scoreValue })
            .eq("player_name", safeName);
          if (updateErr) throw updateErr;
        }
        await fetchOnlineLeaderboard();
      } catch {}
      onlineSyncInFlight = false;
    }

    function createDailyMissions() {
      const key = getTodayKey();
      const parts = key.split("-").map(Number);
      const seed = parts[0] * 10000 + parts[1] * 100 + parts[2];
      return {
        key,
        list: [
          { id: "run_score", text: `Llega a ${900 + (seed % 5) * 200} puntos`, target: 900 + (seed % 5) * 200, progress: 0, reward: 80, done: false },
          { id: "run_jumps", text: `Haz ${20 + (seed % 4) * 10} saltos`, target: 20 + (seed % 4) * 10, progress: 0, reward: 60, done: false },
          { id: "run_games", text: `Juega ${2 + (seed % 3)} partidas`, target: 2 + (seed % 3), progress: 0, reward: 70, done: false }
        ]
      };
    }

    function loadDailyMissions() {
      const today = getTodayKey();
      try {
        const raw = JSON.parse(localStorage.getItem("dino-daily-missions") || "null");
        if (raw && raw.key === today) {
          dailyMissions = raw;
          return;
        }
      } catch {}
      dailyMissions = createDailyMissions();
      saveDailyMissions();
    }

    function saveDailyMissions() {
      localStorage.setItem("dino-daily-missions", JSON.stringify(dailyMissions));
    }

    function updateMissionProgress() {
      if (!dailyMissions) return;
      for (const m of dailyMissions.list) {
        if (m.done) continue;
        if (m.id === "run_score") m.progress = Math.max(m.progress, Math.floor(score));
        if (m.id === "run_jumps") m.progress = Math.max(m.progress, runJumps);
        if (m.id === "run_games") m.progress = Math.max(m.progress, stats.games);
        if (m.progress >= m.target) {
          m.done = true;
          const gained = Math.max(1, Math.floor(m.reward * getPrestigeMissionMultiplier() * getUpgradeMissionMultiplier()));
          missionPoints += gained;
          missionNotice = `${m.text} (+${gained} puntos de misión)`;
          saveMissionPoints();
        }
      }
      saveDailyMissions();
    }

    function renderMetaPanels() {
      evaluateAchievements();
      const nextPrestige = getPrestigeGainPreview();
      titleText.textContent = `Título: ${activeTitle} · PM: ${Math.floor(missionPoints)} · Prestigio ${prestigeLevel} (${prestigePoints} PP, +${nextPrestige} disponible) · Ghost ${Math.floor(ghostBestScore)}`;
      achievementList.innerHTML = "";
      for (const a of ACHIEVEMENT_DEFS) {
        if (achievementsUnlocked.has(a.id)) {
          const li = document.createElement("li");
          li.textContent = `${a.title}`;
          achievementList.appendChild(li);
        }
      }
      if (!achievementList.firstChild) {
        const li = document.createElement("li");
        li.textContent = "Sin logros aún";
        achievementList.appendChild(li);
      }

      missionList.innerHTML = "";
      const mp = document.createElement("li");
      mp.textContent = `Puntos de misión: ${Math.floor(missionPoints)}`;
      missionList.appendChild(mp);
      for (const m of (dailyMissions?.list || [])) {
        const li = document.createElement("li");
        li.textContent = `${m.done ? "COMPLETADA" : "PENDIENTE"} · ${m.text} (${Math.min(m.progress, m.target)}/${m.target}) · Recompensa: ${m.reward} PM`;
        missionList.appendChild(li);
      }

      rankingList.innerHTML = "";
      rankings.slice(0, 5).forEach((r, i) => {
        const li = document.createElement("li");
        li.textContent = `#${i + 1} ${r.score} (${r.mode})`;
        rankingList.appendChild(li);
      });
      if (!rankingList.firstChild) {
        const li = document.createElement("li");
        li.textContent = "Sin partidas registradas";
        rankingList.appendChild(li);
      }

      weeklyBadge.textContent = `Misión semanal ${WEEKLY.id}: ACTIVA`;
      weeklyList.innerHTML = "";
      const w1 = document.createElement("li");
      w1.textContent = `Misión semanal: consigue ${WEEKLY.target} puntos en una sola partida`;
      const wSingle = document.createElement("li");
      wSingle.textContent = `Mejor partida semanal: ${Math.floor(weeklyProgress.bestRun)}/${WEEKLY.target} · ${weeklyProgress.completed ? "COMPLETADA" : "PENDIENTE"}`;
      const wMp = document.createElement("li");
      wMp.textContent = `Puntos misión: ${Math.floor(missionPoints)}`;
      const wUp = document.createElement("li");
      wUp.textContent = `Mejoras: salto x${getUpgradeJumpMultiplier().toFixed(2)} · PM x${getUpgradeMissionMultiplier().toFixed(2)} · monedas x${getUpgradeCoinMultiplier().toFixed(2)}`;
      weeklyList.appendChild(w1);
      weeklyList.appendChild(wSingle);
      weeklyList.appendChild(wMp);
      weeklyList.appendChild(wUp);
      if (missionNotice) {
        const w3 = document.createElement("li");
        w3.textContent = `Misión: ${missionNotice}`;
        weeklyList.appendChild(w3);
      }
      renderTitlesView();
    }

    function getCurrentSkin() {
      const skin = SKINS.find((s) => s.id === selectedSkinId);
      return skin || SKINS[0];
    }

    function saveUnlockedSkins() {
      localStorage.setItem("dino-unlocked-skins", JSON.stringify(Array.from(unlockedSkins)));
    }

    function loadUnlockedSkins() {
      const raw = localStorage.getItem("dino-unlocked-skins");
      let parsed = [];
      try {
        parsed = raw ? JSON.parse(raw) : [];
      } catch {
        parsed = [];
      }
      unlockedSkins = new Set([...DEFAULT_UNLOCKED_SKINS, ...parsed]);
      saveUnlockedSkins();
    }

    function isSkinUnlocked(skinId) {
      return unlockedSkins.has(skinId);
    }

    function saveCoins() {
      localStorage.setItem("dino-coins", String(Math.floor(coins)));
    }

    function getUpgradeLevel(id) {
      return Math.max(0, Math.floor(Number((upgradeLevels && upgradeLevels[id]) || 0)));
    }

    function getUpgradeCost(def) {
      const lvl = getUpgradeLevel(def.id);
      return Math.floor(def.baseCost * Math.pow(1.35, lvl));
    }

    function getUpgradeJumpMultiplier() {
      return 1 + getUpgradeLevel("jump_core") * 0.06;
    }

    function getUpgradeMissionMultiplier() {
      return 1 + getUpgradeLevel("mission_boost") * 0.08;
    }

    function getUpgradeCoinMultiplier() {
      return 1 + getUpgradeLevel("coin_boost") * 0.15;
    }

    function saveUpgradeLevels() {
      localStorage.setItem("dino-upgrades", JSON.stringify(upgradeLevels));
    }

    function loadUpgradeLevels() {
      try {
        const raw = JSON.parse(localStorage.getItem("dino-upgrades") || "{}");
        upgradeLevels = {
          jump_core: Math.max(0, Math.floor(Number(raw.jump_core || 0))),
          mission_boost: Math.max(0, Math.floor(Number(raw.mission_boost || 0))),
          coin_boost: Math.max(0, Math.floor(Number(raw.coin_boost || 0)))
        };
      } catch {
        upgradeLevels = { jump_core: 0, mission_boost: 0, coin_boost: 0 };
      }
    }

    function saveGhostData() {
      localStorage.setItem("dino-ghost-frames", JSON.stringify(bestGhostFrames.slice(0, 6000)));
      localStorage.setItem("dino-ghost-best", String(Math.floor(ghostBestScore || 0)));
    }

    function loadGhostData() {
      try {
        const raw = JSON.parse(localStorage.getItem("dino-ghost-frames") || "[]");
        bestGhostFrames = Array.isArray(raw) ? raw.slice(0, 6000) : [];
      } catch {
        bestGhostFrames = [];
      }
      ghostBestScore = Math.floor(Number(localStorage.getItem("dino-ghost-best") || 0));
    }

    function buyUpgrade(upgradeId) {
      const def = UPGRADE_DEFS.find((u) => u.id === upgradeId);
      if (!def) return false;
      const lvl = getUpgradeLevel(def.id);
      if (lvl >= def.max) return false;
      const cost = getUpgradeCost(def);
      if (missionPoints < cost) return false;
      missionPoints -= cost;
      upgradeLevels[def.id] = lvl + 1;
      saveMissionPoints();
      saveUpgradeLevels();
      saveCurrentProfileState();
      renderSkinShop();
      renderMetaPanels();
      return true;
    }

    function renderUpgradeShop() {
      if (!upgradeList) return;
      if (upgradeInfo) {
        upgradeInfo.textContent = `Mejoras permanentes · PM: ${Math.floor(missionPoints)}`;
      }
      upgradeList.innerHTML = "";
      for (const def of UPGRADE_DEFS) {
        const lvl = getUpgradeLevel(def.id);
        const cost = getUpgradeCost(def);
        const done = lvl >= def.max;
        const li = document.createElement("li");
        li.textContent = `${def.name} Nv ${lvl}/${def.max} - ${def.desc}${done ? " · MAX" : ` · Coste: ${cost} PM`}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.marginLeft = "8px";
        btn.textContent = done ? "MAX" : "Mejorar";
        btn.disabled = done || missionPoints < cost;
        btn.addEventListener("click", () => {
          if (!buyUpgrade(def.id)) {
            setCommandMessage("No se pudo comprar mejora");
          } else {
            setCommandMessage(`Mejora subida: ${def.name} Nv ${getUpgradeLevel(def.id)}`);
          }
        });
        li.appendChild(btn);
        upgradeList.appendChild(li);
      }
    }
    function saveMissionPoints() {
      localStorage.setItem("dino-mission-points", String(Math.floor(missionPoints)));
    }

    function buySkin(skinId) {
      const cost = SKIN_COIN_COSTS[skinId];
      if (!cost) return false;
      if (coins < cost) return false;
      coins -= cost;
      saveCoins();
      unlockedSkins.add(skinId);
      saveUnlockedSkins();
      renderMetaPanels();
      return true;
    }

    function exchangePointsToCoins(amount) {
      const currentPoints = Math.floor(score);
      const numeric = Math.floor(Number(amount));
      if (!Number.isFinite(numeric) || numeric <= 0) {
        setCommandMessage("Cantidad inválida");
        return false;
      }
      if (numeric > currentPoints) {
        setCommandMessage(`No tienes tantos puntos para intercambiar (max ${currentPoints})`);
        return false;
      }
      const coinsGained = Math.floor(numeric / 10);
      if (coinsGained <= 0) {
        setCommandMessage("Necesitas al menos 10 puntos para 1 moneda");
        return false;
      }
      const pointsSpent = coinsGained * 10;
      score -= pointsSpent;
      coins += coinsGained;
      saveCoins();
      renderSkinShop();
      renderMetaPanels();
      setCommandMessage(`-${pointsSpent} puntos · +${coinsGained} monedas · Total: ${Math.floor(coins)}`);
      return true;
    }

    function hasChargedJump() {
      const variant = getCurrentSkin().variant;
      return variant === "hollow" || variant === "silksong";
    }

    function setCommandMessage(text) {
      commandMsg.textContent = text;
    }

    function getCommandSuggestions(rawValue) {
      const v = String(rawValue || "").trim().toLowerCase();
      if (!v || v.includes(" ")) return [];
      return COMMAND_CATALOG.filter((c) => c.startsWith(v)).slice(0, 6);
    }

    function renderCommandHint() {
      if (!commandHint) return;
      const suggestions = getCommandSuggestions(commandInput.value);
      if (suggestions.length > 0) {
        commandHint.textContent = `Sugerencias: ${suggestions.join(" · ")}`;
      } else if (!commandInput.value.trim()) {
        commandHint.textContent = "Tab: autocompletar · Flechas: historial · Esc: cerrar";
      } else {
        commandHint.textContent = "Sin sugerencias";
      }
    }

    function autocompleteCommandInput() {
      const suggestions = getCommandSuggestions(commandInput.value);
      if (suggestions.length === 0) return false;
      commandInput.value = suggestions[0];
      renderCommandHint();
      return true;
    }

    function pushCommandHistory(raw) {
      const clean = String(raw || "").trim();
      if (!clean) return;
      if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== clean) {
        commandHistory.push(clean);
      }
      if (commandHistory.length > 80) commandHistory = commandHistory.slice(-80);
      commandHistoryIndex = -1;
    }

    function moveCommandHistory(direction) {
      if (commandHistory.length === 0) return false;
      if (commandHistoryIndex < 0) {
        commandHistoryIndex = commandHistory.length;
      }
      commandHistoryIndex += direction;
      if (commandHistoryIndex < 0) commandHistoryIndex = 0;
      if (commandHistoryIndex > commandHistory.length) commandHistoryIndex = commandHistory.length;
      if (commandHistoryIndex === commandHistory.length) {
        commandInput.value = "";
      } else {
        commandInput.value = commandHistory[commandHistoryIndex] || "";
      }
      renderCommandHint();
      return true;
    }

    function spawnImpactBurst(x, y, amount, force) {
      for (let i = 0; i < amount; i++) {
        const ang = rand(-Math.PI, 0);
        particles.push({
          x,
          y,
          vx: Math.cos(ang) * rand(0.8, force),
          vy: Math.sin(ang) * rand(0.6, force * 0.9),
          life: rand(18, 34)
        });
      }
    }

    function toggleCommandPanel(forceOpen) {
      commandOpen = typeof forceOpen === "boolean" ? forceOpen : !commandOpen;
      if (commandOpen) {
        commandPanel.classList.remove("hidden");
        commandInput.focus();
        commandHistoryIndex = -1;
        renderCommandHint();
      } else {
        commandPanel.classList.add("hidden");
        commandInput.blur();
      }
    }

    function resolveMissionRef(refRaw) {
      if (!dailyMissions || !Array.isArray(dailyMissions.list)) return null;
      const ref = (refRaw || "").toLowerCase().trim();
      const aliasMap = {
        score: "run_score",
        jumps: "run_jumps",
        games: "run_games"
      };
      const normalized = aliasMap[ref] || ref;
      const byId = dailyMissions.list.find((m) => m.id.toLowerCase() === normalized);
      if (byId) return byId;
      const index = Number(normalized);
      if (Number.isFinite(index) && index >= 1 && index <= dailyMissions.list.length) {
        return dailyMissions.list[index - 1];
      }
      return null;
    }

    function completeMissionAndReward(mission) {
      if (!mission || mission.done) return false;
      mission.done = true;
      mission.progress = Math.max(mission.progress, mission.target);
      const gained = Math.max(1, Math.floor(mission.reward * getPrestigeMissionMultiplier() * getUpgradeMissionMultiplier()));
      missionPoints += gained;
      missionNotice = `${mission.text} (+${gained} puntos de misión)`;
      saveMissionPoints();
      saveDailyMissions();
      renderMetaPanels();
      return true;
    }

    function executeCommand(raw) {
      const input = raw.trim();
      if (!input) return;
      const [cmdRaw, ...args] = input.split(/\s+/);
      const cmd = cmdRaw.toLowerCase();

      if (cmd === "help" || cmd === "ayuda") {
        const helpArg = (args[0] || "").toLowerCase();
        const helpMap = {
          skin: "skin <id|nombre> - Equipa una skin (si está desbloqueada).",
          title: "title <nombre> - Equipa un título desbloqueado/comprado.",
          buytitle: "buytitle <id> - Compra un título de misión (leyenda|sombra|rey).",
          prestige: "prestige - Reinicia progreso y sube 1 nivel de prestigio si cumples requisitos.",
          prestigestatus: "prestigestatus - Muestra nivel, PP, bonus y ganancia posible.",
          setprestige: "setprestige <nivel> [pp] - Fija nivel de prestigio (y PP opcional).",
          speed: "speed <valor> - Cambia velocidad base (>0).",
          gravity: "gravity <valor> - Cambia gravedad (>0).",
          jump: "jump <valor> - Cambia salto base (>0).",
          score: "score <valor> - Fija puntos actuales.",
          best: "best <valor> - Fija récord.",
          resetbest: "resetbest - Resetea récord a 0.",
          resetrecord: "resetrecord - Alias de resetbest.",
          coins: "coins - Muestra monedas actuales.",
          setcoins: "setcoins <valor> - Fija monedas manualmente.",
          missionpoints: "missionpoints - Muestra tus puntos de misión.",
          setmissionpoints: "setmissionpoints <valor> - Fija puntos de misión manualmente.",
          missions: "missions - Lista misiones actuales con estado y progreso.",
          missionnew: "missionnew - Genera nuevas misiones diarias ahora.",
          missioncomplete: "missioncomplete <id|n|all> - Marca misión como completada y da recompensa.",
          missionprogress: "missionprogress <id|n> <valor> - Cambia progreso de misión.",
          missiontarget: "missiontarget <id|n> <valor> - Cambia objetivo de misión.",
          missionreward: "missionreward <id|n> <valor> - Cambia recompensa PM de misión.",
          market: "market - Lista ofertas del mercado diario.",
          marketbuy: "marketbuy <id|n> - Compra oferta por id o número.",
          upgrades: "upgrades - Lista mejoras permanentes y niveles.",
          upgradebuy: "upgradebuy <id> - Compra mejora (jump_core|mission_boost|coin_boost).",
          profiles: "profiles - Lista perfiles disponibles.",
          profileuse: "profileuse <nombre> - Cambia al perfil indicado.",
          profilecreate: "profilecreate <nombre> - Crea un perfil nuevo y lo activa.",
          profiledelete: "profiledelete - Borra el perfil actual (si hay más de uno).",
          onlinestatus: "onlinestatus - Muestra estado de conexión online.",
          onlineconfig: "onlineconfig <url> <anon_key> - Configura Supabase para ranking online.",
          onlineclear: "onlineclear - Borra configuración online y vuelve a local.",
          onlinerank: "onlinerank - Fuerza carga del ranking online.",
          onlinesync: "onlinesync - Sincroniza tu mejor score actual al online.",
          myname: "myname - Muestra tu nombre del ranking global.",
          setname: "setname <nombre> - Cambia tu nombre del ranking global.",
          globalrank: "globalrank - Muestra top del ranking global.",
          resetglobalrank: "resetglobalrank - Borra todo el ranking global.",
          resetall: "resetall - Reseteo completo (record, monedas, skins, estado).",
          unlockall: "unlockall - Desbloquea TODO (skins, títulos, exclusivos, mejoras y ghost).",
          fullreset: "fullreset - Alias de resetall.",
          god: "god on|off - Activa/desactiva invencibilidad.",
          start: "start - Empieza la partida.",
          menu: "menu - Vuelve al menú.",
          reset: "reset - Reinicia la partida actual.",
          clear: "clear - Limpia mensaje de consola."
        };
        if (helpArg && helpMap[helpArg]) {
          setCommandMessage(helpMap[helpArg]);
        } else if (helpArg) {
          setCommandMessage("No hay ayuda para ese comando");
        } else {
          setCommandMessage("Comandos: skin, title, buytitle, prestige, prestigestatus, setprestige, speed, gravity, jump, score, best, resetbest, coins, setcoins, missionpoints, setmissionpoints, missions, missionnew, missioncomplete, missionprogress, missiontarget, missionreward, market, marketbuy, upgrades, upgradebuy, profiles, profileuse, profilecreate, profiledelete, onlinestatus, onlineconfig, onlineclear, onlinerank, onlinesync, myname, setname, globalrank, resetglobalrank, resetall, unlockall, god on/off, start, menu, reset, clear. Usa: help <comando>");
        }
        return;
      }

      if (cmd === "skin") {
        const target = args.join(" ").toLowerCase();
        const skin = SKINS.find((s) => s.id.toLowerCase() === target || s.name.toLowerCase() === target);
        if (!skin) {
          setCommandMessage("Skin no encontrada");
          return;
        }
        selectSkin(skin.id);
        if (isSkinUnlocked(skin.id)) {
          setCommandMessage(`Skin equipada: ${skin.name}`);
        }
        return;
      }

      if (cmd === "title") {
        const titleName = args.join(" ").trim();
        if (!titleName) {
          setCommandMessage("title <nombre>");
          return;
        }
        if (equipTitleByName(titleName)) {
          setCommandMessage(`Título equipado: ${titleName}`);
        } else {
          setCommandMessage("Ese título no está desbloqueado/comprado");
        }
        return;
      }

      if (cmd === "buytitle") {
        const key = (args[0] || "").toLowerCase();
        const map = { leyenda: "leyenda", sombra: "sombra", rey: "rey" };
        const id = map[key] || key;
        if (!id) {
          setCommandMessage("buytitle <leyenda|sombra|rey>");
          return;
        }
        if (buyMissionTitle(id)) {
          const item = MISSION_TITLE_SHOP.find((t) => t.id === id);
          setCommandMessage(`Título comprado: ${item ? item.title : id}`);
        } else {
          setCommandMessage("No se pudo comprar (id inválida o faltan puntos de misión)");
        }
        return;
      }

      if (cmd === "prestige") {
        const gain = getPrestigeGainPreview();
        if (!performPrestige()) {
          setCommandMessage(`No puedes prestigiar aún. Necesitas progreso. Ganancia actual: +${gain} PP`);
        } else {
          setCommandMessage(`Prestigio completado. Nivel ${prestigeLevel} · +${gain} PP`);
        }
        return;
      }

      if (cmd === "prestigestatus") {
        setCommandMessage(`Prestigio ${prestigeLevel} · PP ${prestigePoints} · Misión x${getPrestigeMissionMultiplier().toFixed(2)} · Monedas x${getPrestigeCoinMultiplier().toFixed(2)} · Próximo +${getPrestigeGainPreview()} PP`);
        return;
      }

      if (cmd === "setprestige") {
        const lvl = Math.floor(Number(args[0]));
        const ppArg = args.length > 1 ? Math.floor(Number(args[1])) : null;
        if (!Number.isFinite(lvl) || lvl < 0) {
          setCommandMessage("setprestige <0+> [pp]");
          return;
        }
        prestigeLevel = lvl;
        if (Number.isFinite(ppArg) && ppArg >= 0) prestigePoints = ppArg;
        savePrestige();
        renderMetaPanels();
        setCommandMessage(`Prestigio fijado: nivel ${prestigeLevel}${Number.isFinite(ppArg) && ppArg >= 0 ? ` · PP ${prestigePoints}` : ""}`);
        return;
      }

      if (cmd === "speed") {
        const n = Number(args[0]);
        if (!Number.isFinite(n) || n <= 0) {
          setCommandMessage("speed <0+>");
          return;
        }
        startSpeed = n;
        speed = n;
        jumpSpeedFactor = Math.max(0.01, n / 7);
        setCommandMessage(`Velocidad: ${n.toFixed(1)} · Ritmo salto x${jumpSpeedFactor.toFixed(2)}`);
        return;
      }

      if (cmd === "gravity") {
        const n = Number(args[0]);
        if (!Number.isFinite(n) || n <= 0) {
          setCommandMessage("gravity <0+>");
          return;
        }
        gravityValue = n;
        setCommandMessage(`Gravedad: ${n.toFixed(2)}`);
        return;
      }

      if (cmd === "jump") {
        const n = Number(args[0]);
        if (!Number.isFinite(n) || n <= 0) {
          setCommandMessage("jump <0+>");
          return;
        }
        baseJumpVelocity = -Math.abs(n);
        setCommandMessage(`Salto base: ${n.toFixed(1)}`);
        return;
      }

      if (cmd === "score") {
        const n = Number(args[0]);
        if (!Number.isFinite(n) || n < 0) {
          setCommandMessage("score <0+>");
          return;
        }
        score = n;
        setCommandMessage(`Score: ${Math.floor(score)}`);
        return;
      }

      if (cmd === "best") {
        const n = Number(args[0]);
        if (!Number.isFinite(n) || n < 0) {
          setCommandMessage("best <0+>");
          return;
        }
        best = Math.floor(n);
        localStorage.setItem("dino-best", String(best));
        setCommandMessage(`Best: ${best}`);
        return;
      }

      if (cmd === "resetbest" || cmd === "resetrecord") {
        best = 0;
        localStorage.setItem("dino-best", "0");
        setCommandMessage("Record reiniciado a 0");
        return;
      }

      if (cmd === "coins") {
        setCommandMessage(`Monedas: ${Math.floor(coins)}`);
        return;
      }

      if (cmd === "setcoins") {
        const n = Math.floor(Number(args[0]));
        if (!Number.isFinite(n) || n < 0) {
          setCommandMessage("setcoins <0+>");
          return;
        }
        coins = n;
        saveCoins();
        renderSkinShop();
        renderMetaPanels();
        setCommandMessage(`Monedas fijadas a ${coins}`);
        return;
      }

      if (cmd === "missionpoints" || cmd === "mp") {
        setCommandMessage(`Puntos de misión: ${Math.floor(missionPoints)}`);
        return;
      }

      if (cmd === "setmissionpoints" || cmd === "setmp") {
        const n = Math.floor(Number(args[0]));
        if (!Number.isFinite(n) || n < 0) {
          setCommandMessage("setmissionpoints <0+>");
          return;
        }
        missionPoints = n;
        saveMissionPoints();
        renderMetaPanels();
        setCommandMessage(`Puntos de misión fijados a ${missionPoints}`);
        return;
      }

      if (cmd === "missions") {
        if (!dailyMissions?.list?.length) {
          setCommandMessage("No hay misiones cargadas");
          return;
        }
        const text = dailyMissions.list
          .map((m, i) => `${i + 1}:${m.id} ${m.done ? "OK" : "PEND"} ${Math.min(m.progress, m.target)}/${m.target} r${m.reward}`)
          .join(" | ");
        setCommandMessage(text);
        return;
      }

      if (cmd === "missionnew" || cmd === "newmissions") {
        dailyMissions = createDailyMissions();
        saveDailyMissions();
        renderMetaPanels();
        setCommandMessage("Misiones regeneradas");
        return;
      }

      if (cmd === "missioncomplete") {
        const ref = (args[0] || "").toLowerCase();
        if (!ref) {
          setCommandMessage("missioncomplete <id|n|all>");
          return;
        }
        if (ref === "all") {
          let doneCount = 0;
          for (const m of (dailyMissions?.list || [])) {
            if (completeMissionAndReward(m)) doneCount++;
          }
          setCommandMessage(doneCount > 0 ? `Misiones completadas: ${doneCount}` : "No había misiones pendientes");
          return;
        }
        const mission = resolveMissionRef(ref);
        if (!mission) {
          setCommandMessage("Misión no encontrada");
          return;
        }
        if (completeMissionAndReward(mission)) {
          setCommandMessage(`Misión completada: ${mission.id}`);
        } else {
          setCommandMessage("Esa misión ya estaba completada");
        }
        return;
      }

      if (cmd === "missionprogress") {
        const mission = resolveMissionRef(args[0] || "");
        const value = Math.floor(Number(args[1]));
        if (!mission || !Number.isFinite(value) || value < 0) {
          setCommandMessage("missionprogress <id|n> <0+>");
          return;
        }
        mission.progress = value;
        if (mission.progress >= mission.target) {
          if (completeMissionAndReward(mission)) {
            setCommandMessage(`Progreso actualizado y completada: ${mission.id}`);
          } else {
            saveDailyMissions();
            renderMetaPanels();
            setCommandMessage(`Progreso actualizado: ${mission.id}`);
          }
        } else {
          mission.done = false;
          saveDailyMissions();
          renderMetaPanels();
          setCommandMessage(`Progreso actualizado: ${mission.id} ${mission.progress}/${mission.target}`);
        }
        return;
      }

      if (cmd === "missiontarget") {
        const mission = resolveMissionRef(args[0] || "");
        const value = Math.floor(Number(args[1]));
        if (!mission || !Number.isFinite(value) || value <= 0) {
          setCommandMessage("missiontarget <id|n> <1+>");
          return;
        }
        mission.target = value;
        if (mission.progress < mission.target) mission.done = false;
        saveDailyMissions();
        renderMetaPanels();
        setCommandMessage(`Objetivo actualizado: ${mission.id} -> ${mission.target}`);
        return;
      }

      if (cmd === "missionreward") {
        const mission = resolveMissionRef(args[0] || "");
        const value = Math.floor(Number(args[1]));
        if (!mission || !Number.isFinite(value) || value < 0) {
          setCommandMessage("missionreward <id|n> <0+>");
          return;
        }
        mission.reward = value;
        saveDailyMissions();
        renderMetaPanels();
        setCommandMessage(`Recompensa actualizada: ${mission.id} -> ${mission.reward} PM`);
        return;
      }

      if (cmd === "market") {
        ensureMarketState();
        if (!marketState.offers.length) {
          setCommandMessage("Mercado vacío");
          return;
        }
        const text = marketState.offers
          .map((o, i) => `${i + 1}:${o.id} [${RARITY_LABEL[o.rarity || "common"] || "COMUN"}] ${o.claimed ? "AGOTADO" : (o.exclusive ? "EXCLUSIVA" : "DISPONIBLE")} ${o.cost}c`)
          .join(" | ");
        setCommandMessage(`Mercado ${marketState.day}: ${text}`);
        return;
      }

      if (cmd === "marketbuy") {
        ensureMarketState();
        const ref = (args[0] || "").toLowerCase();
        if (!ref) {
          setCommandMessage("marketbuy <id|n>");
          return;
        }
        let offerId = ref;
        const index = Number(ref);
        if (Number.isFinite(index) && index >= 1 && index <= marketState.offers.length) {
          offerId = marketState.offers[index - 1].id;
        }
        const offer = marketState.offers.find((o) => o.id === offerId);
        if (!offer) {
          setCommandMessage("Oferta no encontrada");
          return;
        }
        if (!buyMarketOffer(offer.id)) {
          setCommandMessage("No se pudo comprar oferta (sin monedas, agotada o no válida)");
          return;
        }
        setCommandMessage(`Oferta comprada: ${offer.label}`);
        return;
      }

      if (cmd === "upgrades") {
        const text = UPGRADE_DEFS
          .map((u) => {
            const lvl = getUpgradeLevel(u.id);
            const cost = getUpgradeCost(u);
            return `${u.id} ${lvl}/${u.max}${lvl >= u.max ? " MAX" : ` cost:${cost}PM`}`;
          })
          .join(" | ");
        setCommandMessage(text || "Sin mejoras");
        return;
      }

      if (cmd === "upgradebuy") {
        const id = (args[0] || "").toLowerCase();
        if (!id) {
          setCommandMessage("upgradebuy <jump_core|mission_boost|coin_boost>");
          return;
        }
        if (!UPGRADE_DEFS.find((u) => u.id === id)) {
          setCommandMessage("Mejora no encontrada");
          return;
        }
        if (!buyUpgrade(id)) {
          setCommandMessage("No se pudo comprar mejora (PM insuficiente o nivel maximo)");
          return;
        }
        setCommandMessage(`Mejora comprada: ${id} -> Nv ${getUpgradeLevel(id)}`);
        return;
      }
      if (cmd === "profiles") {
        const text = profilesState.list
          .map((name) => `${name}${name === profilesState.active ? "*" : ""}`)
          .join(", ");
        setCommandMessage(`Perfiles: ${text}`);
        return;
      }

      if (cmd === "profileuse") {
        const name = args.join(" ").trim();
        if (!name) {
          setCommandMessage("profileuse <nombre>");
          return;
        }
        if (!switchProfile(name)) {
          setCommandMessage("Perfil no encontrado");
          return;
        }
        setCommandMessage(`Perfil activo: ${profilesState.active}`);
        return;
      }

      if (cmd === "profilecreate") {
        const name = args.join(" ").trim();
        if (!name) {
          setCommandMessage("profilecreate <nombre>");
          return;
        }
        if (!createProfile(name)) {
          setCommandMessage("No se pudo crear perfil (vacío o ya existe)");
          return;
        }
        setCommandMessage(`Perfil creado y activado: ${profilesState.active}`);
        return;
      }

      if (cmd === "profiledelete") {
        if (!deleteCurrentProfile()) {
          setCommandMessage("No puedes borrar el único perfil");
          return;
        }
        setCommandMessage(`Perfil actual tras borrar: ${profilesState.active}`);
        return;
      }

      if (cmd === "onlinestatus") {
        setCommandMessage(onlineReady
          ? `ONLINE activo · tabla ${ONLINE_TABLE} · URL ${supabaseUrl}`
          : "ONLINE desactivado. Usa: onlineconfig <url> <anon_key>");
        return;
      }

      if (cmd === "onlineconfig") {
        const url = args[0] || "";
        const key = args[1] || "";
        if (!url || !key) {
          setCommandMessage("onlineconfig <url> <anon_key>");
          return;
        }
        supabaseUrl = url;
        supabaseAnonKey = key;
        localStorage.setItem("dino-supabase-url", supabaseUrl);
        localStorage.setItem("dino-supabase-anon-key", supabaseAnonKey);
        initOnlineBackend();
        setCommandMessage(onlineReady
          ? "Online configurado correctamente"
          : "No se pudo iniciar online con esos datos");
        return;
      }

      if (cmd === "onlineclear") {
        supabaseUrl = "";
        supabaseAnonKey = "";
        localStorage.removeItem("dino-supabase-url");
        localStorage.removeItem("dino-supabase-anon-key");
        initOnlineBackend();
        setCommandMessage("Configuración online borrada");
        return;
      }

      if (cmd === "onlinerank") {
        if (!onlineReady) {
          setCommandMessage("Online no configurado");
          return;
        }
        fetchOnlineLeaderboard().then((ok) => {
          if (!ok || onlineLeaderboard.length === 0) {
            setCommandMessage("No se pudo cargar ranking online");
            return;
          }
          const text = onlineLeaderboard.slice(0, 5).map((r, i) => `#${i + 1} ${r.name}:${r.bestScore}`).join(" | ");
          setCommandMessage(text);
          if (!globalRankingView.classList.contains("hidden")) renderGlobalRankingView();
        });
        return;
      }

      if (cmd === "onlinesync") {
        if (!onlineReady) {
          setCommandMessage("Online no configurado");
          return;
        }
        syncOnlineScore(Math.max(best, Math.floor(score))).then(() => {
          setCommandMessage("Sincronización online completada");
        });
        return;
      }

      if (cmd === "myname") {
        setCommandMessage(`Nombre actual: ${playerName || "sin nombre"}`);
        return;
      }

      if (cmd === "setname") {
        const newName = args.join(" ").trim().slice(0, 18);
        if (!newName) {
          setCommandMessage("setname <nombre>");
          return;
        }
        savePlayerName(newName);
        hideNamePrompt();
        renderGlobalRankingView();
        setCommandMessage(`Nombre cambiado a: ${playerName}`);
        return;
      }

      if (cmd === "globalrank" || cmd === "grank") {
        const rows = Object.entries(machineGlobalRanking)
          .map(([name, bestScore]) => ({ name, bestScore: Number(bestScore) || 0 }))
          .sort((a, b) => b.bestScore - a.bestScore)
          .slice(0, 5);
        if (rows.length === 0) {
          setCommandMessage("Ranking global vacío");
        } else {
          const text = rows.map((r, i) => `#${i + 1} ${r.name}:${r.bestScore}`).join(" | ");
          setCommandMessage(text);
        }
        return;
      }

      if (cmd === "resetglobalrank") {
        machineGlobalRanking = {};
        globalRanking = machineGlobalRanking;
        saveGlobalRanking();
        renderGlobalRankingView();
        setCommandMessage("Ranking global reiniciado");
        return;
      }

      if (cmd === "unlockall" || cmd === "allunlock" || cmd === "unlockeverything") {
        unlockedSkins = new Set(SKINS.map((s) => s.id));
        purchasedTitles = new Set(MISSION_TITLE_SHOP.map((t) => t.id));
        achievementsUnlocked = new Set(ACHIEVEMENT_DEFS.map((a) => a.id));
        for (const ex of DAILY_EXCLUSIVES) {
          if (ex.type === "exclusive_title") {
            const titleName = String(ex.value || ex.title || "Exclusivo");
            unlockedExclusiveTitles.add(titleName);
          }
          unlockedExclusives.add(String(ex.id));
        }
        for (const u of UPGRADE_DEFS) {
          upgradeLevels[u.id] = u.max;
        }
        if (bestGhostFrames.length === 0) {
          bestGhostFrames = [{ y: GROUND_Y - 48, ducking: false }, { y: GROUND_Y - 48, ducking: false }];
          ghostBestScore = Math.max(ghostBestScore, Math.floor(best));
        }
        saveUnlockedSkins();
        saveAchievements();
        saveUpgradeLevels();
        saveGhostData();
        renderSkinShop();
        renderMetaPanels();
        if (!titlesView.classList.contains("hidden")) renderTitlesView();
        setCommandMessage("Todo desbloqueado: skins, títulos, exclusivos, mejoras y ghost");
        return;
      }

      if (cmd === "resetall" || cmd === "fullreset") {
        best = 0;
        score = 0;
        coins = 0;
        missionPoints = 0;
        prestigeLevel = 0;
        prestigePoints = 0;
        achievementsUnlocked = new Set();
        purchasedTitles = new Set();
        unlockedExclusiveTitles = new Set();
        unlockedExclusives = new Set();
        upgradeLevels = { jump_core: 0, mission_boost: 0, coin_boost: 0 };
        bestGhostFrames = [];
        ghostBestScore = 0;
        activeTitle = "Novato";
        selectedSkinId = "classic";
        unlockedSkins = new Set(DEFAULT_UNLOCKED_SKINS);
        localStorage.setItem("dino-best", "0");
        localStorage.setItem("dino-skin", "classic");
        saveUnlockedSkins();
        saveCoins();
        saveMissionPoints();
        savePrestige();
        saveAchievements();
        saveUpgradeLevels();
        saveGhostData();
        resetCommandTweaksToDefault();
        reset();
        renderSkinShop();
        renderMetaPanels();
        showMenu("start");
        setCommandMessage("Juego reseteado por completo");
        return;
      }

      if (cmd === "god") {
        const mode = (args[0] || "").toLowerCase();
        if (mode !== "on" && mode !== "off") {
          setCommandMessage("god on|off");
          return;
        }
        godMode = mode === "on";
        setCommandMessage(`God mode: ${godMode ? "ON" : "OFF"}`);
        return;
      }

      if (cmd === "start") {
        if (inMenu) startGame();
        started = true;
        setCommandMessage("Juego iniciado");
        return;
      }

      if (cmd === "menu") {
        showMenu("start");
        setCommandMessage("Menú abierto");
        return;
      }

      if (cmd === "reset") {
        reset();
        setCommandMessage("Juego reseteado");
        return;
      }

      if (cmd === "clear") {
        setCommandMessage("");
        return;
      }

      setCommandMessage("Comando no reconocido");
    }

    function resetCommandTweaksToDefault() {
      startSpeed = DEFAULT_START_SPEED;
      baseJumpVelocity = DEFAULT_BASE_JUMP_VELOCITY;
      jumpSpeedFactor = DEFAULT_JUMP_SPEED_FACTOR;
      gravityValue = DEFAULT_GRAVITY_VALUE;
      godMode = DEFAULT_GOD_MODE;
    }

    function selectSkin(skinId) {
      if (!isSkinUnlocked(skinId)) {
        const cost = SKIN_COIN_COSTS[skinId] || 0;
        if (cost > 0) {
          if (buySkin(skinId)) {
            selectedSkinId = skinId;
            localStorage.setItem("dino-skin", selectedSkinId);
            renderSkinShop();
            setCommandMessage(`Comprada por ${cost} monedas y equipada`);
          } else {
            setCommandMessage(`Skin bloqueada. Cuesta ${cost} monedas.`);
          }
        }
        return;
      }
      selectedSkinId = skinId;
      localStorage.setItem("dino-skin", selectedSkinId);
      renderSkinShop();
    }

    function renderSkinShop() {
      ensureMarketState();
      const shopText = shopView.querySelector(".menu-text");
      if (shopText) {
        shopText.textContent = `Tria el color del teu dinosaure. Puntos: ${Math.floor(score)} · Monedas: ${Math.floor(coins)}`;
      }
      if (marketInfo) {
        marketInfo.textContent = `Mercado diario (${marketState.day}) · Monedas: ${Math.floor(coins)}`;
      }
      if (marketOfferList) {
        marketOfferList.innerHTML = "";
        marketState.offers.forEach((offer) => {
          const li = document.createElement("li");
          li.textContent = `[${RARITY_LABEL[offer.rarity || "common"] || "COMUN"}] ${offer.claimed ? "AGOTADO" : (offer.exclusive ? "EXCLUSIVA" : "OFERTA")} · ${offer.label} · Coste: ${offer.cost} monedas`;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = offer.claimed ? "Comprado" : "Comprar";
          btn.disabled = offer.claimed || coins < offer.cost;
          btn.style.marginLeft = "8px";
          btn.addEventListener("click", () => {
            if (!buyMarketOffer(offer.id)) {
              setCommandMessage("No se pudo comprar oferta");
            } else {
              setCommandMessage(`Oferta comprada: ${offer.label}`);
            }
          });
          li.appendChild(btn);
          marketOfferList.appendChild(li);
        });
      }
      renderUpgradeShop();
      skinList.innerHTML = "";
      for (const skin of SKINS) {
        const unlocked = isSkinUnlocked(skin.id);
        const cost = SKIN_COIN_COSTS[skin.id];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `skin-card${skin.id === selectedSkinId ? " active" : ""}${unlocked ? "" : " locked"}`;
        const hasAsset = Boolean(DINO_ASSETS[skin.variant]);
        const preview = hasAsset
          ? `<img class="skin-preview-img" src="${DINO_ASSETS[skin.variant].src}?v=${ASSET_VERSION}" alt="${skin.name}" />`
          : `<div class="skin-preview" style="background:${skin.color}"></div>`;
        btn.innerHTML = `
          ${preview}
          <p class="skin-name">${skin.name}${skin.id === selectedSkinId ? " · Equipada" : ""}</p>
          <p class="skin-shape">${skin.shape}</p>
          ${unlocked ? "" : `<p class="skin-lock">Precio: ${cost} monedas</p>`}
        `;
        btn.addEventListener("click", () => selectSkin(skin.id));
        skinList.appendChild(btn);
      }
    }

    function reset() {
      speed = startSpeed;
      score = 0;
      frame = 0;
      obstacles = [];
      particles = [];
      runGhostFrames = [];
      initSky();
      gameOver = false;
      started = false;
      runJumps = 0;
      dino.y = GROUND_Y - 48;
      dino.w = 42;
      dino.h = 48;
      dino.vy = 0;
      dino.onGround = true;
      dino.ducking = false;
      jumpHeld = false;
      jumpHoldFrames = 0;
      landingSquashFrames = 0;
      impactFlashFrames = 0;
      impactRingFrames = 0;
      deathSpinFrames = 0;
      currentBiomeId = "dawn";
      biomeFlash = 0;
    }

    function showMenu(mode = "start") {
      inMenu = true;
      inShop = false;
      menuOverlay.classList.remove("hidden");
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      if (mode === "gameover") {
        menuTitle.textContent = "Game Over";
        menuText.textContent = `Puntuación: ${Math.floor(score)} · Récord: ${best}`;
        if (missionNotice) {
          menuText.textContent += ` · Misión: ${missionNotice}`;
          missionNotice = "";
        }
        menuBtn.textContent = "Reintentar";
      } else {
        menuTitle.textContent = "Dino Runner";
        menuText.textContent = "Espacio o Flecha arriba para saltar. Flecha abajo para agacharte.";
        menuBtn.textContent = "Jugar";
      }
      renderMetaPanels();
    }

    function hideMenu() {
      inMenu = false;
      inShop = false;
      menuOverlay.classList.add("hidden");
    }

    function openShop() {
      inShop = true;
      menuHome.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
      shopView.classList.remove("hidden");
      const shopText = shopView.querySelector(".menu-text");
      if (shopText) {
        shopText.textContent = `Tria el color del teu dinosaure. Puntos: ${Math.floor(score)} · Monedas: ${Math.floor(coins)}`;
      }
      renderSkinShop();
    }

    function closeShop() {
      inShop = false;
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
    }

    function renderTitlesView() {
      allTitlesList.innerHTML = "";
      if (titlesInfo) {
        titlesInfo.textContent = `Puntos de misión actuales: ${Math.floor(missionPoints)} · Compra y equipa títulos aquí.`;
      }
      const unlockedTitles = getUnlockedTitleNames();

      const base = document.createElement("li");
      base.textContent = `OK Novato - Título inicial`;
      if (activeTitle !== "Novato") {
        const baseBtn = document.createElement("button");
        baseBtn.type = "button";
        baseBtn.textContent = "Equipar";
        baseBtn.style.marginLeft = "8px";
        baseBtn.addEventListener("click", () => equipTitleByName("Novato"));
        base.appendChild(baseBtn);
      } else {
        base.textContent += " · Equipado";
      }
      allTitlesList.appendChild(base);

      for (const a of ACHIEVEMENT_DEFS) {
        const li = document.createElement("li");
        const unlocked = unlockedTitles.has(a.title);
        li.textContent = `${unlocked ? "OK" : "BLOQ"} ${a.title} - ${a.desc}`;
        if (unlocked) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = activeTitle === a.title ? "Equipado" : "Equipar";
          btn.disabled = activeTitle === a.title;
          btn.style.marginLeft = "8px";
          btn.addEventListener("click", () => equipTitleByName(a.title));
          li.appendChild(btn);
        }
        allTitlesList.appendChild(li);
      }

      for (const exTitle of Array.from(unlockedExclusiveTitles).sort()) {
        const li = document.createElement("li");
        li.textContent = `EXCLUSIVO ${exTitle} - Título único de la tienda diaria`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.marginLeft = "8px";
        btn.textContent = activeTitle === exTitle ? "Equipado" : "Equipar";
        btn.disabled = activeTitle === exTitle;
        btn.addEventListener("click", () => equipTitleByName(exTitle));
        li.appendChild(btn);
        allTitlesList.appendChild(li);
      }

      for (const t of MISSION_TITLE_SHOP) {
        const li = document.createElement("li");
        const purchased = purchasedTitles.has(t.id);
        const canBuy = missionPoints >= t.cost;
        li.textContent = `${purchased ? "COMPRADO" : "TIENDA"} ${t.title} - ${t.desc} (${t.cost} PM)`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.marginLeft = "8px";
        if (purchased) {
          btn.textContent = activeTitle === t.title ? "Equipado" : "Equipar";
          btn.disabled = activeTitle === t.title;
          btn.addEventListener("click", () => equipTitleByName(t.title));
        } else {
          btn.textContent = "Comprar";
          btn.disabled = !canBuy;
          btn.addEventListener("click", () => {
            if (buyMissionTitle(t.id)) {
              setCommandMessage(`Título comprado: ${t.title}`);
            } else {
              setCommandMessage(`Te faltan puntos de misión para ${t.title}`);
            }
          });
        }
        li.appendChild(btn);
        allTitlesList.appendChild(li);
      }
    }

    function openTitlesView() {
      inShop = false;
      menuHome.classList.add("hidden");
      shopView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
      titlesView.classList.remove("hidden");
      renderTitlesView();
    }

    function closeTitlesView() {
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
    }

    async function renderGlobalRankingView() {
      if (globalRankingInfo) {
        globalRankingInfo.textContent = onlineReady
          ? `Jugador actual: ${playerName || "sin nombre"} · Ranking ONLINE activo (${ONLINE_TABLE}).`
          : `Jugador actual: ${playerName || "sin nombre"} · Ranking local (offline).`;
      }
      globalRankingList.innerHTML = "";
      let rows = [];
      if (onlineReady) {
        const ok = await fetchOnlineLeaderboard();
        if (ok && onlineLeaderboard.length > 0) {
          rows = onlineLeaderboard.map((r) => ({ name: r.name, bestScore: r.bestScore }));
        }
      }
      if (rows.length === 0) {
        rows = Object.entries(machineGlobalRanking)
          .map(([name, bestScore]) => ({ name, bestScore: Number(bestScore) || 0 }))
          .sort((a, b) => b.bestScore - a.bestScore)
          .slice(0, 50);
      }

      if (rows.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aún no hay jugadores en el ranking global";
        globalRankingList.appendChild(li);
        return;
      }

      rows.forEach((row, i) => {
        const li = document.createElement("li");
        li.textContent = `#${i + 1} ${row.name} - ${row.bestScore}`;
        globalRankingList.appendChild(li);
      });
    }

    function openGlobalRankingView() {
      menuHome.classList.add("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
      globalRankingView.classList.remove("hidden");
      renderGlobalRankingView();
    }

    function closeGlobalRankingView() {
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
    }

    function renderPrestigeView() {
      const needed = getPrestigePointsNeededForNextLevel();
      const left = Math.max(0, needed - prestigePoints);
      if (prestigeInfo) {
        prestigeInfo.textContent = `Nivel ${prestigeLevel} · PP ${prestigePoints} · faltan ${left} PP para subir`;
      }
      if (!prestigeList) return;
      prestigeList.innerHTML = "";
      const a = document.createElement("li");
      a.textContent = `Bonus puntos de misión: x${getPrestigeMissionMultiplier().toFixed(2)}`;
      const b = document.createElement("li");
      b.textContent = `Bonus monedas: x${getPrestigeCoinMultiplier().toFixed(2)}`;
      const c = document.createElement("li");
      c.textContent = `Coste próximo nivel: ${needed} PP`;
      const d = document.createElement("li");
      d.textContent = `Puntos disponibles para cambiar ahora: ${Math.floor(score)}`;
      prestigeList.appendChild(a);
      prestigeList.appendChild(b);
      prestigeList.appendChild(c);
      prestigeList.appendChild(d);
    }

    function openPrestigeView() {
      menuHome.classList.add("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
      prestigeView.classList.remove("hidden");
      renderPrestigeView();
    }

    function closePrestigeView() {
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      aboutView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      profilesView.classList.add("hidden");
    }

    function openAboutView() {
      menuHome.classList.add("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.remove("hidden");
      profilesView.classList.add("hidden");
    }

    function closeAboutView() {
      menuHome.classList.remove("hidden");
      shopView.classList.add("hidden");
      titlesView.classList.add("hidden");
      globalRankingView.classList.add("hidden");
      prestigeView.classList.add("hidden");
      aboutView.classList.add("hidden");
      profilesView.classList.add("hidden");
    }

    function startGame() {
      if (!ensurePlayerName()) return;
      reset();
      runMode = "normal";
      started = true;
      hideMenu();
    }

    function jump() {
      if (inMenu) return;
      if (!started) started = true;
      if (dino.onGround && !gameOver) {
        dino.vy = baseJumpVelocity * Math.sqrt(jumpSpeedFactor) * getUpgradeJumpMultiplier();
        dino.onGround = false;
        jumpHoldFrames = 0;
        runJumps++;
      }
    }

    function setDuck(isDown) {
      if (inMenu) return;
      if (gameOver) return;
      if (isDown && dino.onGround) {
        dino.ducking = true;
        dino.h = 30;
        dino.w = 56;
      } else {
        dino.ducking = false;
        dino.h = 48;
        dino.w = 42;
      }
      dino.y = GROUND_Y - dino.h;
    }

    function spawnObstacle() {
      const isBird = score > 80 && Math.random() < 0.24;
      if (isBird) {
        obstacles.push({
          type: "bird",
          x: canvas.width + rand(0, 120),
          y: GROUND_Y - rand(82, 122),
          w: 40,
          h: 26,
          flap: rand(0, 10)
        });
        return;
      }

      const tall = Math.random() < 0.5;
      obstacles.push({
        type: "cactus",
        x: canvas.width + rand(0, 120),
        y: tall ? GROUND_Y - 68 : GROUND_Y - 46,
        w: tall ? 30 : 24,
        h: tall ? 68 : 46
      });
    }

    function addDust() {
      if (!dino.onGround || gameOver || !started) return;
      particles.push({
        x: dino.x + rand(8, dino.w - 2),
        y: GROUND_Y - 2,
        vx: rand(-0.8, -2),
        vy: rand(-0.2, -1),
        life: rand(14, 28)
      });
    }

    function hit(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function update() {
      if (inMenu || commandOpen) return;
      const wasOnGround = dino.onGround;
      const prevVy = dino.vy;
      if (!gameOver && started) {
        frame++;
        runGhostFrames.push({ y: Number(dino.y.toFixed(2)), ducking: Boolean(dino.ducking) });
        if (runGhostFrames.length > 6000) runGhostFrames.shift();
        score += speed * 0.045;
        speed += 0.0007;

        if (frame % 5 === 0) addDust();

        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - rand(230, 420)) {
          spawnObstacle();
        }

        for (const obs of obstacles) {
          obs.x -= speed;
          if (obs.type === "bird") {
            obs.flap += 0.34;
          }
          if (!godMode && hit(dino, obs)) {
            shakeFrames = 12;
            impactFlashFrames = 12;
            impactRingFrames = 16;
            deathSpinFrames = 22;
            spawnImpactBurst(dino.x + dino.w * 0.7, GROUND_Y - 2, 16, 3.9);
            gameOver = true;
            const previousBest = best;
            const finalScore = Math.floor(score);
            best = Math.max(best, finalScore);
            if (finalScore > previousBest && runGhostFrames.length > 0) {
              bestGhostFrames = runGhostFrames.slice(0, 6000);
              ghostBestScore = finalScore;
              saveGhostData();
            }
            localStorage.setItem("dino-best", String(best));
            stats.games++;
            stats.totalScore += Math.floor(score);
            stats.totalJumps += runJumps;
            const wasWeeklyCompleted = weeklyProgress.completed;
            updateWeeklyMissionProgress(score);
            if (!wasWeeklyCompleted && score >= WEEKLY.target) {
              stats.challengeWins++;
              coins += Math.floor(120 * getPrestigeCoinMultiplier() * getUpgradeCoinMultiplier());
              saveCoins();
              missionNotice = `Desafío semanal superado (+${Math.floor(120 * getPrestigeCoinMultiplier() * getUpgradeCoinMultiplier())} monedas)`;
              weeklyFinisherFrames = 80;
            }
            saveStats();
            updateLocalRanking(score);
            updateGlobalRanking(score);
            syncOnlineScore(score);
            updateMissionProgress();
            evaluateAchievements();
            started = false;
            resetCommandTweaksToDefault();
            showMenu("gameover");
          }
        }

        for (const cloud of clouds) {
          cloud.x -= speed * 0.14;
          if (cloud.x + cloud.w < -30) {
            cloud.x = canvas.width + rand(20, 90);
            cloud.y = rand(24, 96);
            cloud.w = rand(48, 88);
          }
        }

        for (const hill of hills) {
          hill.x -= speed * 0.32;
          if (hill.x + hill.w < -30) {
            hill.x = canvas.width + rand(40, 120);
            hill.w = rand(180, 250);
            hill.h = rand(24, 48);
          }
        }

        obstacles = obstacles.filter(o => o.x + o.w > -10);
      }

      if (!gameOver && hasChargedJump() && jumpHeld && !dino.onGround && dino.vy < 0 && jumpHoldFrames < 14) {
        dino.vy -= 0.34 * jumpSpeedFactor;
        jumpHoldFrames++;
      }

      dino.vy += gravityValue * jumpSpeedFactor;
      dino.y += dino.vy;

      const groundTop = GROUND_Y - dino.h;
      if (dino.y >= groundTop) {
        dino.y = groundTop;
        dino.vy = 0;
        dino.onGround = true;
        jumpHoldFrames = 0;
        if (!wasOnGround && prevVy > 4.2) {
          landingSquashFrames = Math.min(18, Math.floor(prevVy * 1.3));
          impactRingFrames = Math.max(impactRingFrames, Math.min(14, Math.floor(prevVy * 1.2)));
          spawnImpactBurst(dino.x + dino.w * 0.5, GROUND_Y - 2, Math.min(18, Math.floor(prevVy + 4)), Math.min(4.2, prevVy * 0.5));
        }
      } else {
        dino.onGround = false;
      }
      if (landingSquashFrames > 0) landingSquashFrames--;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.life -= 1;
      }
      particles = particles.filter(p => p.life > 0);
    }

    function drawSky() {
      const biome = getCurrentBiome();
      ctx.fillStyle = biome.sky;
      ctx.fillRect(0, 0, canvas.width, GROUND_Y + 2);
      for (const hill of hills) {
        ctx.fillStyle = biome.hill;
        ctx.beginPath();
        ctx.ellipse(hill.x + hill.w / 2, GROUND_Y + 4, hill.w / 2, hill.h, 0, Math.PI, Math.PI * 2);
        ctx.fill();
      }

      for (const cloud of clouds) {
        ctx.fillStyle = biome.cloud;
        ctx.fillRect(cloud.x, cloud.y + 6, cloud.w * 0.5, cloud.h * 0.64);
        ctx.fillRect(cloud.x + cloud.w * 0.24, cloud.y, cloud.w * 0.44, cloud.h);
        ctx.fillRect(cloud.x + cloud.w * 0.58, cloud.y + 8, cloud.w * 0.38, cloud.h * 0.58);
      }
    }

    function drawGround() {
      const biome = getCurrentBiome();
      ctx.fillStyle = biome.ground;
      ctx.fillRect(0, GROUND_Y + 2, canvas.width, canvas.height - GROUND_Y - 2);

      ctx.strokeStyle = biome.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 1);
      ctx.lineTo(canvas.width, GROUND_Y + 1);
      ctx.stroke();

      ctx.fillStyle = biome.dust;
      for (let x = -((frame * speed * 0.72) % 64); x < canvas.width + 64; x += 64) {
        const lineA = 14 + ((x / 64) % 3 + 3) % 3 * 4;
        const lineB = 8 + ((x / 64) % 2 + 2) % 2 * 5;
        ctx.fillRect(x, GROUND_Y + 8, lineA, 2);
        ctx.fillRect(x + 12, GROUND_Y + 14, lineB, 2);
      }
    }

    function drawSprite(rows, x, y, scale, color) {
      ctx.fillStyle = color;
      for (let row = 0; row < rows.length; row++) {
        const line = rows[row];
        for (let col = 0; col < line.length; col++) {
          if (line[col] === "1") {
            ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
          }
        }
      }
    }

    function drawDinoAsset(skin, runFrame, isGameOver) {
      const conf = DINO_ASSETS[skin.variant];
      const img = conf ? loadedDinoAssets[skin.variant] : null;
      if (!conf || !img || !img.complete || img.naturalWidth === 0) return false;

      const bob = dino.onGround && !dino.ducking ? (runFrame === 0 ? 0 : 1.5) : 0;
      let drawW = conf.w;
      let drawH = conf.h;
      if (dino.ducking) {
        drawW = conf.w + 10;
        drawH = conf.h - 24;
      }

      const drawX = dino.x - 8;
      const drawY = dino.y + conf.yOffset + bob + (dino.ducking ? 20 : 0);
      const jumpStretch = !dino.onGround ? Math.min(0.18, Math.abs(dino.vy) * 0.012) : 0;
      const squash = landingSquashFrames > 0 ? Math.min(0.2, landingSquashFrames / 48) : 0;
      let sx = 1;
      let sy = 1;
      let rot = 0;
      if (!isGameOver) {
        if (!dino.onGround) {
          if (dino.vy < -0.2) {
            sy += jumpStretch;
            sx -= jumpStretch * 0.5;
            rot = -0.08;
          } else {
            sx += jumpStretch * 0.65;
            sy -= jumpStretch * 0.45;
            rot = 0.09;
          }
        } else if (squash > 0) {
          sx += squash;
          sy -= squash * 0.75;
        }
      } else {
        const spinT = Math.max(0, deathSpinFrames) / 22;
        rot = 0.95 - spinT * 0.65;
        sx = 1 + 0.05 * (1 - spinT);
        sy = 1 - 0.12 * (1 - spinT);
      }
      const cx = drawX + drawW / 2;
      const cy = drawY + drawH / 2;
      ctx.save();
      if (isGameOver) ctx.globalAlpha = 0.5;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.scale(sx, sy);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
      return true;
    }

    function drawVariantFeatures(skin, color, eyeColor) {
      const base = gameOver ? "#555" : color;
      ctx.fillStyle = base;

      if (skin.variant === "mario") {
        if (!gameOver) {
          ctx.fillStyle = "#d22626";
          ctx.fillRect(dino.x + 18, dino.y + 1, 16, 4);
          ctx.fillRect(dino.x + 22, dino.y + 5, 10, 3);
          ctx.fillStyle = "#2f56c9";
          ctx.fillRect(dino.x + 12, dino.y + 24, 16, 8);
          ctx.fillStyle = "#2a1a12";
          ctx.fillRect(dino.x + 20, dino.y + 12, 8, 2);
        }
      }

      if (skin.variant === "sonic") {
        const spikes = dino.ducking
          ? [{ x: -8, y: 12 }, { x: -4, y: 8 }, { x: 0, y: 11 }, { x: 4, y: 9 }]
          : [{ x: -6, y: 16 }, { x: -2, y: 10 }, { x: 3, y: 14 }, { x: 8, y: 9 }];
        for (const s of spikes) {
          ctx.fillRect(dino.x + s.x, dino.y + s.y, 5, 4);
        }
        if (!gameOver) {
          ctx.fillStyle = "#f1d7b8";
          ctx.fillRect(dino.x + 14, dino.y + 20, 10, 6);
        }
      }

      if (skin.variant === "hollow") {
        if (!gameOver) {
          ctx.fillStyle = "#f4f4f4";
          ctx.fillRect(dino.x + 18, dino.y + 3, 13, 7);
          ctx.fillRect(dino.x + 18, dino.y, 4, 4);
          ctx.fillRect(dino.x + 27, dino.y, 4, 4);
          ctx.fillStyle = "#111";
          ctx.fillRect(dino.x + 20, dino.y + 5, 3, 3);
          ctx.fillRect(dino.x + 26, dino.y + 5, 3, 3);
        }
      }

      if (skin.variant === "silksong") {
        if (!gameOver) {
          ctx.fillStyle = "#f7f7f7";
          ctx.fillRect(dino.x + 19, dino.y + 2, 12, 5);
          ctx.fillRect(dino.x + 18, dino.y - 1, 3, 4);
          ctx.fillRect(dino.x + 29, dino.y - 1, 3, 4);
          ctx.fillStyle = "#d42b36";
          ctx.fillRect(dino.x + 10, dino.y + 18, 18, 10);
          ctx.fillRect(dino.x + 8, dino.y + 28, 10, 4);
        }
      }

      if (skin.variant === "shrek") {
        const earY = dino.ducking ? dino.y + 5 : dino.y + 3;
        ctx.fillRect(dino.x + 17, earY, 3, 4);
        ctx.fillRect(dino.x + 30, earY, 3, 4);
        if (!gameOver) {
          ctx.fillStyle = "#5a3d2b";
          ctx.fillRect(dino.x + 11, dino.y + 20, 17, 8);
        }
      }
    }

    function drawGhostDino() {
      if (!started || gameOver || bestGhostFrames.length === 0) return;
      const sample = bestGhostFrames[Math.min(frame, bestGhostFrames.length - 1)];
      if (!sample) return;
      const skin = getCurrentSkin();
      const conf = DINO_ASSETS[skin.variant];
      const img = conf ? loadedDinoAssets[skin.variant] : null;
      ctx.save();
      ctx.globalAlpha = 0.24;
      if (conf && img && img.complete && img.naturalWidth > 0) {
        let drawW = conf.w;
        let drawH = conf.h;
        if (sample.ducking) {
          drawW = conf.w + 10;
          drawH = conf.h - 24;
        }
        const drawX = dino.x - 8;
        const drawY = sample.y + conf.yOffset + (sample.ducking ? 20 : 0);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = "#5b6f8d";
        const h = sample.ducking ? 30 : 48;
        const w = sample.ducking ? 56 : 42;
        ctx.fillRect(dino.x, sample.y + (sample.ducking ? 18 : 0), w, h);
      }
      ctx.restore();
    }
    function drawDino() {
      const skin = getCurrentSkin();
      const color = gameOver ? "#555" : skin.color;
      const eyeColor = skin.eye || "#fff";
      const runFrame = Math.floor(frame / 6) % 2;
      if (drawDinoAsset(skin, runFrame, gameOver)) {
        return;
      }
      const standing1 = [
        "00000000000011111111100000",
        "00000000000011111111110000",
        "00000000000110000000111000",
        "00000000000110000000111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111100000",
        "00000000000111111100000000",
        "00000000001111111100000000",
        "00000000011111111111100000",
        "00000001111111111111110000",
        "00000111111111111111110000",
        "00011111111111111111100000",
        "00111111111111111111000000",
        "01111111111111111110000000",
        "01111111111111111100000000",
        "00111111111111111000000000",
        "00011111111111110000000000",
        "00001111111111100000000000",
        "00000111111111000000000000",
        "00000111111111000000000000",
        "00000111100111000000000000",
        "00000111000111100000000000",
        "00000111000011100000000000",
        "00000111000011100000000000"
      ];
      const standing2 = [
        "00000000000011111111100000",
        "00000000000011111111110000",
        "00000000000110000000111000",
        "00000000000110000000111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111100000",
        "00000000000111111100000000",
        "00000000001111111100000000",
        "00000000011111111111100000",
        "00000001111111111111110000",
        "00000111111111111111110000",
        "00011111111111111111100000",
        "00111111111111111111000000",
        "01111111111111111110000000",
        "01111111111111111100000000",
        "00111111111111111000000000",
        "00011111111111110000000000",
        "00001111111111100000000000",
        "00000111111111000000000000",
        "00000111111111000000000000",
        "00000111100111000000000000",
        "00000111100011100000000000",
        "00000111000001110000000000",
        "00000111000001110000000000"
      ];
      const ducking = [
        "0000000011111111111111000000",
        "0000000111111111111111100000",
        "0000001111000000111111110000",
        "0000001111111111111111110000",
        "0000011111111111111111111000",
        "0000011111111111111111111000",
        "0000011111111111111111111000",
        "0000011111111111111111110000",
        "0000111111111111111111100000",
        "0001111111111111111111000000",
        "0011111111111111111110000000",
        "0111111111111111111100000000",
        "0111111111111111111000000000",
        "0011111111111111110000000000",
        "0001111111111111100000000000",
        "0000111111111111000000000000",
        "0000011111111110000000000000",
        "0000011111111110000000000000",
        "0000011110011110000000000000",
        "0000011100000111000000000000",
        "0000011100000011100000000000",
        "0000011100000011100000000000"
      ];
      const jumping = [
        "00000000000011111111100000",
        "00000000000011111111110000",
        "00000000000110000000111000",
        "00000000000110000000111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111111000",
        "00000000000111111111100000",
        "00000000000111111100000000",
        "00000000001111111100000000",
        "00000000011111111111100000",
        "00000001111111111111110000",
        "00000111111111111111110000",
        "00011111111111111111100000",
        "00111111111111111111000000",
        "01111111111111111110000000",
        "01111111111111111100000000",
        "00111111111111111000000000",
        "00011111111111110000000000",
        "00001111111111100000000000",
        "00000111111111000000000000",
        "00000111111111000000000000",
        "00000111111111000000000000",
        "00000111111111000000000000",
        "00000111001110000000000000",
        "00000111001110000000000000"
      ];

      const scale = skin.variant === "shrek" ? 1.52 : skin.variant === "sonic" ? 1.42 : 1.46;
      if (dino.ducking) {
        drawSprite(ducking, dino.x - 3, dino.y + 1, scale, color);
        ctx.fillStyle = eyeColor;
        ctx.fillRect(dino.x + 20, dino.y + 5, 3, 3);
      } else if (!dino.onGround) {
        drawSprite(jumping, dino.x - 1, dino.y, scale, color);
        ctx.fillStyle = eyeColor;
        ctx.fillRect(dino.x + 20, dino.y + 5, 3, 3);
      } else {
        drawSprite(runFrame === 0 ? standing1 : standing2, dino.x - 1, dino.y, scale, color);
        ctx.fillStyle = eyeColor;
        ctx.fillRect(dino.x + 20, dino.y + 5, 3, 3);
      }
      drawVariantFeatures(skin, color, eyeColor);
    }

    function drawCactus(obs) {
      const biome = getCurrentBiome();
      ctx.fillStyle = biome.cactus;
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.fillStyle = biome.cactusLight;
      ctx.fillRect(obs.x + obs.w * 0.2, obs.y + 4, obs.w * 0.2, obs.h - 8);

      const armY = obs.y + obs.h * 0.35;
      ctx.fillStyle = biome.cactus;
      ctx.fillRect(obs.x - 6, armY, 6, 14);
      ctx.fillRect(obs.x + obs.w, armY + 10, 6, 16);
      ctx.fillStyle = biome.cactusLight;
      ctx.fillRect(obs.x - 5, armY + 2, 2, 10);
      ctx.fillRect(obs.x + obs.w + 2, armY + 12, 2, 10);
    }

    function drawBird(obs) {
      const biome = getCurrentBiome();
      const wingUp = Math.sin(obs.flap) > 0;
      ctx.fillStyle = biome.bird;
      ctx.fillRect(obs.x + 8, obs.y + 8, 20, 9);
      ctx.fillRect(obs.x + 27, obs.y + 10, 7, 5);
      ctx.fillRect(obs.x + 4, obs.y + (wingUp ? 2 : 11), 12, 4);
      ctx.fillStyle = "#222";
      ctx.fillRect(obs.x + 28, obs.y + 8, 4, 2);
      ctx.fillStyle = "#f4f4f4";
      ctx.fillRect(obs.x + 29, obs.y + 11, 2, 2);
    }

    function drawObstacles() {
      for (const obs of obstacles) {
        if (obs.type === "bird") {
          drawBird(obs);
        } else {
          drawCactus(obs);
        }
      }
    }

    function drawParticles() {
      ctx.fillStyle = "#888";
      for (const p of particles) {
        const a = Math.max(0, p.life / 28);
        ctx.globalAlpha = a;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      ctx.globalAlpha = 1;
    }

    function drawImpactEffects() {
      if (impactRingFrames > 0) {
        const t = impactRingFrames / 16;
        const radius = (1 - t) * 72;
        ctx.strokeStyle = `rgba(255, 115, 64, ${Math.max(0.1, t * 0.8)})`;
        ctx.lineWidth = 2 + (1 - t) * 3;
        ctx.beginPath();
        ctx.arc(dino.x + dino.w / 2, GROUND_Y - 2, radius, Math.PI, Math.PI * 2);
        ctx.stroke();
        impactRingFrames--;
      }
      if (impactFlashFrames > 0) {
        const alpha = impactFlashFrames / 18;
        ctx.fillStyle = `rgba(255, 120, 80, ${alpha * 0.22})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        impactFlashFrames--;
      }
      if (deathSpinFrames > 0) deathSpinFrames--;
    }

    function drawUI() {
      ctx.fillStyle = "#333";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`SCORE ${String(Math.floor(score)).padStart(5, "0")}`, canvas.width - 260, 34);
      ctx.fillText(`BEST ${String(best).padStart(5, "0")}`, canvas.width - 260, 60);

      if (!started && !gameOver) {
        ctx.fillStyle = "#444";
        ctx.font = "bold 24px monospace";
        ctx.fillText("PULSA ESPACIO PARA EMPEZAR", 220, 120);
      }

      if (gameOver) {
        ctx.fillStyle = "#b00";
        ctx.font = "bold 34px monospace";
        ctx.fillText("GAME OVER", 320, 120);

        ctx.fillStyle = "#333";
        ctx.font = "bold 20px monospace";
        ctx.fillText("Pulsa Enter para reiniciar", 292, 158);
      }
    }

    function draw() {
      let translated = false;
      if (shakeFrames > 0) {
        ctx.save();
        const dx = (Math.random() - 0.5) * 4;
        const dy = (Math.random() - 0.5) * 4;
        ctx.translate(dx, dy);
        shakeFrames--;
        translated = true;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSky();
      drawGround();
      drawParticles();
      drawObstacles();
      drawGhostDino();
      drawDino();
      drawImpactEffects();
      drawUI();
      if (weeklyFinisherFrames > 0) {
        const alpha = Math.min(0.85, weeklyFinisherFrames / 80);
        ctx.fillStyle = `rgba(255, 214, 10, ${alpha * 0.24})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(255, 160, 0, ${alpha})`;
        ctx.font = "bold 30px monospace";
        ctx.fillText("MISION SEMANAL COMPLETADA!", 160, 92);
        ctx.font = "bold 20px monospace";
        ctx.fillText("+BONUS", 388, 122);
        weeklyFinisherFrames--;
      }
      if (biomeFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${biomeFlash / 120})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        biomeFlash--;
      }
      if (translated) {
        ctx.restore();
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === "Tab" && !commandOpen) {
        e.preventDefault();
        toggleCommandPanel(true);
        return;
      }

      if (commandOpen) {
        if (e.code === "Tab") {
          e.preventDefault();
          toggleCommandPanel(false);
        }
        return;
      }

      if (["Space", "ArrowUp", "ArrowDown", "Enter"].includes(e.code)) {
        e.preventDefault();
      }

      const onHomeMenu = inMenu && !menuHome.classList.contains("hidden");
      if ((e.code === "Space" || e.code === "ArrowUp" || e.code === "Enter") && onHomeMenu) {
        startGame();
        return;
      }

      if (e.code === "Space") {
        jumpHeld = true;
      }
      if (e.code === "Space" || e.code === "ArrowUp") jump();
      if (e.code === "ArrowDown") setDuck(true);
      if (e.code === "Enter" && gameOver) showMenu("gameover");
    });

    window.addEventListener("keyup", (e) => {
      if (commandOpen) return;
      if (e.code === "Space") {
        jumpHeld = false;
        const jumpCut = -4.5 * Math.sqrt(jumpSpeedFactor);
        if (hasChargedJump() && !dino.onGround && dino.vy < jumpCut) {
          dino.vy = jumpCut;
        }
      }
      if (e.code === "ArrowDown") setDuck(false);
    });

    menuBtn.addEventListener("click", startGame);
    prestigeBtn.addEventListener("click", openPrestigeView);
    prestigeBackBtn.addEventListener("click", closePrestigeView);
    prestigeExchangeBtn.addEventListener("click", () => {
      if (!exchangeScoreToPrestigePoints(prestigeExchangeInput.value)) {
        setCommandMessage("No se pudo cambiar (min 500 puntos y cantidad válida)");
      }
      prestigeExchangeInput.value = "";
    });
    prestigeLevelUpBtn.addEventListener("click", () => {
      const needed = getPrestigePointsNeededForNextLevel();
      if (!levelUpPrestigeWithPoints()) {
        setCommandMessage(`Te faltan ${Math.max(0, needed - prestigePoints)} PP para subir nivel`);
      }
    });
    prestigeLevelUp10Btn.addEventListener("click", () => {
      const gained = levelUpPrestigeBulk(10);
      if (gained <= 0) {
        setCommandMessage("No te alcanza PP para subir 10 niveles");
      } else {
        setCommandMessage(`Subiste ${gained} niveles · Nivel actual ${prestigeLevel}`);
      }
    });
    prestigeLevelUp100Btn.addEventListener("click", () => {
      const gained = levelUpPrestigeBulk(100);
      if (gained <= 0) {
        setCommandMessage("No te alcanza PP para subir 100 niveles");
      } else {
        setCommandMessage(`Subiste ${gained} niveles · Nivel actual ${prestigeLevel}`);
      }
    });
    globalRankingOpenBtn.addEventListener("click", openGlobalRankingView);
    globalRankingBackBtn.addEventListener("click", closeGlobalRankingView);
    aboutOpenBtn.addEventListener("click", openAboutView);
    aboutBackBtn.addEventListener("click", closeAboutView);
    profilesOpenBtn.addEventListener("click", openProfilesView);
    profilesBackBtn.addEventListener("click", closeProfilesView);
    profileCreateBtn.addEventListener("click", () => {
      if (!createProfile(profileNameInput.value)) {
        setCommandMessage("No se pudo crear perfil (vacío o existente)");
      } else {
        setCommandMessage(`Perfil creado: ${profilesState.active}`);
      }
      profileNameInput.value = "";
    });
    profileDeleteBtn.addEventListener("click", () => {
      if (!deleteCurrentProfile()) {
        setCommandMessage("No puedes borrar el único perfil");
      } else {
        setCommandMessage(`Perfil activo: ${profilesState.active}`);
      }
    });
    shopOpenBtn.addEventListener("click", openShop);
    shopBackBtn.addEventListener("click", closeShop);
    titlesOpenBtn.addEventListener("click", openTitlesView);
    titlesBackBtn.addEventListener("click", closeTitlesView);
    nameSaveBtn.addEventListener("click", submitPlayerName);
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitPlayerName();
      }
    });
    exchangeBtn.addEventListener("click", () => {
      exchangePointsToCoins(exchangeInput.value);
      exchangeInput.value = "";
    });
    exchangeAllBtn.addEventListener("click", () => {
      exchangePointsToCoins(Math.floor(score));
      exchangeInput.value = "";
    });
    exchangeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        exchangePointsToCoins(exchangeInput.value);
        exchangeInput.value = "";
      }
    });
    commandInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const raw = commandInput.value;
        pushCommandHistory(raw);
        executeCommand(raw);
        commandInput.value = "";
        commandHistoryIndex = -1;
        renderCommandHint();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveCommandHistory(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveCommandHistory(1);
      } else if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        if (!autocompleteCommandInput()) {
          toggleCommandPanel(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        toggleCommandPanel(false);
      }
    });
    commandInput.addEventListener("input", () => {
      commandHistoryIndex = -1;
      renderCommandHint();
    });

    loadUnlockedSkins();
    loadRankings();
    loadGlobalRanking();
    loadPlayerName();
    loadStats();
    loadAchievements();
    loadDailyMissions();
    loadWeeklyProgress();
    loadUpgradeLevels();
    loadGhostData();
    initOnlineBackend();
    loadProfilesSystem();
    evaluateAchievements();
    if (!isSkinUnlocked(selectedSkinId)) {
      selectedSkinId = "classic";
      localStorage.setItem("dino-skin", selectedSkinId);
    }
    reset();
    renderSkinShop();
    renderMetaPanels();
    showMenu("start");
    if (!playerName) showNamePrompt();
    window.addEventListener("beforeunload", saveCurrentProfileState);
    loop();
