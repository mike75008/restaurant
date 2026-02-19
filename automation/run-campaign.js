/**
 * Automatisation complète : diagnostic (URL + GMB) -> message -> site à l'effigie (lien démo)
 * -> Statut "Prêt à l'envoi" + notif. Puis phase "À envoyer" -> envoi email + MAJ table.
 * Lancer depuis la racine : node automation/run-campaign.js
 */

require('dotenv').config();

// Trim pour éviter espaces / retours à la ligne cachés (surtout sous Windows)
const AIRTABLE_API_KEY = (process.env.AIRTABLE_API_KEY || '').trim();
const AIRTABLE_BASE_ID = (process.env.AIRTABLE_BASE_ID || '').trim();
const AIRTABLE_TABLE_NAME = (process.env.AIRTABLE_TABLE_NAME || 'Restaurants').trim();
const SITE_BASE_URL = (process.env.SITE_BASE_URL || '').replace(/\/$/, '');
const NOTIF_EMAIL = process.env.NOTIF_EMAIL || process.env.SMTP_USER;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

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
  if (!GOOGLE_PLACES_API_KEY || !name) return null;
  const query = [name, address, city].filter(Boolean).join(', ');
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results && data.results.length > 0) return 'Oui';
    return 'Non';
  } catch (_) {
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
  const records = await fetchRecordsByStatus(STATUT_A_CONTACTER);
  if (records.length === 0) return 0;

  console.log('\n--- Phase "À contacter" -> Prêt à l\'envoi ---');
  console.log(records.length + ' ligne(s).\n');

  for (const rec of records) {
    const f = rec.fields || {};
    const nom = f[FIELDS.nom] || '(sans nom)';
    const urlSite = f[FIELDS.siteWeb];
    const adresse = f[FIELDS.adresse];
    const ville = f[FIELDS.ville];

    console.log('--- ' + nom + ' ---');

    try {
      let diagnosticSite = f[FIELDS.diagnosticSite];
      if (urlSite) {
        diagnosticSite = await checkUrl(urlSite);
        console.log('  Diagnostic site: ' + diagnosticSite);
      } else {
        diagnosticSite = DIAG_SITE_ABSENT;
      }

      let ficheGoogle = f[FIELDS.ficheGoogle];
      if (GOOGLE_PLACES_API_KEY) {
        const gmb = await checkGmb(nom, adresse, ville);
        if (gmb !== null) ficheGoogle = gmb;
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

      await updateRecord(rec.id, updateFields);
      console.log('  Statut -> Prêt à l\'envoi. Lien démo: ' + (lienDemo || '(SITE_BASE_URL non configuré)') + '\n');
    } catch (err) {
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
  const records = await fetchRecordsByStatus(STATUT_A_ENVOYER);
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

    console.log('--- ' + nom + ' ---');

    try {
      const corps = lienLoom ? message + '\n\nLien démo (vidéo): ' + lienLoom : message;

      if (canal === 'Email' && email) {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          await sendEmail(email, 'Proposition pour ' + nom, corps);
          console.log('  Email envoyé.');
        } else {
          console.log('  SMTP non configuré. Message à envoyer à la main.');
        }
      } else if (canal === 'Insta') {
        console.log('  À envoyer en Insta (à la main):\n' + corps);
      } else {
        console.log('  Canal formulaire: envoie le lien à la main.');
      }

      await updateRecord(rec.id, {
        [FIELDS.statut]: STATUT_DEMO_ENVOYEE,
        [FIELDS.canal]: canal,
        [FIELDS.dateContact]: new Date().toISOString().slice(0, 10),
        [FIELDS.misAJourParScript]: 'Oui',
      });
      console.log('  Airtable -> Démo envoyée.\n');
    } catch (err) {
      console.error('  Erreur:', err.message, '\n');
    }
  }

  return records.length;
}

async function main() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Configure .env : AIRTABLE_API_KEY et AIRTABLE_BASE_ID');
    process.exit(1);
  }

  console.log('Lancement automatisation...');
  console.log('Base ID length:', AIRTABLE_BASE_ID.length, '| Table:', JSON.stringify(AIRTABLE_TABLE_NAME));

  // Debug : afficher les valeurs réelles de Status pour aligner le script
  try {
    const all = await fetchAllRecords();
    if (all.length > 0) {
      console.log('\n--- Valeurs de Status dans la table (pour alignement) ---');
      const statusKey = FIELDS.statut;
      all.forEach((rec, i) => {
        const v = (rec.fields && rec.fields[statusKey]) ?? '(vide)';
        console.log('  Ligne ' + (i + 1) + ':', JSON.stringify(v));
      });
      console.log('---\n');
    }
  } catch (e) {
    console.error('Debug fetch:', e.message);
  }

  const n1 = await phasePretAEnvoi();
  const n2 = await phaseAEnvoyer();

  console.log('\nTerminé. Prêt à l\'envoi: ' + n1 + ', Démo envoyée: ' + n2);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
