import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import TaskScreen from '../components/TaskScreen';
import AdminTaskScreen from '../components/AdminTaskScreen';

const ManagerTasksPage = () => {
    return (
        <EmpAppLayout>
            <TaskScreen />

        </EmpAppLayout>
    );
};

const styles = {
    content: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#f8f9fa',
    },
};

export default ManagerTasksPage;
