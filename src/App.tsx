import React, { Suspense } from 'react'
import { Layout } from 'tdesign-react'
import { useRoutes, Link } from 'react-router-dom'
import routers from './routers'

import Nav from 'components/Nav'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
    const element = useRoutes(routers)
    return (
        <Layout>
            <Header>
                <Nav />
            </Header>
            <Content>
                <Suspense fallback={<div>loading...</div>}>{element}</Suspense>
            </Content>
            <Footer>底部</Footer>
        </Layout>
    )
}
export default App
