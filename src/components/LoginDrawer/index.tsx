import React, { memo, useRef, useState, useEffect } from 'react'
import { Drawer, Form, Input, Button, MessagePlugin, SubmitContext, DialogPlugin } from 'tdesign-react'
import { UserIcon, LockOnIcon } from 'tdesign-icons-react'
import { login, getQrKey, createQrUrl, checkQr, loginStatus, captchaSent, captchaVerify, verifyGetQr } from 'api/Login'
import { useUpdateEffect, useRequest, useCountDown } from 'ahooks'
import Style from './index.module.less'
import { setToken } from 'utils/auth'
import _ from 'lodash'
import TabsList from 'components/TabsList/index'

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
    const [tabActive, setTabActive] = useState(0)
    const timer = useRef<number | NodeJS.Timeout | null>(null)
    const [form] = Form.useForm()
    const [verifyImg, setVerifyImg] = useState('')
    // 验证码发送的倒计时
    const [targetDate, setTargetDate] = useState<number>()

    const [countdown] = useCountDown({
        targetDate,
        onEnd: () => {
        },
    });

    // 验证接口二维码查询

    // 发送验证码
    const onSendCaptcha = async () => {
        const phone = form.getFieldValue('phone')
        if (phone && (phone as string).length === 11) {
            setTargetDate(Date.now() + 60000);
            await captchaSent(phone as string)
        } else {
            await MessagePlugin.error('请输入11位手机号')
        }
    }

    // 验证码登录
    const onCodeSubmit = async ({ validateResult, fields }: SubmitContext) => {
        console.log('fields', fields)
        if (validateResult === true) {
            const verifyStatus =  await captchaVerify(fields)
            if (verifyStatus.code !== 200) {
                return
            }
            const loginData = await login(fields)
            if (loginData.code === 200) {
                await MessagePlugin.success('登录成功')
                onSuccess(loginData?.account?.id)
            }
        }
    }

    // 账号密码登录
    const onSubmit = async ({ validateResult, fields }: SubmitContext) => {
        if (validateResult === true) {
            const loginData = await login(fields)
            console.log('loginData', loginData)

            if (loginData.code === 200) {
                await MessagePlugin.success('登录成功')
                onSuccess(loginData?.account?.id)
            } else if (loginData.code === -462) {
                let params = {
                    vid: loginData.data.verifyId,
                    type: loginData.data.verifyType,
                    token: loginData.data.verifyToken,
                    evid:loginData.data.params.event_id,
                    sign:loginData.data.params.sign,
                }
                const verifyStatus = await verifyGetQr(params)

                // useRequest(() => {
                //     console.log('11111')
                // }, {pollingInterval: 1000, pollingWhenHidden:false})
                console.log('verifyStatus', verifyStatus)
            }
        }
    }

    const getQrUrlEvent = async () => {
        const keyData = await getQrKey()
        const key = keyData?.data?.unikey
        const qrUrl =  await createQrUrl(key)
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

    // 登录方式切换
    const tabsListChange = (index: number) => {
        console.log('index', index)
        setTabActive(index)
        setCountDown(0)
    }

    // 根据tab来动态判断
    let tabElement;
    let o: any = {
        0: <div className={Style.qrBox}>
            <img src={qrUrl} alt='' />
            <div>倒计时{ countDown }s</div>
            <div className={Style.tips}>请打开网易云App扫码登录</div>
        </div>,
        1: <Form form={form} statusIcon={true} onSubmit={onCodeSubmit} colon={true} labelWidth={0}>
            <FormItem name='phone'>
                <Input clearable={true} prefixIcon={<UserIcon />} placeholder='请输入手机号' />
            </FormItem>
            <FormItem name='captcha'>
                <Input
                    type='text'
                    prefixIcon={<LockOnIcon />}
                    clearable={true}
                    placeholder='请输入验证码'
                />
                <Button theme='primary' className={Style.captchaButton} disabled={countdown !== 0} onClick={onSendCaptcha}>
                    {countdown === 0 ? '发送验证码' : `${Math.round(countdown / 1000)}s`}
                </Button>
            </FormItem>
            <FormItem>
                <Button theme='primary' type='submit' block>
                    登录
                </Button>
            </FormItem>
        </Form>,
        2: <Form statusIcon={true} onSubmit={onSubmit} colon={true} labelWidth={0}>
            <FormItem name='phone'>
                <Input clearable={true} prefixIcon={<UserIcon />} placeholder='请输入账户名' />
            </FormItem>
            <FormItem name='password'>
                <Input
                    type='password'
                    prefixIcon={<LockOnIcon />}
                    clearable={true}
                    placeholder='请输入密码'
                />
            </FormItem>
            <FormItem>
                <Button theme='primary' type='submit' block>
                    登录
                </Button>
            </FormItem>
        </Form>,
    }
    tabElement = o[tabActive]

    // 弹窗每次显示的时候显示二维码
    useUpdateEffect(() => {
        if (visible && tabActive === 0) {
            getQrUrlEvent()
        } else {
            // setTabActive(0)
            console.log('out', visible)
            !visible ? setTabActive(0) : ''
        }
        form.reset()
    }, [visible, tabActive])

    // 倒计时开始
    useUpdateEffect(() => {
        if (0 < countDown && countDown <= defaultCountdown && tabActive === 0) {
            timer.current = setInterval(() => {
                // 开始调用轮询接口
                checkQr(qrKey).then(res => {
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
            clearInterval(timer.current as NodeJS.Timeout)
            setCountDown(0)
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
            size={'50%'}
            placement={'bottom'}
            footer={false}
            onClose={() => {
                onClose()
            }}>
            <TabsList changeEvent={tabsListChange} list={['扫码登录', '验证码登录', '账户密码登录']} />
            { tabElement }
            {/*<div className={Style.qrBox}>*/}
            {/*    <img src={qrUrl} alt='' />*/}
            {/*    <div>倒计时{ countDown }s</div>*/}
            {/*    <div className={Style.tips}>Tips: 由于网易云的云盾验证, 暂时只支持网易云二维码扫码。</div>*/}
            {/*</div>*/}
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
