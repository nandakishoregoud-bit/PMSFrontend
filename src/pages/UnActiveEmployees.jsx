import React from 'react';
import Sidebar from '../components/Sidebar';
import AppLayout from '../components/AppLayout';
import InactiveEmployees from '../components/InactiveEmployees';

const UnActiveEmployees = () => {
    return (
        <AppLayout>
            <InactiveEmployees />
            
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

export default UnActiveEmployees;
