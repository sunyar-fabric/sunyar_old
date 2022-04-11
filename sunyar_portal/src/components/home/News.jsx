import React from 'react';
import pic from '../../static/image/news1.jpg';
import pic2 from '../../static/image/news3.jpg';
import pic3 from '../../static/image/news2.jpg';

const News = () => {
    return (

        <div className='container mx-auto mb-4 p-5' id='info'>
            <div className='mt-3 mb-5'>
                <h2 className='font-weight-bolder text-center' style={{ color: "rgb(107, 107, 107)" }}>اخبـــــار</h2>
            </div>
            <div className='container row mx-auto'>
                <div className='col-12 col-md-4 my-2'>
                    <div class="card" style={{ width: "18rem;" }}>
                        <img class="card-img-top" src={pic} alt="" />
                        <div class="card-body mb-0">
                            <h5 class="card-title text-center" style={{ color: "rgb(107, 107, 107)" }}>اهدای ۳۵۰ سری جهیزیه</h5>
                            <p class="card-text  news_note">
                                همزمان با ایام دهه کرامت مراسم اهدای ۳۵۰ سری جهیزیه به مددجویان و نوعروسان نیازمند استان آذربایجان ‌شرقی، دوشنبه ۳۱ خرداد ماه با حضور خانم وحیدی، قائم مقام شبکه سانیار برگزار شد. شرکت در جلسه شورای اداری و دیدار با مددجویان تحت حمایت از برنامه‌های دیگر سفر قائم مقام به تهران بود.
                            </p>
                        </div>
                        <ul class="list-group list-group-flush mt-0">
                            <li class="list-group-item"></li>
                            <li class="list-group-item text-center h6 cursor-pointer ">بیشتر</li>
                        </ul>
                    </div>
                </div>
                <div className='col-12 col-md-4 my-2'>
                    <div class="card" style={{ width: "18rem;" }}>
                        <img class="card-img-top" src={pic2} alt="" />
                        <div class="card-body mb-0">
                            <h5 class="card-title text-center" style={{ color: "rgb(107, 107, 107)" }}>کلاس‌های کنکور</h5>
                            <p class="card-text  news_note">حجت‌الاسلام علی جعفری با اشاره به نزدیک شدن کنکور سراسری افزود: در تعامل با موسسات آموزشی کشور، ۱۸ هزار نفر از دانش‌آموزان تحت حمایت شبکه سانیاراز خدمات کلاس‌های کنکور و جمع‌بندی این موسسات برای کنکور ۱۴۰۰ برخوردار شدند.</p>
                        </div>
                        <ul class="list-group list-group-flush mt-0">
                            <li class="list-group-item"></li>
                            <li class="list-group-item text-center h6 cursor-pointer ">بیشتر</li>
                        </ul>
                    </div>
                </div>
                <div className='col-12 col-md-4 my-2'>
                    <div class="card" style={{ width: "18rem;" }}>
                        <img class="card-img-top" src={pic3} alt="" />
                        <div class="card-body mb-0">
                            <h5 class="card-title text-center" style={{ color: "rgb(107, 107, 107)" }}>اهدای ۳۲۰ سری جهیزیه</h5>
                            <p class="card-text  news_note">مراسم اهدای ۳۲۰ سری جهیزیه ، ۱۰۰۰ دستگاه وسایل سرمایشی و ۱۵۰۰ بسته معیشتی به مددجویان و نیازمندان استان چهارمحال و بختیاری، پنج‌شنبه سوم تیرماه با حضور معاونان اداری و مالی و حمایت و سلامت خانواده و مدیران کل مددکاری و برنامه ریزی شبکه سانیار برگزار شد.</p>
                        </div>
                        <ul class="list-group list-group-flush mt-0">
                            <li class="list-group-item"></li>
                            <li class="list-group-item text-center h6 cursor-pointer ">بیشتر</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default News;