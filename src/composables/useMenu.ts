import { computed, ref, shallowRef } from 'vue';
import { useLocale } from './useLocale';

// The four files are produced by helper_skripts/menu_converter/menu_converter.py.
// Their shape must not change:
//   menu.json         category -> (subcategory -> ...)* -> [item keys]
//   menu_en/tr.json   key -> { name, description? }
//   menu_static.json  key -> { small_price?, medium_price?, large_price?, picture_small?, picture_large? }
export type MenuTree = { [key: string]: MenuTree | string[] };
type Texts = Record<string, { name?: string; description?: string }>;
export type StaticValues = {
  small_price?: number;
  medium_price?: number;
  large_price?: number;
  picture_small?: string;
  picture_large?: string;
};

const tree = shallowRef<MenuTree>({});
const texts = shallowRef<{ en: Texts; tr: Texts }>({ en: {}, tr: {} });
const statics = shallowRef<Record<string, StaticValues>>({});
const loaded = ref(false);
let loading: Promise<void> | undefined;

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(`/data/${file}`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return res.json() as Promise<T>;
}

type MenuData = [MenuTree, Texts, Texts, Record<string, StaticValues>];

function setData(data: MenuData) {
  tree.value = data[0];
  texts.value = { en: data[1], tr: data[2] };
  statics.value = data[3];
  loaded.value = true;
}

async function load() {
  let data: MenuData;
  try {
    data = await Promise.all([
      fetchJson<MenuTree>('menu.json'),
      fetchJson<Texts>('menu_en.json'),
      fetchJson<Texts>('menu_tr.json'),
      fetchJson<Record<string, StaticValues>>('menu_static.json'),
    ]);
  } catch (err) {
    // Fall back to the copy bundled at build time.
    console.warn('Menu data unavailable, using bundled copy', err);
    data = (await Promise.all([
      import('src/locales/menu.json'),
      import('src/locales/menu_en.json'),
      import('src/locales/menu_tr.json'),
      import('src/locales/menu_static.json'),
    ]).then((mods) => mods.map((m) => m.default))) as typeof data;
  }
  setData(data);
}

/** Starts loading the menu (once) and resolves when it is there. */
export function loadMenu() {
  loading ??= load();
  return loading;
}

/** Used when prerendering: fill in the menu without fetching. */
export function provideMenuData(data: MenuData) {
  setData(data);
  loading = Promise.resolve();
}

// "vegan_-_glutein_free" -> "Vegan - glutein free"
function prettify(key: string) {
  const s = key.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function useMenu() {
  const { lang } = useLocale();
  loadMenu();

  const current = computed(() => texts.value[lang.value]);

  function name(key: string): string {
    return (
      current.value[key]?.name?.trim() ||
      texts.value.en[key]?.name?.trim() ||
      prettify(key)
    );
  }

  function description(key: string): string | undefined {
    return (
      current.value[key]?.description?.trim() ||
      texts.value.en[key]?.description?.trim() ||
      undefined
    );
  }

  function info(key: string): StaticValues {
    return statics.value[key] ?? {};
  }

  return { tree, loaded, name, description, info };
}
