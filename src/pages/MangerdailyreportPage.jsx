import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import SubmitReportForm from '../components/SubmitReportForm';

import ManagerAppLayout from '../components/ManagerAppLayout';

const ManagerdailyreportPage = () => {
    return (
        <ManagerAppLayout>
            <SubmitReportForm />

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

export default ManagerdailyreportPage;
