import Link from 'next/link';

const HomePage = () => {
    return (
        <div>
            <h1>next-localization</h1>
            <div>
                <Link href="/dashboard">
                    <a>Go to CSR example (/dashboard)</a>
                </Link>
            </div>
            <div>
                <Link href="/foo">
                    <a>Go to SSG example (/foo)</a>
                </Link>
            </div>
            <div>
                <Link href="/namespace">
                    <a>Go to code-splitting example (/namespace)</a>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
