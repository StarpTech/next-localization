import React, { useMemo } from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import rosetta from 'rosetta';
// import rosetta from 'rosetta/debug';

export const I18nContext = createContext();

export const I18n = function () {
    const r = rosetta();
    return {
        onUpdate() {},
        t(...args) {
            return r.t(...args);
        },
        locale(l, dict) {
            if (l === undefined) {
                // returns active locale
                return r.locale(l);
            } else {
                // set new locale
                r.locale(l);
            }
            if (dict) {
                r.set(l, dict);
            }
            this.onUpdate();
        }
    };
};

export default function I18nProvider({ children, locale = 'en', lngDict }) {
    const [, setTick] = useState(0);
    const i18n = useMemo(() => {
        const instance = I18n();
        instance.onUpdate = () => setTick((tick) => tick + 1);
        return instance;
    }, []);
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
