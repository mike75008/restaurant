# Automatisation campagne restos

Un seul script : **diagnostic (URL + GMB)** → **message** → **lien démo (site à l’effigie)** → statut **Prêt à l’envoi** + notif. Puis toi : Loom, passage en **À envoyer**. Puis le script : **envoi email** + MAJ **Démo envoyée**.

## 1. Prérequis

- Node.js installé
- Base Airtable avec une table (ex. **Restaurants**) et les champs **exacts** suivants :
  - **Statut** (liste : À contacter, Prêt à l'envoi, À envoyer, Démo envoyée, Refus, Accepté)
  - **Nom** (texte)
  - **Adresse** (texte, optionnel)
  - **Ville** (texte, optionnel)
  - **Site web** (url, optionnel)
  - **Email** (email)
  - **Instagram** (texte, optionnel)
  - **Fiche Google GMB** (liste : Oui / Non)
  - **Diagnostic site** (liste : Absent / Ok / Faible)
  - **Message à envoyer** (texte long)
  - **Lien démo** (url, ex. https://tonsite.com/demo/recXXX)
  - **Lien Loom** (url — tu le remplis après ta vidéo)
  - **Canal utilisé** (liste : Insta, Email, Formulaire)
  - **Date Contact** (date)
  - **restau_ID** : formule `RECORD_ID()` (optionnel)

## 2. Configuration

**Détail complet (quoi mettre dans `.env`, comment créer le fichier, structure Airtable) : voir `automation/GUIDE-CONFIG.md`.**

En résumé :
1. À la **racine du projet**, crée un fichier nommé **`.env`** (point + env, pas de .txt). Ouvre `automation/env.example.txt`, copie tout son contenu dans ce nouveau fichier `.env`, puis remplace les valeurs factices par les tiennes.
2. Remplis au minimum :
   - `AIRTABLE_API_KEY` : token Airtable (créer un token sur Airtable, avec accès à ta base)
   - `AIRTABLE_BASE_ID` : ID de la base (dans l’URL Airtable : `https://airtable.com/appXXXXXX/...`)
   - `AIRTABLE_TABLE_NAME` : nom exact de la table (ex. `Restaurants`)
4. Pour l’envoi d’emails automatique : remplis les variables `SMTP_*`. Sinon le script affiche le message et tu envoies à la main.

## 3. Lancer le script

Depuis la **racine du projet** :

```bash
npm install
node automation/run-campaign.js
```

À chaque run, le script fait **deux phases** :

**Phase 1 — Lignes « À contacter »**
- Vérifie l’URL du site (absent / OK / faible) et met à jour **Diagnostic site**.
- Vérifie la présence sur Google (Places API) et met à jour **Fiche Google** (Oui/Non).
- Choisit le **Message à envoyer** (pas de site / GMB sans site / a déjà un site).
- Remplit **Lien démo** = `SITE_BASE_URL/demo/{recordId}` (site à l’effigie du resto).
- Passe le statut en **Prêt à l’envoi**.
- Envoie une **notification** à `NOTIF_EMAIL` (X fiches prêtes).

**Toi** : tu fais la Loom, tu remplis **Lien Loom**, tu passes le statut en **À envoyer**.

**Phase 2 — Lignes « À envoyer »**
- Envoie l’email (ou affiche le message pour Insta / formulaire) avec **Message à envoyer** et **Lien Loom**.
- Met à jour : **Statut** = Démo envoyée, **Canal utilisé**, **Date contact**.

## 4. Tâche planifiée (Windows)

Pour lancer le script automatiquement (ex. tous les lundis 9h) :
- Ouvre le **Planificateur de tâches** Windows,
- Crée une tâche qui exécute : `node` avec comme argument le chemin complet vers `automation/run-campaign.js`,
- Déclencheur : hebdomadaire, jour et heure de ton choix.
