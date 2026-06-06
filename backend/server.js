// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import crypto from 'crypto';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = createServer(app);
// const io = new Server(server, {
//   cors: { origin: '*', methods: ['GET', 'POST'] }
// });

// const reputationTiers = [
//   { name: 'Degenerate', min: 0, max: 199, badge: '🟢', description: 'High variance, entry-level activity.' },
//   { name: 'Apprentice', min: 200, max: 499, badge: '🔵', description: 'Building volume, emerging consistency.' },
//   { name: 'Strategist', min: 500, max: 999, badge: '🟣', description: 'Highly stable portfolio balancing, multi-day active.' },
//   { name: 'Apex Trader', min: 1000, max: 2499, badge: '🟠', description: 'High-velocity trading, whale-class volume.' },
//   { name: 'The Oracle', min: 2500, max: Infinity, badge: '🔴', description: 'Elite tier; represents the top 1% of the platform.' }
// ];

// const perkByTier = {
//   Degenerate: { type: 'hint', label: 'Cheap Hint', description: 'Unlock a simple clue to speed up the puzzle hunt.' },
//   Apprentice: { type: 'hint', label: 'Strategic Hint', description: 'Request a contextual lead without spoiling the answer.' },
//   Strategist: { type: 'blind_opponent', label: 'Smoke Bomb', description: 'Temporarily blind the rival terminal and slow their momentum.' },
//   'Apex Trader': { type: 'blind_opponent', label: 'Smoke Bomb', description: 'Temporarily slow a rival while you work the exploit path.' },
//   'The Oracle': { type: 'double_down', label: 'Double Down', description: 'Boost the vault size and stack your win.' }
// };

// const users = {
//   '1': { id: '1', name: 'Ada Lovelace', rep: 1250, streak: 5, volume: 15400 },
//   '2': { id: '2', name: 'Satoshi Osun', rep: 320, streak: 2, volume: 450 }
// };

// const activeMatches = {};
// const matchmakingQueue = [];

// const caseTemplates = [
//   {
//     id: 'phantom_slippage',
//     title: 'The Case of the Phantom Slippage',
//     briefing: 'An unknown wallet is draining liquidity from the SwiftyEx pool using a suspicious flash loan attack loop. Trace the math vector anomaly.',
//     evidence: 'TX_HASH: 0x9f...3a | Gas Limit: 8,000,000 | Input Payload Multiplier: 0xde0b6b3a7640000',
//     clue: 'Look at the input multiplier and how the decimal value is treated before settlement.',
//     hint: 'The problem is not the loan size. It is the way numbers move through the contract math.',
//     solutionKeywords: ['truncate', 'truncation', 'rounding', 'precision']
//   },
//   {
//     id: 'reentrancy_poison',
//     title: 'The Reentrancy Poisoning',
//     briefing: 'A malicious actor is draining test tokens by repeatedly requesting a smart escrow payout before internal balances update.',
//     evidence: 'CONTRACT: 0x71...2b | Function: withdraw() | State Update: balances[msg.sender] -= amount (Line 42)',
//     clue: 'Check whether the external transfer happens before or after the balance update.',
//     hint: 'The bug is not the transfer itself — it is the sequence of state updates around it.',
//     solutionKeywords: ['reentrancy', 'order', 'state', 'sequence']
//   },
//   {
//     id: 'fee_mismatch',
//     title: 'The Fee Mismatch Mystery',
//     briefing: 'A bridge relay is charging an inconsistent fee on inbound payloads, leaving an exploitable price gap. Identify the fraud vector.',
//     evidence: 'BRIDGE: 0x44...9b | Fee Table: 0.15% inbound vs 0.03% outbound | Payload: 1,000 USDT',
//     clue: 'The exploit hides in the fee table, not the bridge transfer itself.',
//     hint: 'Compare inbound and outbound fees to expose the pricing discrepancy.',
//     solutionKeywords: ['fee', 'mismatch', 'spread', 'pricing']
//   },
//   {
//     id: 'burn_loop',
//     title: 'The Burn Loop Bug',
//     briefing: 'A token burn function is called inside a loop without updating supply state, causing repeated inflation errors.',
//     evidence: 'FUNCTION: burn() | LOOP: for (uint i = 0; i < burns.length; i++) | State Update: totalSupply -= burns[i]',
//     clue: 'The loop is correct. The bug is the supply update timing and repeated effect.',
//     hint: 'The burn call happens many times, but the total supply is updated in the wrong moment.',
//     solutionKeywords: ['supply', 'burn', 'loop', 'timing']
//   }
// ];

