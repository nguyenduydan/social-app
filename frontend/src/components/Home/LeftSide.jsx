// import React, { useState } from 'react';
import { useFriendStore } from '@/store/useFriendStore';
import FriendRequests from '../Friends/FriendRequests';
import InfoUserCard from './InfoUserCard';

const LeftSide = ({ className }) => {
    const {
        requests,
        loading,
    } = useFriendStore();

    return (
        <div className={`${className}`}>
            <InfoUserCard />
            {/* --- Lời mời kết bạn --- */}
            <FriendRequests requests={requests} loading={loading} />
        </div>
    );
};

export default LeftSide;
