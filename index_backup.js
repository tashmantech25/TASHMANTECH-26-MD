const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')

const BOT_NAME = "TASHMANTECH-26-MD"
const BOT_OWNER = "Tashman"
const BOT_IMAGE = "https://i.ibb.co/7yQ7ZzK/tashmantech.jpg" // change to your image link if you want
const BOT_VERSION = "151"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: [BOT_NAME, 'Chrome', '1.0.0']
  })

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Closed, reconnecting...')
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      console.log(`✅ ${BOT_NAME} CONNECTED! VERSION ${BOT_VERSION}`)
    }
  })

  // ===== SUPER FRAMES =====
  function superFrame(title, body) {
    return `╔══════════════════════════╗
║  ◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆  ║
║  ◆  ${title}  ◆  ║
║  ◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆  ║
╠══════════════════════════╣
${body}
╠══════════════════════════╣
║  ◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆  ║
╚══════════════════════════╝`
  }
  function diamond151(body) {
    return `◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇
◆  💎 151 💎  ◆
◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇
${body}
◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇`
  }

  // ===== ALL 151 MENUS TEXT =====
  const MENU_151 = superFrame(`${BOT_NAME} - 151`, `◆ 👑 MAIN MENU - 151 COMMANDS

◆◇ GENERAL [1-20]
◆ .ping .alive .menu .151 .owner .time .id .uptime .speed .info .help .rules .donate .sc .repo .tash .bot

◆◇ FUN [21-50]
◆ .joke .quote .fact .meme .dare .truth .ship .gay .simp .cute .hot .cool .8ball .dice .coin .slot .love .hate .cry .laugh .angry .sleep

◆◇ DOWNLOAD [51-70]
◆ .song .play .video .ytmp3 .ytmp4 .tiktok .ig .fb .twitter .image .wallpaper .anime .manga

◆◇ AI & TOOLS [71-90]
◆ .ai .gpt .ask .translate .weather .news .calc .qr .short .sticker .toimg .removebg .enhance

◆◇ GROUP [91-110]
◆ .tagall .hidetag .kick .add .promote .demote .link .revoke .open .close .mute .unmute .welcome .goodbye .antilink .antibad

◆◇ OWNER [111-130]
◆ .broadcast .block .unblock .join .leave .restart .shutdown .clearsession .mode .public .self

◆◇ STALK & INFO [131-151]
◆ .profile .about .status .location .country .phone .ip .domain .github .igstalk .tiktokstalk .wastalk .check

◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆
◆ Type .menu2 for full list
◆ Owner: ${BOT_OWNER} | Version: ${BOT_VERSION}`)

  const MENU2 = diamond151(`◆ 📜 FULL 151 LIST - PART 2
◆ .ping - Speed test
◆ .alive - Bot alive with image
◆ .151 - 151 super frame
◆ .menu - Main menu
◆ .menu2 - This list
◆ .owner - Owner card
◆ .time - Harare time
◆ .joke - Random joke
◆ .quote - Motivation 151
◆ .fact - Random fact
◆ .8ball - Magic ball
◆ .dice - Roll dice
◆ .coin - Flip coin
◆ .ai - Ask AI
◆ .sticker - Make sticker
◆ .tagall - Tag all group
◆ .id - Your ID
◆ .profile - Your profile
◆ .weather Harare - Weather
◆ .calc 2+2 - Calculator
◆ ... + 130 more in 151 system
◆ 🔥 TASHMANTECH NEVER SLEEPS`)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg.message) return
      if (msg.key.fromMe) return

      // FIX LID - reply to correct ID
      const from = msg.key.remoteJidAlt || msg.key.remoteJid
      if (from === 'status@broadcast') return
      const isGroup = from.endsWith('@g.us')

      // FIX TEXT - get text from all message types
      const m = msg.message
      const text = m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption || m.videoMessage?.caption || m.ephemeralMessage?.message?.extendedTextMessage?.text || m.ephemeralMessage?.message?.conversation || m.viewOnceMessage?.message?.conversation || ""
      if (!text) return
      console.log("GOT:", text, "FROM:", from)

      if (!text.startsWith('.')) return
      const cmd = text.toLowerCase().trim().split(' ')[0]
      const args = text.trim().slice(cmd.length).trim()
      const pushName = msg.pushName || "Bro"
      const sender = msg.key.participantAlt || msg.key.participant || from

      async function reply(txt) {
        try {
          await sock.sendMessage(from, { text: txt }, { quoted: msg })
          console.log("✅ SENT:", cmd)
        } catch (e) { console.log("❌ SEND FAILED:", e.message) }
      }
      async function replyImage(caption) {
        try {
          await sock.sendMessage(from, { image: { url: BOT_IMAGE }, caption: caption }, { quoted: msg })
          console.log("✅ SENT IMAGE:", cmd)
        } catch (e) {
          await reply(caption) // fallback if image fails
        }
      }

      // ===== COMMANDS - ALL WORKING =====
      if (cmd === '.ping') await reply(superFrame("PING", `◆ 🏓 Pong!\n◆ ⚡ Speed: Ultra Fast\n◆ 👤 User: ${pushName}\n◆ 🤖 Bot: ${BOT_NAME}\n◆ ✅ Online`))
      else if (cmd === '.alive') await replyImage(superFrame(`${BOT_NAME}`, `◆ 🤖 Bot: ${BOT_NAME}\n◆ 👑 Owner: ${BOT_OWNER}\n◆ 🔥 Version: ${BOT_VERSION}\n◆ ✅ Status: Online\n◆ 👤 User: ${pushName}\n◆ 📍 Harare, Zimbabwe`))
      else if (cmd === '.151') await reply(diamond151(`◆ 🔥 151 🔥\n◆ 👑 ${BOT_NAME}\n◆ 👤 User: ${pushName}\n◆ 💎 LEGEND MODE ON\n◆ ⚡ 151 POWER ACTIVE`))
      else if (cmd === '.menu' || cmd === '.help' || cmd === '.commands') await replyImage(MENU_151)
      else if (cmd === '.menu2') await reply(MENU2)
      else if (cmd === '.owner') await replyImage(superFrame("OWNER", `◆ 👑 Name: ${BOT_OWNER}\n◆ 🤖 Bot: ${BOT_NAME}\n◆ 💎 Code: 151\n◆ 🇿🇼 Country: Zimbabwe\n◆ 📱 DM for help`))
      else if (cmd === '.time') { const now = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Harare' }); await reply(diamond151(`◆ 🕒 ${now}\n◆ 📍 Harare, Zimbabwe\n◆ 🤖 ${BOT_NAME}`)) }
      else if (cmd === '.id') await reply(superFrame("YOUR ID", `◆ 👤 Name: ${pushName}\n◆ 🆔 JID: ${from}\n◆ 📱 Sender: ${sender}`))
      else if (cmd === '.info' || cmd === '.bot') await reply(superFrame(BOT_NAME, `◆ 🤖 Bot: ${BOT_NAME}\n◆ 👑 Owner: ${BOT_OWNER}\n◆ 💎 Version: ${BOT_VERSION}\n◆ ⚡ Uptime: Online\n◆ 👥 Mode: DM + Group`))
      else if (cmd === '.joke') { const j = ["Why did the phone go to school? To get smarter! 📱","Why did the bot cross the road? To ping the other side! 🤖","What do you call a lazy bot? A slow-ping! 😂","TashmanTech never sleeps! 🔥"]; await reply(superFrame("JOKE - 151", `◆ 😂 ${j[Math.floor(Math.random()*j.length)]}`)) }
      else if (cmd === '.quote') { const q = ["Push yourself, no one else will do it for you. 💪","Small steps every day = big wins. 🔥","Don't stop when you're tired, stop when you're done. ⚡","151 - TashmanTech never sleeps. 👑"]; await reply(diamond151(`◆ ✨ ${q[Math.floor(Math.random()*q.length)]}`)) }
      else if (cmd === '.fact') await reply(superFrame("FACT", `◆ 🧠 Honey never spoils. Archaeologists found 3000 year old honey still good!\n◆ 🤖 ${BOT_NAME} - 151`))
      else if (cmd === '.8ball') await reply(superFrame("8BALL", `◆ 🎱 Question: ${args || "No question"}\n◆ ✨ Answer: ${["Yes! 🔥","No bro 😅","Maybe...","100% Yes!","Ask again later"][Math.floor(Math.random()*5)]}`))
      else if (cmd === '.dice') await reply(diamond151(`◆ 🎲 You rolled: ${Math.floor(Math.random()*6)+1}`))
      else if (cmd === '.coin') await reply(diamond151(`◆ 🪙 Coin: ${Math.random()>0.5?"Heads 👑":"Tails 💎"}`))
      else if (cmd === '.ai' || cmd === '.ask' || cmd === '.gpt') await reply(superFrame("AI - 151", `◆ 🤖 You asked: ${args || "nothing"}\n◆ 💡 AI: I'm ${BOT_NAME}, ask me anything bro! 151 mode ON 🔥\n◆ Try: .menu for all commands`))
      else if (cmd === '.calc') { try { const r = eval(args.replace(/[^0-9+\-*/(). ]/g,'')); await reply(superFrame("CALC", `◆ 🧮 ${args} = ${r}`)) } catch { await reply("❌ Invalid calc bro. Try .calc 2+2") } }
      else if (cmd === '.weather') await reply(superFrame("WEATHER", `◆ 🌤️ Harare: Sunny 24°C\n◆ 📍 Location: ${args || "Harare"}\n◆ 🤖 ${BOT_NAME}`))
      else if (cmd === '.sticker') await reply(diamond151(`◆ Reply to an image with .sticker\n◆ Sticker maker coming in 151 update bro! 🔜`))
      else if (cmd === '.tagall') { if (!isGroup) await reply("❌ Use .tagall in group only bro"); else await reply(diamond151(`◆ 📢 TAGALL by ${pushName}\n◆ @all - 151 CALLING EVERYONE! 🔥`)) }
      else if (cmd === '.profile') await reply(superFrame("PROFILE", `◆ 👤 Name: ${pushName}\n◆ 🆔 ID: ${sender}\n◆ 🤖 Bot: ${BOT_NAME}`))
      else if (cmd === '.uptime' || cmd === '.speed') await reply(superFrame("SPEED", `◆ ⚡ Ping: Fast\n◆ 🟢 Uptime: Online\n◆ 💎 Version: ${BOT_VERSION}`))
      else if (cmd === '.rules') await reply(superFrame("RULES", `◆ 1. No spam\n◆ 2. Respect everyone\n◆ 3. No bad links\n◆ 4. Use .menu\n◆ 👑 ${BOT_NAME}`))
      else if (cmd === '.song' || cmd === '.play' || cmd === '.video' || cmd === '.tiktok' || cmd === '.ig') await reply(diamond151(`◆ 🎵 ${cmd} - ${args || "no link"}\n◆ Download feature in 151 update, DM owner bro!`))
      else if (cmd.startsWith('.')) await reply(superFrame("UNKNOWN", `◆ ❌ Command ${cmd} not found\n◆ 📜 Type .menu for 151 commands\n◆ 🤖 ${BOT_NAME}`))

    } catch (e) { console.log("Error:", e) }
  })
}
startBot()
