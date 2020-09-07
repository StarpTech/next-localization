import { useI18n, withPlural, getPreferredLanguage, parseLanguage, I18n } from '.';

let i18n = I18n();
i18n.locale('de');

i18n = I18n({ en: { foo: 'bar' } });
i18n.locale('de');

const { locale, set, t, table } = useI18n<Record<string, Object | string | number>>();

locale('en');
locale('en', { foo: 'bar' });

set('en', { foo: 'bar' });

t('a.b', { foo: 3 });

table('de');

const p = withPlural('en-US');

p.locale('en');
p.locale('en', { foo: 'bar' });

p.set('en', { foo: 'bar' });

p.t('a.b', { foo: 3 });

p.table('de');

getPreferredLanguage(['de']);
parseLanguage('de');
