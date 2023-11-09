import React, { memo, useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { useLocation } from 'react-router-dom'
import { List, Drawer, MessagePlugin } from 'tdesign-react'
import wave from 'assets/images/wave.gif'
import { useUpdateEffect } from 'ahooks'
import { getPlayListAll } from 'api/Home'
import { getSongDetail, getSongUrl } from 'api/Player'
import { useAppSelector } from 'modules/store'
import { selectGlobal } from 'modules/global'
import Style from './index.module.less'
import Slider from 'components/Slider'
import SongLyrics from './components/SongLyrics'
import SVG from 'react-inlinesvg'
import listLoopIcon from 'assets/images/songtab_playmode_listloop.svg'
import shuffleIcon from 'assets/images/songtab_desktop_playmode_shuffle.svg'
import singlecycleIcon from 'assets/images/songtab_playmode_singlecycle.svg'
import { ISong } from './components/SongLyrics/songType'
import {
    PreviousIcon,
    PauseCircleIcon,
    PlayCircleIcon,
    NextIcon,
    FormIcon,
} from 'tdesign-icons-react'

const playModeData: any = [
    {
        src: listLoopIcon,
        title: '列表播放',
        type: 'list',
    },
    {
        src: singlecycleIcon,
        title: '单曲循环',
        type: 'repeat',
    },
    {
        src: shuffleIcon,
        title: '随机播放',
        type: 'random',
    },
]

const Player = () => {
    const globalState = useAppSelector(selectGlobal)
    // const navigate = useNavigate()
    const location: any = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState({
        id: location.state?.id,
        offset: 0,
        limit: 50,
    })
    const [listData, setListData] = useState<ISong[]>([])
    const [visible, setVisible] = useState(false)
    // 当前播放音乐的下标
    const [activeIndex, setActiveIndex] = useState(-1)
    // 获取音乐控件
    const audioRef = useRef<HTMLAudioElement>(new Audio(''))
    // 控制播放状态
    const [playStatus, setPlayStatus] = useState(false)
    // 查看光暗模式切换
    const [themeMode, setThemeMode] = useState(globalState.theme)
    // 获取当前播放时间
    const [currentTime, setCurrentTime] = useState('00:00')
    const [currentTimeNumber, setCurrentTimeNumber] = useState(0)

    // 定时器
    const intervalRef = useRef<any>(null)
    // 进度条
    const [progress, setProgress] = useState(0)
    const playModeRef = useRef('list')
    const [modeDataIndex, setModeDataIndex] = useState(0)

    const styleGif: any = {
        transform: 'rotate(180deg)',
        background: 'black',
    }

    const setData = (arr: any) => {
        arr.forEach((item: any) => {
            let arr: any[] = []
            item.ar.forEach((ar: any) => {
                arr.push(ar.name)
            })
            item.singer = arr.join('/')
        })
        const a = _.uniqBy(listData.concat(arr), 'id')
        setListData(a)
        if (activeIndex === -1) {
            setActiveIndex(0)
        }
    }

    // 获取歌单列表 判断是否是携带歌曲列表进入播放器页面
    const getSongList = (list = []) => {
        if (list.length > 0) {
            setData(list)
            return
        }
        setIsLoading(true)
        getPlayListAll(search).then((res) => {
            setData(res.songs)
            setIsLoading(false)
        })
    }

    // 分页
    const handleScroll = ({ scrollBottom }: { scrollBottom: number }) => {
        let total = location.state?.trackCount
        console.log('total', total, 'search.offset', search.offset)
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

    // 获取首次进入时的歌曲详情
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
        if (!songData.data[0]?.url) {
            alert('无法获取到播放源自动切换到下一首')
            nextSong()
            return
        }
        listData[activeIndex].dt = songData.data[0]?.time
        setListData(listData)
        audioRef.current.src = songData.data[0]?.url
        // setPlayStatus(true)
        playSong()
    }

    const playSong = () => {
        audioRef.current.play()
    }

    const pauseSong = () => {
        audioRef.current.pause()
    }

    const changeSong = (index: number) => {
        audioRef.current.currentTime = 0
        setProgress(0)
        setActiveIndex(index)
        // setPlayStatus(true)
        setCurrentTime('00:00')

        if (listData.length === 1) {
            playSong()
        }
    }

    // 播放下一首
    const nextSong = () => {
        let index = activeIndex + 1
        if (index > listData.length - 1) {
            index = 0
        }
        changeSong(index)
    }

    // 播放上一首
    const previousSong = () => {
        let index = activeIndex - 1
        if (index < 0) {
            index = listData.length - 1
        }
        changeSong(index)
    }

    const timeUpdateEvent = () => {
        const audioElement = audioRef.current
        setCurrentTime(formatTime(audioElement.currentTime))
        setCurrentTimeNumber(audioElement.currentTime)
        const percentage = (audioElement.currentTime / audioElement.duration) * 100
        setProgress(percentage)
    }

    // 根据歌曲列表长度获取对应随机数下标
    const generateRandomIndex = (): number => {
        // 只有一首歌的话
        if (listData.length === 1) {
            audioRef.current.currentTime = 0 // 重置音频播放时间
            audioRef.current.play()
            return 0
        }
        const newIndex = Math.floor(Math.random() * listData.length)
        if (newIndex === activeIndex) {
            return generateRandomIndex() // 递归调用，直到生成一个不同的随机下标
        }
        return newIndex
    }

    // 结束播放
    const endPlayback = () => {
        if (playModeRef.current === 'list') {
            // 顺序播放模式
            nextSong()
        } else if (playModeRef.current === 'repeat') {
            // 单曲循环播放模式
            audioRef.current.currentTime = 0 // 重置音频播放时间
            audioRef.current.play()
        } else if (playModeRef.current === 'random') {
            // 随机播放模式
            const randomIndex = generateRandomIndex()
            setActiveIndex(randomIndex)
        }
    }

    // 进度条点击事件
    const musicTimeChange = (progressRatio: number) => {
        const audioElement = audioRef.current
        audioElement.currentTime = (progressRatio / 100) * audioElement.duration
        setCurrentTime(formatTime(audioElement.currentTime))
    }

    // 切换播放模式
    const changeMode = () => {
        let index = modeDataIndex + 1
        if (index < playModeData.length) {
            setModeDataIndex(index)
        } else {
            setModeDataIndex(0)
        }
    }

    const handlePauseChange = () => {
        const audioElement = audioRef.current
        // 因为 playStatus 判断的是播放状态。 true 为播放 false为暂停
        // audioElement.paused 判断的是暂停状态。 true 为暂停， false 为播放，所以需要取反
        setPlayStatus(!audioElement.paused)
    }

    const handlePlay = () => {
        setPlayStatus(true)
    }

    // 用于分页
    useUpdateEffect(() => {
        getSongList()
    }, [search])

    // 当前选中歌曲变更时加载歌曲
    useUpdateEffect(() => {
        loadSong()
        const audioElement = audioRef.current
        audioElement.addEventListener('ended', endPlayback)
        return () => {
            audioElement.removeEventListener('ended', endPlayback)
        }
    }, [activeIndex])

    // 监听播放状态
    useUpdateEffect(() => {
        playStatus ? playSong() : pauseSong()
    }, [playStatus])

    // 监听播放状态
    useUpdateEffect(() => {
        setThemeMode(globalState.theme)
    }, [globalState.theme])

    // 监听播放模式切换
    useUpdateEffect(() => {
        playModeRef.current = playModeData[modeDataIndex].type

        MessagePlugin.info({
            content: playModeData[modeDataIndex].title,
            placement: 'center',
            icon: false,
            duration: 500,
        })
    }, [modeDataIndex])

    useEffect(() => {
        let { isSongs, id, songList } = location.state
        // 需要判断是否是歌单进入还是单首歌曲进入
        if (isSongs) {
            getSongList(songList)
        } else {
            getSongDetailEvent(id)
        }
        const audioElement = audioRef.current
        audioElement.addEventListener('timeupdate', timeUpdateEvent)
        audioElement.addEventListener('play', handlePlay)
        audioElement.addEventListener('pause', handlePauseChange)
        return () => {
            audioRef.current.pause()
            audioRef.current.src = ''
            audioElement.removeEventListener('timeupdate', timeUpdateEvent)
            audioElement.removeEventListener('play', handlePlay)
            audioElement.removeEventListener('pause', handlePauseChange)
            clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <>
            <SongLyrics
                songInfo={listData[activeIndex]}
                isPlay={playStatus}
                currentTime={currentTimeNumber}
            />
            <div className={`${Style.footer}`}>
                <div className={`flexSb ${Style.slider}`}>
                    <div>{currentTime}</div>
                    <Slider
                        style={{ margin: '0 20px' }}
                        value={progress}
                        handleClick={musicTimeChange}
                        changEnd={musicTimeChange}
                    />
                    <div>
                        {listData[activeIndex]?.dt
                            ? formatTime(listData[activeIndex]?.dt / 1000)
                            : '00:00'}
                    </div>
                </div>
                <div className={'flexSa'}>
                    <div className={Style.svg}>
                        <SVG
                            className={Style.svg}
                            src={playModeData[modeDataIndex].src}
                            title={playModeData[modeDataIndex].title}
                            width={30}
                            onClick={changeMode}
                        />
                    </div>
                    <div>
                        <PreviousIcon
                            className={Style.iconFont}
                            name='previous'
                            size='40px'
                            onClick={previousSong}
                        />
                        {playStatus ? (
                            <PauseCircleIcon
                                className={Style.iconFont}
                                onClick={() => {
                                    setPlayStatus(!playStatus)
                                }}
                                name={playStatus ? 'pause-circle' : 'play-circle'}
                                size='60px'
                                style={{ margin: '0 15px' }}
                            />
                        ) : (
                            <PlayCircleIcon
                                className={Style.iconFont}
                                onClick={() => {
                                    setPlayStatus(!playStatus)
                                }}
                                name={playStatus ? 'pause-circle' : 'play-circle'}
                                size='60px'
                                style={{ margin: '0 15px' }}
                            />
                        )}
                        <NextIcon
                            className={Style.iconFont}
                            name='next'
                            size='40px'
                            onClick={nextSong}
                        />
                    </div>
                    <FormIcon
                        className={Style.iconFont}
                        name='form'
                        size='30px'
                        onClick={() => {
                            setVisible(true)
                        }}
                    />
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
                    onScroll={location.state?.songList?.length > 0 ? () => {} : handleScroll}>
                    {listData.map((item: any, index: number) => (
                        <li
                            key={item.id}
                            className={`${Style.listItem} flexSb`}
                            onClick={() => {
                                changeSong(index)
                            }}>
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
        </>
    )
}

export default memo(Player)
