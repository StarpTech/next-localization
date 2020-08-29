import { useI18n } from 'next-localization';

export default function Title({ username }) {
    const i18n = useI18n();
    return <h1>{i18n.t('intro.welcome', { username })}</h1>;
}
