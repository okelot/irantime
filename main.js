import './style.css'
import jalaali from 'jalaali-js'
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan'
import { SOLAR_EVENTS, LUNAR_EVENTS } from './events.js'

// --- Constants & State ---
const state = {
  currentTab: 'shamsi-to-gregorian', // 'shamsi-to-gregorian' or 'gregorian-to-shamsi'
};

const IRAN_TZ = 'Asia/Tehran';

// Cache Intl formatters once (rebuilding them every tick is wasteful).
const fmt = {
  time: new Intl.DateTimeFormat('fa-IR', {
    timeZone: IRAN_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }),
  weekday: new Intl.DateTimeFormat('fa-IR', { timeZone: IRAN_TZ, weekday: 'long' }),
  gregorian: new Intl.DateTimeFormat('fa-IR-u-ca-gregory', {
    timeZone: IRAN_TZ, year: 'numeric', month: 'long', day: 'numeric',
  }),
  hijri: new Intl.DateTimeFormat('fa-IR-u-ca-islamic-civil', {
    timeZone: IRAN_TZ, year: 'numeric', month: 'long', day: 'numeric',
  }),
  // Numeric Gregorian parts (in Tehran wall-clock) for accurate Jalali conversion.
  tehranParts: new Intl.DateTimeFormat('en-CA', {
    timeZone: IRAN_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }),
  // Numeric Hijri parts (for matching lunar occasions).
  hijriParts: new Intl.DateTimeFormat('en-US-u-ca-islamic-civil', {
    timeZone: IRAN_TZ, year: 'numeric', month: 'numeric', day: 'numeric',
  }),
};

// Gregorian Y/M/D as seen on Tehran's clock, independent of the visitor's timezone.
const getTehranYmd = (date) => {
  const parts = fmt.tehranParts.formatToParts(date);
  const get = (type) => parseInt(parts.find((p) => p.type === type).value, 10);
  return { y: get('year'), m: get('month'), d: get('day') };
};

// Hijri month/day in Tehran, for matching lunar occasions.
const getTehranHijri = (date) => {
  const parts = fmt.hijriParts.formatToParts(date);
  const get = (type) => parseInt(parts.find((p) => p.type === type).value, 10);
  return { m: get('month'), d: get('day') };
};

// --- DOM Elements ---
const digitalClockEl = document.getElementById('digital-clock');
const shamsiDateEl = document.getElementById('shamsi-date');
const gregorianDateEl = document.getElementById('gregorian-date');
const hijriDateEl = document.getElementById('hijri-date');

const yearInput = document.getElementById('year-input');
const monthInput = document.getElementById('month-input');
const dayInput = document.getElementById('day-input');
const convertBtn = document.getElementById('convert-btn');
const conversionResult = document.getElementById('conversion-result');
// Updated selector for new design
const tabs = document.querySelectorAll('.tab-pill');

// --- Helper Functions ---

// Persian Number Converter
const toPersianDigits = (num) => {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};

// Get Month Name (Shamsi)
const getShamsiMonthName = (monthIndex) => { // 1-based
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  return months[monthIndex - 1];
};

// --- World Clock ---
// Iran has no DST (fixed UTC+3:30); these zones cover the largest diaspora hubs.
const WORLD_CITIES = [
  { name: 'لس‌آنجلس', flag: '🇺🇸', tz: 'America/Los_Angeles' },
  { name: 'تورنتو', flag: '🇨🇦', tz: 'America/Toronto' },
  { name: 'لندن', flag: '🇬🇧', tz: 'Europe/London' },
  { name: 'دبی', flag: '🇦🇪', tz: 'Asia/Dubai' },
  { name: 'سیدنی', flag: '🇦🇺', tz: 'Australia/Sydney' },
];

const worldGridEl = document.getElementById('world-grid');
const worldFmt = WORLD_CITIES.map((c) => ({
  ...c,
  fmt: new Intl.DateTimeFormat('fa-IR', {
    timeZone: c.tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }),
}));