// // Simple MCQ templates for demo/mock mode (easy A-D questions)
// const mcqTemplates = [
//   {
//     id: 'mcq_hashing',
//     title: 'What does a cryptographic hash do?',
//     briefing: 'Pick the best short definition.',
//     choices: [
//       { key: 'A', text: 'Turns data into a fixed-size fingerprint' },
//       { key: 'B', text: 'Encrypts messages for confidentiality' },
//       { key: 'C', text: 'Serves as a private key' },
//       { key: 'D', text: 'Compresses files without loss' }
//     ],
//     correctOption: 'A',
//     hint: 'Think fingerprint',
//     solutionKeywords: ['hash', 'fingerprint']
//   },
//   {
//     id: 'mcq_private_key',
//     title: 'What should you never share?',
//     briefing: 'Choose the correct answer.',
//     choices: [
//       { key: 'A', text: 'Your public address' },
//       { key: 'B', text: 'Your transaction history' },
//       { key: 'C', text: 'Your private key' },
//       { key: 'D', text: 'A signed message' }
//     ],
//     correctOption: 'C',
//     hint: 'This grants full control.',
//     solutionKeywords: ['private', 'key']
//   },
//   {
//     id: 'mcq_blockchain',
//     title: 'What is a blockchain?',
//     briefing: 'Pick the simplest description.',
//     choices: [
//       { key: 'A', text: 'A central database owned by one company' },
//       { key: 'B', text: 'A linked list of blocks storing transactions' },
//       { key: 'C', text: 'A tool for compressing images' },
//       { key: 'D', text: 'A VPN for cryptocurrency' }
//     ],
//     correctOption: 'B',
//     hint: 'Think blocks chained together.',
//     solutionKeywords: ['block', 'chain']
//   },
//   {
//     id: 'mcq_confirmations',
//     title: 'What does a transaction confirmation mean?',
//     briefing: 'Choose the best option.',
//     choices: [
//       { key: 'A', text: 'The transaction was broadcast but not included' },
//       { key: 'B', text: 'The transaction is included in a block and accepted' },
//       { key: 'C', text: 'The transaction was deleted' },
//       { key: 'D', text: 'The wallet was backed up' }
//     ],
//     correctOption: 'B',
//     hint: 'Inclusion in a block is key.',
//     solutionKeywords: ['confirm', 'included', 'block']
//   }
// ];

// function getTier(rep) {
//   return reputationTiers.find((tier) => rep >= tier.min && rep <= tier.max)?.name || 'Degenerate';
// }

// function buildUserProfile(user) {
//   const tier = getTier(user.rep);
//   const nextTier = reputationTiers.find((item) => item.min > user.rep);
//   return {
//     ...user,
//     tier,
//     badge: reputationTiers.find((item) => item.name === tier)?.badge || '🟢',
//     nextTier: nextTier ? { name: nextTier.name, threshold: nextTier.min } : null
//   };
// }

// function pickRandom(list) {
//   return list[Math.floor(Math.random() * list.length)];
// }

// function generateCase() {
//   // For demo/mock mode prefer simple MCQ templates to keep questions easy and objective.
//   const pool = mcqTemplates && mcqTemplates.length ? mcqTemplates : caseTemplates;
//   const template = pickRandom(pool);
//   const solutionHash = crypto.createHash('sha256').update(`${template.id}:${Date.now()}`).digest('hex').slice(0, 8);
//   return {
//     ...template,
//     solutionHash,
//     difficulty: template.difficulty || 'easy'
//   };
// }

// function getPerkForTier(tier) {
//   return perkByTier[tier] || perkByTier.Degenerate;
// }

// function isMatchEligible(a, b) {
//   return !(a.tier === 'The Oracle' && b.tier === 'The Oracle');
// }

// function calculateReputationGain(stake, streak, win) {
//   const base = win ? 140 : 18;
//   return Math.max(12, Math.round(base + stake * 0.08 + Math.min(streak, 10) * 10));
// }

