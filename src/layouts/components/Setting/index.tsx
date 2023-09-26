import React, { memo, useEffect, useState } from 'react'
import routers from 'routers/index'
import Style from './index.module.less'
import { NavLink } from 'react-router-dom'
import { ModeLightIcon, ModeDarkIcon } from 'tdesign-icons-react'
import { selectGlobal, switchTheme, switchColor } from 'modules/global'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { ETheme } from 'types/index.d'

export default memo(() => {
    const dispatch = useAppDispatch()
    const menuList = routers.filter((item) => item.name && !item.meta?.hidden)
    const globalState = useAppSelector(selectGlobal)
    console.log('globalState', globalState)
    const menu = menuList.map((item) => (
        <NavLink key={item.name} to={item.path} className={Style.menu}>
            {item.meta?.title}
        </NavLink>
    ))

    const changeMode = () => {
        globalState.theme === ETheme.light
            ? dispatch(switchTheme(ETheme.dark))
            : dispatch(switchTheme(ETheme.light))
    }

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
        </>
    )
})
