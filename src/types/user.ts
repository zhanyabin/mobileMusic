export interface IUserInfo {
    level: number
    listenSongs: number
    userPoint: UserPoint
    mobileSign: boolean
    pcSign: boolean
    profile: Profile
    peopleCanSeeMyPlayRecord: boolean
    bindings: Binding[]
    adValid: boolean
    code: number
    newUser: boolean
    recallUser: boolean
    createTime: number
    createDays: number
    profileVillageInfo: ProfileVillageInfo
}

export interface UserPoint {
    userId: number
    balance: number
    updateTime: number
    version: number
    status: number
    blockBalance: number
}

export interface Profile {
    privacyItemUnlimit: PrivacyItemUnlimit
    avatarDetail: any
    vipType: number
    mutual: boolean
    remarkName: any
    createTime: number
    userType: number
    avatarImgId: number
    birthday: number
    gender: number
    nickname: string
    accountStatus: number
    avatarUrl: string
    avatarImgIdStr: string
    backgroundImgIdStr: string
    followed: boolean
    authStatus: number
    detailDescription: string
    experts: Experts
    expertTags: any
    djStatus: number
    province: number
    city: number
    defaultAvatar: boolean
    backgroundImgId: number
    backgroundUrl: string
    description: string
    userId: number
    signature: string
    authority: number
    followeds: number
    follows: number
    blacklist: boolean
    eventCount: number
    allSubscribedCount: number
    playlistBeSubscribedCount: number
    avatarImgId_str: string
    followTime: any
    followMe: boolean
    artistIdentity: any[]
    cCount: number
    inBlacklist: boolean
    sDJPCount: number
    playlistCount: number
    sCount: number
    newFollows: number
}

export interface PrivacyItemUnlimit {
    area: boolean
    college: boolean
    gender: boolean
    age: boolean
    villageAge: boolean
}

export interface Experts {}

export interface Binding {
    expiresIn: number
    refreshTime: number
    bindingTime: number
    url: string
    tokenJsonStr: any
    expired: boolean
    userId: number
    id: number
    type: number
}

export interface ProfileVillageInfo {
    title: string
    imageUrl: any
    targetUrl: string
}
