import request from 'utils/request'

// 获取音乐播放url
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

// 获取音乐详情
export function getSongDetail(ids: number | string) {
    return request({
        url: '/song/detail',
        method: 'get',
        params: {
            ids,
        },
    })
}

// 获取音乐歌词
export function getMusicLyric(id: number) {
    return request({
        url: '/lyric',
        method: 'get',
        params: {
            id
        }
    })
}
