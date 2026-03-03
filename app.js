// ══════════════════════════════════════════════════════
//  Loup-Garou PWA — app.js
//  Firebase Realtime Database (mode Spark gratuit)
// ══════════════════════════════════════════════════════

// ── Firebase config ───────────────────────────────────
// ⚠️  Remplace ces valeurs par celles de ton projet Firebase
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAXfl6jvM5N1bJWgXc8wxEgL7My4hoDpG0",
  authDomain: "loup-garou-f8e63.firebaseapp.com",
  databaseURL: "https://loup-garou-f8e63-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "loup-garou-f8e63",
  storageBucket: "loup-garou-f8e63.firebasestorage.app",
  messagingSenderId: "1000060545375",
  appId: "1:1000060545375:web:2c49b42d85cdc314dceeea"
};

// ── Rôles disponibles ─────────────────────────────────
const ROLES_DEF = {
  wolf:    { name: "Loup-Garou",  emoji: "🐺", desc: "Chaque nuit, les loups choisissent une victime. Le jour, ils se fondent dans le village.", css: "wolf", team: "wolf" },
  village: { name: "Villageois",  emoji: "🧑‍🌾", desc: "Simple villageois, tu dois débusquer les loups-garous grâce à ton intuition.", css: "village", team: "village" },
  seer:    { name: "Voyante",     emoji: "🔮", desc: "Chaque nuit, tu découvres la véritable nature d'un joueur.", css: "seer", team: "village" },
  witch:   { name: "Sorcière",    emoji: "🧙‍♀️", desc: "Tu possèdes une potion de vie et une potion de mort. Use-en avec sagesse.", css: "witch", team: "village" },
  hunter:  { name: "Chasseur",    emoji: "🏹", desc: "Si tu es éliminé, tu emportes un joueur de ton choix dans la mort.", css: "hunter", team: "village" },
  cupid:   { name: "Cupidon",     emoji: "💘", desc: "La première nuit, tu désignes deux amoureux. Si l'un meurt, l'autre meurt aussi.", css: "cupid", team: "village" },
};

const AVATARS = ["🐻","🦊","🦁","🐯","🐨","🦝","🦌","🐺","🐮","🐷","🐸","🦋","🐬","🦜","🦔"];

// ── État local ────────────────────────────────────────
let db, gameRef, playersRef, state;
let myId = sessionStorage.getItem('lgPlayerId') || null;
let myName = sessionStorage.getItem('lgPlayerName') || null;
let roomCode = sessionStorage.getItem('lgRoomCode') || null;
let isMaster = false;

// ── Init Firebase ─────────────────────────────────────
function initFirebase() {
  if (typeof firebase === 'undefined') {
    showError("Firebase non chargé. Vérifie ta connexion.");
    return false;
  }
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.database();
  return true;
}

// ── Utilitaires ───────────────────────────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function generateId() {
  return Math.random().toString(36).slice(2, 10);
}
function randomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
function showError(msg, container = 'error-msg') {
  const el = document.getElementById(container);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}
function hideError(container = 'error-msg') {
  const el = document.getElementById(container);
  if (el) el.classList.add('hidden');
}

// ══════════════════════════════════════════════════════
//  PAGE : index.html — Accueil
// ══════════════════════════════════════════════════════
function initHome() {
  if (!initFirebase()) return;

  document.getElementById('btn-create').addEventListener('click', async () => {
    const name = document.getElementById('player-name').value.trim();
    if (!name) { showError("Entre ton prénom d'abord !"); return; }
    hideError();
    await createRoom(name);
  });

  document.getElementById('btn-join').addEventListener('click', async () => {
    const name = document.getElementById('player-name').value.trim();
    const code = document.getElementById('room-code').value.trim().toUpperCase();
    if (!name) { showError("Entre ton prénom d'abord !"); return; }
    if (!code || code.length !== 4) { showError("Entre un code de salon valide (4 lettres)."); return; }
    hideError();
    await joinRoom(name, code);
  });

  document.getElementById('room-code').addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase().slice(0, 4);
  });
}

