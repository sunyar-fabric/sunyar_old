import React, { useContext, useEffect, useState } from 'react';
import ReactTable from "react-table";
import MainContext from '../context/MainContext';
import HttpService from '../../service/HttpService';
import addCommonBaseData from '../../static/image/addConstValue.png';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import CreateCommonBaseTypeDialog from '../dialogs/CreateCommonBaseTypeDialog';
import DeleteCommonBaseTypeDialog from '../dialogs/DeleteCommonBaseTypeDialog';
import EditCommonBaseTypeDialog from '../dialogs/EditCommonBaseTypeDialog';
import Pagination from '../common/PaginationUi';
import ManageCommonBaseDataDialog from '../dialogs/ManageCommonBaseDataDialog';
import { useTranslation } from "react-i18next";


const CommonBaseType = () => {

    const { setLoadingDialog } = useContext(MainContext)
    const [commonBaseTypeId, setCommonBaseTypeId] = useState('');
    const [createCommonBaseTypeDialog, setCreateCommonBaseTypeDialog] = useState(false);
    const [manageCommonBaseDataDialog, setManageCommonBaseDataDialog] = useState(false);
    const [deleteCommonBaseTypeDialog, setDeleteCommonBaseTypeDialog] = useState(false);
    const [editCommonBaseTypeDialog, setEditCommonBaseTypeDialog] = useState(false);
    const [commonBaseType, setCommonBaseType] = useState([]);
    const { t } = useTranslation()


    const handleManageCommonBaseData = (commonBaseTypeId) => {
        setManageCommonBaseDataDialog(true)
        setCommonBaseTypeId(commonBaseTypeId)
    }

    const handleDeleteCommonBaseType = (commonBaseTypeId) => {
        setDeleteCommonBaseTypeDialog(true)
        setCommonBaseTypeId(commonBaseTypeId)
    }

    const handleEditCommonBaseType = (id) => {
        setEditCommonBaseTypeDialog(true)
        setCommonBaseTypeId(id)
    }

    const getCommonBaseTypes = async () => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/baseInfo/commonBaseType`)
            if (status === 200) {
                setCommonBaseType(data)
            }

        } catch (error) { }
        setLoadingDialog(false) 
    }

    useEffect(() => {
        getCommonBaseTypes()
    }, []);

    return (

        <div className="d-flex flex-column align-items-center">

            {createCommonBaseTypeDialog ?
                <CreateCommonBaseTypeDialog
                    showDialog={createCommonBaseTypeDialog}
                    getCommonBaseTypes={getCommonBaseTypes}
                    closeDialog={() => setCreateCommonBaseTypeDialog(false)}
                /> : null}

            {manageCommonBaseDataDialog ?
                <ManageCommonBaseDataDialog
                    commonBaseTypeId={commonBaseTypeId}
                    showDialog={manageCommonBaseDataDialog}
                    closeDialog={() => setManageCommonBaseDataDialog(false)}
                /> : null}

            {deleteCommonBaseTypeDialog ?
                <DeleteCommonBaseTypeDialog
                    commonBaseTypeId={commonBaseTypeId}
                    getCommonBaseTypes={getCommonBaseTypes}
                    showDialog={deleteCommonBaseTypeDialog}
                    closeDialog={() => setDeleteCommonBaseTypeDialog(false)}
                /> : null}

            {editCommonBaseTypeDialog ?
                <EditCommonBaseTypeDialog
                    commonBaseTypeId={commonBaseTypeId}
                    showDialog={editCommonBaseTypeDialog}
                    getCommonBaseTypes={getCommonBaseTypes}
                    closeDialog={() => setEditCommonBaseTypeDialog(false)}
                /> : null}

            <button className="d-flex align-items-center admin-btn text-white text-left align-self-end m-3 mx-4" onClick={() => setCreateCommonBaseTypeDialog(true)}>
                <i className="fa fa-plus bg-pluse"></i>
                <p className="mb-0 mr-2 ml-5 my-1">{t('Add')}</p>
            </button>

            <ReactTable
                className='table-responsive border table-width mb-5'
                defaultPageSize={12}
                PaginationComponent={Pagination}
                data={commonBaseType}
                filterable
                columns={[
                    // {
                    //     Header: "کد شناسه ثابت",
                    //     accessor: "baseTypeCode",
                    // },
                    {
                        Header:`${t('Constant_ID_title')}` ,
                        accessor: "baseTypeTitle",
                    },
                    {
                        Header: "",
                        accessor: "commonBaseTypeId",
                        Cell: ({ value }) => <img className="bg-info rounded p-1 cursor-pointer" src={addCommonBaseData} onClick={() => handleManageCommonBaseData(value)} alt="اد" />,
                        Filter: () => <></>
                    },
                    {
                        Header: "",
                        accessor: "commonBaseTypeId",
                        Cell: ({ value }) => <img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => handleDeleteCommonBaseType(value)} alt="حذف" />,
                        Filter: () => <></>
                    },
                    {
                        Header: "",
                        accessor: "commonBaseTypeId",
                        Cell: ({ value }) => <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => handleEditCommonBaseType(value)} alt="ویرایش" />,
                        Filter: () => <></>
                    },
                ]}
            />

        </div>
    );
}

export default CommonBaseType;