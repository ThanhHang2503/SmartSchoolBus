'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

/**
 * Component để đồng bộ lang attribute của html tag với ngôn ngữ hiện tại
 * Component này không render gì, chỉ cập nhật lang attribute
 */
export default function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Cập nhật lang attribute khi component mount và khi ngôn ngữ thay đổi
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', i18n.language);
    }
  }, [i18n.language]);

  return null; // Component không render gì
}

