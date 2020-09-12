const simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;

// Parse a (BCP 47) language
export default function parseLanguage(str) {
    const match = simpleLanguageRegExp.exec(str);
    if (!match) return null;

    const language = match[1];
    const region = match[2];
    let full = language;

    if (region) full += `-${region}`;

    return {
        language,
        region,
        full
    };
}

export function getPreferredLanguage(availableLanguages = []) {
    let foundLng = '';
    const lng = navigator.languages.find((al) =>
        availableLanguages.find((bl) => {
            const a = parseLanguage(bl);
            const b = parseLanguage(al);
            if (a && b) {
                const sameLang = a.language === b.language;
                // check if we can find a fallback if no language matched
                if (sameLang) {
                    foundLng = a.language;
                }
                // in locale mode both must match exact
                if (a.region || b.region) {
                    return a.full === b.full;
                }
                return a.language === b.language;
            }
            return false;
        })
    );
    return parseLanguage(lng ?? foundLng);
}
