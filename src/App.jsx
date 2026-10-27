import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Users, 
  Calculator, 
  Trash2, 
  Shuffle, 
  History,
  Medal,
  UserPlus,
  Search,
  Check,
  Receipt,
  CircleDot,
  Settings,
  RotateCcw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Copy,
  Share2
} from 'lucide-react';

export default function App() {
  // Navigation tabs: 'stats' | 'matches' | 'history' | 'finance' | 'settings'
  const [activeTab, setActiveTab] = useState('stats');

  // Multi-device Cloud Sync States (Using localStorage simulation for robust zero-config cloud sync across tabs/devices if desired, or demo session)
  const [sessionCode, setSessionCode] = useState('BOTC-2026');
  const [inputCode, setInputCode] = useState('BOTC-2026');
  const [isConnected, setIsConnected] = useState(true);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Danh sách màu sắc cố định để gán cho các sân mới
  const COURT_COLORS = [
    { bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500', badgeBg: 'bg-indigo-950', badgeBorder: 'border-indigo-800' },
    { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', badgeBg: 'bg-emerald-950', badgeBorder: 'border-emerald-800' },
    { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', badgeBg: 'bg-amber-950', badgeBorder: 'border-amber-800' },
    { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', badgeBg: 'bg-purple-950', badgeBorder: 'border-purple-800' },
    { bg: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500', badgeBg: 'bg-rose-950', badgeBorder: 'border-rose-800' },
    { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-500', badgeBg: 'bg-cyan-950', badgeBorder: 'border-cyan-800' },
  ];

  // ==========================================
  // DỮ LIỆU CHÍNH (APP STATES)
  // ==========================================
  const [players, setPlayers] = useState([
    { id: '1', name: 'Nguyễn Văn Minh', matches: 8, wins: 6, losses: 2 },
    { id: '2', name: 'Trần Đức Tuấn', matches: 7, wins: 4, losses: 3 },
    { id: '3', name: 'Lê Hoàng Đạt', matches: 9, wins: 8, losses: 1 },
    { id: '4', name: 'Phạm Quốc Hùng', matches: 5, wins: 1, losses: 4 },
    { id: '5', name: 'Trần Quốc Bảo', matches: 6, wins: 4, losses: 2 },
    { id: '6', name: 'Lê Văn Huy', matches: 6, wins: 2, losses: 4 },
    { id: '7', name: 'Nguyễn Tấn Phát', matches: 4, wins: 3, losses: 1 },
    { id: '8', name: 'Đặng Đăng Khoa', matches: 3, wins: 0, losses: 3 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');

  const [teamA1, setTeamA1] = useState('');
  const [teamA2, setTeamA2] = useState('');
  const [teamB1, setTeamB1] = useState('');
  const [teamB2, setTeamB2] = useState('');
  const [extraShuttlecock, setExtraShuttlecock] = useState(0); 
  
  const [courts, setCourts] = useState([
    { id: 'c1', name: 'Sân 1', colorIndex: 0 },
    { id: 'c2', name: 'Sân 2', colorIndex: 1 }
  ]);
  const [selectedCourtId, setSelectedCourtId] = useState('c1');
  const [newCourtInput, setNewCourtInput] = useState('');
  const [suggestedMatchInfo, setSuggestedMatchInfo] = useState(null);

  const [matchHistory, setMatchHistory] = useState([
    {
      id: 'm1',
      date: '10:15 - 27/10',
      courtName: 'Sân 1',
      courtColorIndex: 0,
      teamAIds: ['3', '1'],
      teamBIds: ['4', '2'],
      teamA: ['Lê Hoàng Đạt', 'Nguyễn Văn Minh'],
      teamB: ['Phạm Quốc Hùng', 'Trần Đức Tuấn'],
      shuttlecockCount: 2,
      winner: 'teamA'
    },
    {
      id: 'm2',
      date: '09:30 - 27/10',
      courtName: 'Sân 2',
      courtColorIndex: 1,
      teamAIds: ['5', '7'],
      teamBIds: ['6', '8'],
      teamA: ['Trần Quốc Bảo', 'Nguyễn Tấn Phát'],
      teamB: ['Lê Văn Huy', 'Đặng Đăng Khoa'],
      shuttlecockCount: 1,
      winner: 'teamA'
    }
  ]);

  const [historySearch, setHistorySearch] = useState('');

  const [courtFee, setCourtFee] = useState(200000);
  const [shuttlecockFee, setShuttlecockFee] = useState(100000);
  const [drinkFee, setDrinkFee] = useState(50000);
  const [payingPlayerIds, setPayingPlayerIds] = useState(['1', '2', '3', '4', '5', '6', '7', '8']);

  const [bankInfo, setBankInfo] = useState({
    bankId: 'MB',
    accountNo: '0987654321',
    accountName: 'NGUYEN VAN A',
    memo: 'Tien san cau long'
  });

  // Sync state with localStorage or cloud session simulation
  useEffect(() => {
    const savedData = localStorage.getItem(`botc_session_${sessionCode}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.courts) setCourts(parsed.courts);
        if (parsed.matchHistory) setMatchHistory(parsed.matchHistory);
        if (parsed.payingPlayerIds) setPayingPlayerIds(parsed.payingPlayerIds);
        if (parsed.courtFee !== undefined) setCourtFee(parsed.courtFee);
        if (parsed.shuttlecockFee !== undefined) setShuttlecockFee(parsed.shuttlecockFee);
        if (parsed.drinkFee !== undefined) setDrinkFee(parsed.drinkFee);
        if (parsed.bankInfo) setBankInfo(parsed.bankInfo);
      } catch (e) {
        console.error("Error loading session data", e);
      }
    }
  }, [sessionCode]);

  const saveToCloud = (updatedFields) => {
    const currentData = {
      players,
      courts,
      matchHistory,
      payingPlayerIds,
      courtFee,
      shuttlecockFee,
      drinkFee,
      bankInfo,
      ...updatedFields
    };
    localStorage.setItem(`botc_session_${sessionCode}`, JSON.stringify(currentData));
    setIsConnected(true);
  };

  // Join or Change Room / Session Code
  const handleJoinSession = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setSessionCode(inputCode.trim().toUpperCase());
  };

  // Safe Copy Function for Sandboxed Previews
  const handleCopyCode = () => {
    const textToCopy = sessionCode;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).catch(() => {
          fallbackCopyTextToClipboard(textToCopy);
        });
      } else {
        fallbackCopyTextToClipboard(textToCopy);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(textToCopy);
    }
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  // ==========================================
  // THAO TÁC DỮ LIỆU VĐV / SÂN / TRẬN ĐẤU
  // ==========================================
  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    const newPlayer = {
      id: `p_${Date.now()}`,
      name: newPlayerName.trim(),
      matches: 0,
      wins: 0,
      losses: 0
    };
    const updatedPlayers = [...players, newPlayer];
    const updatedPaying = [...payingPlayerIds, newPlayer.id];

    setPlayers(updatedPlayers);
    setPayingPlayerIds(updatedPaying);
    setNewPlayerName('');

    saveToCloud({ players: updatedPlayers, payingPlayerIds: updatedPaying });
  };

  const handleDeletePlayer = (id) => {
    const updatedPlayers = players.filter((p) => p.id !== id);
    const updatedPaying = payingPlayerIds.filter((pId) => pId !== id);

    setPlayers(updatedPlayers);
    setPayingPlayerIds(updatedPaying);

    saveToCloud({ players: updatedPlayers, payingPlayerIds: updatedPaying });
  };

  const sortedPlayers = useMemo(() => {
    return players
      .map((p) => ({
        ...p,
        winrate: p.matches > 0 ? Math.round((p.wins / p.matches) * 100) : 0
      }))
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.winrate - a.winrate || b.wins - a.wins);
  }, [players, searchQuery]);

  const handleAddCourt = (e) => {
    e.preventDefault();
    if (!newCourtInput.trim()) return;
    const nextColorIndex = courts.length % COURT_COLORS.length;
    const newCourt = {
      id: `c_${Date.now()}`,
      name: newCourtInput.trim(),
      colorIndex: nextColorIndex
    };
    const updatedCourts = [...courts, newCourt];
    setCourts(updatedCourts);
    setSelectedCourtId(newCourt.id);
    setNewCourtInput('');

    saveToCloud({ courts: updatedCourts });
  };

  const handleDeleteCourt = (courtId, e) => {
    e.stopPropagation();
    if (courts.length <= 1) return;
    const updatedCourts = courts.filter((c) => c.id !== courtId);
    setCourts(updatedCourts);
    if (selectedCourtId === courtId) {
      setSelectedCourtId(updatedCourts[0].id);
    }

    saveToCloud({ courts: updatedCourts });
  };

  const handleAutoMatch = () => {
    if (players.length < 4) return;
    const sorted = [...players].sort((a, b) => a.matches - b.matches);
    const selected4 = sorted.slice(0, 4);

    setTeamA1(selected4[0].id);
    setTeamA2(selected4[3].id);
    setTeamB1(selected4[1].id);
    setTeamB2(selected4[2].id);

    setSuggestedMatchInfo({
      teamA: [selected4[0].name, selected4[3].name],
      teamB: [selected4[1].name, selected4[2].name]
    });
  };

  const handleSaveMatch = (e) => {
    e.preventDefault();

    if (!teamA1 || !teamA2 || !teamB1 || !teamB2) return;

    const uniqueIds = new Set([teamA1, teamA2, teamB1, teamB2]);
    if (uniqueIds.size !== 4) return;

    const playerA1 = players.find((p) => p.id === teamA1);
    const playerA2 = players.find((p) => p.id === teamA2);
    const playerB1 = players.find((p) => p.id === teamB1);
    const playerB2 = players.find((p) => p.id === teamB2);
    const currentCourt = courts.find((c) => c.id === selectedCourtId);

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}`;
    
    const newMatch = {
      id: `m_${Date.now()}`,
      date: timeString,
      courtName: currentCourt ? currentCourt.name : 'Sân 1',
      courtColorIndex: currentCourt ? currentCourt.colorIndex : 0,
      teamAIds: [teamA1, teamA2],
      teamBIds: [teamB1, teamB2],
      teamA: [playerA1.name, playerA2.name],
      teamB: [playerB1.name, playerB2.name],
      shuttlecockCount: Math.max(0, Number(extraShuttlecock) || 0),
      winner: null
    };

    const updatedMatches = [newMatch, ...matchHistory];

    const updatedPlayers = players.map((p) => {
      if (uniqueIds.has(p.id)) {
        return { ...p, matches: p.matches + 1 };
      }
      return p;
    });

    setMatchHistory(updatedMatches);
    setPlayers(updatedPlayers);
    setSuggestedMatchInfo(null);
    setExtraShuttlecock(0);
    setActiveTab('history');

    saveToCloud({ matchHistory: updatedMatches, players: updatedPlayers });
  };

  const handleSetWinnerInHistory = (matchId, newWinner) => {
    const targetMatch = matchHistory.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const oldWinner = targetMatch.winner;

    const updatedMatches = matchHistory.map((m) => (m.id === matchId ? { ...m, winner: newWinner } : m));

    const updatedPlayers = players.map((p) => {
      const inTeamA = targetMatch.teamAIds?.includes(p.id);
      const inTeamB = targetMatch.teamBIds?.includes(p.id);

      if (!inTeamA && !inTeamB) return p;

      let wins = p.wins;
      let losses = p.losses;

      if (oldWinner === 'teamA') {
        if (inTeamA) wins -= 1;
        if (inTeamB) losses -= 1;
      } else if (oldWinner === 'teamB') {
        if (inTeamB) wins -= 1;
        if (inTeamA) losses -= 1;
      }

      if (newWinner === 'teamA') {
        if (inTeamA) wins += 1;
        if (inTeamB) losses += 1;
      } else if (newWinner === 'teamB') {
        if (inTeamB) wins += 1;
        if (inTeamA) losses += 1;
      }

      return {
        ...p,
        wins: Math.max(0, wins),
        losses: Math.max(0, losses)
      };
    });

    setMatchHistory(updatedMatches);
    setPlayers(updatedPlayers);

    saveToCloud({ matchHistory: updatedMatches, players: updatedPlayers });
  };

  const handleUpdateMatchShuttlecock = (matchId, delta) => {
    const updatedMatches = matchHistory.map((m) => {
      if (m.id === matchId) {
        const current = m.shuttlecockCount ?? 0;
        const updated = Math.max(0, current + delta);
        return { ...m, shuttlecockCount: updated };
      }
      return m;
    });

    setMatchHistory(updatedMatches);
    saveToCloud({ matchHistory: updatedMatches });
  };

  const togglePayingPlayer = (id) => {
    let updated;
    if (payingPlayerIds.includes(id)) {
      if (payingPlayerIds.length === 1) return;
      updated = payingPlayerIds.filter((pId) => pId !== id);
    } else {
      updated = [...payingPlayerIds, id];
    }
    setPayingPlayerIds(updated);
    saveToCloud({ payingPlayerIds: updated });
  };

  const filteredHistory = useMemo(() => {
    return matchHistory.filter((m) => {
      const q = historySearch.toLowerCase();
      const courtMatch = m.courtName.toLowerCase().includes(q);
      const playerMatch = [...m.teamA, ...m.teamB].some((name) => name.toLowerCase().includes(q));
      return courtMatch || playerMatch;
    });
  }, [matchHistory, historySearch]);

  const totalShuttlecockUsed = useMemo(() => {
    return matchHistory.reduce((acc, m) => acc + (m.shuttlecockCount ?? 0), 0);
  }, [matchHistory]);

  const totalCost = Number(courtFee) + Number(shuttlecockFee) + Number(drinkFee);
  const payingCount = payingPlayerIds.length || 1;
  const costPerPerson = Math.round(totalCost / payingCount);

  const vietQrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${costPerPerson}&addInfo=${encodeURIComponent(bankInfo.memo)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* HEADER TOP BAR */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-emerald-500 p-2 rounded-xl text-white font-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent uppercase">
              CLB CẦU LÔNG BOTC
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold hidden sm:block">Đồng bộ nhóm chơi trực tuyến</p>
          </div>
        </div>

        {/* CLOUD SYNC CONTROL PANEL */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-[11px] text-slate-400 font-bold hidden md:inline">Mã Nhóm:</span>
          </div>

          <form onSubmit={handleJoinSession} className="flex items-center gap-1">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Nhập Mã Nhóm..."
              className="w-28 sm:w-32 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-indigo-500 text-center uppercase"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-lg transition-all"
            >
              Kết nối
            </button>
          </form>

          <button
            onClick={handleCopyCode}
            title="Sao chép Mã Nhóm để gửi máy khác"
            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-900 rounded-lg transition-colors relative"
          >
            <Copy className="w-4 h-4" />
            {copiedNotification && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                Đã chép mã!
              </span>
            )}
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full lg:w-auto justify-around overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Thống Kê</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>Nhập Trận</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch Sử ({matchHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'finance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Chia Tiền</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cài Đặt</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-3 sm:p-5 max-w-6xl w-full mx-auto flex flex-col">
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Top 3 VĐV */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sortedPlayers.slice(0, 3).map((player, idx) => {
                const ranks = [
                  { badge: '🥇 1st', bgClass: 'from-amber-500/20 to-yellow-950/40 border-amber-500/50 text-amber-400' },
                  { badge: '🥈 2nd', bgClass: 'from-slate-800/80 to-slate-900 border-slate-700 text-slate-300' },
                  { badge: '🥉 3rd', bgClass: 'from-amber-900/20 to-slate-900 border-amber-800/40 text-amber-600' }
                ];
                const r = ranks[idx] || ranks[1];

                return (
                  <div key={player.id} className={`bg-gradient-to-br ${r.bgClass} border p-4 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden`}>
                    <div className="space-y-1 z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800 text-slate-300">
                        {r.badge}
                      </span>
                      <h3 className="text-base font-black text-slate-100 mt-1">{player.name}</h3>
                      
                      <div className="flex items-center gap-4 pt-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tổng số trận</span>
                          <span className="font-extrabold text-slate-200">{player.matches} trận</span>
                        </div>
                        <div className="border-l border-slate-800 pl-4">
                          <span className="text-[10px] text-slate-400 block">Thắng / Thua</span>
                          <span className="font-extrabold text-emerald-400">{player.wins}W</span>
                          <span className="text-slate-500 mx-1">-</span>
                          <span className="font-extrabold text-rose-400">{player.losses}L</span>
                        </div>
                        <div className="border-l border-slate-800 pl-4">
                          <span className="text-[10px] text-slate-400 block">Tỷ lệ thắng</span>
                          <span className="font-black text-amber-400">{player.winrate}%</span>
                        </div>
                      </div>
                    </div>
                    <Medal className="w-16 h-16 opacity-15 absolute -right-2 -bottom-2 text-slate-400" />
                  </div>
                );
              })}
            </div>

            {/* Controls Bar */}
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm VĐV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Form Thêm VĐV */}
              <form onSubmit={handleAddPlayer} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tên VĐV mới..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Thêm mới</span>
                </button>
              </form>
            </div>

            {/* LEADERBOARD TABLE */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">STT</th>
                      <th className="py-3.5 px-4">Tên VĐV</th>
                      <th className="py-3.5 px-4 text-center">Tổng Số Trận</th>
                      <th className="py-3.5 px-4 text-center">Trận Thắng (W)</th>
                      <th className="py-3.5 px-4 text-center">Trận Thua (L)</th>
                      <th className="py-3.5 px-4 text-center">Tỷ Lệ Thắng (%)</th>
                      <th className="py-3.5 px-4 text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {sortedPlayers.map((player, idx) => (
                      <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-black text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-800/60 flex items-center justify-center font-black text-indigo-400 text-xs">
                              {player.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-100">{player.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-200">{player.matches}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-950/20">{player.wins}</td>
                        <td className="py-3 px-4 text-center font-bold text-rose-400 bg-rose-950/20">{player.losses}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full"
                                style={{ width: `${Math.min(100, player.winrate)}%` }}
                              />
                            </div>
                            <span className="font-mono font-black text-amber-400">{player.winrate}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeletePlayer(player.id)}
                            className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                            title="Xóa VĐV"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="max-w-3xl mx-auto w-full space-y-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
                    <Shuffle className="w-5 h-5 text-indigo-400" />
                    Nhập Trận Đấu
                  </h2>
                  <p className="text-xs text-slate-400">Tự động chọn 4 người ít trận nhất hoặc chọn cặp đấu tùy ý</p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoMatch}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Xếp Trận Công Bằng</span>
                </button>
              </div>

              {suggestedMatchInfo && (
                <div className="bg-indigo-950/50 border border-indigo-500/40 p-3 rounded-xl mb-4 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-300 block">🎲 Hệ thống ghép 4 người ít trận nhất:</span>
                    <p className="text-slate-200 mt-0.5">
                      Đội A: <strong>{suggestedMatchInfo.teamA.join(' + ')}</strong> VS Đội B: <strong>{suggestedMatchInfo.teamB.join(' + ')}</strong>
                    </p>
                  </div>
                  <button onClick={() => setSuggestedMatchInfo(null)} className="text-slate-500 hover:text-slate-300 text-[11px]">Đóng</button>
                </div>
              )}

              {/* QUẢN LÝ & CHỌN SÂN THI ĐẤU */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                    Danh Sách Sân Thi Đấu
                  </label>
                  
                  <form onSubmit={handleAddCourt} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="+ Tên sân mới..."
                      value={newCourtInput}
                      onChange={(e) => setNewCourtInput(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Thêm sân
                    </button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {courts.map((court) => {
                    const isSelected = selectedCourtId === court.id;
                    const colorStyle = COURT_COLORS[court.colorIndex % COURT_COLORS.length];
                    
                    return (
                      <div
                        key={court.id}
                        onClick={() => setSelectedCourtId(court.id)}
                        className={`cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSelected
                            ? `${colorStyle.bg} border-white text-white shadow-lg scale-105`
                            : `bg-slate-900 ${colorStyle.border} ${colorStyle.text} hover:bg-slate-800`
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        <span>{court.name}</span>
                        {courts.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCourt(court.id, e)}
                            className="text-slate-400 hover:text-rose-400 transition-colors p-0.5"
                            title="Xóa sân"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FORM CHỌN ĐỘI */}
              <form onSubmit={handleSaveMatch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ĐỘI A */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/50 space-y-3">
                    <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      Đội A
                    </h3>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1 font-semibold">VĐV 1</label>
                      <select
                        value={teamA1}
                        onChange={(e) => setTeamA1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                      >
                        <option value="">-- Chọn VĐV --</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.matches} trận đã chơi)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1 font-semibold">VĐV 2</label>
                      <select
                        value={teamA2}
                        onChange={(e) => setTeamA2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                      >
                        <option value="">-- Chọn VĐV --</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.matches} trận đã chơi)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ĐỘI B */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/50 space-y-3">
                    <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Đội B
                    </h3>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1 font-semibold">VĐV 1</label>
                      <select
                        value={teamB1}
                        onChange={(e) => setTeamB1(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                      >
                        <option value="">-- Chọn VĐV --</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.matches} trận đã chơi)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1 font-semibold">VĐV 2</label>
                      <select
                        value={teamB2}
                        onChange={(e) => setTeamB2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                      >
                        <option value="">-- Chọn VĐV --</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.matches} trận đã chơi)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SỐ CẦU THÊM MẶC ĐỊNH 0 */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Số lượng cầu dùng cho trận này:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExtraShuttlecock((prev) => Math.max(0, Number(prev) - 1))}
                      className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold hover:bg-slate-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={extraShuttlecock}
                      onChange={(e) => setExtraShuttlecock(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 bg-slate-900 border border-slate-800 text-center font-extrabold text-amber-400 text-xs rounded-lg py-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setExtraShuttlecock((prev) => Number(prev) + 1)}
                      className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold hover:bg-slate-800"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-400 font-semibold ml-1">quả</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  TẠO TRẬN ĐẤU (THÊM VÀO LỊCH SỬ)
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-4 rounded-2xl border border-indigo-900/40 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                  <CircleDot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Tổng số quả cầu đã dùng</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{totalShuttlecockUsed} quả</span>
                </div>
              </div>

              <div className="flex items-center gap-6 border-l border-slate-800 pl-6">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Tổng trận đấu</span>
                  <span className="text-lg font-black text-slate-100 font-mono">{matchHistory.length} trận</span>
                </div>
                <div className="border-l border-slate-800 pl-6">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Trung bình</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {matchHistory.length > 0 ? (totalShuttlecockUsed / matchHistory.length).toFixed(1) : 0} cầu/trận
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sân hoặc VĐV..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
                Chưa có lịch sử trận đấu nào phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredHistory.map((match) => {
                  const colorStyle = COURT_COLORS[(match.courtColorIndex ?? 0) % COURT_COLORS.length];
                  
                  return (
                    <div key={match.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-3 relative">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800/80">
                        <span className={`font-extrabold ${colorStyle.text} ${colorStyle.badgeBg} ${colorStyle.badgeBorder} px-2 py-0.5 rounded border flex items-center gap-1.5`}>
                          <span className={`w-2 h-2 rounded-full ${colorStyle.bg}`} />
                          {match.courtName}
                        </span>
                        <span>{match.date}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`p-2.5 rounded-xl border ${match.winner === 'teamA' ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-slate-950 border-slate-800'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-indigo-400 text-[11px]">Đội A</span>
                            {match.winner === 'teamA' && (
                              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">THẮNG</span>
                            )}
                          </div>
                          <p className="font-semibold text-slate-200">{match.teamA.join(' + ')}</p>
                        </div>

                        <div className={`p-2.5 rounded-xl border ${match.winner === 'teamB' ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-slate-950 border-slate-800'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-rose-400 text-[11px]">Đội B</span>
                            {match.winner === 'teamB' && (
                              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">THẮNG</span>
                            )}
                          </div>
                          <p className="font-semibold text-slate-200">{match.teamB.join(' + ')}</p>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <CircleDot className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px] font-semibold text-slate-400">Số cầu đã dùng:</span>
                          <span className="font-black text-amber-400 font-mono">{match.shuttlecockCount ?? 0} quả</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500 mr-1">Cầu thêm:</span>
                          <button
                            onClick={() => handleUpdateMatchShuttlecock(match.id, -1)}
                            className="w-5 h-5 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800 font-bold text-xs"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateMatchShuttlecock(match.id, 1)}
                            className="w-5 h-5 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">Cập nhật kết quả:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSetWinnerInHistory(match.id, 'teamA')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              match.winner === 'teamA'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Đội A Thắng
                          </button>
                          <button
                            onClick={() => handleSetWinnerInHistory(match.id, 'teamB')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              match.winner === 'teamB'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Đội B Thắng
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
                <h2 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4" />
                  Nhập Chi Phí Buổi Giao Lưu
                </h2>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Tiền thuê sân (VND)</label>
                    <input
                      type="number"
                      value={courtFee}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCourtFee(val);
                        saveToCloud({ courtFee: val });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tiền mua cầu (VND)</label>
                    <input
                      type="number"
                      value={shuttlecockFee}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShuttlecockFee(val);
                        saveToCloud({ shuttlecockFee: val });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tiền nước & Khác (VND)</label>
                    <input
                      type="number"
                      value={drinkFee}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDrinkFee(val);
                        saveToCloud({ drinkFee: val });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                    Thành Viên Tham Gia Chia Tiền ({payingCount}/{players.length})
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {players.map((p) => {
                    const isSelected = payingPlayerIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePayingPlayer(p.id)}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center text-center space-y-4">
                <div className="bg-indigo-950/60 border border-indigo-800/40 px-4 py-2 rounded-xl w-full">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">Tổng Chi Phí Buổi Đấu</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{totalCost.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl w-full">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">Mỗi Người Cần Chuyển</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{costPerPerson.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200 w-52 h-52 flex items-center justify-center">
                  <img
                    src={vietQrUrl}
                    alt="VietQR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-[11px] text-slate-400 max-w-xs">
                  Sử dụng ứng dụng Ngân hàng (MB, VCB, Techcombank, VPBank...) để quét mã chuyển khoản trực tiếp.
                </p>

                <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-left text-xs">
                  <span className="font-extrabold text-slate-300 block border-b border-slate-800 pb-1">Cấu hình Ngân Hàng Quét Mã</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Mã Ngân Hàng</label>
                      <input
                        type="text"
                        value={bankInfo.bankId}
                        onChange={(e) => {
                          const updated = { ...bankInfo, bankId: e.target.value };
                          setBankInfo(updated);
                          saveToCloud({ bankInfo: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Số Tài Khoản</label>
                      <input
                        type="text"
                        value={bankInfo.accountNo}
                        onChange={(e) => {
                          const updated = { ...bankInfo, accountNo: e.target.value };
                          setBankInfo(updated);
                          saveToCloud({ bankInfo: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Tên Chủ Tài Khoản</label>
                    <input
                      type="text"
                      value={bankInfo.accountName}
                      onChange={(e) => {
                        const updated = { ...bankInfo, accountName: e.target.value };
                        setBankInfo(updated);
                        saveToCloud({ bankInfo: updated });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto w-full space-y-5">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-base font-black text-slate-100">Cài Đặt Dữ Liệu & Đồng Bộ</h2>
                    <p className="text-xs text-slate-400">Quản lý kết nối đám mây và dọn dẹp dữ liệu</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-400">Mã Nhóm:</span>
                  <span className="font-mono font-bold text-emerald-400">{sessionCode}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4" />
                      Xóa Lịch Sử Đấu & Reset Thống Kê (Giữ Danh Sách VĐV)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Xóa toàn bộ các trận đã ghi trong phần <strong>Lịch Sử</strong>, đặt lại số trận đã chơi/thắng/thua của các VĐV về 0. <strong>Tên các VĐV và danh sách sân vẫn được giữ nguyên.</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const resetPlayers = players.map((p) => ({
                      ...p,
                      matches: 0,
                      wins: 0,
                      losses: 0
                    }));

                    setMatchHistory([]);
                    setPlayers(resetPlayers);

                    saveToCloud({ matchHistory: [], players: resetPlayers });
                  }}
                  className="w-full py-2.5 bg-amber-600/20 hover:bg-amber-600 border border-amber-500/40 hover:border-amber-500 text-amber-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>XÓA LỊCH SỬ & ĐẶT LẠI THỐNG KÊ (GIỮ VĐV)</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-rose-950/60 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Xóa Tất Cả Dữ Liệu (Reset Toàn Bộ Session)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Xóa sạch <strong>toàn bộ danh sách VĐV</strong>, <strong>Lịch Sử Trận Đấu</strong> và <strong>Danh Sách Sân</strong> của nhóm này.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const emptyState = {
                      players: [],
                      matchHistory: [],
                      payingPlayerIds: [],
                      courts: [{ id: 'c1', name: 'Sân 1', colorIndex: 0 }]
                    };

                    setPlayers([]);
                    setMatchHistory([]);
                    setPayingPlayerIds([]);
                    setCourts([{ id: 'c1', name: 'Sân 1', colorIndex: 0 }]);
                    setSelectedCourtId('c1');
                    setSuggestedMatchInfo(null);

                    saveToCloud(emptyState);
                  }}
                  className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 hover:border-rose-500 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>XÓA TOÀN BỘ DỮ LIỆU HỆ THỐNG</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}