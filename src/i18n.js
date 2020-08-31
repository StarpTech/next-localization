import React, { useMemo } from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import rosetta from 'rosetta';
// import rosetta from 'rosetta/debug';

export const I18nContext = createContext();

export const I18n = function (rosettaOpts) {
    const r = rosetta(rosettaOpts);
    return {
        onUpdate() {},
        t(...args) {
            return r.t(...args);
        },
        locale(l, dict) {
            if (l === undefined) {
                // returns active locale
                return r.locale();
            } else {
                // set active locale
                r.locale(l);
            }
            if (l && dict) {
                r.set(l, dict);
            }
            this.onUpdate();
        },
        plural(bcp47Tag, pluralRulesOptions = { type: 'ordinal' }) {
            const PR = new Intl.PluralRules(bcp47Tag, pluralRulesOptions);
            return (key, params) => {
                Object.keys(params).map((k) => {
                    if (typeof params[k] === 'number') {
                        let pkey = PR.select(params[k]);
                        params[k] = this.t(`${k}.${pkey}`);
                    }
                });
                return this.t(key, params);
            };
        }
    };
};

export default function I18nProvider({ children, locale = 'en', lngDict, i18nInstance }) {
    const [, setTick] = useState(0);
    const i18n = useMemo(() => {
        const instance = i18nInstance ?? I18n();
        instance.onUpdate = () => setTick((tick) => tick + 1);
        return instance;
    }, [i18nInstance]);
    const firstRender = useRef(true);

    // for initial render
    if (locale && firstRender.current === true) {
        firstRender.current = false;
        i18n.locale(locale, lngDict);
    }

    // when locale is updated
    useEffect(() => {
        if (locale) {
            i18n.locale(locale, lngDict);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lngDict, locale]);

    return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
