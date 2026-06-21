const TODAY = startOfToday();
const ONE_YEAR_LATER = new Date(TODAY);
ONE_YEAR_LATER.setFullYear(ONE_YEAR_LATER.getFullYear() + 1);

const FAVORITES_KEY = "activity-calendar-favorites";
const PAGE_SIZE = 10;

const fallbackEvents = [
  {
    id: "run-2026-father-mini",
    type: "run",
    name: "2026 Run For Dad 爸趣迷你馬拉松",
    startDate: "2026-08-02",
    registrationEnd: "2026-06-30",
    city: "彰化縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-yuelao",
    type: "run",
    name: "2026聖母廟月老姻緣紅線牽馬拉松",
    startDate: "2026-08-15",
    registrationEnd: "2026-07-15",
    city: "臺南市",
    sourceUrl:
      "https://running.biji.co/index.php?act=info&cid=12925&q=competition&subtitle=2026%E8%81%96%E6%AF%8D%E5%BB%9F%E6%9C%88%E8%80%81%E5%A7%BB%E7%B7%A3%E7%B4%85%E7%B7%9A%E7%89%BD%E9%A6%AC%E6%8B%89%E6%9D%BE"
  },
  {
    id: "run-2026-xinwu-rice-baby",
    type: "run",
    name: "2026新屋米寶親子路跑",
    startDate: "2026-08-22",
    registrationEnd: "2026-06-30",
    city: "桃園市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-wufeng-summer",
    type: "run",
    name: "夏日馬拉松 - 新竹五峰清泉場",
    startDate: "2026-08-22",
    registrationEnd: "2026-06-30",
    city: "新竹縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-hotdog-trail",
    type: "run",
    name: "2026 HOT DOG Trail 台中系列活動-熱血接力賽",
    startDate: "2026-08-30",
    registrationEnd: "2026-08-10",
    city: "臺中市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-taipei-city-run",
    type: "run",
    name: "2026 Panasonic Taipei City Run台北城市路跑賽",
    startDate: "2026-09-06",
    registrationEnd: "2026-07-09",
    city: "臺北市",
    sourceUrl:
      "https://running.biji.co/index.php?act=info&cid=13012&q=competition&subtitle=2026+Panasonic+Taipei+City+Run%E5%8F%B0%E5%8C%97%E5%9F%8E%E5%B8%82%E8%B7%AF%E8%B7%91%E8%B3%BD"
  },
  {
    id: "run-2026-dapumei",
    type: "run",
    name: "2026大埔美樂活路跑半程馬拉松",
    startDate: "2026-09-06",
    registrationEnd: "2026-07-30",
    city: "嘉義縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-fucheng-ultra",
    type: "run",
    name: "2026府城超級馬拉松",
    startDate: "2026-09-12",
    registrationEnd: "2026-08-14",
    city: "臺南市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-taian-forest",
    type: "run",
    name: "2026 第五屆泰安烏嘎彥原鄉秘境森林馬拉松",
    startDate: "2026-09-20",
    registrationEnd: "2026-07-03",
    city: "苗栗縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-sky-hunter",
    type: "run",
    name: "SKY HUNTER 鳳梨山繞圈賽",
    startDate: "2026-09-25",
    registrationEnd: "2026-08-31",
    city: "高雄市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-shancheng-night",
    type: "run",
    name: "2026 山城星光馬拉松",
    startDate: "2026-10-03",
    registrationEnd: "2026-07-26",
    city: "苗栗縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-tiankong-cup",
    type: "run",
    name: "2026 跑若飛天公盃路跑X健走大賽",
    startDate: "2026-10-03",
    registrationEnd: "2026-08-31",
    city: "嘉義縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-chishang-night",
    type: "run",
    name: "2026池上星夜慢城路跑",
    startDate: "2026-10-03",
    registrationEnd: "2026-08-30",
    city: "臺東縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-okrun-chaozhou",
    type: "run",
    name: "2026 OKRUN 愛在潮州",
    startDate: "2026-10-04",
    registrationEnd: "2026-06-30",
    city: "屏東縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-puli-power",
    type: "run",
    name: "2026 Puli Power 埔里山城派對馬拉松",
    startDate: "2026-10-04",
    registrationEnd: "2026-06-30",
    city: "南投縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-hsinchu-coast",
    type: "run",
    name: "2026 新竹市「戀戀海岸線」快樂路跑",
    startDate: "2026-10-04",
    registrationEnd: "2026-06-30",
    city: "新竹市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-sushi-half",
    type: "run",
    name: "2026 第五屆壽司半程馬拉松",
    startDate: "2026-10-04",
    registrationEnd: "2026-08-04",
    city: "雲林縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-dongshan-river",
    type: "run",
    name: "2026宜蘭縣冬山河水岸馬拉松",
    startDate: "2026-10-04",
    registrationEnd: "2026-08-09",
    city: "宜蘭縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-fubei",
    type: "run",
    name: "2026府北馬拉松",
    startDate: "2026-10-11",
    registrationEnd: "2026-08-02",
    city: "臺南市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-luzhu",
    type: "run",
    name: "2026蘆竹機捷馬拉松",
    startDate: "2026-10-11",
    registrationEnd: "2026-07-31",
    city: "桃園市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-taichung-marathon",
    type: "run",
    name: "2026臺中國際馬拉松-酷城市．酷運動 水岸花都",
    startDate: "2026-10-18",
    registrationEnd: "2026-08-16",
    city: "臺中市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-taoyuan-daguan",
    type: "run",
    name: "2026桃園市第六屆大觀盃 珍珠海岸超半程馬拉松",
    startDate: "2026-10-18",
    registrationEnd: "2026-08-31",
    city: "桃園市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-huatuo-kaohsiung",
    type: "run",
    name: "2026 華陀為高雄公益路跑",
    startDate: "2026-10-26",
    registrationEnd: "2026-09-11",
    city: "高雄市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-qingshui",
    type: "run",
    name: "2026 清水馬拉松嘉年華",
    startDate: "2026-10-31",
    registrationEnd: "2026-09-20",
    city: "臺中市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-extreme-west",
    type: "run",
    name: "2026八百壯士系列--制霸極西超馬賽",
    startDate: "2026-11-01",
    registrationEnd: "2026-10-01",
    city: "新北市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-tigerrun",
    type: "run",
    name: "2026 tigerrun",
    startDate: "2026-12-12",
    registrationEnd: "2026-08-03",
    city: "臺北市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-tongxiao",
    type: "run",
    name: "2026 通霄濱海追風馬拉松",
    startDate: "2026-12-13",
    registrationEnd: "2026-10-13",
    city: "苗栗縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-beiyi-ultra",
    type: "run",
    name: "2026 北宜公路超級馬拉松",
    startDate: "2026-12-19",
    registrationEnd: "2026-11-18",
    city: "新北市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-nankunshen",
    type: "run",
    name: "2026南鯤鯓馬拉松",
    startDate: "2026-12-20",
    registrationEnd: "2026-11-08",
    city: "臺南市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2026-xinying-taizi",
    type: "run",
    name: "2026第三屆新營太子宮三太子哪吒「奔向健康」半程馬拉松",
    startDate: "2026-12-27",
    registrationEnd: "2026-10-31",
    city: "臺南市",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2027-longhufeng",
    type: "run",
    name: "2027 第九屆龍虎鳳越野",
    startDate: "2027-01-09",
    registrationEnd: "2026-10-31",
    city: "苗栗縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "run-2027-renai-tri",
    type: "run",
    name: "2027南投縣仁愛鄉原住民三鐵挑戰賽",
    startDate: "2027-01-10",
    registrationEnd: "2026-11-30",
    city: "南投縣",
    sourceUrl: "https://running.biji.co/index.php?q=competition"
  },
  {
    id: "ctrra-2026-ns-run",
    type: "run",
    name: "2026 NS RUN南山人壽半程馬拉松",
    startDate: "2026-11-22",
    registrationEnd: "2026-09-14",
    city: "臺北市",
    sourceName: "台灣路跑協會",
    sourceUrl: "https://www.sportsnet.org.tw/online_reg_rule.php?race_no=20261122"
  },
  {
    id: "ctrra-2026-national-park-yangmingshan",
    type: "run",
    name: "2026臺灣國家公園馬拉松-陽明山",
    startDate: "2026-11-01",
    registrationEnd: "2026-08-31",
    city: "臺北市",
    sourceName: "台灣路跑協會",
    sourceUrl: "https://www.sportsnet.org.tw/online_reg_rule.php?race_no=20261101"
  },
  {
    id: "ctrra-2026-evergreen-taipei",
    type: "run",
    name: "長庚紀念醫院2026永慶盃路跑-臺北場",
    startDate: "2026-09-20",
    registrationEnd: "2026-08-04",
    city: "臺北市",
    sourceName: "台灣路跑協會",
    sourceUrl: "https://www.sportsnet.org.tw/online_reg_rule.php?race_no=20260920"
  },
  {
    id: "ctrra-2026-taipei-city-run",
    type: "run",
    name: "2026 Panasonic Taipei City Run台北城市路跑賽",
    startDate: "2026-09-06",
    registrationEnd: "2026-07-07",
    city: "臺北市",
    sourceName: "台灣路跑協會",
    sourceUrl: "https://www.sportsnet.org.tw/online_reg_rule.php?race_no=20260906"
  },
  {
    id: "eb-2026-yuelao",
    type: "run",
    name: "2026聖母廟月老姻緣紅線牽馬拉松",
    startDate: "2026-08-15",
    registrationEnd: "2026-07-15",
    city: "臺南市",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-fubei",
    type: "run",
    name: "2026府北馬拉松",
    startDate: "2026-10-11",
    registrationEnd: "2026-08-02",
    city: "臺南市",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-luzhou-guanyinshan",
    type: "run",
    name: "2026 蘆洲觀音山馬拉松",
    startDate: "2026-11-15",
    registrationEnd: "2026-08-15",
    city: "新北市",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-united-university",
    type: "run",
    name: "2026 聯大八甲馬拉松",
    startDate: "2026-10-31",
    registrationEnd: "2026-09-22",
    city: "苗栗縣",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-glory-93",
    type: "run",
    name: "2026「榮耀九三 向國軍致敬」路跑嘉年華",
    startDate: "2026-09-20",
    registrationEnd: "2026-08-23",
    city: "臺北市",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-lianlian-197",
    type: "run",
    name: "2026戀戀197",
    startDate: "2026-12-06",
    registrationEnd: "2026-08-31",
    city: "臺東縣",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-beautiful-jinshan",
    type: "run",
    name: "2026美麗金山路跑活動",
    startDate: "2026-08-29",
    registrationEnd: "2026-06-28",
    city: "新北市",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
  {
    id: "eb-2026-penghu-marathon",
    type: "run",
    name: "2026菊島澎湖跨海馬拉松",
    startDate: "2026-11-01",
    registrationEnd: "2026-08-11",
    city: "澎湖縣",
    sourceName: "伊貝特報名網",
    sourceUrl: "https://bao-ming.com/"
  },
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

const externalEvents = Array.isArray(globalThis.ACTIVITY_EVENTS) ? globalThis.ACTIVITY_EVENTS : null;
const events = dedupeEvents(externalEvents || fallbackEvents);

let activeRoute = "events";
let selectedType = "all";
let searchTerm = "";
let selectedCity = "all";
let currentPage = 1;
let favorites = loadFavorites();

const eventsView = document.querySelector("#events-view");
const favoritesView = document.querySelector("#favorites-view");
const eventsTable = document.querySelector("#events-table");
const favoriteCards = document.querySelector("#favorite-cards");
const emptyEvents = document.querySelector("#empty-events");
const emptyFavorites = document.querySelector("#empty-favorites");
const openCount = document.querySelector("#open-count");
const searchInput = document.querySelector("#search-input");
const citySelect = document.querySelector("#city-select");
const clearFilters = document.querySelector("#clear-filters");
const dateRangeLabel = document.querySelector("#date-range-label");
const pagination = document.querySelector("#pagination");
const prevPage = document.querySelector("#prev-page");
const nextPage = document.querySelector("#next-page");
const pageButtons = document.querySelector("#page-buttons");
const pageInfo = document.querySelector("#page-info");

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    selectedType = button.dataset.type;
    currentPage = 1;
    document.querySelectorAll(".segment").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderEvents();
  });
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  currentPage = 1;
  renderEvents();
});

