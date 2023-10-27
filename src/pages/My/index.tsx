import React, { memo, useState, useEffect } from 'react'
import Style from './index.module.less'
import { Button } from 'tdesign-react'
import LoginDrawer from 'components/LoginDrawer'
import { selectGlobal } from 'modules/global'
import { useAppSelector } from 'modules/store'
import { Image } from 'tdesign-react';
import myBgImg from 'assets/images/my_bg.jpg'

const My = () => {
    const [isShowLogin, setIsShowLogin] = useState(false)
    const { userInfo } = useAppSelector(selectGlobal)

    const openLoginDrawer = () => {
        setIsShowLogin(true)
    }

    const closeLoginDrawer = () => {
        setIsShowLogin(false)
    }

    useEffect(() => {
        console.log('userInfo', userInfo)
    })

    return (
        <>
            <Image className={Style.img} src={myBgImg}></Image>
            <Button theme={'primary'} block shape={'round'} onClick={openLoginDrawer}>
                登录
            </Button>
            <div className={Style.settingSubTitle}>我的</div>
            <LoginDrawer
                visible={isShowLogin}
                onClose={closeLoginDrawer}
                onSuccess={closeLoginDrawer}></LoginDrawer>
        </>
    )
}

export default memo(My)
