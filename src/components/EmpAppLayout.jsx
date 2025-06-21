import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import EmployeeHeader from './EmployeeHeader';

const AppLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
            <EmployeeHeader />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AppLayout;