citySelect.addEventListener("change", (event) => {
  selectedCity = event.target.value;
  currentPage = 1;
  renderEvents();
});

clearFilters.addEventListener("click", () => {
  selectedType = "all";
  selectedCity = "all";
  searchTerm = "";
  currentPage = 1;
  searchInput.value = "";
  citySelect.value = "all";
  document.querySelectorAll(".segment").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.type === "all");
  });
  renderEvents();
});

prevPage.addEventListener("click", () => {
  currentPage -= 1;
  renderEvents();
});

nextPage.addEventListener("click", () => {
  currentPage += 1;
  renderEvents();
});

window.addEventListener("hashchange", syncRoute);

populateCities();
dateRangeLabel.textContent = `${formatDisplayDate(TODAY)} 起算`;
syncRoute();

function syncRoute() {
  activeRoute = window.location.hash.replace("#", "") === "favorites" ? "favorites" : "events";
  eventsView.hidden = activeRoute !== "events";
  favoritesView.hidden = activeRoute !== "favorites";

  document.querySelectorAll(".tab-link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === activeRoute);
  });

  if (activeRoute === "favorites") {
    renderFavorites();
  } else {
    renderEvents();
  }
}

function populateCities() {
  const cities = [...new Set(events.map((event) => event.city))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.append(option);
  });
}

