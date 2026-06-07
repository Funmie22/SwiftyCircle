// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';

// const tg = window.Telegram?.WebApp;
// const BACKEND_URL = 'http://localhost:5000';
// const urlParams = new URLSearchParams(window.location.search);
// const defaultUserId = urlParams.get('user') || '1';
// const defaultName = urlParams.get('name') || (defaultUserId === '2' ? 'Satoshi Osun' : 'Ada Lovelace');
// const mockPlayers = {
//   '1': { id: '1', name: 'Ada Lovelace', rep: 1250, tier: 'Apex Trader', streak: 5, volume: 15400 },
//   '2': { id: '2', name: 'Satoshi Osun', rep: 320, tier: 'Apprentice', streak: 2, volume: 450 }
// };

// const tierData = [
//   { name: 'Degenerate', color: 'text-emerald-400', min: 0, max: 199 },
//   { name: 'Apprentice', color: 'text-sky-400', min: 200, max: 499 },
//   { name: 'Strategist', color: 'text-violet-400', min: 500, max: 999 },
//   { name: 'Apex Trader', color: 'text-orange-400', min: 1000, max: 2499 },
//   { name: 'The Oracle', color: 'text-red-400', min: 2500, max: Infinity }
// ];

// export default function App() {
//   const [activeTab, setActiveTab] = useState('passport');
//   const [selectedMock, setSelectedMock] = useState(defaultUserId);
//   const [userProfile, setUserProfile] = useState({
//     ...mockPlayers[defaultUserId],
//     id: defaultUserId
//   });
//   const [syndicateName, setSyndicateName] = useState(defaultName.replace(/\s+/g, '_').toUpperCase());
//   const [stake, setStake] = useState(100);
//   const [isSearching, setIsSearching] = useState(false);
//   const [currentMatch, setCurrentMatch] = useState(null);
//   const [solutionInput, setSolutionInput] = useState('');
//   const [gameResult, setGameResult] = useState(null);
//   const [lootedCrypto, setLootedCrypto] = useState(0);
//   const [feedbackState, setFeedbackState] = useState('');
//   const [hintMessage, setHintMessage] = useState('');
//   const [correctAnswer, setCorrectAnswer] = useState(null);
//   const [shareAck, setShareAck] = useState('');
//   const [behaviorMessage, setBehaviorMessage] = useState('');
//   const [storyExportMessage, setStoryExportMessage] = useState('');
//   const socketRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     tg?.ready();
//     tg?.expand();

//     const profile = mockPlayers[selectedMock] || mockPlayers['1'];
//     setUserProfile(profile);
//     setSyndicateName(profile.name.replace(/\s+/g, '_').toUpperCase());

//     fetch(`${BACKEND_URL}/api/user/${profile.id}`)
//       .then((response) => response.json())
//       .then((data) => setUserProfile(data))
//       .catch(() => {});

//     socketRef.current = io(BACKEND_URL);

//     socketRef.current.on('match_found', (data) => {
//       tg?.HapticFeedback?.notificationOccurred('success');
//       setCurrentMatch({
//         ...data,
//         perk: data?.perk || { label: 'Unknown', description: '', type: 'hint' },
//         caseData: data?.caseData || { title: 'Unknown Case', briefing: '', evidence: '', solutionHash: '', clue: '' }
//       });
//       setGameResult(null);
//       setLootedCrypto(0);
//       setIsSearching(false);
//       setActiveTab('terminal');
//       setHintMessage('');
//       setBehaviorMessage(data?.behaviorMessage || 'Focus on the logic and move fast.');
//       setShareAck('');
//       setStoryExportMessage('');
//     });

//     socketRef.current.on('match_rejected', (data) => {
//       alert(data.reason);
//       setIsSearching(false);
//     });

//     socketRef.current.on('solution_result', (data) => {
//       setCorrectAnswer(data.correctOption ? { key: data.correctOption, text: data.correctText } : null);
//       if (data.correct) {
//         tg?.HapticFeedback?.notificationOccurred('success');
//         setFeedbackState('correct');
//         setHintMessage(data.message || 'Correct.');
//         setTimeout(() => setFeedbackState(''), 800);
//       } else {
//         tg?.HapticFeedback?.notificationOccurred('error');
//         setFeedbackState('incorrect');
//         setHintMessage(data.message || 'No exploit vector found. Try again.');
//         setTimeout(() => setFeedbackState(''), 800);
//       }
//     });

