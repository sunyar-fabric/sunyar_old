import React from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import soleymani from '../../static/image/soleymani.jpeg';

const PeymentGatewayDialog = ({ showDialog, closeDialog }) => {

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
                width: '1300px',
                margin: 'auto',
                paddingTop: '15px',
                paddingLeft: '15px',
                paddingRight: '15px',
            }}>
                <p className='text-center'>درگاه پرداخت زرین پال</p>
                <div className="mx-3">

                    <div className="row justify-content-center">
                        <div className="col-5 px-0 rounded border-gateway-peyment d-flex flex-column">
                            <p className='text-right py-1 px-0 border bg-blue rounded text-white'><i className="fa fa-credit-card mx-2" aria-hidden="true"></i>اطلاعات کارت</p>

                            <div className="d-flex align-items-center mx-2">
                                <span className='mx-2'>شماره کارت</span>
                                <input type="number" id="planName" name="planName" className="bg-input-dialog p-2 text-center" placeholder="- - - -" />
                                <input type="number" id="planName" name="planName" className="bg-input-dialog p-2 mr-1 text-center" placeholder="- - - -" />
                                <input type="number" id="planName" name="planName" className="bg-input-dialog p-2 mx-1 text-center" placeholder="- - - -" />
                                <input type="number" id="planName" name="planName" className="bg-input-dialog p-2 text-center" placeholder="- - - -" />
                            </div>

                            <div className="d-flex align-items-center mt-2 mx-2">
                                <span className='mx-2'>CVV2</span>
                                <input type="number" id="planName" name="planName" className="bg-input-dialog p-2 text-center"/>
                            </div>

                            <div className="d-flex align-items-center mt-2 mx-2">
                                <span className='mx-2'>تاریخ انقضای کارت</span>
                                <input type="text" id="planName" name="planName" className="bg-input-dialog p-2 text-center" placeholder='ماه'/>
                                <input type="text" id="planName" name="planName" className="bg-input-dialog p-2 text-center mr-5" placeholder='سال'/>
                            </div>

                            <div className="d-flex align-items-center mt-2 mx-2">
                                <span className='mx-2'> رمز دوم</span>
                                <input type="text" id="planName" name="planName" className="bg-input-dialog p-0 text-center" placeholder='ورود رمز'/>
                                <input readOnly type="text" id="planName" name="planName" className="p-0 text-center bg-success border-dynamic-pass cursor-pointer" placeholder='درخواست رمز پویا'/>
                            </div>

                        </div>

                        <div className="col-5  mr-3 px-0 rounded border-gateway-peyment">
                            <p className='text-right py-1 px-0 border bg-blue rounded text-white'><i className="fa fa-info-circle mx-2" aria-hidden="true"></i>اطلاعات پذیرنده</p>

                        </div>

                    </div>

                </div>

            </DialogContent>
        </DialogOverlay>);
}

export default PeymentGatewayDialog;