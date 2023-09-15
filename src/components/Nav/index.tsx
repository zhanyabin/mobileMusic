import React, { memo, useEffect, useState } from 'react'
import { Drawer, Button, ColorPicker } from 'tdesign-react'
import { UserIcon } from 'tdesign-icons-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, switchTheme, switchColor } from 'modules/global'
import { ETheme } from 'types/index.d'
import routers from 'routers/index'

const Nav = () => {
    const dispatch = useAppDispatch()
    const globalState = useAppSelector(selectGlobal)
    const [status, setStatus] = useState(false)
    console.log('routers', routers)
    const test = () => {
        setStatus(!status)
    }
    const changeColor = (v: string) => {
        console.log('v', v)
        dispatch(switchColor(v))
    }
    useEffect(() => {
        console.log('111')
        dispatch(switchTheme(status ? ETheme.dark : ETheme.light))
        // dispatch(switchColor(status ? '#f3b814' : '#f72a25'))
    }, [status])
    return (
        <div>
            <Button shape='square' variant='outline'>
                <UserIcon />
            </Button>
            <Button onClick={test}>测试</Button>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <span>选择主题色：</span>
                <ColorPicker
                    onChange={(v) => changeColor(v)}
                    colorModes={['monochrome']}
                    format='HEX'
                    swatchColors={[]}
                    defaultValue={globalState.color}
                />
            </div>
            {/*<span>头部</span>*/}
        </div>
    )
}

export default memo(Nav)
