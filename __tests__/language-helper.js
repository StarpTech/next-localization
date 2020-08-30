import { parseLanguage, getPreferredLanguage } from './../src/index';

test('Should parse BCP 47 language', () => {
    expect(parseLanguage('de-DE')).toEqual({ full: 'de-DE', language: 'de', region: 'DE' });
    expect(parseLanguage('de')).toEqual({ full: 'de', language: 'de' });
});

test('Should return best client language', () => {
    navigator.languages = ['en-US'];
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual({
        full: 'en',
        language: 'en'
    });

    navigator.languages = ['de'];
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual({
        full: 'de-DE',
        language: 'de',
        region: 'DE'
    });

    navigator.languages = [];
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual(null);
    navigator.languages = ['en'];
    expect(getPreferredLanguage([])).toEqual(null);
    navigator.languages = undefined;
    expect(getPreferredLanguage()).toEqual(null);
});
