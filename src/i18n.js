import React from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import rosetta from 'rosetta';
// import rosetta from 'rosetta/debug';

export const I18nContext = createContext();

export default function I18n({ children, locale = 'en', lngDict }) {
    const rosettaRef = useRef(null);
    const activeLocaleRef = useRef(locale);
    const [, setTick] = useState(0);
    const firstRender = useRef(true);

    const i18nWrapper = {
        activeLocale: activeLocaleRef.current,
        t: (...args) => rosettaRef.current.t(...args),
        locale: (l, dict) => {
            rosettaRef.current.locale(l);
            activeLocaleRef.current = l;
            if (dict) {
                rosettaRef.current.set(l, dict);
            }
            // force rerender to update view
            setTick((tick) => tick + 1);
        }
    };

    // for initial SSR render
    if (locale && firstRender.current === true) {
        firstRender.current = false;
        rosettaRef.current = rosetta();
        i18nWrapper.locale(locale, lngDict);
    }

    // when locale is updated
    useEffect(() => {
        if (locale) {
            i18nWrapper.locale(locale, lngDict);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lngDict, locale]);

    return <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>;
}