function getListedEvents() {
  return events
    .filter((event) => {
      if (event.type === "swim") {
        return parseDate(event.startDate).getFullYear() === TODAY.getFullYear();
      }

      return isWithinNextYear(event.startDate) && isRegistrationOpen(event.registrationEnd);
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name, "zh-Hant"));
}

function renderEvents() {
  const filtered = getListedEvents().filter((event) => {
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesCity = selectedCity === "all" || event.city === selectedCity;
    const haystack = `${event.name} ${event.city} ${(event.sourceNames || []).join(" ")}`.toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    return matchesType && matchesCity && matchesSearch;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  currentPage = clamp(currentPage, 1, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  openCount.textContent = filtered.length.toString();
  eventsTable.replaceChildren(...pageItems.map(createEventRow));
  emptyEvents.hidden = filtered.length > 0;
  renderPagination(filtered.length, pageCount);
}

function createEventRow(event) {
  const row = document.createElement("tr");
  const isSaved = favorites.includes(event.id);

  row.innerHTML = `
    <td class="favorite-cell"></td>
    <td class="date-cell">${formatDate(event.startDate)}</td>
    <td class="date-cell">${formatDate(event.registrationEnd)}</td>
    <td>
      <div class="event-name">
        <span class="type-pill ${event.type}">${typeLabel(event.type)}</span>
        <span>${event.name}</span>
      </div>
    </td>
    <td class="city-cell">${event.city}</td>
  `;

  const button = document.createElement("button");
  button.className = `favorite-button${isSaved ? " is-saved" : ""}`;
  button.type = "button";
  button.setAttribute("aria-label", `${isSaved ? "移除" : "加入"}收藏：${event.name}`);
  button.textContent = isSaved ? "★" : "☆";
  button.addEventListener("click", () => toggleFavorite(event.id));
  row.querySelector(".favorite-cell").append(button);

  return row;
}

function renderPagination(totalItems, pageCount) {
  pagination.hidden = totalItems <= PAGE_SIZE;
  pageButtons.replaceChildren();

  if (pagination.hidden) {
    pageInfo.textContent = "";
    return;
  }

  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === pageCount;

  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement("button");
    button.className = `page-number${page === currentPage ? " is-active" : ""}`;
    button.type = "button";
    button.textContent = page.toString();
    button.setAttribute("aria-label", `第 ${page} 頁`);
    button.addEventListener("click", () => {
      currentPage = page;
      renderEvents();
    });
    pageButtons.append(button);
  }

  pageInfo.textContent = `第 ${currentPage} / ${pageCount} 頁，共 ${totalItems} 筆`;
}

function renderFavorites() {
  const favoriteEvents = events
    .filter((event) => favorites.includes(event.id))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  favoriteCards.replaceChildren(...favoriteEvents.map(createFavoriteCard));
  emptyFavorites.hidden = favoriteEvents.length > 0;
}

function createFavoriteCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.innerHTML = `
    <div class="card-top">
      <div>
        <span class="type-pill ${event.type}">${typeLabel(event.type)}</span>
        <h2>${event.name}</h2>
      </div>
      <button class="favorite-button is-saved" type="button" aria-label="移除收藏：${event.name}">★</button>
    </div>
    <dl class="meta-list">
      <div class="meta-row">
        <dt>活動日期</dt>
        <dd>${formatDate(event.startDate)}</dd>
      </div>
      <div class="meta-row">
        <dt>報名期限</dt>
        <dd>${formatDate(event.registrationEnd)}</dd>
      </div>
      <div class="meta-row">
        <dt>縣市</dt>
        <dd>${event.city}</dd>
      </div>
    </dl>
    <div class="card-actions">
      <a class="source-link" href="${event.sourceUrl}" target="_blank" rel="noopener noreferrer">原始網頁</a>
      <button class="remove-link" type="button">移除</button>
    </div>
  `;

  card.querySelector(".favorite-button").addEventListener("click", () => toggleFavorite(event.id));
  card.querySelector(".remove-link").addEventListener("click", () => toggleFavorite(event.id));
  return card;
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favoriteId) => favoriteId !== id);
  } else {
    favorites = [...favorites, id];
  }

  saveFavorites();
  if (activeRoute === "favorites") {
    renderFavorites();
  } else {
    renderEvents();
  }
}

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function dedupeEvents(items) {
  return items.reduce((uniqueEvents, event) => {
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
    sourceNames: [sourceName],
    sourceUrls: event.sourceUrl ? [event.sourceUrl] : []
  };
}

function isDuplicateEvent(a, b) {
  const sameType = a.type === b.type;
  const sameDate = a.startDate === b.startDate;
  const closeDeadline = daysBetween(a.registrationEnd, b.registrationEnd) <= 3;
  return sameType && sameDate && closeDeadline && nameSimilarity(a.name, b.name) >= 0.72;
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

function isBetterSourceUrl(candidate, current) {
  if (!candidate) {
    return false;
  }

  if (!current) {
    return true;
  }

  const genericPatterns = ["q=competition", "bao-ming.com/", "sportsnet.org.tw/"];
  const currentIsGeneric = genericPatterns.some((pattern) => current.endsWith(pattern) || current.includes(pattern));
  const candidateIsSpecific = candidate.includes("act=info") || candidate.includes("online_reg_rule");
  return currentIsGeneric && candidateIsSpecific;
}

function isWithinNextYear(dateString) {
  const date = parseDate(dateString);
  return date >= TODAY && date <= ONE_YEAR_LATER;
}

function isRegistrationOpen(dateString) {
  if (!dateString) {
    return false;
  }
  return parseDate(dateString) >= TODAY;
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

function formatDate(dateString) {
  if (!dateString) {
    return "待公布";
  }

  return dateString.replaceAll("-", "/");
}

function formatDisplayDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function typeLabel(type) {
  return type === "swim" ? "泳渡" : "路跑";
}
