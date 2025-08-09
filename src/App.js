import React, { useState, useEffect, useMemo } from 'react';

// --- アイコンコンポーネント (変更なし) ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TimelineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TeamIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.001 3.001 0 015.286 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

// --- UIコンポーネント (変更なし) ---
const Card = ({ children, className = '' }) => <div className={`bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg p-4 ${className}`}>{children}</div>;
const SectionTitle = ({ title }) => <h2 className="text-xl font-bold text-slate-700 mb-4">{title}</h2>;
const ProgressBar = ({ label, progress, currentValue, targetValue, colorClass }) => {
    const progressPercent = Math.min(progress, 100);
    return (
        <div>
            <div className="flex justify-between items-end mb-1"><span className="text-sm font-semibold text-slate-600">{label}</span><span className="text-xs font-bold text-slate-500">{currentValue} / {targetValue} 時間</span></div>
            <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner overflow-hidden border border-slate-300/50"><div className={`h-4 rounded-full ${colorClass} transition-all duration-500 ease-out flex items-center justify-end`} style={{ width: `${progressPercent}%` }}><div className="w-2 h-2 bg-white/50 rounded-full mr-1 opacity-50"></div></div></div>
        </div>
    );
};

// --- 画像データを管理 ---
const petImageData = {
    "スライム": [ "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%8D%B5%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0.png" ],
    "イヌ": [ "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%8D%B5%E6%9C%9F_%E7%8A%AC.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E7%8A%AC.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E7%8A%AC.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E7%8A%AC.png" ],
    "トリ": [ "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%8D%B5%E6%9C%9F_%E9%B3%A5.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E9%B3%A5.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E9%B3%A5.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E9%B3%A5.png" ],
    "カメ": [ "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%8D%B5%E6%9C%9F_%E4%BA%80.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E5%B9%BC%E5%B9%B4%E6%9C%9F_%E4%BA%80.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E9%95%B7%E6%9C%9F_%E4%BA%80.png", "https://github.com/JOHN-MURO/sodateru-app/blob/main/images/%E6%88%90%E7%86%9F%E6%9C%9F_%E4%BA%80.png" ],
    // 他のペットタイプの画像URLもここに追加
};

// --- スプレッドシートからデータを取得する関数 (変更なし) ---
const fetchStudyDataFromSpreadsheet = async (userName) => {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbzm94TzRGOdAp735lGKG1uPMjDVIcyK0TpqerMTxRZNZlzFHSXOLBWi7vet_N8ocJ30/exec"; 
    if (!sheetUrl || sheetUrl === "https://script.google.com/macros/s/AKfycbzm94TzRGOdAp735lGKG1uPMjDVIcyK0TpqerMTxRZNZlzFHSXOLBWi7vet_N8ocJ30/exec") {
        console.warn("Spreadsheet URL is not set. Using mock data.");
        return { todayHours: 0, totalHours: 0, streakDays: 0, feedCount: 0 };
    }
    try {
        const response = await fetch(sheetUrl);
        if (!response.ok) throw new Error("Network response was not ok.");
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(','));
        const userRow = rows.find(row => row[0].trim() === userName);
        if (userRow) {
            return { totalHours: parseFloat(userRow[1]) || 0, streakDays: parseInt(userRow[2]) || 0, todayHours: parseFloat(userRow[3]) || 0, feedCount: parseInt(userRow[4]) || 0 };
        }
        return { todayHours: 0, totalHours: 0, streakDays: 0, feedCount: 0 };
    } catch (error) {
        console.error("Failed to fetch or parse spreadsheet data:", error);
        return { todayHours: 0, totalHours: 0, streakDays: 0, feedCount: 0 };
    }
};

