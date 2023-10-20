import React, { memo, useState } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { ISong, ILyric } from './songType'
import { getMusicLyric } from 'api/Player'
import SongImg from '../SongImg'
import ColorThief from 'colorthief'

interface Interface {
    songInfo: ISong
    isPlay: boolean
}

const isColorDark = (color: string): boolean => {
    // 移除颜色字符串中的空格
    const strippedColor = color.replace(/\s/g, '')
    // 从颜色字符串中提取RGB值
    const match = strippedColor.match(/^rgb\((\d+),(\d+),(\d+)\)$/)
    if (!match) {
        // 无法提取RGB值，无法判断亮度
        return false
    }
    // 解构提取的RGB值
    const [, red, green, blue] = match
    // 计算亮度值
    const brightness = (parseInt(red) * 299 + parseInt(green) * 587 + parseInt(blue) * 114) / 1000
    // 判断亮度值，小于等于128认为是偏黑，大于128认为是偏白
    return brightness <= 128
}

const SongLyrics = (props: Interface) => {
    const { songInfo, isPlay } = props
    const [bgColor, setBgColor] = useState('')

    const getMusicLry = async (id: number) => {
        const data: ILyric = await getMusicLyric(id)
    }

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

    useUpdateEffect(() => {
        getMusicLry(songInfo.id)
        getImageData()
    }, [songInfo?.id])

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
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                    <p>111</p>
                </div>
                <div className={Style.mask}></div>
            </div>
        </>
    )
}

export default memo(SongLyrics)
