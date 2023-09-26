import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// 快速导入工具函数
const lazyLoad = (moduleName: string) => {
    const Module = lazy(() => import(`../pages/${moduleName}`))
    return <Module />
}

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
        element: lazyLoad('Home'),
    },
    {
        name: 'my',
        path: '/my',
        meta: {
            title: '我的',
        },
        element: lazyLoad('My'),
    },
    {
        name: 'login',
        meta: {
            title: '登录',
            hidden: true,
        },
        path: '/login',
        element: lazyLoad('Login'),
    },
    {
        path: '*',
        element: lazyLoad('NotFound'),
    },
]

export default routes
