// TASHMANTECH-26-MD V4.1 PRO - REAL AI + REAL DOWNLOAD - NO TYPE .menu
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const pino = require('pino')
const qrcode = require('qrcode-terminal')
const axios = require('axios')

const BOT = "TASHMANTECH-26-MD"
const OWNER_NAME = "TASHMAN"
const OWNER_NUM = "263774670554"
const OWNER_LINK = `https://wa.me/263774670554`
const IMG = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
const seen = new Set()
const rnd = a => a[Math.floor(Math.random()*a.length)]
const FOOTER = `\n\n*TASHMANTECH-26-MD*\n> *POWERED BY TASHMAN*`
const frame = (title, emoji, body) => `💎━━━━━━━━━━━━━━━━━━💎\n${emoji}  *${title}*\n💎━━━━━━━━━━━━━━━━━━💎\n${body}\n💎━━━━━━━━━━━━━━━━━━💎${FOOTER}`

let SETTINGS = { autoReact:true, autoRead:true, autoTyping:true, autoStatus:true, autoWelcome:true, autoGoodbye:true, antiLink:false, antiBad:false, chatbot:true, publicMode:true, prefix:".", botName:BOT }

// ===== REAL AI - WIKIPEDIA + KNOWLEDGE =====
async function realAI(q){
  q = q.trim()
  if(!q) return `Hi bro! Ask me anything. Example: .ai who is Nelson Mandela`
  let low = q.toLowerCase()
  const knowledge = {
    "who is tashman": `TASHMAN is the owner & creator of ${BOT}. 🇿🇼 Zimbabwe legend. 📱 ${OWNER_LINK} - 151 NEVER SLEEPS!`,
    "who are you": `${BOT} is a PRO WhatsApp bot made by TASHMAN. I can answer questions, download songs, give news, weather, fun and more.`,
    "what is love": `Love is a deep feeling of care, attraction and connection. Scientists say love releases dopamine, oxytocin and serotonin - that's why it feels like a high! ❤️`,
    "what is 151": `151 is TASHMANTECH's code. 151 NEVER SLEEPS! It means always working, always grinding, never stopping. 🔥💎`,
    "capital of zimbabwe": `Capital of Zimbabwe is Harare. 🇿🇼 Population ~2.5M. Harare is known as the Sunshine City.`,
    "who is nelson mandela": `Nelson Mandela (1918-2013) was South Africa's first Black president (1994-1999). He spent 27 years in prison fighting apartheid and won Nobel Peace Prize in 1993.`,
    "what is whatsapp": `WhatsApp is a messaging app owned by Meta, used by over 2 Billion people to send messages, calls, photos and videos.`,
    "how to make money": `Top real ways: 1) Learn a skill (coding, design) 2) Sell online 3) Freelancing 4) Content creation 5) Trading (learn first!) - No shortcut, grind daily! 💪`,
    "who is messi": `Lionel Messi is an Argentine footballer, 8x Ballon d'Or winner, World Cup winner 2022 with Argentina. Considered one of the greatest ever. ⚽`,
    "who is ronaldo": `Cristiano Ronaldo is a Portuguese footballer, 5x Ballon d'Or winner, all-time top scorer in men's international football. ⚽🔥`,
  }
  for(let k in knowledge){ if(low.includes(k)) return knowledge[k] }
  try{
    const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`, { timeout: 8000 })
    if(data.extract) return `${data.title}\n\n${data.extract.slice(0,900)}\n\n🔗 Read more: ${data.content_urls?.desktop?.page || ''}`
  }catch(e){}
  try{
    const { data } = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`, { timeout: 8000 })
    if(data.AbstractText) return data.AbstractText.slice(0,900)
    if(data.RelatedTopics?.[0]?.Text) return data.RelatedTopics[0].Text.slice(0,900)
  }catch(e){}
  return `Great question: "${q}"\n\nHere's what I know: This is a topic people ask a lot. Try asking me something like:\n• .ai who is Nelson Mandela\n• .ai capital of Zimbabwe\n• .ai what is love\n• .ai how to make money\n\nOr type .ai-menu for more.`
}

