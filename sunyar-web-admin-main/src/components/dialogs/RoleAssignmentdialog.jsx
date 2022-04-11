import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import HttpService from '../../service/HttpService';
import { fixNumbers, persianToTimestamp, timestampToPersian } from '../../util/DateUtil';
import { toastError, toastSuccess } from '../../util/ToastUtil';
import MainContext from '../context/MainContext';
import { DialogContent, DialogOverlay } from '@reach/dialog';

const RoleAssignmentdialog = ({ showDialog, closeDialog, user }) => {

    const [selectedItem, setSelectedItem] = useState([])
    const [unSelectedItem, setUnSelectedItem] = useState([])
    const [item, setItem] = useState([])
    const [choosenItems, setChoosenItems] = useState([])
    const { setLoadingDialog } = useContext(MainContext)
    const [allRole, setAllRole] = useState([])

    const handleGetData = async () => {

        setLoadingDialog(true)
        try {
            let { status, data } = await HttpService.get('/api/cms/um/role')
            if (status === 200) {
                setAllRole(data)
            }

            let assign = await HttpService.get(`/api/cms/um/role/assignRoleToUser?userId=${user.userId}`)
            if (assign.status === 200) {
                setChoosenItems(assign.data)
            }

            let roleNotAssign = []
            for (let i of data) {
                let exist = assign?.data?.find(item => item.roleId === i.roleId)
                if (!exist) roleNotAssign.push(i)
            }
            setItem(roleNotAssign)

        }
        catch (error) { }
        setLoadingDialog(false)
    }

    const handleSelect = (p) => {
        let exist = selectedItem.find(item => item.roleId === p.roleId)
        console.log('exist', exist);
        if (exist) {
            let filtered = selectedItem.filter(item => item.roleId !== p.roleId)
            setSelectedItem(filtered)
            console.log('filtered', filtered);
        } else
            setSelectedItem([...selectedItem, p])
    }

    const handleAdd = () => {
        let choosen = [...choosenItems, ...selectedItem]
        let data = []
        for (let i of allRole) {
            let exist = choosen.find(item => item.roleId === i.roleId)
            if (!exist) data.push(i)
        }
        setChoosenItems(choosen)
        setItem(data)
        setSelectedItem([])
    }

    const handleUnSelect = (p, index) => {
        let exist = unSelectedItem.find(item => item.roleId === p.roleId)
        console.log('exist', exist);
        if (exist) {
            let filtered = unSelectedItem.filter(item => item.roleId !== p.roleId)
            setUnSelectedItem(filtered)
            console.log('filtered', filtered);
        } else
            setUnSelectedItem([...unSelectedItem, p])
    }

    const handleRemove = async () => {

        for (let i = 0; i < unSelectedItem.length; i++) {

            if (unSelectedItem[i]?.assignRoleToUserId) {

                setLoadingDialog(true)
                try {
                    let { status } = await HttpService.delete(`/api/cms/um/role/assignRoleToUser/${unSelectedItem[i]?.assignRoleToUserId}`)
                    if (status === 204) {
                    }
                } catch (error) { }
                setLoadingDialog(false)
            }
        }
        let choosen = [...item, ...unSelectedItem]
        let data = []
        for (let i of choosenItems) {
            let exist = choosen.find(item => item.roleId === i.roleId)
            if (!exist) data.push(i)
        }
        setChoosenItems(data)
        setItem(choosen)
        setUnSelectedItem([])
    }

    const handleAssignRoleToUser = async () => {

        let Ids = []
        for (let i = 0; i < choosenItems?.length; i++) {
            if (!choosenItems[i]?.assignRoleToUserId) {
                let obj = {
                    roleId: choosenItems[i]?.roleId,
                    userId: user.userId
                }
                Ids.push(obj)
            }
        }

        const body = { role: Ids }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post(`/api/cms/um/role/assignRoleToUser`, body)
            if (status === 200) {
                closeDialog()
                toastSuccess('تخصیص نقش به کاربر با موفقیت انجام شد!')
            }
        } catch (error) { }
        setLoadingDialog(false)
    };

    useEffect(() => {
        handleGetData()
    }, [])

    console.log('unSelectedItem', unSelectedItem);

    return (
        <DialogOverlay
            isOpen={showDialog}
            onDismiss={closeDialog}
            className="d-flex justify-content-center align-items-center"
            style={{ background: 'rgb(53 53 53 / 62%)' }}>

            <DialogContent style={{
                borderRadius: '10px',
                boxShadow: '0px 10px 50px hsla(0, 0%, 0%, 0.33)',
                height: 'unset',
                maxWidth: '750px',
                margin: 'auto'
            }}>

                <div className="bg-white m-4 d-flex rounded justify-content-center flex-column align-items-center">
                    <p className="border-bottom w-100 text-right pb-3"><span className="m-3"> تخصیص نقش به کاربــر  </span></p>

                    <div className="flex-column container m-3 justify-content-center align-items-center w-100">
                        <div className=" d-flex justify-content-center align-items-center text-center ">
                            <label htmlFor="" className='mb-0 ml-3'>کاربـــر</label>
                            <span required type="text" id="username" name="username" className="bg-input-dialog text-left pl-3 w-100 p-2" placeholder="نام کاربری" > {user?.username} </span>
                        </div>
                        <div className='d-flex  justify-content-between mt-4 '>
                            <div>
                                <p className='text-right mt-2' style={{color:'gray'}} >نقش های تعریف شده</p>
                                <div className='assignDivStyle text-right  ' >

                                    {item.map((p, index) => <p className='roleHoverstyle pr-3 pt-2 pb-2 m-0 cursor-pointer' onClick={() => handleSelect(p, index)}
                                        style={{ backgroundColor: selectedItem.includes(p) ? "#F2F2F2" : "white" }} >
                                        {p?.tblRole ? p?.tblRole?.faName : p?.faName}
                                    </p>)}

                                </div>

                            </div>

                            <div className='flex-column d-flex justify-content-center align-items-center'>
                                <div className=" " >
                                    <div className=' mx-auto' id='left1' onClick={handleAdd} />
                                </div>
                                <div className=" mt-2" >
                                    <div className=' mx-auto' id='right1' onClick={handleRemove} />
                                </div>
                            </div>

                            <div>
                            <p className='text-right mt-2' style={{color:'gray'}} >نقش های تخصیص یافته به کاربر</p>

                            <div className='assignDivStyle  ' >

                                {choosenItems?.map((p, index) => <p className='roleHoverstyle text-right pr-3 pt-2 pb-2 m-0 cursor-pointer' onClick={() => handleUnSelect(p)}
                                    style={{ backgroundColor: unSelectedItem.includes(p) ? "#F2F2F2" : "white" }} >
                                    {p?.tblRole ? p?.tblRole?.faName : p?.faName}
                                </p>)}

                            </div>

                            </div>

                        </div>
                    </div>

                    <div className="d-flex mt-4"><a className="btn btn-info ml-3 px-5" onClick={handleAssignRoleToUser} >ذخیره</a><a className="btn btn-outline-info text-info px-5" onClick={closeDialog}>انصراف</a></div>
                </div>

            </DialogContent>
        </DialogOverlay >);
}

export default RoleAssignmentdialog;
