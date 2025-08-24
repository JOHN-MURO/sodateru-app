import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- ★ 追加: アニメーション用のCSS ---
const GlobalStyles = () => (
    <style>{`
        @keyframes pet-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-pet-float {
            animation: pet-float 4s ease-in-out infinite;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes heart-pop {
            0% { transform: translateY(0) scale(0); opacity: 1; }
            50% { transform: translateY(-80px) scale(1.5); opacity: 0.8; }
            100% { transform: translateY(-150px) scale(1); opacity: 0; }
        }
        .animate-heart-pop {
            animation: heart-pop 1.5s ease-out forwards;
        }
    `}</style>
);


// --- アイコンコンポーネント (変更なし) ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TimelineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TeamIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.001 3.001 0 015.286 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

// --- UIコンポーネント ---
const Card = ({ children, className = '' }) => <div className={`bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg p-4 ${className}`}>{children}</div>;
const SectionTitle = ({ title }) => <h2 className="text-xl font-bold text-slate-700 mb-4">{title}</h2>;
const ProgressBar = ({ label, progress, currentValue, targetValue, colorClass, unit = '時間' }) => {
    const progressPercent = Math.min(progress, 100);
    return (
        <div>
            <div className="flex justify-between items-end mb-1"><span className="text-sm font-semibold text-slate-600">{label}</span><span className="text-xs font-bold text-slate-500">{currentValue} / {targetValue} {unit}</span></div>
            <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner overflow-hidden border border-slate-300/50"><div className={`h-4 rounded-full ${colorClass} transition-all duration-500 ease-out flex items-center justify-end`} style={{ width: `${progressPercent}%` }}><div className="w-2 h-2 bg-white/50 rounded-full mr-1 opacity-50"></div></div></div>
        </div>
    );
};
const LoadingIndicator = () => (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-50">
        LOADING...
    </div>
);
const OpeningScreen = ({ onStart }) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Sodabell</h1>
            <p className="text-slate-500 mb-8">学ぶと育つ、あなただけのペット</p>
            <button onClick={onStart} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg text-lg">
                はじめる
            </button>
        </Card>
    </div>
);
const EvolutionAnimation = ({ petName, oldImage, newImage, onComplete }) => {
    const [step, setStep] = useState(0);
    useEffect(() => {
        if (step === 0) setTimeout(() => setStep(1), 100);
        if (step === 1) setTimeout(() => setStep(2), 3000);
        if (step === 2) setTimeout(() => setStep(3), 1500);
    }, [step]);
    const ConfettiPiece = ({ style }) => <div className="absolute w-2 h-4" style={style}></div>;
    const confetti = useMemo(() => Array.from({ length: 50 }).map((_, i) => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];
        return <ConfettiPiece key={i} style={{ left: `${Math.random() * 100}%`, top: `${-20 + Math.random() * -80}%`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], transform: `rotate(${Math.random() * 360}deg)`, animation: `fall ${2 + Math.random() * 2}s ${Math.random()}s linear forwards`, }} />;
    }), []);
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <style>{`@keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } } @keyframes grow { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } } @keyframes fall { to { top: 120%; } }`}</style>
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                {step === 1 && <img src={oldImage} alt="Evolving Pet" className="h-48 w-48 object-contain" style={{ animation: 'flash 0.2s infinite' }} />}
                {step >= 2 && <img src={newImage} alt="Evolved Pet" className="h-48 w-48 object-contain" style={{ animation: 'grow 0.5s' }} />}
                {step === 3 && (<><div className="absolute inset-0 overflow-hidden">{confetti}</div><p className="text-white text-2xl font-bold mt-4 animate-fade-in">おめでとう！ {petName} は進化した！</p><button onClick={onComplete} className="mt-8 bg-white/20 text-white font-bold py-2 px-6 rounded-lg hover:bg-white/30 transition-colors">閉じる</button></>)}
            </div>
        </div>
    );
};
const HeartEffect = ({ count }) => {
    if (count === 0) return null;
    return (
        <div key={count} className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-6xl text-red-500 animate-heart-pop">❤️</div>
        </div>
    );
};

