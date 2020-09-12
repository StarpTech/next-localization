import { getPreferredLanguage, parseLanguage } from './../src/index';

test('Should parse BCP 47 language', () => {
    expect(parseLanguage('de-DE')).toEqual({ full: 'de-DE', language: 'de', region: 'DE' });
    expect(parseLanguage('de')).toEqual({ full: 'de', language: 'de' });
});

test('Should return best client language based on browser navigator.languages', () => {
    navigator.languages = ['de-DE', 'en-DE', 'de', 'en-GB', 'en-US', 'en'];
    // Should exact match without region
    expect(getPreferredLanguage(['pl', 'de'])).toEqual({
        full: 'de',
        language: 'de'
    });

    navigator.languages = ['de', 'de-DE'];
    // Should match exact with region
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual({
        full: 'de-DE',
        language: 'de',
        region: 'DE'
    });

    navigator.languages = ['de'];
    // Should fallback from lang+region to lang
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual({
        full: 'de',
        language: 'de'
    });

    navigator.languages = ['de'];
    // Should choose exact match over lang+region
    expect(getPreferredLanguage(['en', 'de-DE', 'de'])).toEqual({
        full: 'de',
        language: 'de'
    });
});

test('Should return null when no match', () => {
    navigator.languages = [];
    expect(getPreferredLanguage(['en', 'de-DE'])).toEqual(null);
    navigator.languages = ['en'];
    expect(getPreferredLanguage([])).toEqual(null);
});
