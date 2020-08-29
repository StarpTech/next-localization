import { I18n } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18n lngDict={pageProps.lngDict} locale={pageProps.lng}>
            <Component {...pageProps} />
        </I18n>
    );
}
