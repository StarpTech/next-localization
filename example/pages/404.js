import { useRouter } from 'next/router';

const NotFoundPage = () => {
    const router = useRouter();
    return (
        <div>
            <h1>Not found</h1>
            <div>Current locale: {router.locale}</div>
        </div>
    );
};

export default NotFoundPage;
