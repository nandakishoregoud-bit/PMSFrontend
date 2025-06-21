import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import EmployeeProjects from '../components/EmployeeProjects';

const EmployeeProjectsPage = () => {
    return (
        <EmpAppLayout>
            <EmployeeProjects />

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

export default EmployeeProjectsPage;
