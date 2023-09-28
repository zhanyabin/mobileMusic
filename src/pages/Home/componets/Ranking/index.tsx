import React, { memo, useState } from 'react'
import Style from './index.module.less'
import indexIcon from 'assets/images/index_icon_2x.png'
import Title from 'components/Title'
import { PlayCircleStrokeIcon } from 'tdesign-icons-react'
import { BackTop, List } from 'tdesign-react'

interface Interface {
    data: object | any
}

const Ranking = (props: Interface) => {
    const [container, setContainer] = useState<any>(null)
    const { data } = props
    const style: any = {
        position: 'absolute',
        insetInlineEnd: 15,
        insetBlockEnd: 15,
    }

    const listWrapStyle: any = {
        width: '100%',
        position: 'relative',
        overflowY: 'scroll',
        overflowX: 'hidden',
    }
    return (
        <div>
            <div className={Style.topBlock}>
                <img src={indexIcon} alt='' />
                <div className={Style.description}>{data.description}</div>
            </div>

            <div className={Style.musicList} style={listWrapStyle} ref={setContainer}>
                <Title name={'音乐列表'} />
                <List className={Style.newList}>
                    {(data.tracks || []).map((item: any) => (
                        <div className={`${Style.item} flexSb`} key={item.id}>
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
        </div>
    )
}

export default memo(Ranking)
