import * as React from 'react';
import { I18nProvider } from '.';

function Component() {
    return null;
}

export default function App() {
    return (
        <I18nProvider locale="de" lngDict={{}}>
            <Component />
        </I18nProvider>
    );
}
