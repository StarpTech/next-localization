import React, { useEffect, useMemo } from 'react';
import { createContext, useState } from 'react';
import rosetta from 'rosetta';
// import rosetta from 'rosetta/debug';

export const I18nContext = createContext();

export const I18n = function (rosettaOpts) {
    const r = rosetta(rosettaOpts);
    return {
        /**
         * Triggers a render cycle
         */
        _onUpdate() {},
        /**
         * Retrieve a translation segment for the active language
         */
        t: r.t,
        /**
         * Get the table of translations for a language
         */
        table: r.table,
        /**
         * Define or extend the language table
         */
        set: r.set,
        /**
         * Set a locale or returns the active locale
         */
        locale(locale) {
            if (locale === undefined) {
                return r.locale();
            }
            const activelocale = r.locale(locale);
            this._onUpdate();
            return activelocale;
        },
        /**
         * Returns an i18n instance that treats number values as pluralization
         */
        withPlural(pluralRulesOptions = { type: 'ordinal' }) {
            const PR = new Intl.PluralRules(r.locale(), pluralRulesOptions);
            return (key, params, ...args) => {
                Object.keys(params).map((k) => {
                    if (typeof params[k] === 'number') {
                        let pkey = PR.select(params[k]);
                        params[k] = this.t(`${k}.${pkey}`);
                    }
                });
                return this.t(key, params, ...args);
            };
        }
    };
};

export default function I18nProvider({ children, locale = 'en', lngDict, i18nInstance }) {
    const [, setTick] = useState(0);
    const i18n = useMemo(() => {
        const instance = i18nInstance ?? I18n();
        instance._onUpdate = () => setTick((tick) => tick + 1);
        instance.set(locale, lngDict);
        instance.locale(locale);
        return instance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18nInstance]);

    useEffect(() => {
        i18n.set(locale, lngDict);
        i18n.locale(locale);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale, lngDict]);

    return <I18nContext.Provider value={{ ...i18n }}>{children}</I18nContext.Provider>;
}
