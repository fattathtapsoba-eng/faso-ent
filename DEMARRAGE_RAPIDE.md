# 🚀 Démarrage Rapide - Pour Débutants

Guide ultra-simplifié pour mettre Faso-ENT en ligne et le partager avec vos partenaires.

## 📋 Ce dont vous avez besoin

- [ ] Un ordinateur avec Internet
- [ ] 30 minutes de votre temps
- [ ] Une adresse email

C'est tout ! Tout est **GRATUIT**.

---

## Étape 1 : Créer un compte GitHub (5 minutes)

GitHub est comme Google Drive, mais pour le code. C'est gratuit.

### 1.1 Créer le compte

1. Allez sur **https://github.com**
2. Cliquez sur **"Sign up"** (en haut à droite)
3. Remplissez :
   - Email : votre email
   - Mot de passe : créez un mot de passe sécurisé
   - Username : choisissez un nom (ex: `abdou-burkina`)
4. Vérifiez votre email et cliquez sur le lien de confirmation

✅ **Vous avez maintenant un compte GitHub !**

### 1.2 Télécharger GitHub Desktop (optionnel mais recommandé)

Pour éviter la ligne de commande :

1. Allez sur **https://desktop.github.com**
2. Téléchargez **GitHub Desktop**
3. Installez-le (double-cliquez sur le fichier téléchargé)
4. Connectez-vous avec votre compte GitHub

---

## Étape 2 : Mettre votre code sur GitHub (10 minutes)

### Option A : Avec GitHub Desktop (Recommandé - Plus Simple)

1. **Ouvrez GitHub Desktop**
2. Cliquez sur **"File" > "Add Local Repository"**
3. Cliquez sur **"Choose..."** et sélectionnez le dossier :
   ```
   C:\Users\abdou\Downloads\ENT_Burkina
   ```
4. Si on vous dit que ce n'est pas un repository Git :
   - Cliquez sur **"create a repository"**
   - Laissez les options par défaut
   - Cliquez sur **"Create Repository"**

5. **Créer le premier commit** :
   - En bas à gauche, dans "Summary", écrivez : `Version PWA initiale`
   - Cliquez sur **"Commit to main"**

6. **Publier sur GitHub** :
   - Cliquez sur **"Publish repository"** (en haut)
   - Nom : `faso-ent` (ou ce que vous voulez)
   - Décochez **"Keep this code private"** si vous voulez que ce soit public
   - Cliquez sur **"Publish Repository"**

✅ **Votre code est maintenant sur GitHub !**

### Option B : Avec la ligne de commande (Pour les plus techniques)

Si vous préférez utiliser le terminal :

```bash
cd C:\Users\abdou\Downloads\ENT_Burkina

git init
git add .
git commit -m "Version PWA initiale"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/faso-ent.git
git push -u origin main
```

Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub.

---

## Étape 3 : Créer un compte Netlify (3 minutes)

Netlify va héberger votre application gratuitement.

1. Allez sur **https://app.netlify.com/signup**
2. Cliquez sur **"Sign up with GitHub"**
3. Autorisez Netlify à accéder à votre compte GitHub
4. Confirmez votre email si demandé

✅ **Vous avez un compte Netlify !**

---

## Étape 4 : Déployer votre application (5 minutes)

### 4.1 Connecter GitHub à Netlify

1. Sur Netlify, cliquez sur **"Add new site"** (bouton vert en haut)
2. Choisissez **"Import an existing project"**
3. Cliquez sur **"Deploy with GitHub"**
4. Si demandé, autorisez Netlify à accéder à vos repositories
5. Cherchez et cliquez sur **"faso-ent"** (ou le nom que vous avez choisi)

### 4.2 Configurer le déploiement

Netlify devrait automatiquement détecter que c'est un projet Vite. Vérifiez :

- **Branch to deploy** : `main` ✅
- **Build command** : `npm run build` ✅
- **Publish directory** : `dist` ✅

Si ce n'est pas rempli automatiquement, remplissez ces valeurs.

### 4.3 Lancer le déploiement

1. Cliquez sur **"Deploy faso-ent"** (gros bouton en bas)
2. **Attendez 2-3 minutes** ⏳
   - Vous verrez une barre de progression
   - "Building" puis "Deploying"
3. Une fois terminé, vous verrez **"Published"** avec un lien

✅ **Votre application est EN LIGNE !** 🎉

---

## Étape 5 : Personnaliser l'URL (2 minutes)

Netlify vous donne une URL aléatoire comme `random-name-12345.netlify.app`. Changeons ça !

1. Sur la page de votre site, cliquez sur **"Site settings"**
2. Dans le menu de gauche, cliquez sur **"Domain management"**
3. Sous "Custom domains", trouvez votre URL actuelle
4. Cliquez sur **"Options" > "Edit site name"**
5. Changez pour quelque chose de simple : `faso-ent` ou `ent-burkina`
6. Cliquez sur **"Save"**

✅ **Votre nouvelle URL** : `https://faso-ent.netlify.app`

---

## Étape 6 : Tester l'installation (5 minutes)

### Sur votre ordinateur