// function updateUserAfterMatch(user, stake, win) {
//   const repGain = calculateReputationGain(stake, user.streak, win);
//   user.volume += stake;
//   user.rep = Math.max(0, user.rep + repGain);
//   user.streak = win ? user.streak + 1 : 0;
//   user.tier = getTier(user.rep);
//   return { repGain, tier: user.tier };
// }

// app.get('/api/user/:id', (req, res) => {
//   const user = users[req.params.id] || { id: req.params.id, name: 'New Trader', rep: 0, streak: 0, volume: 0 };
//   res.json(buildUserProfile(user));
// });

// app.get('/api/tier-structure', (_req, res) => {
//   res.json(reputationTiers);
// });

// // Admin/demo endpoints to view and add MCQ templates at runtime.
// app.get('/api/mcq', (_req, res) => {
//   res.json(mcqTemplates);
// });

// app.post('/api/mcq', (req, res) => {
//   const q = req.body;
//   if (!q || !q.id || !q.title || !Array.isArray(q.choices) || !q.correctOption) {
//     return res.status(400).json({ error: 'Invalid MCQ payload. Require id, title, choices, correctOption.' });
//   }
//   mcqTemplates.push(q);
//   res.json({ ok: true, added: q.id });
// });

// io.on('connection', (socket) => {
//   console.log(`Socket connected: ${socket.id}`);

//   socket.on('join_queue', (data) => {
//     const { userId, syndicateName, stake = 100 } = data;
//     const baseProfile = users[userId] || { id: userId, name: 'Guest Trader', rep: 50, streak: 0, volume: 0 };
//     const playerProfile = buildUserProfile(baseProfile);
//     const queueItem = {
//       socketId: socket.id,
//       userId,
//       syndicateName: syndicateName || `Syndicate-${userId}`,
//       stake: Math.max(50, Math.min(300, stake)),
//       profile: playerProfile,
//       perk: getPerkForTier(playerProfile.tier),
//       hintUsed: false,
//       boostUsed: false
//     };

//     if (!matchmakingQueue.find((item) => item.socketId === socket.id)) {
//       matchmakingQueue.push(queueItem);
//     }

//     console.log(`Player added to queue. Queue size: ${matchmakingQueue.length}`);

//     if (matchmakingQueue.length >= 2) {
//       const teamA = matchmakingQueue.shift();
//       const teamB = matchmakingQueue.shift();

//       if (!isMatchEligible(teamA.profile, teamB.profile)) {
//         matchmakingQueue.unshift(teamA);
//         matchmakingQueue.unshift(teamB);
//         io.to(teamA.socketId).emit('match_rejected', {
//           reason: 'Tier cap prevents Oracle-vs-Oracle matches. Wait for broader tier balance before launching the raid.'
//         });
//         io.to(teamB.socketId).emit('match_rejected', {
//           reason: 'Tier cap prevents Oracle-vs-Oracle matches. Wait for broader tier balance before launching the raid.'
//         });
//         return;
//       }

//       const matchId = `match_${Date.now()}`;
//       const selectedCase = generateCase();
//       const pot = teamA.stake + teamB.stake;
//       const behaviorMessage = 'Fast logic wins the vault. Focus on the anomaly, not the noise.';

//       activeMatches[matchId] = {
//         id: matchId,
//         caseData: selectedCase,
//         pot,
//         status: 'ACTIVE',
//         behaviorMessage,
//         teams: {
//           [teamA.socketId]: {
//             socketId: teamA.socketId,
//             name: teamA.syndicateName,
//             userId: teamA.userId,
//             tier: teamA.profile.tier,
//             stake: teamA.stake,
//             perk: teamA.perk,
//             hintUsed: false,
//             boostUsed: false
//           },
//           [teamB.socketId]: {
//             socketId: teamB.socketId,
//             name: teamB.syndicateName,
//             userId: teamB.userId,
//             tier: teamB.profile.tier,
//             stake: teamB.stake,
//             perk: teamB.perk,
//             hintUsed: false,
//             boostUsed: false
//           }
//         }
//       };

//       const socketA = io.sockets.sockets.get(teamA.socketId);
//       const socketB = io.sockets.sockets.get(teamB.socketId);
//       socketA?.join(matchId);
//       socketB?.join(matchId);

