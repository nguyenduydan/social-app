import React, { useState } from 'react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from 'sonner';
import { Mic, SendIcon, Smile, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import useConversationStore from '@/store/useConversationStore';
import { useAuthStore } from '@/store/useAuthStore';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const {
        currentConversation,
        sendDirectMessage,
        sendGroupMessage
    } = useConversationStore();

    const { user: currentUser } = useAuthStore();

    const handleSend = async () => {
        if (!message.trim() || !currentConversation || isSending) return;

        setIsSending(true);
        try {
            if (currentConversation.type === 'direct') {
                // Tìm recipient ID
                const recipientId =
                    currentConversation.participants.find(
                        p => String(p._id) !== String(currentUser?._id)
                    )?._id;

                if (!recipientId) {
                    toast.error('Không tìm thấy người nhận');
                    return;
                }

                await sendDirectMessage(
                    recipientId,
                    message,
                    currentConversation._id
                );
            } else {
                await sendGroupMessage(
                    currentConversation._id,
                    message
                );
            }

            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEmojiClick = () => {
        toast.info('Tính năng emoji đang được phát triển');
    };

    const handleVoiceClick = () => {
        toast.info('Tính năng ghi âm đang được phát triển');
    };

    if (!currentConversation) {
        return (
            <div className='flex items-center justify-center h-full'>
                <p className='text-sm text-muted-foreground'>
                    Chọn một cuộc trò chuyện để gửi tin nhắn
                </p>
            </div>
        );
    }

    return (
        <div className='flex items-center gap-2 justify-between'>
            {/* Input */}
            <div className='flex-11'>
                <InputGroup className="h-13 shadow-lg bg-card/70 dark:bg-card/70 backdrop-blur-md">
                    <InputGroupInput
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                    />
                    <InputGroupAddon>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleEmojiClick}
                            disabled={isSending}
                        >
                            <Smile className='size-5 ml-3' />
                        </Button>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            size="icon-xs"
                            onClick={handleSend}
                            disabled={!message.trim() || isSending}
                        >
                            {isSending ? (
                                <Loader2 className='size-5 mr-6 animate-spin' />
                            ) : (
                                <SendIcon className='size-5 mr-6 ml-4' />
                            )}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            {/* Voice */}
            <div className='flex-1 justify-center flex'>
                <Button
                    className="rounded-full w-9 h-9"
                    onClick={handleVoiceClick}
                    disabled={isSending}
                >
                    <Mic className='size-5' />
                </Button>
            </div>
        </div>
    );
};

export default MessageInput;
