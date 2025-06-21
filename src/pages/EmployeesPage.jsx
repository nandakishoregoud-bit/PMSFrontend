import React from 'react';
import Sidebar from '../components/Sidebar';
import EmployeeTable from '../components/EmployeeTable';
import AppLayout from '../components/AppLayout';

const EmployeesPage = () => {
    return (
        <AppLayout>
            <EmployeeTable />
        </AppLayout>
    );
};

export default EmployeesPage;
