import { getPreferredLanguage, parseLanguage } from './../src/index';

test('Should parse BCP 47 language', () => {
    expect(parseLanguage('de-DE')).toEqual({ full: 'de-DE', language: 'de', region: 'DE' });
    expect(parseLanguage('de')).toEqual({ full: 'de', language: 'de' });
});

test('Should return best client language based on browser navigator.languages', () => {
    navigator.languages = ['en-US'];
    // Should fallback to language only because we have no exact region match
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual({
        full: 'en',
        language: 'en'
    });

    navigator.languages = ['en'];
    // Should exact match without region
    expect(getPreferredLanguage(['en-US', 'en', 'de-DE'])).toEqual({
        full: 'en',
        language: 'en'
    });

    navigator.languages = ['de'];
    // Should fallback to language
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual({
        full: 'de',
        language: 'de'
    });

    navigator.languages = ['de'];
    // Should choose exact match over lang+region
    expect(getPreferredLanguage(['en', 'de', 'de-DE'])).toEqual({
        full: 'de',
        language: 'de'
    });
});

test('Should return null when no match', () => {
    navigator.languages = [];
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual(null);
    navigator.languages = ['en'];
    expect(getPreferredLanguage([])).toEqual(null);
    navigator.languages = undefined;
    expect(getPreferredLanguage()).toEqual(null);
});
