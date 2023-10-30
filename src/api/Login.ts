import request from 'utils/request'

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
