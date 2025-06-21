import React from 'react';
import EmpAppLayout from '../components/EmpAppLayout';
import SubmitReportForm from '../components/SubmitReportForm';

const SubmitReportFormPage = () => {
    return (
        <EmpAppLayout>
            <SubmitReportForm />

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

export default SubmitReportFormPage;
