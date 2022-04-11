import React, { useContext, useEffect, useState } from 'react';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import img from '../../static/image/img.png';
import { toastSuccess } from '../../util/ToastUtil';
import DatePicker from 'react-multi-date-picker';
import { persianToTimestamp, fixNumbers } from '../../util/DateUtil';
import { readFileDataAsBase64 } from '../../util/FileUtil';
import NeedyDeletetDialog from '../dialogs/NeedyDeletetDialog';
import { useHistory } from 'react-router';
import Pagination from '../common/PaginationServer';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import colors from 'react-multi-date-picker/plugins/colors';

const NeedyDefine = () => {

    const { setLoadingDialog } = useContext(MainContext)
    const [personId, setPersonId] = useState('');
    const [imageBlob, setImageBlob] = useState([])
    const [index, setIndex] = useState('');
    const [needys, setNeedys] = useState([]);
    const [needyDeletetDialog, setNeedyDeletetDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)
    const [nameInput, setNameInput] = useState('');
    const [familyInput, setFamilyInput] = useState('');
    const [nationalInput, setNationalInput] = useState('');
    const [sexInput, setSexInput] = useState('');
    const history = useHistory()


    const setInputSexFunc = async (e) => {

        setSexInput(e.target.value)
    }

    const setInputNationalFunc = async (e) => {

        setNationalInput(e.target.value)
    }

    const setInputFamilyFunc = async (e) => {

        setFamilyInput(e.target.value)
    }

    const setInputNameFunc = async (e) => {

        setNameInput(e.target.value)
    }


    const search = async (e) => {
        try {
            console.log(e.target.value);
            const { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalSearch?page=${currentPage - 1}&name=${nameInput}&nationalCode=${nationalInput}&family=${familyInput}&personType=2${sexInput === 'all' ? '' : `&sex=${sexInput}`}`)
           
            if (status === 200) {
                for (let index = 0; index < data.length; index++) {
                    data[index].sex = data[index].sex === false ? 'مرد' : 'زن'
                    if (data[index].personType === '2') {
                        data[index].personType = 'نیازمند'
                    }
                }
                setNeedys(data)
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }


    const getNeedys = async () => {

        setLoadingDialog(true)
        try {
            const { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalPagination?page=${currentPage - 1}&personType=2`)
            if (status === 200) {
                for (let index = 0; index < data.length; index++) {
                    data[index].sex = data[index].sex === false ? 'مرد' : 'زن'
                    if (data[index].personType === '2') {
                        data[index].personType = 'نیازمند'
                    }
                }
                setNeedys(data)
                console.log('dataaaaaaaaaaaa', data);
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleEditNeedy = async (id) => {
        history.push(`/editNeedy/${id}`)
    }

    const handleDeleteNeedy = async (id) => {
        setNeedyDeletetDialog(true)
        setPersonId(id)
    }

    const handleSubmitFlie = async (nationalCode) => {
        try {
            let file = document.getElementById('userImageThumb').files[0];
            if (file) {
                let { status } = await HttpService.put(`api/admin/user/${nationalCode}/file`, await readFileDataAsBase64(file), {
                    headers: {
                        "Content-Type": "image/*"
                    }
                });
                if (status === 204) {
                    return true
                } else return false
            }
        } catch (error) { }
    };



    const handleUploadEquipmentFile5 = async (e) => {
        if (FileReader && e.target.files[0]) {
            var fr = new FileReader();
            fr.onload = function () {
                document.getElementById('news5Img').src = fr.result;
            }
            await fr.readAsDataURL(e.target.files[0]);
        }
    };


    const handleUploadImageThumbnail = async (e) => {

        try {
            if (FileReader && e.target.files[0]) {
                var file = ''
                var file = e.target.files[0];
                if (file.size > 100000) {
                    alert("حجم فایل بارگذاری شده بیشتر از 100 کیلوبایت است!");
                    var file = ''
                } else {
                    var fr = new FileReader();
                    fr.onload = function () {
                        document.getElementById('personalImg').src = fr.result;
                        setImageBlob(fr.result)
                    }
                    await fr.readAsDataURL(e.target.files[0]);
                    fr.readAsText(file);
                }

            }
        } catch (error) { }
    };

    const handleCreateNeedy = async () => {

        const name = document.getElementById('name').value
        const family = document.getElementById('family').value
        const sex = document.getElementById('sex').value
        const nationalCode = document.getElementById('nationalCode').value
        const idNumber = document.getElementById('idNumber').value
        const birthDate = document.getElementById('birthDate').value
        const birthPlace = document.getElementById('birthPlace').value
        const personPhoto = imageBlob.length > 0 ? imageBlob : null;

        let date = birthDate.split('/')

        const body = { name, family, nationalCode, idNumber, personPhoto, sex, birthDate: persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2]))), birthPlace, personType: '2' }
        setLoadingDialog(true)
        try {
            const { status } = await HttpService.post(`/api/cms/um/personal`, body)
            if (status === 200) {
                setIndex('')
                toastSuccess('اطلاعات نیازمند با موفقیت ذخیره گردید!')
                getNeedys()
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    useEffect(() => {
        getNeedys()
    }, [currentPage]);

    return (

        <div className="d-flex flex-column align-items-center">

            {needyDeletetDialog ?
                <NeedyDeletetDialog
                    personId={personId}
                    getNeedys={getNeedys}
                    showDialog={needyDeletetDialog}
                    closeDialog={() => setNeedyDeletetDialog(false)}
                /> : null}


            <ul className="d-flex border card-heading list-style-type-none">
                <li className={`cursor-pointer p-2 border-radius-10px ${index === '' ? "active-card-heading" : 'bg-header A7BBCB'} `} onClick={() => setIndex('')}>
                    تعریف نیازمند
                </li>
                <li className={`cursor-pointer p-2 A7BBCB ${index === 'createNeedy' ? "active-card-heading rounded-0" : ''}`} onClick={() => setIndex('createNeedy')}>
                    مشخصات فرد
                </li>
            </ul>

            {index === 'createNeedy' ?

                <div className="bg-white m-4 d-flex rounded justify-content-center flex-column align-items-center">

                    <div className="row m-3">

                        <div className="col-6 text-center">
                            <input required type="text" id="name" name="name" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام " />
                        </div>
                        <div className="col-6 text-center">
                            <input required type="text" id="family" name="family" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام خانوادگی" />
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> ماهیت </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="personType" name="personType">
                                    <option value="1" disabled>پرسنل</option>
                                    <option value="2" selected>نیازمند</option>
                                    <option value="3" disabled>خیّر</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <div class="bg-input-dialog p-0 mt-3 w-100 d-flex h-75 align-items-center">
                                <span class="border border-radius-0-05rem-05rem-0 p-2"> جنسیت </span>
                                <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="sex" name="sex">
                                    <option value={true}>زن</option>
                                    <option value={false}>مرد</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="nationalCode" name="nationalCode" className="bg-input-dialog mt-3 w-100 p-2" placeholder="کد ملی" />
                        </div>
                        <div className="col-6 text-center">
                            <input required type="text" id="idNumber" name="idNumber" className="bg-input-dialog mt-3 w-100 p-2" placeholder="شماره شناسنامه" />
                        </div>

                        <div className="col-6 text-center">
                            <DatePicker
                                locale={persian_fa}
                                calendar={persian}
                                editable={false}
                                maxDate={new Date().getTime()}
                                inputMode='none'
                                inputClass='w-100 bg-input-dialog mt-3 p-2'
                                containerClassName="w-100"
                                placeholder="تاریخ تولد "
                                id="birthDate"
                                multiple={false} />
                        </div>

                        <div className="col-6 text-center">
                            <input required type="text" id="birthPlace" name="birthPlace" className="bg-input-dialog mt-3 w-100 p-2" placeholder="محل تولد" />
                        </div>

                        <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                        </div>

                        <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                            <img src={img} id='personalImg' className="p-2 border-radius-09rem" style={{ maxWidth: "50px" }} />
                            <label className="bg-input-dialog text-center cursor-pointer d-flex align-items-center justify-content-center mb-0 p-2" style={{ borderRadius: "0.5rem 0 0 0.5rem" }}>
                                <input
                                    onChange={(e) => handleUploadImageThumbnail(e, 'personalImg')}
                                    type="file"
                                    title="&nbsp;"
                                    accept="image/png, image/jpeg"
                                    className="form-control-file text-center d-none border-radius-05rem-0-0-05rem cursor-pointer"
                                    id="personalImageThumb"
                                />
                                انتخاب‌ عکس
                                <i className="fa fa-camera mr-1" aria-hidden="true"></i>
                            </label>
                        </div>


                    </div>

                    <div className="d-flex my-4 align-self-end mx-3"><a className="btn btn-info ml-3 px-5" onClick={handleCreateNeedy}>ثبت</a></div>

                </div>
                :
                <>
                    <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                        <form className="w-100 d-flex justify-content-start mr-4">
                        </form>
                        <button className="d-flex align-items-center admin-btn text-white align-self-end m-3 mx-4" onClick={() => setIndex('createNeedy')}>
                            <i className="fa fa-plus bg-pluse"></i>
                            <p className="mb-0 mr-2 ml-5 my-1">افزودن</p>
                        </button>
                    </div>

                    <div className="table-responsive border table-width mb-5">
                        <table class="table p-0 m-0">
                            <thead className="">
                                <tr className="text-center">
                                    <th scope="col">
                                        <p>نام</p>
                                        <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                            <input id="searchName" className="bg-input-dialog p-2 bg-white border border-radius-11px-11px-11px-11px" type="text" onInput={ setInputNameFunc} />
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <p>نام‌خانوادگی</p>
                                        <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                            <input id="searchFamily" className="bg-input-dialog p-2 bg-white border border-radius-11px-11px-11px-11px" type="text" onInput={setInputFamilyFunc} />
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <p>کد ملی</p>
                                        <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                            <input id="searchNatCode" className="bg-input-dialog p-2 bg-white border border-radius-11px-11px-11px-11px" type="text" onInput={setInputNationalFunc} />
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <p>جنسیت</p>
                                        <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                            <select
                                                className='w-100 bg-input-dialog p-1 bg-white border border-radius-11px-11px-11px-11px'
                                                onChange={setInputSexFunc}
                                            >
                                                <option value='all'>همه</option>
                                                <option value={true}>زن</option>
                                                <option value={false} >مرد</option>

                                            </select>
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <p>ماهیت</p>
                                        <i className="fa fa-search bg-input-dialog2 fa-1x cursor-pointer" onClick={search} aria-hidden="true"> </i>
                                    </th>
                                    <th scope="col"> کد رمز </th>
                                    <th scope="col">  </th>
                                    <th scope="col">
                                        <div className='d-flex align-items-center border'>
                                        

                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {needys.map((ss, index) => (
                                    <tr className="text-center">
                                        <td className='border border-bottom-0'>{ss.name}</td>
                                        <td className='border border-bottom-0'>{ss.family}</td>
                                        <td className='border border-bottom-0'>{ss.nationalCode}</td>
                                        <td className='border border-bottom-0'>{ss.sex}</td>
                                        <td className='border border-bottom-0'>{ss.personType}</td>
                                        <td className='border border-bottom-0'>{ss.secretCode}</td>
                                        <td className='border border-bottom-0'><img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => handleDeleteNeedy(ss.personId)} alt="" /></td>
                                        <td className=''><img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} alt="" onClick={() => handleEditNeedy(ss.personId)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {needys && count > 12 ?
                        <Pagination
                            total={count}
                            currentPage={currentPage}
                            perPage={12}
                            onPageChange={(page) => setCurrentPage(page)}
                        /> : null}

                </>
            }

        </div>
    );
}

export default NeedyDefine;





    // const setInputNameFunc = async (name) => {
    //     try {
    //         console.log(name);
    //         const { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalSearch?page=${currentPage - 1}&personType=2&name=${name}`)
    //         if (status === 200) {
    //             for (let index = 0; index < data.length; index++) {
    //                 data[index].sex = data[index].sex === false ? 'مرد' : 'زن'
    //                 if (data[index].personType === '2') {
    //                     data[index].personType = 'نیازمند'
    //                 }
    //             }
    //             setNeedys(data)
    //             setCount(headers['count'])
    //         }
    //     } catch (error) { }
    //     setLoadingDialog(false)
    // }

    // const setInputFamilyFunc = async (e) => {
    //     try {
    //         const { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalSearch?page=${currentPage - 1}&personType=2&family=${e.target.value}`)
    //         if (status === 200) {
    //             for (let index = 0; index < data.length; index++) {
    //                 data[index].sex = data[index].sex === false ? 'مرد' : 'زن'
    //                 if (data[index].personType === '2') {
    //                     data[index].personType = 'نیازمند'
    //                 }
    //             }
    //             setNeedys(data)
    //             setCount(headers['count'])
    //         }
    //     } catch (error) { }
    //     setLoadingDialog(false)
    // }


    // const setInputNationalFunc = async (e) => {
    //     try {
    //         const { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalSearch?page=${currentPage - 1}&personType=2&nationalCode=${e.target.value}`)
    //         if (status === 200) {
    //             for (let index = 0; index < data.length; index++) {
    //                 data[index].sex = data[index].sex === false ? 'مرد' : 'زن'
    //                 if (data[index].personType === '2') {
    //                     data[index].personType = 'نیازمند'
    //                 }
    //             }
    //             setNeedys(data)
    //             setCount(headers['count'])
    //         }
    //     } catch (error) { }
    //     setLoadingDialog(false)
    // }


    // const setInputSexFunc = async (e) => {
    //     try {
    //         console.log(e.target.value);
    //         const { headers, status, data } = await HttpService.get(`/api/cms/um/personal/personalSearch?page=${currentPage - 1}&personType=2${e.target.value === 'all' ? '' : `&sex=${e.target.value}`}`)
    //         if (status === 200) {
    //             for (let index = 0; index < data.length; index++) {
    //                 data[index].sex = data[index].sex === false ? 'مرد' : 'زن'
    //                 if (data[index].personType === '2') {
    //                     data[index].personType = 'نیازمند'
    //                 }
    //             }
    //             setNeedys(data)
    //             setCount(headers['count'])
    //         }
    //     } catch (error) { }
    //     setLoadingDialog(false)
    // }


