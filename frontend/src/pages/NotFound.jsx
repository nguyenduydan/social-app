import React from 'react';
import { Link } from 'react-router';
import logo from '@/assets/logo/logo.png';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-glass">
            <div className="text-center space-y-8 p-8">
                {/* Logo */}
                <div className="mb-12">
                    <Link to="/" className="inline-block">
                        <div className="relative w-[200px] h-[60px] mx-auto">
                            <img
                                src={logo} // Đảm bảo thêm logo vào thư mục public
                                alt="Logo"
                                className="object-contain"
                            />
                        </div>
                    </Link>
                </div>

                {/* Error Code Animation */}
                <div className="relative">
                    <h1 className="text-[150px] font-bold text-gray-800 md:text-[200px] font-sans">
                        404
                    </h1>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-[150px] font-bold animate-pulse md:text-[200px] font-sans">
                        404
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">
                        Rất tiếc! Không tìm thấy trang
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên,
                        hoặc tạm thời không khả dụng.
                    </p>
                </div>

                {/* Back to Home Button */}
                <Link
                    to="/"
                    className="inline-flex items-center px-8 py-3 text-sm font-medium text-white transition-colors bg-primary rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 group"
                >
                    <svg
                        className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Trở về trang chủ
                </Link>

                {/* Decorative Elements */}
                <div className="fixed inset-0 pointer-events-none opacity-30">
                    <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/20 animate-blob"></div>
                    <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-primary/20 animate-blob animation-delay-2000"></div>
                    <div className="absolute left-1/3 bottom-1/4 h-32 w-32 rounded-full bg-primary/20 animate-blob animation-delay-4000"></div>
                </div>

                <style jsx>{`
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite ease-in-out;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default NotFound;
