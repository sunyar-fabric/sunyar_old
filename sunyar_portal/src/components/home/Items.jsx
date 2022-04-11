import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Items = () => {
    
    const [item, setItem] = useState('');

    const handleItems = async (it) => {
        setItem(it)
    }

    return (

        <div className='container mb-5 pb-5 '>
            <div className='d-flex justify-content-center marItem items-background flex-wrap'>
                <div className="col-12 col-sm-6 col-md-3 mt-4 " onClick={() => handleItems('')}>
                    <div className='mx-auto' id='sign' />
                    <h6> <Link className='mt-2 text-center cursor-pointer text-decoration-none text-dark d-block' to='/signup/register' >عضویت</Link></h6>
                </div>
                <div className="col-12 col-sm-6 col-md-3 mt-4" >
                    <div className=' mx-auto' id='plan' onClick={() => handleItems('plan')} />
                    <h6 className='mt-2 text-center cursor-pointer' onClick={() => handleItems('plan')}>طرح‌ها</h6>
                </div>
                <div className="col-12 col-sm-6 col-md-3 mt-4" >
                    <div className=' mx-auto' id='help' onClick={() => handleItems('')} />
                    <h6 className='mt-2 text-center cursor-pointer' onClick={() => handleItems('')}>واحدهای امداد</h6>
                </div>
                <div className="col-12 col-sm-6 col-md-3 mt-4">
                    <div className=' mx-auto' id='connect' onClick={() => handleItems('')} />
                    <h6 className='mt-2 text-center cursor-pointer' onClick={() => handleItems('')}>ارتباط با ما</h6>
                </div>
            </div>

            {item === "plan" ?
                <div className='myborder mt-5 '>

                    <div className='container row mx-auto mb-4'>
                        <div className='col-12 col-md-4 my-2'>
                            <div className="card" style={{ width: "18rem;", borderRight: "none", borderLeft: "none", borderTop: "none", borderBottomColor: "rgb(112,112,112)" }}>
                                <ul className="list-group list-group-flush mt-2 " style={{ color: "rgb(0,0,0)" }} >
                                    <li className="list-group-item text-right cursor-pointer py-3" style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر اول</li>
                                    <li className="list-group-item text-right cursor-pointer py-3 " style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر اول</li>
                                    <li className="list-group-item text-right cursor-pointer py-3 " style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر اول</li>
                                    <li className="list-group-item text-right cursor-pointer  py-3" style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر اول</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-12 col-md-4 my-2'>
                            <div className="card" style={{ width: "18rem;", borderRight: "none", borderLeft: "none", borderTop: "none", borderBottomColor: "rgb(112,112,112)" }}>
                                <ul className="list-group list-group-flush mt-2 " style={{ color: "rgb(0,0,0)" }} >
                                    <li className="list-group-item text-right cursor-pointer py-3" style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر دوم</li>
                                    <li className="list-group-item text-right cursor-pointer py-3 " style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر دوم</li>
                                    <li className="list-group-item text-right cursor-pointer py-3 " style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر دوم</li>
                                    <li className="list-group-item text-right cursor-pointer  py-3" style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر دوم</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-12 col-md-4 my-2'>
                            <div className="card" style={{ width: "18rem;", borderRight: "none", borderLeft: "none", borderTop: "none", borderBottomColor: "rgb(112,112,112)" }}>
                                <ul className="list-group list-group-flush mt-2 " style={{ color: "rgb(0,0,0)" }} >
                                    <li className="list-group-item text-right cursor-pointer py-3" style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر سوم</li>
                                    <li className="list-group-item text-right cursor-pointer py-3 " style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر سوم</li>
                                    <li className="list-group-item text-right cursor-pointer py-3 " style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر سوم</li>
                                    <li className="list-group-item text-right cursor-pointer  py-3" style={{ color: "rgb(190,190,190)", borderBottomColor: "rgb(112,112,112)" }}>تیتر سوم</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> : null}

        </div>
    )
}

export default Items;