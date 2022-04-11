import React from 'react';

import { DialogOverlay, DialogContent } from '@reach/dialog';

const LoadingDialog = ({ showDialog, closeDialog }) => {
    return (
        <DialogOverlay
            isOpen={showDialog}
            onDismiss={closeDialog}
            className="my-modal-s"
            style={{
                background: 'hsla(0, 100%, 100%, 0.9)',
                position: 'fixed',
                height: 'unset',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                zIndex: '20000000000000'
            }}
        >
            <DialogContent aria-labelledby="loading" style={{ backgroundColor: 'transparent' }}>
                <div
                    className="text-center mt-5 "
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100vh',
                        backgroundColor: 'transparent',
                    }}
                >
                    <div className="d-flex justify-content-center bg-transparent ">
                        
                    </div>
                    <p className="h4 text-center font-weight-bolder">لطفا منتظر بمانید...</p>
                </div>
            </DialogContent>
        </DialogOverlay>
    );
};

export default LoadingDialog;
