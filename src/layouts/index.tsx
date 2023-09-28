import React, { memo, Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routers from '@/routers'
import { Layout } from 'tdesign-react'
import { useAppDispatch, useAppSelector } from 'modules/store'
import { selectGlobal, toggleSetting } from 'modules/global'
import { Drawer } from 'tdesign-react'
import Nav from './components/Nav'
import Setting from './components/Setting'

const { Header, Content, Footer } = Layout

export default memo(() => {
    const dispatch = useAppDispatch()
    const globalState = useAppSelector(selectGlobal)
    const element = useRoutes(routers)
    return (
        <Layout style={{ height: '100vh' }}>
            <Header>
                <Nav />
            </Header>
            <Content>
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
