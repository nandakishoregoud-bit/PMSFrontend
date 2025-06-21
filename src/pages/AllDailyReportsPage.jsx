import React from 'react';
import AllDailyReports from '../components/AllDailyReports';
import AppLayout from '../components/AppLayout';

const AllDailyReportsPage = () => {
    return (
        <AppLayout>
            <AllDailyReports />

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

export default AllDailyReportsPage;
