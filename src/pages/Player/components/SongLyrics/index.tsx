import React, { memo, useState } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { ILyric, ISong } from './songType'
import { getMusicLyric } from 'api/Player'
import SongImg from '../SongImg'
import ColorThief from 'colorthief'
import _ from 'lodash'
import { BackgroundRender } from '@applemusic-like-lyrics/react'
import { SonicIcon } from 'tdesign-icons-react'
import { MessagePlugin } from 'tdesign-react'

interface Interface {
    songInfo: ISong
    isPlay: boolean
    currentTime: number
}

interface lyricInterface {
    id: string
    time: number
    value: string
}

const defaultHeight = 110

const SongLyrics = (props: Interface) => {
    const { songInfo, isPlay, currentTime } = props
    const [lyricData, setLyricData] = useState<[lyricInterface] | any>([])
    const [bgColor, setBgColor] = useState('')
    const [activeLyricId, setActiveLyricId] = useState('')
    const [translateHeight, setTranslateHeight] = useState(defaultHeight)
    const [isMove, setIsMove] = useState(true)

    const getMusicLry = async (id: number) => {
        const data: ILyric = await getMusicLyric(id)
        const lyricArr = data.lrc.lyric.split('\n')
        // 开始处理歌词 把时间戳转换成秒
        let arr: any = []
        lyricArr.forEach((item, index) => {
            let time = item.slice(1).split(']')[0]
            let minTime = Number(time.split(':')[0]) * 60
            let secTime = Number(time.split(':')[1])
            let time1 = minTime + secTime
            let value = item.slice(1).split(']')[1]
            value = _.trim(value)
            if (time1 > 0 && value !== '') {
                let o = {
                    id: `lyric${index}`,
                    time: time1,
                    value,
                }
                arr.push(o)
            }
        })
        // 跟据歌词排序
        arr.sort((a: lyricInterface, b: lyricInterface) => a.time - b.time)
        setLyricData(arr)
    }

    // 获取图片数据，生成渐变色
    const getImageData = async () => {
        const colorThief = new ColorThief()
        const imageElement = document.createElement('img')
        imageElement.crossOrigin = 'Anonymous'
        imageElement.src = songInfo?.al.picUrl + '?param=100y100'

        imageElement.onload = () => {
            // 获取颜色调色板，包含2个颜色
            const colorPalette = colorThief.getPalette(imageElement, 2)
            const [color1, color2] = colorPalette
            const mainColor = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`
            const secondaryColor = `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`
            const color = `linear-gradient(${mainColor}, ${secondaryColor})`
            setBgColor(color)
        }
    }

    const lyricDom = lyricData.map((item: lyricInterface) => (
        <p
            key={item.id}
            className={activeLyricId === item.id ? `${Style.on} lyricItem` : 'lyricItem'}>
            {item.value}
        </p>
    ))

    // 根据当前播放时间和歌词数据里面的time时间做匹配
    const getActiveLyricId = (time: number) => {
        let translate = defaultHeight
        // 处理一下拖动进度条时需要快速定位的问题
        if (time < 3) {
            setTranslateHeight(defaultHeight)
        }
        // 判断一下如果播放时间小于第一句歌词的时间戳时，清空高亮id
        if (time < lyricData[0].time) {
            setActiveLyricId('')
        }
        lyricData.forEach((item: lyricInterface, index: number) => {
            if (time > item.time) {
                setActiveLyricId(item.id)
                let lyricDom = document.querySelectorAll('.lyricItem')
                let h = 0
                for (let i = 0; i < index; i++) {
                    // 获取到当前播放位置之前所有的高度相加，然后加上下边距就是需要偏移的距离
                    const height = window.getComputedStyle(lyricDom[i], null).height
                    const marginBottom = window.getComputedStyle(lyricDom[i], null).marginBottom
                    const he = Number(height.slice(0, -2))
                    const m = Number(marginBottom.slice(0, -2))
                    const totalHeight = he + m
                    h += totalHeight
                }
                translate = h - defaultHeight
                setTranslateHeight(-translate)
            }
        })
    }

    useUpdateEffect(() => {
        setTranslateHeight(defaultHeight)
        getMusicLry(songInfo.id)
        getImageData()
    }, [songInfo?.id])

    useUpdateEffect(() => {
        getActiveLyricId(currentTime)
    }, [currentTime])

    return (
        <>
            <div className={Style.songBox} style={{ background: bgColor }}>
                <BackgroundRender
                    style={{ display: isMove ? '' : 'none' }}
                    className={Style.backgroundRender}
                    flowSpeed={5}
                    renderScale={4}
                    albumImageUrl={songInfo?.al.picUrl}
                />
                <div
                    className={Style.iconFont}
                    onClick={() => {
                        setIsMove(!isMove)
                        MessagePlugin.info({
                            content: `${isMove ? '关闭' : '开启'}流体背景`,
                            placement: 'center',
                            icon: false,
                            duration: 500,
                        })
                    }}>
                    <SonicIcon size={'30px'} />
                </div>
                <div className={Style.SongInfo}>
                    <div className={Style.title}>{songInfo?.name}</div>
                    <span>{songInfo?.ar.map((item) => item.name).join('/')}</span>
                </div>
                <div className={Style.imgBox}>
                    <SongImg src={songInfo?.al.picUrl + '?param=100y100'} isPlay={isPlay} />
                </div>
                <div className={Style.lyricsBox}>
                    <div
                        className={Style.songLyricBoxInner}
                        style={{ transform: `translateY(${translateHeight}px)` }}>
                        {lyricDom}
                    </div>
                </div>
                <div className={Style.mask}></div>
            </div>
        </>
    )
}

export default memo(SongLyrics)
