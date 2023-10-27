import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CHART_COLORS, defaultColor } from 'configs/color'
import { generateColorMap, insertThemeStylesheet } from 'utils/color'
import { ETheme } from 'types/index.d'
import { Color } from 'tvision-color'
import { IUserInfo } from 'types/user'

const namespace = 'global'

export interface IGlobalState {
    // 主题：深色 浅色
    theme: ETheme
    color: string
    // 是否显示个人中心弹窗
    setting: boolean
    // 用户信息
    userInfo: IUserInfo | object
}

const defaultTheme = ETheme.light

const initialState: IGlobalState = {
    theme: defaultTheme,
    color: defaultColor?.[0],
    setting: false,
    userInfo: {}
}

// 创建带有命名空间的reducer
const globalSlice = createSlice({
    name: namespace,
    initialState,
    reducers: {
        switchColor: (state, action) => {
            if (action?.payload) {
                state.color = action?.payload
                const mode = state.theme

                const hex = action?.payload

                const { colors: newPalette, primary: brandColorIndex } = Color.getColorGradations({
                    colors: [hex],
                    step: 10,
                    remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
                })[0]
                const newColorMap = generateColorMap(hex, newPalette, mode, brandColorIndex)
                insertThemeStylesheet(hex, newColorMap, mode)

                document.documentElement.setAttribute('theme-color', hex || '')
            }
        },
        switchTheme: (state, action: PayloadAction<ETheme>) => {
            const finalTheme = action?.payload
            // 切换主题颜色
            state.theme = finalTheme
            document.documentElement.setAttribute('theme-mode', finalTheme)
        },
        toggleSetting: (state) => {
            state.setting = !state.setting
        },
        changeUserInfo: (state, action) => {
            state.userInfo = action.payload
        }
    },
})

export const { switchTheme, switchColor, toggleSetting, changeUserInfo } = globalSlice.actions

export const selectGlobal = (state: RootState) => state.global

export default globalSlice.reducer
