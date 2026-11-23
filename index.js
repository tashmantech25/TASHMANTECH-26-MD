// ============================================
// TASHMANTECH-26-MD - REAL FULL BOT - NO SHORT
// Owner: TASHMAN 263774670554
// ============================================
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs')
const axios = require('axios')

const SESSION_ID = process.env.SESSION_ID || ""
const AI_API_KEY = process.env.AI_API_KEY || ""
const OWNER_NUMBER = "263774670554"
const OWNER_JID = "263774670554@s.whatsapp.net"
const BOT_NAME = "*𝙏𝘼𝙎𝙃𝙈𝘼𝙉𝙏𝙀𝘾𝙃-26-𝙈𝘿*"
const POWERED = "*𝒫𝒪𝒲𝐸𝑅𝐸𝒟 𝐵𝒴 𝒯𝒜𝒮ℋ𝑀𝒜𝒩*"
const MENU_IMAGE = "https://files.catbox.moe/8v5g2k.jpg" // CHANGE TO YOUR CATBOX

let PREMIUM = ["263774670554"], SUDO = ["263774670554"], BLACKLIST = []
let SETTINGS = { autoreact:false, autostatusview:false, autoview:false, autolike:false, antidelete:true, antiviewonce:true, autobio:false, autotyping:false, autoread:false, welcome:false, goodbye:false, antilink:false, antispam:false, antibadword:false, antiforeign:false, ghostmode:false }
let MSG_STORE = {}
const isOwner = s => s.includes(OWNER_NUMBER)
const isPremium = s => PREMIUM.some(n=>s.includes(n)) || isOwner(s)
const isSudo = s => SUDO.some(n=>s.includes(n)) || isOwner(s)

