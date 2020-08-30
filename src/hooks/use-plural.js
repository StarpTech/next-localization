import { useMemo } from 'react';
import useI18n from './use-i18n';

export default function usePlural(bcp47Tag, pluralRulesOptions = { type: 'ordinal' }) {
    const i18n = useI18n();
    const PR = useMemo(() => new Intl.PluralRules(bcp47Tag, pluralRulesOptions), [bcp47Tag]);

    return (key, params) => {
        Object.keys(params).map((k) => {
            if (typeof params[k] === 'number') {
                let pkey = PR.select(params[k]);
                params[k] = i18n.t(`${k}.${pkey}`);
            }
        });
        return i18n.t(key, params);
    };
}
