import React, { memo, useState, useRef } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { ILyric, ISong } from './songType'
import { getMusicLyric } from 'api/Player'
import SongImg from '../SongImg'
import ColorThief from 'colorthief'

interface Interface {
    songInfo: ISong
    isPlay: boolean
    currentTime: string
}

interface lyricInterface {
    id: string
    time: number
    value: string
}

const formatTime = (time: string) => {
    if (!time.includes(':')) Error('格式错误，时间格式需要为 mm:ss')
    let [time1, time2] = time.split(':')
    return Number(time1) * 60 + Number(time2)
}

const defaultHeight = 80

const SongLyrics = (props: Interface) => {
    const { songInfo, isPlay, currentTime } = props
    const [lyricData, setLyricData] = useState<[lyricInterface] | any>([])
    const [bgColor, setBgColor] = useState('')
    const [activeLyricId, setActiveLyricId] = useState('')
    const [translateHeight, setTranslateHeight] = useState(defaultHeight)

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
            if (time1 > 0 && value) {
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
        imageElement.src = songInfo?.al.picUrl

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
        let translate = 0
        // 处理一下拖动进度条时需要快速定位的问题
        if (time < 3) {
            setTranslateHeight(defaultHeight)
        }
        lyricData.forEach((item: lyricInterface, index: number) => {
            if (time > Math.trunc(item.time)) {
                setActiveLyricId(item.id)
                let lyricDom = document.querySelectorAll('.lyricItem')
                let height = window.getComputedStyle(lyricDom[index], null).height
                let h: number = Number(height.slice(0, -2))

                if (index > 3) {
                    translate += h
                    setTranslateHeight(-translate)
                } else {
                    setTranslateHeight(defaultHeight)
                }
            }
        })
    }

    useUpdateEffect(() => {
        setTranslateHeight(defaultHeight)
        getMusicLry(songInfo.id)
        getImageData()
    }, [songInfo?.id])

    useUpdateEffect(() => {
        const time = formatTime(currentTime)
        getActiveLyricId(time)
    }, [currentTime])

    return (
        <>
            <div className={Style.songBox} style={{ background: bgColor }}>
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
