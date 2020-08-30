import { I18nProvider } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18nProvider lngDict={pageProps.lngDict} locale={pageProps.lng}>
            <Component {...pageProps} />
        </I18nProvider>
    );
}
