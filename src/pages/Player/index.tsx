import React, { memo, useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'
import { List, Drawer, Button } from 'tdesign-react'
import { IconFont } from 'tdesign-icons-react'
import wave from 'assets/images/wave.gif'
import { useUpdateEffect } from 'ahooks'
import { getPlayListAll } from 'api/Home'
import { getSongDetail, getSongUrl } from 'api/Player'
import { useAppSelector } from 'modules/store'
import { selectGlobal } from 'modules/global'
import Style from './index.module.less'
import Slider from 'components/Slider'

const Player = () => {
    const globalState = useAppSelector(selectGlobal)
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
    // 查看光暗模式切换
    const [themeMode, setThemeMode] = useState(globalState.theme)

    const styleGif: any = {
        transform: 'rotate(180deg)',
        background: 'black',
    }

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
            if (activeIndex === -1) {
                setActiveIndex(0)
            }
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
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(remainingSeconds).padStart(2, '0')
        return `${formattedMinutes}:${formattedSeconds}`
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
        playSong()
        setPlayStatus(true)
    }

    const playSong = () => {
        audioRef.current
            .play()
            .then((r) => {})
            .catch((e) => {})
    }

    const pauseSong = () => {
        audioRef.current.pause()
    }

    // 播放下一首
    const nextSong = () => {
        let index = activeIndex + 1
        if (index > listData.length) {
            index = 0
        }
        setActiveIndex(index)
    }

    // 播放上一首
    const previousSong = () => {
        let index = activeIndex - 1
        if (index < 0) {
            index = listData.length - 1
        }
        setActiveIndex(index)
    }

    // 用于分页
    useUpdateEffect(() => {
        getSongList()
    }, [search])

    // 当前选中歌曲变更时加载歌曲
    useUpdateEffect(() => {
        loadSong()
    }, [activeIndex])

    // 监听播放状态
    useUpdateEffect(() => {
        playStatus ? playSong() : pauseSong()
    }, [playStatus])

    // 监听播放状态
    useUpdateEffect(() => {
        setThemeMode(globalState.theme)
    }, [globalState.theme])

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
            <div className={`${Style.footer}`}>
                <div>
                    <Slider />
                </div>
                <div className={'flexSa'}>
                    <IconFont name='textformat-wrap' size='30px'></IconFont>
                    <div>
                        <IconFont name='previous' size='40px' onClick={previousSong}></IconFont>
                        <IconFont
                            onClick={() => {
                                setPlayStatus(!playStatus)
                            }}
                            name={playStatus ? 'pause-circle' : 'play-circle'}
                            size='60px'
                            style={{ margin: '0 15px' }}></IconFont>
                        <IconFont name='next' size='40px' onClick={nextSong}></IconFont>
                    </div>
                    <IconFont
                        name='form'
                        size='30px'
                        onClick={() => {
                            setVisible(true)
                        }}></IconFont>
                </div>
            </div>
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
                        <li
                            key={item.id}
                            className={`${Style.listItem} flexSb`}
                            onClick={() => {
                                setActiveIndex(index)
                            }}>
                            {/*<div className={Style.index}>{index + 1}</div>*/}
                            <div className={Style.index}>
                                {activeIndex === index && playStatus ? (
                                    <img
                                        src={wave}
                                        style={themeMode === 'light' ? styleGif : {}}
                                        alt=''
                                    />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div className={Style.right}>
                                <div className='flexSb'>
                                    <div className={Style.title}>{item.name}</div>
                                    <div className={Style.time}>{formatTime(item.dt / 1000)}</div>
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
