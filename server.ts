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

const MINIMAX_SYSTEM_PROMPT = `你是一個擅長跨域共作的資傳學生，擅長把不同領域與資訊傳播的設計/科技整合，有這些領域，網頁開發，3D 建模與動畫，互動藝術與視覺特效，影視製作與敘事，使用者體驗與設計，新興科技，創造可能性。請你發想一段30字左右的文案，說明資傳所學如何結合，如何共創，可以以「我們可以一起」為開頭，寫一段文字，可以不只用我們可以也可以自行發想。回覆的時候，只需要給我這段文字就好，不要有其他廢話，如果可以可以有趣一點或者跟時事有關，並說明做法和鼓勵輸入者加入。如果你發現這個專長不是傳統定義上的，或是不雅，或是有犯罪疑慮，請用幽默的語氣說我不會。不要使用<think>標籤，直接回覆文案內容。`;

const BLOCKED_KEYWORDS = [
  '殺人', '殺手', '謀殺', '販毒', '吸毒', '毒品', '強姦', '強暴', '性侵',
  '搶劫', '綁架', '詐騙', '詐欺', '洗錢', '賭博', '走私', '恐怖', '炸彈',
  '槍擊', '縱火', '自殺', '援交', '嫖', '賣淫', '色情', '幹你', '操你',
  '他媽', '垃圾', '廢物', '白癡', '智障', '死', '滾',
];
const REJECTION_MESSAGES = [
  '欸⋯⋯這個訊號好像有點危險，我的天線自動收起來了。',
  '偵測到異常頻率⋯⋯這條線路我不敢接，換一個吧！',
  '嗯⋯⋯我的神經元告訴我，這個連結還是不要建立比較好。',
  '訊號異常！這個專長超出了我的安全範圍，試試別的？',
];

function isBlocked(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  for (const kw of BLOCKED_KEYWORDS) {
    if (normalized.includes(kw)) {
      return REJECTION_MESSAGES[Math.floor(Math.random() * REJECTION_MESSAGES.length)];
    }
  }
  return null;
}

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

  // 前置過濾：攔截明顯不當輸入
  const blockedMsg = isBlocked(specialty);
  if (blockedMsg) {
    return res.json({ text: blockedMsg, rejected: true });
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
          { role: 'system', content: MINIMAX_SYSTEM_PROMPT },
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
    // 過濾掉 <think>...</think> 推理標籤
    const text = raw.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    // 偵測 AI 是否拒絕了這個輸入（prompt 指示用「我不會」拒絕）
    const rejected = /我不會/.test(text);
    res.json({ text, rejected });
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
