# 🚀 WORKFLOW OPÉRATIONNEL : PROJET E-COMMERCE HIMSANE

**Type de projet :** Site E-commerce Statique (HTML/Tailwind/JS)
**Outils :** Anti-Gravity (Code), GitHub (Versionning), Netlify (Hosting), IA Générative (Contenu/Design).
[cite_start]**Deadline Rendu PDF :** 05/01[cite: 7].

---

## 📅 PHASE 1 : FONDATIONS & STRATÉGIE (J-1)
*Objectif : Définir ce que l'on vend et préparer le terrain technique.*

### 🟢 Étape 1.1 : Brainstorming Identité (Profil A + Profil B)
- [ ] [cite_start]**Définir le concept :** Choisir le type de produits (ex: Sneakers, Thé Bio, Tech reconditionnée)[cite: 27].
- [ ] **Identité de Marque :** Utiliser une IA (ChatGPT/Claude) pour définir :
  - [ ] Le Nom de la marque.
  - [ ] [cite_start]Les Valeurs et le Positionnement[cite: 23].
  - [ ] [cite_start]Le "Tone of Voice" (Ton de communication)[cite: 28].
- [ ] **Cible :** Définir le persona client type.
> [cite_start]⚠️ **IMPORTANT :** Copier-coller tous les prompts utilisés dans un fichier `prompts_log.txt` dès maintenant[cite: 12].

### 🟢 Étape 1.2 : Setup Technique (Profil A)
- [ ] **GitHub :** Créer le repository `himsane-ecommerce`.
- [ ] **Anti-Gravity (IDE) :** Cloner le projet.
- [ ] **Arborescence :** Créer les dossiers vides :
  - `/assets/img`
  - `/css`
  - `/js`
  - `index.html`
- [ ] **Connexion Netlify :** Lier le repo GitHub à Netlify pour vérifier que le déploiement "Hello World" fonctionne.

### 🟢 Étape 1.3 : Création des Assets Graphiques (Profil B)
- [ ] **Logo :** Générer un logo via IA (Midjourney/Dall-E). [cite_start]Critère : Fond transparent ou facile à détourer[cite: 37].
- [ ] **Palette Couleurs :** Définir 1 couleur principale (Primary) et 1 couleur secondaire.
- [ ] **Typographie :** Choisir 2 polices Google Fonts (Titre + Corps).

---

## 🏗️ PHASE 2 : PRODUCTION DE CONTENU & SQUELETTE (J-2)
*Objectif : Produire la matière première (Textes/Images) et le conteneur (Code).*

### 🟠 Étape 2.1 : Copywriting & Fiches Produits (Profil B)
*Utiliser l'IA pour générer du texte cohérent avec le "Tone of Voice" défini.*
- [ ] **Rédaction Home Page :**
  - [ ] [cite_start]Titre H1 accrocheur[cite: 36].
  - [ ] [cite_start]Texte des Call-to-Action (CTA)[cite: 38].
- [ ] **Rédaction Fiche Produit :**
  - [ ] [cite_start]Choisir un produit phare[cite: 27].
  - [ ] [cite_start]Générer une description précise et persuasive[cite: 28].
  - [ ] [cite_start]Inventer un prix fictif et des caractéristiques (taille, poids)[cite: 30].
  - [ ] [cite_start]Générer 3 avis clients fictifs (Social Proof)[cite: 30].
- [ ] [cite_start]**Mentions Légales :** Générer un texte générique pour le footer[cite: 18].

### 🟠 Étape 2.2 : Génération Visuels Produits (Profil B)
- [ ] [cite_start]**Photos Produits :** Générer des images "Rendu professionnel" du produit[cite: 29].
- [ ] [cite_start]**Bannières :** Générer 2 ou 3 images larges pour le "Slicer" (Carrousel) de la page d'accueil[cite: 18, 39].
- [ ] **Export :** Sauvegarder les images dans `/assets/img` avec des noms clairs (ex: `hero-banner.jpg`, `product-1.jpg`).

