export const Locales = {
  english: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
  slovak: {
    code: 'sk',
    name: 'Slovensky',
    flag: '🇸🇰',
  },
} as const satisfies Record<string, Locale>;

export const DEFAULT_LOCALE = Locales.english;

export type Locale = {
  code: string;
  name: string;
  flag: string;
};
