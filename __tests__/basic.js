import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { I18nProvider, useI18n, I18n } from './../src/index';

test('Should render key', () => {
    function Root() {
        return (
            <I18nProvider lngDict={{ hello: 'Hello, world!' }} locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        return <p>{i18n.t('hello')}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('Hello, world!')).toBeInTheDocument();
});

test('Should interpolate key', () => {
    function Root() {
        return (
            <I18nProvider lngDict={{ welcome: 'Welcome, {{username}}!' }} locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        return <p>{i18n.t('welcome', { username: 'Bernd' })}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('Welcome, Bernd!')).toBeInTheDocument();
});

test('Should print current locale', () => {
    function Root() {
        return (
            <I18nProvider lngDict={{ hello: 'Hello, world!' }} locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        return <p>{i18n.locale()}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('en')).toBeInTheDocument();
});

test('Should pluralize', () => {
    function Root() {
        return (
            <I18nProvider
                lngDict={{
                    warning: 'WARNING: {{birds}}, {{foo}}',
                    birds: {
                        other: 'birds',
                        one: 'bird',
                        two: 'two birds',
                        few: 'some birds'
                    }
                }}
                locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        const t = i18n.plural('en');
        return <p>{t('warning', { birds: 2, foo: 'bar' })}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('WARNING: two birds, bar')).toBeInTheDocument();
});

test('Should fallback to default behaviour when no number is passed', () => {
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
                locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        const t = i18n.plural('en');
        return <p>{t('warning', { birds: 'no-number' })}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('WARNING: no-number')).toBeInTheDocument();
});

test('Should be able to pass a custom i18n instance', () => {
    const i18nInstance = I18n({
        en: { hello: 'Hello, world!' }
    });
    function Root() {
        return (
            <I18nProvider i18nInstance={i18nInstance} locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        return <p>{i18n.t('hello')}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('Hello, world!')).toBeInTheDocument();
});

test('Should be able to pass a custom i18n instance and langDict', () => {
    const i18nInstance = I18n();
    function Root() {
        return (
            <I18nProvider
                i18nInstance={i18nInstance}
                locale="en"
                lngDict={{ hello: 'Hello, world!' }}>
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();
        return <p>{i18n.t('hello')}</p>;
    }

    const { getByText } = render(<Root />);
    expect(i18nInstance.table('en')).toEqual({ hello: 'Hello, world!' });
    expect(getByText('Hello, world!')).toBeInTheDocument();
});

test('Should be able to set new keys without changing locale', () => {
    const i18nInstance = I18n({
        en: { hello: 'Hello, world!' }
    });
    function Root() {
        return (
            <I18nProvider i18nInstance={i18nInstance} locale="en">
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const i18n = useI18n();

        useEffect(() => {
            i18n.set('de', { hello: 'Hello, Welt!' });
        }, []);

        return <p>{i18n.t('hello')}</p>;
    }

    const { getByText } = render(<Root />);
    expect(i18nInstance.table('de')).toEqual({ hello: 'Hello, Welt!' });
    expect(getByText('Hello, world!')).toBeInTheDocument();
});
