import { useState, useEffect } from 'react';
import { FaUndo, FaTrophy, FaPlus, FaMinus, FaArrowLeft, FaSyncAlt, FaUserPlus, FaTrash, FaListAlt, FaExchangeAlt, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

export default function Scoreboard({ onBack }) {
    // Match State with LocalStorage
    const [team1Name, setTeam1Name] = useState(() => localStorage.getItem('ps_team1Name') || 'Team Alpha');
    const [team2Name, setTeam2Name] = useState(() => localStorage.getItem('ps_team2Name') || 'Team Beta');
    const [score1, setScore1] = useState(() => parseInt(localStorage.getItem('ps_score1') || '0', 10));
    const [score2, setScore2] = useState(() => parseInt(localStorage.getItem('ps_score2') || '0', 10));
    const [serving, setServing] = useState(() => localStorage.getItem('ps_serving') || 'team1');
    const [serverNum, setServerNum] = useState(() => parseInt(localStorage.getItem('ps_serverNum') || '1', 10)); // 1 or 2
    const [targetScore, setTargetScore] = useState(() => parseInt(localStorage.getItem('ps_targetScore') || '11', 10));
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('ps_sound') !== 'false');
    
    // Sets / Games tracking
    const [setNumber, setSetNumber] = useState(() => parseInt(localStorage.getItem('ps_setNumber') || '1', 10));
    const [setsWon1, setSetsWon1] = useState(() => parseInt(localStorage.getItem('ps_setsWon1') || '0', 10));
    const [setsWon2, setSetsWon2] = useState(() => parseInt(localStorage.getItem('ps_setsWon2') || '0', 10));
    const [matchWinner, setMatchWinner] = useState(() => localStorage.getItem('ps_winner') || null);

    // Queue / Next up state
    const [newQueueName, setNewQueueName] = useState('');
    const [queueList, setQueueList] = useState(() => {
        const saved = localStorage.getItem('ps_queueList');
        return saved ? JSON.parse(saved) : [];
    });

    // History stack for Undo
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('ps_history');
        return saved ? JSON.parse(saved) : [];
    });

    // Audio beep simulation using Web Audio API (No external assets required)
    const playBeep = (highPitch = false) => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(highPitch ? 880 : 440, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // AudioContext not allowed or supported without gesture
        }
    };

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('ps_team1Name', team1Name);
        localStorage.setItem('ps_team2Name', team2Name);
        localStorage.setItem('ps_score1', score1.toString());
        localStorage.setItem('ps_score2', score2.toString());
        localStorage.setItem('ps_serving', serving);
        localStorage.setItem('ps_serverNum', serverNum.toString());
        localStorage.setItem('ps_targetScore', targetScore.toString());
        localStorage.setItem('ps_setNumber', setNumber.toString());
        localStorage.setItem('ps_setsWon1', setsWon1.toString());
        localStorage.setItem('ps_setsWon2', setsWon2.toString());
        localStorage.setItem('ps_winner', matchWinner || '');
        localStorage.setItem('ps_sound', soundEnabled.toString());
        localStorage.setItem('ps_history', JSON.stringify(history));
        localStorage.setItem('ps_queueList', JSON.stringify(queueList));
    }, [team1Name, team2Name, score1, score2, serving, serverNum, targetScore, setNumber, setsWon1, setsWon2, matchWinner, soundEnabled, history, queueList]);

    // Keep screen awake via Wake Lock API
    useEffect(() => {
        let wakeLock = null;
        async function requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch (err) {
                // Ignore wake lock errors
            }
        }
        requestWakeLock();
        return () => {
            if (wakeLock) wakeLock.release();
        };
    }, []);

    const pushHistory = () => {
        setHistory(prev => [...prev, { score1, score2, serving, serverNum, setNumber, setsWon1, setsWon2, matchWinner, team1Name, team2Name }]);
    };

    // Professional Win Check & Set Increment
    const checkWinCondition = (s1, s2) => {
        if ((s1 >= targetScore || s2 >= targetScore) && Math.abs(s1 - s2) >= 2) {
            playBeep(true);
            const t1Won = s1 > s2;
            const newSets1 = setsWon1 + (t1Won ? 1 : 0);
            const newSets2 = setsWon2 + (!t1Won ? 1 : 0);
            
            setSetsWon1(newSets1);
            setSetsWon2(newSets2);

            // Best of 3 match evaluation (First to win 2 sets)
            if (newSets1 >= 2 || newSets2 >= 2) {
                setMatchWinner(newSets1 > newSets2 ? team1Name : team2Name);
            } else {
                // Advance to next set automatically
                setSetNumber(prev => prev + 1);
                setScore1(0);
                setScore2(0);
                setServing(t1Won ? 'team1' : 'team2'); // Winner serves next set
                setServerNum(1);
            }
        } else {
            setMatchWinner(null);
        }
    };

    const addPoint = (team) => {
        if (matchWinner) return;
        pushHistory();
        playBeep(false);

        if (team === 1) {
            const nextScore1 = score1 + 1;
            setScore1(nextScore1);
            if (serving !== 'team1') {
                setServing('team1');
                setServerNum(1);
            }
            checkWinCondition(nextScore1, score2);
        } else {
            const nextScore2 = score2 + 1;
            setScore2(nextScore2);
            if (serving !== 'team2') {
                setServing('team2');
                setServerNum(1);
            }
            checkWinCondition(score1, nextScore2);
        }
    };

    const subPoint = (team) => {
        if (matchWinner) return;
        pushHistory();
        if (team === 1 && score1 > 0) {
            setScore1(score1 - 1);
        } else if (team === 2 && score2 > 0) {
            setScore2(score2 - 1);
        }
    };

    const switchSides = () => {
        pushHistory();
        const tempName = team1Name;
        const tempScore = score1;
        const tempSets = setsWon1;
        const tempServing = serving;

        setTeam1Name(team2Name);
        setTeam2Name(tempName);
        setScore1(score2);
        setScore2(tempScore);
        setSetsWon1(setsWon2);
        setSetsWon2(tempSets);
        setServing(tempServing === 'team1' ? 'team2' : 'team1');
    };

    const undoLast = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setScore1(lastState.score1);
        setScore2(lastState.score2);
        setServing(lastState.serving);
        setServerNum(lastState.serverNum);
        setSetNumber(lastState.setNumber);
        setSetsWon1(lastState.setsWon1);
        setSetsWon2(lastState.setsWon2);
        setMatchWinner(lastState.matchWinner);
        setTeam1Name(lastState.team1Name);
        setTeam2Name(lastState.team2Name);
        setHistory(prev => prev.slice(0, prev.length - 1));
    };

    const resetMatch = () => {
        pushHistory();
        setScore1(0);
        setScore2(0);
        setSetNumber(1);
        setSetsWon1(0);
        setSetsWon2(0);
        setServing('team1');
        setServerNum(1);
        setMatchWinner(null);
    };

    const clearLocalStorageMatch = () => {
        localStorage.clear();
        setScore1(0);
        setScore2(0);
        setSetNumber(1);
        setSetsWon1(0);
        setSetsWon2(0);
        setServing('team1');
        setServerNum(1);
        setMatchWinner(null);
        setHistory([]);
        setQueueList(['Player 1']);
    };

    // Queue handlers
    const addToQueue = (e) => {
        e.preventDefault();
        if (!newQueueName.trim()) return;
        setQueueList(prev => [...prev, newQueueName.trim()]);
        setNewQueueName('');
    };

    const removeFromQueue = (index) => {
        setQueueList(prev => prev.filter((_, i) => i !== index));
    };

    // Replace loser/winner with queue player and start a new match fresh
    const pickChallengerAndStartNewMatch = (queueIndex, targetTeamNum) => {
        if (queueList.length === 0) return;
        pushHistory();
        const nextChallenger = queueList[queueIndex];

        // Remove chosen challenger from queue
        setQueueList(prev => prev.filter((_, i) => i !== queueIndex));

        // Assign queue name to requested team slot and reset series for a new match
        if (targetTeamNum === 1) {
            setTeam1Name(nextChallenger);
        } else {
            setTeam2Name(nextChallenger);
        }

        // Fresh match reset
        setScore1(0);
        setScore2(0);
        setSetNumber(1);
        setSetsWon1(0);
        setSetsWon2(0);
        setServing('team1');
        setServerNum(1);
        setMatchWinner(null);
    };

    return (
        <section id="scoreboard" className="min-h-screen bg-gray-950 text-white py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
            <div className="max-w-5xl mx-auto w-full space-y-5">
                
                {/* Professional Header & Control Bar */}
                <div className="flex flex-wrap justify-between items-center bg-gray-900/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-gray-800/80 gap-3 shadow-2xl">
                    <button 
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold transition-all cursor-pointer border border-gray-700/60"
                    >
                        <FaArrowLeft className="w-3 h-3 text-emerald-400" /> Home
                    </button>
                    
                    {/* Center Match Status Indicators */}
                    <div className="flex items-center gap-4 bg-gray-950/60 border border-gray-800/60 px-4 py-1.5 rounded-xl text-xs font-extrabold tracking-wide">
                        <span className="text-emerald-400 uppercase tracking-widest text-[10px]">Set {setNumber} of 3</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-300">Sets: {setsWon1} - {setsWon2}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Audio Toggle */}
                        <button 
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer border border-gray-700/60"
                            title={soundEnabled ? "Mute Beep" : "Unmute Beep"}
                        >
                            {soundEnabled ? <FaVolumeUp className="w-3.5 h-3.5 text-emerald-400" /> : <FaVolumeMute className="w-3.5 h-3.5 text-gray-500" />}
                        </button>

                        {/* Switch Court Sides */}
                        <button 
                            onClick={switchSides}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold transition-all cursor-pointer border border-gray-700/60 text-gray-200"
                            title="Switch Sides"
                        >
                            <FaExchangeAlt className="w-3 h-3 text-emerald-400" /> Switch
                        </button>

                        <button 
                            onClick={undoLast}
                            disabled={history.length === 0}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-xs font-bold transition-all cursor-pointer border border-gray-700/60"
                        >
                            <FaUndo className="w-3 h-3 text-emerald-400" /> Undo
                        </button>
                        
                        <button 
                            onClick={resetMatch}
                            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer border border-gray-700/60"
                            title="Reset Match"
                        >
                            <FaSyncAlt className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Match Winner Banner */}
                {matchWinner && (
                    <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-emerald-500/20 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2 shadow-xl shadow-emerald-500/10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-gray-950 font-black mb-1 shadow-lg shadow-emerald-500/40">
                            <FaTrophy className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">{matchWinner} Wins the Match!</h2>
                        <p className="text-xs text-emerald-400 font-semibold tracking-wide">Select a queuing challenger below to replace a team and start a new match.</p>
                    </div>
                )}

                {/* Professional Dual Court Layout - Fixed non-overlapping header with win-state challenger picker */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Team 1 Score Card */}
                    <div className={`p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${
                        serving === 'team1' ? 'bg-gradient-to-b from-gray-900/90 to-gray-900/60 border-emerald-500/70 shadow-2xl shadow-emerald-500/15' : 'bg-gray-900/40 border-gray-800/80'
                    }`}>
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <input 
                                    type="text" 
                                    value={team1Name} 
                                    onChange={(e) => setTeam1Name(e.target.value)}
                                    className="bg-transparent font-black text-xl sm:text-2xl text-white border-b border-transparent hover:border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors pb-1 flex-1 min-w-[120px]"
                                />
                                
                                <div className="flex items-center gap-2">
                                    {serving === 'team1' && (
                                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-[9px] font-extrabold tracking-widest uppercase inline-flex items-center gap-1 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Serving ({serverNum})
                                        </span>
                                    )}
                                    <span className="text-[11px] font-black bg-gray-800 px-2.5 py-1 rounded-xl text-emerald-400 border border-gray-700/60 shrink-0">
                                        Sets: {setsWon1}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic queue handler options */}
                            {matchWinner && queueList.length > 0 ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Replace & Play New Match:</p>
                                    <select 
                                        defaultValue=""
                                        onChange={(e) => {
                                            if (e.target.value !== "") {
                                                pickChallengerAndStartNewMatch(parseInt(e.target.value, 10), 1);
                                            }
                                        }}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                                    >
                                        <option value="" disabled>Choose queued challenger...</option>
                                        {queueList.map((q, idx) => (
                                            <option key={idx} value={idx}>{q}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                queueList.length > 0 && (
                                    <button 
                                        onClick={() => swapNextToTeam(1)} 
                                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                                    >
                                        Swap next: {queueList[0]}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Huge Score Counter Container */}
                        <div className="py-8 text-center cursor-pointer select-none group" onClick={() => addPoint(1)}>
                            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all drop-shadow-md">
                                {score1}
                            </span>
                        </div>

                        {/* Interactive Plus / Minus Control Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => subPoint(1)}
                                className="py-4 rounded-2xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700/60 flex items-center justify-center text-gray-300 font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
                            >
                                <FaMinus className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => addPoint(1)}
                                className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                            >
                                <FaPlus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Team 2 Score Card */}
                    <div className={`p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${
                        serving === 'team2' ? 'bg-gradient-to-b from-gray-900/90 to-gray-900/60 border-emerald-500/70 shadow-2xl shadow-emerald-500/15' : 'bg-gray-900/40 border-gray-800/80'
                    }`}>
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <input 
                                    type="text" 
                                    value={team2Name} 
                                    onChange={(e) => setTeam2Name(e.target.value)}
                                    className="bg-transparent font-black text-xl sm:text-2xl text-white border-b border-transparent hover:border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors pb-1 flex-1 min-w-[120px]"
                                />
                                
                                <div className="flex items-center gap-2">
                                    {serving === 'team2' && (
                                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-[9px] font-extrabold tracking-widest uppercase inline-flex items-center gap-1 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Serving ({serverNum})
                                        </span>
                                    )}
                                    <span className="text-[11px] font-black bg-gray-800 px-2.5 py-1 rounded-xl text-emerald-400 border border-gray-700/60 shrink-0">
                                        Sets: {setsWon2}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic queue handler options */}
                            {matchWinner && queueList.length > 0 ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Replace & Play New Match:</p>
                                    <select 
                                        defaultValue=""
                                        onChange={(e) => {
                                            if (e.target.value !== "") {
                                                pickChallengerAndStartNewMatch(parseInt(e.target.value, 10), 2);
                                            }
                                        }}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                                    >
                                        <option value="" disabled>Choose queued challenger...</option>
                                        {queueList.map((q, idx) => (
                                            <option key={idx} value={idx}>{q}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                queueList.length > 0 && (
                                    <button 
                                        onClick={() => swapNextToTeam(2)} 
                                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                                    >
                                        Swap next: {queueList[0]}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Huge Score Counter Container */}
                        <div className="py-8 text-center cursor-pointer select-none group" onClick={() => addPoint(2)}>
                            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all drop-shadow-md">
                                {score2}
                            </span>
                        </div>

                        {/* Interactive Plus / Minus Control Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => subPoint(2)}
                                className="py-4 rounded-2xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700/60 flex items-center justify-center text-gray-300 font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
                            >
                                <FaMinus className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => addPoint(2)}
                                className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                            >
                                <FaPlus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Courtside Queue Management Console */}
                <div className="bg-gray-900/85 border border-gray-800 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-gray-800 pb-3">
                        <FaListAlt className="text-emerald-400" /> Courtside Player/Team Queue (Next Up)
                    </div>

                    <form onSubmit={addToQueue} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Enter team or player names..." 
                            value={newQueueName}
                            onChange={(e) => setNewQueueName(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm">
                            <FaUserPlus /> Enqueue Team
                        </button>
                    </form>

                    <div className="space-y-2 pt-1">
                        {queueList.length === 0 ? (
                            <p className="text-xs text-gray-500 italic py-2">Queue is empty. Add challengers above!</p>
                        ) : (
                            queueList.map((team, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-800/50 border border-gray-700/40 px-4 py-2.5 rounded-xl text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-[10px]">
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-white">{team}</span>
                                        {idx === 0 && (
                                            <span className="bg-emerald-500 text-gray-950 font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Next Up</span>
                                        )}
                                    </div>
                                    <button onClick={() => removeFromQueue(idx)} className="text-gray-400 hover:text-red-400 transition-colors p-1 cursor-pointer">
                                        <FaTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            <div className="max-w-5xl mx-auto w-full pt-6 text-center text-xs text-gray-500 flex justify-between items-center border-t border-gray-900 mt-6">
                <span>Secure local browser auto-save enabled.</span>
                <button onClick={clearLocalStorageMatch} className="hover:text-red-400 transition-colors cursor-pointer">
                    Clear Local Session Data
                </button>
            </div>
        </section>
    );
}