const buildWorldClock = () => {
  worldGridEl.innerHTML = worldFmt
    .map(
      (c) => `
      <div class="world-item">
        <span class="world-flag">${c.flag}</span>
        <span class="world-name">${c.name}</span>
        <span class="world-time" data-tz="${c.tz}">--:--</span>
      </div>`
    )
    .join('');
};

const updateWorldClock = () => {
  const now = new Date();
  worldFmt.forEach((c) => {
    const el = worldGridEl.querySelector(`[data-tz="${c.tz}"]`);
    if (el) el.textContent = c.fmt.format(now);
  });
};

// --- Nowruz Countdown ---
const cdDaysEl = document.getElementById('cd-days');
const cdHoursEl = document.getElementById('cd-hours');
const cdMinsEl = document.getElementById('cd-mins');
const cdSecsEl = document.getElementById('cd-secs');
const nowruzTargetEl = document.getElementById('nowruz-target');

// Next Nowruz = 1 Farvardin of the next Jalali year, at Tehran midnight (UTC+3:30).
const getNextNowruz = () => {
  const { y, m, d } = getTehranYmd(new Date());
  const jNow = jalaali.toJalaali(y, m, d);
  const g = jalaali.toGregorian(jNow.jy + 1, 1, 1);
  const tehranMidnightUTC = Date.UTC(g.gy, g.gm - 1, g.gd, 0, 0, 0) - 3.5 * 3600 * 1000;
  return { date: new Date(tehranMidnightUTC), jy: jNow.jy + 1 };
};

let nowruz = getNextNowruz();
nowruzTargetEl.textContent = `آغاز سال ${toPersianDigits(nowruz.jy)}`;

const pad2 = (n) => toPersianDigits(String(n).padStart(2, '0'));

const updateCountdown = () => {
  let diff = nowruz.date.getTime() - Date.now();
  if (diff <= 0) {
    nowruz = getNextNowruz(); // roll over once Nowruz arrives
    nowruzTargetEl.textContent = `آغاز سال ${toPersianDigits(nowruz.jy)}`;
    diff = nowruz.date.getTime() - Date.now();
  }
  const totalSec = Math.floor(diff / 1000);
  cdDaysEl.textContent = toPersianDigits(Math.floor(totalSec / 86400));
  cdHoursEl.textContent = pad2(Math.floor((totalSec % 86400) / 3600));
  cdMinsEl.textContent = pad2(Math.floor((totalSec % 3600) / 60));
  cdSecsEl.textContent = pad2(totalSec % 60);
};

// --- Clock & Date Logic ---

const updateClock = () => {
  digitalClockEl.textContent = fmt.time.format(new Date());
};

const updateDates = () => {
  const now = new Date();

  // 1. Shamsi Date — derived from Tehran's wall-clock date, not the visitor's.
  const { y, m, d } = getTehranYmd(now);
  const jDate = jalaali.toJalaali(y, m, d);
  const weekday = fmt.weekday.format(now);
  shamsiDateEl.textContent =
    `${weekday}، ${toPersianDigits(jDate.jd)} ${getShamsiMonthName(jDate.jm)} ${toPersianDigits(jDate.jy)}`;

  // 2. Gregorian Date
  gregorianDateEl.textContent = fmt.gregorian.format(now);

  // 3. Hijri Date (Islamic)
  hijriDateEl.textContent = fmt.hijri.format(now);
};

// --- Converter Logic ---

