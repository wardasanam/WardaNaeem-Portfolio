import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  motion, 
  Reorder, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useAnimation, 
  useMotionValue, 
  useMotionTemplate, 
  LayoutGroup
} from 'framer-motion';
import { 
  Code2, Briefcase, GraduationCap, User, Mail, GripVertical, Palette, X, Check, MapPin,
  Heart, MessageCircle, Share2, Bookmark, Repeat, MoreHorizontal, Search, Home, Bell, Music2, Instagram, Facebook, Twitter, ThumbsUp, MessageSquare,
  Terminal, Award, Coffee, Plane, Play, Pause, Disc, Sticker, Zap, Smile, Rocket, Send, Users, Video, Store, Hash, List, Compass, Clock, ExternalLink, Github, Linkedin, Loader2, PenTool, Trash2, Eraser, RefreshCw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, Headphones, Camera, StickyNote,
  // New "Funny Coding" Icons
  Bug, Flame, Skull, Laptop, AlertTriangle, MonitorPlay,
  // Project Icons
  CreditCard, Brain, Bot, Link, Image, Mic, Film, CheckSquare, Layers, BarChart2, Star, Quote,
  // Arsenal Icons
  Cpu, Monitor, Type, MousePointer2,
  // Tab Icons
  Grid, FileText, Tag, TrendingUp,
  Eye, GitCommit, GitBranch, Sparkles,
  Languages // Added Language Icon
} from 'lucide-react';

// --- 1. UTILITIES & DATA ---

const PROFILE = {
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
  cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop&q=80"
};

const playSound = (type) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
    
  if (type === 'pop') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'click') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now);
    gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  } else if (type === 'success') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(600, now + 0.1); osc.frequency.setValueAtTime(1000, now + 0.2);
    gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
    osc.start(now); osc.stop(now + 0.4);
  } else if (type === 'switch') {
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter(); noiseFilter.type = 'lowpass'; noiseFilter.frequency.setValueAtTime(1000, now); noiseFilter.frequency.linearRampToValueAtTime(100, now + 0.2);
    noise.connect(noiseFilter); noiseFilter.connect(gain);
    gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
    noise.start(now);
  } else if (type === 'slap') {
    osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'spray') {
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.setValueAtTime(800, now);
    noise.connect(noiseFilter); noiseFilter.connect(gain);
    gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
    noise.start(now);
  } else if (type === 'eat') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.linearRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'tick') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); 
    gain.gain.setValueAtTime(0.02, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.start(now); osc.stop(now + 0.03);
  }
};

const THEMES = {
  tiktok: { id: 'tiktok', label: 'TikTok', icon: Music2, bg: 'bg-black', text: 'text-white', accent: 'text-pink-400', layoutMode: 'snap', font: 'font-sans' },
  instagram: { id: 'instagram', label: 'Instagram', icon: Instagram, bg: 'bg-white', text: 'text-zinc-900', accent: 'text-pink-500', layoutMode: 'feed', font: 'font-sans' },
  facebook: { id: 'facebook', label: 'Facebook', icon: Facebook, bg: 'bg-[#F0F2F5]', text: 'text-[#050505]', accent: 'text-[#1877F2]', layoutMode: 'feed', font: 'font-sans' },
  twitter: { id: 'twitter', label: 'X / Twitter', icon: Twitter, bg: 'bg-black', text: 'text-[#e7e9ea]', accent: 'text-[#1d9bf0]', layoutMode: 'feed', font: 'font-sans' }
};

// --- TRANSLATION DATA ---
const UI_TRANSLATIONS = {
  en: {
    theme: "THEME",
    forYou: "For You",
    live: "Live",
    creator: "CREATOR",
    followers: "Followers",
    following: "Following",
    projects: "Projects",
    likes: "likes",
    comments: "Comments",
    share: "Share",
    reply: "Reply",
    search: "Search",
    home: "Home",
    profile: "Profile",
    messages: "Messages",
    notifications: "Notifications",
    create: "Create",
    explore: "Explore",
    reels: "Reels",
    sponsored: "Sponsored",
    contacts: "Contacts",
    posts: "Posts",
    replies: "Replies",
    whatsHappening: "What's Happening",
    whoToFollow: "Who to follow",
    follow: "Follow",
    editProfile: "Edit profile",
    addFriend: "Add Friend",
    message: "Message",
    connect: "Connect",
    openForWork: "Open for Work",
    projectHub: "Project Hub",
    projectHubTitle: "Project Hub", // Updated: Removed "3D"
    tapCenter: "TAP CENTER",
    trendingSkills: "Trending Skills",
    liveBadge: "LIVE",
    vibeCheck: "VIBE CHECK",
    dragToReorganize: "Drag to reorganize",
    getInTouch: "Get in Touch",
    directMessage: "Direct Message",
    mentionsGear: "Mentions & Gear",
    taggedIn: "Photos and tools you're tagged in",
    findOnline: "Send me a message or find me online",
    messageSent: "Message Sent! 🚀",
    sendMessage: "Send Message",
    sending: "Sending...",
    yourName: "Your Name",
    startMessage: "Start a new message",
    writeMessage: "Write something to Warda...",
    nowPlaying: "NOW PLAYING",
    originalSound: "Original Sound",
    welcome: "Welcome!",
    thanksPortfolio: "Thanks for checking out my portfolio.",
    graffitiMode: "Graffiti Mode",
    draw: "DRAW",
    erase: "ERASE",
    clearAll: "CLEAR ALL",
    done: "DONE",
    holdToSpray: "Hold Click to Spray",
    remixFeed: "Remix Your Feed",
    saveLayout: "Save Layout",
    achievement: "Achievement Unlocked 🏆",
    threadWork: "Thread of my work: 🧵👇",
    findElsewhere: "Find me elsewhere",
    newMessage: "New Message",
    years: "Years",
    coffee: "Coffee",
    hireMe: "Hire Me",
    suggestionsForYou: "Suggestions for you",
    seeAll: "See All",
    trendingInTech: "Trending in Tech",
    trendingInGermany: "Trending in Germany",
    techTrending: "Technology · Trending",
    showMore: "Show more",
    // Facebook Sidebar Items
    memories: "Memories",
    saved: "Saved",
    groups: "Groups",
    video: "Video",
    marketplace: "Marketplace",
    feeds: "Feeds",
    githubProfile: "GitHub Profile",
    linkedinConnection: "LinkedIn Connection",
    techRecruiter: "Tech Recruiter",
    projectManager: "Project Manager",
    topReactDev: "Top React Dev",
    hireMeCap: "HIRE ME!",
    // Sticker Labels
    stickerFeature: "It's a feature",
    stickerFire: "Production on Fire",
    stickerJava: "Java-Script",
    stickerLegacy: "Legacy Code",
    sticker404: "Warning: 404",
    // Project Viewers/Tags
    match98: "98% Match",
    newSeason: "New Season",
    trending: "Trending",
    top10: "Top 10",
    viral: "Viral",
    chill: "Chill",
    popular: "Popular",
    productivity: "Productivity",
    // Project Titles
    pExpense: "Expense Tracker",
    pMemory: "Memory Game",
    pChat: "AI Chat App",
    pChain: "Mystery Chain",
    pInsta: "Instagram Clone",
    pLofi: "Lofi Study Room",
    pWatch: "What to Watch",
    pTask: "TaskDrops",
  },
  de: {
    theme: "THEMA",
    forYou: "Für dich",
    live: "Live",
    creator: "SCHÖPFER",
    followers: "Follower",
    following: "Folge ich",
    projects: "Projekte",
    likes: "Likes",
    comments: "Kommentare",
    share: "Teilen",
    reply: "Antworten",
    search: "Suche",
    home: "Startseite",
    profile: "Profil",
    messages: "Nachrichten",
    notifications: "Mitteilungen",
    create: "Erstellen",
    explore: "Entdecken",
    reels: "Reels",
    sponsored: "Gesponsert",
    contacts: "Kontakte",
    posts: "Beiträge",
    replies: "Antworten",
    whatsHappening: "Was gibt's Neues",
    whoToFollow: "Wem folgen",
    follow: "Folgen",
    editProfile: "Profil bearbeiten",
    addFriend: "Freund hinzufügen",
    message: "Nachricht",
    connect: "Vernetzen",
    openForWork: "Offen für Jobs",
    projectHub: "Projekt-Hub",
    projectHubTitle: "Projekt-Hub", // Updated: Removed "3D"
    tapCenter: "MITTE TIPPEN",
    trendingSkills: "Angesagte Skills",
    liveBadge: "LIVE",
    vibeCheck: "VIBE CHECK",
    dragToReorganize: "Zum Ordnen ziehen",
    getInTouch: "Kontakt",
    directMessage: "Direktnachricht",
    mentionsGear: "Erwähnungen & Tools",
    taggedIn: "Fotos und Tools, in denen du markiert bist",
    findOnline: "Schreib mir oder finde mich online",
    messageSent: "Nachricht gesendet! 🚀",
    sendMessage: "Absenden",
    sending: "Sende...",
    yourName: "Dein Name",
    startMessage: "Neue Nachricht schreiben",
    writeMessage: "Schreibe Warda etwas...",
    nowPlaying: "LÄUFT GERADE",
    originalSound: "Originalton",
    welcome: "Willkommen!",
    thanksPortfolio: "Danke für deinen Besuch.",
    graffitiMode: "Graffiti Modus",
    draw: "MALEN",
    erase: "RADIEREN",
    clearAll: "LÖSCHEN",
    done: "FERTIG",
    holdToSpray: "Klicken & Halten zum Sprühen",
    remixFeed: "Feed anpassen",
    saveLayout: "Layout speichern",
    achievement: "Erfolg freigeschaltet 🏆",
    threadWork: "Meine Arbeiten: 🧵👇",
    findElsewhere: "Finde mich hier",
    newMessage: "Neue Nachricht",
    years: "Jahre",
    coffee: "Kaffee",
    hireMe: "Stell mich ein",
    suggestionsForYou: "Vorschläge für dich",
    seeAll: "Alle ansehen",
    trendingInTech: "Trends in Tech",
    trendingInGermany: "Trends in Deutschland",
    techTrending: "Technologie · Trends",
    showMore: "Mehr anzeigen",
    // Facebook Sidebar Items
    memories: "Erinnerungen",
    saved: "Gespeichert",
    groups: "Gruppen",
    video: "Video",
    marketplace: "Marktplatz",
    feeds: "Feeds",
    githubProfile: "GitHub Profil",
    linkedinConnection: "LinkedIn Verbindung",
    techRecruiter: "Tech Recruiter",
    projectManager: "Projektmanager",
    topReactDev: "Top React Dev",
    hireMeCap: "STELL MICH EIN!",
    // Sticker Labels
    stickerFeature: "Ist ein Feature",
    stickerFire: "Produktion brennt",
    stickerJava: "Java-Script",
    stickerLegacy: "Legacy Code",
    sticker404: "Warnung: 404",
    // Project Viewers/Tags
    match98: "98% Treffer",
    newSeason: "Neue Staffel",
    trending: "Angesagt",
    top10: "Top 10",
    viral: "Viral",
    chill: "Entspannt",
    popular: "Beliebt",
    productivity: "Produktivität",
    // Project Titles
    pExpense: "Ausgaben-Tracker",
    pMemory: "Memory Spiel",
    pChat: "KI Chat App",
    pChain: "Mystery Chain",
    pInsta: "Instagram Klon",
    pLofi: "Lofi Lernraum",
    pWatch: "Was schauen?",
    pTask: "TaskDrops",
  }
};

const getT = (lang) => (key) => {
  if (key === 'lang') return lang;
  return UI_TRANSLATIONS[lang]?.[key] || key;
};

