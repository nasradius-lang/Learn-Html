// dashboard.js

const root = document.documentElement;
const sidebar = document.querySelector('.sidebar');
const view = document.getElementById('view');
const pageTitle = document.getElementById('page-title');
const themeToggle = document.getElementById('theme-toggle');
const sidebarToggle = document.getElementById('sidebar-toggle');
const langSelect = document.getElementById('lang-select');

const STRINGS = {
  ar: {
    dashboard: 'لوحة التحكم',
    vouchers: 'القسائم/الخطط',
    users: 'المستخدمون',
    accounts: 'الحسابات',
    operations: 'عمليات الحساب',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    stats: {
      used: 'القسائم المستخدمة',
      active: 'القسائم النشطة',
      expiredToday: 'منتهية اليوم',
      expiredWeek: 'منتهية هذا الأسبوع',
      expiredMonth: 'منتهية هذا الشهر',
      fund: 'الصندوق'
    },
    flow: 'مخطط التدفق',
    plans: 'الخطط',
    hotspot: 'Hotspot',
    vbp: 'VBP',
    pppoe: 'PPPoE',
    usersList: 'قائمة المستخدمين',
    addUser: 'إضافة مستخدم',
    edit: 'تحرير',
    monitor: 'مراقبة السلوك',
    accountTree: 'شجرة الحسابات',
    currency: 'العملة',
    operationsList: 'سحب، إيداع، قيد يومي',
    settingsTitle: 'الإعدادات',
    tz: 'المنطقة الزمنية',
    dtFormat: 'تنسيق التاريخ/الوقت',
    save: 'حفظ',
    night: 'الوضع الليلي',
    day: 'الوضع النهاري'
  },
  en: {
    dashboard: 'Dashboard',
    vouchers: 'Vouchers/Plans',
    users: 'Users',
    accounts: 'Accounts',
    operations: 'Account Operations',
    settings: 'Settings',
    logout: 'Logout',
    stats: {
      used: 'Used vouchers',
      active: 'Active vouchers',
      expiredToday: 'Expired today',
      expiredWeek: 'Expired this week',
      expiredMonth: 'Expired this month',
      fund: 'Fund'
    },
    flow: 'Flowchart',
    plans: 'Plans',
    hotspot: 'Hotspot',
    vbp: 'VBP',
    pppoe: 'PPPoE',
    usersList: 'Users list',
    addUser: 'Add user',
    edit: 'Edit',
    monitor: 'Monitor behaviour',
    accountTree: 'Account tree',
    currency: 'Currency',
    operationsList: 'Withdraw, Deposit, Daily entry',
    settingsTitle: 'Settings',
    tz: 'Time zone',
    dtFormat: 'Date/Time format',
    save: 'Save',
    night: 'Dark mode',
    day: 'Light mode'
  }
};

function t(keyPath) {
  const lang = localStorage.getItem('lang') || 'ar';
  const dict = STRINGS[lang];
  return keyPath.split('.').reduce((acc, k) => acc?.[k], dict) || keyPath;
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  render(); // re-render labels
  langSelect.value = lang;
}

// Theme
function applyTheme(theme) {
  root.classList.remove('light', 'dark');
  if (theme) root.classList.add(theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? t('day') : t('night');
}

themeToggle.addEventListener('click', () => {
  const isDark = root.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});

// Sidebar collapse / mobile hide
sidebarToggle.addEventListener('click', () => {
  const isNarrow = window.matchMedia('(max-width: 800px)').matches;
  if (isNarrow) {
    sidebar.classList.toggle('hidden');
  } else {
    sidebar.classList.toggle('collapsed');
    document.querySelector('.app').classList.toggle('collapsed-app');
  }
});

// Language init
langSelect.addEventListener('change', e => setLang(e.target.value));

// Routing
const routes = {
  dashboard: renderDashboard,
  vouchers: renderVouchers,
  users: renderUsers,
  accounts: renderAccounts,
  operations: renderOperations,
  settings: renderSettings,
  logout: renderLogout
};

function currentRoute() {
  const hash = location.hash.replace('#/', '');
  return routes[hash] ? hash : 'dashboard';
}

window.addEventListener('hashchange', render);

// Render helpers
function setActive(route) {
  document.querySelectorAll('.menu-item').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-route') === route);
  });
  pageTitle.textContent = t(route);
}

function card(title, innerHTML) {
  return `
    <section class="card">
      <h3>${title}</h3>
      ${innerHTML || ''}
    </section>
  `;
}

// Pages
function renderDashboard() {
  const stats = `
    <div class="mini">
      <div class="stat"><strong>${t('stats.used')}</strong><div>1,248</div></div>
      <div class="stat"><strong>${t('stats.active')}</strong><div>3,572</div></div>
      <div class="stat"><strong>${t('stats.expiredToday')}</strong><div>89</div></div>
      <div class="stat"><strong>${t('stats.expiredWeek')}</strong><div>412</div></div>
      <div class="stat"><strong>${t('stats.expiredMonth')}</strong><div>1,930</div></div>
      <div class="stat"><strong>${t('stats.fund')}</strong><div>$ 12,450</div></div>
    </div>
  `;
  const flow = `
    <div class="flow">
      <div class="node">Auth</div>
      <div class="node">Voucher Issue</div>
      <div class="node">Usage</div>
      <div class="node">Monitoring</div>
      <div class="node">Billing</div>
      <div class="node">Reporting</div>
    </div>
  `;
  view.innerHTML = `
    <div class="grid">
      ${card(t('dashboard'), stats)}
      ${card(t('flow'), flow)}
      ${card('Recent activity', `
        <table class="table">
          <thead><tr><th>ID</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <tr><td>#9821</td><td>Voucher</td><td>Active</td><td>2025-12-03</td></tr>
            <tr><td>#9822</td><td>User</td><td>Updated</td><td>2025-12-03</td></tr>
            <tr><td>#9823</td><td>Deposit</td><td>Posted</td><td>2025-12-02</td></tr>
          </tbody>
        </table>
      `)}
    </div>
  `;
}