//       const teamAMatchPayload = {
//         matchId,
//         opponent: teamB.syndicateName,
//         caseData: selectedCase,
//         role: 'TEAM_A',
//         perk: teamA.perk,
//         stake: teamA.stake,
//         pot,
//         behaviorMessage,
//         tierCapNotice: null
//       };
//       const teamBMatchPayload = {
//         matchId,
//         opponent: teamA.syndicateName,
//         caseData: selectedCase,
//         role: 'TEAM_B',
//         perk: teamB.perk,
//         stake: teamB.stake,
//         pot,
//         behaviorMessage,
//         tierCapNotice: null
//       };

//       socketA?.emit('match_found', teamAMatchPayload);
//       socketB?.emit('match_found', teamBMatchPayload);
//       console.log(`Match initialized: ${matchId}`);
//     }
//   });

//   socket.on('request_hint', (data) => {
//     const { matchId } = data;
//     const currentMatch = activeMatches[matchId];
//     if (!currentMatch || currentMatch.status !== 'ACTIVE') return;

//     const player = currentMatch.teams[socket.id];
//     if (!player || player.hintUsed) {
//       socket.emit('hint_result', { success: false, message: 'Hint already consumed or not available.' });
//       return;
//     }

//     player.hintUsed = true;
//     const hint = currentMatch.caseData.hint;
//     socket.emit('hint_result', { success: true, hint, message: `Perk used: ${player.perk.label}. ${player.perk.description}` });

//     if (player.perk.type === 'blind_opponent') {
//       const opponentSocketId = Object.keys(currentMatch.teams).find((id) => id !== socket.id);
//       if (opponentSocketId) {
//         io.to(opponentSocketId).emit('status_update', {
//           message: 'Smoke Bomb activated by the rival team. Your terminal is briefly obscured.'
//         });
//       }
//     }

//     if (player.perk.type === 'double_down' && !player.boostUsed) {
//       player.boostUsed = true;
//       currentMatch.pot = Math.round(currentMatch.pot * 1.25);
//       socket.emit('perk_result', {
//         success: true,
//         message: `Double Down activated. Vault pot is now ${currentMatch.pot} USDT.`
//       });
//     }
//   });

//   socket.on('glory_shared', () => {
//     const team = Object.values(activeMatches).flatMap((match) => Object.values(match.teams)).find((entry) => entry.socketId === socket.id);
//     if (!team || !users[team.userId]) {
//       socket.emit('share_ack', { repGain: 0, message: 'Share recorded, but reward is only available for registered traders.' });
//       return;
//     }

//     users[team.userId].rep += 20;
//     users[team.userId].tier = getTier(users[team.userId].rep);
//     socket.emit('share_ack', {
//       repGain: 20,
//       newTier: users[team.userId].tier,
//       message: 'Social sharing granted +20 reputation and a multiplier buff for your next raid.'
//     });
//   });

//   socket.on('submit_solution', (data) => {
//     const { matchId, solution } = data;
//     const currentMatch = activeMatches[matchId];
//     if (!currentMatch || currentMatch.status !== 'ACTIVE') return;

//     let isCorrect = false;
//     const normalizedSolution = (solution || '').toString().trim();

//     // If the case defines a correctOption (MCQ), accept A-D or the exact key/text
//     if (currentMatch.caseData && currentMatch.caseData.correctOption) {
//       const submitted = normalizedSolution.toUpperCase();
//       if (submitted === currentMatch.caseData.correctOption.toUpperCase()) isCorrect = true;
//       if (!isCorrect && Array.isArray(currentMatch.caseData.choices)) {
//         isCorrect = currentMatch.caseData.choices.some((c) => c.key === submitted || c.text.toLowerCase() === normalizedSolution.toLowerCase());
//       }
//     } else {
//       isCorrect = currentMatch.caseData.solutionKeywords.some((kw) => normalizedSolution.toLowerCase().includes(kw));
//     }

//     // Prepare correct-answer info for MCQs when available
//     let correctInfo = null;
//     if (currentMatch.caseData && currentMatch.caseData.correctOption && Array.isArray(currentMatch.caseData.choices)) {
//       const correctKey = currentMatch.caseData.correctOption.toUpperCase();
//       const choiceObj = currentMatch.caseData.choices.find((c) => c.key === correctKey);
//       correctInfo = { correctOption: correctKey, correctText: choiceObj ? choiceObj.text : null };
//     }

//     // Emit immediate feedback including correct answer for MCQ mode
//     socket.emit('solution_result', {
//       correct: isCorrect,
//       message: isCorrect ? 'Correct.' : 'No exploit vector found. Try another option or ask for a hint.',
//       ...(correctInfo || {})
//     });

