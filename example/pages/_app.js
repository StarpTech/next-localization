import { I18nContextProvider } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18nContextProvider lngDict={pageProps.lngDict} locale={pageProps.lng}>
            <Component {...pageProps} />
        </I18nContextProvider>
    );
}
