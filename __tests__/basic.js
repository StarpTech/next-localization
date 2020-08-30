import React from 'react';
import { render } from '@testing-library/react';
import { I18nProvider, useI18n, usePlural } from './../src/index';

test('Should render key', () => {
    function Root() {
        return (
            <I18nProvider
                lngDict={{ hello: 'Hello, world!', welcome: 'Welcome, {{username}}!' }}
                locale={'en'}>
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
            <I18nProvider
                lngDict={{ hello: 'Hello, world!', welcome: 'Welcome, {{username}}!' }}
                locale={'en'}>
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
            <I18nProvider
                lngDict={{ hello: 'Hello, world!', welcome: 'Welcome, {{username}}!' }}
                locale={'en'}>
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
                locale={'en'}>
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const t = usePlural('en');
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
                locale={'en'}>
                <Child />
            </I18nProvider>
        );
    }
    function Child() {
        const t = usePlural('en');
        return <p>{t('warning', { birds: 'no-number' })}</p>;
    }

    const { getByText } = render(<Root />);
    expect(getByText('WARNING: no-number')).toBeInTheDocument();
});
