# Maison Nova — boutique e‑commerce

Boutique en ligne moderne construite avec **Next.js 16 (App Router, React 19, Server Actions)**, **Tailwind CSS 4** et **TypeScript**. Déployable gratuitement sur Vercel en 2 minutes.

## Fonctionnalités

- Page d'accueil avec hero, catégories, coups de cœur, newsletter (code promo) et avis clients
- Boutique avec filtres par catégorie, recherche, tri et filtre « en stock »
- Fiches produit pré-générées en statique (SEO + Open Graph) avec sélection de quantité et produits associés
- Panier latéral animé + page panier, sauvegardé dans le navigateur, avec barre de progression vers la livraison offerte
- Tunnel de commande : validation, code promo `BIENVENUE10`, **prix recalculés côté serveur** (impossible de les modifier depuis le navigateur)
- Pages À propos, Contact et 404, responsive mobile, accessible

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000

## Personnaliser

| Quoi | Fichier |
|---|---|
| Nom, devise, seuil de livraison offerte, e‑mail | `src/lib/config.ts` |
| Produits et catégories | `src/lib/products.ts` |
| Codes promo | `src/lib/promo.ts` |
| Couleurs et polices | `src/app/globals.css`, `src/app/layout.tsx` |

Pour vos propres photos : placez-les dans `public/produits/` et indiquez `image: "/produits/mon-image.jpg"`.

## Recevoir les commandes

Chaque commande est écrite dans les logs du serveur. Pour la recevoir **par e‑mail gratuitement**, créez un formulaire sur [formspree.io](https://formspree.io), puis ajoutez la variable d'environnement :

```
ORDER_WEBHOOK_URL=https://formspree.io/f/xxxxxxx
```

Ça marche aussi avec une URL de webhook Discord, Make ou Zapier (Google Sheets).

## Déployer gratuitement sur Vercel

1. Poussez ce dossier sur un dépôt GitHub.
2. Sur [vercel.com/new](https://vercel.com/new), importez le dépôt, puis cliquez sur **Deploy** (aucune configuration nécessaire).
3. (Optionnel) Ajoutez `ORDER_WEBHOOK_URL` dans *Settings → Environment Variables*.

Netlify et Cloudflare Pages fonctionnent aussi.

## Pistes suivantes

- Paiement par carte : Stripe Checkout
- Base de données des commandes et produits : Neon Postgres ou Supabase (offres gratuites)
- Back-office : Sanity ou Payload CMS
