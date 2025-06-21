import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>© {new Date().getFullYear()} Admin Portal. All rights reserved.</p>
        </footer>
    );
};

const styles = {
    footer: {
        width: '100%',
        height: '50px',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',

        color: 'black',
        padding: '0px',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        boxSizing: 'border-box',
    },
};

export default Footer;
