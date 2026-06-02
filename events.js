// Persian-calendar occasions ("مناسبت‌ها").
//
// SOLAR_EVENTS are keyed by Jalali month/day and are fixed every year.
// `holiday: true` marks an official public holiday in Iran.
//
// LUNAR_EVENTS are keyed by Islamic (Hijri) month/day. Because the lunar
// calendar drifts against the solar year and Iran fixes religious holidays by
// moon sighting, these dates are approximate (±1 day) when matched against the
// Intl `islamic-civil` calendar — the UI notes this.

export const SOLAR_EVENTS = {
  // Farvardin
  '1/1': [{ title: 'آغاز نوروز و سال نو', holiday: true }],
  '1/2': [{ title: 'عید نوروز', holiday: true }],
  '1/3': [{ title: 'عید نوروز', holiday: true }],
  '1/4': [{ title: 'عید نوروز', holiday: true }],
  '1/12': [{ title: 'روز جمهوری اسلامی ایران', holiday: true }],
  '1/13': [{ title: 'روز طبیعت (سیزده‌بدر)', holiday: true }],
  // Ordibehesht
  '2/2': [{ title: 'روز زمین پاک' }],
  '2/10': [{ title: 'روز ملی خلیج فارس' }],
  '2/25': [{ title: 'روز بزرگداشت فردوسی' }],
  // Khordad
  '3/14': [{ title: 'رحلت امام خمینی (ره)', holiday: true }],
  '3/15': [{ title: 'قیام ۱۵ خرداد', holiday: true }],
  // Tir
  '4/10': [{ title: 'روز صنعت و معدن' }],
  // Mordad
  '5/14': [{ title: 'روز مشروطیت' }],
  // Shahrivar
  '6/31': [{ title: 'روز ملی شعر و ادب فارسی (بزرگداشت شهریار)' }],
  // Mehr
  '7/8': [{ title: 'روز بزرگداشت مولوی' }],
  '7/13': [{ title: 'روز نیروی انتظامی' }],
  '7/20': [{ title: 'روز بزرگداشت حافظ' }],
  // Aban
  '8/13': [{ title: 'روز ملی مبارزه با استکبار جهانی' }],
  '8/24': [{ title: 'روز کتاب و کتاب‌خوانی' }],
  // Azar
  '9/7': [{ title: 'روز نیروی دریایی' }],
  '9/30': [{ title: 'شب یلدا (چله)' }],
  // Dey
  '10/5': [{ title: 'روز ایمنی در برابر زلزله' }],
  // Bahman
  '11/12': [{ title: 'بازگشت امام خمینی به ایران (آغاز دهه فجر)' }],
  '11/19': [{ title: 'روز نیروی هوایی' }],
  '11/22': [{ title: 'پیروزی انقلاب اسلامی', holiday: true }],
  // Esfand
  '12/5': [{ title: 'روز بزرگداشت خواجه نصیرالدین طوسی (روز مهندس)' }],
  '12/15': [{ title: 'روز درختکاری' }],
  '12/29': [{ title: 'روز ملی شدن صنعت نفت', holiday: true }],
};

export const LUNAR_EVENTS = {
  '1/9': [{ title: 'تاسوعای حسینی', holiday: true }],
  '1/10': [{ title: 'عاشورای حسینی', holiday: true }],
  '2/20': [{ title: 'اربعین حسینی', holiday: true }],
  '2/28': [{ title: 'رحلت پیامبر اکرم (ص) و شهادت امام حسن مجتبی (ع)', holiday: true }],
  '2/29': [{ title: 'شهادت امام رضا (ع)', holiday: true }],
  '3/8': [{ title: 'شهادت امام حسن عسکری (ع)', holiday: true }],
  '3/17': [{ title: 'میلاد پیامبر اکرم (ص) و امام جعفر صادق (ع)', holiday: true }],
  '6/3': [{ title: 'شهادت حضرت فاطمه زهرا (س)', holiday: true }],
  '7/13': [{ title: 'ولادت امام علی (ع) و روز پدر' }],
  '9/1': [{ title: 'آغاز ماه مبارک رمضان' }],
  '9/21': [{ title: 'شهادت حضرت علی (ع)', holiday: true }],
  '10/1': [{ title: 'عید سعید فطر', holiday: true }],
  '10/2': [{ title: 'تعطیل به مناسبت عید فطر', holiday: true }],
  '10/25': [{ title: 'شهادت امام جعفر صادق (ع)', holiday: true }],
  '12/10': [{ title: 'عید سعید قربان', holiday: true }],
  '12/18': [{ title: 'عید سعید غدیر خم', holiday: true }],
};
