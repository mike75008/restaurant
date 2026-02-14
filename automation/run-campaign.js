/**
 * Automatisation restos : Airtable -> message + canal -> envoi / prep Insta -> MAJ Airtable
 * Lancer depuis la racine : node automation/run-campaign.js
 * Config : .env (AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME)
 */

require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Restaurants';

const FIELDS = {
  statut: 'Statut',
  nom: 'Nom',
  email: 'Email',
  instagram: 'Instagram',
  siteWeb: 'Site web',
  ficheGoogle: 'Fiche Google',
  canal: 'Canal utilisé',
  messageInsta: 'Message Insta',
  dateContact: 'Date contact',
  lienLoom: 'Lien Loom',
};

const STATUT_A_CONTACTER = 'À contacter';
const STATUT_DEMO_ENVOYEE = 'Démo envoyée';

const MESSAGES = {
  pasDeSite: 'Bonjour,\n\nEn 2026, ne pas avoir de site, c\'est laisser environ 30 % de vos revenus s\'échapper. Je vous propose une solution clé en main. Répondez à ce message si cela vous intéresse.\n\nBien à vous,',
  gmbSansSite: 'Bonjour,\n\nVous avez une fiche Google mais pas de site : vous ratez des clients. Je peux vous proposer un site professionnel clé en main. Répondez-moi pour en discuter.\n\nBien à vous,',
  aDejaSite: 'Bonjour,\n\nBravo pour votre présence en ligne. Je vous ai préparé une proposition pour aller plus loin (site moderne, commande en ligne). Répondez-moi si l\'idée vous tente.\n\nBien à vous,',
};

function getScenario(record) {
  const hasSite = !!record.fields[FIELDS.siteWeb];
  const gmb = record.fields[FIELDS.ficheGoogle];
  const hasGmb = gmb === true || gmb === 'Oui';
  if (!hasSite) return hasGmb ? 'gmbSansSite' : 'pasDeSite';
  return 'aDejaSite';
}

function getCanal(record) {
  if (record.fields[FIELDS.instagram]) return 'Instagram';
  if (record.fields[FIELDS.email]) return 'Email';
  return 'Formulaire';
}

function getMessage(record) {
  return MESSAGES[getScenario(record)];
}

async function fetchRecords() {
  const formula = encodeURIComponent('{Statut}="À contacter"');
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${formula}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });
  if (!res.ok) throw new Error('Airtable: ' + res.status + ' ' + (await res.text()));
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
  if (!res.ok) throw new Error('Airtable update: ' + res.status + ' ' + (await res.text()));
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

async function main() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Configure .env : AIRTABLE_API_KEY et AIRTABLE_BASE_ID');
    process.exit(1);
  }

  console.log('Lecture Airtable...');
  const records = await fetchRecords();
  console.log(records.length + ' ligne(s) à traiter.\n');

  for (const rec of records) {
    const nom = rec.fields[FIELDS.nom] || '(sans nom)';
    const canal = getCanal(rec);
    const message = getMessage(rec);

    console.log('--- ' + nom + ' --- Canal: ' + canal);

    try {
      if (canal === 'Email' && rec.fields[FIELDS.email]) {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          await sendEmail(rec.fields[FIELDS.email], 'Proposition pour ' + nom, message);
          console.log('Email envoyé.');
        } else {
          console.log('SMTP non configuré. Message:\n' + message);
        }
      } else if (canal === 'Instagram') {
        console.log('Message Insta (à envoyer à la main):\n' + message);
      } else {
        console.log('Formulaire: envoie le lien manuellement.');
      }

      const updateFields = {
        [FIELDS.statut]: STATUT_DEMO_ENVOYEE,
        [FIELDS.canal]: canal,
        [FIELDS.dateContact]: new Date().toISOString().slice(0, 10),
      };
      if (canal === 'Instagram') updateFields[FIELDS.messageInsta] = message;

      await updateRecord(rec.id, updateFields);
      console.log('Airtable mis à jour.\n');
    } catch (err) {
      console.error('Erreur ' + nom + ':', err.message, '\n');
    }
  }

  console.log('Terminé.');
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
