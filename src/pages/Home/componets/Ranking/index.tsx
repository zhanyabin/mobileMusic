import React, { memo, useState } from 'react'
import Style from './index.module.less'
import indexIcon from 'assets/images/index_icon_2x.png'
import Title from 'components/Title'
import { PlayCircleStrokeIcon, PlayIcon } from 'tdesign-icons-react'
import { BackTop, List } from 'tdesign-react'
import { useNavigate } from 'react-router-dom'

interface Interface {
    data: object | any
}

const Ranking = (props: Interface) => {
    const navigate = useNavigate()
    const [container, setContainer] = useState<any>(null)
    const { data } = props
    const style: any = {
        position: 'absolute',
        insetInlineEnd: 20,
        insetBlockEnd: 60,
    }

    const listWrapStyle: any = {
        width: '100%',
        position: 'relative',
        overflowY: 'scroll',
        overflowX: 'hidden',
    }

    const openPage = (id: number, trackCount: number, isSongs: boolean = true) => {
        navigate('/player', {
            state: {
                id,
                trackCount,
                isSongs,
            },
        })
    }

    const playAllEvent = () => {
        if (!data?.tracks) {
            return
        }
        navigate('/player', {
            state: {
                songList: data?.tracks,
                trackCount: data?.tracks?.length || 0,
                isSongs: true,
            },
        })
    }

    return (
        <>
            <div className={Style.topBlock}>
                <img src={indexIcon} alt='' />
                <div className={Style.description}>{data.description}</div>
            </div>

            <div className={Style.musicList} style={listWrapStyle} ref={setContainer}>
                <div className={'flexSb'}>
                    <Title name={'音乐列表'} />
                    <div className={Style.playButton} onClick={playAllEvent}>
                        <PlayIcon size={'24px'} style={{color: 'var(--td-brand-color-3)'}} />
                        播放
                    </div>
                </div>
                <List className={Style.newList}>
                    {(data.tracks || []).map((item: any) => (
                        <div
                            className={`${Style.item} flexSb`}
                            key={item.id}
                            onClick={() => {
                                openPage(item.id, item.trackCount, false)
                            }}>
                            <div className={Style.left}>
                                <p className={'ellipsis'}>{item.name}</p>
                                <p className={`${Style.singer} ellipsis`}>
                                    {item.artists.join(' / ')}
                                </p>
                            </div>
                            <div className={Style.right}>
                                <PlayCircleStrokeIcon
                                    style={{ color: '#aaaaaa', fontSize: '26px' }}
                                />
                            </div>
                        </div>
                    ))}
                </List>
            </div>
            <BackTop
                size='small'
                theme='primary'
                container={() => container}
                visibleHeight={46}
                style={style}></BackTop>
        </>
    )
}

export default memo(Ranking)
