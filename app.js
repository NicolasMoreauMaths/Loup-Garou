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

// ── Catégories de rôles ───────────────────────────────
const ROLE_CATEGORIES = [
  {
    id: 'base',
    label: '⚔️ Rôles de base',
    desc: 'Indispensables pour toute partie. Commencez par là.',
    roles: ['wolf','village','seer','witch','hunter','cupid']
  },
  {
    id: 'simple',
    label: '✨ Ajouts simples',
    desc: 'Faciles à expliquer, enrichissent la partie sans la complexifier.',
    roles: ['elder','idiot','bear','wolf_dog','little_girl','piper_victim','healer']
  },
  {
    id: 'complex',
    label: '🎭 Ajouts complexes',
    desc: 'Pour les classes qui connaissent déjà le jeu.',
    roles: ['piper','fox','wild_child','actor','devoted_servant','two_sisters','three_brothers','stuttering_judge']
  },
  {
    id: 'solo',
    label: '🎯 Solitaires',
    desc: 'Gagnent seuls contre tout le monde. Pimentent la partie !',
    roles: ['angel','pyromaniac','white_wolf','assassin']
  },
  {
    id: 'wolves',
    label: '🐺 Variantes de Loups',
    desc: 'Remplacent ou s'ajoutent aux loups classiques.',
    roles: ['big_bad_wolf','ancient_wolf','wolf_father','infected_father','wolf_shaman']
  }
];

