import React, { memo, useRef, useState, useEffect } from 'react'
import { Drawer, Form, Input, Button, MessagePlugin, SubmitContext, DialogPlugin } from 'tdesign-react'
import { UserIcon, LockOnIcon } from 'tdesign-icons-react'
import { login, getQrKey, createQrUrl, checkQr, loginStatus } from 'api/Login'
import { useUpdateEffect } from 'ahooks'
import Style from './index.module.less'
import { setToken } from 'utils/auth'
import _ from 'lodash'

interface Interface {
    // 控制弹窗关闭/开启
    visible: boolean
    // 弹窗关闭触发回调
    onClose: Function
    // 登录成功触发
    onSuccess: Function
}

const { FormItem } = Form

const defaultCountdown = 60

const LoginDrawer = (props: Interface) => {
    const { visible, onClose, onSuccess } = props
    const [qrKey, setQrKey] = useState('')
    const [qrUrl, setQrUrl] = useState('')
    const [countDown, setCountDown] = useState(0)
    const timer = useRef<number | NodeJS.Timeout | null>(null)

    const onSubmit = async ({ validateResult, fields }: SubmitContext) => {
        console.log('fields', fields)
        if (validateResult === true) {
            const loginData = await login(fields)
            if (loginData.code === 200) {
                await MessagePlugin.success('登录成功')
                onSuccess(loginData?.account?.id)
            }
        }
    }

    const getQrUrlEvent = async () => {
        const keyData = await getQrKey()
        const key = keyData?.data?.unikey
        const qrUrl =  await createQrUrl(key)
        console.log('qrUrl?.data?.qrurl', qrUrl?.data?.qrimg)
        setQrKey(key)
        setQrUrl(qrUrl?.data?.qrimg)
        setCountDown(defaultCountdown)
    }

    // 再次进行轮询
    const qrAgain = () => {
        const myDialog = DialogPlugin({
            header: '提示',
            body: '查询扫码状态异常，请重新扫码',
            onConfirm: ({ e }) => {
                getQrUrlEvent()
                myDialog.hide()
            },
            onClose: ({ e, trigger }) => {
                myDialog.hide()
                onClose()
            }
        })
    }

    // 弹窗每次显示的时候显示二维码
    useUpdateEffect(() => {
        if (visible) {
            getQrUrlEvent()
        } else {
            console.log('out')
        }
    }, [visible])

    // 倒计时开始
    useUpdateEffect(() => {
        if (0 < countDown && countDown <= defaultCountdown) {
            timer.current = setInterval(() => {
                // 开始调用轮询接口
                checkQr(qrKey).then(res => {
                    console.log('res', res)
                    //  轮询此接口可获取二维码扫码状态
                    //  800 为二维码过期,801 为等待扫码
                    //  802 为待确认
                    //  803 为授权登录成功(803 状态码下会返回 cookies),
                    if (res.code === 800) {
                        qrAgain()
                        clearInterval(timer.current as NodeJS.Timeout)
                    } else if(res.code === 803) {
                        clearInterval(timer.current as NodeJS.Timeout)
                        let pairs = res?.cookie.split(';')
                        let obj = _.fromPairs(pairs.map((pair: any) => pair.split('=')))
                        setToken(obj.MUSIC_U)
                        MessagePlugin.success('登录成功')
                        loginStatus().then(res => {
                            onSuccess(res.data.profile.userId)
                        })
                    }

                })
                setCountDown((num) => num - 1)
            }, 1000)
        } else {
            console.log('清除')
            clearInterval(timer.current as NodeJS.Timeout)
        }

    }, [countDown])

    // 组件卸载
    useEffect(() => {
        return () => {
            clearInterval(timer.current as NodeJS.Timeout)
        }
    })

    return (
        <Drawer
            destroyOnClose
            visible={visible}
            header='登录'
            placement={'bottom'}
            footer={false}
            onClose={() => {
                onClose()
            }}>
            <div className={Style.qrBox}>
                <img src={qrUrl} alt='' />
                <div>倒计时{ countDown }s</div>
                <div className={Style.tips}>Tips: 由于网易云的云盾验证, 暂时只支持网易云二维码扫码。</div>
            </div>
            {/*<Form statusIcon={true} onSubmit={onSubmit} colon={true} labelWidth={0}>*/}
            {/*    <FormItem name='phone'>*/}
            {/*        <Input clearable={true} prefixIcon={<UserIcon />} placeholder='请输入账户名' />*/}
            {/*    </FormItem>*/}
            {/*    <FormItem name='password'>*/}
            {/*        <Input*/}
            {/*            type='password'*/}
            {/*            prefixIcon={<LockOnIcon />}*/}
            {/*            clearable={true}*/}
            {/*            placeholder='请输入密码'*/}
            {/*        />*/}
            {/*    </FormItem>*/}
            {/*    <FormItem>*/}
            {/*        <Button theme='primary' type='submit' block>*/}
            {/*            登录*/}
            {/*        </Button>*/}
            {/*    </FormItem>*/}
            {/*</Form>*/}
        </Drawer>
    )
}

export default memo(LoginDrawer)
