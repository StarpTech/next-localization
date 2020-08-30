import React from 'react';
import { render } from '@testing-library/react';
import { I18nProvider, useI18n } from './../src/index';

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
