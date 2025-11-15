import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function NotificationSkeleton() {
    return (
        <div className="p-3">
            <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        </div>
    );
}

export function NotificationSkeletonList() {
    const items = Array(6).fill(0);

    return (
        <div>
            {items.map((_, i) => (
                <div key={i}>
                    <NotificationSkeleton />
                    {i < items.length - 1 && <Separator />}
                </div>
            ))}
        </div>
    );
}
