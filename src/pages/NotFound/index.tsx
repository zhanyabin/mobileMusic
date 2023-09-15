import React, { memo } from 'react'
import Style from './index.module.less'

const NotFound = () => {
    return (
        <>
            <div className={Style.settingSubTitle}>找不到页面</div>
        </>
    )
}

export default memo(NotFound)
