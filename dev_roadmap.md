# 💻 DEVELOPMENT ROADMAP

**Responsable :** Lead Developer
**Outils :** Anti-Gravity (Code) + GitHub (Repo) + Netlify (Deploy).

## PHASE 1 : INITIALISATION DU PROJET
1.  Cloner le repo GitHub dans Anti-Gravity. (déjà fait)
2.  Créer la structure des dossiers :
    ```text
    / (root)
    ├── index.html          (Page d'accueil)
    ├── product.html        (Page détail produit)
    ├── /assets
    │   ├── /images         (Logos, photos produits)
    │   └── /css            (Si custom CSS nécessaire hors Tailwind)
    ├── /js
    │   └── main.js         (Scripts: Slicer, Gestion panier simple)
    ├── data.json           (Données produits simulées)
    └── README.md
    ```

## PHASE 2 : DÉVELOPPEMENT (AI ASSISTED)
Utilisez l'IA d'Anti-Gravity pour générer le code bloc par bloc.

### 1. Setup HTML & Tailwind
Demandez à l'IA : *"Génère un squelette HTML5 incluant le lien CDN de Tailwind CSS et FontAwesome pour les icônes."*

### 2. Composants Communs (Header/Footer)
* Coder le Header (Logo + Nav).
* Coder le Footer.
* *Astuce :* Copiez ce code sur `index.html` et `product.html` (ou utilisez JS pour l'injecter dynamiquement si vous êtes à l'aise).

### 3. Page d'Accueil (`index.html`)
* Intégrer le **Slicer** (Carrousel). [cite_start]Demandez à l'IA : *"Code un carrousel d'images simple en HTML/Tailwind/JS vanilla automatique."*[cite: 39].
* Créer une section "Produits Vedettes" (Grid layout).

### 4. Page Produit (`product.html`)
* Layout : Image à gauche, Détails à droite (Desktop) / Colonne unique (Mobile).
* [cite_start]Afficher : Titre, Prix, Description, Bouton "Ajouter au panier", Section Avis, Section Cross-selling[cite: 30].

## PHASE 3 : GIT WORKFLOW (IMPORTANT)
Ne jamais laisser le code uniquement sur Anti-Gravity. Sauvegardez souvent.

**Commandes Terminal :**
```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter les fichiers
git add .

# 3. Enregistrer les modifications (Message clair !)
git commit -m "Ajout du header et de la bannière"

# 4. Envoyer sur GitHub
git push origin main