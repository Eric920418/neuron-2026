import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const MINIMAX_SYSTEM_PROMPT = `你是一個擅長跨域共作的資傳學生，擅長把不同領域與資訊傳播的設計/科技整合，有這些領域，網頁開發，3D 建模與動畫，互動藝術與視覺特效，影視製作與敘事，使用者體驗與設計，新興科技，創造可能性。請你發想一段30字左右的文案，說明資傳所學如何結合，如何共創，可以以「我們可以一起」為開頭，寫一段文字，可以不只用我們可以也可以自行發想。回覆的時候，只需要給我這段文字就好，不要有其他廢話，如果可以可以有趣一點或者跟時事有關，並說明做法和鼓勵輸入者加入。如果你發現這個專長不是傳統定義上的，或是不雅，或是有犯罪疑慮，請用幽默的語氣說我不會。`;

app.post('/api/ai/generate', async (req, res) => {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    console.error('[minimax] MINIMAX_API_KEY 未設定');
    return res.status(500).json({ error: 'MINIMAX_API_KEY 未設定' });
  }

  const { specialty } = req.body;
  if (!specialty || typeof specialty !== 'string' || specialty.trim().length === 0) {
    return res.status(400).json({ error: '請提供有效的專長' });
  }
  if (specialty.length > 50) {
    return res.status(400).json({ error: '專長名稱過長' });
  }

  try {
    const response = await fetch('https://api.minimax.io/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7-highspeed',
        messages: [
          { role: 'system', content: `你是一個擅長跨域共作的資傳學生，擅長把不同領域與資訊傳播的設計/科技整合，有這些領域，網頁開發，3D 建模與動畫，互動藝術與視覺特效，影視製作與敘事，使用者體驗與設計，新興科技，創造可能性。請你發想一段30字左右的文案，說明資傳所學如何結合，如何共創，可以以「我們可以一起」為開頭，寫一段文字，可以不只用我們可以也可以自行發想。回覆的時候，只需要給我這段文字就好，不要有其他廢話，如果可以可以有趣一點或者跟時事有關，並說明做法和鼓勵輸入者加入。如果你發現這個專長不是傳統定義上的，或是不雅，或是有犯罪疑慮，請用幽默的語氣說我不會。不要使用<think>標籤，直接回覆文案內容。` },
          { role: 'user', content: `今天，你遇到的專長是「${specialty.trim()}」。` },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.base_resp?.status_code !== 0) {
      console.error('[minimax] API error:', data);
      return res.status(502).json({ error: `MiniMax API 錯誤: ${response.status} ${JSON.stringify(data)}` });
    }

    const raw = data.choices?.[0]?.message?.content ?? '';
    console.log('[minimax] raw response:', raw.substring(0, 300));
    // 過濾掉 <think>...</think> 推理標籤
    const text = raw.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    console.log('[minimax] filtered text:', text.substring(0, 200));
    res.json({ text });
  } catch (err: any) {
    console.error('[minimax] Fetch error:', err);
    res.status(500).json({ error: `伺服器錯誤: ${err.message}` });
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