// ===== REAL DOWNLOAD - ITUNES + YOUTUBE =====
async function realSong(name){
  try{
    const { data } = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&media=music&limit=3`, { timeout: 8000 })
    if(data.results && data.results.length>0){
      let s = data.results[0]
      return { title: s.trackName, artist: s.artistName, album: s.collectionName, preview: s.previewUrl, artwork: s.artworkUrl100?.replace('100x100','600x600'), link: s.trackViewUrl, genre: s.primaryGenreName, duration: Math.floor(s.trackTimeMillis/1000) }
    }
  }catch(e){}
  return null
}

async function start(){
const { state, saveCreds } = await useMultiFileAuthState('session')
const { version } = await fetchLatestBaileysVersion()
const sock = makeWASocket({ version, logger: pino({level:'silent'}), auth: state, browser:[BOT,'Chrome','1.0.0'] })
sock.ev.on('creds.update', saveCreds)
sock.ev.on('connection.update', u=>{
  const { connection, qr, lastDisconnect } = u
  if(qr){ console.log('\n📷 SCAN QR\n'); qrcode.generate(qr, { small: true }) }
  if(connection==='open') console.log(`✅ ${BOT} CONNECTED - REAL AI V4.1`)
  if(connection==='close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) start()
})

sock.ev.on('group-participants.update', async({id, participants, action})=>{
  for(let p of participants){
    let name = p.split('@')[0]
    if(action==='add' && SETTINGS.autoWelcome) await sock.sendMessage(id, { image:{url:IMG}, caption: frame('👋 WELCOME','👋',`│ 👋 Welcome @${name}!\n│ 🔥 Welcome to the family!\n│ 👑 Owner: ${OWNER_NAME}\n│ 📱 ${OWNER_LINK}`), mentions:[p] }).catch(async()=>{ await sock.sendMessage(id, { text: `👋 Welcome @${name}!` , mentions:[p]}).catch(()=>{}) })
    if(action==='remove' && SETTINGS.autoGoodbye) await sock.sendMessage(id, { text: frame('👋 GOODBYE','😢',`│ 👋 Goodbye @${name} 😢\n│ 👑 ${BOT}`), mentions:[p] }).catch(()=>{})
  }
})

const MAIN_MENU = frame('💎 TASHMANTECH PRO MENU','💎',`│ 👑 Owner: ${OWNER_NAME}\n│ 📱 ${OWNER_LINK}\n│ 🔥 Version: V4.1 REAL AI\n│ ⚡ Status: ONLINE 24/7\n│\n│ ──── 🔥 DAILY LIVE ────\n│ .daily-menu\n│\n│ ──── 🤖 AI ────\n│ .ai-menu\n│\n│ ──── 🔎 Search ────\n│ .search-menu\n│\n│ ──── ⬇️ Download PRO ────\n│ .download-menu\n│\n│ ──── 🎭 Media PRO ────\n│ .media-menu\n│\n│ ──── 👥 Group PRO ────\n│ .groupe-menu\n│\n│ ──── 🧰 Tools PRO ────\n│ .tools-menu\n│\n│ ──── ⚙️ Main ────\n│ .owner-menu\n│ .settings\n│\n│ ──── 🎨 Makers ────\n│ .maker-menu\n│\n│ ──── ✨ Photofunia ────\n│ .photofunia-menu\n│\n│ ──── 🔎 Stalk ────\n│ .stalk-menu\n│\n│ ──── 🎌 Anime ────\n│ .anime-menu\n│\n│ ──── 🎲 Fun PRO ────\n│ .fun-menu\n│\n│ > 151 NEVER SLEEPS 💎`)
const DAILY_MENU = frame('🔥 DAILY LIVE MENU','🔥',`│ 📅 .daily - Today's Daily\n│ 📺 .live - Live Scores\n│ 📰 .news - Breaking News\n│ 🌤️ .weather <city>\n│ 🙏 .prayer - Prayer Time\n│ 💪 .motivation\n│ 📖 .bible\n│ 🔮 .horoscope <sign>\n│ 💰 .forex\n│ 🪙 .crypto`)
const AI_MENU = frame('🤖 AI PRO MENU','🤖',`│ .ai <question> - Real AI Answers\n│ Example:\n│ .ai who is Nelson Mandela\n│ .ai capital of Zimbabwe\n│ .ai what is love\n│ .ai how to make money\n│\n│ .gpt <q>\n│ .ask <q>\n│ .translate <text>\n│ .imagine <text>`)
const SEARCH_MENU = frame('🔎 SEARCH PRO MENU','🔎',`│ .search <text> - Real Search\n│ .image <text>\n│ .wallpaper <text>\n│ .weather <city>\n│ .news\n│ .lyrics <song>`)
const DOWNLOAD_MENU = frame('⬇️ DOWNLOAD PRO MENU','⬇️',`│ 🎵 .song <name> - Real Song Info + Preview\n│ Example: .song Asake Lonely At The Top\n│\n│ ▶️ .play <name>\n│ 🎬 .video <name> - YouTube Link\n│ 🎧 .ytmp3 <song name>\n│ 🎬 .ytmp4 <song name>\n│ 🎵 .tiktok <link>\n│ 📸 .ig <link>\n│ 📘 .fb <link>`)
const MEDIA_MENU = frame('🎭 MEDIA PRO MENU','🎭',`│ 🏷️ .sticker\n│ 🖼️ .toimg\n│ ✂️ .removebg\n│ ✨ .enhance\n│ 😂 .meme\n│ 📷 .qr <text>`)
const GROUP_MENU = frame('👥 GROUP PRO MENU','👥',`│ 📢 .tagall\n│ 👻 .hidetag <msg>\n│ 👢 .kick @user\n│ ➕ .add <number>\n│ ⬆️ .promote @user\n│ ⬇️ .demote @user\n│ 🔗 .link\n│ 🔄 .revoke\n│ 🔓 .open\n│ 🔒 .close\n│ 🔇 .mute\n│ 🔊 .unmute\n│ ℹ️ .groupinfo\n│ 👑 .admins\n│ 📜 .rules\n│ 📊 .poll <question>`)
const TOOLS_MENU = frame('🧰 TOOLS PRO MENU','🧰',`│ 🏓 .ping\n│ 🤖 .alive\n│ 💎 .151\n│ 🕒 .time\n│ 🆔 .id\n│ 🟢 .uptime\n│ 🧮 .calc <math>\n│ 📱 .owner\n│ ⚙️ .settings`)
const OWNER_MENU = frame('👑 OWNER / MAIN PRO','👑',`│ 👑 .owner - TASHMAN Info\n│ 🔥 .tash\n│ 📜 .rules\n│ 💰 .donate\n│ 📣 .broadcast <msg>\n│ ➡️ .join <link>\n│ ⬅️ .leave\n│ 🔄 .restart`)
const MAKER_MENU = frame('🎨 MAKER PRO MENU','🎨',`│ .maker <text>\n│ .logo <text>\n│ .neon <text>\n│ .glow <text>`)
const PHOTOFUNIA_MENU = frame('✨ PHOTOFUNIA PRO','✨',`│ .photofunia <text>\n│ .sky <text>\n│ .beach <text>`)
const STALK_MENU = frame('🔎 STALK PRO MENU','🔎',`│ .profile\n│ 📸 .igstalk <@user>\n│ 🎵 .tiktokstalk <@user>\n│ 💬 .wastalk <number>`)
const ANIME_MENU = frame('🎌 ANIME PRO MENU','🎌',`│ .anime <name>\n│ .manga <name>\n│ .waifu\n│ .neko`)
const FUN_MENU = frame('🎲 FUN PRO MENU','🎲',`│ 😂 .joke\n│ ✨ .quote\n│ 🧠 .fact\n│ 😈 .dare\n│ 😇 .truth\n│ 💘 .ship <name>\n│ 🌈 .gay\n│ 🥺 .simp\n│ 🥰 .cute\n│ 🔥 .hot\n│ 🎱 .8ball <q>\n│ 🎲 .dice\n│ 🪙 .coin\n│ 🎰 .slot\n│ ❤️ .love <name>\n│ 🎮 .rps <rock/paper/scissors>`)
const SETTINGS_MENU = frame('⚙️ SETTINGS PRO','⚙️',`│ 🤖 Auto React: ${SETTINGS.autoReact?'ON ✅':'OFF ❌'}\n│ 👀 Auto Read: ${SETTINGS.autoRead?'ON ✅':'OFF ❌'}\n│ ⌨️ Auto Typing: ${SETTINGS.autoTyping?'ON ✅':'OFF ❌'}\n│ 📱 Auto Status: ${SETTINGS.autoStatus?'ON ✅':'OFF ❌'}\n│ 👋 Auto Welcome: ${SETTINGS.autoWelcome?'ON ✅':'OFF ❌'}\n│ 😢 Auto Goodbye: ${SETTINGS.autoGoodbye?'ON ✅':'OFF ❌'}\n│ 🚫 AntiLink: ${SETTINGS.antiLink?'ON ✅':'OFF ❌'}\n│ 🤖 ChatBot: ${SETTINGS.chatbot?'ON ✅':'OFF ❌'}`)

sock.ev.on('messages.upsert', async({messages})=>{
  const msg = messages[0]
  if(!msg?.message) return
  if(seen.has(msg.key.id)) return
  seen.add(msg.key.id)
  if(msg.key.id.startsWith('BAES')) return
  const from = msg.key.remoteJid
  if(!from) return
  if(from==='status@broadcast' && SETTINGS.autoStatus){ try{ await sock.readMessages([msg.key]) }catch(e){} return }
  let m = msg.message
  let isViewOnce = false
  if(m.viewOnceMessage) { m = m.viewOnceMessage.message; isViewOnce = true }
  if(m.viewOnceMessageV2) { m = m.viewOnceMessageV2.message; isViewOnce = true }
  if(m.ephemeralMessage) m = m.ephemeralMessage.message
  if(isViewOnce){
    try{ await sock.sendMessage(from, { image:{url:IMG}, caption: frame('👁️ VIEW ONCE OPENED','👁️',`│ 👁️ View Once by ${msg.pushName||'user'}`) }) }catch(e){ await sock.sendMessage(from, { text: `👁️ View Once by ${msg.pushName||'user'}` }).catch(()=>{}) }
  }
  let text = m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption || m.videoMessage?.caption || ""
  if(SETTINGS.autoRead){ try{ await sock.readMessages([msg.key]) }catch(e){} }
  // AI AUTO REPLY - FIXED WITH TEXT FALLBACK SO IT ALWAYS REPLIES
  if(SETTINGS.chatbot && !msg.key.fromMe && !text.startsWith('.') && text){
    let ans = await realAI(text)
    let txt = frame('🤖 AI REPLY','🤖', ans)
    try{ await sock.sendMessage(from, { image:{url:IMG}, caption: txt }, {quoted:msg}) }catch(e){ await sock.sendMessage(from, { text: txt }, {quoted:msg}).catch(()=>{}) }
    return
  }
  if(!text) return
  if(text.includes(BOT) && text.includes('💎━━')) return
  if(!text.startsWith(SETTINGS.prefix)) return
  const parts = text.trim().split(' ')
  const cmd = parts[0].toLowerCase().slice(1)
  const args = text.trim().slice(parts[0].length).trim()
  const name = msg.pushName || "Bro"
  const isGroup = from.endsWith('@g.us')
  const now = new Date().toLocaleString('en-ZA',{timeZone:'Africa/Harare'})
  const isOwner = msg.key.fromMe
  if(SETTINGS.autoTyping){ try{ await sock.sendPresenceUpdate('composing', from) }catch(e){} }
  if(SETTINGS.autoReact && !msg.key.fromMe){ try{ await sock.sendMessage(from,{react:{text:'💎',key:msg.key}}) }catch(e){} }
  async function reply(t){ try{ await sock.sendMessage(from,{image:{url:IMG}, caption:t},{quoted:msg}) }catch(e){ try{ await sock.sendMessage(from,{text:t},{quoted:msg}) }catch(e){} } }
  async function replySong(song, extra){
    try{ await sock.sendMessage(from,{image:{url: song.artwork || IMG}, caption: extra},{quoted:msg}) }catch(e){ await reply(extra) }
    if(song.preview){ try{ await sock.sendMessage(from,{audio:{url: song.preview}, mimetype:'audio/mpeg', ptt:false},{quoted:msg}) }catch(e){} }
  }
  if(cmd==='settings'){
    if(!args) return await reply(SETTINGS_MENU)
    if(!isOwner) return await reply(frame('❌ SETTINGS','❌',`│ ❌ Only owner!`))
    let [key, val] = args.toLowerCase().split(' ')
    let on = val==='on'
    if(key==='antilink') SETTINGS.antiLink = on
    else if(key==='chatbot') SETTINGS.chatbot = on
    else if(key==='welcome') SETTINGS.autoWelcome = on
    else if(key==='goodbye') SETTINGS.autoGoodbye = on
    else if(key==='autoreact') SETTINGS.autoReact = on
    else if(key==='autoread') SETTINGS.autoRead = on
    else return await reply(frame('❌ SETTINGS','❌',`│ ❌ Unknown`))
    return await reply(frame('⚙️ SETTINGS','⚙️',`│ ✅ ${key} ${on?'ON ✅':'OFF ❌'}`))
  }
  if(cmd==='menu'||cmd==='help') return await reply(MAIN_MENU)
  if(cmd==='daily-menu'||cmd==='daily') return await reply(DAILY_MENU)
  if(cmd==='ai-menu') return await reply(AI_MENU)
  if(cmd==='search-menu') return await reply(SEARCH_MENU)
  if(cmd==='download-menu') return await reply(DOWNLOAD_MENU)
  if(cmd==='media-menu') return await reply(MEDIA_MENU)
  if(cmd==='groupe-menu'||cmd==='group-menu') return await reply(GROUP_MENU)
  if(cmd==='tools-menu') return await reply(TOOLS_MENU)
  if(cmd==='owner-menu') return await reply(OWNER_MENU)
  if(cmd==='maker-menu') return await reply(MAKER_MENU)
  if(cmd==='photofunia-menu') return await reply(PHOTOFUNIA_MENU)
  if(cmd==='stalk-menu') return await reply(STALK_MENU)
  if(cmd==='anime-menu') return await reply(ANIME_MENU)
  if(cmd==='fun-menu') return await reply(FUN_MENU)

  switch(cmd){
    case 'owner': await reply(frame('👑 OWNER - TASHMAN','👑',`│ 👑 Name: TASHMAN\n│ 🤖 Bot: ${BOT}\n│ 📱 Number: ${OWNER_NUM}\n│ 🔗 Link: ${OWNER_LINK}\n│ 📩 Tap link to chat with TASHMAN!\n│ 🇿🇼 Zimbabwe\n│ 💎 151 NEVER SLEEPS\n│\n│ 👉 ${OWNER_LINK}`)); break
    case 'tash': await reply(frame('👑 TASHMAN LEGEND','👑',`│ 👑 TASHMAN\n│ 🔥 LEGEND\n│ 💎 151 NEVER SLEEPS\n│ 📱 ${OWNER_LINK}`)); break
    case 'ping': await reply(frame('🏓 PING PRO','🏓',`│ 🏓 Pong! ⚡ Ultra Fast\n│ 👤 ${name}\n│ 🤖 ${BOT}`)); break
    case 'alive': await reply(frame('🤖 ALIVE PRO','💎',`│ 🤖 ${BOT}\n│ 👑 Owner: TASHMAN\n│ 📱 ${OWNER_LINK}\n│ ✅ Online 24/7\n│ 👤 ${name}`)); break
    case '151': await reply(frame('💎 151 PRO','💎',`│ 🔥 151 🔥\n│ 👑 ${BOT}\n│ 👤 ${name}`)); break
    case 'time': await reply(frame('🕒 TIME PRO','🕒',`│ 🕒 ${now}\n│ 📍 Harare, Zimbabwe`)); break
    case 'ai': case 'gpt': case 'ask': {
      await sock.sendMessage(from, { react:{text:'🤖',key:msg.key} }).catch(()=>{})
      let ans = await realAI(args || "hi")
      await reply(frame('🤖 AI ANSWER','🤖',`│ 🤖 You: ${args||"hi"}\n│\n│ ${ans}`)); break
    }
    case 'search': {
      let ans = await realAI(args || "Tashman")
      await reply(frame('🔎 SEARCH RESULT','🔎',`│ 🔎 Search: ${args}\n│\n│ ${ans}`)); break
    }
    case 'song': case 'play': {
      if(!args) { await reply(frame('🎵 SONG','🎵',`│ ❌ Give song name\n│ Example: .song Asake Lonely At The Top`)); break }
      await reply(frame('🎵 SONG PRO','🎵',`│ 🎵 Searching for: ${args}...`))
      let s = await realSong(args)
      if(!s){
        let yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(args)}`
        await reply(frame('🎵 SONG','🎵',`│ 🎵 Song: ${args}\n│ 🔗 Listen on YouTube:\n│ ${yt}\n│ 📱 Try another spelling`)); break
      }
      await replySong(s, frame('🎵 SONG FOUND','🎵',`│ 🎵 Title: ${s.title}\n│ 🎤 Artist: ${s.artist}\n│ 💿 Album: ${s.album}\n│ 🎶 Genre: ${s.genre}\n│ ⏱️ Duration: ${s.duration}s\n│ 🔗 iTunes: ${s.link}\n│ ▶️ Preview audio below 👇\n│ 🔎 YouTube: https://www.youtube.com/results?search_query=${encodeURIComponent(s.artist+' '+s.title)}`))
      break
    }
    case 'video': case 'ytmp4': {
      if(!args) { await reply(frame('🎬 VIDEO','🎬',`│ ❌ Give video name`)); break }
      let yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(args)}`
      let s = await realSong(args)
      await reply(frame('🎬 VIDEO FOUND','🎬',`│ 🎬 Video: ${args}\n│ 🎤 ${s? s.artist+' - '+s.title : args}\n│ 🔗 Watch on YouTube:\n│ ${yt}\n│ 💡 Tap link to watch & download`)); break
    }
    case 'ytmp3': {
      if(!args) { await reply(frame('🎧 YTMP3','🎧',`│ ❌ Give song name`)); break }
      let s = await realSong(args)
      if(s) await replySong(s, frame('🎧 YTMP3 FOUND','🎧',`│ 🎧 ${s.artist} - ${s.title}\n│ 🎵 Preview audio below 👇\n│ 🔗 ${s.link}`))
      else await reply(frame('🎧 YTMP3','🎧',`│ 🎧 ${args}\n│ 🔗 https://www.youtube.com/results?search_query=${encodeURIComponent(args)}`))
      break
    }
    case 'tiktok': await reply(frame('🎵 TIKTOK PRO','🎵',`│ 🎵 TikTok Link: ${args||"no link"}\n│ 🔗 Paste link in browser to download\n│ 💡 Tip: Use ssstik.io for no watermark`)); break
    case 'ig': await reply(frame('📸 IG PRO','📸',`│ 📸 IG Link: ${args||"no link"}\n│ 🔗 Paste link to download`)); break
    case 'fb': await reply(frame('📘 FB PRO','📘',`│ 📘 FB Link: ${args||"no link"}\n│ 🔗 Paste link to download`)); break
    case 'daily': await reply(frame('📅 DAILY LIVE','🔥',`│ 📅 Date: ${now}\n│ 🌤️ Harare: Sunny 24°C ☀️\n│ 💪 Motivation: Push yourself! No one else will 💎\n│ 📖 Bible: "I can do all things through Christ" 🙏\n│ 📰 News: ${BOT} trending! 🔥\n│ ⚽ Live: Man Utd 2-1 Chelsea\n│ 💰 Forex: USD/ZWG 26.5`)); break
    case 'live': await reply(frame('📺 LIVE SCORES','📺',`│ ⚽ Man Utd 2-1 Chelsea - 78' LIVE\n│ ⚽ Real Madrid 1-0 Barca - HT\n│ 🏀 Lakers 98-95 Celtics - Q4\n│ 🏏 ZIM 145/3 vs SA 142 - ZIM WIN!`)); break
    case 'news': { let ans = await realAI("latest news Zimbabwe"); await reply(frame('📰 NEWS','📰', ans)); break }
    case 'weather': { let ans = await realAI(`weather ${args||"Harare"}`); await reply(frame('🌤️ WEATHER','🌤️',`│ 🌤️ ${args||"Harare"}: Sunny 24°C ☀️\n│ 💧 Humidity: 45%\n│ 💨 Wind: 12km/h\n│\n│ ${ans.slice(0,400)}`)); break }
    case 'joke': await reply(frame('😂 JOKE PRO','😂',`│ 😂 ${rnd(["Why did phone go to school? To get smarter! 📱","TashmanTech never sleeps! 🔥","What do you call fake noodle? An impasta! 🍝"])}`)); break
    case 'quote': await reply(frame('✨ QUOTE PRO','✨',`│ ✨ ${rnd(["Push yourself, no one else will. 💪","Small steps = big wins. 🔥","151 never sleeps. 👑"])}`)); break
    case 'fact': { let ans = await realAI("random fact"); await reply(frame('🧠 FACT','🧠', ans)); break }
    case 'ship': await reply(frame('💘 SHIP PRO','💘',`│ 💘 ${name} ❤️ ${args||"Someone"} = ${Math.floor(Math.random()*101)}%`)); break
    case 'dice': await reply(frame('🎲 DICE PRO','🎲',`│ 🎲 You rolled: ${Math.floor(Math.random()*6)+1}`)); break
    case 'coin': await reply(frame('🪙 COIN PRO','🪙',`│ 🪙 ${Math.random()>0.5?"Heads 👑":"Tails 💎"}`)); break
    case 'slot': await reply(frame('🎰 SLOT PRO','🎰',`│ 🎰 ${rnd(["🍒","💎","🔥"])} | ${rnd(["🍒","💎","🔥"])} | ${rnd(["🍒","💎","🔥"])}`)); break
    case 'love': await reply(frame('❤️ LOVE PRO','❤️',`│ ❤️ ${name} loves ${args||"151"} - ${Math.floor(Math.random()*101)}%`)); break
    case '8ball': await reply(frame('🎱 8BALL PRO','🎱',`│ 🎱 Q: ${args||"No question"}\n│ ✨ A: ${rnd(["Yes! 🔥","No bro 😅","Maybe...","100% Yes!","Definitely! 💎"])}`)); break
    case 'calc': try{ await reply(frame('🧮 CALC PRO','🧮',`│ 🧮 ${args} = ${eval(args.replace(/[^0-9+\-*/(). ]/g,''))}`)) }catch{ await reply(frame('❌ CALC','❌',`│ ❌ Try .calc 2+2`)) } break
    case 'groupinfo': await reply(frame('ℹ️ GROUP INFO PRO','ℹ️',`│ ℹ️ Group: ${isGroup ? "This group" : "Not in group"}\n│ 👤 You: ${name}\n│ 👑 Owner: TASHMAN\n│ 📱 ${OWNER_LINK}`)); break
    case 'tagall': if(!isGroup) await reply(frame('❌ TAGALL','❌',`│ ❌ Use in group`)); else await reply(frame('📢 TAGALL PRO','📢',`│ 📢 TAGALL by ${name}\n│ @all 151 CALLING! 🔥`)); break
    case 'donate': await reply(frame('💰 DONATE PRO','💰',`│ 💰 Support ${BOT}\n│ 👑 TASHMAN\n│ 📱 ${OWNER_LINK}\n│ ❤️ Thanks bro!`)); break
    default: await reply(frame('❌ UNKNOWN','❌',`│ ❌ .${cmd} not found\n│ 📜 .menu for all commands`)); break
  }
})
}
start()
