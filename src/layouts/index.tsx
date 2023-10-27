import React, { memo, Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routers from '@/routers'
import { Layout } from 'tdesign-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, toggleSetting, changeUserInfo } from 'modules/global'
import { Drawer } from 'tdesign-react'
import Nav from './components/Nav'
import Setting from './components/Setting'
import Style from './index.module.less'
import { loginStatus, getUserDetail } from 'api/Login'

const { Header, Content, Footer } = Layout

export default memo(() => {
    const dispatch = useAppDispatch()
    const globalState = useAppSelector(selectGlobal)
    const element = useRoutes(routers)

    const getLoginStatus = async () => {
        const { data } = await loginStatus()
        // 判断是否是匿名用户
        const anonimousUser = data.account.anonimousUser
        if (!anonimousUser) {
            const id = data.account.id
            const userData = await getUserDetail(id)
            dispatch(changeUserInfo(userData))
        }
    }

    useEffect(() => {
        getLoginStatus()
    }, [])

    return (
        <Layout className={Style.layoutMain} style={{height: window.innerHeight + 'px'}}>
            <Header>
                <Nav />
            </Header>
            <Content style={{height: `calc(${window.innerHeight}px - var(--td-comp-size-xxxl))`}}>
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
