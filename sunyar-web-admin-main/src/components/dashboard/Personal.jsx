import React, { useContext, useEffect, useState } from 'react';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import PersonalDialog from '../dialogs/PersonalDialog';
import ReactTable from "react-table";
import Pagination from "../common/PaginationUi";
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from "../../static/image/pencilIcon.png";
import EditPersonalDialog from '../dialogs/EditPersonalDialog';
import DeletePersonalDialog from '../dialogs/DeletePersonalDialog';
import { useTranslation } from "react-i18next";


const Personal = () => {

    const [personalDialog, setPersonalDialog] = useState(false);
    const [editPersonalDialog, setEditPersonalDialog] = useState(false);
    const [deletePersonalDialog, setDeletePersonalDialog] = useState(false);
    const [personId, setPersonId] = useState();
    const [personals, setPersonals] = useState([]);
    const { setLoadingDialog } = useContext(MainContext)
    const { t } = useTranslation()


    const getAllPersonals = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get('/api/cms/um/personal/personal1')
            if (status === 200) {
                setPersonals(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleEditPersonal = async (id) => {
        setEditPersonalDialog(true)
        setPersonId(id)
    }

    const handleDeletePersonal = async (id) => {
        setDeletePersonalDialog(true)
        setPersonId(id)
    }

    useEffect(() => {
        getAllPersonals()
    }, [])

    return (

        <div className="d-flex flex-column align-items-center">

            {personalDialog ?
                <PersonalDialog
                    showDialog={personalDialog}
                    closeDialog={() => setPersonalDialog(false)}
                /> : null}

            {editPersonalDialog ?
                <EditPersonalDialog
                    personId={personId}
                    showDialog={editPersonalDialog}
                    closeDialog={() => setEditPersonalDialog(false)}
                /> : null}

            {deletePersonalDialog ?
                <DeletePersonalDialog
                    personId={personId}
                    showDialog={deletePersonalDialog}
                    closeDialog={() => setDeletePersonalDialog(false)}
                /> : null}

            <button className="d-flex align-items-center admin-btn text-white text-left align-self-end m-3 mx-4" onClick={() => setPersonalDialog(true)}>
                <i className="fa fa-plus bg-pluse"></i>
                <p className="mb-0 mr-2 mx-3  my-1">{t('Add')}</p>
            </button>

            <ReactTable
                className='table-responsive border table-width mb-5'
                defaultPageSize={12}
                PaginationComponent={Pagination}
                data={personals}
                filterable
                columns={[
                    {
                        Header: `${t('name')}`,
                        accessor: "name",
                    },
                    {
                        Header: `${t('family')}`,
                        accessor: "family",
                    },
                    {
                        Header: `${t('national_code')}`,
                        accessor: "nationalCode",
                    },
                    {
                        Header: `${t('gender')}`,
                        accessor: "sex",
                        Cell: ({ value }) => (value === true ? `${t('female')}` : `${t('male')}`),
                        filterMethod: (filter, row) => {
                            if (filter.value === String(row.sex)) {
                                console.log('Boolean(row.sex)', Boolean(row.sex));
                                return row;
                            }
                        },
                        Filter: ({ filter, onChange }) =>
                            <select
                                className='w-100'
                                onChange={event => onChange(event.target.value)}
                            >
                                <option value="">{t('filter')}</option>
                                <option value={true}>{t('female')}</option>
                                <option value={false}>{t('male')}</option>
                            </select>
                    },
                    {
                        Header: `${t('nature')}`,
                        accessor: "personType",
                        Cell: ({ value }) => (value === "1" ? `${t('personal')}` : `${t('donorator')}`),
                        filterMethod: (filter, row) => {
                            if (filter.value === row.personType) {
                                return row;
                            }
                        },
                        Filter: ({ filter, onChange }) =>
                            <select
                                className='w-100'
                                onChange={event => onChange(event.target.value)}
                            >
                                <option value="">{t('filter')}</option>
                                <option value="3">{t('donorator')}</option>
                                <option value="1">{t('personal')}</option>
                            </select>
                    },
                    {
                        Header: "",
                        accessor: "personId",
                        Cell: ({ value }) => (value.personType === '1' ? <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => { handleEditPersonal(value.personId) }} alt="" /> : <img className="bg-warning opacity-33 rounded p-1" src={pencilIcon} alt="" />),
                        Filter: () => <></>
                    },
                    {
                        Header: "",
                        accessor: "personId",
                        Cell: ({ value }) => (value.personType === '1' ? <img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => { handleDeletePersonal(value.personId) }} alt="" /> : <img className="bg-danger opacity-33 rounded p-1" src={trashIcon} alt="" />),
                        Filter: () => <></>
                    }
                ]}
            />

        </div>
    );

}

export default Personal;