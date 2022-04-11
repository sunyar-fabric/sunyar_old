import React from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import soleymani from '../../static/image/soleymani.jpeg';


const SuccessPeymentDialog = ({ showDialog, closeDialog, payPrice, planName }) => {

function handleClose() {
    
    closeDialog()
}

    return (
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
                margin: 'auto',
                paddingTop: '15px',
                paddingLeft: '15px',
                paddingRight: '15px',
            }}>

                <div className="container d-flex flex-column justify-content-center align-items-center px-0">

                    <i className="fa fa-times text-danger cursor-pointer align-self-end p-1 close-icon-hover" aria-hidden="true" onClick={handleClose}></i>

                    <div className="d-flex align-items-center mt-2">
                        <i className="fa fa-2x fa-check text-success ml-2" aria-hidden="true"></i>
                        <p className='text-center text-success mb-0 h5'>عملیات پرداخت برای طرح <span className='theme-color border-bottom pb-1'> {planName} </span>با موفقیت انجام گردید!</p>
                    </div>

                    <div className="d-flex mt-4">
                        <div className='d-flex flex-column justify-content-end'>
                            <p className='theme-color align-self-start mr-5'>شماره تراکنش: {Math.floor(Math.random() * 10000000000)}</p>
                            <p className='theme-color align-self-start mr-5' >مبلغ جمع‌آوری‌شده: {payPrice} ریال</p>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </DialogOverlay>);
}

export default SuccessPeymentDialog;