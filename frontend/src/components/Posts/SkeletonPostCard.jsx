import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const FeedCardSkeleton = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <Card className="px-8 py-10 bg-card gap-2 shadow-md border-0 rounded-2xl min-h-[500px]">
                {/* Header */}
                <CardHeader className="pb-0 px-0 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="px-3 py-4 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                </CardContent>

                {/* Media */}
                <CardContent className="p-0">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                </CardContent>

                {/* Actions (Like, Comment, Share) */}
                <CardContent className="px-3 pt-4 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeedCardSkeleton;
