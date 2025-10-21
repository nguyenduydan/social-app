import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const FeedCardSkeleton = () => {
    return (
        <div className="max-w-3xl mx-auto animate-pulse">
            <Card className="px-8 py-10 bg-card gap-2 shadow-md border-0 rounded-2xl">
                {/* Header */}
                <CardHeader className="pb-0 px-0 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>

                {/* Content */}
                <CardContent className="px-3 py-4 space-y-3">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                </CardContent>

                {/* Media */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Skeleton className="w-full aspect-video rounded-lg" />
                        <Skeleton className="w-full aspect-video rounded-lg" />
                    </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex justify-between items-center px-5 pt-5">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                </CardFooter>
            </Card>
        </div>
    );
};

export default FeedCardSkeleton;