//     socketRef.current.on('hint_result', (data) => {
//       setHintMessage(data.hint || data.message);
//       if (!data.success) tg?.HapticFeedback?.notificationOccurred('error');
//     });

//     socketRef.current.on('perk_result', (data) => {
//       setHintMessage(data.message);
//     });

//     socketRef.current.on('status_update', (data) => {
//       setHintMessage(data.message);
//     });

//     socketRef.current.on('share_ack', (data) => {
//       setShareAck(data.message);
//       if (data.repGain) {
//         setUserProfile((prev) => ({ ...prev, rep: prev.rep + data.repGain, tier: data.newTier || prev.tier }));
//       }
//     });

//     socketRef.current.on('game_over', (data) => {
//       if (data.result === 'WON') tg?.HapticFeedback?.notificationOccurred('success');
//       else tg?.HapticFeedback?.notificationOccurred('error');
//       setGameResult(data.result);
//       setLootedCrypto(data.looted);
//       setBehaviorMessage(data.summaryMessage || data.behaviorMessage || 'Operations sequence termination log finalized.');
//       if (data.newTier) {
//         setUserProfile((prev) => ({ ...prev, tier: data.newTier, rep: prev.rep + (data.repGain || 0) }));
//       }
//       fetch(`${BACKEND_URL}/api/user/${selectedMock}`)
//         .then((response) => response.json())
//         .then((data) => setUserProfile(data))
//         .catch(() => {});
//     });

//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [selectedMock]);

//   const getTierProgress = () => {
//     const activeTier = tierData.find((tier) => tier.name === userProfile.tier) || tierData[0];
//     const nextTier = tierData.find((tier) => tier.min > activeTier.min);
//     if (!nextTier) return 100;
//     return Math.min(100, Math.round(((userProfile.rep - activeTier.min) / (nextTier.min - activeTier.min)) * 100));
//   };

//   const triggerQueueRegistration = () => {
//     if (!syndicateName.trim()) return alert('Please establish a Syndicate Name designation first.');
//     setIsSearching(true);
//     tg?.HapticFeedback?.impactOccurred('medium');
//     socketRef.current.emit('join_queue', { userId: userProfile.id, syndicateName, stake });
//   };

//   const transmitSolutionPayload = () => {
//     if (!solutionInput.trim()) return;
//     socketRef.current.emit('submit_solution', { matchId: currentMatch.matchId, solution: solutionInput });
//   };

//   const submitMCQ = (option) => {
//     if (!currentMatch) return;
//     socketRef.current.emit('submit_solution', { matchId: currentMatch.matchId, solution: option });
//   };

//   const requestHint = () => {
//     if (!currentMatch) return;
//     socketRef.current.emit('request_hint', { matchId: currentMatch.matchId });
//   };

//   const shareGloryToTwitter = () => {
//     if (!currentMatch) return;
//     const textStr = `🕵️‍♂️ CASE CRACKED! My Syndicate [${syndicateName}] solved "${currentMatch.caseData.title}" inside the Swifty Circle Cyber Vault Arena!\n\nWe raided $${lootedCrypto} test tokens and our tier is ${userProfile.tier}. Step up your game.\n\nPlay here: t.me/SwiftyExBot/app`;
//     const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textStr)}`;
//     if (tg?.openLink) tg.openLink(shareUrl);
//     else window.open(shareUrl, '_blank');
//   };

//   const resetToPassport = () => {
//     setCurrentMatch(null);
//     setGameResult(null);
//     setSolutionInput('');
//     setHintMessage('');
//     setActiveTab('passport');
//   };