//     if (!isCorrect) {
//       return;
//     }

//     currentMatch.status = 'COMPLETED';
//     const winnerSocketId = socket.id;
//     const loserSocketId = Object.keys(currentMatch.teams).find((id) => id !== winnerSocketId);
//     const winnerEntry = currentMatch.teams[winnerSocketId];
//     const loserEntry = currentMatch.teams[loserSocketId];

//     let winnerStats = null;
//     if (users[winnerEntry.userId]) {
//       winnerStats = updateUserAfterMatch(users[winnerEntry.userId], winnerEntry.stake, true);
//     }
//     if (loserEntry && users[loserEntry.userId]) {
//       updateUserAfterMatch(users[loserEntry.userId], loserEntry.stake, false);
//     }

//     const summaryMessage = `You cracked the case first. ${currentMatch.behaviorMessage}`;
//     io.to(winnerSocketId).emit('game_over', {
//       result: 'WON',
//       looted: currentMatch.pot,
//       summaryMessage,
//       repGain: winnerStats?.repGain || 0,
//       newTier: winnerStats?.tier || getTier(users[winnerEntry.userId]?.rep || 0)
//     });

//     if (loserSocketId) {
//       io.to(loserSocketId).emit('game_over', {
//         result: 'LOST',
//         looted: 0,
//         summaryMessage: 'Your rival cracked it first. Prepare your next raid with sharper logic.'
//       });
//     }

//     if (winnerSocketId) io.sockets.sockets.get(winnerSocketId)?.leave(matchId);
//     if (loserSocketId) io.sockets.sockets.get(loserSocketId)?.leave(matchId);
//     delete activeMatches[matchId];
//   });

//   socket.on('disconnect', () => {
//     const idx = matchmakingQueue.findIndex((item) => item.socketId === socket.id);
//     if (idx !== -1) matchmakingQueue.splice(idx, 1);
//     console.log(`Socket disconnected: ${socket.id}`);
//   });
// });

// const PORT = 5000;
// server.listen(PORT, () => console.log(`Swifty Circle Backend operational on port ${PORT}`));

import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Initialize Gemini client using environmental API keys
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const reputationTiers = [
  { name: 'Degenerate', min: 0, max: 199, badge: '🟢', description: 'High variance, entry-level activity.' },
  { name: 'Apprentice', min: 200, max: 499, badge: '🔵', description: 'Building volume, emerging consistency.' },
  { name: 'Strategist', min: 500, max: 999, badge: '🟣', description: 'Highly stable portfolio balancing, multi-day active.' },
  { name: 'Apex Trader', min: 1000, max: 2499, badge: '🟠', description: 'High-velocity trading, whale-class volume.' },
  { name: 'The Oracle', min: 2500, max: Infinity, badge: '🔴', description: 'Elite tier; represents the top 1% of the platform.' }
];

const perkByTier = {
  Degenerate: { type: 'hint', label: 'Cheap Hint', description: 'Unlock a simple clue to speed up the puzzle hunt.' },
  Apprentice: { type: 'hint', label: 'Strategic Hint', description: 'Request a contextual lead without spoiling the answer.' },
  Strategist: { type: 'blind_opponent', label: 'Smoke Bomb', description: 'Temporarily blind the rival terminal and slow their momentum.' },
  'Apex Trader': { type: 'blind_opponent', label: 'Smoke Bomb', description: 'Temporarily slow a rival while you work the exploit path.' },
  'The Oracle': { type: 'double_down', label: 'Double Down', description: 'Boost the vault size and stack your win.' }
};

const users = {
  '1': { id: '1', name: 'Ada Lovelace', rep: 1250, streak: 5, volume: 15400 },
  '2': { id: '2', name: 'Satoshi Osun', rep: 320, streak: 2, volume: 450 }
};

const activeMatches = {};
const matchmakingQueue = [];

