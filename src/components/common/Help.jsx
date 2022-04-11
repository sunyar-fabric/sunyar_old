import React from 'react';
import Footer from './Footer';
import Poster from '../help/Poster';
import Helpform from '../help/Helpform';
import MainNav from '../home/MainNav';
import Header from './Header';


const Help = () => {
    return (
        <div>
            <Header />
            <MainNav />
            <Poster />
            <Helpform />
            <Footer />
        </div>
    )
}

export default Help;