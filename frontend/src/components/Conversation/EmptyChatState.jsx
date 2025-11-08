import React from 'react';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyChatState = () => {
    return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-background via-background to-muted/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-6 max-w-md px-8"
            >
                {/* Animated Icons */}
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        className="relative"
                    >
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-12 h-12 text-primary" />
                        </div>

                        {/* Decorative elements */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.2,
                            }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"
                        >
                            <Users className="w-4 h-4 text-blue-500" />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 10, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.4,
                            }}
                            className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"
                        >
                            <Sparkles className="w-4 h-4 text-purple-500" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-3">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-semibold text-foreground"
                    >
                        Chọn cuộc trò chuyện
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground text-sm leading-relaxed"
                    >
                        Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
                        hoặc tạo cuộc trò chuyện mới
                    </motion.p>
                </div>

                {/* Features List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 gap-3 w-full mt-4"
                >
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Tin nhắn nhanh</p>
                            <p className="text-xs text-muted-foreground">Gửi và nhận tin nhắn ngay lập tức</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Trò chuyện nhóm</p>
                            <p className="text-xs text-muted-foreground">Tạo và tham gia các nhóm chat</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Nhiều tính năng</p>
                            <p className="text-xs text-muted-foreground">Emoji, file, hình ảnh và nhiều hơn</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default EmptyChatState;