const handleTabSwitch = (e) => {
  const type = e.target.dataset.type;
  if (!type) return; 
  
  state.currentTab = type;
  
  // Update Tabs UI
  tabs.forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  
  // Reset Input Placeholders & Values
  if (type === 'shamsi-to-gregorian') {
    yearInput.placeholder = 'سال شمسی (مثلاً ۱۴۰۳)';
    updateMonthOptions('shamsi');
    
    // Set default values to today (Tehran)
    const ymd = getTehranYmd(new Date());
    const jToday = jalaali.toJalaali(ymd.y, ymd.m, ymd.d);
    yearInput.value = jToday.jy;
    monthInput.value = jToday.jm;
    dayInput.value = jToday.jd;

  } else {
    yearInput.placeholder = 'سال میلادی (مثلاً ۲۰۲۴)';
    updateMonthOptions('gregorian');

    // Set default values to today (Tehran)
    const ymd = getTehranYmd(new Date());
    yearInput.value = ymd.y;
    monthInput.value = ymd.m;
    dayInput.value = ymd.d;
  }
  
  conversionResult.classList.add('hidden');
};

const updateMonthOptions = (calendarType) => {
  monthInput.innerHTML = '';
  const shamsiMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  const gregorianMonths = [
    'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
    'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
  ];
  
  const targetMonths = calendarType === 'shamsi' ? shamsiMonths : gregorianMonths;
  
  targetMonths.forEach((name, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = name;
    monthInput.appendChild(option);
  });
};

const handleConvert = () => {
  const y = parseInt(yearInput.value);
  const m = parseInt(monthInput.value);
  const d = parseInt(dayInput.value);
  
  if (!y || !m || !d) {
    alert('لطفا تاریخ معتبر وارد کنید');
    return;
  }
  
  let resultHtml = '';
  
  if (state.currentTab === 'shamsi-to-gregorian') {
    // Convert Shamsi to Gregorian
    try {
      const gDate = jalaali.toGregorian(y, m, d);
      const dateObj = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = new Intl.DateTimeFormat('fa-IR', options).format(dateObj);
      
      resultHtml = `
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem">تاریخ میلادی:</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: white;">${formatted}</div>
        <div style="font-size: 1rem; color: var(--accent-secondary); direction: ltr; margin-top: 0.2rem">(${gDate.gy}/${gDate.gm}/${gDate.gd})</div>
      `;
    } catch (e) {
      resultHtml = '<span style="color: #ef4444">تاریخ نامعتبر است</span>';
    }
  } else {
    // Convert Gregorian to Shamsi
    try {
      const jDate = jalaali.toJalaali(y, m, d);
      const formatted = `${toPersianDigits(jDate.jd)} ${getShamsiMonthName(jDate.jm)} ${toPersianDigits(jDate.jy)}`;
      
      resultHtml = `
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem">تاریخ شمسی:</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: white;">${formatted}</div>
        <div style="font-size: 1rem; color: var(--accent-secondary); direction: ltr; margin-top: 0.2rem">(${toPersianDigits(jDate.jy)}/${toPersianDigits(jDate.jm)}/${toPersianDigits(jDate.jd)})</div>
      `;
    } catch (e) {
      resultHtml = '<span style="color: #ef4444">تاریخ نامعتبر است</span>';
    }
  }
  
  conversionResult.innerHTML = resultHtml;
  conversionResult.classList.remove('hidden');
};

// --- Today's Occasions ---
const occasionsListEl = document.getElementById('occasions-list');
const occasionsDateEl = document.getElementById('occasions-date');

