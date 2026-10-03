import { computed, ref, watchEffect } from 'vue';
import en from 'src/locales/en.json';
import tr from 'src/locales/tr.json';

export type Lang = 'tr' | 'en';

const STORAGE_KEY = 'benefi-lang';
const texts = { en, tr };

function initialLang(): Lang {
  // Prerendering at build time happens without a browser: Turkish first.
  if (typeof window === 'undefined') return 'tr';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'tr' || saved === 'en') return saved;
  } catch {
    // storage blocked – fall through to the browser language
  }
  return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

const lang = ref<Lang>(initialLang());

watchEffect(() => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang.value;
  try {
    localStorage.setItem(STORAGE_KEY, lang.value);
  } catch {
    // ignore
  }
});

export function useLocale() {
  const text = computed(() => texts[lang.value]);
  function setLang(value: Lang) {
    lang.value = value;
  }
  return { lang, text, setLang };
}
