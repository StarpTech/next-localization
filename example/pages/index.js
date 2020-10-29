import Link from 'next/link';

const HomePage = () => {
    return (
        <div>
            <h1>next-localization</h1>
            <div>
                <Link href="/dashboard">
                    <a>Go to dashboard page</a>
                </Link>
            </div>
            <div>
                <Link href="/foo">
                    <a>Go to post page (/foo)</a>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
