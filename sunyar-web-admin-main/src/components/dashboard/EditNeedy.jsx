import React, { useContext, useEffect, useState } from 'react';
import ReactTable from "react-table";
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import DatePicker from 'react-multi-date-picker';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import { toastSuccess } from '../../util/ToastUtil';
import { useHistory } from 'react-router';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import EditNeedyAccountDialog from '../dialogs/EditNeedyAccountDialog';
import DeleteNeedyAccountDialog from '../dialogs/DeleteNeedyAccountDialog';
import Pagination from '../common/PaginationUi';
import CreateNeedyAccountDialog from '../dialogs/CreateNeedyAccountDialog';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import axios from 'axios';

const EditNeedy = ({ personId }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [deleteNeedyAccountDialog, setDeleteNeedyAccountDialog] = useState(false);
    const [editNeedyAccountDialog, setEditNeedyAccountDialog] = useState(false);
    const [createNeedyAccountDialog, setCreateNeedyAccountDialog] = useState(false);
    const [needy, setNeedy] = useState([])
    const [needyAccountId, setNeedyAccountId] = useState('')
    const [needyAccount, setNeedyAccount] = useState([])
    const [needyAccountObj, setNeedyAccountObj] = useState({})
    const [base64, setBase64] = useState('')
    const [imageBlob, setImageBlob] = useState([])
    const history = useHistory()

    const handleDeleteNeedyAcount = async (id) => {
        setDeleteNeedyAccountDialog(true)
        setNeedyAccountId(id)
    }

    const handleEditNeedyAcount = async (obj) => {
        setEditNeedyAccountDialog(true)
        setNeedyAccountObj(obj)
    }

    const getNeedyInfoById = async (id) => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/cms/um/personal?personId=${id}`)
            if (status === 200) {

                var arrayBufferView = new Uint8Array(data[0].personPhoto.data);
                const blob = new Blob([arrayBufferView]);
                const url = URL.createObjectURL(blob);

                axios.get(url).then((result) => {
                    setBase64(result.data)
                    const img = document.getElementById('personalImg');
                    img.src = result.data;
                    img.onload = e => URL.revokeObjectURL(base64);
                })

                setNeedy(data)
                document.getElementById('sex').value = data[0]?.sex
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const getNeedyAccountInfoById = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/beneficiary/needyAccounts?needyId=${personId}`)
            if (status === 200) {
                setNeedyAccount(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

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

    const handleEditNeedy = async () => {

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
            const { status } = await HttpService.put(`/api/cms/um/personal/${personId}`, body)
            if (status === 200) {
                history.push('/beneficiary/needyDefine')
                toastSuccess('اطلاعات نیازمند با موفقیت ویرایش گردید')
            }
        } catch (error) { }
        setLoadingDialog(false)

    };

    useEffect(() => {
        getNeedyInfoById(personId)
        getNeedyAccountInfoById()
    }, [])

    return (

        <div>
            {createNeedyAccountDialog ?
                <CreateNeedyAccountDialog
                    getNeedyAccountInfoById={getNeedyAccountInfoById}
                    personId={personId}
                    showDialog={createNeedyAccountDialog}
                    closeDialog={() => setCreateNeedyAccountDialog(false)}
                /> : null}

            {editNeedyAccountDialog ?
                <EditNeedyAccountDialog
                    getNeedyAccountInfoById={getNeedyAccountInfoById}
                    needyAccountObj={needyAccountObj}
                    personId={personId}
                    showDialog={editNeedyAccountDialog}
                    closeDialog={() => setEditNeedyAccountDialog(false)}
                /> : null}

            {deleteNeedyAccountDialog ?
                <DeleteNeedyAccountDialog
                    getNeedyAccountInfoById={getNeedyAccountInfoById}
                    needyAccountId={needyAccountId}
                    // personId={personId}
                    showDialog={deleteNeedyAccountDialog}
                    closeDialog={() => setDeleteNeedyAccountDialog(false)}
                /> : null}

            <div className="bg-white m-4 d-flex rounded justify-content-center flex-column align-items-center">
                <div className="row m-3">

                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">ویرایش شخص حقیقی (نیــــازمند)</span></p>

                    <div className="col-6 text-center">
                        <input required type="text" id="name" name="name" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام " defaultValue={needy[0]?.name} />
                    </div>
                    <div className="col-6 text-center">
                        <input required type="text" id="family" name="family" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام خانوادگی" defaultValue={needy[0]?.family} />
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
                            <select class="flex-grow-1 select-box cursor-pointer mx-2" aria-label="Default select example" id="sex" name="sex" defaultValue={needy[0]?.sex}>
                                <option value={true}>زن</option>
                                <option value={false}>مرد</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-6 text-center">
                        <input required type="text" id="nationalCode" name="nationalCode" className="bg-input-dialog mt-3 w-100 p-2" placeholder="کد ملی" defaultValue={needy[0]?.nationalCode} />
                    </div>
                    <div className="col-6 text-center">
                        <input required type="text" id="idNumber" name="idNumber" className="bg-input-dialog mt-3 w-100 p-2" placeholder="شماره شناسنامه" defaultValue={needy[0]?.idNumber} />
                    </div>

                    <div className="col-6 text-center">
                        <DatePicker
                            value={needy[0]?.birthDate ? timestampToPersian(new Date(needy[0]?.birthDate).getTime()) : null}
                            maxDate={new Date().getTime()}
                            locale={persian_fa}
                            calendar={persian}
                            editable={false}
                            inputMode='none'
                            inputClass='w-100 bg-input-dialog mt-3 p-2'
                            containerClassName="w-100"
                            placeholder="تاریخ تولد "
                            id="birthDate"
                            multiple={false} />
                    </div>

                    <div className="col-6 text-center">
                        <input required type="text" id="birthPlace" name="birthPlace" className="bg-input-dialog mt-3 w-100 p-2" placeholder="محل تولد" defaultValue={needy[0]?.birthPlace} />
                    </div>

                    <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                    </div>

                    <div className="col-6 d-flex align-items-center justify-content-end mt-3 max-dim">
                        <img id='personalImg' className="p-2 border-radius-09rem" style={{ maxWidth: "50px" }} />
                        <label className="bg-input-dialog text-center cursor-pointer d-flex align-items-center justify-content-center mb-0 p-2" style={{ borderRadius: "0.5rem 0 0 0.5rem" }}>
                            <input
                                onChange={(e) => handleUploadImageThumbnail(e)}
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
                <div className="d-flex my-5 align-self-end mx-3"><a className="btn btn-info ml-3 px-5" onClick={handleEditNeedy}>ویرایش</a></div>


                <ul className="d-flex list-style-type-none mt-3 w-100 justify-content-start" style={{ backgroundColor: "#f3f3f3" }}>
                    <li className={`cursor-pointer p-2 px-4 ml-2 text-center ${true ? "bg-white border" : 'bg-header A7BBCB'} `} onClick={true}>
                        حساب بانکی
                    </li>
                    <li className={`cursor-pointer p-2 px-4 mx-2 A7BBCB text-center ${false ? "active-card-heading rounded-0" : ''}`} onClick={true}>
                        سوابق بیماری
                    </li>
                    <li className={`cursor-pointer p-2 px-4 mx-2 A7BBCB text-center ${false ? "active-card-heading rounded-0" : ''}`} onClick={true}>
                        وضعیت مسکن
                    </li>
                    <li className={`cursor-pointer p-2 px-4 mx-2 A7BBCB text-center ${false ? "active-card-heading rounded-0" : ''}`} onClick={true}>
                        سوابق کاری
                    </li>
                    <li className={`cursor-pointer p-2 px-4 mx-2 A7BBCB text-center ${false ? "active-card-heading rounded-0" : ''}`} onClick={true}>
                        عائله
                    </li>
                    <li className={`cursor-pointer p-2 px-4 mx-2 A7BBCB text-center ${false ? "active-card-heading rounded-0" : ''}`} onClick={true}>
                        سوابق تحصیلی
                    </li>
                </ul>

                <button className="d-flex align-items-center admin-btn text-white align-self-end m-3 mx-4" onClick={() => setCreateNeedyAccountDialog(true)}>
                    <i className="fa fa-plus bg-pluse"></i>
                    <p className="mb-0 mr-2 ml-5 my-1">افزودن</p>
                </button>

                <ReactTable
                    className='table-responsive border table-width mb-5'
                    defaultPageSize={12}
                    PaginationComponent={Pagination}
                    data={needyAccount}
                    // filterable
                    columns={[
                        {
                            Header: "نام بانک",
                            accessor: "tblCommonBaseDatum.baseValue",
                        },
                        {
                            Header: "شماره حساب",
                            accessor: "accountNumber",
                        },
                        {
                            Header: "نام حساب",
                            accessor: "accountName",
                        },
                        {
                            Header: "شماره شبا",
                            accessor: "shebaNumber",
                        },
                        {
                            Header: "",
                            accessor: "needyAccountId",
                            Cell: (row) => <img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => { handleDeleteNeedyAcount(row.original.needyAccountId) }} alt="" />,
                            Filter: () => <input className='w-100' type="text" readOnly />
                        },
                        {
                            Header: "",
                            accessor: "needyAccountId",
                            Cell: (row) => <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => { handleEditNeedyAcount(row) }} alt="" />,
                            Filter: () => <input className='w-100' type="text" readOnly />
                        }
                    ]}
                />
            </div>
        </div>
    );
}

export default EditNeedy;