//   const exportGloryStory = () => {
//     if (!canvasRef.current || !currentMatch) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.fillStyle = '#030712';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#0f766e';
//     ctx.fillRect(40, 40, canvas.width - 80, 220);
//     ctx.fillStyle = '#ffffff';
//     ctx.font = '32px Courier New';
//     ctx.fillText('SWIFTY CIRCLE', 60, 100);
//     ctx.font = '22px Courier New';
//     ctx.fillText(`SYNDICATE: ${syndicateName || 'ANONYMOUS'}`, 60, 150);
//     ctx.fillText(`RESULT: ${gameResult}`, 60, 190);
//     ctx.fillText(`LOOTED: $${lootedCrypto} USDT`, 60, 230);
//     ctx.fillText(`CASE: ${currentMatch.caseData.title}`, 60, 270);
//     ctx.fillText(`TIER: ${userProfile.tier}`, 60, 310);
//     ctx.fillStyle = '#10b981';
//     ctx.fillRect(40, 340, canvas.width - 80, 36);
//     ctx.fillStyle = '#020617';
//     ctx.font = '24px Courier New';
//     ctx.fillText('GLORY CARD', 60, 368);

//     const link = document.createElement('a');
//     link.href = canvas.toDataURL('image/png');
//     link.download = 'swifty-circle-story.png';
//     link.click();
//     setStoryExportMessage('Story image exported to your device.');
//   };

//   return (
//     <div className="min-h-screen bg-black text-zinc-100 px-4 py-6 sm:px-6">
//       <header className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl shadow-green-900/10 backdrop-blur-xl">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <p className="text-xs uppercase tracking-[0.4em] text-green-400">SWIFTY//CIRCLE</p>
//             <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Circle Reputation Terminal</h1>
//           </div>
//           <div className="rounded-3xl border border-zinc-800 bg-black/80 px-4 py-3 text-sm text-green-400">
//             Rep: <span className="font-semibold text-white">{userProfile.rep}</span>
//           </div>
//         </div>
//       </header>

//       <section className="mx-auto mt-4 max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300 shadow-lg shadow-zinc-950/30">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <p className="font-semibold text-white">Mock Match Mode</p>
//             <p className="text-xs text-zinc-500">Select a mock player profile for local testing.</p>
//           </div>
//           <select
//             value={selectedMock}
//             onChange={(e) => setSelectedMock(e.target.value)}
//             className="w-full max-w-xs rounded-3xl border border-zinc-800 bg-black/90 px-4 py-3 text-sm text-green-300 outline-none transition focus:border-green-500"
//           >
//             <option value="1">Player 1 — Ada Lovelace</option>
//             <option value="2">Player 2 — Satoshi Osun</option>
//           </select>
//         </div>
//       </section>

