import { useState, useEffect, useCallback } from "react";
import { LESSONS } from "./lessons.js";

const C = {
  bg: "#F2F3F4",
  asphalt: "#24272B",
  asphaltSoft: "#33373C",
  line: "#E8A33D",
  green: "#1D9E75",
  greenDark: "#0F6E56",
  greenBg: "#E1F5EE",
  red: "#D85A30",
  text: "#24272B",
  sub: "#6B7075",
  card: "#FFFFFF",
  border: "#E3E5E7",
};

const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const SECTIONS = [
  { id: "s0", tag: "شروع", title: "همین فردا", sub: "شنبه ۲۰ تیر", items: [
    "تماس با آموزشگاه و رزرو مربی خصوصی",
    "ثبت ۴ جلسه هفته اول تو تقویم گوشی با ساعت دقیق",
    "گذاشتن دفترچه ثبت ترس تو داشبورد ماشین",
  ]},
  { id: "sr", tag: "قانون", title: "قوانین غیرقابل مذاکره", sub: "کل دو ماه", rules: true, items: [
    "حداقل ۴ جلسه در هفته، هر جلسه ۳۰ تا ۴۵ دقیقه",
    "بابا تو هیچ جلسه‌ای نیست",
    "ویدیو رانندگی تو اینستاگرام ممنوع",
    "جلسه پیچوندی؟ فرداش دو جلسه",
    "بعد هر اتفاق بد، حداکثر ۴۸ ساعت بعد پشت فرمون",
    "خش برداشتن ماشین هزینه آموزشه، نه سند بی‌عرضگی",
  ]},
  { id: "s1", tag: "هفته ۱", title: "آشتی با ماشین", sub: "۲۰ تا ۲۶ تیر · خیابون خلوت، ۶ صبح", items: [
    "جلسه ۱ با مربی: حرکت و ترمز نرم",
    "جلسه ۲ با مربی: دنده عقب مستقیم",
    "جلسه ۳ تنها: دور زدن تو خیابون عریض",
    "جلسه ۴ تنها: ۳۰ دقیقه چرخیدن بدون همراه",
  ], goal: "۳۰ دقیقه تنها تو خیابون خلوت بچرخی" },
  { id: "s2", tag: "هفته ۲", title: "کوچه و دقت", sub: "۲۷ تیر تا ۲ مرداد", items: [
    "جلسه با مربی: کوچه باریک",
    "رد شدن از کنار ماشین‌های پارک‌شده با فاصله کم",
    "پارک ساده کنار جدول، حداقل ۱۵ بار",
    "عبور از کوچه‌ای که ماشین پارک‌شده توشه",
  ], goal: "عبور از کوچه باریک با مانع، بدون توقف کامل" },
  { id: "s3", tag: "هفته ۳", title: "پارک دوبل", sub: "۳ تا ۹ مرداد · هفته طلایی", items: [
    "جلسه ۱ با مربی: تکنیک پارک دوبل",
    "جلسه ۲ با مربی: اصلاح خطاها",
    "پارک دوبل بین دو مانع، ۱۵ بار در جلسه",
    "تمرین خروج از پارک، ۱۵ بار",
  ], goal: "۳ پارک دوبل موفق پشت سر هم" },
  { id: "s4", tag: "هفته ۴", title: "میدون خلوت", sub: "۱۰ تا ۱۶ مرداد", items: [
    "رانندگی تو ترافیک سبک، خارج از پیک",
    "ورود و خروج میدون کوچیک محله، ۵ بار",
    "تمرین قانون: شک داری؟ وایسا",
    "یک جلسه کامل تنها تو خیابون زنده",
  ], goal: "۵ بار عبور از میدون خلوت، تنها" },
  { id: "s5", tag: "هفته ۵", title: "روز مواجهه", sub: "۱۷ تا ۲۳ مرداد", items: [
    "عبور از دوربرگردون کمربندی با مربی",
    "عبور از همون دوربرگردون، تنها",
    "مسیر ترکیبی: کوچه + خیابون + میدون + پارک",
    "خوندن صفحه اول دفترچه و مقایسه عدد ترس",
  ], goal: "از دوربرگردون سال ۹۷ رد شده باشی" },
  { id: "s6", tag: "هفته ۶", title: "ترافیک واقعی", sub: "۲۴ تا ۳۰ مرداد · سخت‌ترین هفته", items: [
    "رانندگی عصر تو خیابون اصلی شهر",
    "عبور از شلوغ‌ترین میدون شهر، بار اول",
    "عبور از همون میدون، بار دوم",
    "یک جلسه کامل تو ساعت پیک",
  ], goal: "۲ عبور کامل از شلوغ‌ترین میدون" },
  { id: "s7", tag: "هفته ۷", title: "رانندگی با مقصد", sub: "۳۱ مرداد تا ۶ شهریور", items: [
    "همه کارهای روزمره با ماشین",
    "یک مسیر کاملاً ناآشنا",
    "سوار کردن یک دوست (نه خانواده)",
    "حداقل ۴ سفر با مقصد واقعی",
  ], goal: "ماشین بشه وسیله زندگی، نه پروژه ترس" },
  { id: "s8", tag: "هفته ۸", title: "آزمون نهایی", sub: "۷ تا ۱۳ شهریور", items: [
    "مسیر ۳۰ دقیقه‌ای خارج از محدوده همیشگی",
    "پارک دوبل تو خیابون واقعی و شلوغ",
    "یک رانندگی شب",
    "نوشتن عدد ترس نهایی و مقایسه با روز اول",
  ], goal: "هر سه چالش انجام‌شده، نه بی‌نقص" },
];

const DEFAULT_QUOTES = [
  "راننده‌ای که پشتت بوق می‌زنه، سه ثانیه بعد تو رو فراموش کرده. ولی تو هفت ساله خودتو زندونی قضاوت اون کردی.",
  "ترس یک احساسه، اجتناب یک تصمیمه.",
  "حس آمادگی هیچ‌وقت قبل از عمل نمیاد. همیشه بعدش میاد.",
  "هدف این نیست که نترسی. هدف اینه که با ترس رانندگی کنی، تا مغزت یاد بگیره ترس یعنی هشدار، نه فرمان توقف.",
  "در سرعت کم، هیچ اتفاق وحشتناکی نمی‌افته.",
  "رانندگی استعداد نمی‌خواد، تکرار می‌خواد. تنها فرق تو با بقیه، ساعت پشت فرمونه.",
  "کسی که ماشینش هیچ‌وقت خش نداره، یا راننده حرفه‌ایه یا اصلاً رانندگی نمی‌کنه.",
  "بعد از هر اتفاق بد، اون ده دقیقه‌ای که برمی‌گردی پشت فرمون تعیین می‌کنه که ماجرا خاطره می‌شه یا زخم.",
  "جلسه کوتاهِ انجام‌شده از جلسه طولانیِ کنسل‌شده هزار برابر بهتره.",
  "مغز آدم پیشرفت تدریجی رو نمی‌بینه. سند لازم داره.",
  "اون دوربرگردون نقطه نفرین‌شده نیست. فقط یک تیکه آسفالته.",
  "بوق کسی رو نکشته.",
];

