import React from 'react';
import AppLayout from '../components/AppLayout';
import ManagerAppLayout from '../components/ManagerAppLayout';
import TaskScreen from '../components/TaskScreen';

const ManagerTaskPage = () => {
    return (
        <ManagerAppLayout>
            <TaskScreen />

        </ManagerAppLayout>
    );
};

const styles = {
    content: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#f8f9fa',
    },
};

export default ManagerTaskPage;
