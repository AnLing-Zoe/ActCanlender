import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const APP_PATH = resolve(ROOT, "app.js");
const DATA_PATH = resolve(ROOT, "data/events.js");
const PAGE_SIZE = 10;
const TODAY = startOfToday();
const ONE_YEAR_LATER = new Date(TODAY);
ONE_YEAR_LATER.setFullYear(ONE_YEAR_LATER.getFullYear() + 1);

const SOURCE_CONFIGS = [
  {
    name: "運動筆記",
    type: "run",
    url: "https://running.biji.co/index.php?q=competition"
  },
  {
    name: "台灣路跑協會",
    type: "run",
    url: "https://www.sportsnet.org.tw/online_reg.php"
  },
  {
    name: "伊貝特報名網",
    type: "run",
    url: "https://bao-ming.com/"
  }
];

const ANNUAL_SWIM_EVENTS = [
  {
    id: "swim-2026-sun-moon-lake",
    type: "swim",
    name: "日月潭國際萬人泳渡",
    startDate: "2026-09-27",
    registrationEnd: "",
    city: "南投縣",
    sourceName: "泳渡活動",
    sourceUrl: "https://www.sunmoonlake.gov.tw/"
  },
  {
    id: "swim-2026-penghu",
    type: "swim",
    name: "澎湖泳渡",
    startDate: "2026-08-16",
    registrationEnd: "",
    city: "澎湖縣",
    sourceName: "泳渡活動",
    sourceUrl: "https://www.penghu.gov.tw/"
  }
];

const CITY_NAMES = [
  "臺北市",
  "台北市",
  "新北市",
  "桃園市",
  "臺中市",
  "台中市",
  "臺南市",
  "台南市",
  "高雄市",
  "基隆市",
  "新竹市",
  "嘉義市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "臺東縣",
  "台東縣",
  "澎湖縣",
  "金門縣",
  "連江縣"
];

const EVENT_KEYWORDS = /馬拉松|路跑|健走|越野|超馬|半程|接力|RUN|Run|run|Trail|trail|泳渡|長泳|海泳/;

async function main() {
  const fallbackEvents = await loadFallbackEvents();
  const fetchedEvents = await fetchAllSources();
  const merged = dedupeEvents([...fallbackEvents, ...fetchedEvents, ...ANNUAL_SWIM_EVENTS]);
  const sorted = merged.sort((a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name, "zh-Hant"));

  await writeDataFile(sorted);

  const listedCount = sorted.filter((event) => event.type === "swim" || event.registrationEnd).length;
  console.log(`Wrote ${sorted.length} unique events to data/events.js.`);
  console.log(`Current page estimate: ${Math.max(1, Math.ceil(listedCount / PAGE_SIZE))} pages at ${PAGE_SIZE} events per page.`);
}

async function loadFallbackEvents() {
  const appJs = await readFile(APP_PATH, "utf8");
  const match = appJs.match(/const fallbackEvents = (\[[\s\S]*?\n\]);\n\nconst externalEvents/);

  if (!match) {
    throw new Error("Cannot find fallbackEvents in app.js.");
  }

  return vm.runInNewContext(match[1]);
}

async function fetchAllSources() {
  const batches = await Promise.all(SOURCE_CONFIGS.map((source) => fetchSource(source)));
  return batches.flat();
}

async function fetchSource(source) {
  try {
    const html = await fetchText(source.url);
    const candidates = parseEventsFromHtml(html, source);
    const events = candidates.filter(isHighConfidenceFetchedEvent);
    console.log(`${source.name}: parsed ${candidates.length} candidates, accepted ${events.length}.`);
    return events;
  } catch (error) {
    console.warn(`${source.name}: fetch skipped (${error.message}).`);
    return [];
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "ActivityCalendarBot/1.0 (+https://github.com/)"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const bytes = new Uint8Array(await response.arrayBuffer());
    const charset = contentType.match(/charset=([^;\s]+)/i)?.[1] || detectCharset(bytes);
    const decoder = new TextDecoder(normalizeCharset(charset), { fatal: false });
    return decoder.decode(bytes);
  } finally {
    clearTimeout(timeout);
  }
}

