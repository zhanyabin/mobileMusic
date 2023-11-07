import React, { memo, useState, useEffect } from 'react'
import Style from './index.module.less'
import { Button } from 'tdesign-react'
import LoginDrawer from 'components/LoginDrawer'
import { changeUserInfo, selectGlobal } from 'modules/global'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { Image } from 'tdesign-react'
import { Avatar } from 'tdesign-react'
import myBgImg from 'assets/images/my_bg.jpg'
import _ from 'lodash'
import { getUserDetail, getUserPlayList } from 'api/Login'
import { IUserInfo } from 'types/user'
import { useUpdateEffect } from 'ahooks'
import { useNavigate } from 'react-router-dom'

const imgStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
}

const My = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isShowLogin, setIsShowLogin] = useState(false)
    const [musicILike, setMusicILike] = useState<any>({})
    const [collectList, setCollectList] = useState([])

    const { userInfo }: { userInfo: IUserInfo | any } = useAppSelector(selectGlobal)

    const openLoginDrawer = () => {
        setIsShowLogin(true)
    }

    const closeLoginDrawer = () => {
        setIsShowLogin(false)
    }

    // 获取登录用户歌单
    const getUserPlayListEvent = async () => {
        if (userInfo.profile?.userId) {
            const { playlist } = await getUserPlayList(userInfo.profile?.userId)
            if (playlist.length > 0) {
                console.log('data', playlist)
                const likeMusic = playlist[0]
                setMusicILike(likeMusic)
                const myList = playlist.slice(1)
                setCollectList(myList)
            }
        }
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

    // 登录成功
    const loginSuccess = async (id: number) => {
        const userData = await getUserDetail(id)
        dispatch(changeUserInfo(userData))
        closeLoginDrawer()
    }

    const songList = collectList.map((item: any) => (
        <div
            className={`${Style.songBox} flexStart`}
            key={item.id}
            onClick={() => {
                openPage(item.id, item.trackCount)
            }}>
            <Image
                className={Style.likeImg}
                fit={'fill'}
                shape={'round'}
                src={item.coverImgUrl}
                placeholder={<div style={imgStyle}></div>}
            ></Image>
            <div className={Style.rightBox}>
                <div className={Style.likeName}>{item.name}</div>
                <div className={Style.likeTrackCount}>{item.trackCount || 0}首</div>
            </div>
        </div>
    ))

    useEffect(() => {
        getUserPlayListEvent()
    }, [userInfo])

    return (
        <>
            <div className={Style.userBox}>
                <Image className={Style.img} src={myBgImg}></Image>
                <div className={Style.infoBox}>
                    <Avatar
                        image={userInfo.profile?.avatarUrl}
                        className={Style.avatar}
                        size='100px'
                        shape='circle'
                    />
                    <h2>{userInfo.profile?.nickname}</h2>
                </div>
            </div>
            <div className={Style.myBox}>
                {!_.isEmpty(userInfo) ? (
                    <>
                        <div
                            className={`${Style.myLike} flexStart`}
                            onClick={() => {
                                openPage(musicILike.id, musicILike.trackCount)
                            }}>
                            <Image
                                className={Style.likeImg}
                                fit={'fill'}
                                shape={'round'}
                                src={musicILike.coverImgUrl}
                                placeholder={<div style={imgStyle}></div>}></Image>
                            <div>
                                <div className={Style.likeName}>我喜欢的音乐</div>
                                <div className={Style.likeTrackCount}>
                                    {musicILike.trackCount || 0}首
                                </div>
                            </div>
                        </div>

                        <div className={`${Style.myLike}`}>
                            <div className={Style.title}>
                                创建歌单 ({collectList.length || 0}个)
                            </div>
                            {songList}
                            {/*<div className={'flexStart'}>*/}
                            {/*    <Image*/}
                            {/*        className={Style.likeImg}*/}
                            {/*        fit={'fill'}*/}
                            {/*        shape={'round'}*/}
                            {/*        src={musicILike.coverImgUrl}></Image>*/}
                            {/*    <div>*/}
                            {/*        <div className={Style.likeName}>我喜欢的音乐</div>*/}
                            {/*        <div className={Style.likeTrackCount}>*/}
                            {/*            {musicILike.trackCount || 0}首*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </>
                ) : (
                    <Button theme={'primary'} block shape={'round'} onClick={openLoginDrawer}>
                        登录
                    </Button>
                )}
            </div>
            <LoginDrawer
                visible={isShowLogin}
                onClose={closeLoginDrawer}
                onSuccess={loginSuccess}></LoginDrawer>
        </>
    )
}

export default memo(My)