const GET_SECTIONS = (t) => [
  { id: 'intro', type: 'intro', title: t('profile'), content: { 
      name: "Warda Naeem", 
      handle: "@warda.dev", 
      role: t('lang') === 'de' ? "Front-End Entwicklerin" : "Front-End Developer", 
      location: t('lang') === 'de' ? "Köln, Deutschland" : "Köln, Germany", 
      stats: { posts: "5", followers: "1.2k", following: "250" }, 
      summary: t('lang') === 'de' 
        ? "Proaktive Front-End Entwicklerin mit 5 Jahren Erfahrung. Master-Studentin in Informatik. Spezialistin für React & Sichere Web-Apps." 
        : "Proactive Front-End Developer with 5 years of experience. Master's student in CS. Specialist in React & Secure Web Apps.", 
      hashtags: "#React #Developer #Frontend #UIUX" 
  }},
  { id: 'experience', type: 'timeline', title: t('lang') === 'de' ? 'Erfahrung' : 'Experience', items: [
      { role: t('lang') === 'de' ? "Front-End Entwicklerin" : "Front-End Developer", company: "Zelantic", period: "Feb 2023 - Oct 2023", loc: "Würzburg", desc: t('lang') === 'de' ? "Entwicklung sicherer interaktiver Web-Apps & benutzerdefinierter UI-Bibliotheken." : "Developed secure interactive web apps & custom UI libraries to boost productivity." }, 
      { role: "Website Management", company: "JMU Würzburg", period: "Jun 2022 - Jan 2023", loc: "Würzburg", desc: t('lang') === 'de' ? "SEO-Optimierung & TYPO3-Template-Entwicklung für Universitätsportale." : "SEO optimization & TYPO3 template development for university portals." }, 
      { role: t('lang') === 'de' ? "Freiberufliche Webentwicklerin" : "Freelance Web Developer", company: t('lang') === 'de' ? "Selbstständig" : "Self-Employed", period: "2019 - 2022", loc: "Remote", desc: t('lang') === 'de' ? "Lieferung maßgeschneiderter Web-Lösungen für internationale Kunden." : "Delivered custom web solutions and front-end development for international clients." }
  ] },
  { id: 'projects', type: 'projects', title: t('projectHub'), items: [
    { title: t('pExpense'), genre: t('lang') === 'de' ? 'React • Finanzen' : 'React • Finance', color: 'from-emerald-500 to-emerald-800', viewers: t('match98'), link: 'https://wardasanam.github.io/react-expense-tracker/', icon: CreditCard },
    { title: t('pMemory'), genre: t('lang') === 'de' ? 'Interaktiv • Logik' : 'Interactive • Logic', color: 'from-orange-500 to-red-700', viewers: t('newSeason'), link: 'https://wardasanam.github.io/memory-game/', icon: Brain },
    { title: t('pChat'), genre: 'React • AI', color: 'from-blue-500 to-indigo-700', viewers: t('trending'), link: 'https://wardasanam.github.io/react-ai-chat-app/', icon: Bot },
    { title: t('pChain'), genre: 'Web3 • dApp', color: 'from-violet-500 to-purple-800', viewers: t('top10'), link: 'https://wardasanam.github.io/mystery-chain-app/', icon: Link },
    { title: t('pInsta'), genre: 'Social • UI/UX', color: 'from-pink-500 to-rose-700', viewers: t('viral'), link: 'https://wardasanam.github.io/instagram-clone/', icon: Image },
    { title: t('pLofi'), genre: t('lang') === 'de' ? 'Audio • Vibe' : 'Audio • Vibe', color: 'from-cyan-500 to-blue-700', viewers: t('chill'), link: 'https://wardasanam.github.io/LOFI-STUDY-ROOM/', icon: Headphones },
    { title: t('pWatch'), genre: t('lang') === 'de' ? 'API • Filme' : 'API • Movies', color: 'from-yellow-400 to-orange-600', viewers: t('popular'), link: 'https://wardasanam.github.io/what-to-watch/', icon: Film },
    { title: t('pTask'), genre: t('lang') === 'de' ? 'Produktivität • Tools' : 'Productivity • Tools', color: 'from-teal-400 to-emerald-700', viewers: t('productivity'), link: 'https://wardasanam.github.io/TaskDrops/', icon: CheckSquare }
  ]},
  { id: 'skills', type: 'tags', title: 'Tech Stack', tags: [
    "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", 
    "HTML5", "CSS3", "SASS/SCSS", "Tailwind CSS", 
    "Styled Components", "Material UI", "Chakra UI", "Framer Motion",
    "Redux", "Context API", "Zustand", "React Query",
    "Node.js", "Express.js", "Firebase", "Supabase",
    "GraphQL", "REST API", "Git/GitHub", "Webpack",
    "Vite", "Jest", "Cypress", "React Testing Library",
    "Three.js", "WebGL", "Responsive Design", "Web Accessibility",
    "Figma", "Adobe XD", "Vercel", "Netlify",
    "Storybook", "PWA", "SEO", "Performance Optimization"
  ]},
  { id: 'education', type: 'education', title: t('lang') === 'de' ? 'Ausbildung' : 'Education', items: [{ degree: t('lang') === 'de' ? "Master in Informatik" : "Master's in Computer Science", school: "JMU Würzburg", year: "2022 - Present" }, { degree: t('lang') === 'de' ? "Bachelor Wirtschaftsinformatik" : "BS Information Technology", school: "Arid Agriculture University", year: "2015 - 2019" }] },
  { id: 'vibe', type: 'vibe', title: 'Vibe Check', content: { title: 'Personal Vibes', description: 'Who I am AFK 🎮☕' } },
  { id: 'testimonials', type: 'testimonials', title: t('lang') === 'de' ? 'Der Hype' : 'The Hype', items: [
    { id: 1, user: "Sarah Jenkins", handle: "@sarah_cto", role: "CTO @ TechFlow", text: t('lang') === 'de' ? "Warda ist ein absolutes Tier in React! 🚀 MVP 2 Wochen früher geliefert." : "Warda is an absolute beast at React! 🚀 Delivered our MVP 2 weeks early.", likes: "1.2k" },
    { id: 2, user: "Mike Ross", handle: "@mike_design", role: "Sr. Product Designer", text: t('lang') === 'de' ? "Pixelgenaue Umsetzung. Endlich ein Dev, der auf Details achtet! 🎨" : "Pixel perfect implementation. Finally a dev who cares about details! 🎨", likes: "856" },
    { id: 3, user: "Tech Recruiter", handle: "@jobs_tech", role: "Recruiter", text: t('lang') === 'de' ? "Habe Warda für einen Vertrag eingestellt, wollte sie sofort in Vollzeit behalten. 💯" : "Hired Warda for a contract, wanted to keep her full-time immediately. 💯", likes: "2.4k" }
  ]},
  { id: 'contact', type: 'contact', title: t('lang') === 'de' ? 'Kontakt' : 'Contact', links: [{ label: "Email", val: "wardanaeem2@gmail.com", icon: Mail, href: "mailto:wardanaeem2@gmail.com" }, { label: "LinkedIn", val: "linkedin.com/in/wardanaeem2", icon: Briefcase, href: "https://www.linkedin.com/in/wardanaeem2/" }, { label: "GitHub", val: "github.com/wardasanam", icon: Code2, href: "https://github.com/wardasanam" }] }
];

// --- 2. SHARED COMPONENTS ---

const GlitchText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => { setDisplayText(String(text || "")); }, [text]);
  const scramble = () => {
    if (!text) return;
    const str = String(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    let iter = 0;
    const interval = setInterval(() => {
      setDisplayText(str.split("").map((_, i) => i < iter ? str[i] : chars[Math.floor(Math.random() * 43)]).join(""));
      if (iter >= str.length) clearInterval(interval);
      iter += 1/3;
    }, 30);
  };
  return <span onMouseEnter={scramble} className="font-mono cursor-default hover:text-green-400 transition-colors inline-block">{displayText}</span>;
};

const UserAvatar = ({ className = "w-10 h-10", src, onClick }) => (
  <motion.div onClick={onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${className} rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px] flex-shrink-0 cursor-pointer`}>
    <div className="w-full h-full rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden">
        <img src={src || PROFILE.avatar} alt="User" className="w-full h-full object-cover" />
    </div>
  </motion.div>
);

const ActionSidebar = ({ onLike, likeCount, themeId, isLiked }) => (
  <div className="flex flex-col gap-6 items-center pointer-events-auto">
    <div className="flex flex-col items-center gap-1">
      <motion.button whileTap={{ scale: 0.8 }} onClick={() => onLike(themeId)} className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer"><Heart size={24} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} /></motion.button>
      <span className="text-xs font-bold text-white shadow-black drop-shadow-md"><GlitchText text={`${8500 + likeCount}`} /></span>
    </div>
    <div className="flex flex-col items-center gap-1"><div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer"><MessageCircle size={24} className="text-white" /></div><span className="text-xs font-bold text-white shadow-black drop-shadow-md">420</span></div>
    <div className="flex flex-col items-center gap-1"><div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer"><Share2 size={24} className="text-white" /></div><span className="text-xs font-bold text-white shadow-black drop-shadow-md">Share</span></div>
  </div>
);

const Confetti = () => {
  const particles = Array.from({ length: 50 });
  return <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center items-center">{particles.map((_, i) => <motion.div key={i} className={`absolute w-3 h-3 rounded-sm ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][i % 5]}`} initial={{ x: 0, y: 0, scale: 0 }} animate={{ x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, rotate: Math.random() * 720, scale: [0, 1, 0], opacity: [1, 1, 0] }} transition={{ duration: 1.5, ease: "easeOut" }} />)}</div>;
};

const DigitalSparkCursor = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    const particles = [];
    const mouse = { x: -100, y: -100 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      for(let i=0; i<3; i++) particles.push({ x: e.clientX, y: e.clientY, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, life: 1.0, color: `hsl(${Math.random()*60+280},100%,70%)` });
    };
    window.addEventListener('mousemove', handleMouseMove);
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(let i=particles.length-1; i>=0; i--) {
        const p = particles[i]; p.x+=p.vx; p.y+=p.vy; p.life-=0.05;
        if(p.life<=0) particles.splice(i, 1);
        else { ctx.globalAlpha=p.life; ctx.fillStyle=p.color; ctx.fillRect(p.x, p.y, 3, 3); }
      }
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(id); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};

// --- 3. FEATURE COMPONENTS ---

const TestimonialsHub = ({ items, theme, t }) => {
  const isDark = theme === 'tiktok' || theme === 'twitter';
  const textColor = isDark ? 'text-white' : 'text-black';
  const cardBg = isDark ? 'bg-zinc-800/50' : 'bg-white';
  const borderColor = isDark ? 'border-zinc-700' : 'border-zinc-100';

  const [likedComments, setLikedComments] = useState({});

  const toggleLike = (id) => {
    playSound('pop');
    setLikedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full px-4 py-4 pointer-events-auto">
      <div className={`flex items-center justify-between mb-4 ${textColor}`}>
        <h3 className="text-xl font-black flex items-center gap-2">
          <MessageCircle className="text-blue-500" />
          <GlitchText text={t('hype') || "The Hype"} />
        </h3>
        <span className="text-xs font-bold opacity-60">{items.length} {t('comments')}</span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`p-4 rounded-xl border ${borderColor} ${cardBg} backdrop-blur-sm relative group`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-[2px] flex-shrink-0">
                 <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
                    <User size={20} className={isDark ? "text-white" : "text-black"} />
                 </div>
              </div>
              
              <div className="flex-1">
                 <div className="flex items-center justify-between">
                    <div>
                       <span className={`font-bold text-sm mr-2 ${textColor}`}>{item.user}</span>
                       <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.role}</span>
                    </div>
                 </div>
                 <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                    {item.text}
                 </p>
                 <div className={`flex items-center gap-4 mt-2 text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'} font-bold`}>
                    <span className="cursor-pointer hover:underline">{t('reply')}</span>
                    <span>{item.likes} {t('likes')}</span>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-1 pt-2">
                 <motion.button 
                   whileTap={{ scale: 0.8 }} 
                   onClick={() => toggleLike(item.id)}
                   className={`${likedComments[item.id] ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'} transition-colors`}
                 >
                    <Heart size={16} fill={likedComments[item.id] ? "currentColor" : "none"} />
                 </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- REDESIGNED 3D PROJECT HUB ---
