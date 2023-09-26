import React, { memo } from 'react'
import Style from './index.module.less'
import { Button } from 'tdesign-react'

const My = () => {
    return (
        <>
            <Button variant='outline'> 我的 </Button>
            <div className={Style.settingSubTitle}>登录</div>
        </>
    )
}

export default memo(My)
