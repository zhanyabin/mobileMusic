import React, { memo, useState } from 'react'
import Style from './index.module.less'

interface Interface {
    list: Array<string>
    changeEvent?: (index: number) => void
}

const TabsList = (props: Interface) => {
    const {list, changeEvent} = props
    const [active, setActive] = useState(0)

    const itemClick = (index: number) => {
        setActive(index)
        changeEvent?.(index)
    }
    const tabItem = list.map((item, index) => (
        <div className={`${Style.tabsTab} ${index === active ? Style.tabActive : ''}`} key={index} onClick={() => {itemClick(index)}}>{item}</div>
    ))
    return (
        <div className={Style.tabsListBox}>
            <div className={Style.tabWrapper}>
                {tabItem}
            </div>
        </div>
    )
}

export default memo(TabsList)
