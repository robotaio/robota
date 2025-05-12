import Link from 'next/link';
import Header from './components/Header';

export default function NotFound() {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-bold mb-6">404</h1>
                <p className="text-xl mb-8">페이지를 찾을 수 없습니다.</p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </>
    );
} 