import React, { useContext, useEffect, useState } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import HttpService from '../../service/HttpService';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import CreateMoreConstValuesDialog from './CreateCommonBaseDataDialog';
import MainContext from '../context/MainContext';
import DeleteCommonBaseDataDialog from './DeleteCommonBaseDataDialog';
import EditCommonBaseDataDialog from './EditCommonBaseDataDialog';


const CommonBaseDataDialog = ({ showDialog, closeDialog, commonBaseTypeId, baseTypeCode }) => {

    const { setLoadingDialog } = useContext(MainContext)

    const [deleteCommonBaseDataDialog, setDeleteCommonBaseDataDialog] = useState(false);
    const [editCommonBaseDataDialog, setEditCommonBaseDataDialog] = useState(false);
    const [createMoreConstValuesDialog, setCreateMoreConstValuesDialog] = useState(false);
    const [moreConstValue, setMoreConstValue] = useState([])
    const [commonBaseDataId, setCommonBaseDataId] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)


    const handleDeleteMoreConstValue = (id) => {
        setDeleteCommonBaseDataDialog(true)
        setCommonBaseDataId(id)
    }

    const handleEditMoreConstValue = (id) => {
        setEditCommonBaseDataDialog(true)
        setCommonBaseDataId(id)
    }


    const getMoreConstValue = async () => {

        setLoadingDialog(true)
        try {
            const { status, data, headers } = await HttpService.get(`/api/admin/baseData?page=${currentPage - 1}&baseCode=${baseTypeCode}`)
            if (status === 200) {
                setMoreConstValue(data)
                setCount(headers['count'])
            }
        } catch (error) { }
        setLoadingDialog(false)

    };

    useEffect(() => {
        getMoreConstValue()
    }, [currentPage])

    return (

        <div>

            {createMoreConstValuesDialog ?
                <CreateMoreConstValuesDialog
                    getMoreConstValue={getMoreConstValue}
                    baseTypeCode={baseTypeCode}
                    commonBaseTypeId={commonBaseTypeId}
                    showDialog={createMoreConstValuesDialog}
                    closeDialog={() => setCreateMoreConstValuesDialog(false)}
                /> : null}

            {deleteCommonBaseDataDialog ?
                <DeleteCommonBaseDataDialog
                    getMoreConstValue={getMoreConstValue}
                    commonBaseDataId={commonBaseDataId}
                    showDialog={deleteCommonBaseDataDialog}
                    closeDialog={() => setDeleteCommonBaseDataDialog(false)}
                /> : null}

            {editCommonBaseDataDialog ?
                <EditCommonBaseDataDialog
                    getMoreConstValue={getMoreConstValue}
                    commonBaseDataId={commonBaseDataId}
                    commonBaseTypeId={commonBaseTypeId}
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
                    maxWidth: '1600px',
                    margin: 'auto'
                }}>

                    <div className="d-flex flex-column" >

                        <button className="d-flex align-items-center admin-btn text-white align-self-end mb-3" onClick={() => setCreateMoreConstValuesDialog(true)}>
                            <i className="fa fa-plus bg-pluse"></i>
                            <p className="mb-0 mr-2 ml-5 my-1">افزودن</p>
                        </button>

                        <div className="table-responsive border border-radius-09rem" >
                            <table class="table p-0 m-0">
                                <thead>
                                    <tr className="text-center">
                                        <th scope="col"> ردیف</th>
                                        <th scope="col"> مقدار ثابـــت تعریف شده </th>
                                        <th scope="col"> کد  </th>
                                        <th scope="col"> </th>
                                        <th scope="col"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {moreConstValue.map((ss, index) => (
                                        <tr className="text-center">
                                            <th scope="row">{(index + 1) + (currentPage - 1) * 10}</th>
                                            <td className="border border-bottom-0">{ss.baseValue}</td>
                                            <td className="border border-bottom-0">{ss.baseCode}</td>
                                            <td className='border border-bottom-0'><img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => handleDeleteMoreConstValue(ss.commonBaseDataId)} alt="" /></td>
                                            <td className=''><img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => handleEditMoreConstValue(ss.commonBaseDataId)} alt="" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </DialogContent>
            </DialogOverlay>
        </div>
    );
}

export default CommonBaseDataDialog;