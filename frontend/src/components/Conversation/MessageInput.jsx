import React from 'react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from 'sonner';
import { Mic, SendIcon, Smile } from 'lucide-react';
import { Button } from '../ui/button';

const MessageInput = () => {

    const handleSend = () => {
        toast.success("Đã gửi tin nhắn");
    };
    return (
        <div className='flex items-center gap-2 justify-between'>
            {/* Input */}
            <div className='flex-11'>
                <InputGroup className="h-13 shadow-lg bg-card dark:bg-card ">
                    <InputGroupInput placeholder="Ab..." />
                    <InputGroupAddon>
                        <Smile className='size-5' />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            size="icon-xs"
                            onClick={handleSend}
                        >
                            <SendIcon className='size-5 mr-6' />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            {/* Voice */}
            <div className='flex-1 justify-center flex'>
                <Button className="rounded-full w-9 h-9">
                    <Mic className='size-5' />
                </Button>
            </div>
        </div>
    );
};

export default MessageInput;
