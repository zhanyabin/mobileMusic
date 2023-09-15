import React, { memo } from 'react'
import Style from './index.module.less'
import { Button } from 'tdesign-react'

const Login = () => {
    return (
        <>
            <Button variant='outline'> 登录 </Button>
            <div className={Style.settingSubTitle}>登录</div>
        </>
    )
}

export default memo(Login)