//       <main className="mx-auto mt-6 grid max-w-5xl gap-6">
//         {activeTab === 'passport' && (
//           <section className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-xl shadow-green-950/20">
//             <div className="grid gap-6 lg:grid-cols-3">
//               <div className="rounded-3xl border border-zinc-800 bg-black/70 p-5">
//                 <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Ecosystem Identity Card</p>
//                 <h2 className="mt-4 text-2xl font-semibold text-white">{userProfile.name}</h2>
//                 <div className="mt-5 space-y-4 text-sm text-zinc-300">
//                   <div>
//                     <p className="text-zinc-500">Trader Status Rank</p>
//                     <p className="mt-1 font-semibold text-green-300">{userProfile.tier}</p>
//                   </div>
//                   <div>
//                     <p className="text-zinc-500">Activity Chain Streak</p>
//                     <p className="mt-1 text-white">🔥 {userProfile.streak} Days active</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-3xl border border-zinc-800 bg-black/70 p-5 lg:col-span-2">
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
//                     <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Gross Aggregated Volume</p>
//                     <p className="mt-3 text-2xl font-semibold text-white">${userProfile.volume.toLocaleString()}</p>
//                   </div>
//                   <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
//                     <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Ranking Momentum</p>
//                     <p className="mt-3 text-2xl font-semibold text-white">Top 4.2%</p>
//                   </div>
//                 </div>
//                 <div className="mt-6 rounded-3xl border border-green-600/20 bg-green-950/40 p-4 text-sm text-green-200">
//                   <p className="font-semibold">💡 Inline Telegram Networking Flex Enabled</p>
//                   <p className="mt-2 text-zinc-300">Type @SwiftyExBot in any private group chat to drop a live “Circle” card of your tier, volume, and rank.</p>
//                 </div>
//                 <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-200">
//                   <p className="font-semibold text-white">Tier Progress</p>
//                   <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
//                     <div className="h-3 rounded-full bg-green-400" style={{ width: `${getTierProgress()}%` }} />
//                   </div>
//                   <p className="mt-3 text-zinc-400">Next tier goal: <span className="text-white">{userProfile.nextTier?.name || 'Maxed'}</span>{userProfile.nextTier ? ` at ${userProfile.nextTier.threshold} Rep` : ''}</p>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {activeTab === 'agency' && (
//           <section className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-xl shadow-green-950/20">
//             <div className="space-y-4">
//               <div>
//                 <p className="text-xs uppercase tracking-[0.3em] text-green-400">The Cyber Raid Tactical Operations Terminal</p>
//                 <h2 className="mt-3 text-2xl font-semibold text-white">Launch a Syndicate Matchmaking Run</h2>
//                 <p className="mt-2 text-sm leading-6 text-zinc-400">Form a balanced raid crew. Each match enforces tier controls and stakes a micro-escrow vault for the winning team.</p>
//               </div>
//               {!isSearching ? (
//                 <div className="space-y-4">
//                   <p className="text-xs text-zinc-500">Tip: open one tab at `...?user=1` and another at `...?user=2` to simulate two different traders.</p>
//                   <label className="block text-sm text-zinc-400">Register Tactical Call Sign (Syndicate Name)</label>
//                   <input
//                     value={syndicateName}
//                     onChange={(e) => setSyndicateName(e.target.value)}
//                     placeholder="e.g., OSUN_RUG_HUNTERS"
//                     className="w-full rounded-3xl border border-zinc-800 bg-black/80 px-4 py-3 text-sm text-green-400 outline-none transition focus:border-green-500"
//                   />
//                   <label className="block text-sm text-zinc-400">Staging Token Stake</label>
//                   <select
//                     value={stake}
//                     onChange={(e) => setStake(Number(e.target.value))}
//                     className="w-full rounded-3xl border border-zinc-800 bg-black/80 px-4 py-3 text-sm text-green-400 outline-none transition focus:border-green-500"
//                   >
//                     <option value={100}>100 USDT</option>
//                     <option value={150}>150 USDT</option>
//                     <option value={200}>200 USDT</option>
//                   </select>
//                   <button
//                     onClick={triggerQueueRegistration}
//                     className="inline-flex items-center justify-center rounded-3xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
//                   >
//                     INITIALIZE MATCHMAKING QUEUE
//                   </button>
//                 </div>
//               ) : (
//                 <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-sm text-zinc-300">
//                   <p className="font-semibold text-green-300">Scanning Network Arrays...</p>
//                   <p className="mt-3">Synchronizing telemetry data matrices with target queue networks. Standby for immediate deployment link...</p>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//         {activeTab === 'terminal' && (
//           <section className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-xl shadow-green-950/20">
//             {!currentMatch ? (
//               <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-center text-zinc-300">
//                 <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Waiting for Match</p>
//                 <p className="mt-4 text-sm">No active match detected yet. Make sure the other tab is also registered and ready.</p>
//                 <p className="mt-3 text-xs text-zinc-500">Use `?user=1` and `?user=2` in separate tabs for reliable mock matchmaking.</p>
//               </div>
//             ) : !gameResult ? (
//               <div className="space-y-6">
//                 <div className="rounded-3xl border border-zinc-800 bg-black/70 p-5">
//                   <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Active Match Metrics Banner</p>
//                   <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                     <p className="text-sm text-white">CREW: {syndicateName || 'Unknown Syndicate'}</p>
//                     <p className="text-sm text-green-300">VS [ {currentMatch?.opponent || 'Unknown Opponent'} ]</p>
//                   </div>
//                   <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-400">
//                     <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">Stake: {currentMatch?.stake ?? 0} USDT</span>
//                     <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">Vault: {currentMatch?.pot ?? 0} USDT</span>
//                     <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">Perk: {currentMatch?.perk?.label || 'Unknown'}</span>
//                   </div>
//                 </div>
//                 <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
//                   <h3 className="text-xl font-semibold text-white">{currentMatch?.caseData?.title || 'Untitled Case'}</h3>
//                   <p className="mt-3 text-sm leading-7 text-zinc-300">{currentMatch?.caseData?.briefing || 'Briefing not available.'}</p>
//                   <div className="mt-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-200">
//                     <p className="text-zinc-400">⚠️ SECURE EVIDENCE ARRAYS:</p>
//                     <p className="mt-2">{currentMatch?.caseData?.evidence || 'Evidence unavailable.'}</p>
//                     <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">Signature</p>
//                     <p className="text-zinc-400">{currentMatch?.caseData?.solutionHash || '-----'}</p>
//                   </div>
//                 </div>
//                 <div className="rounded-3xl border border-zinc-800 bg-black/70 p-5">
//                   <p className="text-sm text-green-300">🕵️‍♂️ Analyst Intelligence Matrix Note:</p>
//                   <p className="mt-2 text-zinc-300">{currentMatch?.caseData?.clue || 'No clue provided.'}</p>
//                 </div>
//                 {hintMessage && (
//                   <div className="rounded-3xl border border-amber-600 bg-amber-950/20 p-4 text-sm text-amber-200">
//                     <p className="font-semibold">AI Diagnostic Signal</p>
//                     <p className="mt-2">{hintMessage}</p>
//                   </div>
//                 )}
//                 <div className="space-y-4">
//                   {currentMatch?.caseData?.choices ? (
//                     <div className="grid gap-3">
//                       {currentMatch.caseData.choices.map((c) => (
//                         <button
//                           key={c.key}
//                           onClick={() => submitMCQ(c.key)}
//                           className="w-full text-left rounded-3xl border border-zinc-800 bg-black/80 px-4 py-3 text-sm text-green-300 hover:border-green-400"
//                         >
//                           <strong className="mr-3">{c.key}.</strong> {c.text}
//                         </button>
//                       ))}
//                       <div className="grid gap-3 sm:grid-cols-2">
//                         <button
//                           onClick={requestHint}
//                           className="inline-flex items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-green-400"
//                         >
//                           ACTIVATE PERK / REQUEST HINT
//                         </button>
//                         <button
//                           onClick={() => {
//                             const shareMessage = `My crew just locked and deployed inside Swifty Circle Cyber Vault arena matches! Join the operations ring: t.me/SwiftyExBot/app`;
//                             navigator.clipboard.writeText(shareMessage);
//                             tg?.HapticFeedback?.notificationOccurred('success');
//                             setShareAck('Campaign flex parameters copied to clipboard.');
//                           }}
//                           className="inline-flex items-center justify-center rounded-3xl bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800"
//                         >
//                           COPY VIRAL STORY LINK
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <textarea
//                         value={solutionInput}
//                         onChange={(e) => setSolutionInput(e.target.value)}
//                         placeholder="Specify target vulnerability vector name..."
//                         className={`w-full rounded-3xl border px-4 py-4 text-sm text-green-300 bg-zinc-950/90 outline-none transition ${feedbackState === 'incorrect' ? 'border-red-500' : 'border-zinc-800'}`}
//                         rows={5}
//                       />
//                       <div className="grid gap-3 sm:grid-cols-3">
//                         <button
//                           onClick={transmitSolutionPayload}
//                           className="inline-flex items-center justify-center rounded-3xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
//                         >
//                           TRANSMIT ANALYTICAL DISCOVERY SOLUTION
//                         </button>
//                         <button
//                           onClick={requestHint}
//                           className="inline-flex items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-green-400"
//                         >
//                           ACTIVATE PERK / REQUEST HINT
//                         </button>
//                         <button
//                           onClick={() => {
//                             const shareMessage = `My crew just locked and deployed inside Swifty Circle Cyber Vault arena matches! Join the operations ring: t.me/SwiftyExBot/app`;
//                             navigator.clipboard.writeText(shareMessage);
//                             tg?.HapticFeedback?.notificationOccurred('success');
//                             setShareAck('Campaign flex parameters copied to clipboard.');
//                           }}
//                           className="inline-flex items-center justify-center rounded-3xl bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800"
//                         >
//                           COPY VIRAL STORY LINK
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-center">
//                   <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Mission Status</p>
//                   <h2 className="mt-4 text-3xl font-semibold text-white">{gameResult === 'WON' ? 'MISSION_SUCCESS' : 'MISSION_FAILED'}</h2>
//                   <p className="mt-3 text-sm text-zinc-400">{behaviorMessage || 'Operations sequence termination log finalized.'}</p>
//                 </div>
//                 <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:grid-cols-2">
//                   <div>
//                     <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Escrow Liquidity Looted</p>
//                     <p className="mt-3 text-3xl font-semibold text-white">${lootedCrypto} USDT</p>
//                   </div>
//                   <div>
//                     <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Experience Outcome</p>
//                     <p className="mt-3 text-2xl font-semibold text-green-300">{gameResult === 'WON' ? '+150 Swifty Circle XP Retributed' : '0 XP Multiplier Applied'}</p>
//                   </div>
//                 </div>
//                 {gameResult === 'WON' && (
//                   <div className="grid gap-3 sm:grid-cols-2">
//                     <button
//                       onClick={shareGloryToTwitter}
//                       className="w-full rounded-3xl bg-blue-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-blue-400"
//                     >
//                       SHARE GLORY ON 𝕏 (TWITTER)
//                     </button>
//                     <button
//                       onClick={() => {
//                         socketRef.current.emit('glory_shared');
//                       }}
//                       className="w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
//                     >
//                       CLAIM SOCIAL MULTIPLIER BUFF
//                     </button>
//                   </div>
//                 )}
//                 <button
//                   onClick={exportGloryStory}
//                   className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
//                 >
//                   EXPORT 9:16 STORY CARD
//                 </button>
//                 {storyExportMessage && <p className="text-sm text-green-300">{storyExportMessage}</p>}
//                 {shareAck && <p className="text-sm text-emerald-300">{shareAck}</p>}
//                 <button
//                   onClick={resetToPassport}
//                   className="w-full rounded-3xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800"
//                 >
//                   RETURN TO OPERATIONS BASE
//                 </button>
//               </div>
//             )}
//           </section>
//         )}
//       </main>

