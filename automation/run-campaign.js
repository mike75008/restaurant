/**
 * Automatisation complète : diagnostic (URL + GMB) -> message -> site à l'effigie (lien démo)
 * -> Statut "Prêt à l'envoi" + notif. Puis phase "À envoyer" -> envoi email + MAJ table.
 * Lancer depuis la racine : node automation/run-campaign.js
 * Trace : chaque run écrit dans automation/trace.log (flux étape par étape).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const TRACE_FILE = path.join(__dirname, 'trace.log');

function trace(etape, message, detail) {
  const parts = [new Date().toISOString(), etape, message, detail].filter(function (x) { return x !== undefined && x !== ''; });
  const line = parts.join(' | ');
  try {
    fs.appendFileSync(TRACE_FILE, line + '\n');
  } catch (_) {}
  console.log('[TRACE]', line);
}

// Trim pour éviter espaces / retours à la ligne cachés (surtout sous Windows)
const AIRTABLE_API_KEY = (process.env.AIRTABLE_API_KEY || '').trim();
const AIRTABLE_BASE_ID = (process.env.AIRTABLE_BASE_ID || '').trim();
const AIRTABLE_TABLE_NAME = (process.env.AIRTABLE_TABLE_NAME || 'Restaurants').trim();
const SITE_BASE_URL = (process.env.SITE_BASE_URL || '').replace(/\/$/, '');
const NOTIF_EMAIL = process.env.NOTIF_EMAIL || process.env.SMTP_USER;
const GOOGLE_PLACES_API_KEY = (process.env.GOOGLE_PLACES_API_KEY || '').trim();

// Noms exacts des champs dans ta table Airtable (base Restaurants selling templates)
const FIELDS = {
  statut: 'Status',
  nom: 'Nom',
  adresse: 'Adresse',
  ville: 'Ville',
  email: 'Email',
  instagram: 'Instagram', // optionnel : si pas de colonne, le script utilise Email ou Formulaire
  siteWeb: 'Site web',
  ficheGoogle: 'Fiche Google GMB',
  diagnosticSite: 'Diagnostic site',
  canal: 'Canal utilisé',
  messageAEnvoyer: 'Message à envoyer',
  lienDemo: 'Lien démo',
  lienLoom: 'Lien Loom',
  dateContact: 'Date Contact',
  misAJourParScript: 'Mis à jour par le script',
};

// Libellés exacts du champ Statut dans Airtable (à l’identique, accents compris)
// Lecture (filtre) : espaces comme dans ta base. Écriture : sans espace en fin (options Airtable).
const STATUT_A_CONTACTER = "A contacter ";
const STATUT_PRET_A_ENVOYER = "Pret à l'envoi";
const STATUT_A_ENVOYER = "A envoyer";
const STATUT_DEMO_ENVOYEE = "Démo envoyée";

const DIAG_SITE_ABSENT = 'Absent';
const DIAG_SITE_OK = 'Ok';      // exactement comme dans Airtable (O majuscule, k minuscule)
const DIAG_SITE_FAIBLE = 'Faible';

const MESSAGES = {
  pasDeSite:
    "Bonjour,\n\nEn 2026, ne pas avoir de site, c'est laisser environ 30 % de vos revenus s'échapper. Je vous propose une solution clé en main. Répondez à ce message si cela vous intéresse.\n\nBien à vous,",
  gmbSansSite:
    "Bonjour,\n\nVous avez une fiche Google mais pas de site : vous ratez des clients. Je peux vous proposer un site professionnel clé en main. Répondez-moi pour en discuter.\n\nBien à vous,",
  aDejaSite:
    "Bonjour,\n\nBravo pour votre présence en ligne. Je vous ai préparé une proposition pour aller plus loin (site moderne, commande en ligne). Répondez-moi si l'idée vous tente.\n\nBien à vous,",
};

function getCanal(record) {
  const f = record.fields || {};
  if (f[FIELDS.instagram]) return 'Insta';
  if (f[FIELDS.email]) return 'Email';
  return 'Formulaire';
}

function getScenario(record) {
  const f = record.fields || {};
  const hasSite = f[FIELDS.diagnosticSite] === DIAG_SITE_OK || f[FIELDS.diagnosticSite] === DIAG_SITE_FAIBLE;
  const hasGmb = f[FIELDS.ficheGoogle] === true || f[FIELDS.ficheGoogle] === 'Oui';
  if (!hasSite) return hasGmb ? 'gmbSansSite' : 'pasDeSite';
  return 'aDejaSite';
}

function getMessage(record) {
  return MESSAGES[getScenario(record)];
}

async function checkUrl(url) {
  if (!url || typeof url !== 'string') return DIAG_SITE_ABSENT;
  const u = url.startsWith('http') ? url : 'https://' + url;
  try {
    const res = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    if (res.ok) return DIAG_SITE_OK;
    if (res.status >= 400) return DIAG_SITE_FAIBLE;
    return DIAG_SITE_OK;
  } catch (_) {
    try {
      const res = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      return res.ok ? DIAG_SITE_OK : DIAG_SITE_FAIBLE;
    } catch (_) {
      return DIAG_SITE_ABSENT;
    }
  }
}

async function checkGmb(name, address, city) {
  if (!GOOGLE_PLACES_API_KEY || !name) {
    if (!GOOGLE_PLACES_API_KEY) console.log('  (Fiche Google: clé Places API absente → on garde la valeur Airtable)');
    return null;
  }
  const queryFull = [name, address, city].filter(Boolean).join(', ');
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(queryFull)}&key=${GOOGLE_PLACES_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('  Places API requête:', JSON.stringify(queryFull));
    console.log('  Places API status:', data.status, '| résultats:', data.results ? data.results.length : 0);
    if (data.status === 'OK' && data.results && data.results.length > 0) return 'Oui';
    if (data.status === 'ZERO_RESULTS' && (address || city)) {
      const querySimple = [name, city].filter(Boolean).join(', ');
      if (querySimple !== queryFull) {
        const url2 = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(querySimple)}&key=${GOOGLE_PLACES_API_KEY}`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();
        console.log('  Places API (recherche simplifiée):', JSON.stringify(querySimple), '→', data2.status, '| résultats:', data2.results ? data2.results.length : 0);
        if (data2.status === 'OK' && data2.results && data2.results.length > 0) return 'Oui';
      }
    }
    return 'Non';
  } catch (e) {
    console.log('  Places API erreur:', e.message);
    return null;
  }
}

async function fetchAllRecords() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?maxRecords=10`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });
  if (!res.ok) throw new Error('Airtable: ' + res.status + ' ' + (await res.text()));
  const data = await res.json();
  return data.records;
}

async function fetchRecordsByStatus(status) {
  const champStatut = FIELDS.statut.replace(/"/g, '\\"');
  const formula = encodeURIComponent(`{${champStatut}}="${status}"`);
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${formula}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });
  if (!res.ok) {
    const errBody = await res.text();
    console.error('Airtable URL (base ID masqué):', url.replace(AIRTABLE_BASE_ID, '***'));
    console.error('Réponse Airtable:', res.status, errBody);
    throw new Error('Airtable: ' + res.status + ' ' + errBody);
  }
  const data = await res.json();
  return data.records;
}

async function updateRecord(recordId, fields) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error('PATCH échec. Payload envoyé:', JSON.stringify(fields, null, 2));
    console.error('Réponse Airtable:', res.status, body);
    throw new Error('Airtable update: ' + res.status + ' ' + body);
  }
}

async function sendEmail(to, subject, text) {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}

async function phasePretAEnvoi() {
  trace('PHASE1_FETCH', 'Appel Airtable filterByFormula "À contacter"...');
  const records = await fetchRecordsByStatus(STATUT_A_CONTACTER);
  trace('PHASE1_FETCH', 'OK', 'lignes=' + (records ? records.length : 0));
  if (records.length === 0) return 0;

  console.log('\n--- Phase "À contacter" -> Prêt à l\'envoi ---');
  console.log(records.length + ' ligne(s).\n');

  for (const rec of records) {
    const f = rec.fields || {};
    const nom = f[FIELDS.nom] || '(sans nom)';
    const urlSite = f[FIELDS.siteWeb];
    const adresse = f[FIELDS.adresse];
    const ville = f[FIELDS.ville];

    trace('RECORD', nom, 'recordId=' + rec.id);
    console.log('--- ' + nom + ' ---');

    try {
      let diagnosticSite = f[FIELDS.diagnosticSite];
      if (urlSite) {
        trace('RECORD', nom, 'checkUrl entrée');
        diagnosticSite = await checkUrl(urlSite);
        trace('RECORD', nom, 'checkUrl sortie', diagnosticSite);
        console.log('  Diagnostic site: ' + diagnosticSite);
      } else {
        diagnosticSite = DIAG_SITE_ABSENT;
        trace('RECORD', nom, 'pas de site web', diagnosticSite);
      }

      let ficheGoogle = f[FIELDS.ficheGoogle];
      if (GOOGLE_PLACES_API_KEY) {
        trace('RECORD', nom, 'checkGmb entrée');
        const gmb = await checkGmb(nom, adresse, ville);
        if (gmb !== null) ficheGoogle = gmb;
        trace('RECORD', nom, 'checkGmb sortie', ficheGoogle);
        console.log('  Fiche Google: ' + ficheGoogle);
      }

      const scenarioRecord = {
        fields: {
          ...f,
          [FIELDS.diagnosticSite]: diagnosticSite,
          [FIELDS.ficheGoogle]: ficheGoogle,
        },
      };
      const message = getMessage(scenarioRecord);
      const lienDemo = SITE_BASE_URL ? `${SITE_BASE_URL}/demo/${rec.id}` : '';

      const updateFields = {
        [FIELDS.statut]: STATUT_PRET_A_ENVOYER,
        [FIELDS.diagnosticSite]: diagnosticSite,
        [FIELDS.ficheGoogle]: ficheGoogle,
        [FIELDS.messageAEnvoyer]: message,
        [FIELDS.dateContact]: new Date().toISOString().slice(0, 10),
        [FIELDS.misAJourParScript]: 'Oui',
      };
      if (lienDemo) updateFields[FIELDS.lienDemo] = lienDemo;

      trace('RECORD', nom, 'updateRecord Airtable entrée');
      await updateRecord(rec.id, updateFields);
      trace('RECORD', nom, 'updateRecord Airtable OK');
      console.log('  Statut -> Prêt à l\'envoi. Lien démo: ' + (lienDemo || '(SITE_BASE_URL non configuré)') + '\n');
    } catch (err) {
      trace('RECORD', nom, 'ERREUR', err.message);
      console.error('  Erreur:', err.message);
      console.error('  (Vérifier les noms des champs et les valeurs dans Airtable.)\n');
    }
  }

  if (NOTIF_EMAIL && records.length > 0 && process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      await sendEmail(
        NOTIF_EMAIL,
        '[Restos] ' + records.length + ' fiche(s) Prêt à l\'envoi',
        records.length + ' restaurant(s) en statut "Prêt à l\'envoi". Fais tes Loom puis passe-les en "À envoyer".'
      );
      console.log('Notification envoyée à ' + NOTIF_EMAIL + '\n');
    } catch (e) {
      console.error('Notif non envoyée:', e.message);
    }
  }

  return records.length;
}

async function phaseAEnvoyer() {
  trace('PHASE2_FETCH', 'Appel Airtable filterByFormula "À envoyer"...');
  const records = await fetchRecordsByStatus(STATUT_A_ENVOYER);
  trace('PHASE2_FETCH', 'OK', 'lignes=' + (records ? records.length : 0));
  if (records.length === 0) return 0;

  console.log('\n--- Phase "À envoyer" -> Démo envoyée ---');
  console.log(records.length + ' ligne(s).\n');

  for (const rec of records) {
    const f = rec.fields || {};
    const nom = f[FIELDS.nom] || '(sans nom)';
    const email = f[FIELDS.email];
    const message = f[FIELDS.messageAEnvoyer] || getMessage(rec);
    const lienLoom = f[FIELDS.lienLoom];
    const canal = getCanal(rec);

    trace('RECORD', nom, 'canal=' + canal);
    console.log('--- ' + nom + ' ---');

    try {
      const corps = lienLoom ? message + '\n\nLien démo (vidéo): ' + lienLoom : message;

      if (canal === 'Email' && email) {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          trace('RECORD', nom, 'sendEmail entrée');
          await sendEmail(email, 'Proposition pour ' + nom, corps);
          trace('RECORD', nom, 'sendEmail OK');
          console.log('  Email envoyé.');
        } else {
          trace('RECORD', nom, 'SMTP non configuré');
          console.log('  SMTP non configuré. Message à envoyer à la main.');
        }
      } else if (canal === 'Insta') {
        console.log('  À envoyer en Insta (à la main):\n' + corps);
      } else {
        console.log('  Canal formulaire: envoie le lien à la main.');
      }

      trace('RECORD', nom, 'updateRecord Airtable (Démo envoyée) entrée');
      await updateRecord(rec.id, {
        [FIELDS.statut]: STATUT_DEMO_ENVOYEE,
        [FIELDS.canal]: canal,
        [FIELDS.dateContact]: new Date().toISOString().slice(0, 10),
        [FIELDS.misAJourParScript]: 'Oui',
      });
      trace('RECORD', nom, 'updateRecord Airtable OK');
      console.log('  Airtable -> Démo envoyée.\n');
    } catch (err) {
      trace('RECORD', nom, 'ERREUR', err.message);
      console.error('  Erreur:', err.message, '\n');
    }
  }

  return records.length;
}

function validateEnvFormat() {
  const warnings = [];
  if (!AIRTABLE_BASE_ID) return;
  if (AIRTABLE_BASE_ID.length > 20 || AIRTABLE_BASE_ID.includes('/') || AIRTABLE_BASE_ID.includes('?')) {
    warnings.push('AIRTABLE_BASE_ID : mauvais format. Il faut uniquement l\'ID (ex. appXXXXXXXXXXXXXX, ~14 caractères), pas l\'URL complète (sans /tbl... ni ?blocks=...).');
  } else if (!AIRTABLE_BASE_ID.startsWith('app')) {
    warnings.push('AIRTABLE_BASE_ID : doit commencer par "app" (ex. appj1q1ztAEzUaiod).');
  }
  if (AIRTABLE_API_KEY && !AIRTABLE_API_KEY.startsWith('pat')) {
    warnings.push('AIRTABLE_API_KEY : un token Airtable commence par "pat". Vérifier la clé (Airtable → Create token).');
  }
  if (GOOGLE_PLACES_API_KEY && (!GOOGLE_PLACES_API_KEY.startsWith('AIza') || GOOGLE_PLACES_API_KEY.length < 35)) {
    warnings.push('GOOGLE_PLACES_API_KEY : format invalide (doit commencer par "AIza", ~39 caractères). Vérifier la clé dans Google Cloud Console.');
  }
  if (SITE_BASE_URL && !/^https?:\/\//.test(SITE_BASE_URL)) {
    warnings.push('SITE_BASE_URL : doit commencer par https:// (ou http://).');
  }
  warnings.forEach(function (w) {
    console.warn('[Format .env] ' + w);
  });
}

async function main() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Configure .env : AIRTABLE_API_KEY et AIRTABLE_BASE_ID');
    process.exit(1);
  }

  try {
    fs.appendFileSync(TRACE_FILE, '\n=== Run ' + new Date().toISOString() + ' ===\n');
  } catch (_) {}

  trace('INIT', 'Démarrage');
  validateEnvFormat();
  trace('ENV', 'Base ID length=' + AIRTABLE_BASE_ID.length, 'Table=' + AIRTABLE_TABLE_NAME);

  try {
    trace('FETCH_ALL', 'Récupération jusqu\'à 10 enregistrements (debug Status)...');
    const all = await fetchAllRecords();
    trace('FETCH_ALL', 'OK', 'n=' + (all ? all.length : 0));
    if (all && all.length > 0) {
      const statusKey = FIELDS.statut;
      all.forEach(function (rec, i) {
        const v = (rec.fields && rec.fields[statusKey]) ?? '(vide)';
        console.log('  Ligne ' + (i + 1) + ':', JSON.stringify(v));
      });
    }
  } catch (e) {
    trace('FETCH_ALL', 'ERREUR', e.message);
    console.error('Debug fetch:', e.message);
  }

  trace('PHASE1', 'Entrée phase "À contacter" -> Prêt à l\'envoi');
  const n1 = await phasePretAEnvoi();
  trace('PHASE1', 'Sortie', 'Prêt à l\'envoi: ' + n1);

  trace('PHASE2', 'Entrée phase "À envoyer" -> Démo envoyée');
  const n2 = await phaseAEnvoyer();
  trace('PHASE2', 'Sortie', 'Démo envoyée: ' + n2);

  trace('FIN', 'Terminé', 'Prêt à l\'envoi: ' + n1 + ', Démo envoyée: ' + n2);
  try {
    fs.appendFileSync(TRACE_FILE, '=== Fin run ===\n\n');
  } catch (_) {}
  console.log('\nTerminé. Prêt à l\'envoi: ' + n1 + ', Démo envoyée: ' + n2);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