const STORE_KEY = "jaddeh_app_v1";

const PRE_DRIVE_ITEMS = [
  "دور و بر ماشین را چک کردم",
  "صندلی، آینه‌ها و کمربند را تنظیم کردم",
  "گوشی روی حالت بی‌صدا و دور از دسترس است",
  "مسیر و مقصد را قبل از حرکت بررسی کردم",
  "بدنم آرام است و عجله، خواب‌آلودگی یا خستگی شدید ندارم",
  "یک نفس آرام کشیدم و آماده‌ام با سرعت امن شروع کنم",
];

const BREATH_STEPS = [
  { label: "دم آرام", seconds: 4, color: C.green },
  { label: "مکث", seconds: 4, color: C.line },
  { label: "بازدم آهسته", seconds: 6, color: C.greenDark },
];

const CAR_SIDES = [
  { id: "front", label: "جلوی خودرو", short: "جلو" },
  { id: "right", label: "سمت راست", short: "راست" },
  { id: "rear", label: "عقب خودرو", short: "عقب" },
  { id: "left", label: "سمت چپ", short: "چپ" },
];

const DIMENSION_EXERCISES = [
  {
    id: "front", number: "۱", title: "نوک کاپوت کجاست؟", side: "front", level: "شروع آسان", tools: "۲ بطری آب + متر",
    goal: "فاصلهٔ جلوی خودرو را با خطای کمتر از ۲۰ سانتی‌متر حدس بزن.",
    steps: [
      "در یک فضای کاملاً خلوت، دو بطری آب را مثل یک خط جلوی خودرو بگذار.",
      "با کمک مربی و سرعت بسیار کم جلو برو و جایی که فکر می‌کنی ۱ متر فاصله داری، کامل توقف کن.",
      "قبل از پیاده‌شدن، فاصله‌ای را که حدس می‌زنی در کادر «حدس» وارد کن.",
      "خودرو را خاموش کن، ترمز دستی را بکش، فاصلهٔ سپر تا بطری‌ها را با متر بگیر و در «واقعی» بنویس.",
    ],
  },
  {
    id: "right", number: "۲", title: "چرخ راست و جدول", side: "right", level: "کنترل کنار خودرو", tools: "بطری آب + متر",
    goal: "سمت راست را بدون برخورد و با خطای کمتر از ۱۵ سانتی‌متر تشخیص بده.",
    steps: [
      "به‌جای جدول سخت، یک ردیف بطری آب در سمت راست مسیر بچین.",
      "با حضور مربی، خیلی آرام و موازی بطری‌ها حرکت کن و در فاصله‌ای که امن می‌دانی توقف کن.",
      "از روی صندلی راننده فاصلهٔ سمت راست را حدس بزن و ثبت کن.",
      "خودرو را ایمن کن، پیاده شو و نزدیک‌ترین فاصلهٔ بدنه یا چرخ تا بطری‌ها را اندازه بگیر.",
    ],
  },
  {
    id: "left", number: "۳", title: "مرز سمت راننده", side: "left", level: "دقت جانبی", tools: "نوار کاغذی + متر",
    goal: "فاصلهٔ سمت چپ را سه بار پشت‌سرهم با خطای کمتر از ۱۵ سانتی‌متر حدس بزن.",
    steps: [
      "یک خط بلند با نوار کاغذی یا بطری آب در سمت چپ فضای تمرین بساز.",
      "با سرعت قدم‌زدن و همراه مربی، خودرو را موازی خط قرار بده و توقف کامل کن.",
      "فاصلهٔ درِ راننده تا خط را از داخل خودرو حدس بزن و وارد کن.",
      "بعد از ایمن‌کردن خودرو، فاصله را اندازه بگیر و جای خط را نسبت به گوشهٔ شیشه به خاطر بسپار.",
    ],
  },
  {
    id: "rear", number: "۴", title: "انتهای صندوق کجاست؟", side: "rear", level: "با مربی", tools: "۲ بطری آب + متر",
    goal: "فاصلهٔ عقب را با خطای کمتر از ۲۰ سانتی‌متر حدس بزن.",
    steps: [
      "دو بطری آب را پشت خودرو و با فاصلهٔ زیاد قرار بده؛ هیچ مانع سختی استفاده نکن.",
      "با راهنمایی مربی، بسیار آرام دنده‌عقب برو و وقتی فکر می‌کنی ۱ متر مانده توقف کامل کن.",
      "پیش از پیاده‌شدن، فاصلهٔ سپر عقب را حدس بزن و ثبت کن.",
      "خودرو را خاموش و ایمن کن، فاصلهٔ واقعی سپر عقب تا بطری‌ها را اندازه بگیر.",
    ],
  },
];

const emptyDimensions = () => CAR_SIDES.reduce((all, side) => ({
  ...all,
  [`${side.id}Estimate`]: "",
  [`${side.id}Actual`]: "",
}), {});

function Car({ x }) {
  return (
    <g transform={`translate(${x},14)`} style={{ transition: "transform .6s ease" }}>
      <rect x="-16" y="-7" width="32" height="12" rx="4" fill={C.line} />
      <rect x="-9" y="-13" width="17" height="9" rx="3" fill={C.line} />
      <rect x="-6" y="-11" width="5" height="6" rx="1.5" fill={C.asphalt} />
      <rect x="1" y="-11" width="5" height="6" rx="1.5" fill={C.asphalt} />
      <circle cx="-9" cy="6" r="4" fill="#111" stroke="#555" strokeWidth="1.5" />
      <circle cx="9" cy="6" r="4" fill="#111" stroke="#555" strokeWidth="1.5" />
    </g>
  );
}

function Road({ pct }) {
  const W = 560;
  const x = 24 + (W - 48) * (pct / 100);
  return (
    <svg viewBox={`0 0 ${W} 46`} style={{ width: "100%", display: "block" }} aria-label={`پیشرفت ${fa(pct)} درصد`}>
      <rect x="0" y="4" width={W} height="34" rx="10" fill={C.asphaltSoft} />
      <line x1="14" y1="21" x2={W - 14} y2="21" stroke="#5A6066" strokeWidth="3" strokeDasharray="14 12" strokeLinecap="round" />
      <line x1="14" y1="21" x2={Math.max(14, x)} y2="21" stroke={C.line} strokeWidth="3" strokeDasharray="14 12" strokeLinecap="round" style={{ transition: "all .6s ease" }} />
      <Car x={x} />
    </svg>
  );
}

