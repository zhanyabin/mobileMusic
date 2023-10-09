import React, { memo, useEffect, useState } from 'react'
import Style from './index.module.less'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'ahooks'
import { getPlayListAll } from 'api/Home'
import { List, Drawer, Button } from 'tdesign-react'
import _ from 'lodash'

const Player = () => {
    const navigate = useNavigate()
    const location: any = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState({
        id: location.state?.id,
        offset: 0,
        limit: 50,
    })
    const [listData, setListData] = useState<any>([])
    const [visible, setVisible] = useState(false)

    // 获取歌单列表
    const getSongList = () => {
        setIsLoading(true)
        getPlayListAll(search).then((res) => {
            res.songs.forEach((item: any) => {
                let arr: any[] = []
                item.ar.forEach((ar: any) => {
                    arr.push(ar.name)
                })
                item.singer = arr.join('/')
                console.log('item.singer', item.singer)
            })
            const arr = _.uniqBy(listData.concat(res.songs), 'id')
            setListData(arr)
            setIsLoading(false)
        })
    }

    // 分页
    const handleScroll = ({ scrollBottom }: { scrollBottom: number }) => {
        let total = location.state?.trackCount
        if (!scrollBottom && search.offset < total) {
            setSearch({ ...search, offset: search.offset + search.limit })
        }
    }

    // 处理时间
    const getType = (time: number | string) => {
        return time < 10 ? '0' + time : String(time)
    }
    const formatTime = (time: number) => {
        let min = Math.floor(time / 1000 / 60)
        let sec = ((time / 1000) % 60).toFixed(0)
        return `${getType(min)}:${getType(sec)}`
    }

    useUpdateEffect(() => {
        getSongList()
    }, [search])

    useEffect(() => {
        getSongList()
    }, [])
    return (
        <div>
            <Button
                onClick={() => {
                    setVisible(true)
                }}>
                打开
            </Button>
            <Drawer
                header='歌曲列表'
                placement='bottom'
                visible={visible}
                size={'70%'}
                footer={false}
                onClose={() => {
                    setVisible(false)
                }}>
                <List
                    asyncLoading={isLoading ? 'loading' : ''}
                    size='small'
                    split
                    className={Style.list}
                    onScroll={handleScroll}>
                    {listData.map((item: any, index: number) => (
                        <li key={item.id} className={`${Style.listItem} flexSb`}>
                            <div className={Style.index}>{index + 1}</div>
                            <div className={Style.right}>
                                <div className='flexSb'>
                                    <div className={Style.title}>{item.name}</div>
                                    <div className={Style.time}>{formatTime(item.dt)}</div>
                                </div>
                                <div className={Style.singer}>{item.singer}</div>
                            </div>
                        </li>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}

export default memo(Player)
