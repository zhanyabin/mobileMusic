import React, { memo } from 'react'
import Style from './index.module.less'

interface Interface {
    name: string
}

const Title = (props: Interface) => {
    return (
        <div className={`${ Style.titleBox } flexStart`}>
            <i className={Style.block}></i>
            <span>{props.name}</span>
        </div>
    )
}

export default memo(Title)
