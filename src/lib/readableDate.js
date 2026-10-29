/** One canonical date-display formatter; underlying research/model data stay ISO. */
const CHINESE_DIGITS = {一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};
const ENGLISH_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function chineseNumber(text) {
  if (text === '十') return 10;
  const m = /^([一二三])?十([一二三四五六七八九])?$/.exec(text);
  if (m) return (m[1] ? CHINESE_DIGITS[m[1]] : 1)*10 + (m[2] ? CHINESE_DIGITS[m[2]] : 0);
  return CHINESE_DIGITS[text] ?? NaN;
}

function validDate(year,month,day) {
  if (month<1 || month>12 || day<1 || day>31) return false;
  const checkYear = year ?? 2000; // permit 2/29 when no year is supplied
  const d = new Date(Date.UTC(checkYear,month-1,day));
  return d.getUTCFullYear()===checkYear && d.getUTCMonth()===month-1 && d.getUTCDate()===day;
}

function printableDate(year,month,day,lang) {
  if (lang === 'en') return ENGLISH_MONTHS[month-1]+' '+day+(year==null?'':', '+year);
  return (year==null?'':year+' 年 ')+month+' 月 '+day+' 日';
}

/** Format a valid date while leaving unverified/partial source strings unchanged. */
export function humanDateText(value,lang='zh') {
  let result = value;
  // From English ISO into human Chinese or English. IDs and date-suffixed artifact
  // names are excluded, including YYYY-MM-DD.json, run-YYYY-MM-DD and datetime timestamps.
  result = result.replace(/(?<![A-Za-z0-9_/+.-])((?:19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(?![A-Za-z0-9_/-]|\.[A-Za-z0-9]{1,12})/g,
    (all,y,m,d) => validDate(Number(y),Number(m),Number(d))?
      printableDate(Number(y),Number(m),Number(d),lang):all
  );
  // Numeric CJK forms: 2026年10月14日, 10月14日, or uneven spacing.
  result = result.replace(/(?<![A-Za-z0-9_])(?:(\d{4})\s*年\s*)?(\d{1,2})\s*月\s*(\d{1,2})\s*日/g,
    (all,y,m,d) => validDate(y==null?null:Number(y),Number(m),Number(d))?
      printableDate(y==null?null:Number(y),Number(m),Number(d),lang):all
  );
  // Chinese word-number dates: 十月十四日, 十一月二十五日, etc.
  result = result.replace(/(十[一二]?|[一二三四五六七八九])月([一二三]?十[一二三四五六七八九]?|十|[一二三四五六七八九])日/g,
    (all,month,day) => {
      const mm=chineseNumber(month), dd=chineseNumber(day);
      return validDate(null,mm,dd) ? printableDate(null,mm,dd,lang) : all;
    }
  );
  return result;
}


/** @param {string} value @param {'zh'|'en'} [lang] */
export function humanYearMonth(value,lang='zh') {
  const m=/^((?:19|20)\d{2})-(0[1-9]|1[0-2])$/.exec(value);
  if(!m)return value;
  const year=Number(m[1]),month=Number(m[2]);
  return lang==='en'?ENGLISH_MONTHS[month-1]+' '+year:year+' 年 '+month+' 月';
}
