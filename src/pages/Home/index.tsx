import React, { memo } from 'react'
import Style from './index.module.less'
import { Button } from 'tdesign-react'

const Home = () => {
    return (
        <>
            <Button variant='outline'> 搜索 </Button>
            <div
                style={{
                    width: '300px',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid var(--td-gray-color-9)',
                    backgroundColor: 'var(--td-brand-color)'
                }}>
                <div className={Style.settingSubTitle}>测试一下啊</div>
            </div>
        </>
    )
}

export default memo(Home)
