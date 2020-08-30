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
    const lng = availableLanguages.find((al) =>
        navigator.languages.find(
            (bl) => parseLanguage(bl)?.language === parseLanguage(al)?.language
        )
    );
    if (!lng) {
        return null;
    }
    return parseLanguage(lng);
}
