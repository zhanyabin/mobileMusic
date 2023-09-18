import React, { memo, useEffect, useState } from 'react'
import { Button, ColorPicker, Image } from 'tdesign-react'
import { UserIcon } from 'tdesign-icons-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, switchTheme, switchColor, toggleSetting } from 'modules/global'
import { ETheme } from 'types/index.d'
import routers from 'routers/index'
import Logo from 'assets/images/logo.png'
import Style from 'layouts/index.module.less'
import { defaultColor } from 'configs/color'

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

    const toggleSettingPanel = () => {
        dispatch(toggleSetting());
    }

    useEffect(() => {
        console.log('111')
        dispatch(switchTheme(status ? ETheme.dark : ETheme.light))
        dispatch(switchColor(defaultColor[0]))
    }, [status])
    return (
        <div className={Style.navBox + ' flexSb'}>
            <Image className={Style.logo} src={Logo} fit={'contain'} />
            <Button shape='square' variant='outline' onClick={toggleSettingPanel}>
                <UserIcon />
            </Button>
            {/*<Button onClick={test}>测试</Button>*/}
            {/*<div*/}
            {/*    style={{*/}
            {/*        display: 'flex',*/}
            {/*        justifyContent: 'center',*/}
            {/*        alignItems: 'center',*/}
            {/*    }}>*/}
            {/*    <span>选择主题色：</span>*/}
            {/*    <ColorPicker*/}
            {/*        onChange={(v) => changeColor(v)}*/}
            {/*        colorModes={['monochrome']}*/}
            {/*        format='HEX'*/}
            {/*        swatchColors={[]}*/}
            {/*        defaultValue={globalState.color}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<span>头部</span>*/}
        </div>
    )
}

export default memo(Nav)