// ── Définition complète des rôles ─────────────────────
const ROLES_DEF = {

  // ── BASE ──────────────────────────────────────────────
  wolf: {
    name: "Loup-Garou", emoji: "🐺", css: "wolf", team: "wolf",
    desc: "Chaque nuit, tu te réveilles avec les autres loups pour désigner une victime. Le jour, tu te fondas dans le village et essaies de ne pas être démasqué.",
    master: "Réveille tous les loups ensemble. Ils se concertent en silence et désignent une victime. Ils referment les yeux.",
  },
  village: {
    name: "Villageois", emoji: "🧑‍🌾", css: "village", team: "village",
    desc: "Tu n'as pas de pouvoir spécial. Ton arme, c'est ton intuition et ta capacité à convaincre le village lors des débats du jour.",
    master: "Aucune action la nuit. Le jour, participe au débat et au vote.",
  },
  seer: {
    name: "Voyante", emoji: "🔮", css: "seer", team: "village",
    desc: "Chaque nuit, tu peux désigner un joueur en secret au meneur. Il te montre si cette personne est un Loup-Garou ou non. Utilise cette information avec prudence !",
    master: "Réveille la Voyante. Elle désigne silencieusement un joueur. Tu lui montres discrètement : pouce levé = village, pouce baissé = loup. Elle referme les yeux.",
  },
  witch: {
    name: "Sorcière", emoji: "🧙‍♀️", css: "witch", team: "village",
    desc: "Tu as deux potions à usage unique : une potion de vie (pour sauver la victime des loups) et une potion de mort (pour éliminer n'importe qui). Tu peux les utiliser la même nuit.",
    master: "Réveille la Sorcière. Montre-lui qui a été tué. Elle peut lever le pouce (sauver) et/ou désigner quelqu'un d'autre (tuer). Elle referme les yeux.",
  },
  hunter: {
    name: "Chasseur", emoji: "🏹", css: "hunter", team: "village",
    desc: "Si tu es éliminé (de nuit ou de jour), tu peux immédiatement désigner un joueur qui mourra avec toi. Choisis bien !",
    master: "Quand le Chasseur est éliminé, demande-lui immédiatement de désigner sa cible à voix haute. Ce joueur est éliminé lui aussi.",
  },
  cupid: {
    name: "Cupidon", emoji: "💘", css: "cupid", team: "village",
    desc: "La première nuit seulement, tu désignes deux joueurs (toi inclus ou non) qui tomberont amoureux. Si l'un des deux meurt, l'autre mourra de chagrin immédiatement.",
    master: "Nuit 1 uniquement : réveille Cupidon. Il désigne deux joueurs silencieusement. Retiens ces deux noms. Note : si un des amoureux est loup, leur camp de victoire change (ils gagnent ensemble).",
  },

  // ── AJOUTS SIMPLES ─────────────────────────────────────
  elder: {
    name: "Ancien", emoji: "👴", css: "village", team: "village",
    desc: "Tu es coriace ! Les loups doivent te cibler deux nuits de suite pour t'éliminer. Mais si tu es éliminé lors d'un vote du village, tous les autres pouvoirs spéciaux du village sont perdus.",
    master: "Les loups doivent le cibler deux fois. La première nuit il survit. Si le village le vote et l'élimine, tous les rôles spéciaux du camp village perdent leurs pouvoirs définitivement.",
  },
  idiot: {
    name: "Idiot du Village", emoji: "🤪", css: "village", team: "village",
    desc: "Si le village vote pour t'éliminer, tu survives ! Mais tu dois retourner ta carte et jouer sans pouvoir voter pour le reste de la partie.",
    master: "Si le village vote contre lui : il survit, retourne sa carte face visible pour tous. Il ne peut plus voter mais reste en jeu.",
  },
  bear: {
    name: "Montreur d'Ours", emoji: "🐻", css: "village", team: "village",
    desc: "Chaque matin, le meneur grogne si l'un de tes voisins directs (gauche ou droite) est un loup-garou. Utilise cette information !",
    master: "Chaque matin au réveil : si un voisin immédiat (gauche ou droite) du Montreur d'Ours est un loup, grogne fort. Sinon, silence. Ne révèle pas lequel.",
  },
  wolf_dog: {
    name: "Chien-Loup", emoji: "🐕", css: "village", team: "village",
    desc: "La première nuit, tu choisis ton camp : rester Villageois ou rejoindre les Loups. Ce choix est définitif !",
    master: "Nuit 1 : réveille le Chien-Loup seul. Il choisit silencieusement (pouce haut = village, pouce bas = loup). S'il choisit loup, réveille-le dorénavant avec les loups.",
  },
  little_girl: {
    name: "Petite Fille", emoji: "👧", css: "seer", team: "village",
    desc: "Pendant la nuit des loups, tu peux entrouvrir les yeux pour espionner. Si les loups te surprennent, ils peuvent te cibler immédiatement !",
    master: "La Petite Fille peut espionner pendant la nuit des loups. Si un loup la désigne en la surprenant les yeux ouverts, elle est éliminée à la place de la victime prévue.",
  },
  healer: {
    name: "Salvateur", emoji: "🛡️", css: "village", team: "village",
    desc: "Chaque nuit, tu protèges un joueur (toi inclus) contre les loups. Tu ne peux pas protéger la même personne deux nuits de suite.",
    master: "Réveille le Salvateur. Il désigne silencieusement un joueur à protéger cette nuit. Si les loups le ciblent, il survit. Impossible de choisir la même cible deux nuits consécutives.",
  },
  piper_victim: {
    name: "Villageois Ensorcelé", emoji: "🪈", css: "village", team: "village",
    desc: "Tu as été ensorcelé par le Joueur de Flûte. Tu gagnes si le Joueur de Flûte gagne. Garde ce secret !",
    master: "Ce rôle est attribué automatiquement par le Joueur de Flûte en cours de partie. Ne l'utilise pas au départ.",
  },

  // ── AJOUTS COMPLEXES ───────────────────────────────────
  piper: {
    name: "Joueur de Flûte", emoji: "🎶", css: "cupid", team: "solo",
    desc: "Chaque nuit, tu ensorcelles deux joueurs. Tu gagnes quand tous les joueurs encore en vie sont ensorcelés. Tu joues pour toi seul !",
    master: "Réveille le Joueur de Flûte. Il désigne 2 joueurs à ensorceler (marque-les discrètement). Réveille ensuite les ensorcelés pour qu'ils se reconnaissent entre eux. Il gagne si tous les vivants sont ensorcelés.",
  },
  fox: {
    name: "Renard", emoji: "🦊", css: "seer", team: "village",
    desc: "Chaque nuit, tu désignes un groupe de 3 joueurs adjacents. Le meneur t'indique si l'un d'eux est un loup. Si oui, ton pouvoir continue. Si non, tu perds ton pouvoir.",
    master: "Réveille le Renard. Il pointe 3 joueurs consécutifs. Fais oui de la tête si au moins un est loup, non sinon. Si non, il perd définitivement son pouvoir.",
  },
  wild_child: {
    name: "Enfant Sauvage", emoji: "🌿", css: "village", team: "village",
    desc: "La première nuit, tu choisis un joueur comme modèle. Si ce joueur meurt, tu deviens Loup-Garou !",
    master: "Nuit 1 : réveille l'Enfant Sauvage. Il désigne son modèle silencieusement. Si le modèle meurt, l'Enfant Sauvage rejoint les loups dès la nuit suivante.",
  },
  actor: {
    name: "Comédien", emoji: "🎭", css: "village", team: "village",
    desc: "Chaque nuit, tu peux choisir d'utiliser le pouvoir d'un des rôles spéciaux qui ne sont pas en jeu (piochés au sort). Tu en as 3 disponibles pour toute la partie.",
    master: "Prépare 3 cartes de rôles spéciaux absents de la partie. Le Comédien en pioche une par nuit et peut utiliser ce pouvoir. Il a 3 utilisations au total.",
  },
  devoted_servant: {
    name: "Servante Dévouée", emoji: "🤝", css: "village", team: "village",
    desc: "Quand un joueur est sur le point d'être éliminé par le vote du village, tu peux révéler ta carte et prendre sa place. Tu adoptes son rôle, lui devient Villageois simple.",
    master: "Quand le village vote un joueur : la Servante peut révéler sa carte avant l'élimination. Elle prend le rôle de la cible, la cible devient Villageois. À utiliser une seule fois.",
  },
  two_sisters: {
    name: "Sœurs", emoji: "👯", css: "village", team: "village",
    desc: "Vous êtes deux et vous vous connaissez dès la première nuit. Vous jouez pour le village mais pouvez vous faire confiance mutuellement.",
    master: "Nuit 1 : réveille les deux Sœurs ensemble. Elles se voient. Elles referment les yeux. Toujours mettre exactement 2 cartes Sœurs.",
  },
  three_brothers: {
    name: "Frères", emoji: "👨‍👦‍👦", css: "village", team: "village",
    desc: "Vous êtes trois et vous vous connaissez dès la première nuit. Vous jouez pour le village mais pouvez vous faire confiance mutuellement.",
    master: "Nuit 1 : réveille les trois Frères ensemble. Ils se voient. Ils referment les yeux. Toujours mettre exactement 3 cartes Frères.",
  },
  stuttering_judge: {
    name: "Juge Bègue", emoji: "⚖️", css: "village", team: "village",
    desc: "Une fois dans la partie, tu peux faire un signe secret au meneur pour provoquer un second vote d'élimination dans la même journée.",
    master: "Le Juge Bègue a un signe secret convenu avec toi avant la partie. S'il le fait pendant un vote, un second vote est immédiatement organisé pour éliminer un deuxième joueur ce jour-là.",
  },

  // ── SOLITAIRES ─────────────────────────────────────────
  angel: {
    name: "Ange", emoji: "😇", css: "cupid", team: "solo",
    desc: "Tu gagnes seul si tu es le premier joueur éliminé (de nuit ou par vote). Si tu rates cette chance, tu deviens un simple Villageois.",
    master: "Si l'Ange est le tout premier joueur éliminé de la partie (nuit 1 ou premier vote), il gagne seul. Sinon il devient Villageois classique.",
  },
  pyromaniac: {
    name: "Pyromane", emoji: "🔥", css: "wolf", team: "solo",
    desc: "Chaque nuit, tu asperges d'essence un joueur (sans le tuer). La nuit où tu choisis de craquer ton allumette, tous les joueurs aspergés meurent en même temps. Tu gagnes seul si tu es le dernier survivant.",
    master: "Nuit paire : le Pyromane asperge un joueur. Nuit impaire (ou quand il choisit) : il peut craquer l'allumette — tous les aspergés meurent. Il ne peut pas asperger la même personne deux fois.",
  },
  white_wolf: {
    name: "Loup Blanc", emoji: "🤍", css: "wolf", team: "solo",
    desc: "Tu commences avec les loups mais tu joues pour toi seul. Une nuit sur deux, tu peux éliminer un autre loup en plus de la victime habituelle. Tu gagnes si tu es le dernier survivant.",
    master: "Le Loup Blanc joue avec les loups la nuit mais peut, une nuit sur deux, désigner un loup à éliminer en plus. Il gagne seul si tous les autres joueurs sont morts.",
  },
  assassin: {
    name: "Assassin", emoji: "🗡️", css: "wolf", team: "solo",
    desc: "Avant la partie, tu choisis secrètement une cible. Si ta cible est éliminée par le village (et non par toi), tu gagnes seul. Sinon tu joues comme Villageois.",
    master: "Avant la partie, l'Assassin choisit une cible secrète (écrite sur un papier). Si cette cible est éliminée par le vote du village, l'Assassin gagne seul. Sinon il est Villageois.",
  },

  // ── VARIANTES DE LOUPS ─────────────────────────────────
  big_bad_wolf: {
    name: "Grand Méchant Loup", emoji: "😈", css: "wolf", team: "wolf",
    desc: "Tu es un loup-garou, mais en plus tu peux éliminer un joueur supplémentaire chaque nuit — tant qu'aucun loup n'a encore été éliminé.",
    master: "Comme les loups classiques, mais peut désigner une victime supplémentaire chaque nuit. Ce pouvoir disparaît dès qu'un loup est éliminé.",
  },
  ancient_wolf: {
    name: "Loup Ancien", emoji: "🐺", css: "wolf", team: "wolf",
    desc: "Tu es un loup comme les autres, mais tu as vécu si longtemps que la Voyante te voit comme un Villageois. Tu déjoues son pouvoir !",
    master: "Si la Voyante consulte le Loup Ancien, montre-lui qu'il est du camp village (il est loup mais passe inaperçu à la Voyante).",
  },
  wolf_father: {
    name: "Père des Loups", emoji: "👑", css: "wolf", team: "wolf",
    desc: "Tu es un loup-garou. Une seule fois dans la partie, tu peux infecter la victime de la nuit : au lieu de mourir, elle devient un loup !",
    master: "Une fois par partie, lors du choix de la victime des loups, le Père des Loups peut lever le pouce pour infecter la victime. Elle rejoint les loups dès la nuit suivante, en secret.",
  },
  infected_father: {
    name: "Père Infecté", emoji: "🤢", css: "wolf", team: "wolf",
    desc: "Tu es un loup-garou, et ta morsure est contagieuse. La première personne que les loups éliminent devient un loup à son tour !",
    master: "La première victime des loups ne meurt pas mais rejoint secrètement le camp des loups. Elle se réveille désormais avec eux la nuit.",
  },
  wolf_shaman: {
    name: "Loup Shaman", emoji: "🪄", css: "wolf", team: "wolf",
    desc: "Tu es un loup-garou avec un pouvoir unique : tu peux empêcher un joueur d'utiliser son pouvoir spécial cette nuit.",
    master: "Réveille les loups. Après qu'ils ont choisi leur victime, le Loup Shaman peut désigner un joueur dont il bloque le pouvoir cette nuit-là.",
  },
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

  // Rendu par catégories pliables
  const container = document.getElementById('role-counts');
  if (!container) return;

  container.innerHTML = ROLE_CATEGORIES.map(cat => {
    const catTotal = cat.roles.reduce((sum, key) => sum + (roles[key] || 0), 0);
    const isBase = cat.id === 'base';
    return `
      <div class="role-category">
        <div class="cat-header" onclick="toggleCategory('${cat.id}')">
          <div class="cat-info">
            <span class="cat-label">${cat.label}</span>
            <span class="cat-desc">${cat.desc}</span>
          </div>
          <div class="cat-meta">
            ${catTotal > 0 ? `<span class="cat-count">${catTotal}</span>` : ''}
            <span class="cat-arrow" id="arrow-${cat.id}">${isBase ? '▼' : '▶'}</span>
          </div>
        </div>
        <div class="cat-body ${isBase ? '' : 'hidden'}" id="cat-${cat.id}">
          ${cat.roles.map(key => {
            const def = ROLES_DEF[key];
            if (!def) return '';
            const count = roles[key] || 0;
            return `
              <div class="role-count-row" id="row-${key}">
                <div class="rc-info" onclick="toggleRoleInfo('${key}')" style="cursor:pointer;flex:1;">
                  <span class="rc-emoji">${def.emoji}</span>
                  <div class="rc-text">
                    <span class="rc-name">${def.name}</span>
                    <span class="rc-hint">ℹ️ appuie pour en savoir plus</span>
                  </div>
                </div>
                <div class="rc-controls">
                  <button class="rc-btn" onclick="changeRole('${key}', -1)">−</button>
                  <span class="rc-count" id="rc-${key}">${count}</span>
                  <button class="rc-btn" onclick="changeRole('${key}', +1)">+</button>
                </div>
              </div>
              <div class="role-info-panel hidden" id="info-${key}">
                <div class="rip-player"><strong>👤 Joueur :</strong> ${def.desc}</div>
                <div class="rip-master"><strong>🎙️ Meneur :</strong> ${def.master}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

window.toggleCategory = function(id) {
  const body = document.getElementById('cat-' + id);
  const arrow = document.getElementById('arrow-' + id);
  if (!body) return;
  const isHidden = body.classList.contains('hidden');
  body.classList.toggle('hidden');
  arrow.textContent = isHidden ? '▼' : '▶';
};

window.toggleRoleInfo = function(key) {
  const panel = document.getElementById('info-' + key);
  if (panel) panel.classList.toggle('hidden');
};

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

// ══════════════════════════════════════════════════════
//  Surveillance élimination (page role.html)
// ══════════════════════════════════════════════════════
function watchElimination() {
  const id = sessionStorage.getItem('lgPlayerId');
  const code = sessionStorage.getItem('lgRoomCode');
  if (!id || !code || typeof firebase === 'undefined') return;

  firebase.database().ref(`rooms/${code}/players/${id}`).on('value', snap => {
    const player = snap.val();
    if (!player) return;
    if (player.alive === false) {
      showDeadScreen(player);
    }
  });
}

function showDeadScreen(player) {
  const overlay = document.getElementById('dead-overlay');
  if (!overlay || !overlay.classList.contains('hidden')) return; // déjà affiché

  const def = ROLES_DEF[player.role] || ROLES_DEF['village'];

  document.getElementById('dead-player-name').textContent = `${player.avatar} ${player.name}`;
  document.getElementById('dead-role-emoji').textContent = def.emoji;
  document.getElementById('dead-role-name').textContent = def.name;
  document.getElementById('dead-role-desc').textContent = def.desc;

  // Cache l'overlay "tap to reveal" si encore visible
  const tapOverlay = document.getElementById('tap-overlay');
  if (tapOverlay) tapOverlay.classList.add('hidden');

  overlay.classList.remove('hidden');
}
