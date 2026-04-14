const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ★ Renderから取得（ここ重要）
const TOKEN = process.env.TOKEN;
const API_URL = process.env.API_URL;

client.on('ready', () => {
  console.log(`ログイン成功: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/\s+/);

  // =====================
  // BUY
  // =====================
  if (args[0] === "$buy") {
    if (args.length < 3) {
      return message.reply("使い方: $buy 銘柄 数量");
    }

    const stock = args[1];
    const amount = Number(args[2]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("数量がおかしい");
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: message.author.id,
          stock: stock,
          amount: amount,
          action: "buy"
        })
      });

      const data = await res.json();
      message.reply(data.result || data.error);

    } catch (err) {
      message.reply("エラー発生");
      console.error(err);
    }
  }

  // =====================
  // SELL
  // =====================
  if (args[0] === "$sell") {
    if (args.length < 3) {
      return message.reply("使い方: $sell 銘柄 数量");
    }

    const stock = args[1];
    const amount = Number(args[2]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("数量がおかしい");
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: message.author.id,
          stock: stock,
          amount: amount,
          action: "sell"
        })
      });

      const data = await res.json();
      message.reply(data.result || data.error);

    } catch (err) {
      message.reply("エラー発生");
      console.error(err);
    }
  }
  
// =====================
  // １$balance
  // =====================
if (args[0] === "$balance") {
  const res = await fetch(`${API_URL}?type=balance&user=${message.author.id}`);
  const text = await res.text();
  message.reply(text);
}

  // =====================
  // ２$price
  // =====================
  if (args[0] === "$price") {
  const stock = args[1];

  const res = await fetch(`${API_URL}?type=price&stock=${stock}`);
  const text = await res.text();
  message.reply(text);
}

  // =====================
  // ２$ranking
  // =====================
  if (args[0] === "$ranking") {
  const res = await fetch(`${API_URL}?type=ranking`);
  const text = await res.text();
  message.reply(text);
}
  
});

client.login(TOKEN);
