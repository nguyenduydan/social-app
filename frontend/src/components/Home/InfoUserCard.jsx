import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FieldSeparator } from '../ui/field';

const InfoUserCard = () => {
    const stats = [
        { label: 'Posts', value: 142 },
        { label: 'Followers', value: 1254 },
        { label: 'Following', value: 389 }
    ];

    return (
        <div className='bg-muted'>
            <Card className="border-none shadow-soft overflow-hidden">
                <CardHeader className="flex flex-col items-center justify-center gap-6 pb-4">
                    <div className="relative">
                        <Avatar className="size-32 ring-4 ring-primary/20 ring-offset-4 ring-offset-background transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">ND</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 size-6 bg-status-online rounded-full border-4 border-background" />
                    </div>
                    <div className="text-center space-y-1">
                        <CardTitle className="text-2xl font-bold">Nguyen Thiet Duy Dan</CardTitle>
                    </div>
                </CardHeader>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-border/50" />

                <CardContent className="pt-6 pb-6">
                    <div className='grid grid-cols-3 gap-4'>
                        {stats.map((stat) => (
                            <button
                                key={stat.label}
                                className="flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:scale-105 group cursor-pointer"
                            >
                                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {stat.value}
                                </span>
                                <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors font-medium">
                                    {stat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InfoUserCard;