const ProjectHub = ({ projects, theme, t }) => {
  const [isActive, setIsActive] = useState(false);
  const isDark = theme === 'tiktok' || theme === 'twitter';
  const textColor = isDark ? 'text-white' : 'text-black';
  
  const toggleActive = () => {
    playSound(isActive ? 'click' : 'success');
    setIsActive(!isActive);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const radius = isMobile ? 110 : 140; 
  const containerSize = isActive ? 'h-[420px]' : 'h-[200px]';

  return (
    <div className={`w-full relative flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${containerSize} bg-transparent perspective-[1000px]`}>
      
      {/* 3D Environment Effects */}
      <AnimatePresence>
        {isActive && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 pointer-events-none z-0"
           >
             {isDark ? (
                 <>
                   <motion.div 
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
                       animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                       transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                       style={{
                       background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%)',
                       filter: 'blur(40px)',
                       }}
                   />
                   {/* 3D Grid Floor */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] opacity-30 origin-bottom"></div>
                 </>
             ) : (
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-50/50 to-pink-100/50" />
             )}
           </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Label */}
      <AnimatePresence>
        {!isActive && (
            <motion.div 
                initial={{ opacity: 0, y: -20, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: -20 }}
                className={`absolute top-4 w-full flex items-center justify-between px-6 ${textColor} z-20`}
            >
                <h3 className="text-xl font-black flex items-center gap-2 drop-shadow-xl">
                <Sparkles className="text-pink-500 fill-pink-500 animate-pulse" />
                <GlitchText text={t('projectHubTitle')} />
                </h3>
                <span className="text-[10px] font-bold opacity-70 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 shadow-lg">{t('tapCenter')}</span>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button (Holographic Core) */}
      <motion.button
        layout
        onClick={toggleActive}
        className={`z-50 relative w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500`}
        whileHover={{ scale: 1.1, rotate: isActive ? 90 : 0 }}
        whileTap={{ scale: 0.9 }}
      >
         <div className={`absolute inset-0 rounded-full ${isActive ? 'bg-red-500' : 'bg-black'} opacity-80 backdrop-blur-xl border-2 ${isActive ? 'border-red-400' : 'border-white/20'}`}></div>
         
         {/* Internal "Core" Glow */}
         <div className={`absolute inset-2 rounded-full bg-gradient-to-tr ${isActive ? 'from-red-600 to-orange-500' : 'from-pink-500 via-purple-500 to-indigo-500'} animate-pulse`}></div>
         
         {/* Glass Shine */}
         <div className="absolute top-2 left-4 right-4 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[2px]"></div>
         
         <div className="relative z-10 text-white drop-shadow-md">
            {isActive ? <X size={32} strokeWidth={3} /> : <Gamepad2 size={32} strokeWidth={2} />}
         </div>
         
         {!isActive && (
            <div className="absolute -inset-4 border border-pink-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
         )}
      </motion.button>

      {/* Orbiting 3D Icons */}
      <AnimatePresence>
        {isActive && projects.map((p, i) => {
           const count = projects.length;
           const angle = (i / count) * 2 * Math.PI - (Math.PI / 2); 
           const x = Math.cos(angle) * radius;
           const y = Math.sin(angle) * radius;

           return (
             <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x, y, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 12, 
                  delay: i * 0.03 
                }}
                className="absolute w-20 h-20 z-40" 
                style={{ 
                  left: '50%', 
                  top: '50%',
                  marginTop: -40,
                  marginLeft: -40 
                }}
             >
                <motion.a 
                   href={p.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="block w-full h-full relative group perspective-[500px]"
                   whileHover={{ scale: 1.15, zIndex: 100 }}
                >
                   {/* 3D Sphere/Block Container */}
                   <div className={`w-full h-full rounded-2xl bg-gradient-to-b ${p.color} relative shadow-[0_10px_20px_rgba(0,0,0,0.4),_inset_0_4px_8px_rgba(255,255,255,0.4),_inset_0_-4px_8px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-2`}>
                      
                      {/* Glass Highlights */}
                      <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-full blur-[6px]"></div>
                      <div className="absolute bottom-2 left-1/4 right-1/4 h-1/4 bg-gradient-to-t from-white/20 to-transparent rounded-full blur-[4px]"></div>

                      {/* Icon Container - 3D Stack Effect */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                      >
                         {p.icon && (
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                {/* Deep Shadow */}
                                <p.icon size={32} className="absolute top-[2px] left-[2px] text-black/40 blur-[1px] transform scale-95" />
                                {/* Main Icon with Emboss */}
                                <p.icon size={32} className="relative z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] filter contrast-125" strokeWidth={2.5} />
                            </div>
                         )}
                      </motion.div>

                      {/* Title Overlay (Replaces Icon on Hover) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-1">
                          <span className="text-white text-[10px] font-black uppercase text-center leading-tight drop-shadow-md break-words w-full">
                              {p.title}
                          </span>
                      </div>
                   </div>
                </motion.a>
             </motion.div>
           );
        })}
      </AnimatePresence>
    </div>
  );
};

const VibeCheck = ({ lang }) => {
  const vibes = [
    { id: 1, text: lang === 'de' ? "Läuft bei mir" : "Works on my machine", icon: Laptop, color: "bg-blue-600", rotate: -5, x: 20, y: 20 },
    { id: 2, text: lang === 'de' ? "Console.log('Hä?')" : "Console.log('???')", icon: Terminal, color: "bg-zinc-800", rotate: 8, x: 180, y: 40 },
    { id: 3, text: lang === 'de' ? "Läuft mit Koffein" : "Fueled by Caffeine", icon: Coffee, color: "bg-amber-700", rotate: -3, x: 50, y: 140 },
    { id: 4, text: lang === 'de' ? "Ist ein Feature" : "It's a feature", icon: Bug, color: "bg-green-600", rotate: 6, x: 200, y: 180 },
    { id: 5, text: "!false === true", icon: Code2, color: "bg-purple-600", rotate: -10, x: 100, y: 100 },
  ];
  return (
    <div className="relative w-full h-[300px] bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-700 overflow-hidden group">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <span className="text-6xl font-black text-white rotate-[-15deg]"><GlitchText text={lang === 'de' ? "VIBE CHECK" : "VIBE CHECK"} /></span>
      </div>
      {vibes.map((vibe) => (
        <motion.div
          key={vibe.id}
          drag
          dragConstraints={{ left: 0, right: 250, top: 0, bottom: 200 }}
          initial={{ x: vibe.x, y: vibe.y, rotate: vibe.rotate, scale: 0 }}
          whileInView={{ scale: 1 }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          whileDrag={{ scale: 1.2, zIndex: 20, cursor: 'grabbing' }}
          className={`absolute ${vibe.color} text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 cursor-grab active:cursor-grabbing border-2 border-white/20`}
        >
          <vibe.icon size={18} />
          <span>{vibe.text}</span>
        </motion.div>
      ))}
      <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-[10px] text-white/70 font-mono border border-white/10">{lang === 'de' ? "Zum Ordnen ziehen" : "Drag to reorganize"}</div>
    </div>
  );
};

const SkillMarquee = ({ tags, theme, t }) => {
  const isDark = theme === 'tiktok' || theme === 'twitter';
  const textColor = isDark ? 'text-white' : 'text-black';
  const bgColor = isDark ? 'bg-zinc-800' : 'bg-gray-100';

  const chunkSize = Math.ceil(tags.length / 4);
  const row1 = tags.slice(0, chunkSize);
  const row2 = tags.slice(chunkSize, chunkSize * 2);
  const row3 = tags.slice(chunkSize * 2, chunkSize * 3);
  const row4 = tags.slice(chunkSize * 3);

  const getContent = (rowTags) => [...rowTags, ...rowTags, ...rowTags];

  return (
    <div className="w-full py-6 overflow-hidden relative">
      <div className={`flex items-center justify-between px-4 mb-4 ${textColor}`}>
        <h3 className="text-xl font-black flex items-center gap-2">
          <TrendingUp className="text-green-500" />
          <GlitchText text={t('trendingSkills')} />
        </h3>
        <span className="text-[10px] font-bold opacity-60">{t('liveBadge')}</span>
      </div>

      <div className="flex flex-col gap-3 relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: [0, -1000] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {getContent(row1).map((tag, i) => (
            <div key={i} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap border border-transparent hover:border-pink-500 transition-colors cursor-default ${bgColor} ${textColor}`}>
              #{tag}
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: [-1000, 0] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          {getContent(row2).map((tag, i) => (
            <div key={i} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap border border-transparent hover:border-blue-500 transition-colors cursor-default ${bgColor} ${textColor}`}>
              #{tag}
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: [0, -1000] }}
          transition={{ ease: "linear", duration: 28, repeat: Infinity }}
        >
          {getContent(row3).map((tag, i) => (
            <div key={i} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap border border-transparent hover:border-purple-500 transition-colors cursor-default ${bgColor} ${textColor}`}>
              #{tag}
            </div>
          ))}
        </motion.div>

          <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: [-1000, 0] }}
          transition={{ ease: "linear", duration: 32, repeat: Infinity }}
        >
          {getContent(row4).map((tag, i) => (
            <div key={i} className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap border border-transparent hover:border-orange-500 transition-colors cursor-default ${bgColor} ${textColor}`}>
              #{tag}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const ContactForm = ({ theme, placeholder, t }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSent(true); playSound('success'); e.target.reset(); setIsSending(false);
    setTimeout(() => setIsSent(false), 3000);
  };
  const isDark = theme === 'tiktok' || theme === 'twitter';
  return (
    <div className="w-full">
      {isSent ? (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-lg text-center font-bold ${isDark ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-green-50 text-green-600 border border-green-200'}`}>{t('messageSent')}</motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          {theme !== 'facebook' && theme !== 'twitter' && <input type="text" name="name" placeholder={t('yourName')} required className={`p-3 rounded-lg border outline-none transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-pink-500' : 'bg-gray-50 border-gray-200 text-black focus:border-blue-500'}`} />}
          
          {theme === 'facebook' ? (
             <div className="flex gap-2">
                 <input type="text" name="message" placeholder={placeholder || t('writeMessage')} required className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder-zinc-500" />
                 <button type="submit" disabled={isSending} className="text-[#1877F2] font-bold text-sm disabled:opacity-50 hover:bg-zinc-100 p-2 rounded-full transition-colors"><Send size={18} /></button>
             </div>
          ) : theme === 'twitter' ? (
             <div className="relative">
                 <textarea name="message" placeholder={t('startMessage')} rows="3" required className="w-full bg-black text-white p-3 text-sm placeholder-zinc-500 border-none outline-none resize-none" />
                 <div className="flex justify-end pt-2 border-t border-zinc-800">
                     <button type="submit" disabled={isSending} className="bg-[#1d9bf0] text-white p-2 rounded-full hover:bg-[#1a8cd8] transition-colors disabled:opacity-50"><Send size={16} /></button>
                 </div>
             </div>
          ) : (
             <>
                <textarea name="message" placeholder={t('writeMessage')} rows="3" required className={`p-3 rounded-lg border outline-none transition-all resize-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-pink-500' : 'bg-gray-50 border-gray-200 text-black focus:border-blue-500'}`} />
                <button type="submit" disabled={isSending} className={`p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>{isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} {isSending ? t('sending') : t('sendMessage')}</button>
             </>
          )}
        </form>
      )}
    </div>
  );
};

const MusicPlayer = ({ t }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlay = () => { setIsPlaying(!isPlaying); playSound('click'); };
  return (
    <motion.div drag dragMomentum={false} initial={{ x: 0, y: 0 }} whileHover={{ scale: 1.02 }} className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 w-64 shadow-2xl cursor-grab active:cursor-grabbing">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center animate-pulse"><Music2 size={20} className="text-white" /></div>
      <div className="flex-1 overflow-hidden"><p className="text-xs font-bold text-white truncate"><GlitchText text="Warda's Portfolio Vibe" /></p><p className="text-[10px] text-zinc-400 truncate">{t('originalSound')}</p></div>
      <button onClick={togglePlay} className="text-white hover:text-green-400 transition-colors">{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
    </motion.div>
  );
};

const StoryOverlay = ({ onClose, t }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={onClose} className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-pointer">
    <div className="w-full max-w-sm h-[80vh] bg-gradient-to-b from-purple-600 to-blue-600 rounded-2xl relative overflow-hidden flex flex-col">
       <div className="absolute top-2 left-0 right-0 flex gap-1 px-2"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5 }} className="h-1 bg-white/50 rounded-full flex-1" /></div>
       <div className="p-4 flex items-center gap-2 text-white"><UserAvatar className="w-8 h-8" /><span className="font-bold text-sm">warda.dev</span><span className="text-white/60 text-xs">2h</span><X className="ml-auto" size={20} /></div>
       <div className="flex-1 flex flex-col items-center justify-center text-white text-center p-8"><h2 className="text-4xl font-black mb-4">{t('welcome')} 👋</h2><p className="text-lg">{t('thanksPortfolio')}</p></div>
    </div>
  </motion.div>
);

const LiveStreamChat = () => {
  const [comments, setComments] = useState([]);
  const FAKE_COMMENTS = [{ user: "Recruiter_US", text: "Available for hire?", color: "text-blue-400" }, { user: "JS_Ninja", text: "Nice animations!", color: "text-yellow-400" }, { user: "Sarah", text: "Love this!", color: "text-pink-400" }, { user: "CodeDev", text: "Framer Motion?", color: "text-green-400" }, { user: "WebFan", text: "So cool 🔥", color: "text-white" }];
  useEffect(() => {
    const interval = setInterval(() => {
      const randomComment = FAKE_COMMENTS[Math.floor(Math.random() * FAKE_COMMENTS.length)];
      setComments(prev => [...prev.slice(-3), { ...randomComment, id: Date.now() }]);
    }, 800); 
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute bottom-4 left-4 z-20 w-64 pointer-events-none flex flex-col justify-end h-32 overflow-hidden mask-gradient">
      <AnimatePresence>
        {comments.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs w-fit border border-white/10 shadow">
            <span className={`font-bold mr-1 ${c.color}`}>{c.user}:</span><span className="text-white/90">{c.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const LiveStreamHearts = () => {
    const [hearts, setHearts] = useState([]);
      
    useEffect(() => {
        const interval = setInterval(() => {
            const newHeart = {
                id: Date.now(),
                color: ['text-red-500', 'text-pink-500', 'text-purple-500', 'text-blue-500'][Math.floor(Math.random() * 4)],
                left: Math.random() * 40 
            };
            setHearts(prev => [...prev.slice(-10), newHeart]);
        }, 600); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-4 right-4 w-12 h-64 pointer-events-none z-30">
            <AnimatePresence>
                {hearts.map(h => (
                    <motion.div
                        key={h.id}
                        initial={{ opacity: 1, y: 0, x: h.left, scale: 0.5 }}
                        animate={{ opacity: 0, y: -200, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className={`absolute bottom-0 ${h.color}`}
                    >
                        <Heart size={24} fill="currentColor" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};


const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01AZERTYUIOPQSDFGHJKLMWXCVBN';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black pointer-events-none" />;
};

const StickerDrawer = ({ addSticker, clearStickers, hasStickers, t }) => {
  const stickers = [
    { id: 'bug', icon: Bug, color: 'text-green-500', label: t('stickerFeature') },
    { id: 'fire', icon: Flame, color: 'text-orange-500', label: t('stickerFire') },
    { id: 'coffee', icon: Coffee, color: 'text-amber-700', label: t('stickerJava') },
    { id: 'skull', icon: Skull, color: 'text-zinc-500', label: t('stickerLegacy') },
    { id: 'alert', icon: AlertTriangle, color: 'text-yellow-400', label: t('sticker404') },
  ];
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 flex flex-col gap-2">
      {stickers.map((s) => (
        <button key={s.id} onClick={() => addSticker(s)} className="p-2 hover:bg-white/10 rounded-full transition-colors group relative" title={s.label}>
          <s.icon className={`${s.color} w-6 h-6 group-hover:scale-125 transition-transform`} />
        </button>
      ))}
      {hasStickers && (
        <>
          <div className="h-px w-full bg-white/20 my-1" />
          <button onClick={clearStickers} className="p-2 hover:bg-red-500/20 rounded-full transition-colors group" title={t('clearAll')}>
            <Trash2 className="text-red-500 w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}
    </div>
  );
};

const BitPet = () => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const petRef = useRef(null);
  const sleepTimer = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isSleeping) setIsSleeping(false);
      clearTimeout(sleepTimer.current);
      sleepTimer.current = setTimeout(() => setIsSleeping(true), 5000);
      if (petRef.current && !isSleeping) {
        const rect = petRef.current.getBoundingClientRect();
        const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2));
        const distance = Math.min(3, Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2)) / 20);
        setPupilPos({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    sleepTimer.current = setTimeout(() => setIsSleeping(true), 5000);
    return () => { window.removeEventListener('mousemove', handleMouseMove); clearTimeout(sleepTimer.current); };
  }, [isSleeping]);
  const handleFeed = () => { if(isEating) return; setIsEating(true); playSound('eat'); setTimeout(() => setIsEating(false), 2000); };
  return (
    <motion.div ref={petRef} className="fixed bottom-5 left-5 z-[1000] w-16 h-16 cursor-pointer" drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} onClick={handleFeed} whileHover={{ scale: 1.1 }}>
       <div className="w-full h-full bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col items-center justify-center gap-1">
          <div className="flex gap-2 relative z-10">
             <div className="w-4 h-4 bg-black rounded-full relative overflow-hidden">{!isSleeping && !isEating && <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) translate(${pupilPos.x}px, ${pupilPos.y}px)` }} />}{isSleeping && <div className="w-full h-0.5 bg-white absolute top-1/2 left-0" />}{isEating && <div className="text-[8px] text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">^</div>}</div>
             <div className="w-4 h-4 bg-black rounded-full relative overflow-hidden">{!isSleeping && !isEating && <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) translate(${pupilPos.x}px, ${pupilPos.y}px)` }} />}{isSleeping && <div className="w-full h-0.5 bg-white absolute top-1/2 left-0" />}{isEating && <div className="text-[8px] text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">^</div>}</div>
          </div>
          <div className="relative z-10">{isEating ? <div className="w-4 h-2 bg-pink-400 rounded-b-full animate-bounce" /> : isSleeping ? <div className="w-2 h-1 bg-black rounded-full opacity-50" /> : <div className="w-3 h-1.5 border-b-2 border-black rounded-full" />}</div>
          <AnimatePresence>{isSleeping && <motion.div initial={{ opacity: 0, y: 0, x: 10 }} animate={{ opacity: 1, y: -20, x: 20 }} exit={{ opacity: 0 }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-0 right-0 text-xs font-bold text-blue-400">Zzz</motion.div>}</AnimatePresence>
          <AnimatePresence>{isEating && <motion.div initial={{ opacity: 1, y: 0, scale: 0.5 }} animate={{ opacity: 0, y: -30, scale: 1.2 }} className="absolute top-0 text-xl">🍔</motion.div>}</AnimatePresence>
       </div>
    </motion.div>
  );
};

const GraffitiCanvas = ({ isActive, onClose, t }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#00ffcc";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00ffcc";
    contextRef.current = ctx;
    const handleResize = () => {
       if(canvasRef.current) {
         const r = canvasRef.current.getBoundingClientRect();
         canvasRef.current.width = r.width * dpr;
         canvasRef.current.height = r.height * dpr;
         const newCtx = canvasRef.current.getContext('2d');
         newCtx.scale(dpr, dpr);
         newCtx.lineCap = "round";
         newCtx.lineJoin = "round";
         newCtx.lineWidth = 10;
         newCtx.shadowBlur = 15;
         contextRef.current = newCtx;
       }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive]); 
  const startDrawing = ({ nativeEvent }) => {
    if(!isActive || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    if (mode === 'erase') {
        contextRef.current.globalCompositeOperation = 'destination-out';
        contextRef.current.lineWidth = 30;
        contextRef.current.shadowBlur = 0;
    } else {
        contextRef.current.globalCompositeOperation = 'source-over';
        contextRef.current.lineWidth = 10;
        contextRef.current.shadowBlur = 15;
    }
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    if(mode === 'draw') playSound('spray');
  };
  const finishDrawing = () => {
    if(contextRef.current) contextRef.current.closePath();
    setIsDrawing(false);
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !isActive || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    if (mode === 'draw') {
        const hue = (Date.now() / 5) % 360; 
        const color = `hsl(${hue}, 100%, 60%)`;
        contextRef.current.strokeStyle = color;
        contextRef.current.shadowColor = color;
    }
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    if (mode === 'draw' && Math.random() > 0.8) playSound('spray');
  };
  const clearCanvas = () => {
    if(!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playSound('click');
  };
  if (!isActive) return null;
  return (
    <div className="fixed inset-0 z-[2000] cursor-crosshair bg-black/20 backdrop-blur-[2px]">
      <canvas onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} onMouseLeave={finishDrawing} ref={canvasRef} style={{ width: '100%', height: '100%' }} className={`w-full h-full ${isActive ? (mode === 'erase' ? 'cursor-cell' : 'cursor-crosshair') : ''}`} />
      <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/20 z-[2001] pointer-events-auto">
         <span className="font-black text-sm uppercase tracking-widest text-pink-500">{t('graffitiMode')}</span>
         <div className="h-6 w-px bg-white/20"></div>
         <button onClick={() => setMode('draw')} className={`flex flex-col items-center gap-1 hover:text-cyan-400 transition-colors ${mode === 'draw' ? 'text-cyan-400' : ''}`}><PenTool size={20} /><span className="text-[10px] font-bold">{t('draw')}</span></button>
         <button onClick={() => setMode('erase')} className={`flex flex-col items-center gap-1 hover:text-orange-400 transition-colors ${mode === 'erase' ? 'text-orange-400' : ''}`}><Eraser size={20} /><span className="text-[10px] font-bold">{t('erase')}</span></button>
         <button onClick={clearCanvas} className="flex flex-col items-center gap-1 hover:text-red-400 transition-colors"><Trash2 size={20} /><span className="text-[10px] font-bold">{t('clearAll')}</span></button>
         <div className="h-6 w-px bg-white/20"></div>
         <button onClick={onClose} className="flex flex-col items-center gap-1 hover:text-green-400 transition-colors"><Check size={20} /><span className="text-[10px] font-bold">{t('done')}</span></button>
      </div>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono bg-black/50 px-3 py-1 rounded-full pointer-events-none">{t('holdToSpray')}</div>
    </div>
  );
};

// --- SIDEBARS ---
const ThemeSidebars = ({ theme, t }) => {
  if (theme === 'tiktok' || typeof window === 'undefined' || window.innerWidth < 1024) return null;
  const SidebarContainer = ({ children, side }) => (<div className={`fixed top-24 bottom-0 ${side === 'left' ? 'left-4 xl:left-12' : 'right-4 xl:right-12'} w-64 hidden lg:flex flex-col gap-6 overflow-y-auto pb-8 z-30`}>{children}</div>);
  const Section = ({ title, items, transparent = false }) => (<div className={`${transparent ? '' : 'bg-white border border-zinc-200 shadow-sm'} rounded-xl p-4`}>{title && <h3 className="font-bold text-zinc-500 text-xs uppercase tracking-wider mb-3">{title}</h3>}<div className="space-y-3">{items.map((item, i) => (<div key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-700 hover:text-black cursor-pointer transition-colors group">{item.icon && <div className={`p-2 rounded-full ${transparent ? 'text-zinc-900' : 'bg-zinc-100 group-hover:bg-zinc-200'} transition-colors`}><item.icon size={20} /></div>}<span><GlitchText text={item.label} /></span></div>))}</div></div>);

  if (theme === 'instagram') return (<><SidebarContainer side="left"><Section transparent title="" items={[{label:t('home'), icon:Home}, {label:t('search'), icon:Search}, {label:t('explore'), icon:Compass}, {label:t('reels'), icon:Video}, {label:t('messages'), icon:Send}, {label:t('notifications'), icon:Heart}, {label:t('create'), icon:Check}, {label:t('profile'), icon:User}]} /></SidebarContainer><SidebarContainer side="right"><div className="flex items-center gap-3 mb-4"><UserAvatar className="w-12 h-12" /><div><p className="font-bold text-sm">warda.dev</p><p className="text-zinc-500 text-xs">Warda Naeem</p></div><button className="text-blue-500 text-xs font-bold ml-auto">Switch</button></div><div className="flex justify-between items-center mb-2"><span className="text-zinc-500 font-bold text-sm">{t('suggestionsForYou')}</span><span className="text-xs font-bold">{t('seeAll')}</span></div><Section transparent title="" items={[{label:'Recruiter_US', icon:User}, {label:'Tech_Lead', icon:User}, {label:'Design_Daily', icon:Palette}]} /></SidebarContainer></>);
  if (theme === 'facebook') return (<><SidebarContainer side="left"><Section transparent title="" items={[{label:'Warda Naeem', icon:User}, {label:t('followers'), icon:Users}, {label:t('memories'), icon:Clock}, {label:t('saved'), icon:Bookmark}, {label:t('groups'), icon:Users}, {label:t('video'), icon:Video}, {label:t('marketplace'), icon:Store}, {label:t('feeds'), icon:List}]} /></SidebarContainer><SidebarContainer side="right"><h3 className="font-bold text-zinc-500 text-sm mb-2">{t('sponsored')}</h3><div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-zinc-100 p-2 rounded-lg"><div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xs text-center p-1">{t('hireMeCap')}</div><div><p className="font-bold text-sm">{t('topReactDev')}</p><p className="text-xs text-zinc-500">wardanaeem.dev</p></div></div><div className="border-t border-zinc-300 my-2" /><h3 className="font-bold text-zinc-500 text-sm mb-2">{t('contacts')}</h3><Section transparent title="" items={[{label:t('githubProfile'), icon:Github}, {label:t('linkedinConnection'), icon:Linkedin}, {label:t('techRecruiter'), icon:User}, {label:t('projectManager'), icon:User}]} /></SidebarContainer></>);
  if (theme === 'twitter') return (<><SidebarContainer side="left"><div className="bg-black text-white h-full p-4 rounded-xl"><Section transparent title="" items={[{label:t('home'), icon:Home}, {label:t('explore'), icon:Hash}, {label:t('notifications'), icon:Bell}, {label:t('messages'), icon:Mail}, {label:t('lists'), icon:List}, {label:t('bookmarks'), icon:Bookmark}, {label:t('communities'), icon:Users}, {label:t('premium'), icon:Check}, {label:t('profile'), icon:User}, {label:t('more'), icon:MoreHorizontal}]} /><button className="bg-[#1d9bf0] text-white font-bold w-full py-3 rounded-full mt-4 shadow-lg hover:bg-[#1a8cd8]">{t('posts')}</button></div></SidebarContainer><SidebarContainer side="right"><div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white"><h3 className="font-black text-xl mb-4">{t('whatsHappening')}</h3><div className="space-y-4"><div><p className="text-xs text-zinc-500">{t('trendingInTech')}</p><p className="font-bold">#ReactJS</p><p className="text-xs text-zinc-500">54.2K {t('posts').toLowerCase()}</p></div><div><p className="text-xs text-zinc-500">{t('trendingInGermany')}</p><p className="font-bold">#FrontendDev</p><p className="text-xs text-zinc-500">12.5K {t('posts').toLowerCase()}</p></div><div><p className="text-xs text-zinc-500">{t('techTrending')}</p><p className="font-bold">#HireWarda</p><p className="text-xs text-zinc-500">1.2M {t('posts').toLowerCase()}</p></div></div><div className="text-[#1d9bf0] text-sm mt-4 cursor-pointer">{t('showMore')}</div></div><div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white mt-4"><h3 className="font-black text-xl mb-4">{t('whoToFollow')}</h3><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><UserAvatar className="w-10 h-10" /><div><p className="font-bold text-sm">Warda Naeem</p><p className="text-zinc-500 text-xs">@warda.dev</p></div></div><button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full">{t('follow')}</button></div></div></SidebarContainer></>);
  return null;
};

// --- LAYOUTS (TIKTOK/INSTA/FB/TWITTER) ---
const TikTokDesktopSidebar = ({ type, data, t }) => (
  <div className="w-full h-full flex flex-col justify-center items-center p-8 relative">
      <div className="relative">
        <div className="absolute -top-6 -left-6 bg-red-600 text-white font-bold px-3 py-1 rounded text-xs animate-pulse z-20">LIVE</div>
        <div className="w-80 h-[500px] bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 z-10"><UserAvatar className="w-12 h-12" /><div><h3 className="text-white font-bold"><GlitchText text="Warda Naeem" /></h3><p className="text-zinc-400 text-xs">@warda.dev</p></div></div>
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 z-10"><div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-1 animate-spin-slow"><div className="w-full h-full bg-black rounded-full flex items-center justify-center"><Code2 size={48} className="text-white" /></div></div><h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"><GlitchText text={t('creator')} /></h2></div>
            <LiveStreamChat />
            <LiveStreamHearts /> 
        </div>
      </div>
  </div>
);

const CreativeSidebarLeft = ({ sectionType }) => {
  return (
    <div className="hidden lg:flex flex-col w-64 h-[600px] justify-between gap-6 relative pr-4"> {/* Changed xl->lg, w-72->w-64, pr-8->pr-4 */}
        {/* Holographic Card */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(236,72,153,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-purple-600/5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent -translate-x-full group-hover:animate-scan" />
            
            <h3 className="font-mono text-xs text-pink-400 mb-4 flex items-center gap-2">
                <Terminal size={14} />
                DEV_CONSOLE_V2.0
            </h3>
            
            <div className="font-mono text-[10px] text-green-400 opacity-80 leading-relaxed">
                {/* Typing effect simulation */}
                <p>{`> init_portfolio()`}</p>
                <p className="text-blue-400">{`> loading modules...`}</p>
                <p>{`> [SUCCESS] react_core`}</p>
                <p>{`> [SUCCESS] framer_motion`}</p>
                <p className="animate-pulse">{`> awaiting_input...`}</p>
            </div>

            {/* System Visualizer */}
            <div className="mt-8 relative">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>CPU</span>
                    <span>34%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ width: ["30%", "50%", "34%"] }} 
                        transition={{ duration: 2, repeat: Infinity }} 
                        className="h-full bg-pink-500 shadow-[0_0_10px_#ec4899]" 
                    />
                </div>
                
                <div className="flex justify-between text-xs text-white/50 mb-1 mt-3">
                    <span>RAM</span>
                    <span>8.2GB</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ width: ["60%", "65%", "60%"] }} 
                        transition={{ duration: 3, repeat: Infinity }} 
                        className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]" 
                    />
                </div>
            </div>
        </div>

        {/* 3D Floating Element Placeholder */}
        <div className="h-40 bg-zinc-900/50 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent animate-pulse" />
             <Code2 size={48} className="text-white/20 animate-spin-slow" />
             <div className="absolute bottom-2 text-[10px] font-mono text-white/40">SYSTEM_IDLE</div>
        </div>
    </div>
  );
}

const CreativeSidebarRight = () => {
    return (
        <div className="hidden lg:flex flex-col w-64 h-[600px] justify-start gap-6 relative pl-4"> {/* Changed xl->lg, w-72->w-64, pl-8->pl-4 */}
            {/* Music Player Widget */}
            <div className="h-48 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <div className="w-24 h-24 rounded-full border-4 border-zinc-800 bg-zinc-900 flex items-center justify-center relative animate-spin-slow shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500" />
                    <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-50" />
                </div>
                <div className="mt-4 text-center z-10">
                    <h3 className="text-xs font-bold text-white tracking-widest">NOW PLAYING</h3>
                    <p className="text-[10px] text-cyan-400 truncate w-32 mx-auto">Lo-Fi Coding Beats</p>
                </div>
                {/* Visualizer bars */}
                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-1 opacity-50">
                    {[...Array(10)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: [5, 20, 10, 25, 5] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1 bg-cyan-500 rounded-t-full"
                        />
                    ))}
                </div>
            </div>

            {/* Trending / Activity */}
            <div className="flex-1 bg-zinc-900/50 backdrop-blur-md rounded-3xl p-4 border border-white/5 relative overflow-hidden">
                <h3 className="font-bold text-xs text-zinc-500 uppercase mb-4 flex items-center gap-2">
                    <TrendingUp size={14} /> Trending
                </h3>
                <div className="space-y-3">
                    {['#ReactJS', '#Frontend', '#WebDesign', '#Creative', '#Developer'].map((tag, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{tag}</span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50 group-hover:bg-pink-500 group-hover:text-white transition-colors">{10 + i}k</span>
                        </div>
                    ))}
                </div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            animate={{ y: [-20, 300], opacity: [0, 1, 0] }}
                            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
                            style={{ left: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const TikTokLayout = ({ data, sectionType, onLike, likeCount, isLiked, user, t }) => {
  const [activeTab, setActiveTab] = useState('foryou'); // 'foryou' | 'live'

  return (
    <div className="relative w-full h-full bg-black text-white">
      {/* Background (common) */}
      <div className="absolute inset-0 z-0 bg-zinc-900 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
         <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Header Tabs */}
      <div className="absolute top-4 w-full flex justify-center items-center z-50 text-sm font-bold shadow-black drop-shadow-md">
         <div className="flex gap-4">
             <button 
               onClick={() => setActiveTab('foryou')}
               className={`cursor-pointer transition-opacity ${activeTab === 'foryou' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white/90'}`}
             >
               {t('forYou')}
             </button>
             <span className="opacity-40">|</span>
             <button 
               onClick={() => setActiveTab('live')}
               className={`cursor-pointer transition-opacity ${activeTab === 'live' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white/90'}`}
             >
               {t('live')}
             </button>
         </div>
         <div className="absolute right-4">
            <Search size={20} className="text-white" />
         </div>
      </div>

      {/* Content Area */}
      <div className="relative w-full h-full flex items-center justify-center pt-20 pb-20">
         {activeTab === 'live' ? (
            // LIVE VIEW (Formerly Sidebar)
            <div className="w-full h-full flex flex-col items-center justify-center">
               <TikTokDesktopSidebar type={sectionType} data={data} t={t} />
            </div>
         ) : (
            // FOR YOU VIEW (Main Content)
            <div className="w-full h-full flex flex-row items-center justify-center relative px-4">
               {/* Left "Code" Sidebar (Desktop) */}
               <CreativeSidebarLeft sectionType={sectionType} />

               {/* Main Scrollable Content */}
               <div className="w-full max-w-md h-full flex flex-col justify-center relative z-20">
                   <div className="flex-1 mb-4 flex flex-col justify-center max-h-full min-w-0">
                      {/* Title & Description */}
                      <h3 className="font-bold text-lg text-white shadow-black drop-shadow-md mb-2">
                        @{data.id === 'intro' ? 'warda.dev' : <GlitchText text={data.title} />}
                      </h3>
                      
                      {/* Scrollable Area */}
                      <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 max-h-[70vh]">
                          {sectionType === 'intro' && (
                            <div className="text-white/90 text-sm space-y-4">
                              {/* Stats Row */}
                              <div className="flex gap-4 mb-2">
                                 <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg text-center">
                                    <p className="font-bold text-lg">5+</p>
                                    <p className="text-[10px] text-zinc-400 uppercase">{t('years')}</p>
                                 </div>
                                 <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg text-center">
                                    <p className="font-bold text-lg">50+</p>
                                    <p className="text-[10px] text-zinc-400 uppercase">{t('projects')}</p>
                                 </div>
                                 <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg text-center">
                                    <p className="font-bold text-lg">∞</p>
                                    <p className="text-[10px] text-zinc-400 uppercase">{t('coffee')}</p>
                                 </div>
                              </div>

                              <p className="leading-relaxed">{data.content.summary}</p>
                              
                              <div className="flex items-center gap-2 text-xs text-zinc-300">
                                <MapPin size={14} className="text-pink-500" /> 
                                {data.content.location}
                              </div>

                              <div className="flex gap-2 mt-2">
                                <button className="flex-1 bg-pink-600 text-white font-bold py-2 rounded-md hover:bg-pink-700 transition-colors">{t('hireMe')}</button>
                                <button className="w-10 bg-zinc-800 flex items-center justify-center rounded-md border border-zinc-700"><User size={16}/></button>
                              </div>

                              <p className="font-bold text-pink-400 text-xs mt-2">{data.content.hashtags}</p>
                            </div>
                          )}
                          
                          {/* Updated Experience Section */}
                          {sectionType === 'timeline' && (
                            <div className="space-y-4 relative pl-4 border-l border-white/20">
                               {data.items?.map((item, i) => (
                                 <div key={i} className="relative group">
                                   <div className="absolute -left-[21px] top-0 w-3 h-3 bg-pink-500 rounded-full border-2 border-black group-hover:scale-125 transition-transform" />
                                   <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700 hover:border-pink-500 transition-colors">
                                     <h4 className="font-bold text-sm text-white"><GlitchText text={item.role} /></h4>
                                     <p className="text-xs font-bold text-pink-400 mb-1">{item.company}</p>
                                     <div className="w-full bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-3/4 animate-pulse"></div>
                                     </div>
                                     <p className="text-[10px] text-zinc-400 mt-2">{item.desc}</p>
                                   </div>
                                 </div>
                               ))}
                            </div>
                          )}

                          {sectionType === 'tags' && <SkillMarquee tags={data.tags} theme="tiktok" t={t} />}
                          {sectionType === 'vibe' && <VibeCheck lang={t('lang')} />}
                          {sectionType === 'projects' && <ProjectHub projects={data.items} theme="tiktok" t={t} />}
                          {sectionType === 'testimonials' && <TestimonialsHub items={data.items} theme="tiktok" t={t} />}
                          
                          {/* Improved Education Section */}
                          {(sectionType === 'education' || sectionType === 'cards') && (
                            <div className="space-y-6 pl-2 relative">
                               <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-pink-500 to-purple-600/20"></div>
                               {data.items?.map((item, i) => (
                                 <div key={i} className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-900 border-2 border-pink-500 rounded-full flex items-center justify-center z-10">
                                       <GraduationCap size={12} className="text-white" />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                                       <p className="font-bold text-sm text-white"><GlitchText text={item.degree} /></p>
                                       <p className="text-xs text-zinc-400 mt-1">{item.school}</p>
                                       <div className="mt-2 inline-block bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">
                                          {t('achievement')}
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          )}
                          
                          {sectionType === 'contact' && <div className="flex flex-col gap-2">{data.links?.map((l, i) => (<a key={i} href={l.href} target="_blank" className="flex items-center gap-2 text-white/90 hover:text-pink-400"><l.icon size={16} /><span className="text-sm">{l.val}</span></a>))} <ContactForm theme="tiktok" user={user} t={t} /></div>}
                      </div>
                      
                      {/* Song Info */}
                      <div className="flex items-center justify-between gap-2 text-white/80 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Music2 size={14} className="animate-spin-slow" />
                          <p className="text-xs">Original Sound - Warda Naeem</p>
                        </div>
                        <div className="animate-spin-slow"><Disc size={24} /></div>
                      </div>
                   </div>
               </div>

               {/* Right Action Bar */}
               <ActionSidebar onLike={onLike} likeCount={likeCount} themeId="tiktok" isLiked={isLiked} />

               {/* Right "Activity" Sidebar (Desktop) */}
               <CreativeSidebarRight />
            </div>
         )}
      </div>
    </div>
  );
};

const InstagramLayout = ({ data, sectionType, onStoryClick, onLike, isLiked, likeCount, user, t }) => {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'list' | 'tagged' | 'contact'

  // Only show the full layout if it's the "Intro" section, otherwise we render specific content based on tabs
  if (sectionType !== 'intro') return null;

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center pb-20"> 
      
      {/* 1. Header & Bio */}
      <div className="max-w-xl w-full pt-4 px-4 pb-2">
        <div className="flex items-center justify-between mb-4">
             <div className="relative group cursor-pointer" onClick={onStoryClick}>
                <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                    <div className="w-full h-full bg-white rounded-full p-[1px] overflow-hidden">
                       <img src={PROFILE.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                   <Check size={10} strokeWidth={4} />
                </div>
             </div>
             
             <div className="flex flex-1 justify-around text-center ml-4">
                <div><p className="font-bold text-lg leading-tight">50+</p><p className="text-xs text-gray-500">{t('projects')}</p></div>
                <div><p className="font-bold text-lg leading-tight">1.2k</p><p className="text-xs text-gray-500">{t('followers')}</p></div>
                <div><p className="font-bold text-lg leading-tight">250</p><p className="text-xs text-gray-500">{t('following')}</p></div>
             </div>
        </div>

        <div>
           <h1 className="font-bold text-sm">{data.content.name}</h1>
           <p className="text-sm text-gray-500">{data.content.role}</p>
           <p className="text-sm text-gray-900 mt-1 whitespace-pre-line">{data.content.summary}</p>
           <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
               <MapPin size={12} /> {data.content.location}
           </div>
           <a href="#" className="text-blue-900 text-sm font-medium mt-1 block">wardanaeem.dev</a>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 mb-6">
            <button className="flex-1 bg-blue-500 text-white font-bold py-1.5 rounded-lg text-sm shadow-sm active:scale-95 transition-transform">{t('follow')}</button>
            <button className="flex-1 bg-gray-100 text-black font-bold py-1.5 rounded-lg text-sm border border-gray-200 active:scale-95 transition-transform">{t('message')}</button>
            <button className="bg-gray-100 p-1.5 rounded-lg border border-gray-200"><User size={20} /></button>
        </div>

        {/* Highlights */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-2">
           {[{ label: 'Work', icon: Briefcase }, { label: 'Skills', icon: Code2 }, { label: 'Life', icon: Coffee }, { label: 'Travel', icon: Plane }].map((h, i) => (
             <div key={i} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer" onClick={() => playSound('pop')}>
                <div className="w-16 h-16 rounded-full border border-gray-200 p-1">
                   <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-gray-700">
                      <h.icon size={24} strokeWidth={1.5} />
                   </div>
                </div>
                <span className="text-xs">{h.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="w-full max-w-xl border-t border-gray-200 flex sticky top-0 bg-white z-20">
         <button 
           onClick={() => { setActiveTab('grid'); playSound('switch'); }} 
           className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeTab === 'grid' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
         >
           <Grid size={24} />
         </button>
         <button 
           onClick={() => { setActiveTab('list'); playSound('switch'); }} 
           className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeTab === 'list' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
         >
           <FileText size={24} />
         </button>
         <button 
           onClick={() => { setActiveTab('tagged'); playSound('switch'); }} 
           className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
         >
           <Tag size={24} />
         </button>
         <button 
           onClick={() => { setActiveTab('contact'); playSound('switch'); }} 
           className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeTab === 'contact' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
         >
           <Mail size={24} />
         </button>
      </div>

      {/* 3. Content Area */}
      <div className="w-full max-w-xl min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'grid' && (
             <motion.div 
               key="grid" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="grid grid-cols-3 gap-1"
             >
                {GET_SECTIONS(t).find(s => s.id === 'projects').items.map((p, i) => (
                   <motion.a 
                     key={i} 
                     href={p.link}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={`block aspect-square relative group overflow-hidden bg-gradient-to-br ${p.color} cursor-pointer`}
                     whileHover={{ scale: 0.98 }}
                   >
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                         {p.icon && <p.icon size={32} className="drop-shadow-lg" />}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                         <div className="text-white font-bold text-xs text-center px-2">
                           <Heart size={16} className="inline mr-1 fill-white" /> 1.2k
                           <br/>
                           {p.title}
                         </div>
                      </div>
                   </motion.a>
                ))}
             </motion.div>
          )}

          {activeTab === 'list' && (
             <motion.div 
               key="list" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="p-4 space-y-6"
             >
                {/* Experience */}
                <div>
                   <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Experience</h3>
                   <div className="border-l-2 border-gray-200 ml-2 space-y-6 pl-6 relative">
                      {GET_SECTIONS(t).find(s => s.id === 'experience').items.map((item, i) => (
                         <div key={i} className="relative">
                            <div className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                            <h4 className="font-bold text-sm">{item.role}</h4>
                            <p className="text-xs text-blue-600 font-semibold">{item.company}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Education */}
                <div>
                   <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Education</h3>
                   <div className="space-y-3">
                      {GET_SECTIONS(t).find(s => s.id === 'education').items.map((item, i) => (
                         <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">EDU</div>
                            <div>
                               <h4 className="font-bold text-sm">{item.degree}</h4>
                               <p className="text-xs text-gray-500">{item.school}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'tagged' && (
             <motion.div 
               key="tagged" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="p-4 space-y-6"
             >
                <div className="text-center py-4">
                   <h3 className="font-bold text-lg">{t('mentionsGear')}</h3>
                   <p className="text-xs text-gray-500">{t('taggedIn')}</p>
                </div>
                
                <SkillMarquee tags={GET_SECTIONS(t).find(s => s.id === 'skills').tags} theme="instagram" t={t} />

                <div className="space-y-4">
                  {GET_SECTIONS(t).find(s => s.id === 'testimonials').items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                         <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                         <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none flex-1">
                            <p className="text-xs font-bold">{item.user} <span className="font-normal text-gray-500">mentioned you</span></p>
                            <p className="text-sm text-gray-800 mt-1">"{item.text}"</p>
                         </div>
                      </div>
                  ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'contact' && (
             <motion.div 
               key="contact" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="p-4 space-y-6"
             >
                <div className="text-center py-4">
                   <h3 className="font-bold text-lg">{t('getInTouch')}</h3>
                   <p className="text-xs text-gray-500">{t('findOnline')}</p>
                </div>

                <div className="space-y-2">
                   {GET_SECTIONS(t).find(s => s.id === 'contact').links.map((l, i) => (
                      <a key={i} href={l.href} target="_blank" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-black group-hover:scale-110 transition-transform">
                               <l.icon size={20} />
                            </div>
                            <span className="font-bold text-sm">{l.label}</span>
                         </div>
                         <ExternalLink size={16} className="text-gray-400" />
                      </a>
                   ))}
                </div>

                <div className="border-t border-gray-100 pt-6">
                   <h4 className="font-bold text-sm mb-4">{t('directMessage')}</h4>
                   <ContactForm theme="instagram" user={user} t={t} />
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

  </div>
  );
};

const FacebookLayout = ({ data, sectionType, onLike, isLiked, likeCount, user, t }) => (
  <div className="w-full bg-[#F0F2F5] flex justify-center pb-8"> 
     <div className="w-full max-w-xl space-y-2">
        {sectionType === 'intro' ? (
           <div className="bg-white rounded-xl shadow-sm overflow-hidden pb-4 mx-4 md:mx-0 mt-4">
              <div className="h-32 bg-gray-200 relative">
                  <img src={PROFILE.cover} alt="Cover" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="px-4 relative">
                 <div className="-mt-12 mb-3 relative z-10">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-zinc-200 overflow-hidden flex items-center justify-center">
                        <img src={PROFILE.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                 </div>
                 <div><h1 className="text-2xl font-bold text-black">{data.content.name}</h1><div className="flex items-center gap-1 text-zinc-500 text-sm mt-1"><MapPin size={14} /> {data.content.location}</div><p className="text-zinc-600 font-medium">{data.content.summary}</p></div>
                 <div className="flex gap-2 border-t pt-4 mt-4"><div className="flex-1 bg-[#E7F3FF] text-[#1877F2] py-2 rounded-md font-bold text-center text-sm cursor-pointer">{t('addFriend')}</div><div className="flex-1 bg-zinc-100 text-black py-2 rounded-md font-bold text-center text-sm cursor-pointer">{t('message')}</div></div>
              </div>
           </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm mx-4 md:mx-0 mb-2">
              <div className="p-4 flex items-center justify-between"><div className="flex items-center gap-2"><UserAvatar className="w-10 h-10" /><div><p className="font-bold text-sm text-black">Warda Naeem</p><div className="flex items-center gap-1 text-xs text-zinc-500"><span>Just now</span><span>•</span><span className="font-bold">🌍</span></div></div></div><MoreHorizontal size={20} className="text-zinc-500" /></div>
              <div className="bg-zinc-50 border-y border-zinc-100 p-6 text-black">
                 {/* UPDATED FACEBOOK TIMELINE */}
                 {sectionType === 'timeline' && (
                    <div className="relative pl-4 space-y-6">
                        <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                        {data.items?.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center border-4 border-[#F0F2F5] z-10 shrink-0">
                                <Briefcase size={18} />
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-100 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-lg text-zinc-800 leading-tight">{item.role}</h4>
                                    <span className="text-[10px] font-bold bg-[#E7F3FF] text-[#1877F2] px-2 py-1 rounded-full">{item.period}</span>
                                </div>
                                <p className="text-sm font-semibold text-[#1877F2] mb-2">@{item.company}</p>
                                <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                 )}

                 {sectionType === 'tags' && <SkillMarquee tags={data.tags} theme="facebook" t={t} />}
                 {sectionType === 'vibe' && <VibeCheck lang={t('lang')} />}
                 {sectionType === 'projects' && (
                   <>
                     <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">{t('projectHub')}</h3>
                     <ProjectHub projects={data.items} theme="facebook" t={t} />
                   </>
                 )}
                 {sectionType === 'testimonials' && <TestimonialsHub items={data.items} theme="facebook" t={t} />}
                 
                 {/* UPDATED FACEBOOK EDUCATION */}
                 {(sectionType === 'education' || sectionType === 'cards') && (
                    <div className="grid gap-3">
                        {data.items?.map((item, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }} className="bg-white p-0 rounded-xl shadow-sm border border-zinc-200 overflow-hidden group">
                            <div className="h-16 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                                <div className="absolute -bottom-6 left-4 w-12 h-12 bg-white rounded-full p-1 border-2 border-white">
                                    <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center">
                                        <GraduationCap size={20} className="text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-8 pb-4 px-4">
                                <h4 className="font-bold text-zinc-900">{item.school}</h4>
                                <p className="text-sm text-zinc-500 mb-2">{item.degree}</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                                    <Clock size={12} />
                                    <span>{item.year}</span>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                 )}

                 {/* UPDATED FACEBOOK CONTACT */}
                 {sectionType === 'contact' && (
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-zinc-900">{t('connect')}</h3>
                            <span className="text-xs font-bold text-[#1877F2] bg-[#E7F3FF] px-2 py-1 rounded-full">{t('openForWork')}</span>
                        </div>
                        
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {data.links?.map((l, i) => (
                                <a key={i} href={l.href} target="_blank" className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-zinc-200 mb-2 group-hover:scale-110 transition-transform">
                                        <l.icon size={24} className="text-[#1877F2]" />
                                    </div>
                                    <span className="font-bold text-sm text-zinc-800">{l.label}</span>
                                    <span className="text-xs text-zinc-500 mb-3 truncate w-full">{l.val}</span>
                                    <button className="w-full bg-[#E7F3FF] text-[#1877F2] font-bold text-xs py-2 rounded-md hover:bg-[#dbeafe] transition-colors">
                                        {t('connect')}
                                    </button>
                                </a>
                            ))}
                        </div>

                        <div className="p-4 border-t border-zinc-100">
                            <div className="flex gap-3">
                                <UserAvatar className="w-10 h-10" />
                                <div className="flex-1 bg-zinc-100 rounded-2xl px-4 py-2 hover:bg-zinc-200 transition-colors cursor-text">
                                    <ContactForm theme="facebook" user={user} placeholder={t('writeMessage')} t={t} />
                                </div>
                            </div>
                        </div>
                    </div>
                 )}
              </div>
              
              <div className="px-4 py-2 flex justify-between border-b border-zinc-100">
                  <div className="flex items-center gap-1">
                     <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center"><ThumbsUp size={12} className="text-white" /></div>
                     <span className="text-xs text-zinc-500">{42 + likeCount}</span>
                  </div>
                  <span className="text-xs text-zinc-500">3 {t('comments')}</span>
              </div>

              <div className="px-2 py-1 flex">
                  <motion.button whileTap={{ scale: 1.1 }} onClick={() => onLike('facebook')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors ${isLiked ? "text-blue-600 font-bold" : "text-zinc-600 hover:bg-zinc-50"}`}><ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} /> {t('likes')}</motion.button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-zinc-50 rounded-lg text-zinc-600 font-medium text-sm"><MessageSquare size={18} /> {t('comments')}</button>
               </div>
          </div>
        )}
     </div>
  </div>
);

const TwitterLayout = ({ data, sectionType, onLike, isLiked, likeCount, user, t }) => (
  <div className="w-full bg-black text-[#e7e9ea] flex justify-center pb-20">
     <div className="w-full max-w-xl border-x border-zinc-800">
        {sectionType === 'intro' ? (
           <div className="pb-4 border-b border-zinc-800 pt-4">
              <div className="h-32 bg-zinc-800 relative">
                  <img src={PROFILE.cover} alt="Cover" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="px-4 relative mb-4">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black bg-zinc-900 absolute -top-12 md:-top-16 overflow-hidden flex items-center justify-center">
                    <img src={PROFILE.avatar} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex justify-end pt-3"><button className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-sm hover:bg-zinc-200">{t('editProfile')}</button></div>
                 <div className="mt-4"><h1 className="font-bold text-xl leading-tight text-white">{data.content.name}</h1><p className="text-zinc-500 text-sm">{data.content.handle}</p></div>
                 <p className="mt-3 text-sm text-white">{data.content.summary}</p>
                 <div className="flex gap-4 mt-3 text-zinc-500 text-sm"><span className="flex items-center gap-1"><MapPin size={16} /> {data.content.location}</span></div>
                 <div className="flex gap-4 mt-3 text-sm"><span><span className="font-bold text-white">250</span> <span className="text-zinc-500">{t('following')}</span></span><span><span className="font-bold text-white">1.2k</span> <span className="text-zinc-500">{t('followers')}</span></span></div>
              </div>
              <div className="flex"><div className="flex-1 hover:bg-zinc-900 py-3 text-center font-bold border-b-4 border-[#1d9bf0] text-white cursor-pointer">{t('posts')}</div><div className="flex-1 hover:bg-zinc-900 py-3 text-center text-zinc-500 font-medium cursor-pointer">{t('replies')}</div></div>
           </div>
        ) : (
           <div className="border-b border-zinc-800 p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer">
              <div className="flex gap-3">
                 <UserAvatar className="w-10 h-10 flex-shrink-0" />
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1"><span className="font-bold text-white hover:underline">Warda Naeem</span><span className="text-zinc-500">@warda.dev</span><span className="text-zinc-500">·</span><span className="text-zinc-500">2h</span></div><MoreHorizontal size={16} className="text-zinc-500" /></div>
                    <div className="mt-1 text-[15px] leading-normal text-white">
                       {/* UPDATED TWITTER EXPERIENCE */}
                       {sectionType === 'timeline' && (
                          <div className="relative">
                            <div className="absolute left-[26px] top-4 bottom-0 w-0.5 bg-zinc-800"></div>
                            
                            <div className="space-y-0">
                               <div className="pl-16 pb-4 text-zinc-500 text-sm">{t('threadWork')}</div>
                               {data.items?.map((item, i) => (
                                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex gap-3 relative pb-6 group">
                                     <div className="flex flex-col items-center z-10 bg-black pt-1">
                                        <UserAvatar className="w-12 h-12 border-2 border-black" />
                                     </div>
                                     
                                     <div className="flex-1 pt-1 pr-2">
                                        <div className="flex items-baseline gap-1">
                                           <span className="font-bold text-white hover:underline cursor-pointer">Warda Naeem</span>
                                           <span className="text-zinc-500 text-[15px]">@warda.dev</span>
                                           <span className="text-zinc-500 text-[15px]">·</span>
                                           <span className="text-zinc-500 text-[15px]">{item.period.split(' ')[0]}</span>
                                        </div>
                                        
                                        <div className="mt-0.5 text-[15px] text-white/90">
                                           <span className="text-[#1d9bf0] font-bold block mb-1">🚀 {item.role}</span>
                                           At <span className="font-bold text-white">@{item.company}</span> — {item.desc}
                                        </div>
                                        
                                        <div className="flex justify-between mt-3 max-w-sm text-zinc-500">
                                           <div className="group flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer"><MessageSquare size={16} /><span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">{t('reply')}</span></div>
                                           <div className="group flex items-center gap-1 hover:text-green-500 cursor-pointer"><Repeat size={16} /><span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">Repost</span></div>
                                           <div className="group flex items-center gap-1 hover:text-pink-500 cursor-pointer"><Heart size={16} /><span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">Like</span></div>
                                           <div className="group flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer"><BarChart2 size={16} /></div>
                                        </div>
                                     </div>
                                  </motion.div>
                               ))}
                            </div>
                          </div>
                       )}

                       {sectionType === 'tags' && <SkillMarquee tags={data.tags} theme="twitter" t={t} />}
                       {sectionType === 'vibe' && <VibeCheck lang={t('lang')} />}
                       {sectionType === 'projects' && (
                          <>
                             <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">{t('projectHub')}</h3>
                             <ProjectHub projects={data.items} theme="twitter" t={t} />
                          </>
                       )}
                       {sectionType === 'testimonials' && <TestimonialsHub items={data.items} theme="twitter" t={t} />}
                       
                       {/* UPDATED TWITTER EDUCATION */}
                       {(sectionType === 'education' || sectionType === 'cards') && (
                          <div className="grid gap-px bg-zinc-800 border border-zinc-800 rounded-xl overflow-hidden mt-2">
                             {data.items?.map((item, i) => (
                                <div key={i} className="bg-black p-4 hover:bg-zinc-900/30 transition-colors flex items-center gap-4">
                                   <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-2xl">
                                      🎓
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-2">
                                         <p className="font-bold text-white">{item.school}</p>
                                         <Award size={14} className="text-[#1d9bf0] fill-[#1d9bf0] text-black" />
                                      </div>
                                      <p className="text-[15px] text-zinc-400">{item.degree}</p>
                                      <p className="text-xs text-zinc-600 mt-1">{item.year}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}

                       {/* UPDATED TWITTER CONTACT */}
                       {sectionType === 'contact' && (
                          <div className="mt-2">
                             <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden mb-6">
                                <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                                   <span className="font-bold text-white">{t('newMessage')}</span>
                                   <Mail size={18} className="text-[#1d9bf0]" />
                                </div>
                                <div className="p-4">
                                   <ContactForm theme="twitter" user={user} t={t} />
                                </div>
                             </div>

                             <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden">
                                <div className="p-4 border-b border-zinc-800">
                                   <h3 className="font-black text-lg text-white">{t('findElsewhere')}</h3>
                                </div>
                                {data.links?.map((l, i) => (
                                   <a key={i} href={l.href} target="_blank" className="flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-0 group">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-[#1d9bf0] transition-colors">
                                            <l.icon size={18} className="text-white group-hover:text-[#1d9bf0]" />
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm group-hover:underline">{l.label}</span>
                                            <span className="text-zinc-500 text-xs">@{l.val.split('/')[0]}</span>
                                         </div>
                                      </div>
                                      <button className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:bg-zinc-200 transition-colors">
                                         {t('follow')}
                                      </button>
                                   </a>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                    <div className="flex justify-between mt-3 max-w-md text-zinc-500"><div className="flex items-center gap-2 group hover:text-[#1d9bf0]"><MessageCircle size={18} /><span className="text-xs">2</span></div><div className="flex items-center gap-2 group hover:text-green-500"><Repeat size={18} /><span className="text-xs">5</span></div><motion.div whileTap={{ scale: 1.2 }} onClick={() => onLike('twitter')} className={`flex items-center gap-2 group cursor-pointer ${isLiked ? "text-pink-500" : "hover:text-pink-500"}`}><Heart size={18} className={isLiked ? "fill-pink-500" : ""} /><span className="text-xs">{24 + likeCount}</span></motion.div></div>
                 </div>
              </div>
           </div>
        )}
     </div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [activeTheme, setActiveTheme] = useState('tiktok');
  const [lang, setLang] = useState('en'); // 'en' or 'de'
  
  // Define t first, so it can be used in initialization
  const t = (key) => {
      if (key === 'lang') return lang;
      return UI_TRANSLATIONS[lang]?.[key] || key;
  };

  // Helper to get fresh sections with current language
  // We need to pass a specific `t` function to GET_SECTIONS that respects the `lang` passed to it,
  // or simply reconstruct it.
  const getSectionsForLang = (language) => {
      const localT = (key) => {
          if (key === 'lang') return language;
          return UI_TRANSLATIONS[language]?.[key] || key;
      };
      return GET_SECTIONS(localT);
  };

  const [sections, setSections] = useState(() => getSectionsForLang('en')); 
  const [isEditing, setIsEditing] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [likes, setLikes] = useState({ tiktok: { count: 0, active: false }, instagram: { count: 0, active: false }, facebook: { count: 0, active: false }, twitter: { count: 0, active: false } });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [graffitiMode, setGraffitiMode] = useState(false);
  const containerRef = useRef(null);
  const [user, setUser] = useState(null);

  const toggleLang = () => {
      const newLang = lang === 'en' ? 'de' : 'en';
      setLang(newLang);
      setSections(getSectionsForLang(newLang)); 
      playSound('switch');
  };

  const t_themes = THEMES[activeTheme];
  const isSnapLayout = t_themes.layoutMode === 'snap';

  useEffect(() => {
    const initAuth = async () => {
      setUser({ uid: 'simulated-user' });
    };
    initAuth();
  }, []);

  const handleLike = useCallback((themeId) => {
    playSound('pop');
    setLikes(prev => {
      const current = prev[themeId];
      const newActive = !current.active;
      const newCount = current.count + 1; 
      if (newCount % 10 === 0) { playSound('success'); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }
      return { ...prev, [themeId]: { count: newCount, active: true } };
    });
    const id = Date.now();
    const isFB = themeId === 'facebook';
    setFloatingHearts(prev => [...prev, { id, x: Math.random() * 50 - 25, y: 0, type: isFB ? 'thumb' : 'heart', color: isFB ? 'text-blue-500' : 'text-red-500' }]);
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== id)), 1000);
  }, []);

  const addSticker = (sticker) => {
    playSound('slap');
    setStickers(prev => {
      const isFirst = prev.length === 0;
      const x = isFirst ? window.innerWidth / 2 : Math.random() * (window.innerWidth - 200) + 100;
      const y = isFirst ? window.innerHeight / 2 : Math.random() * (window.innerHeight - 200) + 100;
      return [...prev, { ...sticker, id: Date.now(), x, y, rotate: Math.random() * 40 - 20 }];
    });
  };

  const clearStickers = () => {
    playSound('click');
    setStickers([]);
  };
    
  const renderSection = (section) => {
    if (devMode) return null;
    // Pass the current `t` function to children
    const props = { data: section, sectionType: section.type, user: user, t };
    let content;
    switch (activeTheme) {
      case 'tiktok': content = <TikTokLayout {...props} onLike={handleLike} likeCount={likes.tiktok.count} isLiked={likes.tiktok.active} />; break;
      case 'instagram': content = <InstagramLayout {...props} onStoryClick={() => setShowStory(true)} onLike={handleLike} isLiked={likes.instagram.active} likeCount={likes.instagram.count} />; break;
      case 'facebook': content = <FacebookLayout {...props} onLike={handleLike} isLiked={likes.facebook.active} likeCount={likes.facebook.count} />; break;
      case 'twitter': content = <TwitterLayout {...props} onLike={handleLike} isLiked={likes.twitter.active} likeCount={likes.twitter.count} />; break;
      default: content = <TikTokLayout {...props} />;
    }
    return content; 
  };

  return (
    <div className={`h-screen w-full overflow-hidden ${devMode ? 'font-mono bg-black text-green-500' : `${t_themes.font} ${t_themes.bg}`} transition-colors duration-500 relative select-none`}>
      {!devMode && <DigitalSparkCursor />}
      
      {showConfetti && <Confetti />}
      <AnimatePresence>{showStory && <StoryOverlay onClose={() => setShowStory(false)} t={t} />}</AnimatePresence>
      <AnimatePresence>{floatingHearts.map(h => (<motion.div key={h.id} initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }} animate={{ opacity: 0, y: -200, x: h.x, scale: 1.5 }} exit={{ opacity: 0 }} className={`fixed top-1/2 left-1/2 pointer-events-none z-[90] ${h.color}`}>{h.type === 'thumb' ? <ThumbsUp fill="currentColor" size={48} /> : <Heart fill="currentColor" size={48} />}</motion.div>))}</AnimatePresence>
      
      <GraffitiCanvas isActive={graffitiMode} onClose={() => setGraffitiMode(false)} t={t} />

      <div className="fixed top-4 left-4 z-[999] flex gap-2">
          {!devMode && <button onClick={() => { setShowThemeMenu(!showThemeMenu); playSound('click'); }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg border border-white/20 hover:scale-105 active:scale-95 transition-all pointer-events-auto"><Palette size={16} /><span className="text-xs font-bold tracking-wide hidden md:block">{t('theme')}</span></button>}
          
          {/* LANGUAGE TOGGLE BUTTON */}
          {!devMode && <button onClick={toggleLang} className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-bold hover:scale-105 active:scale-95 transition-all pointer-events-auto">
              <Languages size={16} />
              <span className="text-xs font-bold uppercase">{lang === 'en' ? 'EN' : 'DE'}</span>
          </button>}

          <button onClick={() => { setDevMode(!devMode); playSound('switch'); }} className={`p-3 rounded-full backdrop-blur-md border border-white/20 text-white hover:scale-110 transition-all pointer-events-auto ${devMode ? 'bg-green-900/50 border-green-500' : 'bg-black/80'}`} title="Developer Mode"><Code2 size={20} className={devMode ? "text-green-400" : "text-white"} /></button>
          {!devMode && <button onClick={() => { setIsEditing(!isEditing); playSound('click'); }} className={`p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-all pointer-events-auto ${isEditing ? 'bg-red-500/80 border-red-500' : ''}`}><GripVertical size={20} /></button>}
          {!devMode && <button onClick={() => { setGraffitiMode(true); playSound('click'); }} className="p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-all pointer-events-auto" title="Graffiti Mode"><PenTool size={20} /></button>}
      </div>

      {!devMode && <MusicPlayer t={t} />}
      {!devMode && <StickerDrawer addSticker={addSticker} clearStickers={clearStickers} hasStickers={stickers.length > 0} t={t} />}
      {stickers.map(s => (<motion.div key={s.id} drag initial={{ scale: 0, x: s.x, y: s.y, rotate: s.rotate }} animate={{ scale: 1 }} className="fixed z-[80] cursor-grab active:cursor-grabbing pointer-events-auto"><s.icon size={64} className={`${s.color} drop-shadow-2xl`} /></motion.div>))}
      {!devMode && <BitPet />}
      
      {!devMode && <ThemeSidebars theme={activeTheme} t={t} />}

      <AnimatePresence>{showThemeMenu && !devMode && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-20 left-4 z-[999] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 p-2 rounded-2xl w-56 shadow-2xl">
              {Object.values(THEMES).map((theme) => (<button key={theme.id} onClick={() => { setActiveTheme(theme.id); setShowThemeMenu(false); playSound('switch'); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTheme === theme.id ? 'bg-white text-black scale-105 shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><theme.icon size={18} />{theme.label}{activeTheme === theme.id && <Check size={16} className="ml-auto text-green-500" />}</button>))}
          </motion.div>
        )}</AnimatePresence>

      <AnimatePresence mode="wait">
        {!isEditing && !devMode ? (
           <motion.div key="view-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`h-full w-full overflow-y-auto ${isSnapLayout ? 'snap-y snap-mandatory scroll-smooth' : 'scroll-smooth'}`} ref={containerRef}>
              {!isSnapLayout && <div className="h-20" />} 
              {sections.map((section) => (<section key={section.id} id={section.id} className={`w-full relative overflow-hidden ${isSnapLayout ? 'h-full snap-start flex items-center justify-center' : 'h-auto'}`}>{renderSection(section)}</section>))}
              {!isSnapLayout && <div className="h-20" />}
           </motion.div>
        ) : (
          !devMode && (
            <motion.div key="edit-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6">
               <h2 className="text-3xl font-black text-white mb-6">{t('remixFeed')}</h2>
               <Reorder.Group axis="y" values={sections} onReorder={setSections} className="w-full max-w-sm space-y-3">{sections.map(section => (<Reorder.Item key={section.id} value={section} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 cursor-grab active:cursor-grabbing"><GripVertical className="text-zinc-600" /><div><p className="font-bold text-white">{section.title}</p><p className="text-xs text-zinc-500 uppercase">{section.type}</p></div></Reorder.Item>))}</Reorder.Group>
               <button onClick={() => setIsEditing(false)} className="mt-8 bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-colors">{t('saveLayout')}</button>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {devMode && <><MatrixRain /><div className="absolute inset-0 overflow-auto p-8 z-10 font-mono text-xs md:text-sm"><h1 className="text-4xl font-bold mb-8 text-green-400">{`> SYSTEM_ROOT_ACCESS_GRANTED`}</h1>{sections.map((s, i) => (<div key={i} className="mb-8"><div className="text-blue-400 mb-2">{`// ${s.title}`}</div><pre className="whitespace-pre-wrap text-green-300 opacity-80 hover:opacity-100 transition-opacity">{JSON.stringify(s, null, 2)}</pre></div>))}</div></>}

      {!devMode && activeTheme === 'instagram' && <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-3 flex justify-around text-black z-30 md:hidden"><Home size={24} /><Search size={24} /><div className="w-6 h-6 border-2 border-black rounded-md flex items-center justify-center"><span className="text-xs font-bold">+</span></div><Heart size={24} /><UserAvatar className="w-6 h-6" /></div>}
      {!devMode && activeTheme === 'facebook' && <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-2 flex justify-around text-zinc-500 z-30 md:hidden"><Home size={24} className="text-[#1877F2]" /><User size={24} /><Bell size={24} /><UserAvatar className="w-6 h-6" /></div>}
      {!devMode && activeTheme === 'twitter' && <div className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800 p-3 flex justify-around text-white z-30 md:hidden"><Home size={24} /><Search size={24} /><Bell size={24} /><Mail size={24} /></div>}
    </div>
  );
}