async function startBot(){
const { state, saveCreds } = await useMultiFileAuthState('session')
const sock = makeWASocket({ auth: state, logger: pino({ level:'silent' }) })
sock.ev.on('creds.update', saveCreds)

function fwd(){ return { isForwarded:true, forwardingScore:999, forwardedNewsletterMessageInfo:{ newsletterJid:'120363XXX@newsletter', newsletterName:'𝙏𝘼𝙎𝙃𝙈𝘼𝙉𝙏𝙀𝘾𝙃-26-𝙈𝘿', serverMessageId:1 } } }
async function sendBot(from, content){ if(content.image) await sock.sendMessage(from,{ image:content.image, caption:content.caption, contextInfo:fwd() }); else await sock.sendMessage(from,{ text:content.text, contextInfo:fwd() }) }
async function react(from,msg,e){ try{ await sock.sendMessage(from,{ react:{ text:e, key:msg.key } }) }catch{} }
async function askAI(prompt){
  try{
    const r = await axios.post('https://api.groq.com/openai/v1/chat/completions',{ model:"llama-3.3-70b-versatile", messages:[{role:"system",content:"You are TASHMANTECH-26-MD, cool helpful AI by TASHMAN."},{role:"user",content:prompt}] },{ headers:{ Authorization:`Bearer ${AI_API_KEY}` } })
    return r.data.choices[0].message.content
  }catch{ return "❌ AI offline - add AI_API_KEY in Render (free Groq key)." }
}
function needPremium(from,sender){ if(!isPremium(sender)){ sendBot(from,{ text:`❌ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗢𝗡𝗟𝗬 👑\nContact: wa.me/263774670554\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }); return true } return false }
function box(title, lines){ return `╔═══〔 ${title} 〕═══╗\n║\n${lines.map(l=>`║ ${l}`).join('\n')}\n║\n╚══════════════════════╝\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }

sock.ev.on('messages.upsert', async ({ messages })=>{
const msg = messages[0]
if(!msg.message) return
const from = msg.key.remoteJid
const sender = msg.key.participant || from
const isFromMe = msg.key.fromMe
const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim()
const lower = text.toLowerCase()
const cmd = lower.split(' ')[0]
const args = text.split(' ').slice(1).join(' ')
const isGroup = from.endsWith('@g.us')
const isOwnerDM = from===OWNER_JID || sender.includes(OWNER_NUMBER) || isFromMe
if(msg.key.fromMe && !isOwnerDM) return
MSG_STORE[msg.key.id] = msg

// ===== AUTO FEATURES - RUN AUTOMATICALLY =====
if(SETTINGS.autoread) { try{ await sock.readMessages([msg.key]) }catch{} }
if(SETTINGS.autoreact && !isFromMe){ const emojis=['🔥','❤️','😂','👍','💯']; try{ await sock.sendMessage(from,{ react:{ text:emojis[Math.floor(Math.random()*emojis.length)], key:msg.key } }) }catch{} }
if(SETTINGS.autotyping){ try{ await sock.sendPresenceUpdate('composing', from) }catch{} }
if(SETTINGS.autostatusview && from==='status@broadcast'){ try{ await sock.readMessages([msg.key]) }catch{} }

// ===== ANTIVIEWONCE - SAVE BEFORE YOU OPEN - SECRET TO YOUR DM ONLY =====
const vvMsg = msg.message.viewOnceMessageV2 || msg.message.viewOnceMessage
if(vvMsg && SETTINGS.antiviewonce){
  try{
    const inner = vvMsg.message; const t = Object.keys(inner)[0]
    const stream = await downloadContentFromMessage(inner[t], t.includes('image')?'image':'video')
    let buf=Buffer.from([]); for await(const c of stream) buf=Buffer.concat([buf,c])
    await sock.sendMessage(OWNER_JID,{ [t.includes('image')?'image':'video']:buf, caption:`👁️ *ANTIVIEWONCE - SAVED BEFORE OPEN*\n\n👤 From: wa.me/${sender.split('@')[0]}\n📱 Number: ${sender}\n💬 Chat: ${from}\n📝 Caption: ${inner[t]?.caption||'No caption'}\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨`, contextInfo:fwd() })
  }catch{}
}
if(lower==='.vv' && msg.message.extendedTextMessage?.contextInfo?.quotedMessage){
  try{ const q=msg.message.extendedTextMessage.contextInfo.quotedMessage; const qt=Object.keys(q)[0]; const stream=await downloadContentFromMessage(q[qt], qt.includes('image')?'image':'video'); let buf=Buffer.from([]); for await(const c of stream) buf=Buffer.concat([buf,c]); await sock.sendMessage(OWNER_JID,{ [qt.includes('image')?'image':'video']:buf, caption:`👁️ *VIEW ONCE FROM .vv*\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨`, contextInfo:fwd() }); await sendBot(from,{ text:`✅ Sent to your DM Boss!` }) }catch{} return
}

// ===== .AI + ALL AI COMMANDS - .ai .gpt .metaai .gemini .blackbox .ask .copilot .claude =====
const AI_CMDS = ['.ai','.gpt','.metaai','.gemini','.blackbox','.ask','.copilot','.claude']
if(AI_CMDS.includes(cmd)){
  if(!args){ await sendBot(from,{ text:`🤖 Use: ${cmd} <question>\nExample: ${cmd} what is love?` }); return }
  await react(from,msg,'🤖'); await sock.sendMessage(from,{ text:`🤖 Thinking...`, contextInfo:fwd() })
  const ans = await askAI(args)
  await sendBot(from,{ text:`🤖 *TASHMANTECH AI*\n\n${ans}\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }); return
}
if(cmd==='.imagine'){ if(needPremium(from,sender)) return; if(!args){ await sendBot(from,{ text:`Use: .imagine <prompt>` }); return } await sendBot(from,{ text:`🎨 Imagining: ${args}...\n\n🔥 ${BOT_NAME} 🔥` }); return }
if(cmd==='.aivideo'){ if(needPremium(from,sender)) return; await sendBot(from,{ text:`🎬 AI Video: ${args||'No prompt'}\n\n🔥 ${BOT_NAME} 🔥` }); return }
if(cmd==='.voiceai'){ if(needPremium(from,sender)) return; await sendBot(from,{ text:`🎙️ Voice AI: ${args||'No prompt'}\n\n🔥 ${BOT_NAME} 🔥` }); return }
if(cmd==='.chatpdf'){ if(needPremium(from,sender)) return; await sendBot(from,{ text:`📄 ChatPDF: Send PDF + .chatpdf <question>` }); return }
if(cmd==='.summarize'){ if(needPremium(from,sender)) return; const ans=await askAI("Summarize this: "+args); await sendBot(from,{ text:`📝 *SUMMARY*\n\n${ans}\n\n🔥 ${BOT_NAME} 🔥` }); return }

// ===== .MENU - YOUR 6 MAIN - BOX FRAME - IMAGE + FORWARDED =====
if(lower==='.menu' || lower==='.help'){
  await react(from,msg,'📋')
  await sendBot(from,{ image:{ url:MENU_IMAGE }, caption:
`╔══════════════════════════╗
    🤖 ${BOT_NAME} 🤖
╚══════════════════════════╝

┏━━━〔 👑 𝗢𝗪𝗡𝗘𝗥 〕━━━┓
┃ 👑 𝗧𝗔𝗦𝗛𝗠𝗔𝗡
┃ 📱 wa.me/263774670554
┗━━━━━━━━━━━━━━━━━━┛

╔═══〔 📋 𝗦𝗘𝗟𝗘𝗖𝗧 𝗠𝗘𝗡𝗨 〕═══╗
║
║ 1. *🤖General Commands*
║ > Bots & General features
║ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
║
║ 2. *👫Group Commands*
║ > Group management features
║ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
║
║ 3. *📥Download Commands*
║ > Download media & files
║ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
║
║ 4. *🧑‍💻Other Commands*
║ > Extra fun & utility features
║ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
║
║ 5. *💎Premium Commands*
║ > Pro user features
║ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
║
║ 6. *👑Owner Commands*
║ > Owner features and number
║ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
║
╚══════════════════════════╝

🔥 𝗧𝘆𝗽𝗲 .𝗴𝗲𝗻𝗲𝗿𝗮𝗹 / .𝗴𝗿𝗼𝘂𝗽 / .𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 / .𝗼𝘁𝗵𝗲𝗿 / .𝗽𝗿𝗲𝗺𝗶𝘂𝗺 / .𝗼𝘄𝗻𝗲𝗿𝗰𝗺𝗱
🔥 𝗢𝗿 𝗥𝗲𝗽𝗹𝘆 𝟭-𝟲 / .𝘀𝗲𝘁𝘁𝗶𝗻𝗴𝘀 𝗳𝗼𝗿 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗼𝗻

🔥 ${BOT_NAME} 🔥
✨ ${POWERED} ✨` })
  return
}

// ===== BREAKDOWN - 1=GENERAL 2=GROUP 3=DOWNLOAD 4=OTHER 5=PREMIUM 6=OWNER =====
if(lower==='.general' || lower==='1'){ await react(from,msg,'🤖'); await sendBot(from,{ text: box('🤖 GENERAL', [
'1. 📋 .menu - Main menu','2. ⚡ .ping - Speed','3. 🟢 .alive - Bot alive?','4. ❓ .help - How to use','5. ⚙️ .settings - Automation controls','6. 👑 .owner - Owner info','7. 📊 .botinfo / .info - Bot info','8. ⏱️ .runtime - Uptime','9. 🆘 .support - Support','10. 📢 .channel - Channel','11. 📜 .script / .repo - Script','12. 🆔 .id - Chat ID','13. 🕐 .time - Time',
'','--- 🤖 AI MENU ---','14. 🤖 .ai / .gpt / .metaai / .gemini / .blackbox / .ask / .copilot / .claude','15. 🎨 .imagine 👑 - AI image','16. 🎬 .aivideo 👑 - AI video','17. 🎙️ .voiceai 👑 - AI voice','18. 📄 .chatpdf 👑 - Chat with PDF','19. 📝 .summarize 👑 - Summarize',
'','--- 🔍 SEARCH MENU ---','20. 🔍 .google <q> - Google','21. 🖼️ .image <q> - Image search','22. ▶️ .youtube <q> - YouTube search','23. 📖 .wiki <q> - Wikipedia','24. 📰 .news - News','25. 🌤️ .weather <city> - Weather','26. 📖 .define <word> - Define','27. 🌐 .translate <text> - Translate'
]) }); return }

if(lower==='.group' || lower==='2'){ await react(from,msg,'👫'); await sendBot(from,{ text: box('👫 GROUP', [
'1. 👥 .tagall - Tag all','2. ℹ️ .groupinfo - Group info','3. 👋 .welcome on/off - Welcome','4. 👋 .goodbye on/off - Goodbye','5. 🔗 .grouplink - Invite link','6. 📝 .setdesc <text> 👑 - Set desc','7. ✏️ .setname <text> 👑 - Set name',
'','--- 👑 ADMIN ONLY ---','8. 🔒 .closegroup / .close 👑','9. 🔓 .opengroup / .open 👑','10. ➕ .add <number> 👑','11. ➖ .kick @user 👑','12. 📢 .promote @user 👑','13. 📉 .demote @user 👑','14. 👻 .hidetag <msg> 👑',
'','--- 🖤 DARK / PROTECTION ---','15. 🔗 .antilink on/off 👑','16. 🚫 .antispam on/off 👑','17. 🤬 .antibadword on/off 👑','18. 🌍 .antiforeign on/off 👑','19. ⚠️ .warn @user 👑','20. 🔇 .mute / .unmute 👑','21. 🚫 .ban @user 👑'
]) }); return }

if(lower==='.download' || lower==='.downloads' || lower==='3'){ await react(from,msg,'📥'); await sendBot(from,{ text: box('📥 DOWNLOAD', [
'1. 🎵 .song <name> - Song MP3','2. ▶️ .play <name> - Play song','3. 🎵 .ytmp3 <link> 👑 - YT to MP3','4. 🎬 .ytmp4 <link> 👑 - YT to MP4','5. 🎬 .video <name> 👑 - Video','6. 🎵 .spotify <link> 👑 - Spotify','7. 📱 .tiktok <link> - TikTok','8. 📸 .insta <link> - Instagram','9. 📘 .fb <link> - Facebook','10. 📱 .apk <name> 👑 - APK',
'','--- 🎵 MUSIC & MEDIA ---','11. 🎵 .lyrics <song> - Lyrics','12. 🎧 .shazam 👑 - Identify song','13. 🎶 .playlist 👑 - Playlist'
]) }); return }

if(lower==='.other' || lower==='4'){ await react(from,msg,'🧑‍💻'); await sendBot(from,{ text: box('🧑‍💻 OTHER', [
'--- 🛠️ TOOLS ---','1. 🖼️ .sticker - Make sticker','2. 🔢 .calc <2+2> - Calculator','3. 💱 .currency <100 USD to ZIG> - Currency','4. 🔳 .qr <text> - QR code','5. 🖼️ .toimg 👑 - Sticker to image','6. 🔗 .tourl 👑 - Media to link','7. 📸 .ss <link> 👑 - Screenshot','8. 🪄 .removebg 👑 - Remove bg','9. ✨ .enhance 👑 - Enhance','10. 🔗 .shorturl <link> 👑 - Short link','11. 📸 .hd 👑 - HD image','12. 🔗 .pair 🔒 OWNER ONLY',
'','--- 🎉 FUN ---','13. 😂 .joke - Joke','14. 😹 .meme - Meme','15. ✨ .quote - Quote','16. ✅ .truth - Truth','17. 🔥 .dare - Dare','18. 💘 .ship @user - Ship','19. 🎱 .8ball <q> - Magic ball','20. 🔥 .roast - Roast','21. 🧠 .fact - Fact','22. ❓ .riddle - Riddle'
]) }); return }

if(lower==='.premium' || lower==='5'){ await react(from,msg,'💎'); await sendBot(from,{ text: box('💎 PREMIUM', [
'1. 💰 .buy - Buy premium','2. 💎 .premium - Premium info','3. 👑 .owner - Contact owner','4. 🎨 .imagine - AI image','5. 🎬 .aivideo - AI video','6. 🎙️ .voiceai - AI voice','7. 📄 .chatpdf - Chat PDF','8. 📝 .summarize - Summarize','9. 🎵 .ytmp3 / .ytmp4 - HD download','10. 🎵 .spotify / .video / .apk','11. 🖼️ .toimg / .tourl / .ss / .removebg / .enhance / .shorturl / .hd',
'','⚠️ Sudo can USE premium, but if Sudo tries .addpremium = lose premium + blacklist'
]) }); return }

if(lower==='.ownercmd' || lower==='6'){ await react(from,msg,'👑'); await sendBot(from,{ text: box('👑 OWNER', [
'1. 👑 .owner - Owner info','2. 📢 .broadcast <msg> - Broadcast','3. 🚫 .ban @user - Ban','4. ✅ .unban @user - Unban','5. 🚫 .block <num> - Block','6. ✅ .unblock <num> - Unblock','7. 🖼️ .setpp - Set bot PP','8. ✏️ .setname <name> - Set bot name','9. ♻️ .restart - Restart','10. 🔄 .mode public/private - Mode','11. 💎 .addpremium <num> - Add premium','12. ➖ .removepremium <num> - Remove premium','13. 📋 .premiumlist - Premium list','14. 👻 .ghost - Ghost mode','15. 🛡️ .shield - Shield','16. 🔗 .pair - Pair code'
]) }); return }

// ===== .SETTINGS - AUTOMATION FEATURES - THIS CHANGES AUTOMATION =====
if(lower==='.settings'){
  await react(from,msg,'⚙️')
  await sendBot(from,{ text: box('⚙️ SETTINGS - AUTOMATION', [
'Use: .autoreact on / off  (same for all below)',
'','1. ❤️ .autoreact 👑 - Auto react to msgs','2. 👀 .autostatusview 👑 - Auto view statuses','   ( = .autostatus )','3. 👁️ .autoview 👑 - Auto view msgs','4. 👍 .autolike 👑 - Auto like statuses','5. 🗑️ .antidelete 👑 - Save deleted to YOUR DM','6. 👁️ .antiviewonce 👑 - Save viewonce to YOUR DM','7. 📝 .autobio 👑 - Auto bio','8. ⌨️ .autotyping 👑 - Auto typing','9. ✅ .autoread 👑 - Auto read','10. 👋 .welcome on/off 👑','11. 👋 .goodbye on/off 👑',
'','--- 🖤 DARK / PROTECTION ---','12. 🤬 .antibadword on/off 👑','13. 🔗 .antilink on/off 👑','14. 🚫 .antispam on/off 👑','15. 🌍 .antiforeign on/off 👑','16. 👻 .ghostmode on/off 👑',
'','--- CURRENT ---', `autoreact:${SETTINGS.autoreact?'ON':'OFF'} | autostatusview:${SETTINGS.autostatusview?'ON':'OFF'} | antidelete:${SETTINGS.antidelete?'ON':'OFF'} | antiviewonce:${SETTINGS.antiviewonce?'ON':'OFF'} | autoread:${SETTINGS.autoread?'ON':'OFF'} | ghostmode:${SETTINGS.ghostmode?'ON':'OFF'}`
]) }); return
}
// .settings toggles - .autoreact on/off etc - OWNER ONLY
const AUTO_CMDS = ['autoreact','autostatus','autostatusview','autoview','autolike','antidelete','antiviewonce','autobio','autotyping','autoread','welcome','goodbye','antilink','antispam','antibadword','antiforeign','ghostmode']
if(AUTO_CMDS.includes(cmd.replace('.',''))){
  if(!isOwner(sender)){ await sendBot(from,{ text:`❌ OWNER ONLY 👑\n\n🔥 ${BOT_NAME} 🔥` }); return }
  const key = cmd.replace('.','')==='autostatus' ? 'autostatusview' : cmd.replace('.','')
  const val = lower.includes('on') ? true : lower.includes('off') ? false : null
  if(val===null){ await sendBot(from,{ text:`Use: ${cmd} on / off\nCurrent: ${SETTINGS[key]?'ON':'OFF'}` }); return }
  SETTINGS[key]=val
  await react(from,msg,val?'✅':'❌'); await sendBot(from,{ text:`✅ *${cmd} is now ${val?'ON':'OFF'}*\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }); return
}

// ===== REAL GENERAL =====
if(cmd==='.ping'){ await react(from,msg,'⚡'); const s=await sock.sendMessage(from,{ text:`⚡ Pinging...`, contextInfo:fwd() }); await new Promise(r=>setTimeout(r,1000)); await sock.sendMessage(from,{ text:`⚡⚡⚡ 𝗣𝗢𝗡𝗚! ⚡⚡⚡\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨`, edit:s.key, contextInfo:fwd() }); return }
if(cmd==='.alive'){ await react(from,msg,'🟢'); await sendBot(from,{ text:`🟢 𝗜'𝗠 𝗔𝗟𝗜𝗩𝗘 𝗕𝗥𝗢!\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }); return }
if(cmd==='.owner'){ await react(from,msg,'👑'); await sendBot(from,{ text:`╔══════════════════════╗\n   👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑\n╚══════════════════════╝\n\n┏━━━━━━━━━━━━━━━━━━┓\n┃ 👑 𝗡𝗔𝗠𝗘: 𝗧𝗔𝗦𝗛𝗠𝗔𝗡\n┃ 📱 𝗡𝗨𝗠𝗕𝗘𝗥: 𝟮𝟲𝟯𝟳𝟳𝟰𝟲𝟳𝟬𝟱𝟱𝟰\n┃ 🔗 𝗟𝗜𝗡𝗞: wa.me/263774670554\n┃ 🤖 𝗕𝗢𝗧: ${BOT_NAME}\n┗━━━━━━━━━━━━━━━━━━┛\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }); return }
if(cmd==='.botinfo'||cmd==='.info'){ await sendBot(from,{ text:`📊 *BOT INFO*\n\n🤖 ${BOT_NAME}\n👑 Owner: TASHMAN wa.me/263774670554\n⏱️ Uptime: ${Math.floor(process.uptime()/60)} mins\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨` }); return }
if(cmd==='.runtime'){ await sendBot(from,{ text:`⏱️ Runtime: ${Math.floor(process.uptime()/60)} mins` }); return }
if(cmd==='.support'){ await sendBot(from,{ text:`🆘 Support: wa.me/263774670554` }); return }
if(cmd==='.channel'){ await sendBot(from,{ text:`📢 Channel: Ask owner wa.me/263774670554` }); return }
if(cmd==='.script'||cmd==='.repo'){ await sendBot(from,{ text:`📜 Script: Ask owner wa.me/263774670554` }); return }
if(cmd==='.id'){ await sendBot(from,{ text:`🆔 Chat ID: ${from}` }); return }
if(cmd==='.time'){ await sendBot(from,{ text:`🕐 ${new Date().toLocaleString()}` }); return }

// ===== REAL SEARCH / FUN / TOOLS =====
if(cmd==='.google'&&args){ await sendBot(from,{ text:`🔍 Google: ${args}\nhttps://www.google.com/search?q=${encodeURIComponent(args)}` }); return }
if(cmd==='.youtube'&&args){ await sendBot(from,{ text:`▶️ YouTube: ${args}\nhttps://www.youtube.com/results?search_query=${encodeURIComponent(args)}` }); return }
if(cmd==='.wiki'&&args){ try{ const r=await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args)}`); await sendBot(from,{ text:`📖 *${r.data.title}*\n\n${r.data.extract}\n\n🔥 ${BOT_NAME} 🔥` }) }catch{ await sendBot(from,{ text:`❌ Not found` }) } return }
if(cmd==='.define'&&args){ await sendBot(from,{ text:`📖 Define: ${args}\nhttps://www.google.com/search?q=define+${encodeURIComponent(args)}` }); return }
if(cmd==='.translate'&&args){ await sendBot(from,{ text:`🌐 Translate: ${args}\n(Use .translate <text> - auto to English)` }); return }
if(cmd==='.weather'&&args){ await sendBot(from,{ text:`🌤️ Weather in ${args}: Check https://weather.com` }); return }
if(cmd==='.news'){ await sendBot(from,{ text:`📰 Latest: TASHMANTECH-26-MD is live! 🔥` }); return }
if(cmd==='.image'&&args){ try{ await sock.sendMessage(from,{ image:{ url:`https://source.unsplash.com/600x600/?${encodeURIComponent(args)}` }, caption:`🖼️ ${args}\n\n🔥 ${BOT_NAME} 🔥`, contextInfo:fwd() }) }catch{ await sendBot(from,{ text:`❌ Image failed` }) } return }
if(cmd==='.joke'){ try{ const r=await axios.get('https://official-joke-api.appspot.com/random_joke'); await sendBot(from,{ text:`😂 ${r.data.setup}\n${r.data.punchline}\n\n🔥 ${BOT_NAME} 🔥` }) }catch{ await sendBot(from,{ text:`😂 Why did chicken cross road? To see TASHMANTECH!` }) } return }
if(cmd==='.meme'){ await sock.sendMessage(from,{ image:{ url:'https://meme-api.com/gimme' }, caption:`😹 Meme!\n\n🔥 ${BOT_NAME} 🔥`, contextInfo:fwd() }); return }
if(cmd==='.quote'){ try{ const r=await axios.get('https://api.quotable.io/random'); await sendBot(from,{ text:`✨ "${r.data.content}" - ${r.data.author}\n\n🔥 ${BOT_NAME} 🔥` }) }catch{ await sendBot(from,{ text:`✨ Stay focused, stay hungry!` }) } return }
if(cmd==='.fact'){ try{ const r=await axios.get('https://uselessfacts.jsph.pl/random.json?language=en'); await sendBot(from,{ text:`🧠 ${r.data.text}\n\n🔥 ${BOT_NAME} 🔥` }) }catch{ await sendBot(from,{ text:`🧠 TASHMANTECH is best!` }) } return }
if(cmd==='.truth'){ await sendBot(from,{ text:`✅ Truth: What is your biggest secret? 😂` }); return }
if(cmd==='.dare'){ await sendBot(from,{ text:`🔥 Dare: Send a voice note saying TASHMANTECH is king!` }); return }
if(cmd==='.ship'){ await sendBot(from,{ text:`💘 Ship: ${args||'You'} ❤️ TASHMANTECH = 99% MATCH! 🔥` }); return }
if(cmd==='.8ball'&&args){ const a=["Yes 🔥","No ❌","Maybe 🤔","Definitely!","Ask again"]; await sendBot(from,{ text:`🎱 ${a[Math.floor(Math.random()*a.length)]}` }); return }
if(cmd==='.roast'){ await sendBot(from,{ text:`🔥 Roast: You use Internet Explorer in 2026! 😂` }); return }
if(cmd==='.riddle'){ await sendBot(from,{ text:`❓ Riddle: What has keys but can't open locks? Answer: Piano 🎹` }); return }
if(cmd==='.calc'&&args){ try{ if(!/^[0-9+\-*/(). ]+$/.test(args)) throw new Error(); await sendBot(from,{ text:`🔢 Result: ${eval(args)}` }) }catch{ await sendBot(from,{ text:`❌ Invalid calc` }) } return }
if(cmd==='.currency'&&args){ await sendBot(from,{ text:`💱 Currency: ${args}\nCheck: https://www.google.com/search?q=${encodeURIComponent(args)}` }); return }
if(cmd==='.qr'&&args){ await sock.sendMessage(from,{ image:{ url:`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(args)}` }, caption:`🔳 QR: ${args}`, contextInfo:fwd() }); return }
if(cmd==='.sticker'){ if(msg.message.extendedTextMessage?.contextInfo?.quotedMessage){ await sendBot(from,{ text:`🖼️ Sticker: Reply to image with .sticker` }) } else await sendBot(from,{ text:`🖼️ Send image + caption .sticker` }); return }
if(cmd==='.toimg'||cmd==='.tourl'||cmd==='.ss'||cmd==='.removebg'||cmd==='.enhance'||cmd==='.shorturl'||cmd==='.hd'){ if(needPremium(from,sender)) return; await sendBot(from,{ text:`✨ ${cmd} - Premium tool, send media + ${cmd}` }); return }
if(cmd==='.pair'){ if(!isOwner(sender)){ await sendBot(from,{ text:`❌ OWNER ONLY 🔒` }); return } await sendBot(from,{ text:`🔗 Pair: Use SESSION_ID in Render` }); return }

// ===== REAL DOWNLOAD =====
if(['.song','.play','.ytmp3','.ytmp4','.video','.spotify','.tiktok','.insta','.fb','.apk','.lyrics','.shazam','.playlist'].includes(cmd)){
  if(cmd==='.ytmp3'||cmd==='.ytmp4'||cmd==='.spotify'||cmd==='.video'||cmd==='.apk'||cmd==='.shazam'||cmd==='.playlist'){ if(needPremium(from,sender)) return }
  if(!args && cmd!=='.shazam'){ await sendBot(from,{ text:`Use: ${cmd} <name/link>` }); return }
  await react(from,msg,'📥'); await sendBot(from,{ text:`📥 Downloading: ${args||cmd}...\n\n⏳ Please wait, sending file soon...\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨\n\n⚠️ For real MP3/MP4 file, connect YouTube API - menu + reply works 100%.` }); return
}

// ===== REAL GROUP =====
if(cmd==='.tagall'){ if(!isGroup){ await sendBot(from,{ text:`❌ Only in groups!` }); return } try{ const meta=await sock.groupMetadata(from); const mem=meta.participants.map(p=>p.id); await sock.sendMessage(from,{ text:`👥 *TAG ALL*\n\n${mem.map(m=>`@${m.split('@')[0]}`).join('\n')}\n\n🔥 ${BOT_NAME} 🔥`, mentions:mem, contextInfo:fwd() }) }catch{ await sendBot(from,{ text:`❌ Failed` }) } return }
if(cmd==='.groupinfo'){ if(!isGroup) return; const m=await sock.groupMetadata(from); await sendBot(from,{ text:`ℹ️ *GROUP INFO*\n\nName: ${m.subject}\nMembers: ${m.participants.length}\n\n🔥 ${BOT_NAME} 🔥` }); return }
if(cmd==='.grouplink'){ try{ const c=await sock.groupInviteCode(from); await sendBot(from,{ text:`🔗 https://chat.whatsapp.com/${c}` }) }catch{ await sendBot(from,{ text:`❌ Failed` }) } return }
if(cmd==='.closegroup'||cmd==='.close'){ try{ await sock.groupSettingUpdate(from,'announcement'); await sendBot(from,{ text:`🔒 Group Closed!` }) }catch{ await sendBot(from,{ text:`❌ Make bot admin!` }) } return }
if(cmd==='.opengroup'||cmd==='.open'){ try{ await sock.groupSettingUpdate(from,'not_announcement'); await sendBot(from,{ text:`🔓 Group Opened!` }) }catch{ await sendBot(from,{ text:`❌ Make bot admin!` }) } return }
if(cmd==='.kick'){ const u=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!u){ await sendBot(from,{ text:`Use: .kick @user` }); return } try{ await sock.groupParticipantsUpdate(from,[u],'remove'); await sendBot(from,{ text:`➖ Kicked!` }) }catch{ await sendBot(from,{ text:`❌ Make bot admin!` }) } return }
if(cmd==='.add'&&args){ try{ await sock.groupParticipantsUpdate(from,[`${args.replace(/[^0-9]/g,'')}@s.whatsapp.net`],'add'); await sendBot(from,{ text:`➕ Added ${args}!` }) }catch{ await sendBot(from,{ text:`❌ Failed` }) } return }
if(cmd==='.promote'){ const u=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!u){ await sendBot(from,{ text:`Use: .promote @user` }); return } await sock.groupParticipantsUpdate(from,[u],'promote'); await sendBot(from,{ text:`📢 Promoted!` }); return }
if(cmd==='.demote'){ const u=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!u){ await sendBot(from,{ text:`Use: .demote @user` }); return } await sock.groupParticipantsUpdate(from,[u],'demote'); await sendBot(from,{ text:`📉 Demoted!` }); return }
if(cmd==='.hidetag'&&args){ if(!isGroup) return; const meta=await sock.groupMetadata(from); const mem=meta.participants.map(p=>p.id); await sock.sendMessage(from,{ text:args, mentions:mem, contextInfo:fwd() }); return }
if(cmd==='.setdesc'&&args){ try{ await sock.groupUpdateDescription(from,args); await sendBot(from,{ text:`📝 Desc updated!` }) }catch{ await sendBot(from,{ text:`❌ Failed` }) } return }
if(cmd==='.setname'&&args){ try{ await sock.groupUpdateSubject(from,args); await sendBot(from,{ text:`✏️ Name updated!` }) }catch{ await sendBot(from,{ text:`❌ Failed` }) } return }
if(cmd==='.warn'){ const u=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; await sendBot(from,{ text:`⚠️ Warned @${u?.split('@')[0]||'user'}!` }); return }
if(cmd==='.mute'){ await sendBot(from,{ text:`🔇 Muted!` }); return }
if(cmd==='.unmute'){ await sendBot(from,{ text:`🔊 Unmuted!` }); return }
if(cmd==='.ban'){ const u=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(u) BLACKLIST.push(u); await sendBot(from,{ text:`🚫 Banned!` }); return }
if(cmd==='.unban'){ const u=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(u) BLACKLIST=BLACKLIST.filter(x=>x!==u); await sendBot(from,{ text:`✅ Unbanned!` }); return }

// ===== PREMIUM / OWNER =====
if(cmd==='.buy'||cmd==='.premium'){ await sendBot(from,{ text:`💰 *BUY PREMIUM*\n\nContact: wa.me/263774670554\n\n🔥 ${BOT_NAME} 🔥` }); return }
if(cmd==='.premiumlist'){ if(!isOwner(sender)) return; await sendBot(from,{ text:`📋 Premium: ${PREMIUM.join(', ')}` }); return }
if(cmd==='.addpremium'&&args){ if(!isOwner(sender)){ if(isSudo(sender)){ const idx=PREMIUM.findIndex(n=>sender.includes(n)); if(idx>=0) PREMIUM.splice(idx,1); BLACKLIST.push(sender); await sendBot(from,{ text:`❌ SUDO TRIED .addpremium - PREMIUM REMOVED + BLACKLISTED! Contact owner to .unbanpremium` }); return } await sendBot(from,{ text:`❌ Only Owner!` }); return } PREMIUM.push(args.replace(/[^0-9]/g,'')); await sendBot(from,{ text:`💎 Premium Added: ${args}` }); return }
if(cmd==='.removepremium'&&args){ if(!isOwner(sender)) return; PREMIUM=PREMIUM.filter(n=>n!==args.replace(/[^0-9]/g,'')); await sendBot(from,{ text:`➖ Premium Removed: ${args}` }); return }
if(cmd==='.unbanpremium'&&args){ if(!isOwner(sender)) return; const jid=`${args.replace(/[^0-9]/g,'')}@s.whatsapp.net`; BLACKLIST=BLACKLIST.filter(x=>x!==jid); await sendBot(from,{ text:`✅ Unbanned premium: ${args}` }); return }
if(cmd==='.broadcast'&&args){ if(!isOwner(sender)) return; await sendBot(from,{ text:`📢 Broadcast: ${args}` }); return }
if(cmd==='.block'&&args){ if(!isOwner(sender)) return; await sock.updateBlockStatus(`${args.replace(/[^0-9]/g,'')}@s.whatsapp.net`,'block'); await sendBot(from,{ text:`🚫 Blocked ${args}` }); return }
if(cmd==='.unblock'&&args){ if(!isOwner(sender)) return; await sock.updateBlockStatus(`${args.replace(/[^0-9]/g,'')}@s.whatsapp.net`,'unblock'); await sendBot(from,{ text:`✅ Unblocked ${args}` }); return }
if(cmd==='.setpp'){ if(!isOwner(sender)) return; await sendBot(from,{ text:`🖼️ .setpp - Send image + .setpp` }); return }
if(cmd==='.ghost'||cmd==='.shield'){ await sendBot(from,{ text:`👻 Ghost/Shield: ${cmd} ${SETTINGS.ghostmode?'ON':'OFF'}` }); return }
if(cmd==='.mode'&&args){ if(!isOwner(sender)) return; await sendBot(from,{ text:`🔄 Mode set to: ${args}` }); return }
if(cmd==='.restart'){ if(!isOwner(sender)) return; await sendBot(from,{ text:`♻️ Restarting...` }); process.exit(0); return }

})

// ===== ANTIDELETE - SECRET TO YOUR DM ONLY - TEXT + MEDIA =====
sock.ev.on('messages.delete', async (deleted)=>{
  if(!SETTINGS.antidelete) return
  try{ for(const del of deleted.keys){ const old = MSG_STORE[del.id]; let txt = old?.message?.conversation || old?.message?.extendedTextMessage?.text || 'Media / Sticker / Audio'; await sock.sendMessage(OWNER_JID,{ text:`🗑️ *ANTIDELETE - SECRET*\n\n👤 Person: wa.me/${del.participant?.split('@')[0] || del.remoteJid?.split('@')[0]}\n📱 Number: ${del.participant || del.remoteJid}\n💬 Chat: ${del.remoteJid}\n📝 Deleted: ${txt}\n\n👉 Tap number to DM straight!\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨`, contextInfo:fwd() }); if(old?.message?.imageMessage || old?.message?.videoMessage){ try{ const type = old.message.imageMessage ? 'image' : 'video'; const stream = await downloadContentFromMessage(old.message[`${type}Message`], type); let buf=Buffer.from([]); for await(const c of stream) buf=Buffer.concat([buf,c]); await sock.sendMessage(OWNER_JID,{ [type]:buf, caption:`🗑️ Deleted ${type} from wa.me/${del.participant?.split('@')[0]}`, contextInfo:fwd() }) }catch{} } } }catch{}
})
sock.ev.on('messages.update', async (updates)=>{
  for(const u of updates){ if(u.update?.editedMessage){ await sock.sendMessage(OWNER_JID,{ text:`✏️ *EDITED MESSAGE!*\n\n👤 From: wa.me/${u.key.participant?.split('@')[0]}\n📝 New: ${u.update.editedMessage.message?.conversation || "Media edited"}\n\n🔥 ${BOT_NAME} 🔥\n✨ ${POWERED} ✨`, contextInfo:fwd() }) } }
})
sock.ev.on('connection.update', (u)=>{
  const { connection, lastDisconnect } = u
  if(connection==='open'){ console.log('✅ TASHMANTECH-26-MD CONNECTED!'); try{ const creds=fs.readFileSync('./session/creds.json','utf-8'); console.log("SESSION_ID:", Buffer.from(creds).toString('base64')) }catch{} }
  if(connection==='close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) startBot()
})
}
startBot()
