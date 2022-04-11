import React, { useContext, useEffect, useState } from 'react';
import ReactTable from "react-table";
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import trashIcon from '../../static/image/trashIcon.png';
import pencilIcon from '../../static/image/pencilIcon.png';
import DeleteCharityAccountDialog from '../dialogs/DeleteCharityAccountDialog';
import EditCharityAccountDialog from '../dialogs/EditCharityAccountDialog';
import Pagination from '../common/PaginationUi';
import CreateCharityAccountDialog from '../dialogs/CreateCharityAccountDialog';
import { useTranslation } from "react-i18next";

const CharityAccount = () => {

    const { setLoadingDialog } = useContext(MainContext)
    const [charityAccountId, setCharityAccountId] = useState('');
    const [charityAccount, setCharityAccount] = useState({});
    const [createCharityAccountDialog, setCreateCharityAccountDialog] = useState(false);
    const [editCharityAccountDialog, setEditCharityAccountDialog] = useState(false);
    const [deleteCharityAccountDialog, setDeleteCharityAccountDialog] = useState(false);
    const [charityAccounts, setCharityAccounts] = useState([]);
    const { t } = useTranslation()

    const handleDeleteCharityAccount = (id) => {
        setDeleteCharityAccountDialog(true)
        setCharityAccountId(id)
    }

    const handleEditCharityAccount = (charityAccount) => {
        setEditCharityAccountDialog(true)
        setCharityAccount(charityAccount)
    }

    const getCharityAccounts = async () => {

        setLoadingDialog(true)
        try {
            const { data, status } = await HttpService.get(`/api/sunyar/baseInfo/charityAccounts`)
            if (status === 200) {
                setCharityAccounts(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    useEffect(() => {
        getCharityAccounts()
    }, []);

    return (

        <div className="d-flex flex-column align-items-center">

            {createCharityAccountDialog ?
                <CreateCharityAccountDialog
                    getCharityAccounts={getCharityAccounts}
                    showDialog={createCharityAccountDialog}
                    closeDialog={() => setCreateCharityAccountDialog(false)}
                /> : null}

            {deleteCharityAccountDialog ?
                <DeleteCharityAccountDialog
                    getCharityAccounts={getCharityAccounts}
                    charityAccountId={charityAccountId}
                    showDialog={deleteCharityAccountDialog}
                    closeDialog={() => setDeleteCharityAccountDialog(false)}
                /> : null}

            {editCharityAccountDialog ?
                <EditCharityAccountDialog
                    getCharityAccounts={getCharityAccounts}
                    charityAccount={charityAccount}
                    showDialog={editCharityAccountDialog}
                    closeDialog={() => setEditCharityAccountDialog(false)}
                /> : null}

            <button className="d-flex align-items-center admin-btn text-white align-self-end m-3 mx-4" onClick={() => setCreateCharityAccountDialog(true)}>
                <i className="fa fa-plus bg-pluse"></i>
                <p className="mb-0 mr-2 ml-5 my-1">{t('Add')}</p>
            </button>


            <ReactTable
                className='table-responsive border table-width mb-5'
                defaultPageSize={12}
                PaginationComponent={Pagination}
                data={charityAccounts}
                filterable
                columns={[
                    {
                        Header: `${t('Bank_Name')}`,
                        accessor: "tblCommonBaseDatum.baseValue",
                    },
                    {
                        Header: `${t('Branch_Name')}`,
                        accessor: "branchName",
                    },
                    {
                        Header:  `${t('account_owner')}`,
                        accessor: "ownerName",
                    },
                    {
                        Header: `${t('Card_Number')}`,
                        accessor: "cardNumber",
                    },
                    {
                        Header: `${t('Account_Name')}`,
                        accessor: "accountName",
                    },
                    {
                        Header: `${t('Account_Number')}`,
                        accessor: "accountNumber",
                    },
                    {
                        Header: "",
                        accessor: "charityAccountId",
                        Cell: ({ value }) => <img className="bg-danger rounded p-1 cursor-pointer" src={trashIcon} onClick={() => handleDeleteCharityAccount(value)} alt="حذف" />,
                        Filter: () => <></>
                    },
                    {
                        Header: "",
                        accessor: "charityAccountId",
                        Cell: row => <img className="bg-warning rounded p-1 cursor-pointer" src={pencilIcon} onClick={() => handleEditCharityAccount(row.original)} alt="ویرایش" />,
                        Filter: () => <></>
                    },
                ]}
            />

        </div>
    );
}

export default CharityAccount;