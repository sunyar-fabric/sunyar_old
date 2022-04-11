import React, { useContext, useEffect, useState } from 'react';
import HttpService from '../../service/HttpService';
import MainContext from '../context/MainContext';
import Accordion from '../common/Accordion';
import chevron from '../../static/image/chevron.png';
import { persianToTimestamp, fixNumbers, timestampToPersian } from '../../util/DateUtil';
import Pagination from '../common/PaginationServer';
import DatePicker from 'react-multi-date-picker';
import { toastSuccess } from '../../util/ToastUtil';
import { useHistory } from 'react-router';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const Settelment = () => {

    const history = useHistory()

    const { setLoadingDialog } = useContext(MainContext)
    const [index, setIndex] = useState('settelment');
    const [settelmentState, setSettelmentState] = useState('get');
    const [neededPrice, setNeededPrice] = useState(0);
    const [planId, setPlanId] = useState(null);
    const [needyId, setNeedyId] = useState(null);
    const [needyAccountNumber, setNeedyAccountNumber] = useState(0);
    const [needyAccounts, setNeedyAccounts] = useState([]);
    const [donatorId, setDonatorId] = useState(null);
    const [needysAssignedToPlan, setNeedysAssignedToPlan] = useState([])
    const [allNeedys, setAllNeedys] = useState([])
    const [donators, setDonators] = useState([])
    const [charityAccounts, setCharityAccounts] = useState([])
    const [charityAccountId, setCharityAccountId] = useState('')
    const [charityAccountNumber, setCharityAccountNumber] = useState(0)
    const [totalPaymentPrice, setTotalPaymentPrice] = useState(0);
    const [totalSettelment, setTotalSettelment] = useState(0);
    const [plans, setPlans] = useState([]);
    const [donatorCash, setDonatorCash] = useState([]);
    const [allSettelment, setAllSettelment] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)
    const [cashAssistanceDetailId, setCashAssistanceDetailId] = useState(null)
    const [needyAssistance, setNeedyAssistance] = useState([])
    const [select, setSelect] = useState('');

    const getPlans = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/plan/plan/planTree`)
            if (status === 200) {
                setPlans(data[0].get_tree)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleCreateSettelment = () => {
        setSettelmentState('post')
        setTotalPaymentPrice(0)
        setTotalSettelment(0)
        setNeededPrice(0)
    }

    // refresh page and run function after;

    function myFunction() {
        setIndex('donatorCash')
    }
    window.onload = function () {
        var reloading = sessionStorage.getItem("reloading");
        if (reloading) {
            sessionStorage.removeItem("reloading");
            myFunction();
        }
    }

    function reloadP() {
        sessionStorage.setItem("reloading", "true");
        document.location.reload();
    }

    function reload() {
        window.location.reload()
    }


    const getDonatorCash = async () => {
        setLoadingDialog(true)
        try {

            let { status, data } = await HttpService.get(`/api/sunyar/operation/payment?charityAccountId=${null}`)
            if (status === 200) {
                let g = 0;
                data.forEach(element => g += Number(element.paymentPrice));
                setTotalPaymentPrice(g)
                setDonatorCash(data)
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const getDonatorsAndCharityAccounts = async () => {
        setLoadingDialog(true)
        try {
            let { status, data } = await HttpService.get(`/api/cms/um/personal?personType=3`)
            if (status === 200) {
                setDonators(data)
            }
            let charityAccountsRes = await HttpService.get(`/api/sunyar/baseInfo/charityAccounts`)
            if (charityAccountsRes.status === 200) {

                setCharityAccounts(charityAccountsRes.data)
                setCharityAccountId(charityAccountsRes.data[0]?.charityAccountId)
                setCharityAccountNumber(charityAccountsRes.data[0]?.accountNumber)

            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const getAllNeedys = async () => {
        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/cms/um/personal?personType=2`)
            if (status === 200) {
                setAllNeedys(data)
                console.log('allNeedys', data);
            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const getAssignedNeedysForPlan = async (planId) => {
        try {

            setTotalPaymentPrice(0)
            setNeededPrice(0)
            setTotalSettelment(0)

            setPlanId(planId)
            const { status, data } = await HttpService.get(`/api/sunyar/plan/needyToPlan?planId=${planId}`)
            if (status === 200) {
                setNeedyAssistance(data)
                if (data[0]?.needyId) { setNeedyId(data[0]?.needyId) } else { setNeedyId(null) }

                console.log('needyId', data[0]?.needyId);
                if (data.length === 0) {
                    let res = await HttpService.get(`/api/cms/um/personal?personType=2`)
                    setNeedysAssignedToPlan(data)
                    setAllNeedys(res.data)
                    setLoadingDialog(false)
                    return
                }

                // setNeedyId(null)
                setNeedysAssignedToPlan(data)
            }
        } catch (error) { }
    }


    const needyAccountRequest = async (id) => {

        setLoadingDialog(true)
        try {
            const { status, data } = await HttpService.get(`/api/sunyar/beneficiary/needyAccounts?${needyId === null || needyId === '0' ? '' : `needyId=${needyId}`}`)
            if (status === 200) {
                setNeedyAccounts(data)
                setNeedyAccountNumber(data[0]?.accountNumber)


            }
        } catch (error) { }
        setLoadingDialog(false)
    }

    const handleFilter = async (search, index, fillteringSettelmentIndex) => {

        setLoadingDialog(true)

        console.log('needyId', needyId);

        if (planId) {


            try {
                console.log('needyId', needyId);
                const needyAccountsRes = await HttpService.get(`/api/sunyar/beneficiary/needyAccounts?${needyId === null || needyId === '0' ? '' : `needyId=${needyId}`}`)
                if (needyAccountsRes.status === 200) {
                    setNeedyAccounts(needyAccountsRes.data)
                    setNeedyAccountNumber(needyAccountsRes.data[0]?.accountNumber)
                }

                const planRes = await HttpService.get(`/api/sunyar/plan/needyToPlan?${planId === null ? '' : `planId=${planId}`}${needyId === null || needyId === '0' ? '' : `&needyId=${needyId}`}`)


                    if (planRes.status === 200) {
                        const cashRes = await HttpService.get(`/api/sunyar/plan/succorCash?${planRes.data.length === 0 ? '' : `assignNeedyPlanId=${planRes.data[0]?.assignNeedyPlanId}`}${planId === null ? '' : `&planId=${planId}`}`)
                        if (cashRes.status === 200) {
                            if (cashRes.data.length === 0) {
                                setLoadingDialog(false)
                                setDonatorCash([])
                                setTotalPaymentPrice(0)
                                console.log('cashRes.data', cashRes.data);
                                return
                            }
                            setNeededPrice(cashRes.data[0]?.neededPrice)
                            let fDate = null
                            let tDate = null
                            if (search) {
                                fDate = document.getElementById('fDate').value.split('/')
                                fDate = fDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(fDate[0])), parseInt(fixNumbers(fDate[1])), parseInt(fixNumbers(fDate[2]))) : null
                                tDate = document.getElementById('tDate').value.split('/')
                                tDate = tDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(tDate[0])), parseInt(fixNumbers(tDate[1])), parseInt(fixNumbers(tDate[2]))) : null
                            }



                            const peymentRes = await HttpService.get(`/api/sunyar/operation/payment?cashAssistanceDetailId=${cashRes.data[0]?.cashAssistanceDetailId}${needyId === null || needyId === '0' ? '' : `&needyId=${needyId}`}&fDate=${fDate}&tDate=${tDate}${donatorId === null || donatorId == '0' ? '' : `&donatorId=${fillteringSettelmentIndex ? null : donatorId}`}&charityAccountId=${fillteringSettelmentIndex ? charityAccountId : null}`)


                            setCashAssistanceDetailId(cashRes?.data[0]?.cashAssistanceDetailId)
                            if (peymentRes.status === 200) {


                                const totalPaymentRes = await HttpService.get(`/api/sunyar/operation/donatorSettelment?cashAssistanceDetailId=${cashRes.data[0]?.cashAssistanceDetailId}&fDate=${fDate}&tDate=${tDate}${donatorId === null || donatorId == '0' ? '' : `&donatorId=${donatorId}`}`)

                                if (fillteringSettelmentIndex) {
                                    const totalSettelmentRes = await HttpService.get(`/api/sunyar/operation/charitySettelment?${needyId === null || needyId === '0' ? '' : `needyId=${needyId}`}&cashAssistanceDetailId=${cashRes.data[0]?.cashAssistanceDetailId}${charityAccountId == "0" ? '' : `&charityAccountId=${charityAccountId}`}&fDate=${fDate}&tDate=${tDate}`)
                                    if (totalSettelmentRes.status === 200) {
                                        setTotalSettelment(totalSettelmentRes.data[0]?.totalPaymentPrice)
                                    }
                                }

                                if (totalPaymentRes.status === 200) {
                                    setTotalPaymentPrice(totalPaymentRes.data[0]?.totalPaymentPrice)
                                    console.log('totalPaymentRes.data', totalPaymentRes.data);
                                }
                                setDonatorCash(peymentRes.data)
                                setAllSettelment(peymentRes.data)
                            }
                        }
                    }
                
            } catch (error) { }

        } else if (needyId) {

            let fDate = null
            let tDate = null
            if (search) {
                fDate = document.getElementById('fDate').value.split('/')
                fDate = fDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(fDate[0])), parseInt(fixNumbers(fDate[1])), parseInt(fixNumbers(fDate[2]))) : null
                tDate = document.getElementById('tDate').value.split('/')
                tDate = tDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(tDate[0])), parseInt(fixNumbers(tDate[1])), parseInt(fixNumbers(tDate[2]))) : null
            }

            const peymentRess = await HttpService.get(`/api/sunyar/operation/payment?needyId=${needyId}&fDate=${fDate}&tDate=${tDate}${donatorId === null || donatorId == '0' ? '' : `&donatorId=${fillteringSettelmentIndex ? null : donatorId}`}&charityAccountId=${fillteringSettelmentIndex ? charityAccountId : null}`)

            setAllSettelment(peymentRess.data)
            setDonatorCash(peymentRess.data)
            let sum = 0
            for (let i = 0; i < peymentRess.data.length; i++) {
                sum = sum + parseInt(peymentRess.data[i].paymentPrice)
            }
            console.log('sum', sum);
            setTotalPaymentPrice(sum)

        }
        else {

            let fDate = null
            let tDate = null
            if (search) {
                fDate = document.getElementById('fDate').value.split('/')
                fDate = fDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(fDate[0])), parseInt(fixNumbers(fDate[1])), parseInt(fixNumbers(fDate[2]))) : null
                tDate = document.getElementById('tDate').value.split('/')
                tDate = tDate.length > 1 ? persianToTimestamp(parseInt(fixNumbers(tDate[0])), parseInt(fixNumbers(tDate[1])), parseInt(fixNumbers(tDate[2]))) : null
            }

            const peymentRess = await HttpService.get(`/api/sunyar/operation/payment?fDate=${fDate}&tDate=${tDate}${donatorId === null || donatorId == '0' ? '' : `&donatorId=${fillteringSettelmentIndex ? null : donatorId}`}&charityAccountId=${fillteringSettelmentIndex ? charityAccountId : null}`)

            setAllSettelment(peymentRess.data)
            setDonatorCash(peymentRess.data)
            let sum = 0
            for (let i = 0; i < peymentRess.data.length; i++) {
                sum = sum + parseInt(peymentRess.data[i].paymentPrice)
            }
            console.log('sum', sum);
            setTotalPaymentPrice(sum)
        }

        setLoadingDialog(false)
    }

    const handleCreatesettelmentPrice = async () => {
        const settelmentPrice = document.getElementById('settelmentPrice').value
        const settelmentDate = document.getElementById('settelmentDate').value
        let date = settelmentDate.split('/')
        const settelmentTime = document.getElementById('settelmentTime2').value + ':' + document.getElementById('settelmentTime1').value

        let body = { donatorId: null, paymentGatewayId: 1, cashAssistanceDetailId, paymentPrice: settelmentPrice, paymentDate: persianToTimestamp(parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2]))), paymentTime: settelmentTime, paymentStatus: 'success', sourceAccoutNumber: charityAccountNumber, targetAccountNumber: needyAccountNumber, charityAccountId: charityAccountId, followCode: '1234567891', needyId: needyId ? needyId : null }

        setLoadingDialog(true)
        try {
            console.log('hfluitghjvgkjiflyuf');
            let { status } = await HttpService.post(`/api/sunyar/operation/settelment`, body)
            if (status === 200) {
                toastSuccess('اطلاعات با موفقیت ثبت گردید!')
                getAllSettelment()
                setSettelmentState('get')
            }
        } catch (error) { }
        setLoadingDialog(false)
    }


    async function getCharityAccountIdByCharityAccountNumber(accountNumber) {
        const charityAccountIdRes = await HttpService.get(`/api/sunyar/baseInfo/charityAccounts?accountNumber=${accountNumber}`)
        if (charityAccountIdRes.status === 200) {
            setCharityAccountId(charityAccountIdRes.data[0]?.charityAccountId)
        }
    }

    async function getAllSettelment() {
        const { data, status } = await HttpService.get(`/api/sunyar/operation/payment/loadSettelment`)
        if (status === 200) {
            setAllSettelment(data)
            console.log("kole tasvieye ha", data);
        }
    }

    const faChevronDown = <i className="fa fa-chevron-down font-size-10px" aria-hidden="true"></i>
    const faChevronLeft = <i className="fa fa-chevron-left font-size-10px" aria-hidden="true"></i>

    useEffect(() => {
        getAllSettelment()
        getDonatorCash()
        getAllNeedys()
        getDonatorsAndCharityAccounts()
        getPlans()
        needyAccountRequest()

    }, [currentPage]);

    useEffect(() => {
        getCharityAccountIdByCharityAccountNumber(charityAccountNumber)
    }, [charityAccountNumber]);

    return (

        <div className="d-flex flex-column align-items-center">

            <ul className="d-flex border card-heading list-style-type-none">
                <li className={`cursor-pointer p-2 border-radius-10px ${index === 'settelment' ? "active-card-heading" : 'bg-header A7BBCB'} `} onClick={() => { setIndex('settelment'); getAllSettelment() }}>
                    تسویه
                </li>
                <li className={`cursor-pointer p-2 A7BBCB ${index === 'donatorCash' ? "active-card-heading rounded-0" : ''}`} onClick={() => setIndex('donatorCash')}>
                    کمک‌های خیّرین
                </li>
            </ul>

            {index === 'donatorCash' ?
                <>
                    <div className="row w-100">

                        <div className="col-6 d-flex flex-column align-self-start mx-3 mt-2">

                            <p className='text-center rounded-top mb-0 p-1 bg-header-table border-gray'>انتخاب طرح‌</p>

                            {plans.length > 0 ?

                                <ul className="rounded bg-white px-0" >

                                    {plans.map(

                                        (plan, index) =>

                                            <>
                                                {!plan.parentPlanId ?
                                                    <Accordion state='settelment' className={`p-2 ${plans.length !== (index + 1) ? 'border-bottom' : ''}`} childs={plan} title={plan.planName} icon={faChevronLeft} collapsedIcon={faChevronDown} setSelect={setSelect} select={select} getAssignedNeedysForPlan={getAssignedNeedysForPlan}>
                                                        <div className="d-flex flex-column">
                                                            {plan?.children?.length > 0 ?
                                                                <>
                                                                    {plan.children.map((a, index) =>
                                                                        <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} setSelect={setSelect} select={select} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                            <div className="d-flex flex-column">
                                                                                {plan?.children[index]?.children.length > 0 ?
                                                                                    <>
                                                                                        {plan.children[index]?.children.map(a =>
                                                                                            <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} setSelect={setSelect} select={select} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                                            </Accordion>)}
                                                                                    </>
                                                                                    : null}
                                                                            </div>
                                                                        </Accordion>)}
                                                                </>
                                                                : null}
                                                        </div>
                                                    </Accordion>
                                                    : null}
                                            </>

                                    )}
                                </ul>

                                :
                                <p className='text-center p-3 mb-3 border rounded-bottom'>اطلاعاتی جهت نمایش وجود ندارد!</p>}
                        </div>

                        <div className="col-5 d-flex flex-column justify-content-start mt-2 mr-3">

                            <div className="d-flex">

                                {planId ?
                                    <>
                                        {needysAssignedToPlan.length > 0 ?
                                            <div className="d-flex align-items-center bg-white rounded height-fit-content flex-grow-1 col-6 px-0">
                                                <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام نیازمند </span>
                                                <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value ? e.target.value : null)}>
                                                    {needysAssignedToPlan.length > 0 ?
                                                        needysAssignedToPlan.map(b =>
                                                            <option value={b?.needyId}>{`${b?.tblPersonal?.name} ${b?.tblPersonal?.family}`}</option>
                                                        )
                                                        : null}
                                                </select>
                                            </div>
                                            :

                                            <div className="d-flex align-items-center bg-white rounded height-fit-content flex-grow-1 col-6 px-0">
                                                <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام نیازمند </span>
                                                <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value ? e.target.value : null)}>
                                                </select>
                                            </div>}
                                    </>
                                    :

                                    <div className="d-flex align-items-center bg-white rounded height-fit-content flex-grow-1 col-6 px-0">
                                        <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام نیازمند </span>
                                        <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value ? e.target.value : null)}>
                                            <option value=''> انتخاب کنید </option>
                                            {allNeedys.length > 0 ?
                                                allNeedys.map(b =>
                                                    <option value={b?.personId}>{`${b?.name} ${b?.family}`}</option>
                                                )
                                                : null}
                                        </select>
                                    </div>
                                }

                                <div className="d-flex align-items-center bg-white rounded height-fit-content mr-3 flex-grow-1 col-6 px-0">
                                    <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام خیّــر </span>
                                    <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="donator" name="donator" onChange={(e) => setDonatorId(e.target.value)}>
                                        <option value="0" >انتخاب کنید</option>
                                        {donators.length > 0 ?
                                            donators.map(b =>
                                                <option value={b?.personId}>{`${b?.name} ${b?.family}`}</option>
                                            )
                                            : null}
                                    </select>
                                </div>

                            </div>

                            <div className="d-flex mt-3">

                                <DatePicker
                                    locale={persian_fa}
                                    calendar={persian}
                                    inputMode='none'
                                    placeholder='از تاریخ پرداخت'
                                    inputClass='w-100 outline-none'
                                    containerClassName="w-100 col-6 px-0"
                                    id="fDate"
                                    multiple={false} />

                                <DatePicker
                                    locale={persian_fa}
                                    calendar={persian}
                                    inputMode='none'
                                    placeholder='تا تاریخ پرداخت'
                                    inputClass='w-100 outline-none'
                                    containerClassName="w-100 mr-3 col-6 px-0"
                                    id="tDate"
                                    multiple={false} />

                            </div>

                        </div>

                    </div>


                    <div className="d-flex justify-content-center align-items-center align-self-end ml-5">

                        <button className="d-flex align-items-center admin-btn text-white" onClick={() => handleFilter(true)}>
                            <i className="fa fa-search-plus bg-pluse"></i>
                            <p className="m-1 px-3">جستجو</p>
                        </button>

                        <button className="d-flex align-items-center admin-btn text-white mr-3" onClick={reloadP}>
                            <i className="fa fa-refresh bg-pluse"></i>
                            <p className="m-1 px-3">بازیابی</p>
                        </button>

                    </div>

                    <div className="table-responsive border table-width mb-5 mt-4">
                        {donatorCash.length > 0 ?
                            <table class="table p-0 m-0">
                                <thead className="">
                                    <tr className="text-center">
                                        <th scope="col"> نام طرح</th>
                                        <th scope="col">نام نیازمند</th>
                                        <th scope="col">نام خیّر</th>
                                        <th scope="col">کد پیگیری</th>
                                        <th scope="col"> مبلغ پرداخت (ريال)</th>
                                        <th scope="col"> وضعیت پرداخت</th>
                                        <th scope="col"> زمان پرداخت</th>
                                        <th scope="col"> تاریخ پرداخت</th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {donatorCash.length > 0 ? donatorCash?.map((ss, index) => (
                                        <tr className="text-center">
                                            <td className='border border-bottom-0'>{ss?.tblCashAssistanceDetail?.tblPlan?.planName}</td>
                                            <td className='border border-bottom-0'>{ss?.needy ? ss?.needy?.name + " " + ss?.needy?.family : '_'}</td>
                                            <td className='border border-bottom-0'>{ss?.donator ? ss?.donator?.name + ' ' + ss?.donator?.family : '_'} </td>
                                            <td className='border border-bottom-0'>{ss?.followCode}</td>
                                            <td className='border border-bottom-0'>{ss?.paymentPrice}</td>
                                            <td className='border border-bottom-0'>{ss?.paymentStatus === 'success' ? 'موفق' : 'ناموفق'}</td>
                                            <td className='border border-bottom-0'>{ss?.paymentTime}</td>
                                            <td className='border border-bottom-0'>{ss?.paymentDate ? timestampToPersian(new Date(ss?.paymentDate).getTime()) : null}</td>
                                        </tr>
                                    )) : null}
                                </tbody>
                            </table> : <h3 className='my-5 text-secondary text-center'> نتیجه‌ای یافت نشد!</h3>}

                    </div>

                    <div className="d-flex align-items-baseline align-self-start mr-5">
                        <p className=''> جمع مبالغ کمک‌های اهدایی:</p>
                        <span className='mx-2 border rounded px-3 py-1'>  {totalPaymentPrice} ريال</span>
                    </div>
                </>
                :
                <>
                    {settelmentState === 'get' ?
                        <>

                            <div className="row w-100">

                                <div className="col-6 d-flex flex-column align-self-start mx-3 mt-2">

                                    <p className='text-center bg-header-table text-dark rounded-top mb-0 p-1 bg-header-table border-gray'>انتخاب طرح‌</p>

                                    {plans.length > 0 ?

                                        <ul className="rounded bg-white px-0" >

                                            {plans.map(

                                                (plan, index) =>

                                                    <>
                                                        {!plan.parentPlanId ?
                                                            <Accordion state='settelment' className={`p-2 ${plans.length !== (index + 1) ? 'border-bottom' : ''}`} childs={plan} title={plan.planName} icon={faChevronLeft} collapsedIcon={faChevronDown} setSelect={setSelect} select={select} getAssignedNeedysForPlan={getAssignedNeedysForPlan}>
                                                                <div className="d-flex flex-column">
                                                                    {plan?.children?.length > 0 ?
                                                                        <>
                                                                            {plan.children.map((a, index) =>
                                                                                <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} setSelect={setSelect} select={select} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                                    <div className="d-flex flex-column">
                                                                                        {plan?.children[index]?.children.length > 0 ?
                                                                                            <>
                                                                                                {plan.children[index]?.children.map(a =>
                                                                                                    <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} setSelect={setSelect} select={select} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                                                    </Accordion>)}
                                                                                            </>
                                                                                            : null}
                                                                                    </div>
                                                                                </Accordion>)}
                                                                        </>
                                                                        : null}
                                                                </div>
                                                            </Accordion>
                                                            : null}
                                                    </>

                                            )}
                                        </ul>

                                        :
                                        <p className='text-center p-3 mb-3 border rounded-bottom'>اطلاعاتی جهت نمایش وجود ندارد!</p>}
                                </div>

                                <div className="col-5 d-flex flex-column justify-content-start mt-2 mr-3">

                                    <div className="d-flex">
                                        {planId ?
                                            <>
                                                {needysAssignedToPlan.length > 0 ?
                                                    <div className="d-flex align-items-center bg-white rounded height-fit-content flex-grow-1 col-6 px-0">
                                                        <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام نیازمند </span>
                                                        <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value ? e.target.value : null)}>
                                                            {needysAssignedToPlan.length > 0 ?
                                                                needysAssignedToPlan.map(b =>
                                                                    <option value={b?.needyId}>{`${b?.tblPersonal?.name} ${b?.tblPersonal?.family}`}</option>
                                                                )
                                                                : null}
                                                        </select>
                                                    </div>
                                                    :

                                                    <div className="d-flex align-items-center bg-white rounded height-fit-content flex-grow-1 col-6 px-0">
                                                        <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام نیازمند </span>
                                                        <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value ? e.target.value : null)}>
                                                            <option value=''> انتخاب کنید </option>
                                                            {allNeedys.length > 0 ?
                                                                allNeedys.map(b =>
                                                                    <option value={b?.personId}>{`${b?.name} ${b?.family}`}</option>
                                                                )
                                                                : null}
                                                        </select>
                                                    </div>}
                                            </>
                                            :

                                            <div className="d-flex align-items-center bg-white rounded height-fit-content flex-grow-1 col-6 px-0">
                                                <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> نام نیازمند </span>
                                                <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value ? e.target.value : null)}>
                                                    <option value=''> انتخاب کنید </option>
                                                    {allNeedys.length > 0 ?
                                                        allNeedys.map(b =>
                                                            <option value={b?.personId}>{`${b?.name} ${b?.family}`}</option>
                                                        )
                                                        : null}
                                                </select>
                                            </div>
                                        }

                                        <div className="d-flex align-items-center bg-white rounded height-fit-content mr-3 flex-grow-1 col-6 px-0">
                                            <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small border-gray" id="basic-addon1"> شماره حساب خیریه </span>
                                            <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="charityAccountNumber" name="charityAccountNumber" onChange={e => setCharityAccountId(e.target.value)} >
                                                <option value="0" >انتخاب کنید</option>
                                                {charityAccounts.length > 0 ?
                                                    charityAccounts.map(b =>
                                                        <option value={b?.charityAccountId}>{`${b?.accountName}`}</option>
                                                    )
                                                    : null}
                                            </select>
                                        </div>

                                    </div>

                                    <div className="d-flex mt-3">

                                        <DatePicker
                                            locale={persian_fa}
                                            calendar={persian}
                                            inputMode='none'
                                            placeholder='از تاریخ پرداخت'
                                            inputClass='w-100 outline-none'
                                            containerClassName="w-100 col-6 px-0"
                                            id="fDate"
                                            multiple={false} />

                                        <DatePicker
                                            locale={persian_fa}
                                            calendar={persian}
                                            inputMode='none'
                                            placeholder='تا تاریخ پرداخت'
                                            inputClass='w-100 outline-none'
                                            containerClassName="w-100 mr-3 col-6 px-0"
                                            id="tDate"
                                            multiple={false} />

                                    </div>

                                </div>

                            </div>


                            <div className="d-flex justify-content-center align-items-center align-self-end ml-5">

                                <button className="d-flex align-items-center admin-btn text-white" onClick={() => handleFilter(true, null, true)}>
                                    <i className="fa fa-search-plus bg-pluse"></i>
                                    <p className="m-1 px-3">جستجو</p>
                                </button>

                                <button className="d-flex align-items-center admin-btn text-white mr-3" onClick={reload}>
                                    <i className="fa fa-refresh bg-pluse"></i>
                                    <p className="m-1 px-3">بازیابی</p>
                                </button>

                                <button className="d-flex align-items-center admin-btn text-white align-self-end m-3" onClick={handleCreateSettelment}>
                                    <i className="fa fa-plus bg-pluse"></i>
                                    <p className="mb-0 mr-2 ml-5 my-1">افزودن</p>
                                </button>

                            </div>

                            <div className="table-responsive border table-width mb-5 mt-4">
                                {allSettelment.length > 0 ?
                                    <table class="table p-0 m-0">
                                        <thead className="">
                                            <tr className="text-center">
                                                <th scope="col"> نام طرح</th>
                                                <th scope="col">نام نیازمند</th>
                                                <th scope="col">کد پیگیری</th>
                                                <th scope="col"> مبلغ پرداخت (ريال)</th>
                                                <th scope="col"> وضعیت پرداخت</th>
                                                <th scope="col"> زمان پرداخت</th>
                                                <th scope="col"> تاریخ پرداخت</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allSettelment.map((ss, index) => (
                                                <tr className="text-center">
                                                    <td className='border border-bottom-0'>{ss?.tblCashAssistanceDetail?.tblPlan?.planName}</td>
                                                    <td className='border border-bottom-0'>{ss.needyId ? ss?.needy?.name + " " + ss?.needy?.family : '__'}</td>
                                                    <td className='border border-bottom-0'>{ss?.followCode}</td>
                                                    <td className='border border-bottom-0'>{ss?.paymentPrice}</td>
                                                    <td className='border border-bottom-0'>{ss?.paymentStatus === 'success' ? 'موفق' : 'ناموفق'}</td>
                                                    <td className='border border-bottom-0'>{ss?.paymentTime}</td>
                                                    <td className='border border-bottom-0'>{ss?.paymentDate ? timestampToPersian(new Date(ss?.paymentDate).getTime()) : null}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> : <h3 className='my-5 text-secondary text-center'> نتیجه‌ای یافت نشد!</h3>}

                            </div>
                            {allSettelment && count > 12 ?
                                <Pagination
                                    total={count}
                                    currentPage={currentPage}
                                    perPage={12}
                                    onPageChange={(page) => setCurrentPage(page)}
                                /> : null}
                        </>
                        :
                        <>
                            <div className="row justify-content-center align-items-center rounded w-100">

                                <div className="col-6 d-flex flex-column align-self-start mt-4">

                                    <p className='text-center bg-header-table text-dark rounded-top mb-0 p-1 border-gray'>انتخاب طرح‌</p>

                                    {plans.length > 0 ?

                                        <ul className="rounded bg-white px-0" >

                                            {plans.map(

                                                (plan, index) =>

                                                    <>
                                                        {!plan.parentPlanId ?
                                                            <Accordion state='settelment' className={`p-2 ${plans.length !== (index + 1) ? 'border-bottom' : ''}`} childs={plan} title={plan.planName} icon={faChevronLeft} setSelect={setSelect} select={select} collapsedIcon={faChevronDown} getAssignedNeedysForPlan={getAssignedNeedysForPlan}>
                                                                <div className="d-flex flex-column">
                                                                    {plan?.children?.length > 0 ?
                                                                        <>
                                                                            {plan.children.map((a, index) =>
                                                                                <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} isChild={true} setSelect={setSelect} select={select} icon={faChevronLeft} collapsedIcon={faChevronDown} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                                    <div className="d-flex flex-column">
                                                                                        {plan?.children[index]?.children.length > 0 ?
                                                                                            <>
                                                                                                {plan.children[index]?.children.map(a =>
                                                                                                    <Accordion state='settelment' logoImage={chevron} className="cursor-pointer mr-5" title={`${a.planName}`} childs={a} setSelect={setSelect} select={select} isChild={true} icon={faChevronLeft} collapsedIcon={faChevronDown} getAssignedNeedysForPlan={getAssignedNeedysForPlan} to="/" >
                                                                                                    </Accordion>)}
                                                                                            </>
                                                                                            : null}
                                                                                    </div>
                                                                                </Accordion>)}
                                                                        </>
                                                                        : null}
                                                                </div>
                                                            </Accordion>
                                                            : null}
                                                    </>

                                            )}
                                        </ul>

                                        :
                                        <p className='text-center p-3 mb-3 border rounded-bottom'>اطلاعاتی جهت نمایش وجود ندارد!</p>}
                                </div>

                                <div className="col-3 d-flex flex-column align-self-start mt-4">

                                    <p className='text-center bg-header-table text-dark rounded-top mb-0 p-1 bg-header-table border-gray'>انتخاب شماره حساب خیریه</p>
                                    {charityAccounts.length > 0 ?
                                        <div className="d-flex align-items-center bg-white rounded flex-grow-1 px-0 mb-3">
                                            <select className="bg-white outline-none border-0 rounded font-size-small flex-grow-1 py-2" aria-label="Default select example" id="charityAccountNumber" name="charityAccountNumber" onChange={(e) => setCharityAccountNumber(e.target.value)}>
                                                {charityAccounts.length > 0 ?
                                                    charityAccounts.map(b =>
                                                        <option value={b?.accountNumber}>{`${b?.accountNumber} _ ${b?.accountName}`}</option>
                                                    )
                                                    : null}
                                            </select>
                                        </div>
                                        : null
                                    }

                                </div>

                                <div className="col-3 d-flex flex-column align-self-start mt-4">

                                    <p className='text-center bg-header-table text-dark rounded-top mb-0 p-1 bg-header-table border-gray'>انتخاب نیازمند</p>
                                    {needysAssignedToPlan.length > 0 ?
                                        <div className="d-flex align-items-center bg-white rounded flex-grow-1 px-0 mb-3">
                                            <select className="bg-white outline-none border-0 rounded font-size-small flex-grow-1 py-2" aria-label="Default select example" id="selectNeedy" name="needyName" onChange={(e) => setNeedyId(e.target.value)}>

                                                {needysAssignedToPlan?.map(b =>
                                                    <option value={b?.needyId}>{`${b?.tblPersonal?.name} ${b?.tblPersonal?.family}`}</option>
                                                )}

                                            </select>
                                        </div>
                                        :
                                        <div className="d-flex align-items-center bg-white rounded px-0 mb-3">
                                            <select className="bg-white outline-none border-0 rounded font-size-small flex-grow-1 py-2" aria-label="Default select example" id="needyName" name="needyName" onChange={(e) => setNeedyId(e.target.value)}>
                                                <option value='0'>{planId ? ' لیست کل نیازمندان ' : '  انتخاب کنید '}</option>
                                                {planId ? allNeedys?.map(b => <option value={b?.personId}>{`${b?.name} ${b?.family}`}</option>) : null}
                                            </select>
                                        </div>
                                    }
                                    <button className="btn btn-outline-dark align-self-end w-100" onClick={() => handleFilter(false, true, true)}>نمایش اطلاعات تکمیلی</button>
                                </div>

                            </div>


                            <div className='col-12 d-flex flex-column align-items-center justify-content-center'>

                                <div className='mt-5 mx-3'>

                                    <div className='row text-center'>
                                        <div className='dropdown-divider col-12' />
                                        <p className='h5 font-weight-bolder text-dark col-12 text-right  mb-3'>اطلاعات تکمیلی</p>
                                        <div className='col-12 col-md-6 col-lg-4 d-flex '>
                                            <p className='text-secondary mx-2'>جمع کمک‌های اهدایی: {totalPaymentPrice} ريال </p>
                                            <p className='text-dark' id="birthDate"></p>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 d-flex '>
                                            <p className='text-secondary'>جمع تسویه‌های خیریه تا کنون: {totalSettelment} ريال </p>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 d-flex '>
                                            <p className='text-secondary'>مبلغ مورد نیاز: {neededPrice} ريال </p>
                                        </div>

                                        <div className='dropdown-divider col-12' />
                                        <p className='h5 font-weight-bolder text-dark col-12 text-right mb-3'>اطلاعات ورودی</p>

                                        <div className='col-12 col-md-6 col-lg-4 d-flex my-2 align-items-center'>
                                            <DatePicker
                                                value={timestampToPersian(new Date().getTime())}
                                                onFocusedDateChange={e => console.log('e.target.value', e)}
                                                locale={persian_fa}
                                                calendar={persian}
                                                inputMode='none'
                                                inputClass='w-100 border-0 rounded px-2'
                                                containerClassName=""
                                                placeholder="تاریخ پرداخت "
                                                id="settelmentDate"
                                                multiple={false} />
                                        </div>

                                        <div className='d-flex justify-content-start align-items-center col-12 col-md-6 col-lg-4'>

                                            <input type="text" className=' text-center timeInput rounded border-0' maxlength="2" placeholder='00' id='settelmentTime1' name='settelmentTime' />
                                            <p className='mb-0 mx-1 pb-0 timeP text-secondary'>:</p>
                                            <input type="text" className=' text-center timeInput rounded border-0' maxlength="2" placeholder='00' id='settelmentTime2' name='settelmentTime' />
                                            <p className='mb-0 pb-0 timeP mx-2 text-secondary'>زمان پرداخت</p>

                                        </div>

                                        <div className='col-12 col-md-6 col-lg-4 d-flex mb-0 mb-md-1'>
                                            <div className="d-flex align-items-center bg-white rounded height-fit-content px-0">
                                                <span className="text-center bg-header-table text-dark rounded px-2 py-1 font-size-small" id="basic-addon1"> شماره حساب نیازمند </span>
                                                <select className="bg-white outline-none border-0 rounded flex-grow-1 font-size-small" aria-label="Default select example" id="needyAccountNumber" name="needyAccountNumber" defaulValue={'needyAccounts[0]?.accountNumber'} onChange={(e) => setNeedyAccountNumber(e.target.value)}>
                                                    {needyAccounts.length > 0 ?
                                                        needyAccounts.map(b =>
                                                            <option value={b?.accountNumber}>{`${b?.accountNumber} _ ${b?.accountName}`}</option>
                                                        )
                                                        : null}
                                                </select>
                                            </div>
                                        </div>

                                        <div className='col-12 col-md-6 col-lg-4 d-flex my-2 my-md-0'>
                                            <input type="text" className='px-2 rounded border-0' placeholder='شماره فیش واریزی' id='followCode' name='followCode' />
                                        </div>

                                        <div className='col-12 col-md-6 col-lg-4 d-flex my-2 my-md-0'>
                                            <input type="text" className='px-2 rounded border-0' placeholder='مبلغ تسویه' id='settelmentPrice' name='settelmentPrice' />
                                            <p className='my-0 mr-2 text-secondary'>ريال</p>
                                        </div>

                                    </div>
                                </div>
                                <div className='dropdown-divider col-12 mt-3' />

                                <div className="d-flex">
                                    <button className="btn btn-outline-dark text-center my-5 px-5" onClick={handleCreatesettelmentPrice}>
                                        تسویه
                                    </button>

                                    <button className="btn btn-outline-dark text-center my-5 mr-2 px-5" onClick={() => setSettelmentState('get')}>
                                        بازگشت
                                    </button>

                                </div>

                            </div>


                        </>}

                </>

            }

        </div>
    );
}

export default Settelment;