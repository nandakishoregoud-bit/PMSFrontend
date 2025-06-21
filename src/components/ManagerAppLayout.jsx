import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ManagerHeader from './ManagerHeader';

const ManagerAppLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
            <ManagerHeader />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ManagerAppLayout;
