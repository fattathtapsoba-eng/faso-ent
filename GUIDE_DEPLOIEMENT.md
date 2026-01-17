# Guide de Déploiement - Faso-ENT

Ce guide explique comment déployer l'application Faso-ENT pour vos partenaires bêta.

## Option 1 : Netlify (Recommandé - Gratuit)

### Prérequis
- Un compte GitHub (gratuit)
- Un compte Netlify (gratuit)

### Étapes

1. **Pousser le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - PWA ready"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/faso-ent.git
   git push -u origin main
   ```

2. **Connecter à Netlify**
   - Allez sur [https://app.netlify.com](https://app.netlify.com)
   - Cliquez sur "New site from Git"
   - Sélectionnez GitHub et autorisez Netlify
   - Choisissez le repository `faso-ent`

3. **Configuration du build**
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - Cliquez sur "Deploy site"

4. **Configurer le nom de domaine**
   - Une fois déployé, cliquez sur "Domain settings"
   - Changez le nom du site (ex: `faso-ent.netlify.app`)

5. **Activer HTTPS**
   - Netlify active automatiquement HTTPS (requis pour PWA)

### Résultat
✅ URL accessible : `https://faso-ent.netlify.app`  
✅ Déploiement automatique à chaque push sur GitHub  
✅ HTTPS activé automatiquement

---

## Option 2 : Vercel (Alternative - Gratuit)

### Étapes

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Déployer**
   ```bash
   vercel
   ```
   - Suivez les instructions à l'écran
   - Choisissez les paramètres par défaut

3. **Configuration**
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Install Command : `npm install`

### Résultat
✅ URL accessible : `https://faso-ent.vercel.app`  
✅ Déploiement automatique  
✅ HTTPS activé

---

## Option 3 : GitHub Pages (Simple, Gratuit)

### Configuration

1. **Ajouter configuration Vite**
   
   Modifiez `vite.config.ts` :
   ```typescript
   export default defineConfig({
     base: '/faso-ent/',  // Nom de votre repo
     plugins: [
       // ... reste de la config
     ]
   })
   ```

2. **Installer gh-pages**
   ```bash
   npm install -D gh-pages
   ```

3. **Ajouter script de déploiement**
   
   Dans `package.json`, ajoutez :
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Déployer**
   ```bash
   npm run deploy
   ```

5. **Activer GitHub Pages**
   - Allez dans Settings > Pages
   - Source : "gh-pages" branch
   - Cliquez sur Save

### Résultat
✅ URL : `https://VOTRE_USERNAME.github.io/faso-ent/`

---

## Option 4 : Distribution Locale (Sans serveur)

Si vous voulez partager l'application sans hébergement web :

### Étape 1 : Créer un serveur local portable

1. **Construire l'application**
   ```bash
   npm run build
   ```

2. **Package avec serve**
   ```bash
   npm install -g serve
   ```

3. **Créer un script de lancement**
   
   Créez `run-faso-ent.bat` (Windows) :
   ```batch
   @echo off
   cd /d "%~dp0"
   start http://localhost:3000
   npx serve -s dist -l 3000
   ```
   
   Ou `run-faso-ent.sh` (Mac/Linux) :
   ```bash
   #!/bin/bash
   cd "$(dirname "$0")"
   open http://localhost:3000
   npx serve -s dist -l 3000
   ```

4. **Partager**
   - Compressez le dossier `dist/` et le script
   - Envoyez le fichier ZIP aux partenaires
   - Ils doublecliquent sur le script pour lancer

⚠️ **Limitation** : Nécessite Node.js installé sur la machine cible

---

## Recommandations pour la Production

### 1. Nom de Domaine Personnalisé
Achetez un nom de domaine personnalisé (ex: `www.faso-ent.bf`) :
- Prix : ~10-15€/an
- Services : Namecheap, OVH, Google Domains

### 2. Configuration DNS
Une fois le domaine acheté, pointez-le vers votre hébergeur :
- **Netlify** : Ajoutez un enregistrement CNAME ou A
- **Vercel** : Suivez la documentation Vercel

### 3. Analytics (Optionnel)
Ajoutez Google Analytics pour suivre l'utilisation :
```html
<!-- Dans index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 4. Monitoring
Utilisez des outils gratuits :
- **Uptime Robot** : Surveille si le site est en ligne
- **Sentry** : Capture les erreurs en production

---

## Partage avec les Partenaires

### Email Type

```
Objet : [BETA] Accès à Faso-ENT

Bonjour [Nom du Partenaire],

Nous sommes ravis de vous donner accès à la version bêta de Faso-ENT !

🔗 URL de l'application : https://faso-ent.netlify.app

📱 Installation :
L'application peut être installée sur n'importe quel appareil (Android, iOS, Windows, Mac).
Consultez le guide d'installation complet : [lien vers GUIDE_INSTALLATION.md]

👥 Comptes de test :
- Admin : admin@test.com / admin123
- Enseignant : teacher@test.com / teacher123
- Parent : parent@test.com / parent123
- Étudiant : student@test.com / student123

💬 Feedback :
Vos retours sont précieux ! Contactez-nous :
- Email : [votre email]
- WhatsApp : [votre numéro]

Merci pour votre participation !

Cordialement,
[Votre nom]
```

---

## Mises à Jour

### Avec Netlify/Vercel
1. Poussez vos modifications sur GitHub
2. Le déploiement se fait **automatiquement**
3. Les utilisateurs voient la mise à jour au prochain rechargement

### Manuel
```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push

# Netlify redéploie automatiquement
```

---

## Checklist Avant le Lancement

- [ ] Build de production réussi (`npm run build`)
- [ ] Test PWA sur au moins 2 appareils différents
- [ ] HTTPS activé (automatique avec Netlify/Vercel)
- [ ] Guide d'installation partagé
- [ ] Comptes de test créés
- [ ] Email de bienvenue préparé
- [ ] Support disponible (email/téléphone)

---

## Troubleshooting

### Le site ne se charge pas
- Vérifiez que `dist/` contient bien les fichiers
- Vérifiez la configuration du build command

### PWA ne s'installe pas
- HTTPS doit être activé (obligatoire)
- Vérifiez que `manifest.webmanifest` est accessible
- Vérifiez la console du navigateur pour les erreurs

### Service Worker ne fonctionne pas
- Le service worker ne marche qu'en HTTPS
- En développement, utilisez `npm run dev` (localhost est autorisé)

---

**Bon déploiement ! 🚀**