//       <footer className="mx-auto mt-8 max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950/90 p-2 shadow-2xl shadow-green-900/10">
//         <div className="grid grid-cols-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
//           <button
//             onClick={() => !currentMatch && setActiveTab('passport')}
//             className={`py-4 transition ${activeTab === 'passport' ? 'text-green-400 bg-zinc-950' : 'text-zinc-500'} ${currentMatch ? 'opacity-30 cursor-not-allowed' : ''}`}
//             disabled={Boolean(currentMatch)}
//           >
//             Identity Passport
//           </button>
//           <button
//             onClick={() => !currentMatch && setActiveTab('agency')}
//             className={`py-4 transition ${activeTab === 'agency' || activeTab === 'terminal' ? 'text-green-400 bg-zinc-950' : 'text-zinc-500'} ${currentMatch ? 'opacity-30 cursor-not-allowed' : ''}`}
//             disabled={Boolean(currentMatch)}
//           >
//             Tactical Agency
//           </button>
//         </div>
//       </footer>
//       <canvas ref={canvasRef} width={720} height={1280} className="hidden" />
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const tg = window.Telegram?.WebApp;

// ✅ FIXED: hardcoded backend so Render works immediately
const BACKEND_URL = "https://swiftycircle.onrender.com";

const urlParams = new URLSearchParams(window.location.search);
const defaultUserId = urlParams.get('user') || '1';
const defaultName =
  urlParams.get('name') ||
  (defaultUserId === '2' ? 'Satoshi Osun' : 'Ada Lovelace');

