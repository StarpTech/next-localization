<h1 align="center">
	next-localization
	<a href="https://www.npmjs.org/package/next-localization"><img src="https://img.shields.io/npm/v/next-localization.svg?style=flat" alt="npm"></a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg"><img src="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg" alt="Continuous Integration" style="max-width:100%;"></a>
</h1>
<p align="center">The <strong>minimalistic</strong> localization solution for <em><a href="https://github.com/vercel/next.js">Next.js</a></em>, powered by <a href="https://github.com/lukeed/rosetta">Rosetta</a></p>

---

## ✨ Features <a name="features"></a>

-   Supports all rendering modes: (Static) | ● (SSG) | λ (Server).
-   Less than 500 bytes – including dependencies!
-   Pluralization support
-   No build step, No enforced conventions.

## Installation & Setup <a name="setup"></a> <a name="installation"></a>

```
yarn add next-localization
```

See [`Demo`](./example) for full example and locale setup.

## Basic Usage

Your `_app.js`.

```js
import { I18nProvider } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18nProvider lngDict={{ hello: 'world', welcome: 'Welcome, {{username}}!' }} locale={'en'}>
            <Component {...pageProps} />
        </I18nProvider>
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

    // Get current locale
    i18n.locale(); // de

    // Checkout https://github.com/lukeed/rosetta for full interpolation support
    return <p>{i18n.t('welcome', { username })}</p>;
};
```

## Usage with [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

You can use Next.js's static APIs to feed your `_app.js`'s `lngDict`:

```js
import { I18nProvider } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18nProvider lngDict={pageProps.lngDict} locale={pageProps.lng}>
            <Component {...pageProps} />
        </I18nProvider>
    );
}
```

Each page should define [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) and [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation):

```js
// pages/[lng]/index.js

export const getStaticProps = async ({ params }) => {
    // You could also fetch from external API at build time
    // this example loads locales from disk once for each language defined in `params.lng`
    const { default: lngDict = {} } = await import(`../../locales/${params.lng}.json`);

    return {
        props: {
            lng: params?.lng,
            lngDict
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every second
        revalidate: 1
    };
};

export const getStaticPaths = async () => {
    // You could also fetch from external API at build time
    const languages = ['en', 'de', 'fr'];

    return {
        paths: languages.map((lng) => ({ params: { lng } })),
        fallback: false
    };
};
```

_The same steps works with [`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)._

## Redirect to default language

Next.js +9.5 is shipped with a rewrite engine. This will create a permanent redirect from `/` to `/en` when `en` should be your default language. This features requires to run Next.js in server mode. This won't work if you just export your site.

```js
module.exports = {
    redirects() {
        return [
            {
                source: '/',
                destination: '/en',
                permanent: true
            }
        ];
    }
};
```

## Internationalization

We rely on the native platform api [`Intl`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation).

### Pluralization

We provide a small pluralization `usePlural()` hook. The hook uses [`Intl.PluralRules`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

```js
import { I18nProvider, usePlural } from 'next-localization';

function Root() {
    return (
        <I18nProvider
            lngDict={{
                warning: 'WARNING: {{birds}}',
                birds: {
                    other: 'birds',
                    one: 'bird',
                    two: 'two birds',
                    few: 'some birds'
                }
            }}
            locale={'en'}>
            <Child />
        </I18nProvider>
    );
}

function Child() {
    const t = usePlural('en-US');
    return <p>{t('warning', { birds: 2 })}</p>; // WARNING: two birds
}
```

### Datetime, Numbers

Use [`DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat), [`DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) directly or rely on an external library. The integration will look very similiar.

```js
import { I18nProvider, usePlural } from 'next-localization';

function Root() {
    return (
        <I18nProvider
            lngDict={{
                copyright: 'Copyright: {{date}}'
            }}
            locale={'en'}>
            <Child />
        </I18nProvider>
    );
}

function Child() {
    const date = new Intl.DateTimeFormat('en-US').format(new Date());
    return <p>{t('copyright', { date })}</p>; // Copyright: 8/30/2020
}
```

## Usage on Server

The same api as the `useI18n` react hook.

```js
import { I18n } from 'next-localization';

const i18n = I18n();

i18n.locale('en', { hello: 'world', welcome: 'Welcome, {{username}}!' });

// Get current locale
i18n.locale(); // de

// translate
i18n.t('welcome', { username });
```

## Performance considerations

Don't forget that a locale change will rerender all components under the `I18nProvider` provider.
It's safe to create multiple providers with different language dictionaries. This can be useful for lazy-loading scenarios. For all other cases, you can still use `React.memo`, `useMemo` in your components.

## Other considerations

Depending on your application `next-localization` won't be sufficient to internationalize your application. You still need to consider:

-   Detect user language on browser and server.
-   Localize your app links `<Link />` based on the user language.
-   Format [times](https://date-fns.org/) and [numbers](https://github.com/openexchangerates/accounting.js).
-   Declare html `lang` attributes for SEO and a11y.

With some effort those points are very easy to solve and you can still base on a very lightweight localization strategy.
