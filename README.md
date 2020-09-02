<h1 align="center">
	next-localization
	<a href="https://www.npmjs.org/package/next-localization"><img src="https://img.shields.io/npm/v/next-localization.svg?style=flat" alt="npm"></a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg"><img src="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg" alt="Continuous Integration" style="max-width:100%;"></a>
</h1>
<p align="center">The <strong>minimalistic</strong> localization solution for <em><a href="https://github.com/vercel/next.js">Next.js</a></em>, powered by <a href="https://github.com/lukeed/rosetta">Rosetta</a></p>

---

## ✨ Features <a name="features"></a>

-   Supports all rendering modes: (Static) | ● (SSG) | λ (Server).
-   Less than 1000 bytes – including dependencies!
-   Pluralization support
-   No build step, No enforced conventions.

## Table of Contents
- [✨ Features <a name="features"></a>](#-features-)
- [Table of Contents](#table-of-contents)
- [Installation & Setup <a name="setup"></a> <a name="installation"></a>](#installation--setup-)
- [Basic Usage](#basic-usage)
- [Usage with `getStaticProps`](#usage-with-getstaticprops)
- [Redirect to default language](#redirect-to-default-language)
- [Construct correct links](#construct-correct-links)
- [Internationalization](#internationalization)
  - [Language helper](#language-helper)
  - [Pluralization](#pluralization)
  - [Datetime, Numbers](#datetime-numbers)
- [Access i18n outside React](#access-i18n-outside-react)
- [Performance considerations](#performance-considerations)
- [Other considerations](#other-considerations)

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

    i18n.locale(); // returns the current locale
    i18n.locale('de'); // change locale to 'de'
    i18n.locale('de', DE); // change the local to 'de' and merge (or override) translation keys into the lang collection.

    i18n.set('de', { foo: 'bar' }); // merge (or override) translation keys into the lang collection.
    i18n.table('de'); // retrieve the the lang's full dictionary/table of translation keys.

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

export default function HomePage({ lng, lngDict }) {
    const i18n = useI18n();

    // rerender when fetching new locale on client side
    useEffect(() => {
        i18n.locale(lng, lngDict);
    }, [lng, lngDict]);

    return <h1>{i18n.t('intro.text')}</h1>;
}

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

## Construct correct links

We don't ship a custom `Link` component. You can easily build a utility helper hook/function like this:

```js
const buildUrl = (url) => `${i18n.locale()}/${url}` // example schema

<Link href={buildUrl('/contact')}><a>Contact</a></Link>
```

This is clever in multiple ways. In this way you could maintain a map of all your routes for easier maintenance:

```js
const routes = { contact: { pathname: '/contact', as: '/contact' } };
const buildUrl = (routeName) => {
    const newRoute = { ...routes[routeName] };
    newRoute.as = `/${i18n.locale()}${newRoute.as}`;
    return newRoute;
};

<Link href={buildUrl('contact')}>
    <a>Contact</a>
</Link>;
```

## Internationalization

We rely on the native platform api [`Intl`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation).

### Language helper

If you need to detect the browser language based on your available app languages you can use the `getPreferredLanguage` utility function.

```js
import { getPreferredLanguage } from 'next-localization';

const appLanguages = ['en', 'de-DE']; // all available app languages
getPreferredLanguage(appLanguages); // returns the best match based on navigator.languages

// e.g { full: 'en-US', language: 'en', region: 'EN' }
```

### Pluralization

We provide a small pluralization `i18n.plural` utility function. The implementation uses [`Intl.PluralRules`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

```js
import { I18nProvider, useI18n } from 'next-localization';

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
    const i18n = useI18n();
    const t = i18n.plural('en-US');
    return <p>{t('warning', { birds: 2 })}</p>; // WARNING: two birds
}
```

### Datetime, Numbers

Use [`DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat), [`NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) directly or rely on an external library. The integration will look very similiar.

```js
import { I18nProvider } from 'next-localization';

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

## Access i18n outside React

If you need access to the `i18n` outside of react or react hooks, you can create a custom `i18n` instance and pass it to the `I18nProvider`.
It's the same interface as `useI18n` returns.

```js
import { I18nProvider, I18n } from 'next-localization';

const i18n = I18n({
    en: { hello: 'Hello, world!' }
});

export default function MyApp({ Component, pageProps }) {
    return (
        <I18nProvider i18nInstance={i18n} locale={pageProps.lng}>
            <Component {...pageProps} />
        </I18nProvider>
    );
}
```

## Performance considerations

Don't forget that a locale change will rerender all components under the `I18nProvider` provider.
It's safe to create multiple providers with different language dictionaries. This can be useful if you want to split it into different namespaces. For all other cases, you can still use `React.memo`, `useMemo` in your components.

## Other considerations

Depending on your application `next-localization` might not be sufficient to internationalize your application. You still need to consider:

-   Detect user language on server.
-   Localize your app links `<Link />` based on the user language.
-   Format [times](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) and [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat).
-   Declare html `lang` attributes for SEO and a11y.

With some effort those points are very easy to solve and you can still base on a very lightweight localization strategy.
