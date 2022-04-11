import React, { useEffect, useState } from 'react';
import LoadingDialog from '../common/LoadingDialog';
import MainContext from './MainContext';

const ContextComponent = ({ children }) => {

    const [loadingDialog, setLoadingDialog] = useState(false);
    const [info, setInfo] = useState()

    useEffect(() => {
    }, [])

    return (<MainContext.Provider value={{
        loadingDialog,
        setLoadingDialog,
        info,
        setInfo,
    }}>
        <div>
            {loadingDialog ? <LoadingDialog showDialog={loadingDialog} closeDialog={() => setLoadingDialog(false)} /> : null}
            {children}
        </div>
    </MainContext.Provider>);
}

export default ContextComponent;