// --- 画像データを管理 ---
const petImageData = {
    "スライム": [ "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%8D%B5%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png" ],
    "イヌ": [ "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%8D%B5%E6%9C%9F_%E7%8A%AC.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E7%8A%AC.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E7%8A%AC.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E7%8A%AC.png" ],
    "トリ": [ "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%8D%B5%E6%9C%9F_%E9%B3%A5.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E9%B3%A5.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E9%B3%A5.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E9%B3%A5.png" ],
    "カメ": [ "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%8D%B5%E6%9C%9F_%E4%BA%80.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E4%BA%80.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E4%BA%80.png", "https://github.com/JOHN-MURO/sodateru-app/raw/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E4%BA%80.png" ],
};

// --- スプレッドシートからデータを取得/書き込みする関数 ---
const SPREADSHEET_API_URL = "https://script.google.com/macros/s/AKfycbzm94TzRGOdAp735lGKG1uPMjDVIcyK0TpqerMTxRZNZlzFHSXOLBWi7vet_N8ocJ30/exec";

const fetchFromSpreadsheet = async (action, params = {}) => {
    const url = new URL(SPREADSHEET_API_URL);
    url.searchParams.append('action', action);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${action}:`, error);
        throw error;
    }
};

const writeToSpreadsheet = async (action, payload) => {
    try {
        await fetch(SPREADSHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload }),
        });
        console.log('Write operation successful');
    } catch (error) {
        console.error(`Failed to write ${action}:`, error);
    }
};

// --- カスタムフック (変更なし) ---
const useTimeSince = (isoDate) => {
    const [timeSince, setTimeSince] = useState('');
    useEffect(() => {
        const calculate = () => {
            if (!isoDate) return;
            const diff = new Date() - new Date(isoDate);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            setTimeSince(`生まれてから ${days}日 と ${hours}時間`);
        };
        calculate();
        const interval = setInterval(calculate, 60000);
        return () => clearInterval(interval);
    }, [isoDate]);
    return timeSince;
};

// --- アンケートとログイン (変更なし) ---
const surveyQuestions = [
    { question: "どんな時に一番集中できますか？", options: { A: "朝", B: "夜" } },
    { question: "新しいことを学ぶとき、どの方法が好きですか？", options: { A: "じっくり計画を立てる", B: "とにかくやってみる" } },
];

const determinePetType = () => {
    const petTypes = Object.keys(petImageData);
    const randomIndex = Math.floor(Math.random() * petTypes.length);
    return petTypes[randomIndex];
};

const LoginScreen = ({ userList, onLogin }) => {
    const [selectedUser, setSelectedUser] = useState(userList[0]?.name || '');
    const handleSubmit = (e) => { e.preventDefault(); if (selectedUser) onLogin(userList.find(u => u.name === selectedUser)); };
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm"><form onSubmit={handleSubmit}><SectionTitle title="ようこそ！" /><p className="text-slate-600 mb-4">あなたの名前を選択してください</p><select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4 bg-white">{userList.map((user, index) => <option key={`${user.name}-${index}`} value={user.name}>{user.name}</option>)}</select><button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">はじめる</button></form></Card>
        </div>
    );
};

const SurveyScreen = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [petName, setPetName] = useState('');

    const handleAnswer = (questionIndex, answer) => {
        setAnswers(a => ({ ...a, [`q${questionIndex + 1}`]: answer }));
        setStep(s => s + 1);
    };
    
    const handleComplete = (e) => { e.preventDefault(); if (petName) onComplete(answers, petName); };

    if (step <= surveyQuestions.length) {
        const currentQuestionIndex = step - 1;
        const { question, options } = surveyQuestions[currentQuestionIndex];
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm"><SectionTitle title={`質問 ${step}/${surveyQuestions.length}`} /><p className="text-slate-800 mb-6 text-lg font-semibold">{question}</p><div className="space-y-3">{Object.entries(options).map(([key, value]) => (<button key={key} onClick={() => handleAnswer(currentQuestionIndex, key)} className="w-full text-left bg-slate-100 p-4 rounded-lg hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-400 transition-all duration-200 font-medium">{value}</button>))}</div></Card>
            </div>
        );
    }
    
    if (step > surveyQuestions.length) {
        return (
             <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm"><form onSubmit={handleComplete}><SectionTitle title="ペットに名前をつけよう" /><p className="text-slate-600 mb-4">あなたの新しいパートナーの名前は？</p><input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="例：ポチ" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4" required /><button type="submit" className="w-full bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">決定</button></form></Card>
            </div>
        )
    }
    return null;
};

const StudyChart = ({ data }) => {
    const chartData = useMemo(() => {
        return data.map(item => ({
            name: item.dateLabel,
            学習時間: item.hours,
        }));
    }, [data]);

    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="h" tickFormatter={(value) => value.toFixed(1)} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}時間`} contentStyle={{ fontSize: 12, padding: '2px 8px' }} />
                    <Bar dataKey="学習時間" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const TimelineScreen = ({ onBack }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTimeline = async () => {
            setIsLoading(true);
            try {
                const data = await fetchFromSpreadsheet('getTimeline');
                setEvents(data.events || []);
            } catch (error) {
                console.error("Failed to load timeline:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTimeline();
    }, []);

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">タイムライン</h1>
                <button onClick={onBack} className="text-sm font-bold text-indigo-600">戻る</button>
            </div>
            <Card>
                {isLoading ? (
                    <p className="text-center text-slate-500">タイムラインを読み込み中...</p>
                ) : (
                    <ul className="space-y-4">
                        {events.map((event, index) => (
                            <li key={index} className="border-b border-slate-200/80 pb-3">
                                <p className="text-sm text-slate-700"><span className="font-bold">{event.userName}</span>: {event.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{event.timestamp}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
};

// --- メインアプリ ---
const evolutionRequirements = [
    { name: "卵期", hours: 0 }, { name: "幼年期", hours: 20 }, { name: "成長期", hours: 50 }, { name: "成熟期", hours: 80 },
];

const MainApp = ({ userProfile, activeView, setActiveView }) => {
    const { userName, level, avatar, petName, petType, birthDate, petEvolutionImages } = userProfile;
    
    const [petMessage, setPetMessage] = useState(userProfile.petMessage);
    const [studyData, setStudyData] = useState(userProfile.studyData);
    const [feedCount, setFeedCount] = useState(userProfile.feedCount);
    const [teamStats, setTeamStats] = useState(userProfile.teamStats);
    const [monthlyLogs, setMonthlyLogs] = useState([]);
    const [nutrient, setNutrient] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEvolving, setIsEvolving] = useState(false);
    const [evolutionReady, setEvolutionReady] = useState(false);
    const [previousStage, setPreviousStage] = useState(null);
    const [heartKey, setHeartKey] = useState(0);

    const timeSinceBirth = useTimeSince(birthDate);

    const currentEvolutionStage = useMemo(() => {
        const { totalHours } = studyData;
        for (let i = evolutionRequirements.length - 1; i >= 0; i--) {
            if (totalHours >= evolutionRequirements[i].hours) return i;
        }
        return 0;
    }, [studyData.totalHours]);

    useEffect(() => {
        if (previousStage !== null && currentEvolutionStage > previousStage) {
            setEvolutionReady(true);
        }
        setPreviousStage(currentEvolutionStage);
    }, [currentEvolutionStage, previousStage]);

    const progressData = useMemo(() => {
        if (currentEvolutionStage >= evolutionRequirements.length - 1) return null;
        const currentReq = evolutionRequirements[currentEvolutionStage];
        const nextReq = evolutionRequirements[currentEvolutionStage + 1];
        const hoursNeeded = nextReq.hours - currentReq.hours;
        const hoursProgress = hoursNeeded > 0 ? ((studyData.totalHours - currentReq.hours) / hoursNeeded) * 100 : 100;
        return {
            hours: { progress: hoursProgress, current: studyData.totalHours.toFixed(1), target: nextReq.hours },
        };
    }, [currentEvolutionStage, studyData.totalHours]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [fetchedData, fetchedLogs] = await Promise.all([
                    fetchFromSpreadsheet('getUserData', { user: userName }),
                    fetchFromSpreadsheet('getRecentLogs', { user: userName })
                ]);
                
                setStudyData({ totalHours: fetchedData.totalHours, streakDays: fetchedData.streakDays, todayHours: fetchedData.todayHours });
                setFeedCount(fetchedData.feedCount);
                setTeamStats({ median: fetchedData.teamMedian, rank: fetchedData.rank, size: fetchedData.teamSize });
                setMonthlyLogs(fetchedLogs.logs || []);
            } catch (error) {
                console.error("Failed to load user data:", error);
                setPetMessage("データの読み込みに失敗しました。時間をおいて再度お試しください。");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [userName]);

    const handleFeedPet = (e) => {
        e.preventDefault();
        if (!nutrient.trim()) { alert('栄養になる学習内容を入力してください！'); return; }
        const newFeedCount = feedCount + 1;
        setPetMessage(`「${nutrient}」を栄養にして、もっと賢くなったよ！ありがとう！`);
        setFeedCount(newFeedCount);
        setHeartKey(k => k + 1);
        writeToSpreadsheet('updateFeedCount', { userName, feedCount: newFeedCount, petName: petName, nutrient: nutrient.trim() });
        setNutrient('');
    };

    const formatHours = (hours) => ({ h: Math.floor(hours), m: Math.round((hours - Math.floor(hours)) * 60) });
    const today = formatHours(studyData.todayHours);
    const total = formatHours(studyData.totalHours);
    
    const currentPetImage = petEvolutionImages[currentEvolutionStage];
    const currentStageName = evolutionRequirements[currentEvolutionStage].name;

    return (
        <div className="font-sans bg-gradient-to-br from-slate-100 to-blue-200">
            {isEvolving && (
                <EvolutionAnimation 
                    petName={petName}
                    oldImage={petEvolutionImages[currentEvolutionStage - 1]}
                    newImage={currentPetImage}
                    onComplete={() => setIsEvolving(false)}
                />
            )}
            <HeartEffect count={heartKey} />
            <div className="min-h-screen bg-transparent pb-24 max-w-6xl mx-auto">
                 <header className="p-4 flex justify-between items-center sticky top-0 bg-white/50 backdrop-blur-md z-10 shadow-sm lg:rounded-t-2xl max-w-md mx-auto lg:max-w-none lg:w-full"><h1 className="text-2xl font-bold text-slate-800">Sodabell</h1><div className="flex items-center gap-3"><span className="font-semibold text-slate-700">{userName}</span><img src={avatar} alt="User Avatar" className="rounded-full w-9 h-9 border-2 border-white" /></div></header>
                
                <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:items-stretch">
                    <div className="lg:col-span-2">
                        <div className="p-4 h-full">
                            <Card className="relative overflow-hidden h-full flex flex-col">
                                <div className="flex justify-between items-start"><div className="flex items-baseline gap-3"><h2 className="text-2xl font-bold text-slate-800">マイペット</h2><p className="text-xl font-semibold text-indigo-600">{petName}</p></div><div className="text-right"><span className="block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">レベル {level}</span><span className="block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mt-1 shadow-sm">{currentStageName}</span></div></div>
                                <div className="text-center my-4 relative">
                                    <div className="absolute inset-0 flex justify-center items-center"><div className="w-48 h-48 bg-purple-300 rounded-full opacity-30 blur-2xl"></div></div>
                                    <img src={currentPetImage} alt={`${petType} - ${currentStageName}`} className="mx-auto h-48 w-48 object-contain relative z-10 animate-pet-float" />
                                    {evolutionReady && (
                                        <button onClick={() => { setIsEvolving(true); setEvolutionReady(false); }} className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg animate-bounce">
                                            進化する！
                                        </button>
                                    )}
                                    <p className="text-center text-xs text-slate-500 mt-2 font-medium">{timeSinceBirth}</p>
                                </div>
                                {isLoading ? <p className="text-center text-slate-500">学習データを読み込み中...</p> : <div className="flex justify-around text-center bg-slate-50/50 rounded-xl p-3"><div><p className="text-xs text-slate-500 font-semibold">今日の学習</p><p className="font-bold text-lg text-slate-700">{today.h}<span className="text-sm">時間</span>{today.m}<span className="text-sm">分</span></p></div><div><p className="text-xs text-slate-500 font-semibold">合計学習</p><p className="font-bold text-lg text-indigo-600">{total.h}<span className="text-sm">時間</span>{total.m}<span className="text-sm">分</span></p></div><div><p className="text-xs text-slate-500 font-semibold">継続日数</p><p className="font-bold text-lg text-slate-700">{studyData.streakDays}<span className="text-sm">日</span></p></div></div>}
                                {progressData && (<div className="mt-4 pt-4 border-t border-slate-200/80 space-y-4">
                                    <h3 className="text-sm font-bold text-center text-slate-600 uppercase tracking-wider">次の進化まで</h3>
                                    <ProgressBar label="合計学習時間" progress={progressData.hours.progress} currentValue={progressData.hours.current} targetValue={progressData.hours.target} colorClass="bg-gradient-to-r from-green-400 to-cyan-500" />
                                    <ProgressBar label="栄養ポイント" progress={(feedCount / 20) * 100} currentValue={feedCount} targetValue={20} colorClass="bg-gradient-to-r from-pink-400 to-red-500" unit="pt" />
                                </div>)}
                            </Card>
                        </div>
                    </div>
                    
                    <div className="p-4 space-y-6 lg:p-0 lg:pt-4 lg:col-span-3">
                        {activeView === 'home' ? (
                            <div className="space-y-6">
                                <Card>
                                    <SectionTitle title="栄養をあげる" /><p className="text-sm text-slate-600 mb-3">学習した内容をペットの栄養にしよう！</p>
                                    <form onSubmit={handleFeedPet} className="flex gap-2"><input type="text" value={nutrient} onChange={(e) => setNutrient(e.target.value)} placeholder="例：英語の単語 50個" className="flex-grow w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /><button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity duration-300 whitespace-nowrap shadow-lg">あげる</button></form>
                                </Card>
                                <Card>
                                    <SectionTitle title="ペットのメッセージ" /><div className="bg-blue-50/70 p-4 rounded-lg flex items-center gap-4"><img src={currentPetImage} alt="My Pet" className="h-14 w-14 rounded-full flex-shrink-0 object-cover border-2 border-white shadow-md" /><div><p className="text-sm text-slate-700 font-medium">{petMessage}</p></div></div>
                                </Card>
                                <Card>
                                    <div className="flex justify-between items-center mb-3"><h2 className="text-xl font-bold text-slate-700">学習データ</h2><a href="#" className="text-sm font-bold text-indigo-600 flex items-center gap-1"><ChartIcon /> 詳細</a></div>
                                    {isLoading ? <p className="text-center text-slate-500">グラフデータを読み込み中...</p> : <StudyChart data={monthlyLogs} />}
                                    <div className="flex justify-around text-center mt-4"><div><p className="text-xs text-slate-500">チーム中央値</p><p className="font-semibold text-slate-600">{teamStats.median.toFixed(1)}<span className="text-xs">時間/日</span></p></div><div><p className="text-xs text-slate-500">今日の学習時間</p><p className="font-semibold text-indigo-600">{studyData.todayHours.toFixed(2)}<span className="text-xs">時間/日</span></p></div><div><p className="text-xs text-slate-500">ランキング</p><p className="font-semibold text-amber-600">{teamStats.rank}<span className="text-xs">位/{teamStats.size}人</span></p></div></div>
                                </Card>
                            </div>
                        ) : (
                           <div className="lg:max-w-md lg:mx-auto"><TimelineScreen onBack={() => setActiveView('home')} /></div>
                        )}
                    </div>
                </div>
            </div>
            <footer className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-md border-t border-white/30" style={{ maxWidth: '420px', margin: '0 auto' }}>
                <nav className="flex justify-around items-center h-16">
                    <button onClick={() => setActiveView('home')} className={`${activeView === 'home' ? 'text-indigo-600' : 'text-slate-400'} flex flex-col items-center gap-1`}><HomeIcon /><span className="text-xs font-bold">ホーム</span></button>
                    <button onClick={() => setActiveView('timeline')} className={`${activeView === 'timeline' ? 'text-indigo-600' : 'text-slate-400'} flex flex-col items-center gap-1`}><TimelineIcon /><span className="text-xs font-bold">タイムライン</span></button>
                </nav>
            </footer>
        </div>
    );
};

// --- アプリケーションのエントリーポイント ---
export default function App() {
    const [view, setView] = useState('opening');
    const [activeView, setActiveView] = useState('home');
    const [userProfile, setUserProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const loadUserList = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchFromSpreadsheet('getUsers');
            setUserList(data.users || []);
            setView('login');
        } catch (err) {
            const helpfulMessage = "ユーザーリスト読込失敗。スプレッドシートのシート名や公開設定、Apps Scriptを確認してください。";
            console.error(helpfulMessage, err);
            setError(`${helpfulMessage} (詳細: ${err.message})`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (user) => {
        if (user.name === "新しいユーザーとして登録") {
            setView('survey-name');
        } else {
            setCurrentUser(user.name);
            const loadUserData = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const userData = await fetchFromSpreadsheet('getUserData', { user: user.name });
                    if (userData.petName) {
                        const evolutionImages = petImageData[userData.petType] || Array(4).fill("https://placehold.co/180x180/E0E0E0/A0A0A0?text=No+Image");
                        setUserProfile({
                            userName: user.name, level: 1, avatar: `https://placehold.co/32x32/E0E0E0/A0A0A0?text=${user.name.slice(0, 1)}`, petName: userData.petName, petType: userData.petType, birthDate: userData.birthDate, petMessage: `おかえり！${userData.petName}だよ！`, studyData: { totalHours: userData.totalHours, streakDays: userData.streakDays, todayHours: userData.todayHours }, feedCount: userData.feedCount, petEvolutionImages: evolutionImages, teamStats: { median: userData.teamMedian, rank: userData.rank, size: userData.teamSize }
                        });
                        setView('main');
                    } else {
                        setView('survey');
                    }
                } catch (err) {
                    console.error("Login failed:", err);
                    setError(`データ読込失敗: ${err.message}。Apps Scriptのログを確認してください。`);
                } finally {
                    setIsLoading(false);
                }
            };
            loadUserData();
        }
    };
    
    const NewUserScreen = () => {
        const [newUserName, setNewUserName] = useState('');
        const handleSubmit = (e) => {
            e.preventDefault();
            if (newUserName.trim()) {
                setCurrentUser(newUserName.trim());
                setView('survey');
            }
        };
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm"><form onSubmit={handleSubmit}><SectionTitle title="新しいユーザー" /><p className="text-slate-600 mb-4">あなたの名前を入力してください</p><input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="例：佐藤 一郎" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4" required /><button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">次へ</button></form></Card>
            </div>
        );
    };

    const handleSurveyComplete = async (answers, petName) => {
        const petType = determinePetType();
        const evolutionImages = petImageData[petType] || Array(4).fill("https://placehold.co/180x180/E0E0E0/A0A0A0?text=No+Image");
        const birthDate = new Date().toISOString();
        
        await writeToSpreadsheet('savePetInfo', { userName: currentUser, petName, petType, birthDate });

        const initialData = { todayHours: 0, totalHours: 0, streakDays: 0, feedCount: 0 };
        const newUserProfile = {
            userName: currentUser, level: 1, avatar: `https://placehold.co/32x32/E0E0E0/A0A0A0?text=${currentUser.slice(0, 1)}`, petName: petName, petType: petType, birthDate: birthDate, petMessage: `はじめまして！僕の名前は「${petName}」だよ。これから一緒に頑張ろうね！`, studyData: initialData, feedCount: initialData.feedCount, petEvolutionImages: evolutionImages, teamStats: { median: 0, rank: 1, size: 1 }
        };
        setUserProfile(newUserProfile);
        setView('main');
    };

    return (
        <>
            <GlobalStyles />
            {isLoading && <LoadingIndicator />}
            {error && (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-400 to-pink-600">
                    <Card className="w-full max-w-sm text-center">
                        <SectionTitle title="エラーが発生しました" />
                        <p className="text-slate-600 mb-4 break-words">{error}</p>
                        <button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-slate-500 to-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">リロード</button>
                    </Card>
                </div>
            )}
            {!isLoading && !error && (
                <>
                    {view === 'opening' && <OpeningScreen onStart={loadUserList} />}
                    {view === 'login' && <LoginScreen userList={userList} onLogin={handleLogin} />}
                    {view === 'survey-name' && <NewUserScreen />}
                    {view === 'survey' && <SurveyScreen onComplete={handleSurveyComplete} />}
                    {view === 'main' && userProfile && <MainApp userProfile={userProfile} activeView={activeView} setActiveView={setActiveView} />}
                </>
            )}
        </>
    );
}