### 🟠 Étape 2.3 : Développement Structurel "Squelette" (Profil A)
*Coder la structure sans se soucier encore du contenu final.*
- [ ] [cite_start]**Header :** Intégrer la Nav Bar et l'emplacement Logo[cite: 18].
- [ ] **Footer :** Créer les colonnes (Liens, Contact, Copyright).
- [ ] **Layout Home :** Préparer la zone Hero (Bannière) et la Grille de produits.
- [ ] **Layout Produit :** Préparer la structure 2 colonnes (Image à gauche / Texte à droite).

---

## 🎨 PHASE 3 : INTÉGRATION & DESIGN (J-3)
*Objectif : Assembler le code et le contenu pour un site fini.*

### 🔵 Étape 3.1 : Fusion Contenu/Code (Profil A + Profil B)
- [ ] **Intégration Textes :** Remplacer le "Lorem Ipsum" par les textes générés en Phase 2.
- [ ] **Intégration Images :** Placer les bons chemins d'images dans les balises `<img>`.
- [ ] **Styling (Tailwind) :** Appliquer les couleurs de la marque aux boutons et titres.

### 🔵 Étape 3.2 : Fonctionnalités JS (Profil A)
- [ ] [cite_start]**Slicer :** Coder (via IA) le script pour faire défiler les bannières automatiquement[cite: 39].
- [ ] [cite_start]**Menu Mobile :** S'assurer que le menu "Burger" fonctionne sur petit écran[cite: 40].

### 🔵 Étape 3.3 : UX & Ergonomie Check (Profil B)
- [ ] **Navigation :** Vérifier que tous les liens fonctionnent.
- [ ] [cite_start]**Clarté :** Est-ce que le site est facile à naviguer ?[cite: 16].
- [ ] **Responsive :** Tester le site en réduisant la fenêtre du navigateur (format téléphone).

---

## 📝 PHASE 4 : DOCUMENTATION & RENDU (CRITIQUE)
*Objectif : Créer le PDF qui vaut 50% de la note.*

### 🟣 Étape 4.1 : Compilation des Preuves (Profil A + Profil B)
- [ ] [cite_start]**Screenshots :** Faire des captures d'écran du site final (Home, Produit, Mobile)[cite: 10, 22].
- [ ] **Screenshots IA :** Faire des captures d'écran des conversations avec l'IA (montrer les prompts et les réponses).

### 🟣 Étape 4.2 : Rédaction du Rapport (Profil B)
*Document à rendre au format PDF.*
- [ ] [cite_start]**Page de garde :** Noms et Prénoms des 2 étudiants[cite: 9].
- [ ] [cite_start]**Intro :** Présentation de la marque et stratégie[cite: 23].
- [ ] [cite_start]**Méthodologie :** Expliquer le choix des outils (Anti-Gravity, etc.)[cite: 11].
- [ ] **Catalogue des Prompts :** Pour chaque élément (Logo, Code, Texte), lister :
  - [ ] Le prompt exact utilisé.
  - [ ] [cite_start]Le nombre d'itérations (ex: "Conversation structurée en 8 itérations")[cite: 12].
  - [ ] [cite_start]Comment l'IA a aidé à affiner le résultat[cite: 31].
- [ ] [cite_start]**Conclusion :** Réflexion critique sur l'usage de l'IA[cite: 51].

### 🟣 Étape 4.3 : Livraison (Profil A)
- [ ] **Dernier Commit :** `git push origin main`.
- [ ] **Vérification Netlify :** Le site est-il bien en ligne ?
- [ ] [cite_start]**Envoi Email :** Envoyer le PDF à `pascal.butera@hepl.be` avant le 05/01[cite: 7].

---

## 🛠️ TABLEAU DE BORD DES OUTILS
| Tâche | Outil Recommandé | Responsable Principal |
| :--- | :--- | :--- |
| **Génération Code** | Anti-Gravity / Google IDX | Profil A (Dev) |
| **Hébergement** | Netlify | Profil A (Dev) |
| **Textes / Stratégie** | ChatGPT / Claude | Profil B (Marketing) |
| **Images / Logo** | Midjourney / DALL-E / Canva AI | Profil B (Design) |
| **Document Final** | Word / Canva (Export PDF) | Profil B ||