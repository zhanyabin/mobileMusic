import React, { memo } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { ISong, ILyric } from './songType'
import { getMusicLyric } from 'api/Player'

interface Interface {
    songInfo: ISong
}

const SongLyrics = (props: Interface) => {
    const { songInfo } = props

    const getMusicLry = async (id: number) => {
        const data: ILyric = await getMusicLyric(id)
        console.log('data', data.lrc)
    }
    useUpdateEffect(() => {
        getMusicLry(songInfo.id)
    }, [songInfo?.id])

    return (
        <>
            <div className={Style.songBox}>{songInfo?.name}</div>
        </>
    )
}

export default memo(SongLyrics)
