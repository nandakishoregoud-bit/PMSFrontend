import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import TaskScreen from '../components/TaskScreen';
import AdminTaskScreen from '../components/AdminTaskScreen';
import EmployeeTaskScreen from '../components/EmployeeTaskScreen';

const EmployeeTaskScreenPage = () => {
    return (
        <EmpAppLayout>
            <EmployeeTaskScreen />

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

export default EmployeeTaskScreenPage;
