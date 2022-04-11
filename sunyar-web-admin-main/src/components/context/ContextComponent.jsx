import React, { useState } from 'react';
import LoadingDialog from '../common/LoadingDialog';
import MainContext from './MainContext';

const ContextComponent = ({ children }) => {

    const [loadingDialog, setLoadingDialog] = useState(false);
    const [profile, setProfile] = useState();
    const [info, setInfo] = useState()

    return (<MainContext.Provider value={{
        loadingDialog,
        setLoadingDialog,
        info,
        setInfo,
        profile,
        setProfile
    }}>
        <div>
            {loadingDialog ? <LoadingDialog showDialog={loadingDialog} closeDialog={() => setLoadingDialog(false)} /> : null}
            {children}
        </div>
    </MainContext.Provider>);
}

export default ContextComponent;