async function createRoom(name) {
  const code = generateCode();
  const id = generateId();
  const avatar = randomAvatar();

  try {
    // Vérif que le code n'existe pas déjà
    const snap = await db.ref(`rooms/${code}`).once('value');
    if (snap.exists() && snap.val().status !== 'ended') {
      await createRoom(name); return; // réessai avec un nouveau code
    }

    const player = { id, name, avatar, ready: false, master: true };
    await db.ref(`rooms/${code}`).set({
      code,
      status: 'lobby',
      master: id,
      createdAt: Date.now(),
      roles: { wolf: 1, village: 0, seer: 0, witch: 0, hunter: 0, cupid: 0 },
      players: { [id]: player }
    });

    sessionStorage.setItem('lgPlayerId', id);
    sessionStorage.setItem('lgPlayerName', name);
    sessionStorage.setItem('lgRoomCode', code);
    sessionStorage.setItem('lgIsMaster', 'true');
    window.location.href = 'lobby.html';
  } catch(e) {
    showError("Erreur lors de la création : " + e.message);
  }
}

async function joinRoom(name, code) {
  try {
    const snap = await db.ref(`rooms/${code}`).once('value');
    if (!snap.exists()) { showError("Salon introuvable. Vérifie le code."); return; }
    const room = snap.val();
    if (room.status !== 'lobby') { showError("La partie a déjà commencé !"); return; }

    const id = generateId();
    const avatar = randomAvatar();
    const player = { id, name, avatar, ready: false, master: false };
    await db.ref(`rooms/${code}/players/${id}`).set(player);

    sessionStorage.setItem('lgPlayerId', id);
    sessionStorage.setItem('lgPlayerName', name);
    sessionStorage.setItem('lgRoomCode', code);
    sessionStorage.setItem('lgIsMaster', 'false');
    window.location.href = 'lobby.html';
  } catch(e) {
    showError("Erreur lors de la connexion : " + e.message);
  }
}

// ══════════════════════════════════════════════════════
//  PAGE : lobby.html — Salle d'attente
// ══════════════════════════════════════════════════════
function initLobby() {
  if (!initFirebase()) return;

  myId = sessionStorage.getItem('lgPlayerId');
  roomCode = sessionStorage.getItem('lgRoomCode');
  isMaster = sessionStorage.getItem('lgIsMaster') === 'true';

  if (!myId || !roomCode) { window.location.href = 'index.html'; return; }

  document.getElementById('room-code-display').textContent = roomCode;

  gameRef = db.ref(`rooms/${roomCode}`);
  playersRef = db.ref(`rooms/${roomCode}/players`);

  // Écoute temps réel
  gameRef.on('value', snap => {
    if (!snap.exists()) { window.location.href = 'index.html'; return; }
    const room = snap.val();
    renderLobby(room);

    // Redirection si partie lancée
    if (room.status === 'playing') {
      gameRef.off();
      if (isMaster) {
        window.location.href = 'master.html';
      } else {
        window.location.href = 'role.html';
      }
    }
  });

  // Bouton "Je suis prêt"
  const btnReady = document.getElementById('btn-ready');
  if (btnReady) {
    btnReady.addEventListener('click', async () => {
      const snap = await playersRef.child(myId).once('value');
      const cur = snap.val();
      await playersRef.child(myId).update({ ready: !cur.ready });
    });
  }

  // Bouton quitter
  document.getElementById('btn-leave')?.addEventListener('click', async () => {
    await playersRef.child(myId).remove();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });

  // Bouton lancer (master seulement)
  document.getElementById('btn-launch')?.addEventListener('click', launchGame);
}

function renderLobby(room) {
  const players = room.players ? Object.values(room.players) : [];
  const list = document.getElementById('player-list');
  const count = document.getElementById('player-count');
  const btnReady = document.getElementById('btn-ready');
  const masterSection = document.getElementById('master-section');

  if (count) count.textContent = `${players.length} joueur${players.length > 1 ? 's' : ''} dans le salon`;

  if (list) {
    list.innerHTML = players.map(p => `
      <div class="player-item ${p.ready ? 'ready' : ''}">
        <div class="avatar">${p.avatar}</div>
        <div class="name">${escHtml(p.name)}${p.id === myId ? ' <span class="badge badge-you">Toi</span>' : ''}${p.master ? ' <span class="badge badge-master">Meneur</span>' : ''}</div>
        <div class="status">${p.ready ? '✓ Prêt' : 'En attente'}</div>
      </div>
    `).join('');
  }

  // État du bouton prêt
  if (btnReady && !isMaster) {
    const me = players.find(p => p.id === myId);
    if (me) btnReady.textContent = me.ready ? '😴 Pas encore prêt' : '✅ Je suis prêt !';
  }

  // Section maître
  if (isMaster && masterSection) {
    masterSection.classList.remove('hidden');
    renderRoleConfig(room, players);
  }
}

