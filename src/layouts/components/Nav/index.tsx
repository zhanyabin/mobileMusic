import React, { memo, useEffect, useState } from 'react'
import { Button, ColorPicker, Image } from 'tdesign-react'
import { UserIcon } from 'tdesign-icons-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, switchTheme, switchColor, toggleSetting } from 'modules/global'
import { ETheme } from 'types/index.d'
import Logo from 'assets/images/logo.png'
import Style from 'layouts/index.module.less'
import { defaultColor } from 'configs/color'

const Nav = () => {
    const dispatch = useAppDispatch()
    const [status, setStatus] = useState(false)

    const toggleSettingPanel = () => {
        dispatch(toggleSetting())
    }

    useEffect(() => {
        dispatch(switchTheme(status ? ETheme.dark : ETheme.light))
        dispatch(switchColor(defaultColor[0]))
    }, [status])
    return (
        <div className={Style.navBox + ' flexSb'}>
            <Image className={Style.logo} src={Logo} fit={'contain'} />
            <Button shape='square' variant='outline' onClick={toggleSettingPanel}>
                <UserIcon />
            </Button>
        </div>
    )
}

export default memo(Nav)