function detectCharset(bytes) {
  const preview = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 4096));
  return preview.match(/<meta[^>]+charset=["']?([^"'>\s]+)/i)?.[1] || "utf-8";
}

function normalizeCharset(charset) {
  return /big5|950/i.test(charset) ? "big5" : "utf-8";
}

function parseEventsFromHtml(html, source) {
  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const events = [];

  anchors.forEach((anchor) => {
    const name = normalizeText(stripTags(anchor[2]));
    if (!isLikelyEventName(name, source.type)) {
      return;
    }

    const nearbyHtml = html.slice(Math.max(0, anchor.index - 1500), anchor.index + 2200);
    const dates = extractDatesWithContext(nearbyHtml);
    const startDate = chooseStartDate(dates);
    if (!startDate) {
      return;
    }

    const city = extractCity(nearbyHtml) || "";
    const sourceUrl = absolutizeUrl(anchor[1], source.url);
    const registrationEnd = chooseRegistrationEnd(dates, startDate);

    events.push({
      id: buildStableId(source.type, startDate, city, name),
      type: source.type,
      name,
      startDate,
      registrationEnd,
      city,
      sourceName: source.name,
      sourceUrl
    });
  });

  return dedupeEvents(events);
}

function isLikelyEventName(name, type) {
  if (name.length < 6 || name.length > 80) {
    return false;
  }

  if (/更多|詳細|報名|登入|查詢|下載|facebook|instagram|LINE/i.test(name)) {
    return false;
  }

  return type === "swim" ? /泳渡|長泳|海泳/.test(name) : EVENT_KEYWORDS.test(name);
}

function extractDatesWithContext(html) {
  const text = normalizeText(stripTags(html));
  const matches = [...text.matchAll(/(?:20\d{2}|民國\s*1\d{2})[./\-\s年]+([01]?\d)[./\-\s月]+([0-3]?\d)日?/g)];

  return matches
    .map((match) => {
      const raw = match[0];
      const yearMatch = raw.match(/20\d{2}|1\d{2}/);
      const year = yearMatch[0].length === 3 ? Number(yearMatch[0]) + 1911 : Number(yearMatch[0]);
      const month = Number(match[1]);
      const day = Number(match[2]);

      if (!isValidDateParts(year, month, day)) {
        return null;
      }

      return {
        value: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        context: text.slice(Math.max(0, match.index - 26), match.index + raw.length + 26)
      };
    })
    .filter(Boolean);
}

function chooseStartDate(dates) {
  const eventDate = dates.find((date) => /活動|賽事|比賽|競賽|日期|起跑|開跑/.test(date.context) && !/報名|截止|期限/.test(date.context));
  return eventDate?.value || dates[0]?.value || "";
}

function chooseRegistrationEnd(dates, startDate) {
  const deadline = dates.find((date) => /報名截止|截止日期|報名期限|報名至|報名時間|報名日期/.test(date.context) && date.value < startDate);
  return deadline?.value || "";
}

function extractCity(html) {
  const text = normalizeText(stripTags(html)).replaceAll("台", "臺");
  return CITY_NAMES.map((city) => city.replaceAll("台", "臺")).find((city) => text.includes(city)) || "";
}

function absolutizeUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidDateParts(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function dedupeEvents(items) {
  return items.reduce((uniqueEvents, event) => {
    if (!event.name || !event.startDate) {
      return uniqueEvents;
    }

    const normalizedEvent = withSource(event);
    const duplicate = uniqueEvents.find((candidate) => isDuplicateEvent(candidate, normalizedEvent));

    if (!duplicate) {
      uniqueEvents.push(normalizedEvent);
      return uniqueEvents;
    }

    normalizedEvent.sourceNames.forEach((sourceName) => {
      if (!duplicate.sourceNames.includes(sourceName)) {
        duplicate.sourceNames.push(sourceName);
      }
    });

    normalizedEvent.sourceUrls.forEach((sourceUrl) => {
      if (sourceUrl && !duplicate.sourceUrls.includes(sourceUrl)) {
        duplicate.sourceUrls.push(sourceUrl);
      }
    });

    if (isBetterSourceUrl(normalizedEvent.sourceUrl, duplicate.sourceUrl)) {
      duplicate.sourceUrl = normalizedEvent.sourceUrl;
    }

    return uniqueEvents;
  }, []);
}

function withSource(event) {
  const sourceName = event.sourceName || "運動筆記";
  return {
    ...event,
    sourceName,
    sourceNames: event.sourceNames || [sourceName],
    sourceUrls: event.sourceUrls || (event.sourceUrl ? [event.sourceUrl] : [])
  };
}

function isDuplicateEvent(a, b) {
  const sameType = a.type === b.type;
  const sameDate = a.startDate === b.startDate;
  const closeDeadline = daysBetween(a.registrationEnd, b.registrationEnd) <= 3;
  return sameType && sameDate && closeDeadline && nameSimilarity(a.name, b.name) >= 0.72;
}

function isHighConfidenceFetchedEvent(event) {
  if (event.type !== "run") {
    return true;
  }

  if (!event.city || !event.registrationEnd) {
    return false;
  }

  const startDate = parseDate(event.startDate);
  const registrationEnd = parseDate(event.registrationEnd);
  return startDate >= TODAY && startDate <= ONE_YEAR_LATER && registrationEnd < startDate;
}

function nameSimilarity(a, b) {
  const first = normalizeName(a);
  const second = normalizeName(b);

  if (first === second) {
    return 1;
  }

  if (first.includes(second) || second.includes(first)) {
    return 0.9;
  }

  const firstBigrams = toBigrams(first);
  const secondBigrams = toBigrams(second);
  const secondSet = new Set(secondBigrams);
  const overlap = firstBigrams.filter((item) => secondSet.has(item)).length;
  return (2 * overlap) / Math.max(firstBigrams.length + secondBigrams.length, 1);
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[0-9０-９]{4}/g, "")
    .replace(/[第屆届盃杯賽活動年度年]/g, "")
    .replace(/marathon|running|trail|city|run/gi, "")
    .replace(/[^\p{Script=Han}a-z0-9]/gu, "");
}

function toBigrams(value) {
  const letters = [...value];
  if (letters.length <= 1) {
    return [value];
  }

  return letters.slice(0, -1).map((_, index) => letters.slice(index, index + 2).join(""));
}

function daysBetween(firstDate, secondDate) {
  if (!firstDate || !secondDate) {
    return firstDate === secondDate ? 0 : Number.POSITIVE_INFINITY;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.abs(parseDate(firstDate) - parseDate(secondDate)) / millisecondsPerDay;
}

function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00+08:00`);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function isBetterSourceUrl(candidate, current) {
  if (!candidate) {
    return false;
  }

  if (!current) {
    return true;
  }

  const genericPatterns = ["q=competition", "bao-ming.com/", "sportsnet.org.tw/"];
  const currentIsGeneric = genericPatterns.some((pattern) => current.endsWith(pattern) || current.includes(pattern));
  const candidateIsSpecific = candidate.includes("act=info") || candidate.includes("online_reg_rule") || candidate.includes("eb/content");
  return currentIsGeneric && candidateIsSpecific;
}

function buildStableId(type, startDate, city, name) {
  const slug = normalizeName(`${city}-${name}`).slice(0, 44) || "event";
  return `${type}-${startDate}-${slug}`;
}

async function writeDataFile(events) {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  const header = [
    "// This file is generated by scripts/update-events.mjs.",
    "// Manual edits can be overwritten by the scheduled GitHub Actions workflow.",
    `globalThis.ACTIVITY_EVENTS_UPDATED_AT = ${JSON.stringify(new Date().toISOString())};`,
    "globalThis.ACTIVITY_EVENTS = "
  ].join("\n");
  await writeFile(DATA_PATH, `${header}${JSON.stringify(events, null, 2)};\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
