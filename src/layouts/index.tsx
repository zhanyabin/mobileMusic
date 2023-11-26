import React, { memo, Suspense, useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import routers from '@/routers'
import { Layout, DialogPlugin } from 'tdesign-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, toggleSetting, changeUserInfo } from 'modules/global'
import { Drawer } from 'tdesign-react'
import Nav from './components/Nav'
import Setting from './components/Setting'
import Style from './index.module.less'
import { loginStatus, getUserDetail, anonimousLogin } from 'api/Login'
import { getToken } from 'utils/auth'

const { Header, Content, Footer } = Layout

export default memo(() => {
    const dispatch = useAppDispatch()
    const globalState = useAppSelector(selectGlobal)
    const element = useRoutes(routers)
    const [height, setHeight] = useState(window.innerHeight)

    const getLoginStatus = async () => {
        // 如果没有token则默认游客登录  游客id 8949707087
        const MUSIC_U = getToken()
        if (!MUSIC_U) {
            await anonimousLogin()
        }
        // 判断是否是匿名用户以及是否登录
        const { data } = await loginStatus()
        const anonimousUser = data?.account?.anonimousUser
        const id = data?.account?.id
        const display = [8949024981, 8949707087]
        if (!anonimousUser && id && !display.includes(data?.profile?.userId)) {
            const userData = await getUserDetail(id)
            dispatch(changeUserInfo(userData))
        }
    }

    const setHeightEvent = () => {
        const height = window.innerHeight
        setHeight(height)
    }

    useEffect(() => {
        getLoginStatus()
        const alertDia = DialogPlugin.alert({
            width: '350px',
            // header: '提示',
            closeBtn: false,
            footer: false,
            body: '由于网易云的安全拦截策略，未登录用户播放歌曲会出现【网络太拥挤，请稍后再试】的错误，建议先点击右上角前往【我的】页面进行登录，以获取更好的体验',
            onConfirm: ({ e }) => {
                alertDia.hide();
            },
            onClose: ({ e, trigger }) => {
                alertDia.hide();
            },
        })
        window.addEventListener('resize', setHeightEvent, false)
        return () => {
            window.removeEventListener('resize', setHeightEvent)
        }
    }, [])

    return (
        <Layout className={Style.layoutMain} style={{height: height + 'px'}}>
            <Header>
                <Nav />
            </Header>
            <Content style={{height: `calc(${height}px - var(--td-comp-size-xxxl))`, overflow: 'scroll'}}>
                <Suspense fallback={<div>loading...</div>}>{element}</Suspense>
            </Content>
            {/*<Footer>底部</Footer>*/}
            <Drawer
                destroyOnClose
                visible={globalState.setting}
                size='60%'
                footer={false}
                header='菜单'
                onClose={() => dispatch(toggleSetting())}>
                <Setting />
            </Drawer>
        </Layout>
    )
})
