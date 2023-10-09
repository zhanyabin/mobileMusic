import request from 'utils/request'

export function getSongUrl(id: number) {
    return request({
        url: '/song/url/v1',
        method: 'get',
        params: {
            id,
            level: 'lossless',
        },
    })
}

export function getSongDetail(ids: number | string) {
    return request({
        url: '/song/detail',
        method: 'get',
        params: {
            ids,
        },
    })
}
