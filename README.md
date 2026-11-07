# Maison Nova — boutique e‑commerce

Boutique en ligne moderne construite avec **Next.js 16 (App Router, React 19, Server Actions)**, **Tailwind CSS 4** et **TypeScript**. Déployable gratuitement sur Vercel en 2 minutes.

## Fonctionnalités

**Boutique**
- Accueil, boutique (filtres, recherche, tri), fiches produit, panier latéral, pages À propos / Contact / 404
- Commande traitée **côté serveur** : prix et stocks relus en base (impossibles à falsifier), stock décrémenté automatiquement
- Code promo `BIENVENUE10`, livraison offerte dès 80 €

**Administration (`/admin`)** — protégée par mot de passe
- Tableau de bord : chiffre d'affaires, nombre de commandes, panier moyen, alertes de stock faible
- Liste des commandes avec détail client et suivi du statut (nouvelle → expédiée → livrée / annulée)
- Ajouter, modifier, supprimer des produits (prix, prix barré, stock, image, badge, coup de cœur…)

**Base de données**
- En production sur Netlify : **Netlify Blobs** (gratuit, rien à configurer)
- En local : fichiers JSON dans `.data/`
- Au premier lancement, le catalogue de démonstration est créé automatiquement

## Démarrer en local

```bash
npm install
ADMIN_PASSWORD=monmotdepasse npm run dev
```

Boutique : http://localhost:3000 — Admin : http://localhost:3000/admin

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `ADMIN_PASSWORD` | **Obligatoire** pour activer l'espace `/admin` |
| `ORDER_WEBHOOK_URL` | Optionnel : reçoit chaque commande en JSON (Formspree pour un e‑mail, webhook Discord, Make/Zapier…) |

## Déployer gratuitement sur Netlify

1. Importez le dépôt GitHub sur [app.netlify.com](https://app.netlify.com) (tout est déjà configuré dans `netlify.toml`).
2. *Configuration du projet → Variables d'environnement* : ajoutez `ADMIN_PASSWORD`.
3. *Déploie → Trigger deploy*.

## Personnaliser

| Quoi | Fichier |
|---|---|
| Nom, devise, livraison offerte, e‑mail | `src/lib/config.ts` |
| Catégories et catalogue de démonstration | `src/lib/products.ts` |
| Codes promo | `src/lib/promo.ts` |
| Couleurs et polices | `src/app/globals.css`, `src/app/layout.tsx` |
