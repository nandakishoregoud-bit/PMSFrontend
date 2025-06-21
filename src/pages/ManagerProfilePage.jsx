import React from 'react';
import UserProfile from '../components/UserProfile';
import AppLayout from '../components/AppLayout';
import ManagerAppLayout from '../components/ManagerAppLayout';

const ManagerProfilePage = () => {
    return (
        <ManagerAppLayout>
            <UserProfile />

        </ManagerAppLayout>
    );
};

export default ManagerProfilePage;