const caseTemplates = [
  {
    id: 'phantom_slippage',
    title: 'The Case of the Phantom Slippage',
    briefing: 'An unknown wallet is draining liquidity from the SwiftyEx pool using a suspicious flash loan attack loop. Trace the math vector anomaly.',
    evidence: 'TX_HASH: 0x9f...3a | Gas Limit: 8,000,000 | Input Payload Multiplier: 0xde0b6b3a7640000',
    clue: 'Look at the input multiplier and how the decimal value is treated before settlement.',
    hint: 'The problem is not the loan size. It is the way numbers move through the contract math.',
    solutionKeywords: ['truncate', 'truncation', 'rounding', 'precision']
  },
  {
    id: 'burn_loop',
    title: 'The Burn Loop Bug',
    briefing: 'A token burn function is called inside a loop without updating supply state, causing repeated inflation errors.',
    evidence: 'FUNCTION: burn() | LOOP: for (uint i = 0; i < burns.length; i++) | State Update: totalSupply -= burns[i]',
    clue: 'The loop is correct. The bug is the supply update timing and repeated effect.',
    hint: 'The burn call happens many times, but the total supply is updated in the wrong moment.',
    solutionKeywords: ['supply', 'burn', 'loop', 'timing']
  }
];

const mcqTemplates = [
  {
    id: 'mcq_hashing',
    title: 'What does a cryptographic hash do?',
    briefing: 'Pick the best short definition regarding blockchain fingerprint safety metrics.',
    choices: [
      { key: 'A', text: 'Turns data into a fixed-size fingerprint' },
      { key: 'B', text: 'Encrypts messages for confidentiality' },
      { key: 'C', text: 'Serves directly as a user private key' },
      { key: 'D', text: 'Compresses large scale files without loss' }
    ],
    correctOption: 'A',
    clue: 'Think fingerprint arrays.',
    hint: 'It maps input data directly to an absolute fixed length hash profile.',
    solutionKeywords: ['hash', 'fingerprint']
  },
  {
    id: 'mcq_private_key',
    title: 'Securing Your Wallet Identity',
    briefing: 'Which file or variable should you absolutely never reveal to third party help desks?',
    choices: [
      { key: 'A', text: 'Your transaction hash reference' },
      { key: 'B', text: 'Your public wallet address' },
      { key: 'C', text: 'Your private key or seed phrase' },
      { key: 'D', text: 'Your account registration timestamp' }
    ],
    correctOption: 'C',
    clue: 'This grants complete fund spending access control indices.',
    hint: 'It is the root cryptographic sequence managing signatures.',
    solutionKeywords: ['private', 'key', 'seed']
  }
];

// JSON Schema definition to enforce Gemini output mapping explicitly as an MCQ layout
const caseSchema = {
  type: "OBJECT",
  properties: {
    id: { type: "STRING" },
    title: { type: "STRING" },
    briefing: { type: "STRING" },
    choices: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          key: { type: "STRING" },
          text: { type: "STRING" }
        },
        required: ["key", "text"]
      }
    },
    correctOption: { type: "STRING" },
    clue: { type: "STRING" },
    hint: { type: "STRING" },
    solutionKeywords: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["id", "title", "briefing", "choices", "correctOption", "clue", "hint", "solutionKeywords"]
};

