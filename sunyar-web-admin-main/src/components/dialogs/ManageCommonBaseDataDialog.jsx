import React, { useContext, useEffect, useState } from 'react';
import ReactTable from "react-table";
import { DialogContent, DialogOverlay } from '@reach/dialog';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import Pagination from '../common/PaginationUi';
import CreateCommonBaseDataDialog from './CreateCommonBaseDataDialog';
import DeleteCommonBaseDataDialog from './DeleteCommonBaseDataDialog';
import EditCommonBaseDataDialog from './EditCommonBaseDataDialog';
import { useTranslation } from "react-i18next";


const ManageCommonBaseDataDialog = ({ showDialog, closeDialog, commonBaseTypeId }) => {

    const [createCommonBaseDataDialog, setCreateCommonBaseDataDialog] = useState(false);
    const [deleteCommonBaseDataDialog, setDeleteCommonBaseDataDialog] = useState(false);
    const [editCommonBaseDataDialog, setEditCommonBaseDataDialog] = useState(false);
    const [commonBaseData, setCommonBaseData] = useState([])
    const [commonBaseDataId, setCommonBaseDataId] = useState('')
    const { setLoadingDialog } = useContext(MainContext)
    const { t } = useTranslation()


    const handleDeleteCommonBaseData = (commonBaseDataId) => {
        setDeleteCommonBaseDataDialog(true)
        setCommonBaseDataId(commonBaseDataId)
    };

    const handleEditCommonBaseData = (commonBaseDataId) => {
        setEditCommonBaseDataDialog(true)
        setCommonBaseDataId(commonBaseDataId)
    };

    const getCommonBaseData = async () => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/baseInfo/commonBaseData?commonBaseTypeId=${commonBaseTypeId}`)
            if (status === 200) {
                setCommonBaseData(data)
            }
        } catch (error) { }
        setLoadingDialog(false)

    };

    useEffect(() => {
        getCommonBaseData()
    }, [])

    return (
        <>

            {createCommonBaseDataDialog ?
                <CreateCommonBaseDataDialog
                    commonBaseTypeId={commonBaseTypeId}
                    getCommonBaseData={getCommonBaseData}
                    showDialog={createCommonBaseDataDialog}
                    closeDialog={() => setCreateCommonBaseDataDialog(false)}
                /> : null}

            {deleteCommonBaseDataDialog ?
                <DeleteCommonBaseDataDialog
                    commonBaseDataId={commonBaseDataId}
                    getCommonBaseData={getCommonBaseData}
                    showDialog={deleteCommonBaseDataDialog}
                    closeDialog={() => setDeleteCommonBaseDataDialog(false)}
                /> : null}

            {editCommonBaseDataDialog ?
                <EditCommonBaseDataDialog
                    commonBaseTypeId={commonBaseTypeId}
                    commonBaseDataId={commonBaseDataId}
                    getCommonBaseData={getCommonBaseData}
                    showDialog={editCommonBaseDataDialog}
                    closeDialog={() => setEditCommonBaseDataDialog(false)}
                /> : null}

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
                    maxWidth: '800px',
                    margin: 'auto'
                }}>

                    <div className="d-flex flex-column align-items-center" >

                        <button className="d-flex align-items-center admin-btn text-white align-self-end mb-3" onClick={() => setCreateCommonBaseDataDialog(true)}>
                            <i className="fa fa-plus bg-pluse"></i>
                            <p className="mb-0 mr-2 ml-5 my-1">{t('Add')}</p>
                        </button>

                        <ReactTable
                            className='table-responsive border border-radius-09rem mb-5'
                            defaultPageSize={5}
                            PaginationComponent={Pagination}
                            data={commonBaseData}
                            filterable
                            columns={[
                                {
                                    Header: `${t('code')}`,
                                    accessor: "baseCode",
                                },
                                {
                                    Header:`${t('Defined_Constant_value')}`,
                                    accessor: "baseValue",
                                },

                                {
                                    Header: "",
                                    accessor: "commonBaseDataId",
                                    Cell: ({ value }) => <img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => handleDeleteCommonBaseData(value)} alt="حذف" />,
                                    Filter: () => <></>
                                },
                                {
                                    Header: "",
                                    accessor: "commonBaseDataId",
                                    Cell: ({ value }) => <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => handleEditCommonBaseData(value)} alt="ویرایش" />,
                                    Filter: () => <></>
                                }
                            ]}
                        />

                    </div>

                </DialogContent>
            </DialogOverlay>
        </>
    );
}

export default ManageCommonBaseDataDialog;