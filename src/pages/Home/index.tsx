import React, { memo, useEffect, useState } from 'react'
import Style from './index.module.less'
import { Button, Tabs } from 'tdesign-react'
import Recommend from './componets/Recommend'
import Ranking from './componets/Ranking'
import { useUpdateEffect } from 'ahooks'
import * as API from 'api/Home'

const Home = () => {
    const [tabsValue, setTabsValue] = useState<string | number>(1)
    // 推荐歌单
    const [recommendList, setRecommendList] = useState([])
    // 推荐新歌
    const [newSongList, setNewSongList] = useState([])
    // 排行热歌
    const [rankingData, setRankingData] = useState({})

    const tabList = [
        {
            label: '推荐',
            value: 1,
            panel: <Recommend list={recommendList} newSongList={newSongList} />,
        },
        {
            label: '排行',
            value: 2,
            panel: <Ranking data={rankingData} />,
        },
    ]

    // 获取播放歌单
    const playlist = (order: 'new' | 'hot') => {
        API.playlist({
            order,
            limit: 6,
        }).then((res) => {
            setRecommendList(res.playlists)
        })
    }

    // 获取最新歌曲
    const getNewSong = () => {
        API.newsong({
            limit: 10,
        }).then((res) => {
            res.result.forEach((item: { song: { artists: any[] }; artistText: string }) => {
                let arr: any = []
                item.song.artists.forEach((artist) => {
                    arr.push(artist.name)
                })
                item.artistText = arr.join('/')
            })
            setNewSongList(res.result)
        })
    }

    // 获取排行榜
    const getHotSongList = () => {
        // 获取网易云热门歌曲
        API.getHotSongList('3778678').then((res) => {
            let playlists = res.playlist
            // 需要处理歌手
            playlists.tracks.forEach((item: any) => {
                let arr: any = []
                item.ar.forEach((artist: any) => {
                    arr.push(artist.name)
                })
                item.artists = arr
                item.image = item.al.picUrl
            })
            setRankingData(playlists)
        })
    }

    useEffect(() => {
        playlist('hot')
        getNewSong()
    }, [])

    // tab切换时重新请求数据
    useUpdateEffect(() => {
        if (tabsValue === 1) {
            // 获取推荐数据
            playlist('hot')
            getNewSong()
        } else if (tabsValue === 2) {
            // 获取排行数据
            getHotSongList()
        }
    }, [tabsValue])

    return (
        <>
            <Tabs className={Style.tabs} defaultValue={1} list={tabList} onChange={setTabsValue} />
        </>
    )
}

export default memo(Home)
