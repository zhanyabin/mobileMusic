import React, { memo, useState } from 'react'
import Style from './index.module.less'
import { Button } from 'tdesign-react'
import LoginDrawer from 'components/LoginDrawer'

const My = () => {
    const [isShowLogin, setIsShowLogin] = useState(false)

    const openLoginDrawer = () => {
        setIsShowLogin(true)
    }

    const closeLoginDrawer = () => {
        setIsShowLogin(false)
    }

    return (
        <>
            <Button variant='outline' onClick={openLoginDrawer}> 登录 </Button>
            <div className={Style.settingSubTitle}>我的</div>
            <LoginDrawer visible={isShowLogin} onClose={closeLoginDrawer} onSuccess={closeLoginDrawer}></LoginDrawer>
        </>
    )
}

export default memo(My)
