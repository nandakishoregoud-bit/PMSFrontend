import React from 'react';
import AppLayout from '../components/AppLayout';
import TaskScreen from '../components/TaskScreen';
import AdminTaskScreen from '../components/AdminTaskScreen';

const AdminTaskScreenPage = () => {
    return (
        <AppLayout>
            <AdminTaskScreen />

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

export default AdminTaskScreenPage;
