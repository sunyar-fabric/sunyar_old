import axios from 'axios';
import { toastError } from '../util/ToastUtil';

const logOut = () => {
    localStorage.clear()
    window.location.href = '/signup/login/register';
};

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.response.use(null, async (error) => {

    const token = localStorage.getItem('token');
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        if (token) {
            originalRequest._retry = true;
            try {
                const { status, headers } = await axios.post('/api/cms/um/user/login', { username: localStorage.getItem('username'), refreshToken: localStorage.getItem("refreshtoken") })
                if (status == 200) {
                    localStorage.setItem('token', headers['x-auth-token']);
                    localStorage.setItem('refreshtoken', headers["x-auth-refresh-token"]);
                    return axiosApiInstance(originalRequest);
                }
            } catch (error) {
                logOut()
            }
        }

        else {
            if (error.response.config.url !== '/signup/register') {
                logOut()
                return
            }
        }
    }


    // if (error.response.status === 403 && error.response.config.url !== '/api/cms/um/user/login') {
    //     toastError(error.response.data.message);
    //     logOut()
    //     return
    // }
    if (error.response.status === 403) {
        toastError(error.response.data.message);
        return
    }

    toastError(error.response.data.message);
    // return axiosApiInstance(originalRequest);

});


axiosApiInstance.interceptors.request.use(async (req) => {

    if (req.url !== '/api/cms/um/user/login' && req.url !== '/api/cms/um/personal/personalAccount') { //&& req.url.includes('/api/sunyar/plan/needyToPlan?planId=')  && req.url !== '/api/sunyar/plan/plan/planTree' && req.url.includes('/api/sunyar/plan/plan?planId=')
        const token = localStorage.getItem('token');
        req.headers["x-auth-token"] = 'Bearer' + token;
    }
    return req;

}, function (err) { return Promise.reject(err) });


export default {
    get: axiosApiInstance.get,
    post: axiosApiInstance.post,
    put: axiosApiInstance.put,
    delete: axiosApiInstance.delete,
    patch: axiosApiInstance.patch,
    head: axiosApiInstance.head,
};