import { loadJson } from 'json.macro';
import { I18nProvider, useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const translations = loadJson('../locales/namespace.json');

export default function Namespace() {
    const router = useRouter();
    const map = useMemo(() => {
        return translations[router.locale];
    }, [router.locale]);

    return (
        <I18nProvider lngDict={map} locale={router.locale}>
            <Title />
        </I18nProvider>
    );
}

export function Title() {
    const i18n = useI18n();
    return <h1>{i18n.t('title')}</h1>;
}