const mockPlayers = {
  '1': { id: '1', name: 'Ada Lovelace', rep: 1250, tier: 'Apex Trader', streak: 5, volume: 15400 },
  '2': { id: '2', name: 'Satoshi Osun', rep: 320, tier: 'Apprentice', streak: 2, volume: 450 }
};

const tierData = [
  { name: 'Degenerate', min: 0 },
  { name: 'Apprentice', min: 200 },
  { name: 'Strategist', min: 500 },
  { name: 'Apex Trader', min: 1000 },
  { name: 'The Oracle', min: 2500 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('passport');
  const [selectedMock, setSelectedMock] = useState(defaultUserId);

  const [userProfile, setUserProfile] = useState({
    ...mockPlayers[defaultUserId],
    id: defaultUserId
  });

  const [syndicateName, setSyndicateName] = useState(
    defaultName.replace(/\s+/g, '_').toUpperCase()
  );

  const [stake, setStake] = useState(100);
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [solutionInput, setSolutionInput] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [lootedCrypto, setLootedCrypto] = useState(0);
  const [hintMessage, setHintMessage] = useState('');

  const socketRef = useRef(null);
  const canvasRef = useRef(null);

  // ================= SOCKET + INIT =================
  useEffect(() => {
    tg?.ready();
    tg?.expand();

    const profile = mockPlayers[selectedMock] || mockPlayers['1'];

    setUserProfile(profile);
    setSyndicateName(profile.name.replace(/\s+/g, '_').toUpperCase());

    setCurrentMatch(null);
    setGameResult(null);
    setIsSearching(false);
    setSolutionInput('');
    setHintMessage('');
    setActiveTab('passport');

    // API call (safe fallback)
    fetch(`${BACKEND_URL}/api/user/${profile.id}`)
      .then((res) => res.json())
      .then((data) => setUserProfile(data))
      .catch(() => {});

    // SOCKET CONNECT
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('match_found', (data) => {
      tg?.HapticFeedback?.notificationOccurred('success');

      setCurrentMatch(data);
      setGameResult(null);
      setIsSearching(false);
      setActiveTab('terminal');
    });

    socketRef.current.on('match_rejected', (data) => {
      alert(data.reason);
      setIsSearching(false);
    });

    socketRef.current.on('solution_result', (data) => {
      setHintMessage(data.message);
    });

    socketRef.current.on('game_over', (data) => {
      setGameResult(data.result);
      setLootedCrypto(data.looted ?? 0);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedMock]);

  // ================= ACTIONS =================
  const triggerQueueRegistration = () => {
    if (!syndicateName.trim()) return;

    setIsSearching(true);

    socketRef.current.emit('join_queue', {
      userId: userProfile.id,
      syndicateName,
      stake
    });
  };

  const transmitSolutionPayload = () => {
    if (!solutionInput.trim() || !currentMatch) return;

    socketRef.current.emit('submit_solution', {
      matchId: currentMatch.matchId,
      solution: solutionInput
    });
  };

  const requestHint = () => {
    if (!currentMatch) return;

    socketRef.current.emit('request_hint', {
      matchId: currentMatch.matchId
    });
  };

  const resetToPassport = () => {
    setCurrentMatch(null);
    setGameResult(null);
    setActiveTab('passport');
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Swifty Circle</h1>
        <p className="text-green-400">Rep: {userProfile.rep}</p>
      </div>

      {/* MOCK SELECT */}
      <select
        value={selectedMock}
        onChange={(e) => setSelectedMock(e.target.value)}
        className="p-2 bg-gray-900 border border-gray-700 mb-4"
      >
        <option value="1">Ada Lovelace</option>
        <option value="2">Satoshi Osun</option>
      </select>

      {/* QUEUE */}
      {!isSearching && !currentMatch && (
        <div className="space-y-3">
          <input
            value={syndicateName}
            onChange={(e) => setSyndicateName(e.target.value)}
            className="w-full p-2 bg-gray-900"
          />

          <select
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="w-full p-2 bg-gray-900"
          >
            <option value={100}>100 USDT</option>
            <option value={150}>150 USDT</option>
            <option value={200}>200 USDT</option>
          </select>

          <button
            onClick={triggerQueueRegistration}
            className="bg-green-500 text-black px-4 py-2"
          >
            Join Matchmaking
          </button>
        </div>
      )}

      {/* MATCH */}
      {currentMatch && !gameResult && (
        <div className="mt-6 space-y-3">
          <h2 className="text-xl">Match Found</h2>

          <p>{currentMatch.caseData?.title}</p>

          <textarea
            value={solutionInput}
            onChange={(e) => setSolutionInput(e.target.value)}
            className="w-full p-2 bg-gray-900"
          />

          <button
            onClick={transmitSolutionPayload}
            className="bg-green-500 text-black px-4 py-2"
          >
            Submit Solution
          </button>

          <button
            onClick={requestHint}
            className="bg-gray-700 px-4 py-2 ml-2"
          >
            Hint
          </button>

          {hintMessage && (
            <p className="text-yellow-400 mt-2">{hintMessage}</p>
          )}
        </div>
      )}

      {/* RESULT */}
      {gameResult && (
        <div className="mt-6">
          <h2 className="text-2xl">
            {gameResult === 'WON' ? 'YOU WON' : 'YOU LOST'}
          </h2>

          <p>Looted: ${lootedCrypto}</p>

          <button
            onClick={resetToPassport}
            className="mt-4 bg-gray-800 px-4 py-2"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}