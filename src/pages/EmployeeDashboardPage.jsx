import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import Dash from './Dash';

const EmployeeDashboardPage = () => {
    return (
        <EmpAppLayout>
            <Dash />

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

export default EmployeeDashboardPage;