function renderVouchers() {
  view.innerHTML = `
    ${card(t('plans'), `
      <div class="mini">
        <div class="stat"><strong>${t('hotspot')}</strong><div>5 خطط</div></div>
        <div class="stat"><strong>${t('vbp')}</strong><div>3 خطط</div></div>
        <div class="stat"><strong>${t('pppoe')}</strong><div>7 خطط</div></div>
      </div>
      <div style="margin-top: 1rem;">
        <table class="table">
          <thead><tr><th>Plan</th><th>Bandwidth</th><th>Price</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Hotspot Basic</td><td>10 Mbps</td><td>$3</td><td>Active</td></tr>
            <tr><td>VBP Silver</td><td>20 Mbps</td><td>$6</td><td>Active</td></tr>
            <tr><td>PPPoE Pro</td><td>50 Mbps</td><td>$15</td><td>Inactive</td></tr>
          </tbody>
        </table>
      </div>
    `)}
  `;
}

function renderUsers() {
  view.innerHTML = `
    ${card(t('usersList'), `
      <div style="margin-bottom: .75rem;">
        <button>${t('addUser')}</button>
      </div>
      <table class="table">
        <thead><tr><th>User</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr><td>Ali</td><td>ali@example.com</td><td>Active</td>
              <td><button>${t('edit')}</button> <button>${t('monitor')}</button></td></tr>
          <tr><td>Sara</td><td>sara@example.com</td><td>Suspended</td>
              <td><button>${t('edit')}</button> <button>${t('monitor')}</button></td></tr>
        </tbody>
      </table>
    `)}
  `;
}

function renderAccounts() {
  view.innerHTML = `
    ${card(t('accountTree'), `
      <ul>
        <li>Assets
          <ul>
            <li>Cash</li>
            <li>Bank</li>
          </ul>
        </li>
        <li>Liabilities
          <ul>
            <li>Payables</li>
          </ul>
        </li>
        <li>Equity</li>
      </ul>
    `)}
    ${card(t('currency'), `
      <table class="table">
        <thead><tr><th>Code</th><th>Name</th><th>Rate</th></tr></thead>
        <tbody>
          <tr><td>USD</td><td>US Dollar</td><td>1.00</td></tr>
          <tr><td>YER</td><td>Yemeni Rial</td><td>0.004</td></tr>
        </tbody>
      </table>
    `)}
  `;
}

function renderOperations() {
  view.innerHTML = `
    ${card(t('operationsList'), `
      <form class="mini">
        <div class="stat">
          <label><strong>Withdraw</strong></label>
          <input type="number" placeholder="Amount" />
          <button>Post</button>
        </div>
        <div class="stat">
          <label><strong>Deposit</strong></label>
          <input type="number" placeholder="Amount" />
          <button>Post</button>
        </div>
        <div class="stat">
          <label><strong>Daily Entry</strong></label>
          <input type="text" placeholder="Description" />
          <button>Post</button>
        </div>
      </form>
    `)}
  `;
}

function renderSettings() {
  const savedTZ = localStorage.getItem('tz') || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const savedFmt = localStorage.getItem('dtFmt') || 'YYYY-MM-DD HH:mm';
  view.innerHTML = `
    ${card(t('settingsTitle'), `
      <div class="mini">
        <div class="stat">
          <label><strong>${t('tz')}</strong></label>
          <input id="tz" type="text" value="${savedTZ}" placeholder="Asia/Aden" />
        </div>
        <div class="stat">
          <label><strong>${t('dtFormat')}</strong></label>
          <input id="dtFmt" type="text" value="${savedFmt}" placeholder="YYYY-MM-DD HH:mm" />
        </div>
      </div>
      <div style="margin-top: 1rem;">
        <button id="saveSettings">${t('save')}</button>
      </div>
    `)}
  `;
  document.getElementById('saveSettings').addEventListener('click', () => {
    localStorage.setItem('tz', document.getElementById('tz').value.trim());
    localStorage.setItem('dtFmt', document.getElementById('dtFmt').value.trim());
    alert('Saved');
  });
}

function renderLogout() {
  view.innerHTML = card(t('logout'), `<p>سيتم إنهاء الجلسة وإعادة التوجيه لصفحة الدخول.</p>`);
}

function render() {
  const route = currentRoute();
  setActive(route);
  routes[route]();
}

// Init
(function init() {
  // Theme
  const savedTheme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  // Lang
  const savedLang = localStorage.getItem('lang') || (navigator.language || 'ar').slice(0, 2);
  setLang(['ar','en'].includes(savedLang) ? savedLang : 'en');
  // First render
  render();
})();
