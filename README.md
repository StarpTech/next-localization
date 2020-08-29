<h1 align="center">
	next-localization
	<a href="https://www.npmjs.org/package/next-localization"><img src="https://img.shields.io/npm/v/next-localization.svg?style=flat" alt="npm"></a>
</h1>
<p align="center">The <strong>minimalistic</strong> localization solution for <em><a href="https://github.com/vercel/next.js">Next.js</a></em>, powered by <a href="https://github.com/lukeed/rosetta">Rosetta</a></p>

---

## ✨ Features <a name="features"></a>

-   Supports all rendering modes.
-   Less than 500 bytes – including dependencies!

## Installation & Setup <a name="setup"></a> <a name="installation"></a>

```
yarn add next-localization
```

See [`Demo`](./example) for full example and locale setup.

## Usage

Your `_app.js`.

```js
import { I18nContextProvider } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18nContextProvider
            lngDict={{ hello: 'world', welcome: 'Welcome, {{username}}!' }}
            locale={'en'}>
            <Component {...pageProps} />
        </I18nContextProvider>
    );
}
```

Any functional component.

```js
import { useI18n } from 'next-localization';

const HomePage = () => {
    const i18n = useI18n();

    // Change locale
    i18n.locale('de'); // if dict was already loaded
    i18n.locale('de', DE); // set and load dict at the same time

    // Checkout https://github.com/lukeed/rosetta for full interpolation support
    return <p>{i18n.t('welcome', { username })}</p>;
};
```
