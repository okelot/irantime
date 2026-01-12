import './style.css'
import jalaali from 'jalaali-js'

// --- Constants & State ---
const state = {
  currentTab: 'shamsi-to-gregorian', // 'shamsi-to-gregorian' or 'gregorian-to-shamsi'
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

// Get Day of Week (Persian)
const getPersianWeekday = (date) => {
  const weekdays = [
    'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
  ];
  return weekdays[date.getDay()];
};

// --- Clock & Date Logic ---

const updateClock = () => {
  const now = new Date();
  
  // Iran Time Options
  const timeOptions = {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  const timeString = new Intl.DateTimeFormat('fa-IR', timeOptions).format(now);
  digitalClockEl.textContent = timeString; 
};

const updateDates = () => {
  const now = new Date();
  
  // 1. Shamsi Date
  const jDate = jalaali.toJalaali(now);
  const shamsiText = `${getPersianWeekday(now)}، ${toPersianDigits(jDate.jd)} ${getShamsiMonthName(jDate.jm)} ${toPersianDigits(jDate.jy)}`;
  shamsiDateEl.textContent = shamsiText;
  
  // 2. Gregorian Date
  // 2. Gregorian Date
  const gregorianTextCorrect = new Intl.DateTimeFormat('fa-IR-u-ca-gregory', { year: 'numeric', month: 'long', day: 'numeric' }).format(now);
  gregorianDateEl.textContent = gregorianTextCorrect;
  
  // 3. Hijri Date (Islamic)
  const hijriText = new Intl.DateTimeFormat('fa-IR-u-ca-islamic-civil', { year: 'numeric', month: 'long', day: 'numeric' }).format(now);
  hijriDateEl.textContent = hijriText;
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
    
    // Set default values to today
    const now = new Date();
    const jNow = jalaali.toJalaali(now);
    yearInput.value = jNow.jy;
    monthInput.value = jNow.jm;
    dayInput.value = jNow.jd;
    
  } else {
    yearInput.placeholder = 'سال میلادی (مثلاً ۲۰۲۴)';
    updateMonthOptions('gregorian');
    
    // Set default values to today
    const now = new Date();
    yearInput.value = now.getFullYear();
    monthInput.value = now.getMonth() + 1;
    dayInput.value = now.getDate();
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

// --- Initialization ---

// Set initial clock
updateClock();
updateDates();

// Set initial helper values
const initialJDate = jalaali.toJalaali(new Date());
yearInput.value = initialJDate.jy;
monthInput.value = initialJDate.jm;
dayInput.value = initialJDate.jd;
updateMonthOptions('shamsi'); 

// Intervals
setInterval(updateClock, 1000);
// Update dates every minute to stay accurate
setInterval(updateDates, 60000);

// Event Listeners
tabs.forEach(tab => tab.addEventListener('click', handleTabSwitch));
convertBtn.addEventListener('click', handleConvert);
