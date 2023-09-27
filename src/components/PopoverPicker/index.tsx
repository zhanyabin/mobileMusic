import React, { useCallback, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import useClickOutside from 'hooks/useClickOutside'
import Style from './index.module.less'

export const PopoverPicker = ({ color, onChange }: { color: string, onChange: any }) => {
    const popover = useRef(null)
    const [isOpen, toggle] = useState(false)

    const close = useCallback(() => toggle(false), [])
    useClickOutside(popover, close)

    return (
        <div className={Style.picker}>
            <div
                className={Style.swatch}
                style={{ backgroundColor: color }}
                onClick={() => toggle(true)}
            />

            {isOpen && (
                <div className={Style.popover} ref={popover}>
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            )}
        </div>
    )
}
