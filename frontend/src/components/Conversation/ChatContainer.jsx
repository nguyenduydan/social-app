import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import Messager from './Messager';
import EmptyChatState from './EmptyChatState';
import useConversationStore from '@/store/useConversationStore';
import { useUIStore } from '@/store/useUIStore';

const ChatContainer = ({ className }) => {
    const { currentConversation } = useConversationStore();
    const { theme } = useUIStore();

    if (!currentConversation) {
        return (
            <aside className={`flex flex-col ${className}`}>
                <EmptyChatState />
            </aside>
        );
    }

    // Tách riêng background properties để tránh conflict với React
    const backgroundStyle = {};

    // Xử lý background image hoặc gradient
    if (theme?.backgroundImage) {
        backgroundStyle.backgroundImage = theme.backgroundImage;
    } else if (theme?.background) {
        // Nếu là gradient hoặc url
        if (theme.background.includes('gradient') || theme.background.includes('url(')) {
            backgroundStyle.backgroundImage = theme.background;
        } else {
            // Nếu là màu thuần
            backgroundStyle.backgroundColor = theme.background;
        }
    } else {
        backgroundStyle.backgroundColor = '#ffffff';
    }

    // Thêm các properties riêng lẻ
    if (theme?.backgroundSize) backgroundStyle.backgroundSize = theme.backgroundSize;
    if (theme?.backgroundPosition) backgroundStyle.backgroundPosition = theme.backgroundPosition;
    if (theme?.backgroundRepeat) backgroundStyle.backgroundRepeat = theme.backgroundRepeat;
    if (theme?.backgroundAttachment) backgroundStyle.backgroundAttachment = theme.backgroundAttachment;

    // Blur overlay nếu theme có blur
    const blurOverlayStyle = theme?.blur ? {
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 0,
        pointerEvents: 'none'
    } : null;

    return (
        <aside
            className={`flex flex-col ${className}`}
            style={{ ...backgroundStyle, position: 'relative' }}
        >
            {/* Blur overlay layer */}
            {blurOverlayStyle && <div style={blurOverlayStyle} />}

            {/* Content với relative positioning */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Chat Header - Transparent with blur */}
                <div className='backdrop-blur-md bg-transparent'>
                    <ChatHeader />
                </div>

                {/* Messager - Transparent */}
                <div className='flex-1 overflow-hidden'>
                    <Messager />
                </div>

                {/* MessageInput - Transparent with blur */}
                <div className='px-8 py-4 bg-transparent'>
                    <MessageInput />
                </div>
            </div>
        </aside>
    );
};

export default ChatContainer;
