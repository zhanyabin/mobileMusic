import React, { memo, useEffect, useState } from 'react'
import routers from 'routers/index'
import Style from './index.module.less'
import { NavLink } from 'react-router-dom'
import { ModeLightIcon, ModeDarkIcon } from 'tdesign-icons-react'
import { selectGlobal, switchTheme, switchColor, toggleSetting } from 'modules/global'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { ETheme } from 'types/index.d'
import { PopoverPicker } from 'components/PopoverPicker'
import { useUpdateEffect } from 'ahooks'

export default memo(() => {
    const dispatch = useAppDispatch()
    const menuList = routers.filter((item) => item.name && !item.meta?.hidden)
    const globalState = useAppSelector(selectGlobal)
    const [color, setColor] = useState(globalState.color)

    const menuClick = () => {
        dispatch(toggleSetting())
    }

    const changeMode = () => {
        globalState.theme === ETheme.light
            ? dispatch(switchTheme(ETheme.dark))
            : dispatch(switchTheme(ETheme.light))
    }

    const menu = menuList.map((item) => (
        <NavLink key={item.name} to={item.path} className={Style.menu} onClick={menuClick}>
            {item.meta?.title}
        </NavLink>
    ))

    useUpdateEffect(() => {
        dispatch(switchColor(color))
    }, [color])

    return (
        <>
            {menu}
            <div className={Style.mode} onClick={changeMode}>
                {globalState.theme === ETheme.light ? (
                    <ModeDarkIcon size={'large'} />
                ) : (
                    <ModeLightIcon size={'large'} />
                )}
            </div>
            <PopoverPicker color={color} onChange={setColor} />
        </>
    )
})
