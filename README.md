# 🎯 Objectifs généraux
- Ajouter, déplacer et supprimer des employés via une interface graphique.
- Respecter les règles métier selon le rôle et la zone autorisée.
- Proposer une interface fluide, intuitive, responsive et multi-appareils.
- Centraliser données du personnel + visualisation spatiale.

# 📌 User Stories (Résumé)
## 🎨 Conception
- Interface intuitive et fluide.
- Palette cohérente + icônes claires.
- Versions Desktop & Mobile (Flexbox/Grid, formes arrondies, boutons colorés).

## 💻 Front-End
- Structure HTML avec section *Unassigned Staff* + bouton *Add New Worker*.
- Modale d’ajout : Nom, Rôle, Photo(URL), Email, Téléphone, Expériences (dynamiques).
- Prévisualisation photo + validation REGEX.
- Validation dates d’expériences.
- Affichage du plan avec 6 zones :
  - Conférence, Réception, Serveurs, Sécurité, Personnel, Archives
- Restrictions :
  - Réception → Réceptionnistes  
  - Serveurs → Techniciens IT  
  - Sécurité → Agents de sécurité  
  - Managers → accès total  
  - Nettoyage → partout sauf Archives  
  - Autres → zones non restreintes
- Bouton “X” pour retirer un employé.
- Profil détaillé : Photo, Nom, Rôle, Contact, Expériences, Localisation.
- Bouton “+” dans chaque zone pour ajouter un employé éligible.
- Zones vides obligatoires en rouge pâle.
- Limitation du nombre d’employés par zone.
- Interface responsive + animations CSS.
- Validation W3C.
- Déploiement GitHub Pages / Vercel.

## 📋 Scrum / Gestion
- Organisation avec Trello / Jira / GitHub Projects.
- Gestion des branches Git (optionnel).
- Présentation finale du projet.

# 📱 Tailles d'écrans
- **Portrait**  
  - >1280px : grand écran  
  - 1024–1279px : petit écran  
  - 768–1023px : tablette  
  - <767px : mobile
- **Paysage**  
  - 768–1023px : mobile  
  - 1024–1279px : tablette

# ⭐ Bonus (optionnels)
- Drag & Drop des employés.
- Bouton Edit pour modifier un employé.
- Recherche / filtrage par nom ou rôle.
- Sauvegarde via localStorage.
- Mode de réorganisation automatique.
- Photo par défaut si absente.


# 📁 Structure du Projet
```
workspace-management/              
├── src/
|   ├── assets/
|   ├── data/
│       └── workers.json
│   ├── input.css          
│   ├── output.css
|   ├── index.html         
│   ├── script.js          
│   └── support/
│       └── validation.js                 
├── package.json          
└── README.md              
```



# 🚀 Installation
## 1. Cloner le projet
```bash
git clone https://github.com/d-anasx/workspace-management
cd workspace-management
```

## 2. Installer les dépendances
```bash
npm install
```

Cette commande installera toutes les dépendances nécessaires, notamment Tailwind CSS.

##   3. Compiler Tailwind CSS

Pour compiler le fichier CSS avec Tailwind, exécutez la commande suivante :
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

