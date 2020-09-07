interface I18n<T> {
    /** Get/Set the language key */
    locale(lang?: string, table?: T): string;
    /** Define or extend the language table */
    set(lang: string, table: T): void;
    /** Get the table of translations for a language */
    table(lang: string): T | void;
    /** Retrieve a translation segment for the current language */
    t<X extends Record<string, any> | any[]>(
        key: string | (string | number)[],
        params?: X,
        lang?: string
    ): string;
}
interface Language {
    full: string;
    language: string;
    region: string;
}

export function useI18n<T>(): I18n<T>;
export function I18n<T>(): I18n<T>;
export function withPlural<T>(lTag: string): I18n<T>;
export function getPreferredLanguage(appLanguages: string[]): Language;
export function parseLanguage(languageString: string): Language;
export function I18nProvider<T extends object>(props: ProviderProps<T>): React.ReactElement;

interface ProviderProps<T> {
    lngDict?: T;
    locale: string;
    i18nInstance?: I18n<T>;
    children: JSX.Element;
}
interface II18nProvider<T> extends React.FC<ProviderProps<T>> {}
