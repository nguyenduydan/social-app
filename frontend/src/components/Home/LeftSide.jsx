import React, { useState } from 'react';
import InfoUserCard from './InfoUserCard';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import CreatePost from '../Posts/CreatePost';
import { Plus } from 'lucide-react';

const LeftSide = ({ className }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${className}`}>
            <InfoUserCard />
            <div className="px-5">
                <Dialog
                    open={open}
                    onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setOpen(true)}
                            className={cn(
                                "w-full py-5 cursor-pointer rounded-2xl font-semibold text-md flex items-center justify-center gap-2",
                                "bg-gradient-primary text-white",
                                "hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]",
                                "transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                            )}
                        >
                            <Plus className="size-5 font-bold drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                            <span>Tạo bài viết</span>
                        </Button>
                    </DialogTrigger>
                    <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                </Dialog>
            </div>

        </div>
    );
};

export default LeftSide;
