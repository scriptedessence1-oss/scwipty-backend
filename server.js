import express from "express";
import fetch from "node-fetch";
import cors from "cors";
console.log("CLIENT_SECRET loaded:", !!process.env.CLIENT_SECRET);
app.get("/bot/guilds", async (req, res) => {
  try {
    const botGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` }
    }).then(r => r.json());

    res.json(botGuilds);
  } catch (err) {
    console.error("Bot guild fetch error:", err);
    res.status(500).json({ error: "Failed to fetch bot guilds" });
  }
});

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = "1446556255312150568";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://scwipty.netlify.app/servers.html";

app.get("/auth/discord", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const data = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    });

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });

    const json = await response.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "Token exchange failed" });
  }
});

app.listen(3000, () => console.log("Scwipty backend running"));
