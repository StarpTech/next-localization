import { useI18n } from 'next-localization';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Title from '../components/title';

const Dashboard = () => {
    const router = useRouter();
    const i18n = useI18n();

    useEffect(() => {
        async function changeLocale() {
            if (router.locale === 'en') {
                i18n.set('en', await import('../locales/en.json'));
                i18n.locale('en');
            } else if (router.locale === 'de') {
                i18n.set('de', await import('../locales/de.json'));
                i18n.locale('de');
            }
        }
        changeLocale();
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
