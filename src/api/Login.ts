import request from 'utils/request'
import { getToken } from 'utils/auth'

// 登陆
export function login(data: { phone: string,  password: string}) {
    return request({
        url: '/login/cellphone',
        method: 'post',
        params: data,
    })
}

// 退出登陆
export function logout() {
    return request({
        url: '/logout',
        method: 'post',
        params: {
            timestamp: new Date().getTime()
        }
    })
}

// 登陆状态
export function loginStatus() {
    return request({
        url: '/login/status',
        method: 'post',
        params: {
            timestamp: new Date().getTime()
        }
    })
}

// 刷新登陆
export function loginRefresh() {
    return request({
        url: '/login/refresh',
        method: 'post',
        params: {
            timestamp: new Date().getTime()
        }
    })
}

// 获取用户详情
export function getUserDetail(uid: number) {
    return request({
        params: {
            // timestamp: new Date().getTime(),
            uid
        },
        url: '/user/detail',
        method: 'get'
    })
}

// 获取用户歌单
export function getUserPlayList(uid: number) {
    return request({
        params: {
            // timestamp: new Date().getTime(),
            uid
        },
        url: 'user/playlist',
        method: 'get'
    })
}


// 二维码登录-key生成接口
export function getQrKey() {
    return request({
        url: `/login/qr/key?timestamp=${new Date().getTime()}`,
        method: 'get',
    })
}

// 二维码登录-二维码生成接口
export function createQrUrl(key: string) {
    return request({
        params: {
            key,
            qrimg: true,
            timestamp: new Date().getTime()
        },
        url: '/login/qr/create',
        method: 'get'
    })
}

// 二维码登录-二维码检测扫码状态接口
export function checkQr(key: string) {
    const token = getToken()
    return request({
        params: {
            key,
            noCookie: !token,
            timestamp: new Date().getTime()
        },
        url: '/login/qr/check',
        method: 'get'
    })
}

// 游客登录
// 二维码登录-二维码检测扫码状态接口
export function anonimousLogin() {
    return request({
        params: {
            timestamp: new Date().getTime()
        },
        url: '/register/anonimous',
        method: 'get'
    })
}
