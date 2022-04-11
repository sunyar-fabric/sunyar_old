
import axios from 'axios';
import { toastError } from '../util/ToastUtil';

const logOut = () => {

    localStorage.clear()
    window.location.href = '/login';

};

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.request.use(async (request) => {

         if (request.url !== '/api/cms/um/user/login' && request.url !== '/api/cms/um/personal/personalAccount') {
             const token = localStorage.getItem('token');
             if(token){
             request.headers["x-auth-token"] = 'Bearer' + token;}else{
                request.headers["x-auth-username"] = document.getElementById('uniqueUsername').value;
                request.headers["x-auth-nationalCode"] = document.getElementById('uniqueNationalCode').value;
             }
         }
         return request;
     });
    

axiosApiInstance.interceptors.response.use(null, async (error ) => {

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
            if (error.response.config.url !== '/register') {
                logOut()
                return
            }
        }
    }

    if (error.response.status === 403) {
        toastError(error.response.data.message);
        return
    }
    toastError(error.response.data.message);
});


 axios.interceptors.request.use(async (request) => {

     if (request.url !== '/api/cms/um/user/login' && request.url !== '/api/cms/um/personal/personalAccount') {
        const token = localStorage.getItem('token');
         request.headers["x-auth-token"] = 'Bearer' + token;
    }
     return request;
 });



export default {
    get: axiosApiInstance.get,
    post: axiosApiInstance.post,
    put: axiosApiInstance.put,
    delete: axiosApiInstance.delete,
    patch: axiosApiInstance.patch,
    head: axiosApiInstance.head,
};






// import axios from 'axios'; 
// import { useHistory } from 'react-router';
// import { toastError } from '../util/ToastUtil';

// axios.interceptors.response.use(null, async (error) => {

//     if (error.response.config.url !== '/api/user/login' && error.response.config.url !== '/api/user/info') {
//         toastError(error.response.data.message);
//         return Promise.reject(error)
//     } else {
//         return Promise.reject(error)
//     }
// });

// axios.interceptors.request.use(async (request) => {

//     if (request.url !== '/api/cms/um/user/login' && request.url !== '/api/cms/um/personal/personalAccount') {
//         const token = localStorage.getItem('token');
//         request.headers["x-auth-token"] = 'Bearer' + token;
//     }
//     return request;
// });



// export default {
//     get: axios.get,
//     post: axios.post,
//     put: axios.put,
//     delete: axios.delete,
//     patch: axios.patch,
//     head: axios.head,
// };
