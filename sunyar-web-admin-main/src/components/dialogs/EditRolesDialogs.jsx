import React, { useContext, useState, useEffect } from 'react';
import HttpService from '../../service/HttpService';
import { toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';

const EditRolesDialogs = ({ showDialog, closeDialog, roleId, persianName, latinName }) => {

    const { setLoadingDialog } = useContext(MainContext)
    const [personalInfo, setPersonalInfo] = useState([]);

    function handleUpdateRole(params) {
        
    }

    const handleEditRole = async () => {

        const faName = document.getElementById('persianName').value
        const enName = document.getElementById('latinName').value
        
        const body = { faName, enName}

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.put(`/api/cms/um/role/${roleId}`, body)
            if (status === 200) {
                closeDialog()
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
                toastSuccess('  نقش موردنظر با موفقیت ویرایش گردید!')
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    return (
        <DialogOverlay
            isOpen={showDialog}
            onDismiss={closeDialog}
            className="d-flex justify-content-center align-items-center"
            style={{ background: 'rgb(53 53 53 / 62%)' }}
        >
            <DialogContent style={{
                borderRadius: '10px',
                boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)',
                height: 'unset',
                maxWidth: '600px',
                margin: 'auto'
            }}>

                <div className="bg-white mx-4   d-flex rounded justify-content-center flex-column align-items-center">
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3">ویرایش  نقش </span></p>

                    <div className="bg-white w-100 mx-4 mb-4 mt-2 d-flex rounded justify-content-center flex-column align-items-center">
                    <div className=" flex-column w-100 m-1 mt-1">

                        <div className="col-12 text-center">
                            <input required type="text" id="persianName" name="persianName" className="bg-input-dialog mt-3 w-100 p-2" defaultValue={persianName} placeholder="نام فارسی " />
                        </div>
                        <div className="col-12 text-center">
                            <input required type="text" id="latinName" name="latinName" className="bg-input-dialog mt-3 w-100 p-2" defaultValue={latinName} placeholder="نام لاتین" />
                        </div>
                        <div className="d-flex justify-content-center mt-5"><a className="btn btn-info ml-3 px-5" onClick={handleEditRole}>ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                    </div>
                </div>
                 
                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default EditRolesDialogs;