import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const allowedTypes = new Set(['朋友', '家人', '同学', '神秘人']);

app.use(express.json({ limit: '8kb' }));

function assertConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
}

function validateWish(input) {
  const nickname = String(input?.nickname ?? '').trim();
  const message = String(input?.message ?? '').trim();
  const type = String(input?.type ?? '').trim();

  if (nickname.length < 1 || nickname.length > 20) {
    return { error: '昵称需要 1 到 20 个字。' };
  }

  if (message.length < 1 || message.length > 180) {
    return { error: '祝福内容需要 1 到 180 个字。' };
  }

  if (!allowedTypes.has(type)) {
    return { error: '祝福类型无效。' };
  }

  return { wish: { nickname, message, type } };
}

function toWish(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    message: row.message,
    type: row.type,
    createdAt: row.created_at,
  };
}

async function supabaseRequest(path, options = {}) {
  assertConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json; charset=utf-8',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message ?? 'Supabase request failed';
    throw new Error(message);
  }

  return payload;
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/wishes', async (_request, response) => {
  try {
    const rows = await supabaseRequest('wishes?select=*&order=created_at.desc');
    response.json(rows.map(toWish));
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : '读取祝福失败。' });
  }
});

app.post('/api/wishes', async (request, response) => {
  const result = validateWish(request.body);
  if (result.error) {
    response.status(400).json({ error: result.error });
    return;
  }

  try {
    const rows = await supabaseRequest('wishes?select=*', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(result.wish),
    });
    response.status(201).json(toWish(rows[0]));
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : '提交祝福失败。' });
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Birthday API listening on http://127.0.0.1:${port}`);
});
