import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../context/MainContext';
import Carousel from 'react-multi-carousel';
import "../../static/css/react-carousel.css";

const Slider = () => {

    const [tag, setTag] = useState("")
    const { setLoadingDialog } = useContext(MainContext)

    const handleSearch = async (e) => {
        e.preventDefault()
        getByTag()
    }

    useEffect(() => {
        if (tag)
            getByTag()
    }, []);

    useEffect(() => {
        getByTag()
    }, []);

    const getByTag = async () => {

        setLoadingDialog(true)

        setLoadingDialog(false)
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };


    return (
        <div>
            <div className=' row' style={{ direction: 'ltr', position: 'relative', height: '500px' }}>
                <Carousel
                    swipeable={true}
                    draggable={false}
                    showDots={false}
                    responsive={responsive}
                    infinite={false}
                    keyBoardControl={true}
                    customTransition="all .5"
                    beforeChange={(page) => console.log(page)}
                    transitionDuration={1000}
                    customRightArrow={<CustomRightArrow />}
                    customLeftArrow={<CustomLeftArrow />}
                    itemClass="carousel-item-padding-40-px"
                    className='w-100 h-100 position-absolute'
                >
                    <div className='slider-img'></div>
                    <div className='slider-img'></div>
                    <div className='slider-img'></div>
                </Carousel>

                <div className="mt-5 w-100 justify-content-center" style={{ zIndex: '100', direction: 'rtl' }}>
                    <form onSubmit={(e) => handleSearch(e)} id="searchForm" className="d-flex shadow p-2 bg-white rounded-pill mx-auto" style={{ maxWidth: '500px' }}>
                        <input id='search-input' className="text-info  border-0 mx-3 w-100" required="required" value={tag} onChange={(e) => setTag(e.target.value)} type="text" placeholder="جستجو کنید" />
                        <button id="searchIcon" className="border-0 btn themeColor">
                            <i className="fa fa-search text-info" ></i>
                        </button>
                    </form>
                </div>
            </div>
            <div className='d-flex'>

                <div className=' my-0 col-md-4' />

                < div className=' my-0 col-md-4' />
                <div className='slider-line my-0 col-md-4' />

            </div>
        </div>

    )
}


function CustomRightArrow({ onClick }) {
    return (
        <button
            onClick={() => onClick()}
            aria-label="Go to next slide"
            className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
        />
    );
}

function CustomLeftArrow({ onClick }) {
    return (
        <button
            onClick={() => onClick()}
            aria-label="Go to next slide"
            className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
        />
    );
}


export default Slider;