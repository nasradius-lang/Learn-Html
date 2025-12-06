// app.js

// 1) إدارة الثيم (ليلي/نهاري)
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.classList.remove('light', 'dark');
  if (theme === 'light' || theme === 'dark') {
    root.classList.add(theme);
  }
  localStorage.setItem('theme', theme);
  updateThemeToggleLabel(theme);
}

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateThemeToggleLabel(theme) {
  const labelMap = {
    light: 'الوضع الليلي',
    dark: 'الوضع النهاري',
    system: 'اتّبع النظام'
  };
  themeToggle.textContent = labelMap[theme] || labelMap.system;
}

// تهيئة الثيم: أولوية حفظ المستخدم ثم النظام
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    // وضع النظام
    root.classList.remove('light', 'dark');
    updateThemeToggleLabel('system');
  }

  // استماع لتغير النظام إن لم يكن هناك اختيار يدوي
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    const saved = localStorage.getItem('theme');
    if (!saved) updateThemeToggleLabel('system');
  });
})();

// تبديل عند الضغط
themeToggle.addEventListener('click', () => {
  const current = root.classList.contains('dark') ? 'dark'
                 : root.classList.contains('light') ? 'light'
                 : (systemPrefersDark() ? 'dark' : 'light');

  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// 2) التعدد اللغوي + RTL/LTR
const langSelect = document.getElementById('lang-select');
const STRINGS = {
  ar: {
    title: 'موقعي المتعدد اللغات',
    brand: 'براند',
    headline: 'ثيم متجاوب ليلي/نهاري متعدد اللغات',
    subhead: 'هذا مثال عملي جاهز للتطوير',
    getStarted: 'ابدأ الآن',
    featuresTitle: 'المميزات',
    featResponsive: 'تصميم متجاوب',
    featTheme: 'وضع ليلي/نهاري',
    featI18n: 'تعدد اللغات + RTL',
    featA11y: 'تحسين الوصول',
    techTitle: 'التقنيات',
    techDesc: 'HTML + CSS متغيرات + JavaScript بسيط',
    footer: '© 2025 جميع الحقوق محفوظة'
  },
  en: {
    title: 'My multilingual site',
    brand: 'Brand',
    headline: 'Responsive theme with dark/light and i18n',
    subhead: 'A practical starter you can build on',
    getStarted: 'Get started',
    featuresTitle: 'Features',
    featResponsive: 'Responsive design',
    featTheme: 'Dark/Light mode',
    featI18n: 'Multilingual + RTL',
    featA11y: 'Accessibility improvements',
    techTitle: 'Tech stack',
    techDesc: 'HTML + CSS variables + simple JavaScript',
    footer: '© 2025 All rights reserved'
  },
  fr: {
    title: 'Mon site multilingue',
    brand: 'Marque',
    headline: 'Thème réactif avec sombre/clair et i18n',
    subhead: 'Un starter pratique à étendre',
    getStarted: 'Commencer',
    featuresTitle: 'Fonctionnalités',
    featResponsive: 'Design responsive',
    featTheme: 'Mode sombre/clair',
    featI18n: 'Multilingue + RTL',
    featA11y: 'Accessibilité améliorée',
    techTitle: 'Technologies',
    techDesc: 'HTML + variables CSS + JavaScript simple',
    footer: '© 2025 Tous droits réservés'
  }
};

function applyLanguage(lang) {
  const dict = STRINGS[lang] || STRINGS.ar;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  // تحديث lang و dir
  document.documentElement.lang = lang;
  const isRTL = lang === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

  localStorage.setItem('lang', lang);
}

(function initLang() {
  const saved = localStorage.getItem('lang');
  const preferred = saved || (navigator.language || 'ar').slice(0,2);
  const initial = ['ar','en','fr'].includes(preferred) ? preferred : 'en';
  langSelect.value = initial;
  applyLanguage(initial);
})();

langSelect.addEventListener('change', (e) => {
  applyLanguage(e.target.value);
});
