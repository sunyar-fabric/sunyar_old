import React, { useContext, useEffect, useState } from 'react';
import Pagination from '../common/PaginationServer';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import MainContext from '../context/MainContext';
import HttpService from '../../service/HttpService';
import EditRolesDialogs from '../dialogs/EditRolesDialogs';
import DeleteRolesDialogs from '../dialogs/DeleteRolesDialogs';
import { toastSuccess } from '../../util/ToastUtil';

const Roles = () => {
    const { setLoadingDialog } = useContext(MainContext)
    const [index, setIndex] = useState('');
    const [count, setCount] = useState(0)
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState();
    const [faName, setFaName] = useState();
    const [enName, setEnName] = useState();
    const [currentPage, setCurrentPage] = useState(1)
    const [editRolesDialogs, setEditRolesDialogs] = useState()
    const [deleteRolesDialogs, setDeleteRolesDialogs] = useState()


    const handleCreateRole = async () => {

        const faName = document.getElementById('persianName').value
        const enName = document.getElementById('latinName').value
        const body = { faName, enName }

        setLoadingDialog(true)
        try {
            let { status } = await HttpService.post('/api/cms/um/role', body)
            if (status === 200) {
                toastSuccess('نقش  با موفقیت ایجاد گردید!')
                setIndex('')
                getRoles()
            }
        } catch (error) { }
        setLoadingDialog(false)
    };


    const getRoles = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get('/api/cms/um/role')
            console.log('dataaaa', data);
            if (status === 200) {
                setRoles(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }


    useEffect(() => {
        getRoles()
    }, [])

    const handleEditRole = async (roleId, faName, enName) => {
        setEditRolesDialogs(true)
        setRoleId(roleId)
        setFaName(faName)
        setEnName(enName)
    }

    const handleDeleteRole = async (roleId) => {
        setDeleteRolesDialogs(true)
        setRoleId(roleId)
    }


    return (

        <div className="d-flex flex-column align-items-center">

            {editRolesDialogs ?
                <EditRolesDialogs
                    persianName={faName}
                    latinName={enName}
                    roleId={roleId}
                    showDialog={editRolesDialogs}
                    closeDialog={() => setEditRolesDialogs(false)}
                /> : null}

            {deleteRolesDialogs ?
                <DeleteRolesDialogs
                    roleId={roleId}
                    showDialog={deleteRolesDialogs}
                    closeDialog={() => setDeleteRolesDialogs(false)}
                /> : null}


            <ul className="d-flex border card-heading list-style-type-none">
                <li className={`cursor-pointer p-2 border-radius-10px ${index === '' ? "active-card-heading" : 'bg-header A7BBCB'} `} onClick={() => setIndex('')} >
                    نقش ها
                </li>
            </ul>

            {index === 'createRole' ?

                <div className="bg-white m-4 d-flex rounded justify-content-center col-6 flex-column align-items-center">
                    <div className=" flex-column col-11 m-3 mt-5">

                        <div className="col-12 text-center">
                            <input required type="text" id="persianName" name="persianName" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام فارسی  " />
                        </div>
                        <div className="col-12 text-center">
                            <input required type="text" id="latinName" name="latinName" className="bg-input-dialog mt-3 w-100 p-2" placeholder="نام لاتین " />
                        </div>
                        <div className="d-flex mt-5 mb-4 justify-content-center align-self-end mx-0"><a className="btn btn-info ml-3 px-5" onClick={handleCreateRole}>ثبت</a></div>

                    </div>
                </div>

                :

                <>
                    <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                        <form className="w-100 d-flex justify-content-start mr-4">
                        </form>

                        <button className="d-flex align-items-center admin-btn text-white align-self-end m-3 mx-4" disabled onClick={() => setIndex('createRole')}>
                            <i className="fa fa-plus bg-pluse"></i>
                            <p className="mb-0 mr-2 ml-3 my-1" >افــــزودن</p>
                        </button>

                    </div>

                    <div className="table-responsive border table-width mb-5">
                        <table class="table p-0 m-0" >
                            <thead className="">
                                <tr className="text-center">
                                    <th scope="col ">
                                        <p>نام فارسی </p>
                                    </th>
                                    <th scope="col">
                                        <p>نام لاتین</p>
                                    </th>
                                    <th scope="col"> </th>
                                    <th scope="col"> </th>
                                </tr>
                            </thead>

                            <tbody>
                                {roles.map((ss, index) => (
                                    <tr className="text-center">
                                        <td className='border border-bottom-0'>{ss.faName}</td>
                                        <td className='border border-bottom-0'>{ss.enName}</td>
                                        <td className='border border-bottom-0'><img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} alt=""  /></td>
                                        <td className=''><img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon}  alt="" /></td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>


                    {roles && count > 12 ?
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

export default Roles;