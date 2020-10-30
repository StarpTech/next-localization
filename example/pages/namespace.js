import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DynamicComponent = dynamic(() => import('../components/namespace'));

const Dashboard = () => {
    const router = useRouter();

    return (
        <div>
            <DynamicComponent />
            <div>Current locale: {router.locale}</div>
            <div>
                <Link href="/namespace" locale="en">
                    <a>Change language to (en)</a>
                </Link>
            </div>
            <div>
                <Link href="/namespace" locale="de">
                    <a>Change language to (de)</a>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