// Hybrid AI Case Generator with Focus on Basic MCQ Format
async function fetchAndCompileCase() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY environment variable unassigned. Deploying local failsafe matrix.");
    return fallbackLocalCase();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s execution deadline

    const promptText = `Generate a basic multiple-choice question focused on fundamental Web3 safety, cryptocurrency basics, or clear security concepts (e.g., private keys, basic phishing links, public vs private addresses, gas fees). 
    Keep the context readable, simple, and entry-level. 
    You MUST provide exactly 4 choices labeled A, B, C, and D. 
    Designate one clear correct option indicator.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: caseSchema
      }
    });

    clearTimeout(timeoutId);

    const generatedCase = JSON.parse(response.text);
    const solutionHash = crypto.createHash('sha256').update(`${generatedCase.id}:${Date.now()}`).digest('hex').slice(0, 8);
    
    console.log(`🤖 Procedural Basic MCQ Successfully Compiled: "${generatedCase.title}"`);
    return { ...generatedCase, solutionHash, difficulty: 'easy' };

  } catch (error) {
    console.error("🚨 AI Generation failure or execution timeout. Triggering reliable fallback framework.");
    return fallbackLocalCase();
  }
}

function fallbackLocalCase() {
  const pool = mcqTemplates && mcqTemplates.length ? mcqTemplates : caseTemplates;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const solutionHash = crypto.createHash('sha256').update(`${template.id}:${Date.now()}`).digest('hex').slice(0, 8);
  return { ...template, solutionHash, difficulty: 'easy' };
}

function getTier(rep) {
  return reputationTiers.find((tier) => rep >= tier.min && rep <= tier.max)?.name || 'Degenerate';
}

function buildUserProfile(user) {
  const tier = getTier(user.rep);
  const nextTier = reputationTiers.find((item) => item.min > user.rep);
  return {
    ...user,
    tier,
    badge: reputationTiers.find((item) => item.name === tier)?.badge || '🟢',
    nextTier: nextTier ? { name: nextTier.name, threshold: nextTier.min } : null
  };
}

function getPerkForTier(tier) {
  return perkByTier[tier] || perkByTier.Degenerate;
}

function isMatchEligible(a, b) {
  return !(a.tier === 'The Oracle' && b.tier === 'The Oracle');
}

function calculateReputationGain(stake, streak, win) {
  const base = win ? 140 : 18;
  return Math.max(12, Math.round(base + stake * 0.08 + Math.min(streak, 10) * 10));
}

function updateUserAfterMatch(user, stake, win) {
  const repGain = calculateReputationGain(stake, user.streak, win);
  user.volume += stake;
  user.rep = Math.max(0, user.rep + repGain);
  user.streak = win ? user.streak + 1 : 0;
  user.tier = getTier(user.rep);
  return { repGain, tier: user.tier };
}

// REST Endpoints
app.get('/api/user/:id', (req, res) => {
  const user = users[req.params.id] || { id: req.params.id, name: 'New Trader', rep: 0, streak: 0, volume: 0 };
  res.json(buildUserProfile(user));
});

app.get('/api/tier-structure', (_req, res) => res.json(reputationTiers));

// Real-Time Socket Connection Matrix
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join_queue', async (data) => {
    const { userId, syndicateName, stake = 100 } = data;
    const baseProfile = users[userId] || { id: userId, name: 'Guest Trader', rep: 50, streak: 0, volume: 0 };
    const playerProfile = buildUserProfile(baseProfile);
    const queueItem = {
      socketId: socket.id,
      userId,
      syndicateName: syndicateName || `Syndicate-${userId}`,
      stake: Math.max(50, Math.min(300, stake)),
      profile: playerProfile,
      perk: getPerkForTier(playerProfile.tier),
      hintUsed: false,
      boostUsed: false
    };

    if (!matchmakingQueue.find((item) => item.socketId === socket.id)) {
      matchmakingQueue.push(queueItem);
    }

    console.log(`Player added to queue. Queue size: ${matchmakingQueue.length}`);

    if (matchmakingQueue.length >= 2) {
      const teamA = matchmakingQueue.shift();
      const teamB = matchmakingQueue.shift();

      if (!isMatchEligible(teamA.profile, teamB.profile)) {
        matchmakingQueue.unshift(teamA);
        matchmakingQueue.unshift(teamB);
        io.to(teamA.socketId).emit('match_rejected', { reason: 'Tier cap prevents Oracle-vs-Oracle matches.' });
        io.to(teamB.socketId).emit('match_rejected', { reason: 'Tier cap prevents Oracle-vs-Oracle matches.' });
        return;
      }

      const matchId = `match_${Date.now()}`;
      
      // Async compile dynamic MCQ case via Gemini or local fallback matrix
      const selectedCase = await fetchAndCompileCase();
      
      const pot = teamA.stake + teamB.stake;
      const behaviorMessage = 'Fast logic wins the vault. Focus on the anomaly, not the noise.';

      activeMatches[matchId] = {
        id: matchId,
        caseData: selectedCase,
        pot,
        status: 'ACTIVE',
        behaviorMessage,
        teams: {
          [teamA.socketId]: { socketId: teamA.socketId, name: teamA.syndicateName, userId: teamA.userId, tier: teamA.profile.tier, stake: teamA.stake, perk: teamA.perk, hintUsed: false, boostUsed: false },
          [teamB.socketId]: { socketId: teamB.socketId, name: teamB.syndicateName, userId: teamB.userId, tier: teamB.profile.tier, stake: teamB.stake, perk: teamB.perk, hintUsed: false, boostUsed: false }
        }
      };

      const socketA = io.sockets.sockets.get(teamA.socketId);
      const socketB = io.sockets.sockets.get(teamB.socketId);
      socketA?.join(matchId);
      socketB?.join(matchId);

      socketA?.emit('match_found', { matchId, opponent: teamB.syndicateName, caseData: selectedCase, role: 'TEAM_A', perk: teamA.perk, stake: teamA.stake, pot, behaviorMessage });
      socketB?.emit('match_found', { matchId, opponent: teamA.syndicateName, caseData: selectedCase, role: 'TEAM_B', perk: teamB.perk, stake: teamB.stake, pot, behaviorMessage });
    }
  });

  socket.on('request_hint', (data) => {
    const { matchId } = data;
    const currentMatch = activeMatches[matchId];
    if (!currentMatch || currentMatch.status !== 'ACTIVE') return;

    const player = currentMatch.teams[socket.id];
    if (!player || player.hintUsed) {
      socket.emit('hint_result', { success: false, message: 'Hint consumed or unavailable.' });
      return;
    }

    player.hintUsed = true;
    socket.emit('hint_result', { success: true, hint: currentMatch.caseData.hint, message: `Perk active: ${player.perk.label}.` });

    if (player.perk.type === 'blind_opponent') {
      const opponentSocketId = Object.keys(currentMatch.teams).find((id) => id !== socket.id);
      if (opponentSocketId) {
        io.to(opponentSocketId).emit('status_update', { message: 'Smoke Bomb activated by the rival team.' });
      }
    }

    if (player.perk.type === 'double_down' && !player.boostUsed) {
      player.boostUsed = true;
      currentMatch.pot = Math.round(currentMatch.pot * 1.25);
      socket.emit('perk_result', { success: true, message: `Double Down activated. Vault pot: ${currentMatch.pot} USDT.` });
    }
  });

  socket.on('submit_solution', (data) => {
    const { matchId, solution } = data;
    const currentMatch = activeMatches[matchId];
    if (!currentMatch || currentMatch.status !== 'ACTIVE') return;

    let isCorrect = false;
    const normalizedSolution = (solution || '').toString().trim();

    if (currentMatch.caseData && currentMatch.caseData.correctOption) {
      const submitted = normalizedSolution.toUpperCase();
      if (submitted === currentMatch.caseData.correctOption.toUpperCase()) isCorrect = true;
    } else {
      isCorrect = currentMatch.caseData.solutionKeywords.some((kw) => normalizedSolution.toLowerCase().includes(kw));
    }

    socket.emit('solution_result', { correct: isCorrect, message: isCorrect ? 'Correct.' : 'No exploit vector detected.' });

    if (!isCorrect) return;

    currentMatch.status = 'COMPLETED';
    const winnerSocketId = socket.id;
    const loserSocketId = Object.keys(currentMatch.teams).find((id) => id !== winnerSocketId);
    
    let winnerStats = null;
    if (users[currentMatch.teams[winnerSocketId].userId]) {
      winnerStats = updateUserAfterMatch(users[currentMatch.teams[winnerSocketId].userId], currentMatch.teams[winnerSocketId].stake, true);
    }
    if (loserSocketId && users[currentMatch.teams[loserSocketId].userId]) {
      updateUserAfterMatch(users[currentMatch.teams[loserSocketId].userId], currentMatch.teams[loserSocketId].stake, false);
    }

    io.to(winnerSocketId).emit('game_over', { result: 'WON', looted: currentMatch.pot, repGain: winnerStats?.repGain || 0, newTier: winnerStats?.tier || 'Degenerate' });
    if (loserSocketId) io.to(loserSocketId).emit('game_over', { result: 'LOST', looted: 0 });

    delete activeMatches[matchId];
  });

  socket.on('glory_shared', () => {
    const team = Object.values(activeMatches).flatMap((m) => Object.values(m.teams)).find((entry) => entry.socketId === socket.id);
    const userId = team ? team.userId : '1'; // Default backup fallback mapping profile 
    if (users[userId]) {
      users[userId].rep += 20;
      users[userId].tier = getTier(users[userId].rep);
      socket.emit('share_ack', { repGain: 20, newTier: users[userId].tier, message: 'Social sharing parameters verified. Unlocked XP buffer.' });
    }
  });

  socket.on('disconnect', () => {
    const idx = matchmakingQueue.findIndex((item) => item.socketId === socket.id);
    if (idx !== -1) matchmakingQueue.splice(idx, 1);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Swifty Circle Backend operational on port ${PORT}`));