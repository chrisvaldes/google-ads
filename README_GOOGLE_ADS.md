# 🚀 Déploiement Google Ads sur Vercel

## 📋 État actuel
- ✅ **OAuth2** : Fonctionne parfaitement
- ✅ **Token** : Valide (`valdesfeutseu@gmail.com`)
- ✅ **Developer Token** : Correct (`I60O07C5DGas65dzjnu4kQ`)
- ❌ **CORS local** : Bloqué (normal)
- ✅ **Proxy serverless** : Prêt pour Vercel

## 🔧 Étapes de déploiement

### 1. Installer Vercel CLI
```bash
npm i -g vercel
```

### 2. Se connecter à Vercel
```bash
vercel login
```

### 3. Déployer l'application
```bash
# Dans le dossier du projet
vercel
```

### 4. Mettre à jour Google Cloud Console

#### Redirect URI
- **Ancien** : `https://localhost:4200/callback`
- **Nouveau** : `https://votre-app.vercel.app/callback`

#### Domaines autorisés
- Ajoutez `https://votre-app.vercel.app` dans les "Authorized JavaScript origins"

### 5. Mettre à jour le code (si nécessaire)
Dans `google-ads.service.ts`, le redirect URI sera automatiquement mis à jour :

```typescript
private redirectUri = 'https://votre-app.vercel.app/callback';
```

## 🎯 Résultat attendu après déploiement

```
✅ Connecté à Google Ads
✅ Réponse API Google Ads (production): {resourceNames: ["customers/VOTRE_ID", ...]}
📊 Total comptes trouvés (production): X
📋 Vos comptes Google Ads apparaîtront !
```

## 📁 Fichiers importants

- **`api/google-ads-proxy.js`** : Proxy serverless (déjà prêt)
- **`src/app/services/google-ads.service.ts`** : Service Google Ads
- **`vercel.json`** : Configuration Vercel (si nécessaire)

## 🔍 Vérification après déploiement

1. **Ouvrez** `https://votre-app.vercel.app`
2. **Connectez-vous** à Google Ads
3. **Vérifiez** la console pour les messages de réussite
4. **Vos comptes** Google Ads devraient apparaître

## 🚨 Si problème persiste

- **Vérifiez** le redirect URI dans Google Cloud Console
- **Assurez-vous** que l'API Google Ads est activée
- **Vérifiez** que le Developer Token est approuvé

---

**🎉 Une fois déployé, vous verrez enfin vos vrais comptes Google Ads !**
