import React from 'react';
import AppLayout from '../components/AppLayout';
import TaskScreen from '../components/TaskScreen';

const AssignTaskPage = () => {
    return (
        <AppLayout>
            <TaskScreen />

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

export default AssignTaskPage;
