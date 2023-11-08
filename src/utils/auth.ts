import Cookies from 'js-cookie'

const TokenKey = 'MUSIC_U'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token: any) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