1. Ouvrez **Chrome** ou **Microsoft Edge**
2. Allez sur votre URL : `https://faso-ent.netlify.app`
3. Attendez que la page se charge
4. Cherchez une petite icône d'installation dans la barre d'adresse (ordinateur avec une flèche)
5. Cliquez dessus et cliquez sur **"Installer"**

**L'application s'ouvre maintenant comme un programme !** 🎉

### Sur votre téléphone

1. Ouvrez **Chrome** sur Android (ou **Safari** sur iPhone)
2. Allez sur : `https://faso-ent.netlify.app`
3. **Sur Android** : Attendez la notification "Ajouter à l'écran d'accueil" ou menu ⋮ > "Installer l'application"
4. **Sur iPhone** : Bouton Partager 📤 > "Sur l'écran d'accueil"

**L'icône Faso-ENT apparaît sur votre écran d'accueil !** 📱

---

## Étape 7 : Partager avec vos partenaires (5 minutes)

### 7.1 Créer les comptes de test

Avant de partager, assurez-vous d'avoir des comptes de démonstration dans votre application.

### 7.2 Préparer l'email

Copiez ce modèle et remplissez les informations :

```
Objet : [BETA] Accès à Faso-ENT - Version Installable

Bonjour,

Je suis ravi de vous donner accès à Faso-ENT, notre nouvelle plateforme 
éducative numérique pour les écoles au Burkina Faso.

🔗 LIEN DE L'APPLICATION
https://faso-ent.netlify.app

📱 COMMENT INSTALLER ?
L'application peut être installée sur votre téléphone ou ordinateur :

Sur Android :
1. Ouvrez le lien dans Chrome
2. Appuyez sur "Ajouter à l'écran d'accueil"

Sur iPhone :
1. Ouvrez le lien dans Safari
2. Appuyez sur le bouton Partager 📤
3. Sélectionnez "Sur l'écran d'accueil"

Sur ordinateur :
1. Ouvrez le lien dans Chrome
2. Cliquez sur l'icône d'installation dans la barre d'adresse

👤 COMPTES DE TEST
[Ajoutez vos comptes de démonstration ici]
- Administrateur : admin@test.com / [mot de passe]
- Enseignant : teacher@test.com / [mot de passe]
- Parent : parent@test.com / [mot de passe]

💬 VOS RETOURS
Vos commentaires sont très importants ! N'hésitez pas à me contacter :
- Email : [votre email]
- Téléphone : [votre numéro]

Merci pour votre participation à cette phase bêta !

Cordialement,
Abdou
```

### 7.3 Envoyer l'email

Envoyez cet email à vos partenaires avec le guide d'installation en pièce jointe :
- Fichier : `GUIDE_INSTALLATION.md` (dans votre dossier ENT_Burkina)

---

## 🎯 RÉCAPITULATIF : Vous avez fait quoi ?

✅ **Créé un compte GitHub** (stockage du code)  
✅ **Mis votre code en ligne** sur GitHub  
✅ **Créé un compte Netlify** (hébergement gratuit)  
✅ **Déployé l'application** sur Internet  
✅ **Obtenu une URL accessible** : `https://faso-ent.netlify.app`  
✅ **Testé l'installation** sur vos appareils  
✅ **Préparé l'email** pour vos partenaires  

---

## 🔄 Comment faire des mises à jour ?

Quand vous modifiez votre code :

### Avec GitHub Desktop (Simple)

1. Ouvrez **GitHub Desktop**
2. Vous verrez vos modifications dans la liste
3. En bas, écrivez un message (ex: "Correction du bug XYZ")
4. Cliquez sur **"Commit to main"**
5. Cliquez sur **"Push origin"**

**C'est tout !** Netlify met à jour automatiquement (2-3 minutes) 🚀

### Avec la ligne de commande

```bash
cd C:\Users\abdou\Downloads\ENT_Burkina
git add .
git commit -m "Description de vos modifications"
git push
```

---

## ❓ Problèmes fréquents

### "Le site ne se charge pas"
- Attendez 2-3 minutes après le déploiement
- Vérifiez sur Netlify que le déploiement est "Published"
- Vérifiez votre connexion Internet

### "L'application ne s'installe pas"
- Vérifiez que vous utilisez HTTPS (l'URL commence par `https://`)
- Sur iPhone, utilisez Safari (pas Chrome)
- Sur Android, utilisez Chrome

### "J'ai une erreur lors du build"
- Vérifiez que `package.json` contient `"build": "tsc -b && vite build"`
- Vérifiez que le dossier `node_modules` est dans `.gitignore`
- Contactez-moi, je peux vous aider !

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué à une étape :

1. **Relisez doucement** l'étape où vous êtes bloqué
2. **Vérifiez** que vous n'avez pas sauté une étape
3. **Regardez les captures d'écran** si vous en avez besoin
4. **Demandez de l'aide** - c'est normal d'avoir des questions !

---

## 🎉 Félicitations !

Vous venez de déployer votre première application web professionnelle !

**Ce que vous avez maintenant** :
- ✅ Une application accessible 24/7 sur Internet
- ✅ Installable sur tous les appareils
- ✅ Mises à jour automatiques
- ✅ HTTPS sécurisé
- ✅ Hébergement gratuit illimité

**Profitez et partagez Faso-ENT avec vos partenaires ! 🚀**
