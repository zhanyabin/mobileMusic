import axios, { AxiosInstance } from 'axios'
import {  MessagePlugin } from 'tdesign-react';

const service: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

service.interceptors.request.use(
    config => {
        // 后端规定每次post请求需要增加时间戳，否则接口会被缓存
        if (config.method === 'post') {
            config.data = {
                ...config.data,
                _timestamp: new Date().getTime()
            }
        }

        // if (store.getters.token) {
        //     config.headers['Token'] = ''
        // }
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200 && res.code) {
            MessagePlugin.error(res.codeMessage || 'Error', 3000).then()
            return Promise.reject(new Error(res.codeMessage || 'Error'))
        } else {
            return res
        }
    },
    error => {
        MessagePlugin.error(error.message || 'Error', 3000).then()
        return Promise.reject(error.message || error)
    }
)

export default service
