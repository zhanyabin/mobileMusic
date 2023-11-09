import React, { memo } from 'react'
import Style from './index.module.less'
import Title from 'components/Title'
import { Image } from 'tdesign-react'
import { PlayCircleStrokeIcon, PlayIcon } from 'tdesign-icons-react'
import { useNavigate } from 'react-router-dom'

interface Interface {
    list: Array<any>
    newSongList: Array<any>
}

const imgStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
}

const Recommend = (props: Interface) => {
    const { list, newSongList } = props
    const navigate = useNavigate()

    const openPage = (id: number, trackCount: number, isSongs: boolean = true) => {
        navigate('/player', {
            state: {
                id,
                trackCount,
                isSongs,
            },
        })
    }

    const playList = list.map((item) => (
        <div
            className={Style.list}
            key={item.id}
            onClick={() => {
                openPage(item.id, item.trackCount)
            }}>
            <Image
                fit={'cover'}
                shape={'round'}
                src={item.coverImgUrl + '?param=100y100'}
                style={imgStyle}
                placeholder={<div style={imgStyle}></div>}
            />
            <div className={Style.text}>{item.name}</div>
        </div>
    ))

    const playAllEvent = () => {
        let arr: any = []
        newSongList.forEach(item => {
            arr.push(item.song)
        })
        arr = arr.map((item: any) => {
            console.log('item', item)
            item.al = item.album
            item.ar = item.artists
            item.dt = item.duration
            return item
        })
        navigate('/player', {
            state: {
                songList: arr,
                trackCount: arr.length,
                isSongs: true,
            },
        })
    }

    const newList = newSongList.map((item) => (
        <div
            className={`${Style.item} flexSb`}
            key={item.id}
            onClick={() => {
                openPage(item.id, item.trackCount, false)
            }}>
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
            <div className={'flexSb'} style={{marginBottom: '10px'}}>
                <Title name={'最新音乐'} />
                <div className={Style.playButton} onClick={playAllEvent}>
                    <PlayIcon size={'24px'} style={{color: 'var(--td-brand-color-3)'}} />
                    播放
                </div>
            </div>
            <div className={Style.newList}>{newList}</div>
        </div>
    )
}

export default memo(Recommend)