export default function JaddehApp() {
  const [tab, setTab] = useState("plan");
  const [checks, setChecks] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newQuote, setNewQuote] = useState("");
  const [fear, setFear] = useState(5);
  const [note, setNote] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const [preChecks, setPreChecks] = useState({});
  const [breathing, setBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathLeft, setBreathLeft] = useState(BREATH_STEPS[0].seconds);
  const [breathRounds, setBreathRounds] = useState(0);
  const [dimensions, setDimensions] = useState(emptyDimensions);
  const [dimensionLogs, setDimensionLogs] = useState([]);
  const [focusSide, setFocusSide] = useState("front");
  const [dimensionNote, setDimensionNote] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [exerciseSteps, setExerciseSteps] = useState({});
  const [sideIndicators, setSideIndicators] = useState({ front: "", rear: "", left: "", right: "" });
  const [indicatorSaved, setIndicatorSaved] = useState("");
  const [openLesson, setOpenLesson] = useState("slopes");
  const [lessonNotes, setLessonNotes] = useState({});
  const [newLessonNote, setNewLessonNote] = useState({});
  const [customLessons, setCustomLessons] = useState([]);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonBody, setNewLessonBody] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);

  useEffect(() => {
    (async () => {
      let data = null;
      try {
        if (window.storage) {
          const r = await window.storage.get(STORE_KEY);
          if (r && r.value) data = JSON.parse(r.value);
        } else {
          const raw = window.localStorage.getItem(STORE_KEY);
          if (raw) data = JSON.parse(raw);
        }
      } catch (e) {}
      if (data) {
        setChecks(data.checks || {});
        setQuotes(data.quotes && data.quotes.length ? data.quotes : DEFAULT_QUOTES.map((t) => ({ t, mine: false })));
        setLogs(data.logs || []);
        setPreChecks(data.preChecks || {});
        setDimensionLogs(data.dimensionLogs || []);
        setSideIndicators(data.sideIndicators || { front: "", rear: "", left: "", right: "" });
        setLessonNotes(data.lessonNotes || {});
        setCustomLessons(data.customLessons || []);
      } else {
        setQuotes(DEFAULT_QUOTES.map((t) => ({ t, mine: false })));
      }
      setQIndex(Math.floor(Math.random() * DEFAULT_QUOTES.length));
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!breathing) return undefined;
    const timer = setInterval(() => {
      setBreathLeft((left) => {
        if (left > 1) return left - 1;
        const nextStep = (breathStep + 1) % BREATH_STEPS.length;
        if (nextStep === 0) setBreathRounds((r) => r + 1);
        setBreathStep(nextStep);
        return BREATH_STEPS[nextStep].seconds;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [breathing, breathStep]);

  const persist = useCallback(async (next) => {
    try {
      if (window.storage) {
        await window.storage.set(STORE_KEY, JSON.stringify(next));
      } else {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
      }
      setSaveNote("ذخیره شد");
      setTimeout(() => setSaveNote(""), 1500);
    } catch (e) {
      setSaveNote("ذخیره نشد — دوباره تیک بزن");
      setTimeout(() => setSaveNote(""), 2500);
    }
  }, []);

  const save = useCallback((c, q, l, p = preChecks, d = dimensionLogs, indicators = sideIndicators, notes = lessonNotes, custom = customLessons) => {
    persist({ checks: c, quotes: q, logs: l, preChecks: p, dimensionLogs: d, sideIndicators: indicators, lessonNotes: notes, customLessons: custom });
  }, [persist, preChecks, dimensionLogs, sideIndicators, lessonNotes, customLessons]);

  const toggle = (k) => {
    const next = { ...checks, [k]: !checks[k] };
    setChecks(next);
    save(next, quotes, logs);
  };

  const addQuote = () => {
    const t = newQuote.trim();
    if (!t) return;
    const next = [{ t, mine: true }, ...quotes];
    setQuotes(next);
    setNewQuote("");
    save(checks, next, logs);
  };

  const removeQuote = (i) => {
    const next = quotes.filter((_, idx) => idx !== i);
    setQuotes(next);
    save(checks, next, logs);
  };

  const addLog = () => {
    const entry = {
      d: new Date().toLocaleDateString("fa-IR"),
      fear,
      note: note.trim(),
      ts: Date.now(),
    };
    const next = [entry, ...logs];
    setLogs(next);
    setNote("");
    save(checks, quotes, next);
  };

  const togglePreCheck = (i) => {
    const next = { ...preChecks, [i]: !preChecks[i] };
    setPreChecks(next);
    save(checks, quotes, logs, next);
  };

  const resetPreChecks = () => {
    setPreChecks({});
    save(checks, quotes, logs, {});
  };

  const toggleBreathing = () => {
    if (breathing) {
      setBreathing(false);
      return;
    }
    setBreathStep(0);
    setBreathLeft(BREATH_STEPS[0].seconds);
    setBreathRounds(0);
    setBreathing(true);
  };

  const dimensionPairs = CAR_SIDES.map((side) => {
    const estimate = Number(dimensions[`${side.id}Estimate`]);
    const actual = Number(dimensions[`${side.id}Actual`]);
    const valid = dimensions[`${side.id}Estimate`] !== "" && dimensions[`${side.id}Actual`] !== "" && actual >= 0 && estimate >= 0;
    return { ...side, estimate, actual, valid, error: valid ? Math.abs(estimate - actual) : null };
  });
  const validDimensionPairs = dimensionPairs.filter((pair) => pair.valid);
  const averageDimensionError = validDimensionPairs.length
    ? Math.round(validDimensionPairs.reduce((sum, pair) => sum + pair.error, 0) / validDimensionPairs.length)
    : null;

  const saveDimensionPractice = () => {
    if (!validDimensionPairs.length) {
      setDimensionNote("حدس و اندازهٔ واقعی حداقل یک سمت را وارد کن");
      return;
    }
    const entry = { ts: Date.now(), d: new Date().toLocaleDateString("fa-IR"), exercise: DIMENSION_EXERCISES[selectedExercise].title, pairs: validDimensionPairs, averageError: averageDimensionError };
    const next = [entry, ...dimensionLogs];
    setDimensionLogs(next);
    setDimensions(emptyDimensions());
    setDimensionNote("تمرین ثبت شد");
    save(checks, quotes, logs, preChecks, next);
    setTimeout(() => setDimensionNote(""), 2000);
  };

  const removeDimensionLog = (ts) => {
    const next = dimensionLogs.filter((entry) => entry.ts !== ts);
    setDimensionLogs(next);
    save(checks, quotes, logs, preChecks, next);
  };

  const chooseDimensionExercise = (index) => {
    setSelectedExercise(index);
    setFocusSide(DIMENSION_EXERCISES[index].side);
    setExerciseSteps({});
    setDimensionNote("");
  };

  const saveSideIndicators = () => {
    save(checks, quotes, logs, preChecks, dimensionLogs, sideIndicators);
    setIndicatorSaved("نشانه‌ها ذخیره شد");
    setTimeout(() => setIndicatorSaved(""), 1800);
  };

  const addLessonNote = (lessonId) => {
    const text = (newLessonNote[lessonId] || "").trim();
    if (!text) return;
    const next = { ...lessonNotes, [lessonId]: [...(lessonNotes[lessonId] || []), { id: Date.now(), text }] };
    setLessonNotes(next);
    setNewLessonNote((current) => ({ ...current, [lessonId]: "" }));
    save(checks, quotes, logs, preChecks, dimensionLogs, sideIndicators, next);
  };

  const removeLessonNote = (lessonId, noteId) => {
    const next = { ...lessonNotes, [lessonId]: (lessonNotes[lessonId] || []).filter((item) => item.id !== noteId) };
    setLessonNotes(next);
    save(checks, quotes, logs, preChecks, dimensionLogs, sideIndicators, next);
  };

  const addCustomLesson = () => {
    const title = newLessonTitle.trim();
    const items = newLessonBody.split("\n").map((item) => item.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
    if (!title || !items.length) return;
    const lesson = { id: `custom_${Date.now()}`, title, tag: "درس من", custom: true, sections: [{ title: "نکات درس", items }] };
    const next = [...customLessons, lesson];
    setCustomLessons(next);
    setNewLessonTitle("");
    setNewLessonBody("");
    setShowLessonForm(false);
    setOpenLesson(lesson.id);
    save(checks, quotes, logs, preChecks, dimensionLogs, sideIndicators, lessonNotes, next);
  };

  const removeCustomLesson = (lessonId) => {
    const next = customLessons.filter((lesson) => lesson.id !== lessonId);
    setCustomLessons(next);
    if (openLesson === lessonId) setOpenLesson("");
    save(checks, quotes, logs, preChecks, dimensionLogs, sideIndicators, lessonNotes, next);
  };

  const total = SECTIONS.reduce((a, s) => a + s.items.length, 0);
  const done = Object.values(checks).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const heroQuote = quotes.length ? quotes[qIndex % quotes.length].t : "";

  const firstFear = logs.length ? logs[logs.length - 1].fear : null;
  const lastFear = logs.length ? logs[0].fear : null;
  const allLessons = [...LESSONS, ...customLessons];

  if (!loaded) {
    return (
      <div dir="rtl" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif", minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&family=Lalezar&display=swap');`}</style>
        در حال باز کردن جاده...
      </div>
    );
  }

  const tabBtn = (id, label) => (
    <button
      onClick={() => setTab(id)}
      style={{
        flex: "1 1 calc(33.333% - 6px)", minWidth: 92, padding: "10px 4px", border: "none", cursor: "pointer",
        background: tab === id ? C.asphalt : "transparent",
        color: tab === id ? "#fff" : C.sub,
        borderRadius: 10, fontFamily: "inherit", fontSize: 14, fontWeight: tab === id ? 700 : 400,
        transition: "all .2s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div dir="rtl" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif", minHeight: "100vh", background: C.bg, color: C.text, padding: "calc(env(safe-area-inset-top, 0px) + 44px) 12px calc(env(safe-area-inset-bottom, 0px) + 60px)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&family=Lalezar&display=swap');
        * { box-sizing: border-box; }
        input[type=range] { accent-color: ${C.line}; width: 100%; }
        button:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        <div style={{ background: C.asphalt, borderRadius: 18, padding: "20px 18px 14px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <h1 style={{ fontFamily: "Lalezar, Vazirmatn, sans-serif", fontSize: 30, margin: 0, color: "#fff", fontWeight: 400 }}>
              جاده<span style={{ color: C.line }}>.</span>
            </h1>
            <span style={{ fontFamily: "Lalezar, Vazirmatn, sans-serif", fontSize: 28, color: C.line }}>{fa(pct)}٪</span>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9BA1A6" }}>
            هشت هفته تا رانندگی مستقل · {fa(done)} از {fa(total)} قدم
          </p>
          <Road pct={pct} />
          {saveNote && <p style={{ margin: "8px 0 0", fontSize: 12, color: saveNote.includes("نشد") ? "#F0997B" : "#9FE1CB", textAlign: "left" }}>{saveNote}</p>}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.9, color: C.text }}>
            <span style={{ color: C.line, fontFamily: "Lalezar", fontSize: 22, verticalAlign: "-4px", marginLeft: 6 }}>«</span>
            {heroQuote}
            <span style={{ color: C.line, fontFamily: "Lalezar", fontSize: 22, verticalAlign: "-4px", marginRight: 6 }}>»</span>
          </p>
          <button
            onClick={() => setQIndex((i) => i + 1)}
            style={{ marginTop: 8, background: "none", border: "none", color: C.sub, fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0 }}
          >
            یک جمله دیگه ↺
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 5, marginBottom: 16 }}>
          {tabBtn("plan", "پلن")}
          {tabBtn("prepare", "قبل حرکت")}
          {tabBtn("dimensions", "ابعاد خودرو")}
          {tabBtn("lessons", "درس‌ها")}
          {tabBtn("quotes", "جمله‌ها")}
          {tabBtn("log", "دفترچه ترس")}
        </div>

        {tab === "prepare" && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>چک‌لیست کوتاه پیش از حرکت</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: C.sub }}>کمتر از یک دقیقه؛ برای شروعی امن و آرام</p>
                </div>
                <span style={{ fontSize: 12, color: C.greenDark, background: C.greenBg, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap" }}>
                  {fa(Object.values(preChecks).filter(Boolean).length)}/{fa(PRE_DRIVE_ITEMS.length)}
                </span>
              </div>
              {PRE_DRIVE_ITEMS.map((item, i) => {
                const checked = !!preChecks[i];
                return (
                  <label key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", cursor: "pointer", borderTop: `1px solid ${C.bg}` }}>
                    <input type="checkbox" checked={checked} onChange={() => togglePreCheck(i)} style={{ width: 19, height: 19, marginTop: 2, accentColor: C.green, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, lineHeight: 1.7, color: checked ? C.sub : C.text }}>{item}</span>
                  </label>
                );
              })}
              {Object.values(preChecks).filter(Boolean).length === PRE_DRIVE_ITEMS.length && (
                <div style={{ background: C.greenBg, color: C.greenDark, borderRadius: 10, padding: "9px 12px", marginTop: 8, fontSize: 13 }}>
                  آماده‌ای. آرام شروع کن؛ هیچ عجله‌ای نیست.
                </div>
              )}
              <button onClick={resetPreChecks} style={{ marginTop: 10, background: "none", border: "none", color: C.sub, fontFamily: "inherit", fontSize: 12, cursor: "pointer", padding: 0 }}>پاک‌کردن برای سفر بعدی</button>
            </div>

            <div style={{ background: C.asphalt, borderRadius: 14, padding: "18px 16px", color: "#fff", textAlign: "center", marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>تنفس آرام پیش از رانندگی</p>
              <p style={{ margin: "4px 0 16px", fontSize: 12, color: "#AEB3B7" }}>دم ۴ ثانیه · مکث ۴ ثانیه · بازدم ۶ ثانیه</p>
              <div aria-live="polite" style={{ width: 128, height: 128, margin: "0 auto 14px", borderRadius: "50%", border: `5px solid ${BREATH_STEPS[breathStep].color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.asphaltSoft, transition: "all .5s ease" }}>
                <span style={{ fontSize: 14, color: "#D9DCDE" }}>{breathing ? BREATH_STEPS[breathStep].label : "آماده؟"}</span>
                <strong style={{ fontFamily: "Lalezar", fontSize: 38, color: breathing ? BREATH_STEPS[breathStep].color : C.line, lineHeight: 1.1 }}>{breathing ? fa(breathLeft) : "۴·۴·۶"}</strong>
              </div>
              <p style={{ minHeight: 22, margin: "0 0 12px", fontSize: 12, color: "#AEB3B7" }}>
                {breathing ? `دور کامل‌شده: ${fa(breathRounds)} از ۳` : "سه دور کافی است؛ اگر سرگیجه داشتی، متوقف شو."}
              </p>
              <button onClick={toggleBreathing} style={{ minWidth: 150, background: breathing ? "transparent" : C.line, color: breathing ? "#fff" : C.asphalt, border: breathing ? "1px solid #666C72" : "none", borderRadius: 10, padding: "10px 20px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                {breathing ? "توقف" : "شروع تنفس"}
              </button>
              {breathRounds >= 3 && breathing && <p style={{ margin: "12px 0 0", color: "#9FE1CB", fontSize: 13 }}>سه دور کامل شد. هر وقت آماده‌ای حرکت کن.</p>}
            </div>
            <p style={{ color: C.sub, fontSize: 12, lineHeight: 1.8, padding: "0 6px" }}>این تمرین جایگزین ارزیابی ایمنی نیست. اگر خواب‌آلود، بسیار مضطرب یا از نظر جسمی نامساعدی، رانندگی را به زمان دیگری موکول کن.</p>
          </div>
        )}

        {tab === "lessons" && (
          <div>
            <div style={{ background: C.asphalt, color: "#fff", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <p style={{ margin: 0, fontFamily: "Lalezar", fontSize: 24, color: C.line }}>درس‌های رانندگی</p>
              <p style={{ margin: "3px 0 0", color: "#B5BABE", fontSize: 12, lineHeight: 1.9 }}>هر فصل را باز کن، نکاتش را مرور کن و تجربه‌های مخصوص ماشین خودت را پایین همان درس اضافه کن.</p>
            </div>
            <div style={{ background: "#FDF6EA", border: "1px solid #F0DCB4", color: "#6B4A16", borderRadius: 12, padding: "10px 13px", marginBottom: 12, fontSize: 12, lineHeight: 1.9 }}>تمرین عملی فقط در محل امن و با مربی انجام شود. تابلوها، قانون محل و دفترچهٔ خودروی شما همیشه مقدم‌اند.</div>

            <button onClick={() => setShowLessonForm((shown) => !shown)} style={{ width: "100%", marginBottom: 10, border: `1px dashed ${C.green}`, borderRadius: 12, padding: "11px", background: C.greenBg, color: C.greenDark, fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{showLessonForm ? "بستن فرم" : "+ افزودن درس جدید"}</button>
            {showLessonForm && (
              <div style={{ background: C.card, border: `1px solid ${C.green}`, borderRadius: 14, padding: "14px", marginBottom: 12 }}>
                <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700 }}>درس جدید من</p>
                <input value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="عنوان درس؛ مثلاً دور زدن در کوچه" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px", fontFamily: "inherit", fontSize: 13, outline: "none", background: C.bg, marginBottom: 8 }} />
                <textarea value={newLessonBody} onChange={(e) => setNewLessonBody(e.target.value)} placeholder={"نکات درس را بنویس؛ هر نکته در یک خط\nمثلاً:\nقبل از حرکت آینه‌ها را ببین\nبا سرعت خیلی کم حرکت کن"} rows={6} style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px", fontFamily: "inherit", fontSize: 12, lineHeight: 1.8, resize: "vertical", outline: "none", background: C.bg }} />
                <button onClick={addCustomLesson} disabled={!newLessonTitle.trim() || !newLessonBody.trim()} style={{ marginTop: 9, width: "100%", border: "none", borderRadius: 9, padding: "10px", background: newLessonTitle.trim() && newLessonBody.trim() ? C.green : "#C6CACD", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: newLessonTitle.trim() && newLessonBody.trim() ? "pointer" : "default" }}>ساخت این درس</button>
              </div>
            )}

            {allLessons.map((lesson) => {
              const isOpen = openLesson === lesson.id;
              return (
                <div key={lesson.id} style={{ background: C.card, border: `1px solid ${isOpen ? C.line : C.border}`, borderRadius: 14, marginBottom: 9, overflow: "hidden" }}>
                  <button onClick={() => setOpenLesson(isOpen ? "" : lesson.id)} aria-expanded={isOpen} style={{ width: "100%", border: "none", background: isOpen ? "#FDF6EA" : C.card, color: C.text, padding: "13px 14px", display: "flex", alignItems: "center", gap: 10, textAlign: "right", fontFamily: "inherit", cursor: "pointer" }}>
                    <span style={{ background: isOpen ? C.line : C.asphalt, color: isOpen ? C.asphalt : "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{lesson.tag}</span>
                    <strong style={{ flex: 1, fontSize: 14 }}>{lesson.title}</strong>
                    <span style={{ color: C.sub, fontSize: 18 }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "4px 14px 14px" }}>
                      {lesson.custom && <div style={{ textAlign: "left", marginTop: 8 }}><button onClick={() => removeCustomLesson(lesson.id)} style={{ background: "none", border: "none", color: C.red, fontFamily: "inherit", fontSize: 11, cursor: "pointer", padding: 0 }}>حذف این درس</button></div>}
                      {lesson.sections.map((section) => (
                        <div key={section.title} style={{ marginTop: 10, borderRadius: 11, padding: "11px 12px", background: section.alert ? "#FAECE7" : C.bg, borderRight: `4px solid ${section.alert ? C.red : C.green}` }}>
                          <p style={{ margin: "0 0 7px", color: section.alert ? C.red : C.text, fontSize: 13, fontWeight: 700 }}>{section.title}</p>
                          {section.items.map((item) => <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0", fontSize: 13, lineHeight: 1.75 }}><span style={{ color: section.alert ? C.red : C.green, fontWeight: 700 }}>•</span><span>{item}</span></div>)}
                        </div>
                      ))}

                      <div style={{ marginTop: 13, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                        <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 700 }}>نکته‌های من برای این درس</p>
                        {(lessonNotes[lesson.id] || []).map((noteItem) => (
                          <div key={noteItem.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.greenBg, color: C.greenDark, borderRadius: 9, padding: "8px 10px", marginBottom: 6, fontSize: 12, lineHeight: 1.7 }}><span style={{ flex: 1 }}>{noteItem.text}</span><button onClick={() => removeLessonNote(lesson.id, noteItem.id)} aria-label="حذف نکته" style={{ background: "none", border: "none", color: C.greenDark, fontSize: 17, cursor: "pointer", padding: 0 }}>×</button></div>
                        ))}
                        <div style={{ display: "flex", gap: 7 }}>
                          <input value={newLessonNote[lesson.id] || ""} onChange={(e) => setNewLessonNote((current) => ({ ...current, [lesson.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addLessonNote(lesson.id)} placeholder={`مثلاً: نشانهٔ من برای ${lesson.title}...`} style={{ flex: 1, minWidth: 0, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 10px", fontFamily: "inherit", fontSize: 12, outline: "none", background: C.bg }} />
                          <button onClick={() => addLessonNote(lesson.id)} style={{ border: "none", borderRadius: 9, padding: "8px 13px", background: C.asphalt, color: "#fff", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>افزودن</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "dimensions" && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: "0 4px 8px", fontSize: 15, fontWeight: 700 }}>اول یک تمرین انتخاب کن</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                {DIMENSION_EXERCISES.map((exercise, index) => (
                  <button key={exercise.id} onClick={() => chooseDimensionExercise(index)} style={{ textAlign: "right", border: `1px solid ${selectedExercise === index ? C.line : C.border}`, background: selectedExercise === index ? "#FDF6EA" : C.card, borderRadius: 12, padding: "11px", fontFamily: "inherit", color: C.text, cursor: "pointer" }}>
                    <span style={{ display: "inline-flex", width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center", marginLeft: 7, background: selectedExercise === index ? C.line : C.asphalt, color: selectedExercise === index ? C.asphalt : "#fff", fontWeight: 700 }}>{exercise.number}</span>
                    <strong style={{ fontSize: 13 }}>{exercise.title}</strong>
                    <span style={{ display: "block", marginTop: 5, fontSize: 10, color: C.sub }}>{exercise.level}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: C.asphalt, color: "#fff", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: C.line, color: C.asphalt, fontWeight: 700 }}>{DIMENSION_EXERCISES[selectedExercise].number}</span>
                <div><p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{DIMENSION_EXERCISES[selectedExercise].title}</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#AEB3B7" }}>وسایل: {DIMENSION_EXERCISES[selectedExercise].tools}</p></div>
              </div>
              {DIMENSION_EXERCISES[selectedExercise].steps.map((step, index) => {
                const doneStep = !!exerciseSteps[index];
                return (
                  <label key={step} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderTop: "1px solid #3C4146", cursor: "pointer" }}>
                    <input type="checkbox" checked={doneStep} onChange={() => setExerciseSteps((s) => ({ ...s, [index]: !s[index] }))} style={{ width: 18, height: 18, marginTop: 2, accentColor: C.green, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, lineHeight: 1.8, color: doneStep ? "#8E9499" : "#F2F3F4", textDecoration: doneStep ? "line-through" : "none" }}><strong style={{ color: C.line }}>{fa(index + 1)}.</strong> {step}</span>
                  </label>
                );
              })}
              <div style={{ marginTop: 10, background: "rgba(29,158,117,.16)", color: "#9FE1CB", borderRadius: 10, padding: "9px 11px", fontSize: 12, lineHeight: 1.8 }}><strong>هدف موفقیت:</strong> {DIMENSION_EXERCISES[selectedExercise].goal}</div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>نشانه‌های شخصی ماشین من</p>
              <p style={{ margin: "4px 0 12px", fontSize: 12, color: C.sub, lineHeight: 1.8 }}>بعد از هر اندازه‌گیری بنویس مانع را از داخل خودرو کجا می‌دیدی. این نشانه‌ها مخصوص ماشین خودت هستند.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                {CAR_SIDES.map((side) => {
                  const examples = {
                    front: "مثال: وقتی بطری زیر لبهٔ کاپوت ناپدید شد، ۸۰ سانت فاصله داشتم.",
                    rear: "مثال: در آینه، بطری هم‌سطح لبهٔ پایین شیشه بود.",
                    left: "مثال: خط کنار خودرو از گوشهٔ پایین شیشه رد می‌شد.",
                    right: "مثال: جدول در آینهٔ راست دو انگشت با بدنه فاصله داشت.",
                  };
                  return (
                    <label key={side.id} style={{ display: "block", border: `1px solid ${focusSide === side.id ? C.line : C.border}`, borderRadius: 12, padding: "10px", background: focusSide === side.id ? "#FDF6EA" : C.bg }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 5, marginBottom: 7 }}>
                        <strong style={{ fontSize: 13 }}>{side.label}</strong>
                        <button type="button" onClick={() => setFocusSide(side.id)} style={{ border: "none", background: "transparent", color: C.sub, fontFamily: "inherit", fontSize: 10, cursor: "pointer", padding: 0 }}>نمایش روی شکل</button>
                      </span>
                      <textarea value={sideIndicators[side.id] || ""} onChange={(e) => setSideIndicators((current) => ({ ...current, [side.id]: e.target.value }))} placeholder={examples[side.id]} rows={4} style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px", fontFamily: "inherit", fontSize: 11, lineHeight: 1.7, resize: "vertical", outline: "none", color: C.text, background: C.card }} />
                    </label>
                  );
                })}
              </div>
              <button onClick={saveSideIndicators} style={{ marginTop: 10, width: "100%", background: C.asphalt, color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>ذخیرهٔ نشانه‌های من</button>
              {indicatorSaved && <p style={{ margin: "7px 0 0", textAlign: "center", color: C.greenDark, fontSize: 12 }}>{indicatorSaved}</p>}
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>نتیجهٔ همین تمرین را ثبت کن</p>
              <p style={{ margin: "4px 0 14px", fontSize: 12, color: C.sub, lineHeight: 1.8 }}>در تصویر روی سمت موردنظر بزن. «حدس» یعنی عددی که قبل از پیاده‌شدن گفتی؛ «واقعی» یعنی عدد متر.</p>

              <div style={{ position: "relative", maxWidth: 330, height: 390, margin: "0 auto 16px", borderRadius: 20, overflow: "hidden", background: C.asphaltSoft, border: `4px solid ${C.asphalt}` }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", borderLeft: "3px dashed #5A6066" }} />
                <div style={{ position: "absolute", top: 16, left: 52, right: 52, height: 24, borderRadius: 7, background: focusSide === "front" ? C.line : "#73797E", boxShadow: focusSide === "front" ? "0 0 0 4px rgba(232,163,61,.22)" : "none" }} />
                <div style={{ position: "absolute", bottom: 16, left: 52, right: 52, height: 24, borderRadius: 7, background: focusSide === "rear" ? C.line : "#73797E", boxShadow: focusSide === "rear" ? "0 0 0 4px rgba(232,163,61,.22)" : "none" }} />
                <div style={{ position: "absolute", top: 92, bottom: 92, left: 18, width: 22, borderRadius: 7, background: focusSide === "left" ? C.line : "#73797E", boxShadow: focusSide === "left" ? "0 0 0 4px rgba(232,163,61,.22)" : "none" }} />
                <div style={{ position: "absolute", top: 92, bottom: 92, right: 18, width: 22, borderRadius: 7, background: focusSide === "right" ? C.line : "#73797E", boxShadow: focusSide === "right" ? "0 0 0 4px rgba(232,163,61,.22)" : "none" }} />

                <div style={{ position: "absolute", width: 116, height: 214, top: 86, left: "50%", transform: "translateX(-50%)", borderRadius: "43px 43px 32px 32px", background: C.line, boxShadow: "0 12px 28px rgba(0,0,0,.35)", border: "3px solid #F3BA64" }}>
                  <div style={{ position: "absolute", top: 38, left: 17, right: 17, height: 52, borderRadius: "24px 24px 9px 9px", background: "#39434A", border: "2px solid #59656D" }} />
                  <div style={{ position: "absolute", bottom: 38, left: 17, right: 17, height: 48, borderRadius: "9px 9px 20px 20px", background: "#39434A", border: "2px solid #59656D" }} />
                  <div style={{ position: "absolute", top: 98, left: 10, right: 10, height: 3, background: "rgba(36,39,43,.3)" }} />
                  <span style={{ position: "absolute", top: 8, left: 0, right: 0, textAlign: "center", color: C.asphalt, fontSize: 11, fontWeight: 700 }}>جلوی خودرو</span>
                </div>

                {CAR_SIDES.map((side) => {
                  const pair = dimensionPairs.find((item) => item.id === side.id);
                  const pos = side.id === "front" ? { top: 49, left: "50%", transform: "translateX(-50%)" }
                    : side.id === "rear" ? { bottom: 48, left: "50%", transform: "translateX(-50%)" }
                    : side.id === "left" ? { top: "50%", left: 45, transform: "translateY(-50%)" }
                    : { top: "50%", right: 45, transform: "translateY(-50%)" };
                  return <button key={side.id} onClick={() => setFocusSide(side.id)} style={{ position: "absolute", ...pos, zIndex: 2, border: focusSide === side.id ? `2px solid ${C.line}` : "1px solid #73797E", borderRadius: 8, padding: "4px 7px", background: C.asphalt, color: "#fff", fontFamily: "inherit", fontSize: 11, cursor: "pointer" }}>{pair && pair.valid ? `${fa(pair.actual)} cm` : side.short}</button>;
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                {CAR_SIDES.map((side) => {
                  const active = focusSide === side.id;
                  const pair = dimensionPairs.find((item) => item.id === side.id);
                  return (
                    <div key={side.id} onClick={() => setFocusSide(side.id)} style={{ border: `1px solid ${active ? C.line : C.border}`, borderRadius: 12, padding: "10px", background: active ? "#FDF6EA" : C.bg, cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <strong style={{ fontSize: 13 }}>{side.label}</strong>
                        {pair && pair.valid && <span style={{ fontSize: 11, color: pair.error <= 10 ? C.greenDark : pair.error <= 25 ? "#854F0B" : C.red }}>خطا {fa(pair.error)} cm</span>}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <label style={{ flex: 1, fontSize: 10, color: C.sub }}>حدس
                          <input inputMode="numeric" type="number" min="0" value={dimensions[`${side.id}Estimate`]} onChange={(e) => setDimensions((d) => ({ ...d, [`${side.id}Estimate`]: e.target.value }))} onFocus={() => setFocusSide(side.id)} placeholder="cm" style={{ marginTop: 4, width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 5px", fontFamily: "inherit", fontSize: 13, textAlign: "center", background: C.card }} />
                        </label>
                        <label style={{ flex: 1, fontSize: 10, color: C.sub }}>واقعی
                          <input inputMode="numeric" type="number" min="0" value={dimensions[`${side.id}Actual`]} onChange={(e) => setDimensions((d) => ({ ...d, [`${side.id}Actual`]: e.target.value }))} onFocus={() => setFocusSide(side.id)} placeholder="cm" style={{ marginTop: 4, width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 5px", fontFamily: "inherit", fontSize: 13, textAlign: "center", background: C.card }} />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              {averageDimensionError !== null && <div style={{ marginTop: 12, borderRadius: 10, padding: "10px 12px", background: averageDimensionError <= 10 ? C.greenBg : averageDimensionError <= 25 ? "#FAEEDA" : "#FAECE7", color: averageDimensionError <= 10 ? C.greenDark : averageDimensionError <= 25 ? "#854F0B" : C.red, fontSize: 13 }}>میانگین خطای این تمرین: <strong>{fa(averageDimensionError)} سانتی‌متر</strong>{averageDimensionError <= 10 ? " — درک ابعادت دقیق شده." : " — با تکرار، این عدد کوچک‌تر می‌شود."}</div>}
              <button onClick={saveDimensionPractice} style={{ marginTop: 12, width: "100%", background: C.green, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>ثبت نتیجهٔ تمرین</button>
              {dimensionNote && <p style={{ margin: "8px 0 0", textAlign: "center", color: dimensionNote.includes("حداقل") ? C.red : C.greenDark, fontSize: 12 }}>{dimensionNote}</p>}
            </div>

            <div style={{ background: "#FDF6EA", border: "1px solid #F0DCB4", borderRadius: 14, padding: "12px 15px", marginBottom: 12, fontSize: 12, lineHeight: 1.9, color: "#6B4A16" }}><strong>تمرین امن:</strong> از بطری آب یا مخروط نرم به‌عنوان مانع استفاده کن. خودرو خاموش، ترمز دستی فعال و محل کاملاً امن باشد. هرگز هنگام حرکت با گوشی کار نکن.</div>

            {dimensionLogs.length > 0 && <p style={{ margin: "16px 4px 8px", fontSize: 14, fontWeight: 700 }}>تاریخچهٔ دقت من</p>}
            {dimensionLogs.map((entry) => (
              <div key={entry.ts} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div><p style={{ margin: 0, fontSize: 12, color: C.sub }}>{entry.d}{entry.exercise ? ` · ${entry.exercise}` : ""}</p><p style={{ margin: "2px 0 0", fontSize: 14 }}>میانگین خطا: <strong style={{ color: entry.averageError <= 10 ? C.greenDark : entry.averageError <= 25 ? "#854F0B" : C.red }}>{fa(entry.averageError)} سانتی‌متر</strong></p></div>
                  <button onClick={() => removeDimensionLog(entry.ts)} aria-label="حذف نتیجه" style={{ background: "none", border: "none", color: "#A6ABAF", cursor: "pointer", fontFamily: "inherit", fontSize: 18 }}>×</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>{entry.pairs.map((pair) => <span key={pair.id} style={{ fontSize: 11, color: C.sub, background: C.bg, borderRadius: 7, padding: "4px 7px" }}>{pair.short}: {fa(pair.estimate)}←{fa(pair.actual)} cm</span>)}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "plan" && SECTIONS.map((s) => {
          const dn = s.items.filter((_, i) => checks[s.id + "_" + i]).length;
          const all = dn === s.items.length;
          return (
            <div key={s.id} style={{ background: C.card, border: `1px solid ${all ? C.green : C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, opacity: all ? 0.8 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  background: s.rules ? "#F5EBDB" : all ? C.greenBg : "#EDEEF0",
                  color: s.rules ? "#854F0B" : all ? C.greenDark : C.sub,
                  whiteSpace: "nowrap",
                }}>{all && !s.rules ? "✓ " + s.tag : s.tag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{s.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{s.sub}</p>
                </div>
                <span style={{ fontSize: 12, color: all ? C.greenDark : C.sub }}>{fa(dn)}/{fa(s.items.length)}</span>
              </div>
              {s.items.map((t, i) => {
                const k = s.id + "_" + i;
                const c = !!checks[k];
                return (
                  <label key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", cursor: "pointer", borderTop: `1px solid ${C.bg}` }}>
                    <span
                      onClick={(e) => { e.preventDefault(); toggle(k); }}
                      style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
                        border: c ? `2px solid ${C.green}` : `2px solid #C6CACD`,
                        background: c ? C.green : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 13, fontWeight: 700, transition: "all .15s",
                      }}
                    >{c ? "✓" : ""}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.7, color: c ? "#A6ABAF" : C.text, textDecoration: c ? "line-through" : "none" }}>{t}</span>
                  </label>
                );
              })}
              {s.goal && (
                <div style={{ marginTop: 8, background: C.greenBg, color: C.greenDark, borderRadius: 10, padding: "8px 12px", fontSize: 13 }}>
                  معیار پایان هفته: {s.goal}
                </div>
              )}
            </div>
          );
        })}

        {tab === "quotes" && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12, display: "flex", gap: 8 }}>
              <input
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQuote()}
                placeholder="جمله‌ای که بهت قدرت می‌ده رو اینجا بنویس"
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "inherit", fontSize: 14, background: "transparent", color: C.text }}
              />
              <button
                onClick={addQuote}
                style={{ background: C.asphalt, color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >افزودن</button>
            </div>
            {quotes.map((q, i) => (
              <div key={i} style={{
                background: q.mine ? "#FDF6EA" : C.card,
                border: `1px solid ${q.mine ? "#F0DCB4" : C.border}`,
                borderRadius: 14, padding: "13px 16px", marginBottom: 8,
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ color: C.line, fontFamily: "Lalezar", fontSize: 20, lineHeight: 1 }}>«</span>
                <p style={{ margin: 0, flex: 1, fontSize: 14, lineHeight: 1.9 }}>{q.t}</p>
                {q.mine && (
                  <button onClick={() => removeQuote(i)} aria-label="حذف جمله" style={{ background: "none", border: "none", color: "#C6CACD", cursor: "pointer", fontSize: 16, padding: 0, fontFamily: "inherit" }}>×</button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "log" && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700 }}>بعد از هر جلسه، همینجا ثبت کن</p>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: C.sub }}>عدد ترس این جلسه از ۰ تا ۱۰ چند بود؟</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <input type="range" min="0" max="10" step="1" value={fear} onChange={(e) => setFear(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontFamily: "Lalezar", fontSize: 26, color: fear >= 7 ? C.red : fear >= 4 ? "#BA7517" : C.greenDark, minWidth: 30, textAlign: "center" }}>{fa(fear)}</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="دو خط: امروز چیکار کردم؟"
                rows={2}
                style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontFamily: "inherit", fontSize: 14, resize: "vertical", outline: "none", background: C.bg, color: C.text }}
              />
              <button
                onClick={addLog}
                style={{ marginTop: 10, width: "100%", background: C.green, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >ثبت این جلسه</button>
            </div>

            {logs.length > 1 && firstFear !== null && (
              <div style={{ background: C.greenBg, borderRadius: 14, padding: "12px 16px", marginBottom: 12, fontSize: 13, color: C.greenDark, lineHeight: 1.8 }}>
                اولین جلسه ترست {fa(firstFear)} بود، آخرین جلسه {fa(lastFear)}.
                {lastFear < firstFear ? " این سنده. مغزت نمی‌تونه انکارش کنه." : " عدد هنوز پایین نیومده و این طبیعیه — ادامه بده، عدد بین هفته ۴ تا ۶ می‌شکنه."}
              </div>
            )}

            {logs.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 20px", color: C.sub, fontSize: 14, lineHeight: 2 }}>
                هنوز هیچ جلسه‌ای ثبت نشده.<br />اولین ثبت، اولین سند.
              </div>
            )}

            {logs.map((l, i) => (
              <div key={l.ts || i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "Lalezar", fontSize: 20, width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: l.fear >= 7 ? "#FAECE7" : l.fear >= 4 ? "#FAEEDA" : C.greenBg,
                  color: l.fear >= 7 ? C.red : l.fear >= 4 ? "#854F0B" : C.greenDark,
                }}>{fa(l.fear)}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{l.d}</p>
                  {l.note && <p style={{ margin: "2px 0 0", fontSize: 14, lineHeight: 1.7 }}>{l.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
