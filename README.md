<h1 align="center">
	next-localization
	<a href="https://www.npmjs.org/package/next-localization"><img src="https://img.shields.io/npm/v/next-localization.svg?style=flat" alt="npm"></a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg"><img src="https://github.com/StarpTech/next-localization/workflows/Continuous%20Integration/badge.svg" alt="Continuous Integration" style="max-width:100%;"></a>
</h1>
<p align="center">The <strong>minimalistic</strong> localization solution for <em><a href="https://github.com/vercel/next.js">Next.js</a></em>, powered by <a href="https://github.com/lukeed/rosetta">Rosetta</a></em>, </br>with <a href="https://nextjs.org/blog/next-10#internationalized-routing">Next.js 10 Internationalized Routing</a> support.</p>

---

## ✨ Features

-   Supports all rendering modes: (Static) | ● (SSG) | λ (Server).
-   Ideal companion to [Next.js 10 Internationalized Routing](https://nextjs.org/blog/next-10#internationalized-routing)
-   Less than 1000 bytes – including dependencies!
-   Pluralization support
-   No build step, No enforced conventions.

## Table of Contents

-   [Installation & Setup](#installation--setup)
-   [Basic Usage](#basic-usage)
-   [Usage with `getStaticProps`](#usage-with-getstaticprops)
-   [Redirect to default language](#redirect-to-default-language)
-   [Construct correct links](#construct-correct-links)
-   [Internationalization](#internationalization)
    -   [Pluralization](#pluralization)
    -   [Datetime, Numbers](#datetime-numbers)
-   [Access i18n outside React](#access-i18n-outside-react)
-   [Performance considerations](#performance-considerations)
-   [Other considerations](#other-considerations)

## Installation & Setup

```
yarn add next-localization
```

## Example

See [`example`](./example) for full example and locale setup.

## Basic Usage

Your `_app.js`.

```js
import { I18nProvider } from 'next-localization';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { lngDict, ...rest } = pageProps;

    return (
        <I18nProvider lngDict={lngDict} locale={router.locale}>
            <Component {...rest} />
        </I18nProvider>
    );
}
```

Any functional component.

```js
import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';

const HomePage = () => {
    const router = useRouter();
    const i18n = useI18n();
    const i18nPlural = i18n.withPlural(router.locale);
    return (
        <>
            <h1>
                {i18n.t('title')}}, {i18n.t('welcome', { username })}
            </h1>
            <p>{i18nPlural('products_count', { items: 2 })}</p>
            <Link href="/" locale="en">
                <a>Change language to (en)</a>
            </Link>
        </>
    );
};
```

## Usage with [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

Checkout the [full example](example).

_The same steps works with [`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)._

## Redirect to default language

Built-in with [Next.js 10 Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing#automatic-locale-detection)

## Construct correct links

Built-in with [Next.js 10 Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing#transition-between-locales)

## Internationalization

We rely on the native platform api [`Intl`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation). If you need to support older browsers (e.g IE11) use polyfills.

### Pluralization

We provide a small pluralization `i18n.withPlural` utility function. It returns the same `ì18n` interface but handles number values as pluralization. The implementation uses [`Intl.PluralRules`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

```js
import { useRouter } from 'next/router';
import { I18nProvider, useI18n } from 'next-localization';

function Root() {
    const router = useRouter();
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
            locale={router.locale}>
            <Child />
        </I18nProvider>
    );
}

function Child() {
    const i18n = useI18n();
    const router = useRouter();
    const t = i18n.withPlural(router.locale);
    return <p>{t('warning', { birds: 2 })}</p>; // WARNING: two birds
}
```

### Datetime, Numbers

Use [`DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat), [`NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) directly or rely on an external library. The integration will look very similiar.

```js
import { useRouter } from 'next/router';
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
    const router = useRouter();
    const date = new Intl.DateTimeFormat(router.locale).format(new Date());
    return <p>{t('copyright', { date })}</p>; // Copyright: 8/30/2020
}
```

## Access i18n outside React

If you need access to the `i18n` outside of react or react hooks, you can create a custom `i18n` instance and pass it to the `I18nProvider`.
It's the same interface as `useI18n` returns.

```js
import { I18nProvider } from 'next-localization';
import { useRouter } from 'next/router';

const i18n = I18n({
    en: { hello: 'Hello, world!' }
});

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { lngDict, ...rest } = pageProps;

    return (
        <I18nProvider lngDict={lngDict} locale={router.locale}>
            <Component {...rest} />
        </I18nProvider>
    );
}
```

## Performance considerations

Don't forget that a locale change will rerender all components under the `I18nProvider` provider.
It's safe to create multiple providers with different language dictionaries. This can be useful if you want to split it into different namespaces. For all other cases, you can still use `React.memo`, `useMemo` in your components.

## Other considerations

Depending on your application `next-localization` might not be sufficient to internationalize your application. You still need to consider:

-   Format [times](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) and [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat).

With some effort those points are very easy to solve and you can still base on a very lightweight localization strategy.
