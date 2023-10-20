import axios, { AxiosInstance } from 'axios'
import {  MessagePlugin } from 'tdesign-react';

const randomIp = () => Array(4).fill(0).map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)).join('.');


const service: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

service.interceptors.request.use(
    config => {
        // 后端规定每次post请求需要增加时间戳，否则接口会被缓存
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                realIP: randomIp()
            }
        } else if (config.method === 'post') {
            config.data = {
                ...config.data,
                realIP: randomIp(),
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
            MessagePlugin.error(res.message || res.codeMessage || 'Error', 3000).then()
            return Promise.reject(new Error(res.message || res.codeMessage  || 'Error'))
        } else {
            return res
        }
    },
    error => {
        MessagePlugin.error(error.response.data.message ||  error.message || 'Error', 3000).then()
        return Promise.reject(error.response.data.message || error.message || error)
    }
)

export default service
