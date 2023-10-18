import React, { memo } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { getMusicLyric } from 'api/Player'
import { Image } from 'tdesign-react'
import defaultImg from 'assets/images/default.png'
import needleImg from 'assets/images/needle-ab.png'

interface Interface {
    src: string
    isPlay: boolean
}

const SongLyrics = (props: Interface) => {
    const { src, isPlay } = props

    const className = `${Style.op} ${isPlay ? Style.rotate : ''}`

    return (
        <div className={Style.imgBox}>
            <div className={Style.mask1}>
                <div className={Style.mask2}>
                    <Image
                        className={`${Style.img} ${
                            isPlay
                                ? Style.infiniteSpins
                                : `${Style.infiniteSpins} ${Style.infiniteSpinsPaused} `
                        }`}
                        src={src || defaultImg}
                        fit='cover'
                        shape='circle'></Image>
                </div>
            </div>
            <Image className={className} src={needleImg} />
        </div>
    )
}

export default memo(SongLyrics)