// --- カスタムフック (変更なし) ---
const useTimeSince = (isoDate) => {
    const [timeSince, setTimeSince] = useState('');
    useEffect(() => {
        const calculate = () => {
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

// --- アンケートとログイン ---
const surveyQuestions = [
    { question: "どんな時に一番集中できますか？", options: { A: "朝", B: "夜", C: "静かな場所" } },
    { question: "新しいことを学ぶとき、どの方法が好きですか？", options: { A: "じっくり計画を立てる", B: "とにかくやってみる", C: "友達と一緒" } },
    { question: "あなたの学習のゴールは？", options: { A: "資格取得", B: "新しいスキル", C: "趣味のため" } },
];

const determinePetType = (answers) => {
    const q1Map = { A: "太陽の", B: "月の", C: "静寂の" };
    const q2Map = { A: "賢者", B: "勇者", C: "仲間と旅する" };
    const q3Map = { A: "ドラゴン", B: "フェニックス", C: "グリフォン" };
    return `${q1Map[answers.q1]} ${q2Map[answers.q2]} ${q3Map[answers.q3]}`;
};

const LoginScreen = ({ userList, onLogin }) => {
    const [selectedUser, setSelectedUser] = useState(userList[0] || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedUser) {
            onLogin(selectedUser);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <SectionTitle title="ようこそ！" />
                    <p className="text-slate-600 mb-4">あなたの名前を選択してください</p>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4 bg-white"
                    >
                        {userList.map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">はじめる</button>
                </form>
            </Card>
        </div>
    );
};

const SurveyScreen = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({});
    // ★ 追加: ペットの名前を管理するためのstate
    const [petName, setPetName] = useState('');

    const handleAnswer = (questionIndex, answer) => {
        setAnswers(a => ({ ...a, [`q${questionIndex + 1}`]: answer }));
        setStep(s => s + 1);
    };
    
    // ★ 追加: ペットの名前を決定し、完了処理を呼び出す関数
    const handleComplete = (e) => {
        e.preventDefault();
        if (petName) {
            onComplete(answers, petName);
        }
    };

    if (step <= surveyQuestions.length) {
        const currentQuestionIndex = step - 1;
        const { question, options } = surveyQuestions[currentQuestionIndex];
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm"><SectionTitle title={`質問 ${step}/${surveyQuestions.length}`} /><p className="text-slate-800 mb-6 text-lg font-semibold">{question}</p><div className="space-y-3">{Object.entries(options).map(([key, value]) => (<button key={key} onClick={() => handleAnswer(currentQuestionIndex, key)} className="w-full text-left bg-slate-100 p-4 rounded-lg hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-400 transition-all duration-200 font-medium">{value}</button>))}</div></Card>
            </div>
        );
    }
    
    // ★ 追加: アンケート完了後にペットの名前入力画面を表示
    if (step > surveyQuestions.length) {
        return (
             <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm"><form onSubmit={handleComplete}><SectionTitle title="ペットに名前をつけよう" /><p className="text-slate-600 mb-4">あなたの新しいパートナーの名前は？</p><input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="例：ポチ" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4" required /><button type="submit" className="w-full bg-gradient-to-r from-green-500 to-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg">決定</button></form></Card>
            </div>
        )
    }

    return null;
};


// --- メインアプリ ---
const evolutionRequirements = [
    { name: "卵期", hours: 0 }, { name: "幼年期", hours: 5 }, { name: "成長期", hours: 20 }, { name: "成熟期", hours: 50 },
];

const MainApp = ({ userProfile }) => {
    // ★ 変更点: petName を userProfile から受け取る
    const { userName, level, avatar, petName, petType, birthDate, petEvolutionImages } = userProfile;
    
    const [petMessage, setPetMessage] = useState(userProfile.petMessage);
    const [studyData, setStudyData] = useState(userProfile.studyData);
    const [feedCount, setFeedCount] = useState(userProfile.feedCount);
    const [nutrient, setNutrient] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const timeSinceBirth = useTimeSince(birthDate);

    const evolutionStage = useMemo(() => {
        const { totalHours } = studyData;
        for (let i = evolutionRequirements.length - 1; i >= 0; i--) {
            if (totalHours >= evolutionRequirements[i].hours) return i;
        }
        return 0;
    }, [studyData.totalHours]);

    const progressData = useMemo(() => {
        if (evolutionStage >= evolutionRequirements.length - 1) return null;
        const currentReq = evolutionRequirements[evolutionStage];
        const nextReq = evolutionRequirements[evolutionStage + 1];
        const hoursNeeded = nextReq.hours - currentReq.hours;
        const hoursProgress = hoursNeeded > 0 ? ((studyData.totalHours - currentReq.hours) / hoursNeeded) * 100 : 100;
        return {
            hours: { progress: hoursProgress, current: studyData.totalHours.toFixed(1), target: nextReq.hours },
        };
    }, [evolutionStage, studyData.totalHours]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const fetchedData = await fetchStudyDataFromSpreadsheet(userName);
            setStudyData({ totalHours: fetchedData.totalHours, streakDays: fetchedData.streakDays, todayHours: fetchedData.todayHours });
            setFeedCount(fetchedData.feedCount);
            setIsLoading(false);
        };
        loadData();
    }, [userName]);

    const handleFeedPet = (e) => {
        e.preventDefault();
        if (!nutrient.trim()) { alert('栄養になる学習内容を入力してください！'); return; }
        setPetMessage(`「${nutrient}」を栄養にして、もっと賢くなったよ！ありがとう！`);
        setFeedCount(c => c + 1);
        setNutrient('');
    };

    const formatHours = (hours) => ({ h: Math.floor(hours), m: Math.round((hours - Math.floor(hours)) * 60) });
    const today = formatHours(studyData.todayHours);
    const total = formatHours(studyData.totalHours);
    
    const currentPetImage = petEvolutionImages[evolutionStage];
    const currentStageName = evolutionRequirements[evolutionStage].name;

    return (
        <div className="font-sans bg-gradient-to-br from-slate-100 to-blue-200" style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div className="min-h-screen bg-transparent pb-24">
                <header className="p-4 flex justify-between items-center sticky top-0 bg-white/50 backdrop-blur-md z-10 shadow-sm"><h1 className="text-2xl font-bold text-slate-800">スタディペット</h1><div className="flex items-center gap-3"><span className="font-semibold text-slate-700">{userName}</span><img src={avatar} alt="User Avatar" className="rounded-full w-9 h-9 border-2 border-white" /></div></header>
                <main className="p-4 space-y-6">
                    <Card className="relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            {/* ★ 変更点: ペットの名前を表示 */}
                            <div className="flex items-baseline gap-3"><h2 className="text-2xl font-bold text-slate-800">マイペット</h2><p className="text-xl font-semibold text-indigo-600">{petName}</p></div>
                            <div className="text-right"><span className="block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">レベル {level}</span><span className="block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mt-1 shadow-sm">{currentStageName}</span></div>
                        </div>
                        <div className="text-center my-4 relative"><div className="absolute inset-0 flex justify-center items-center"><div className="w-48 h-48 bg-purple-300 rounded-full opacity-30 blur-2xl animate-pulse"></div></div><img src={currentPetImage} alt={`${petType} - ${currentStageName}`} className="mx-auto h-48 w-48 object-contain relative z-10" /><p className="text-center text-xs text-slate-500 mt-2 font-medium">{timeSinceBirth}</p></div>
                        {isLoading ? <p className="text-center text-slate-500">学習データを読み込み中...</p> : <div className="flex justify-around text-center bg-slate-50/50 rounded-xl p-3"><div><p className="text-xs text-slate-500 font-semibold">今日の学習</p><p className="font-bold text-lg text-slate-700">{today.h}<span className="text-sm">時間</span>{today.m}<span className="text-sm">分</span></p></div><div><p className="text-xs text-slate-500 font-semibold">合計学習</p><p className="font-bold text-lg text-indigo-600">{total.h}<span className="text-sm">時間</span>{total.m}<span className="text-sm">分</span></p></div><div><p className="text-xs text-slate-500 font-semibold">継続日数</p><p className="font-bold text-lg text-slate-700">{studyData.streakDays}<span className="text-sm">日</span></p></div></div>}
                        {progressData && (<div className="mt-4 pt-4 border-t border-slate-200/80 space-y-4"><h3 className="text-sm font-bold text-center text-slate-600 uppercase tracking-wider">次の進化まで</h3><ProgressBar label="合計学習時間" progress={progressData.hours.progress} currentValue={progressData.hours.current} targetValue={progressData.hours.target} colorClass="bg-gradient-to-r from-green-400 to-cyan-500" /></div>)}
                    </Card>
                    <Card>
                        <SectionTitle title="栄養をあげる" /><p className="text-sm text-slate-600 mb-3">学習した内容をペットの栄養にしよう！</p>
                        <form onSubmit={handleFeedPet} className="flex gap-2"><input type="text" value={nutrient} onChange={(e) => setNutrient(e.target.value)} placeholder="例：英語の単語 50個" className="flex-grow w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /><button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity duration-300 whitespace-nowrap shadow-lg">あげる</button></form>
                    </Card>
                    <Card>
                        <SectionTitle title="ペットのメッセージ" /><div className="bg-blue-50/70 p-4 rounded-lg flex items-center gap-4"><img src={currentPetImage} alt="My Pet" className="h-14 w-14 rounded-full flex-shrink-0 object-cover border-2 border-white shadow-md" /><div><p className="text-sm text-slate-700 font-medium">{petMessage}</p></div></div>
                    </Card>
                    <Card>
                        <div className="flex justify-between items-center mb-3"><h2 className="text-xl font-bold text-slate-700">学習データ</h2><a href="#" className="text-sm font-bold text-indigo-600 flex items-center gap-1"><ChartIcon /> 詳細</a></div>
                        <div className="flex items-end h-24 gap-1.5">{[...Array(20)].map((_, i) => <div key={i} className="flex-1 bg-slate-300 rounded-t-md" style={{ height: `${Math.random() * 80 + 15}%` }}></div>)}</div>
                        <div className="flex justify-around text-center mt-4"><div><p className="text-xs text-slate-500">チーム平均</p><p className="font-semibold text-slate-600">1.2<span className="text-xs">時間/日</span></p></div><div><p className="text-xs text-slate-500">今日の学習時間</p><p className="font-semibold text-indigo-600">{studyData.todayHours}<span className="text-xs">時間/日</span></p></div><div><p className="text-xs text-slate-500">ランキング</p><p className="font-semibold text-amber-600">5<span className="text-xs">位/28人</span></p></div></div>
                    </Card>
                </main>
            </div>
            <footer className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-md border-t border-white/30" style={{ maxWidth: '420px', margin: '0 auto' }}><nav className="flex justify-around items-center h-16"><a href="#" className="text-indigo-600 flex flex-col items-center gap-1"><HomeIcon /><span className="text-xs font-bold">ホーム</span></a><a href="#" className="text-slate-400 flex flex-col items-center gap-1"><TimelineIcon /><span className="text-xs">タイムライン</span></a><button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-16 h-16 -mt-8 flex items-center justify-center shadow-xl border-4 border-white"><span className="text-sm font-bold">学習</span></button><a href="#" className="text-slate-400 flex flex-col items-center gap-1"><TeamIcon /><span className="text-xs">チーム</span></a><a href="#" className="text-slate-400 flex flex-col items-center gap-1"><SettingsIcon /><span className="text-xs">設定</span></a></nav></footer>
        </div>
    );
};

// --- アプリケーションのエントリーポイント ---
export default function App() {
    const [view, setView] = useState('login');
    const [userProfile, setUserProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState('');

    const userList = ["田中 健士", "鈴木 裕子", "佐藤 一郎 (新規)"];

    const existingUsers = {
        "田中 健士": { petName: "リュウ", petType: "太陽の賢者ドラゴン" },
        "鈴木 裕子": { petName: "ホノカ", petType: "月の勇者フェニックス" },
    };

    const handleLogin = (userName) => {
        setCurrentUser(userName);
        if (existingUsers[userName]) {
            const petInfo = existingUsers[userName];
            const evolutionImages = petImageData[petInfo.petType] || Array(4).fill("https://placehold.co/180x180/E0E0E0/A0A0A0?text=No+Image");
            setUserProfile({
                userName: userName, level: 1, avatar: `https://placehold.co/32x32/E0E0E0/A0A0A0?text=${userName.slice(0, 1)}`, petName: petInfo.petName, petType: petInfo.petType, birthDate: new Date().toISOString(), petMessage: `おかえり！${petInfo.petName}だよ！`, studyData: { todayHours: 0, totalHours: 0, streakDays: 0 }, feedCount: 0, petEvolutionImages: evolutionImages,
            });
            setView('main');
        } else {
            setView('survey');
        }
    };

    // ★ 変更点: petName を受け取り、新しいプロフィールを作成する
    const handleSurveyComplete = async (answers, petName) => {
        const petType = determinePetType(answers);
        const evolutionImages = petImageData[petType] || Array(4).fill("https://placehold.co/180x180/E0E0E0/A0A0A0?text=No+Image");
        const initialData = await fetchStudyDataFromSpreadsheet(currentUser);
        const newUserProfile = {
            userName: currentUser, 
            level: 1, 
            avatar: `https://placehold.co/32x32/E0E0E0/A0A0A0?text=${currentUser.slice(0, 1)}`, 
            petName: petName,
            petType: petType, 
            birthDate: new Date().toISOString(), 
            petMessage: `はじめまして！僕の名前は「${petName}」だよ。これから一緒に頑張ろうね！`,
            studyData: initialData, 
            feedCount: initialData.feedCount, 
            petEvolutionImages: evolutionImages,
        };
        setUserProfile(newUserProfile);
        setView('main');
    };

    if (view === 'login') {
        return <LoginScreen userList={userList} onLogin={handleLogin} />;
    }
    
    if (view === 'survey') {
        return <SurveyScreen onComplete={handleSurveyComplete} />;
    }

    if (view === 'main' && userProfile) {
        return <MainApp userProfile={userProfile} />;
    }
    
    return <div>Loading...</div>; // Fallback
}