import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Lấy ngôn ngữ từ localStorage hoặc dùng mặc định
const getStoredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && (storedLang === 'vi' || storedLang === 'en')) {
      return storedLang;
    }
  }
  return 'vi'; // Ngôn ngữ mặc định
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getStoredLanguage(), // Load ngôn ngữ từ localStorage
    fallbackLng: 'vi', // Fallback language
    debug: false,
    interpolation: {
      escapeValue: false, // React đã escape
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false,
    },
  });

// Lưu ngôn ngữ vào localStorage khi thay đổi
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
    // Cập nhật lang attribute của html tag
    document.documentElement.setAttribute('lang', lng);
  }
});

export default i18n;

