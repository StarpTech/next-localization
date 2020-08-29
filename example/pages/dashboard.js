import { useI18n } from 'next-localization';
import Head from 'next/head';
import { useEffect } from 'react';

import Title from '../components/title';
import DE from '../locales/de.json';
import EN from '../locales/en.json';
import { contentLanguageMap } from './../i18n';

const Dashboard = () => {
    const i18n = useI18n();

    useEffect(() => {
        i18n.locale('en', EN);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Head>
                <meta
                    httpEquiv="content-language"
                    content={contentLanguageMap[i18n.activeLocale]}
                />
            </Head>
            <Title username="Peter" />
            <h2>{i18n.t('intro.text')}</h2>
            <h3>{i18n.t('dashboard.description')}</h3>
            <div>Current locale: {i18n.activeLocale}</div>
            <a
                href="#"
                onClick={() => {
                    i18n.locale('de', DE);
                }}>
                Change language client-side to 'de'
            </a>
        </div>
    );
};

export default Dashboard;
