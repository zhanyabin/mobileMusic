import React, { memo } from 'react'
import Style from './index.module.less'
import Title from 'components/Title'
import { Image } from 'tdesign-react'
import { PlayCircleStrokeIcon } from 'tdesign-icons-react'

interface Interface {
    list: Array<any>
    newSongList: Array<any>
}

const Recommend = (props: Interface) => {
    const { list, newSongList } = props

    const playList = list.map((item) => (
        <div className={Style.list} key={item.id}>
            <Image fit={'cover'} shape={'round'} src={item.coverImgUrl} />
            <div className={Style.text}>{item.name}</div>
        </div>
    ))

    const newList = newSongList.map((item) => (
        <div className={`${Style.item} flexSb`} key={item.id}>
            <div className={Style.left}>
                <p className={'ellipsis'}>{item.name}</p>
                <p className={`${Style.singer} ellipsis`}>{item.artistText}</p>
            </div>
            <div className={Style.right}>
                <PlayCircleStrokeIcon style={{ color: '#aaaaaa', fontSize: '26px' }} />
            </div>
        </div>
    ))

    return (
        <div className={Style.RecommendBox}>
            <Title name={'网友推荐'} />
            <div className={`${Style.playlistBox} ${Style.container}`}>{playList}</div>
            <Title name={'最新音乐'} />
            <div className={Style.newList}>{newList}</div>
        </div>
    )
}

export default memo(Recommend)
