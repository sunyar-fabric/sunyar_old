import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import MainContext from '../context/MainContext';
import ReactTable from "react-table";
import DeleteCashAssistance from './DeleteCashAssistance';
import EditCashAssistance from './EditCashAssistance';
import CreateSuccorCashDialog from './CreateSuccorCashDialog';
import Pagination from '../common/PaginationUi';

const SuccorCashDialog = ({ showDialog, closeDialog, planInfo }) => {

    const { setLoadingDialog } = useContext(MainContext)

    const [cashAssistanceDetailId, setCashAssistanceDetailId] = useState('');
    const [editCashAssistance, setEditCashAssistance] = useState(false);
    const [deleteCashAssistance, setDeleteCashAssistance] = useState(false);
    const [createSuccorCashDialog, setCreateSuccorCashDialog] = useState(false);
    const [cashAssistance, setCashAssistance] = useState([])
    const [cashAssistanceObj, setCashAssistanceObj] = useState([])

    const handleDeleteCash = (id) => {
        setDeleteCashAssistance(true)
        setCashAssistanceDetailId(id)
    }

    const handleEditCash = (cashAssistance) => {
        setEditCashAssistance(true)
        setCashAssistanceObj(cashAssistance)
    }

    const getAllSuccorCash = async () => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/plan/succorCash?planId=${planInfo.planId}`)
            if (status === 200) {
                console.log('dataaaaaaaaaaa', data);
                setCashAssistance(data)
            }
        } catch (error) { }
        setLoadingDialog(false)

    };

    useEffect(() => {
        getAllSuccorCash()
    }, [])

    return (

        <div>

            {createSuccorCashDialog ?
                <CreateSuccorCashDialog
                    planInfo={planInfo}
                    getAllSuccorCash={getAllSuccorCash}
                    showDialog={createSuccorCashDialog}
                    closeDialog={() => setCreateSuccorCashDialog(false)}
                /> : null}

            {editCashAssistance ?
                <EditCashAssistance
                    planInfo={planInfo}
                    cashAssistanceObj={cashAssistanceObj}
                    getAllSuccorCash={getAllSuccorCash}
                    showDialog={editCashAssistance}
                    closeDialog={() => setEditCashAssistance(false)}
                /> : null}


            {deleteCashAssistance ?
                <DeleteCashAssistance
                    cashAssistanceDetailId={cashAssistanceDetailId}
                    getAllSuccorCash={getAllSuccorCash}
                    showDialog={deleteCashAssistance}
                    closeDialog={() => setDeleteCashAssistance(false)}
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
                    maxWidth: '1600px',
                    margin: 'auto'
                }}>

                    <div className="d-flex flex-column" >

                        <button className="d-flex align-items-center admin-btn text-white align-self-end mb-3" onClick={() => setCreateSuccorCashDialog(true)}>
                            <i className="fa fa-plus bg-pluse"></i>
                            <p className="mb-0 mr-2 ml-5 my-1">افزودن</p>
                        </button>

                        <ReactTable
                            className='table-responsive border-radius-09rem border mb-5'
                            defaultPageSize={7}
                            PaginationComponent={Pagination}
                            data={cashAssistance}
                            columns={[
                                {
                                    Header: "نام نیازمند",
                                    accessor: "tblAssignNeedyToPlan.tblPersonal.name",
                                },
                                {
                                    Header: "نام خانوادگی نیازمند",
                                    accessor: "tblAssignNeedyToPlan.tblPersonal.family",
                                },
                                {
                                    Header: "مبلغ مورد نیاز",
                                    accessor: "neededPrice",
                                },
                                {
                                    Header: "حداقل مبلغ مجاز ",
                                    accessor: "minPrice",
                                },
                                {
                                    Header: "توضیحات",
                                    accessor: "description",
                                },
                                {
                                    Header: "",
                                    accessor: "cashAssistanceDetailId",
                                    Cell: ({ value }) => <img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => { handleDeleteCash(value) }} alt="" />,
                                    Filter: () => <input className='w-100' type="text" readOnly />
                                },
                                {
                                    Header: "",
                                    accessor: "cashAssistanceDetailId",
                                    Cell: row => <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => { handleEditCash(row.original) }} alt="" />,
                                    Filter: () => <input className='w-100' type="text" readOnly />
                                },
                            ]}
                        />

                    </div>


                </DialogContent>
            </DialogOverlay>
        </div>
    );
}

export default SuccorCashDialog;