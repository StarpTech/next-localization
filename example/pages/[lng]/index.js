import { useI18n } from 'next-localization';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

import Title from '../../components/title';
import { contentLanguageMap, languages } from './../../i18n';

const HomePage = ({ lng, lngDict }) => {
    const i18n = useI18n();

    useEffect(() => {
        i18n.locale(lng, lngDict);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lng, lngDict]);

    return (
        <div>
            <Head>
                <meta httpEquiv="content-language" content={contentLanguageMap[i18n.locale()]} />
            </Head>
            <Title username="Peter" />
            <h2>{i18n.t('intro.text')}</h2>
            <h3>{i18n.t('intro.description')}</h3>
            <div>Current locale: {i18n.locale()}</div>
            <Link href="/[lng]" as="/de">
                <a>Use client-side routing to change language to 'de'</a>
            </Link>
        </div>
    );
};

export async function getStaticProps({ params }) {
    const { default: lngDict = {} } = await import(`../../locales/${params.lng}.json`);

    return {
        props: { lng: params.lng, lngDict }
    };
}

export async function getStaticPaths() {
    return {
        paths: languages.map((l) => ({ params: { lng: l } })),
        fallback: false
    };
}

export default HomePage;
