import React from "react";

const users = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    lastMessage: "Hey, how’s it going?",
}));

const UserList = () => {
    return (
        <div className="space-y-2 ">
            {users.map((u) => (
                <div
                    key={u.id}
                    className="p-3 rounded-md hover:bg-muted cursor-pointer transition-colors"
                >
                    <div className="font-medium text-green-400">{u.name}</div>
                    <div className="text-sm text-zinc-400 truncate">
                        {u.lastMessage}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
