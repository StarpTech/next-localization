import { useI18n } from 'next-localization';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Title from '../components/title';
import DE from '../locales/de.json';
import EN from '../locales/en.json';

const Dashboard = () => {
    const router = useRouter();
    const i18n = useI18n();

    useEffect(() => {
        if (router.locale === 'en') {
            i18n.locale('en', EN);
        } else if (router.locale === 'de') {
            i18n.locale('de', DE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.locale]);

    return (
        <div>
            <Title username="Peter" />
            <h2>{i18n.t('intro.text')}</h2>
            <h3>{i18n.t('dashboard.description')}</h3>
            <div>Current locale: {router.locale}</div>
            <div>
                <Link href="/dashboard" locale="en">
                    <a>Change language to (en)</a>
                </Link>
            </div>
            <div>
                <Link href="/dashboard" locale="de">
                    <a>Change language to (de)</a>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
