import React from 'react';
import Sidebar from '../components/Sidebar';
import AppLayout from '../components/AppLayout';
import AdminStats from '../components/AdminStats';

const DashboardPage = () => {
    return (
        <AppLayout>
                <AdminStats/>
            
        </AppLayout>
    );
};

const styles = {
    content: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#f8f9fa',
    },
};

export default DashboardPage;
