# Automatisation campagne restos

Ce dossier contient le script qui lit Airtable, choisit le message et le canal (Email / Instagram / Formulaire), envoie les emails si configuré, et met à jour la base.

## 1. Prérequis

- Node.js installé
- Une base Airtable avec une table (ex. **Restaurants**) et les champs suivants (les noms doivent correspondre à `run-campaign.js` ou tu les adaptes) :
  - **Statut** (liste : À contacter, Démo envoyée, Refus, Accepté)
  - **Nom** (texte)
  - **Email** (email)
  - **Instagram** (texte, optionnel)
  - **Site web** (url, optionnel)
  - **Fiche Google** (case à cocher ou Oui/Non)
  - **Canal utilisé** (liste : Email, Instagram, Formulaire)
  - **Message Insta** (texte long, optionnel)
  - **Date contact** (date)
  - **Lien Loom** (url, optionnel)
  - **restau_ID** : formule `RECORD_ID()` (optionnel, pour référence)

## 2. Configuration

1. À la **racine du projet**, crée un fichier **`.env`** (ne le commit pas).
2. Copie `automation/env.example.txt` en `.env` à la racine et remplis les valeurs.
3. Remplis au minimum :
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

Le script :
- lit les lignes dont le statut est **À contacter**,
- pour chaque ligne détermine le message (pas de site / GMB sans site / a déjà un site) et le canal (Instagram si renseigné, sinon Email, sinon Formulaire),
- envoie l’email si SMTP est configuré, sinon affiche le message,
- pour Instagram : remplit le champ **Message Insta** (tu envoies toi-même),
- met à jour la ligne : **Statut** = Démo envoyée, **Canal utilisé**, **Date contact**.

## 4. Tâche planifiée (Windows)

Pour lancer le script automatiquement (ex. tous les lundis 9h) :
- Ouvre le **Planificateur de tâches** Windows,
- Crée une tâche qui exécute : `node` avec comme argument le chemin complet vers `automation/run-campaign.js`,
- Déclencheur : hebdomadaire, jour et heure de ton choix.
