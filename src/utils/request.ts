import axios, { AxiosInstance } from 'axios'
import {  MessagePlugin } from 'tdesign-react';


const service: AxiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
    timeout: 5000,
})

service.interceptors.request.use(
    config => {
        // config.headers['Token'] = ''

        // 每次post请求需要增加时间戳，否则接口会被缓存
        if (config.method === 'get') {
            config.params = {
                // realIP: '183.197.189.111',
                ...config.params,
            }
        } else if (config.method === 'post') {
            config.data = {
                ...config.data,
                // realIP: '183.197.189.111',
                timestamp: new Date().getTime()
            }
        }
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
        // 接口请求成功200
        //  轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),
        const codes = [200, 800, 801, 802,  803]
        if (!codes.includes(res.code) && res.code) {
            if (res.code === -462) {
                MessagePlugin.error('暂时无法获取音乐播放源', 3000).then()
            }  else {
                MessagePlugin.error(res.message || res.codeMessage || 'Error', 3000).then()
            }
        }
        return res
    },
    error => {
        MessagePlugin.error(error.response.data.message ||  error.message || 'Error', 3000).then()
        return error.response.data
    }
)

export default service
