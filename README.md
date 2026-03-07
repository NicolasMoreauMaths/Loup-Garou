# 🐺 Loup-Garou PWA

Application web progressive du jeu Loup-Garou, conçue pour une utilisation en classe.  
Jouable depuis n'importe quel téléphone, sans installation.

---

## 🚀 Mise en place (5 minutes)

### 1. Créer un projet Firebase (gratuit)

1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. Clique **"Créer un projet"** → donne-lui un nom (ex: `loupgarou-classe`)
3. Désactive Google Analytics (pas nécessaire) → **Créer le projet**

### 2. Activer la Realtime Database

1. Dans ton projet Firebase, menu gauche → **Build > Realtime Database**
2. Clique **"Créer une base de données"**
3. Choisis la région **Europe (belgium)** → **Suivant**
4. Sélectionne **"Démarrer en mode test"** → **Activer**

> ⚠️ Le mode test autorise toutes les lectures/écritures pendant 30 jours.  
> Pour une utilisation long terme, configure des règles de sécurité.

### 3. Copier la configuration Firebase

1. Menu gauche → **Paramètres du projet** (⚙️) → onglet **"Général"**
2. Descends jusqu'à **"Tes applications"** → clique **"</>** (Web)"
3. Enregistre l'app (nom au choix)
4. Copie l'objet `firebaseConfig`

### 4. Coller la config dans app.js

Ouvre `app.js` et remplace le bloc `FIREBASE_CONFIG` :

```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "ton-projet.firebaseapp.com",
  databaseURL: "https://ton-projet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5. Déployer sur GitHub Pages

```bash
# Clone ou crée un repo GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TON-UTILISATEUR/loupgarou.git
git push -u origin main

# Puis dans les paramètres GitHub du repo :
# Settings → Pages → Branch: main → / (root) → Save
```

Ton app sera disponible à : `https://TON-UTILISATEUR.github.io/loupgarou/`

---

## 🎮 Comment jouer

### Le meneur (créateur du salon)
1. Ouvre l'app → **Créer un salon**
2. Partage le **code à 4 lettres** avec les élèves
3. Configure les rôles selon le nombre de joueurs
4. Lance la partie quand tout le monde est prêt
5. Tu vois tous les rôles sur ta vue meneur

### Les joueurs
1. Ouvrent l'app → entrent le code du salon → **Rejoindre**
2. Appuient sur **"Je suis prêt"** quand ils sont installés
3. Dès que la partie est lancée, ils voient leur rôle en privé

---

## 🎭 Rôles disponibles

| Rôle | Équipe | Description |
|------|--------|-------------|
| 🐺 Loup-Garou | Loups | Élimine un villageois chaque nuit |
| 🧑‍🌾 Villageois | Village | Identifie les loups le jour |
| 🔮 Voyante | Village | Découvre le rôle d'un joueur chaque nuit |
| 🧙‍♀️ Sorcière | Village | Une potion de vie, une potion de mort |
| 🏹 Chasseur | Village | Emporte un joueur en mourant |
| 💘 Cupidon | Village | Désigne deux amoureux la première nuit |

### Répartition recommandée

| Joueurs | Loups | Villageois | Spéciaux |
|---------|-------|------------|----------|
| 6–8 | 2 | reste | Voyante |
| 9–12 | 2–3 | reste | Voyante + Sorcière |
| 13–18 | 3–4 | reste | Voyante + Sorcière + Chasseur |

---

## 🔧 Structure des fichiers

```
loupgarou/
├── index.html    → Accueil (créer/rejoindre salon)
├── lobby.html    → Salle d'attente + config rôles (meneur)
├── role.html     → Révélation du rôle (joueur)
├── master.html   → Vue meneur pendant la partie
├── app.js        → Logique Firebase + jeu
├── style.css     → Design (thème forêt nocturne)
├── manifest.json → Configuration PWA
├── sw.js         → Service Worker (cache offline)
└── README.md     → Ce fichier
```

---

## 📱 Installer comme app (PWA)

Sur **iPhone** : Safari → partager → "Sur l'écran d'accueil"  
Sur **Android** : Chrome → menu ⋮ → "Ajouter à l'écran d'accueil"

}
```

---

Fait avec ❤️ pour les classes qui méritent de s'amuser un peu.
