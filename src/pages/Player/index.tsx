import React, { memo, useEffect, useState, useRef } from 'react'
import Style from './index.module.less'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'ahooks'
import { getPlayListAll } from 'api/Home'
import { getSongDetail, getSongUrl } from 'api/Player'
import { List, Drawer, Button } from 'tdesign-react'
import wave from 'assets/images/wave.gif'
import _ from 'lodash'

const Player = () => {
    const navigate = useNavigate()
    const location: any = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState({
        id: location.state?.id,
        offset: 0,
        limit: 50,
    })
    const [listData, setListData] = useState<any>([])
    const [visible, setVisible] = useState(false)
    // 当前播放音乐的下标
    const [activeIndex, setActiveIndex] = useState(-1)
    // 获取音乐控件
    const audioRef = useRef(new Audio(''))
    // 控制播放状态
    const [playStatus, setPlayStatus] = useState(false)

    // 获取歌单列表
    const getSongList = () => {
        setIsLoading(true)
        getPlayListAll(search).then((res) => {
            res.songs.forEach((item: any) => {
                let arr: any[] = []
                item.ar.forEach((ar: any) => {
                    arr.push(ar.name)
                })
                item.singer = arr.join('/')
            })
            const arr = _.uniqBy(listData.concat(res.songs), 'id')
            setListData(arr)
            setActiveIndex(0)
            setIsLoading(false)
        })
    }

    // 分页
    const handleScroll = ({ scrollBottom }: { scrollBottom: number }) => {
        let total = location.state?.trackCount
        if (!scrollBottom && search.offset < total) {
            setSearch({ ...search, offset: search.offset + search.limit })
        }
    }

    // 处理时间
    const getType = (time: number | string) => {
        return time < 10 ? '0' + time : String(time)
    }
    const formatTime = (time: number) => {
        let min = Math.floor(time / 1000 / 60)
        let sec = ((time / 1000) % 60).toFixed(0)
        return `${getType(min)}:${getType(sec)}`
    }

    // 获取歌曲详情
    const getSongDetailEvent = (ids: string | number) => {
        getSongDetail(ids).then((res) => {
            res.songs.forEach((item: any) => {
                let arr: any[] = []
                item.ar.forEach((ar: any) => {
                    arr.push(ar.name)
                })
                item.singer = arr.join('/')
            })
            const arr = _.uniqBy(listData.concat(res.songs), 'id')
            setListData(arr)
            setActiveIndex(0)
        })
    }

    // 加载歌曲
    const loadSong = async () => {
        const id = listData[activeIndex].id
        const songData = await getSongUrl(id)
        audioRef.current.src = songData.data[0]?.url
        setPlayStatus(true)
    }

    // 用于分页
    useUpdateEffect(() => {
        getSongList()
    }, [search])

    // 歌曲列表更新
    useUpdateEffect(() => {
        loadSong()
    }, [activeIndex])

    // 监听播放状态
    useUpdateEffect(() => {
        audioRef.current
            .play()
            .then((r) => {})
            .catch((err) => {
                alert('请手动点击播放')
                console.log('err', err)
            })
    }, [playStatus])

    useEffect(() => {
        // 需要判断是否是歌单进入还是单首歌曲进入
        let { isSongs, id } = location.state
        if (isSongs) {
            getSongList()
        } else {
            getSongDetailEvent(id)
        }
        return () => {
            audioRef.current.pause()
            audioRef.current.src = ''
        }
    }, [])
    return (
        <div>
            <Button
                onClick={() => {
                    setVisible(true)
                }}>
                打开
            </Button>
            <Drawer
                className={Style.playerDrawer}
                header='歌曲列表'
                placement='bottom'
                visible={visible}
                size={'70%'}
                footer={false}
                onClose={() => {
                    setVisible(false)
                }}>
                <List
                    asyncLoading={isLoading ? 'loading' : ''}
                    size='small'
                    split
                    className={Style.list}
                    onScroll={handleScroll}>
                    {listData.map((item: any, index: number) => (
                        <li key={item.id} className={`${Style.listItem} flexSb`}>
                            {/*<div className={Style.index}>{index + 1}</div>*/}
                            <div className={Style.index}>
                                {activeIndex === index && playStatus ? (
                                    <img src={wave} alt='' />
                                ) : index + 1}
                            </div>
                            <div className={Style.right}>
                                <div className='flexSb'>
                                    <div className={Style.title}>{item.name}</div>
                                    <div className={Style.time}>{formatTime(item.dt)}</div>
                                </div>
                                <div className={Style.singer}>{item.singer}</div>
                            </div>
                        </li>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}

export default memo(Player)
