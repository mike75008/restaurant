# Guide de configuration

## Ce que veut dire « mettre env.example.txt en .env »

Le fichier **`automation/env.example.txt`** est un **modèle** : il liste les variables dont le script a besoin, avec des valeurs factices (`patxxxxxxxxxxxx`, `ton@email.com`, etc.).

**« Le mettre en .env »** = créer un **nouveau fichier** qui s’appelle exactement **`.env`** (avec le point devant), à la **racine du projet** (au même niveau que `package.json`), et y mettre le **même type de contenu** que dans `env.example.txt`, mais en **remplaçant les valeurs par les tiennes**.

### Étapes concrètes

1. Ouvre le fichier **`automation/env.example.txt`** (avec Bloc-notes ou Cursor).
2. Copie **tout** son contenu (Ctrl+A, Ctrl+C).
3. À la **racine du projet** (dossier `Restaurant copie`), crée un **nouveau fichier**.
4. Nomme-le exactement : **`.env`** (point + env, pas de .txt à la fin).
5. Colle le contenu dedans (Ctrl+V).
6. Remplace chaque valeur factice par **tes vraies infos** (voir le tableau ci-dessous).
7. Enregistre le fichier.

**Pourquoi un fichier .env ?**  
Le script (et Next.js) lisent ce fichier au démarrage pour récupérer les clés API, mots de passe, etc. **Ne mets jamais ce fichier sur Git** : il contient des secrets. Il est normal qu’il ne soit pas dans le dépôt.

---

## Variables à remplir dans `.env`

| Variable | Où la trouver / quoi mettre |
|----------|----------------------------|
| **AIRTABLE_API_KEY** | Airtable → Compte → Developer hub → Create token. Donne accès à ta base. Commence souvent par `pat...`. |
| **AIRTABLE_BASE_ID** | Dans l’URL de ta base : `https://airtable.com/appXXXXXXXXXXXXXX/...` → la partie `appXXXXXXXXXXXXXX` est l’ID. |
| **AIRTABLE_TABLE_NAME** | Le nom exact de la table, ex. `Restaurants` (sensible à la casse). |
| **SITE_BASE_URL** | L’URL de ton site en ligne, sans slash à la fin. Ex. `https://mon-resto-demo.vercel.app` ou `https://monsite.com`. |
| **NOTIF_EMAIL** | Ton adresse email : c’est là que le script envoie « X fiches Prêt à l’envoi ». |
| **GOOGLE_PLACES_API_KEY** | Optionnel. Google Cloud Console → Activer Places API → Créer une clé API. Pour détecter automatiquement GMB (Oui/Non). Tu peux laisser vide. |
| **SMTP_HOST** | Serveur d’envoi d’emails (ex. `smtp.gmail.com`, `smtp.office365.com`, ou celui de ton hébergeur email). |
| **SMTP_PORT** | Souvent `587` (TLS) ou `465` (SSL). |
| **SMTP_SECURE** | `false` si port 587, `true` si port 465. |
| **SMTP_USER** | Ton adresse email d’envoi (celle du compte SMTP). |
| **SMTP_PASS** | Mot de passe du compte email, ou « mot de passe d’application » si Gmail/Outlook. |
| **SMTP_FROM** | Texte affiché comme expéditeur, ex. `Proposition sites <ton@email.com>`. |

---

## Structure de la base Airtable

Crée une **base** Airtable, puis une **table** (tu peux l’appeler **Restaurants**).  
Ajoute les champs suivants avec **exactement** ces noms et types (les noms sont utilisés par le script).

| Nom du champ | Type dans Airtable | Options / remarques |
|--------------|--------------------|--------------------|
| **Statut** | Liste à choix unique | Options **sans accents** (pour éviter les soucis de clavier) : `A contacter`, `Pret a l'envoi`, `A envoyer`, `Demo envoyee`, `Refus`, `Accepte`. |
| **Nom** | Texte sur une ligne | Nom du restaurant. |
| **Adresse** | Texte sur une ligne | Optionnel. |
| **Ville** | Texte sur une ligne | Optionnel. Utilisé pour Google Places. |
| **Site web** | URL | Optionnel. Le script vérifie si l’URL répond. |
| **Email** | Email | Pour l’envoi du message. |
| **Instagram** | Texte sur une ligne | Handle ou lien. Si rempli, le script considère le canal = Instagram. |
| **Fiche Google GMB** | Liste à choix unique | Options : `Oui`, `Non`. |
| **Diagnostic site** | Liste à choix unique | Options : `Absent`, `Ok`, `Faible`. |
| **Message à envoyer** | Texte long | Rempli par le script selon la situation. |
| **Lien démo** | URL | Rempli par le script : `SITE_BASE_URL/demo/recXXX`. |
| **Lien Loom** | URL | Tu le remplis après ta vidéo Loom. |
| **Canal utilisé** | Liste à choix unique | Options : `Insta`, `Email`, `Formulaire`. Rempli par le script en phase 2. |
| **Date Contact** | Date | Remplie par le script (date du dernier traitement). |
| **restau_ID** | Formule | Formule : `RECORD_ID()`. Pour afficher l’ID de la ligne (optionnel). |

Tu peux ajouter d’autres champs si tu veux (notes, téléphone, etc.), mais **ne renomme pas** ceux listés ci-dessus, sinon le script ne les trouvera pas.

**Accents :** le script utilise les libellés **sans accents** pour Statut (`A contacter`, `Pret a l'envoi`, `A envoyer`, `Demo envoyee`) pour que ça marche peu importe le clavier. Si tu as déjà mis des accents dans Airtable, soit tu corriges les options pour enlever les accents, soit tu me dis les libellés exacts et j’aligne le script.

---

## Choses à ne pas oublier

- **Token Airtable** : quand tu crées le token, donne-lui au minimum les droits **read** et **write** sur la base.
- **Premier test** : mets au moins une ligne avec **Statut** = `A contacter` et **Nom** + **Email** (ou Instagram) remplis pour tester le script.
- **Lien démo** : il ne marchera qu’une fois le site déployé et `SITE_BASE_URL` rempli dans le `.env`. En local, tu peux laisser `SITE_BASE_URL` vide pour tester le reste.
- **Nom de la table** : dans le `.env`, `AIRTABLE_TABLE_NAME` doit être **exactement** le nom de ta table (ex. `Restaurants`). Le nom de la base (« Restaurants selling templates ») ne sert pas au script, seul compte l’**ID de la base** dans l’URL.

---

## Récap

1. **Créer `.env`** à la racine : copier le contenu de `automation/env.example.txt` dans un fichier nommé `.env`, puis remplir les valeurs avec le tableau des variables.
2. **Créer la base Airtable** avec la table et les champs du tableau « Structure de la base Airtable ».
3. Lancer `node automation/run-campaign.js` depuis la racine du projet.
