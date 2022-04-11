import React, { useContext, useEffect, useState } from 'react';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import { timestampToPersian } from '../../util/DateUtil';
import { useHistory } from 'react-router';
import Pagination from '../common/PaginationServer';
import CreateUserDialog from '../dialogs/CreateUserDialog';
import userIcon from '../../static/image/userIcon.png';
import EditUserDialog from '../dialogs/EditUserDialog';
import DeleteUserDialog from '../dialogs/DeleteUserDialog';
import RoleAssignmentdialog from '../dialogs/RoleAssignmentdialog';

const Users = () => {

    const [user, setUser] = useState();
    const [users, setUsers] = useState([]);
    const [createUserDialog, setCreateUserDialog] = useState(false);
    const [editUserDialog, setEditUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [roleAssignmentdialog, setRoleAssignmentdialog] = useState(false);
    const [userId, setUserId] = useState('');
    const { setLoadingDialog } = useContext(MainContext)
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)
    const [nameInput, setNameInput] = useState('')
    const [familyInput, setFamilyInput] = useState('')

    const getAllUsers = async () => {

        setLoadingDialog(true)
        try {
            const { headers, status, data } = await HttpService.get(`/api/cms/um/user/userPagination?page=${currentPage - 1}`)
            if (status === 200) {
                    for (let index = 0; index < data.length; index++) {
                        data[index].active = data[index].active === false ? 'غیر فعال' : 'فعال'
                        const timeStamp = new Date(data[index].expireDate).getTime()
                        const date = timestampToPersian(timeStamp);
                        data[index].date = date
                        console.log('dataaaaadsadasd',data);
                    }
                    setUsers(data)
                    setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const setInputNameFunc = async (name) => {
        try {
            setNameInput(name)
            const { headers, status, data } = await HttpService.get(`/api/cms/um/user/userPagination?page=${currentPage - 1}&name=${nameInput}`)
            if (status === 200) {
                for (let index = 0; index < data.length; index++) {
                    data[index].active = data[index].active === false ? 'غیر فعال' : 'فعال'
                    const date = timestampToPersian(data[index].expireDate);
                    data[index].date = date
                }
                setUsers(data)
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const setInputFamilyFunc = async (e) => {
        try {
            setFamilyInput(e.target.value)
            const { headers, status, data } = await HttpService.get(`/api/cms/um/user/userPagination?page=${currentPage - 1}&family=${familyInput}`)
            if (status === 200) {
                for (let index = 0; index < data.length; index++) {
                    data[index].active = data[index].active === false ? 'غیر فعال' : 'فعال'
                    const date = timestampToPersian(data[index].expireDate);
                    data[index].date = date
                }
                setUsers(data)
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const setInputUsernameFunc = async (e) => {
        try {
            const { headers, status, data } = await HttpService.get(`/api/cms/um/user/userPagination?page=${currentPage - 1}&username=${e.target.value}`)
            if (status === 200) {
                for (let index = 0; index < data.length; index++) {
                    data[index].active = data[index].active === false ? 'غیر فعال' : 'فعال'
                    const timeStamp = new Date(data[index].expireDate).getTime()
                    const date = timestampToPersian(timeStamp);
                    data[index].date = date
                }
                setUsers(data)
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const setInputActiveFunc = async (e) => {
        try {
            const { headers, status, data } = await HttpService.get(`/api/cms/um/user/userPagination?page=${currentPage - 1}${e.target.value === 'all' ? '' : `&active=${e.target.value}`}`)
            if (status === 200) {

                for (let index = 0; index < data.length; index++) {
                    data[index].active = data[index].active === false ? 'غیر فعال' : 'فعال'
                    const date = timestampToPersian(data[index].expireDate);
                    data[index].date = date
                }
                setUsers(data)
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const history = useHistory()

    const handleEditUser = async (user) => {
        setEditUserDialog(true)
        setUser(user)
    }

    const handleDeleteUser = async (userId) => {
        setDeleteUserDialog(true)
        setUserId(userId)
    }
    const handleRoleAssignment = async (user) => {
        setRoleAssignmentdialog(true)
        setUser(user)
    }

    useEffect(() => {
        getAllUsers()
    }, [currentPage]);

    return (

        <div className="d-flex flex-column align-items-center">

            {createUserDialog ?
                <CreateUserDialog
                    getAllUsers={getAllUsers}
                    showDialog={createUserDialog}
                    closeDialog={() => setCreateUserDialog(false)}
                /> : null}

            {editUserDialog ?
                <EditUserDialog
                    getAllUsers={getAllUsers}
                    user={user}
                    showDialog={editUserDialog}
                    closeDialog={() => setEditUserDialog(false)}
                /> : null}

            {deleteUserDialog ?
                <DeleteUserDialog
                    userId={userId}
                    showDialog={deleteUserDialog}
                    closeDialog={() => setDeleteUserDialog(false)}
                /> : null}

            {roleAssignmentdialog ?
                <RoleAssignmentdialog
                user={user}
                    showDialog={roleAssignmentdialog}
                    closeDialog={() => setRoleAssignmentdialog(false)}
                /> : null}
            <>
                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <form className="w-100 d-flex justify-content-start mr-4">
                    </form>
                    <button className="d-flex align-items-center admin-btn text-white text-left align-self-end m-3 mx-4" onClick={() => setCreateUserDialog(true)}>
                        <i className="fa fa-plus bg-pluse"></i>
                        <p className="mb-0 mr-2 ml-3 my-1">افــــزودن</p>
                    </button>
                </div>

                <div className="table-responsive border table-width mb-5">
                    <table class="table p-0 m-0">
                        <thead className="">
                            <tr className="text-center">
                                <th scope="col">
                                    <p>تاریخ انقضا</p>
                                </th>

                                <th scope="col">
                                    <p>وضعیت</p>
                                    <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                        <select className='w-100 bg-input-dialog p-1 bg-white border border-radius-11px-11px-11px-11px' onChange={setInputActiveFunc}>
                                            <option value='all'>همه</option>
                                            <option value="true">فعال</option>
                                            <option value="false">غیرفعال</option>
                                        </select>
                                    </div>
                                </th>

                                <th scope="col">
                                    <p>نام کاربری</p>
                                    <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                        <input id="searchUsername" className="bg-input-dialog p-2 bg-white border border-radius-11px-11px-11px-11px" type="text" onInput={setInputUsernameFunc} />
                                    </div>
                                </th>

                                <th scope="col">
                                    <p>نام‌خانوادگی</p>
                                    <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                        <input id="searchFamily" className="bg-input-dialog p-2 bg-white border border-radius-11px-11px-11px-11px" type="text" onInput={setInputFamilyFunc} />
                                    </div>
                                </th>

                                <th scope="col">
                                    <p>نام‌ </p>
                                    <div className="d-flex p-0 m-0 align-items-center w-100 justify-content-center">
                                        <input id="searchName" className="bg-input-dialog p-2 bg-white border border-radius-11px-11px-11px-11px" type="text" onInput={setInputNameFunc} />
                                    </div>
                                </th>

                                <th scope="col"> </th>
                                <th scope="col"> </th>
                                <th scope="col"> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((ss, index) => (
                                <tr className="text-center">
                                    <td className='border border-bottom-0'>{ss.date}</td>
                                    <td className='border border-bottom-0'>{ss.active}</td>
                                    <td className='border border-bottom-0'>{ss.username}</td>
                                    <td className='border border-bottom-0'>{ss.tblPersonal.family}</td>
                                    <td className='border border-bottom-0'>{ss.tblPersonal.name}</td>
                                    {ss?.tblPersonal.personType === "1" ? 
                                     <td className='border border-bottom-0'><img className=" rounded p-0 cursor-pointer " ata-toggle="tooltip" data-placement="top"  title="تخصیص نقش" src={userIcon} onClick={() => handleRoleAssignment(ss)} alt="" /></td>
                                    :
                                    <td className='border border-bottom-0'><img className=" rounded p-0 opacity-33 cursor-pointer "  ata-toggle="tooltip" data-placement="top"  title="تخصیص نقش" src={userIcon} alt=""/></td>
                                    }
                                    <td className='border border-bottom-0'><img className="bg-danger rounded  p-1 cursor-pointer" src={trashIcon} onClick={() => handleDeleteUser(ss.userId)} alt="" /></td>
                                    <td className=''><img className={"bg-warning rounded p-1 cursor-pointer"} src={pencilIcon} alt="" onClick={() => handleEditUser(ss)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users && count > 12 ?
                    <Pagination
                        total={count}
                        currentPage={currentPage}
                        perPage={12}
                        onPageChange={(page) => setCurrentPage(page)}
                    /> : null}
            </>

        </div>
    );
}

export default Users;