const renderOccasions = () => {
  const now = new Date();
  const { y, m, d } = getTehranYmd(now);
  const j = jalaali.toJalaali(y, m, d);
  const h = getTehranHijri(now);

  occasionsDateEl.textContent =
    `${toPersianDigits(j.jd)} ${getShamsiMonthName(j.jm)} ${toPersianDigits(j.jy)}`;

  const solar = (SOLAR_EVENTS[`${j.jm}/${j.jd}`] || []).map((e) => ({ ...e, lunar: false }));
  const lunar = (LUNAR_EVENTS[`${h.m}/${h.d}`] || []).map((e) => ({ ...e, lunar: true }));
  const events = [...solar, ...lunar];

  const isHoliday = events.some((e) => e.holiday);
  if (events.length === 0) {
    occasionsListEl.innerHTML =
      '<p class="occasions-empty">مناسبت خاصی برای امروز ثبت نشده است.</p>';
    return;
  }

  occasionsListEl.innerHTML = events
    .map(
      (e) => `
      <div class="occasion-item${e.holiday ? ' holiday' : ''}">
        <span class="occasion-dot"></span>
        <span class="occasion-title">${e.title}</span>
        ${e.holiday ? '<span class="occasion-badge">تعطیل رسمی</span>' : ''}
        ${e.lunar ? '<span class="occasion-cal">قمری</span>' : ''}
      </div>`
    )
    .join('') +
    (lunar.length
      ? '<p class="occasions-note">* تاریخ مناسبت‌های قمری ممکن است یک روز اختلاف داشته باشد.</p>'
      : '');

  if (isHoliday) occasionsListEl.classList.add('has-holiday');
  else occasionsListEl.classList.remove('has-holiday');
};

// --- Prayer Times ---
const prayerGridEl = document.getElementById('prayer-grid');
const prayerLocationEl = document.getElementById('prayer-location');
const prayerLocateBtn = document.getElementById('prayer-locate-btn');

const PRAYERS = [
  { key: 'fajr', label: 'اذان صبح' },
  { key: 'sunrise', label: 'طلوع آفتاب' },
  { key: 'dhuhr', label: 'اذان ظهر' },
  { key: 'asr', label: 'اذان عصر' },
  { key: 'maghrib', label: 'اذان مغرب' },
  { key: 'isha', label: 'اذان عشاء' },
];

const renderPrayerTimes = (lat, lng, label, tz) => {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.Tehran();
  const times = new PrayerTimes(coordinates, new Date(), params);
  const timeFmt = new Intl.DateTimeFormat('fa-IR', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  });

  prayerLocationEl.textContent = label;
  prayerGridEl.innerHTML = PRAYERS.map(
    (p) => `
      <div class="prayer-item">
        <span class="prayer-label">${p.label}</span>
        <span class="prayer-time">${timeFmt.format(times[p.key])}</span>
      </div>`
  ).join('');
};

// Default to Tehran; let the user opt into their own location.
const showTehranPrayer = () =>
  renderPrayerTimes(35.6892, 51.389, 'تهران، ایران', IRAN_TZ);

const locateAndShowPrayer = () => {
  if (!navigator.geolocation) {
    showTehranPrayer();
    return;
  }
  prayerLocationEl.textContent = 'در حال تعیین موقعیت...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || IRAN_TZ;
      renderPrayerTimes(pos.coords.latitude, pos.coords.longitude, 'موقعیت شما', tz);
    },
    () => {
      prayerLocationEl.textContent = 'دسترسی به موقعیت ممکن نشد — نمایش اوقات تهران';
      showTehranPrayer();
    },
    { timeout: 8000 }
  );
};

// --- Initialization ---

// Set initial clock
updateClock();
updateDates();
buildWorldClock();
updateWorldClock();
updateCountdown();
renderOccasions();
showTehranPrayer();

// Set initial helper values (Tehran today)
const initialYmd = getTehranYmd(new Date());
const initialJDate = jalaali.toJalaali(initialYmd.y, initialYmd.m, initialYmd.d);
yearInput.value = initialJDate.jy;
monthInput.value = initialJDate.jm;
dayInput.value = initialJDate.jd;
updateMonthOptions('shamsi');

// Intervals
setInterval(() => {
  updateClock();
  updateWorldClock();
  updateCountdown();
}, 1000);
// Update dates & occasions every minute to stay accurate
setInterval(() => {
  updateDates();
  renderOccasions();
}, 60000);

// Event Listeners
tabs.forEach(tab => tab.addEventListener('click', handleTabSwitch));
convertBtn.addEventListener('click', handleConvert);
prayerLocateBtn.addEventListener('click', locateAndShowPrayer);
