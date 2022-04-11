import React from 'react';
import Slider from '../home/Slider';
import Items from '../home/Items';
import About from '../home/About';
import News from '../home/News';
import Footer from '../common/Footer';
import MainNav from '../home/MainNav';
import Header from './Header';

const Home = () => {

    return (
        <div className='vh-100'>
            <Header />
            <MainNav/>
            <Slider/>
            <Items/>
            <About/>
            <News/>
            <Footer />
        </div>
    );
}

export default Home;