import React, { memo } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { ISong, ILyric } from './songType'
import { getMusicLyric } from 'api/Player'
import { Image } from 'tdesign-react'
import SongImg from '../SongImg'

interface Interface {
    songInfo: ISong
    isPlay: boolean
}

const SongLyrics = (props: Interface) => {
    const { songInfo, isPlay } = props

    const getMusicLry = async (id: number) => {
        const data: ILyric = await getMusicLyric(id)
        console.log('data', data.lrc)
    }

    useUpdateEffect(() => {
        getMusicLry(songInfo.id)
    }, [songInfo?.id])

    return (
        <>
            <div className={Style.songBox}>
                <div className={Style.SongInfo}>
                    <h3>{songInfo?.name}</h3>
                    <span>{songInfo?.ar.map((item) => item.name).join('/')}</span>
                </div>
                <div className={Style.imgBox}>
                    <SongImg src={songInfo?.al.picUrl} isPlay={isPlay} />
                </div>
            </div>
        </>
    )
}

export default memo(SongLyrics)
