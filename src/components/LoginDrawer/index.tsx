import React, { memo } from 'react'
import { Drawer, Form, Input, Button, MessagePlugin, SubmitContext } from 'tdesign-react'
import { UserIcon, LockOnIcon } from 'tdesign-icons-react'
import { login } from 'api/Login'
import Style from './index.module.less'

interface Interface {
    // 控制弹窗关闭/开启
    visible: boolean
    // 弹窗关闭触发回调
    onClose: Function
    // 登录成功触发
    onSuccess: Function
}

const { FormItem } = Form

const LoginDrawer = (props: Interface) => {
    const { visible, onClose, onSuccess } = props

    const onSubmit = async ({ validateResult, fields }: SubmitContext) => {
        console.log('fields', fields)
        if (validateResult === true) {
            const loginData = await login(fields)
            if (loginData.code === 200) {
                await MessagePlugin.success('提交成功')
                onSuccess()
            }
        }
    }

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
            <Form statusIcon={true} onSubmit={onSubmit} colon={true} labelWidth={0}>
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
            </Form>
        </Drawer>
    )
}

export default memo(LoginDrawer)
