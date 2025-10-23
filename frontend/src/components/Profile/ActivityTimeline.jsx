import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar } from 'lucide-react';

const ActivityTimeline = ({ activities }) => {
    return (
        <Card className="rounded-none rounded-b-md border-none shadow-none">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                            <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
export default ActivityTimeline;
