import request from 'utils/request'

// 获取新音乐 默认10首, limit数量
export function newsong(params?: object) {
    return request({
        url: '/personalized/newsong',
        method: 'get',
        params,
    })
}

/**可选参数 :
 * @order 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @cat tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * @limit 取出歌单数量 , 默认为 50
 * @offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export function playlist(params: object) {
    return request({
        url: '/top/playlist/highquality',
        method: 'get',
        params,
    })
}

// 根据歌单ID获取音乐  热歌榜 3778678
export function getHotSongList(id: string) {
    return request({
        url: '/playlist/detail',
        method: 'get',
        params: {
            id,
        },
    })
}

/**获取歌单所有歌曲 参数 :
 * @ID 必选
 * @limit 取出歌单数量 , 默认为 50
 * @offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export function getPlayListAll(params: object) {
    return request({
        url: '/playlist/track/all',
        method: 'get',
        params,
    })
}
