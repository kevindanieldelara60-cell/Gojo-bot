import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"

const OWNER = "5493757328010@s.whatsapp.net"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    browser: ["GojoBot", "Chrome", "1.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update

    if (connection === "open") {
      console.log("✅ BOT CONECTADO")
    }

    if (connection === "close") {
      console.log("❌ Reconectando...")
      startBot()
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const isGroup = from.endsWith("@g.us")
    const sender = isGroup ? msg.key.participant : from

    if (sender !== OWNER) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (text === ".menu") {
      await sock.sendMessage(from, {
        text: `𓂀 𝙂𝙊𝙅𝙊 𝘽𝙊𝙏 𓂀

╭─❖ COMANDOS ❖─╮
• .menu → ver comandos
• .info → info del bot
• .ping → responde
╰──────────────╯`
      })
    }

    if (text === ".info") {
      await sock.sendMessage(from, {
        text: `𓂀 INFO 𓂀

Bot de Satoru
Creado por Kevin
+54 9 3757328010`
      })
    }

    if (text === ".ping") {
      await sock.sendMessage(from, { text: "🏓 Pong" })
    }
  })
}

startBot()
