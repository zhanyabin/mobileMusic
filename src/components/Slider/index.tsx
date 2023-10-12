import React, { memo, useState, useRef } from 'react'
import Style from './index.module.less'
import { useUpdateEffect } from 'ahooks'

interface Interface {
    value: number
    style?: object
    handleClick?: (progressRatio: number) => void
    changEnd?: (progressRatio: number) => void
}

const Slider = (props: Interface) => {
    const { handleClick, changEnd, value } = props
    const [progress, setProgress] = useState(0)
    const refProgress = useRef<HTMLDivElement>(null)
    const buttonWrapper = useRef<HTMLDivElement>(null)

    // 点击进度条更新事件
    const updateProgress = (event: any) => {
        const clickPosition = event.clientX
        // 获取进度条的位置和尺寸信息
        if (refProgress.current != null) {
            const progressBarRect = refProgress.current.getBoundingClientRect()
            const progressBarWidth = progressBarRect.width
            // 计算进度条的百分比
            const progress = (clickPosition - progressBarRect.left) / progressBarWidth
            const progressRatio = Math.round(progress * 100)
            setProgress(progressRatio)

            if (handleClick) {
                handleClick(progressRatio)
            }
        }
    }

    // 进度条拖拽事件
    const pointMove = (event: any) => {
        if (refProgress.current === null) return
        const progressBarWidth = refProgress.current.offsetWidth
        const touchPositionX =
            event.touches[0].clientX - refProgress.current.getBoundingClientRect().left
        const percentage = (touchPositionX / progressBarWidth) * 100
        if (percentage < 0) {
            setProgress(0)
        } else if (percentage > 100) {
            setProgress(100)
        } else {
            setProgress(percentage)
        }
    }

    // 进度条拖拽事件结束
    const pointEnd = () => {
        if (changEnd) {
            changEnd(progress)
        }
    }

    useUpdateEffect(() => {
        setProgress(value)
    }, [value])

    return (
        <div
            style={props.style}
            className={Style.slider}
            onClick={updateProgress}
            ref={refProgress}>
            <div className={Style.slider__rail}>
                <div className={Style.slider__track} style={{ width: `${progress}%` }}></div>
                <div
                    ref={buttonWrapper}
                    onTouchMove={pointMove}
                    onTouchEnd={pointEnd}
                    className={Style.slider__button_wrapper}
                    style={{ left: `${progress}%` }}>
                    <div className={Style.slider__button}></div>
                </div>
            </div>
        </div>
    )
}

export default memo(Slider)
