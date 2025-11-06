import React from "react";

const groups = [
    { id: 1, name: "React Devs", members: 24 },
    { id: 2, name: "Design Team", members: 12 },
    { id: 3, name: "Work Project", members: 8 },
];

const GroupList = () => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Groups</h3>
            <div className="space-y-2">
                {groups.map((g) => (
                    <div
                        key={g.id}
                        className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                    >
                        <div className="font-medium text-green-400">{g.name}</div>
                        <div className="text-sm text-zinc-400">
                            {g.members} members
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupList;