function renderRoleConfig(room, players) {
  const roles = room.roles || {};
  const totalRoles = Object.values(roles).reduce((a,b) => a+b, 0);
  const playerCount = players.length;
  const balanceEl = document.getElementById('role-balance');

  if (balanceEl) {
    const diff = totalRoles - playerCount;
    if (diff === 0) {
      balanceEl.textContent = `✓ ${totalRoles} rôles pour ${playerCount} joueurs — parfait !`;
      balanceEl.className = 'alert alert-success';
    } else if (diff > 0) {
      balanceEl.textContent = `${totalRoles} rôles pour ${playerCount} joueurs — retirez ${diff} rôle(s)`;
      balanceEl.className = 'alert alert-error';
    } else {
      balanceEl.textContent = `${totalRoles} rôles pour ${playerCount} joueurs — ajoutez ${-diff} rôle(s)`;
      balanceEl.className = 'alert alert-error';
    }
  }

  // Rendu des compteurs de rôles
  const container = document.getElementById('role-counts');
  if (!container) return;
  container.innerHTML = Object.entries(ROLES_DEF).map(([key, def]) => {
    const count = roles[key] || 0;
    return `
      <div class="role-count-row">
        <div class="rc-info">
          <span class="rc-emoji">${def.emoji}</span>
          <span class="rc-name">${def.name}</span>
        </div>
        <div class="rc-controls">
          <button class="rc-btn" onclick="changeRole('${key}', -1)">−</button>
          <span class="rc-count" id="rc-${key}">${count}</span>
          <button class="rc-btn" onclick="changeRole('${key}', +1)">+</button>
        </div>
      </div>
    `;
  }).join('');
}

window.changeRole = async function(key, delta) {
  const snap = await db.ref(`rooms/${roomCode}/roles/${key}`).once('value');
  const cur = snap.val() || 0;
  const next = Math.max(0, cur + delta);
  await db.ref(`rooms/${roomCode}/roles/${key}`).set(next);
};

async function launchGame() {
  const snap = await gameRef.once('value');
  const room = snap.val();
  const players = room.players ? Object.values(room.players) : [];
  const roles = room.roles || {};
  const totalRoles = Object.values(roles).reduce((a,b) => a+b, 0);

  if (players.length < 3) {
    alert("Il faut au moins 3 joueurs pour commencer !"); return;
  }
  if (totalRoles !== players.length) {
    alert(`Le nombre de rôles (${totalRoles}) ne correspond pas au nombre de joueurs (${players.length}). Ajuste la configuration.`); return;
  }

  // Générer les rôles mélangés
  let roleList = [];
  Object.entries(roles).forEach(([key, count]) => {
    for (let i = 0; i < count; i++) roleList.push(key);
  });
  roleList = shuffle(roleList);

  // Assigner les rôles
  const updates = {};
  players.forEach((p, i) => {
    updates[`rooms/${roomCode}/players/${p.id}/role`] = roleList[i];
  });
  updates[`rooms/${roomCode}/status`] = 'playing';
  updates[`rooms/${roomCode}/startedAt`] = Date.now();
  updates[`rooms/${roomCode}/phase`] = 'night';
  updates[`rooms/${roomCode}/day`] = 1;

  await db.ref().update(updates);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════════════
//  PAGE : role.html — Révélation du rôle
// ══════════════════════════════════════════════════════
function initRole() {
  if (!initFirebase()) return;

  myId = sessionStorage.getItem('lgPlayerId');
  roomCode = sessionStorage.getItem('lgRoomCode');
  if (!myId || !roomCode) { window.location.href = 'index.html'; return; }

  gameRef = db.ref(`rooms/${roomCode}`);

  // On ecoute en temps reel et on attend que le role soit disponible
  gameRef.on('value', snap => {
    const room = snap.val();
    if (!room) { window.location.href = 'index.html'; return; }

    const players = room.players || {};
    const me = players[myId];

    // Si le joueur n'existe plus dans la room
    if (!me) { window.location.href = 'index.html'; return; }

    // Le role n'est pas encore ecrit — on attend le prochain evenement
    if (!me.role) return;

    // Role disponible : on arrete d'ecouter et on affiche
    gameRef.off();
    renderRoleCard(me, room);
  });
}

function renderRoleCard(player, room) {
  const roleDef = ROLES_DEF[player.role] || ROLES_DEF['village'];
  const container = document.getElementById('role-container');
  const overlay = document.getElementById('tap-overlay');

  // Overlay "appuie pour révéler"
  overlay.classList.remove('hidden');
  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
  }, { once: true });

  if (container) {
    container.innerHTML = `
      <div class="role-card ${roleDef.css}">
        <span class="role-emoji">${roleDef.emoji}</span>
        <div class="role-name">${roleDef.name}</div>
        <div class="role-desc">${roleDef.desc}</div>
      </div>
      <p style="text-align:center;color:var(--text2);font-style:italic;margin-top:16px;">
        Souviens-toi bien de ton rôle, et garde-le secret !
      </p>
    `;
  }

  document.getElementById('player-greeting').textContent = `${player.avatar} ${player.name}`;

  // Afficher les autres loups si loup-garou
  if (player.role === 'wolf' && room.players) {
    const wolves = Object.values(room.players).filter(p => p.role === 'wolf' && p.id !== myId);
    if (wolves.length > 0) {
      const wolfSection = document.getElementById('wolf-allies');
      if (wolfSection) {
        wolfSection.classList.remove('hidden');
        document.getElementById('wolf-list').textContent = wolves.map(w => `${w.avatar} ${w.name}`).join(', ');
      }
    }
  }
}

