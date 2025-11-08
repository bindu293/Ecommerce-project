/*
  Seed script to upsert sample products into Firestore.
  Usage: npm run seed (from repo root or within backend workspace)
*/
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/services/firebase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slug(id) {
  return (id || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  const filePath = path.resolve(__dirname, '../sample-data/products.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const items = JSON.parse(raw);
  const batch = db.batch();
  const col = db.collection('products');

  for (const p of items) {
    const id = slug(p.id || p.name);
    const ref = col.doc(id);
    batch.set(ref, { ...p, id }, { merge: true });
  }

  await batch.commit();
  console.log(`[seed] Upserted ${items.length} products.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
