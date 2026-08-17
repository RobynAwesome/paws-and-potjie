import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT ?? 8787);
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json({ limit: '32kb' }));

const pairingSchema = new mongoose.Schema({
  mood: { type: String, required: true, enum: ['slow', 'sunny', 'bold'] },
  dogEnergy: { type: String, required: true, enum: ['nap', 'stroll', 'zoomies'] },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

const Pairing = mongoose.models.Pairing ?? mongoose.model('Pairing', pairingSchema);
const memoryReceipts: Array<{ mood: string; dogEnergy: string; createdAt: string }> = [];

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'paws-and-potjie-api', mongo: mongoose.connection.readyState === 1 });
});

app.post('/api/pairings', async (req, res) => {
  const { mood, dogEnergy } = req.body as { mood?: string; dogEnergy?: string };
  if (!['slow', 'sunny', 'bold'].includes(mood ?? '') || !['nap', 'stroll', 'zoomies'].includes(dogEnergy ?? '')) {
    res.status(400).json({ ok: false, error: 'invalid_pairing_state' });
    return;
  }

  if (mongoose.connection.readyState === 1) {
    const saved = await Pairing.create({ mood, dogEnergy });
    res.status(201).json({ ok: true, id: saved.id, persisted: 'mongo' });
    return;
  }

  memoryReceipts.push({ mood: mood!, dogEnergy: dogEnergy!, createdAt: new Date().toISOString() });
  res.status(201).json({ ok: true, id: `local-${memoryReceipts.length}`, persisted: 'memory' });
});

async function boot() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      console.log('[paws-potjie] mongo connected');
    } catch (error) {
      console.warn('[paws-potjie] mongo unavailable; using memory receipts', error);
    }
  }

  app.listen(port, () => console.log(`[paws-potjie] API listening on :${port}`));
}

void boot();