// ══════════════════════════════════════════════════════
//  PAGE : master.html — Vue meneur
// ══════════════════════════════════════════════════════
function initMaster() {
  if (!initFirebase()) return;

  myId = sessionStorage.getItem('lgPlayerId');
  roomCode = sessionStorage.getItem('lgRoomCode');
  if (!myId || !roomCode) { window.location.href = 'index.html'; return; }

  gameRef = db.ref(`rooms/${roomCode}`);
  gameRef.on('value', snap => {
    const room = snap.val();
    if (!room) return;
    renderMaster(room);
  });
}

function renderMaster(room) {
  const players = room.players ? Object.values(room.players) : [];
  const list = document.getElementById('master-player-list');
  const phase = room.phase || 'night';
  const day = room.day || 1;

  // Phase banner
  const banner = document.getElementById('phase-banner');
  if (banner) {
    banner.className = `phase-banner ${phase === 'night' ? 'phase-night' : 'phase-day'}`;
    banner.textContent = phase === 'night' ? `🌙 Nuit ${day}` : `☀️ Jour ${day}`;
  }

  if (list) {
    list.innerHTML = players.map(p => {
      const def = ROLES_DEF[p.role] || {};
      return `
        <div class="master-player ${p.alive === false ? 'dead' : ''}">
          <div class="avatar" style="${p.alive === false ? 'opacity:0.4;filter:grayscale(1)' : ''}">${p.avatar}</div>
          <div class="mp-name" style="${p.alive === false ? 'text-decoration:line-through;opacity:0.5' : ''}">${escHtml(p.name)}</div>
          <div class="mp-role">${def.emoji || ''} ${def.name || p.role || ''}</div>
          ${p.alive === false ? '<div style="color:var(--red2);font-size:0.8rem">☠️ Éliminé</div>' : ''}
        </div>
      `;
    }).join('');
  }

  // Stats
  const alive = players.filter(p => p.alive !== false);
  const wolves = alive.filter(p => p.role === 'wolf');
  const villagers = alive.filter(p => ROLES_DEF[p.role]?.team === 'village');
  document.getElementById('stat-alive').textContent = alive.length;
  document.getElementById('stat-wolves').textContent = wolves.length;
  document.getElementById('stat-village').textContent = villagers.length;

  // Vérif victoire
  checkWin(wolves.length, villagers.length);
}

function checkWin(wolves, villagers) {
  const banner = document.getElementById('win-banner');
  if (!banner) return;
  if (wolves === 0) {
    banner.innerHTML = '🎉 Victoire du Village ! Les loups ont été éliminés.';
    banner.className = 'alert alert-success';
    banner.classList.remove('hidden');
  } else if (wolves >= villagers) {
    banner.innerHTML = '🐺 Victoire des Loups-Garous ! Ils dominent le village.';
    banner.className = 'alert alert-error';
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

window.eliminatePlayer = async function(playerId) {
  await db.ref(`rooms/${roomCode}/players/${playerId}/alive`).set(false);
};

window.nextPhase = async function() {
  const snap = await gameRef.once('value');
  const room = snap.val();
  const phase = room.phase || 'night';
  const day = room.day || 1;
  const next = phase === 'night' ? { phase: 'day', day } : { phase: 'night', day: day + 1 };
  await gameRef.update(next);
};

window.endGame = async function() {
  if (confirm("Terminer la partie et fermer le salon ?")) {
    await gameRef.update({ status: 'ended' });
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
};

// ── Helpers ───────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Suppression des joueurs déconnectés (onDisconnect) ─
function setupPresence() {
  if (!myId || !roomCode) return;
  const ref = db.ref(`rooms/${roomCode}/players/${myId}`);
  ref.onDisconnect().remove();
}
