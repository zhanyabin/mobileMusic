// import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import Home from 'pages/Home'
import My from 'pages/My'
import NotFound from 'pages/NotFound'
import Player from 'pages/Player'

// 快速导入工具函数
// const lazyLoad = (moduleName: string) => {
//     const Module = lazy(() => import(`../pages/${moduleName}`))
//     return <Module />
// }

interface Router {
    name?: string
    path: string
    element: any
    meta?: {
        title?: string
        hidden?: boolean
    }
}

const routes: Array<Router> = [
    {
        path: '/',
        element: <Navigate to='/home' />,
    },
    {
        name: 'home',
        path: '/home',
        meta: {
            title: '首页',
        },
        // element: lazyLoad('Home'),
        element: <Home />,
    },
    {
        name: 'my',
        path: '/my',
        meta: {
            title: '我的',
        },
        element: <My />,
    },
    {
        name: 'player',
        path: '/player',
        meta: {
            title: '播放器',
            hidden: true,
        },
        element: <Player />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]

export default routes
