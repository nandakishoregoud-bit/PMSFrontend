import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import EmployeeProjects from '../components/EmployeeProjects';
import ManagerAppLayout from '../components/ManagerAppLayout';

const ManagerProjectsPage = () => {
    return (
        <ManagerAppLayout>
            <EmployeeProjects />

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

export default ManagerProjectsPage;
