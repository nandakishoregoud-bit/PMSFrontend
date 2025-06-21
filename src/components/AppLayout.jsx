import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AppLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
            <Header />
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
