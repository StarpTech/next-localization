<h1 align="center">
	next-localization
	<a href="https://www.npmjs.org/package/next-localization"><img src="https://img.shields.io/npm/v/next-localization.svg?style=flat" alt="npm"></a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg"><img src="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg" alt="Continuous Integration" style="max-width:100%;"></a>
</h1>
<p align="center">The <strong>minimalistic</strong> localization solution for <em><a href="https://github.com/vercel/next.js">Next.js</a></em>, powered by <a href="https://github.com/lukeed/rosetta">Rosetta</a></p>

---

## ✨ Features <a name="features"></a>

-   Supports all rendering modes.
-   Less than 500 bytes – including dependencies!
-   No builtin pluralization but a [workaround](https://github.com/lukeed/rosetta/issues/4).

## Installation & Setup <a name="setup"></a> <a name="installation"></a>

```
yarn add next-localization
```

See [`Demo`](./example) for full example and locale setup.

## Basic Usage

Your `_app.js`.

```js
import { I18n } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18n lngDict={{ hello: 'world', welcome: 'Welcome, {{username}}!' }} locale={'en'}>
            <Component {...pageProps} />
        </I18n>
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
import { I18n } from 'next-localization';

export default function MyApp({ Component, pageProps }) {
    return (
        <I18n lngDict={pageProps.lngDict} locale={pageProps.lng}>
            <Component {...pageProps} />
        </I18n>
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
