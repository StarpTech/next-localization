<h1 align="center">
	next-localization
	<a href="https://www.npmjs.org/package/next-localization"><img src="https://img.shields.io/npm/v/next-localization.svg?style=flat" alt="npm"></a>
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

## Usage

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

### Usage with `getStaticProps`

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

Each page should define `getStaticProps` and `getStaticPaths`:

```js
// pages/[lng]/index.js

export const getStaticProps = async ({ params }) => {
  // translations obtained from external API at build time
  // this example is fetching page `index` once for each language defined in `params.lng`
  const lngDict = await getTranslations('index', params?.lng);

  return {
    props: {
      lng: params?.lng,
      lngDict
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  // fetching available languages at build time
  const languages = await getAvailableLanguages(); // ['en', 'de', 'fr']
  
  return {
    paths: languages.map((lng) => ({ params: { lng } })),
    fallback: false,
  };
};
```

The same system works with `getServerSideProps`.
