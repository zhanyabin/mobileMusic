import React, { memo, useEffect, useState } from 'react'
import Style from './index.module.less'

interface Interface {
    name?: string
}

const Slider = (props: Interface) => {
    const [progress, setProgress] = useState(0)

    const updateProgress = (event: any) => {
        const clickPosition = event.clientX
        // const progressBarRect = progressBar.getBoundingClientRect() // 获取进度条的位置和尺寸信息
        console.log('ee', clickPosition)
        // if (progress < 100) {
        //     setProgress(progress + 10)
        // }
    }

    useEffect(() => {}, [])

    return (
        <div className={Style.slider} onClick={updateProgress}>
            <div className={Style.slider__rail}>
                <div className={Style.slider__track} style={{ width: `${progress}%` }}></div>
                <div className={Style.slider__button_wrapper} style={{ left: `${progress}%` }}>
                    <div className={Style.slider__button}></div>
                </div>
            </div>
        </div>
    )
}

export default memo(Slider)
