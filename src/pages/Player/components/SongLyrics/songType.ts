export interface ISong {
    name: string
    id: number
    pst: number
    t: number
    ar: Ar[]
    alia: any[]
    pop: number
    st: number
    rt: any
    fee: number
    v: number
    crbt: any
    cf: string
    al: Al
    dt: number
    h: H
    m: M
    l: L
    sq: Sq
    hr: any
    a: any
    cd: string
    no: number
    rtUrl: any
    ftype: number
    rtUrls: any[]
    djId: number
    copyright: number
    s_id: number
    mark: number
    originCoverType: number
    originSongSimpleData: any
    tagPicList: any
    resourceState: boolean
    version: number
    songJumpInfo: any
    entertainmentTags: any
    awardTags: any
    single: number
    noCopyrightRcmd: any
    rtype: number
    rurl: any
    mst: number
    cp: number
    mv: number
    publishTime: number
}

export interface Ar {
    id: number
    name: string
    tns: any[]
    alias: any[]
}

export interface Al {
    id: number
    name: string
    picUrl: string
    tns: any[]
    pic_str: string
    pic: number
}

export interface H {
    br: number
    fid: number
    size: number
    vd: number
    sr: number
}

export interface M {
    br: number
    fid: number
    size: number
    vd: number
    sr: number
}

export interface L {
    br: number
    fid: number
    size: number
    vd: number
    sr: number
}

export interface Sq {
    br: number
    fid: number
    size: number
    vd: number
    sr: number
}

export interface ILyric {
    sgc: boolean
    sfy: boolean
    qfy: boolean
    lrc: Lrc
    klyric: Klyric
    tlyric: Tlyric
    romalrc: Romalrc
    code: number
}

export interface Lrc {
    version: number
    lyric: string
}

export interface Klyric {
    version: number
    lyric: string
}

export interface Tlyric {
    version: number
    lyric: string
}

export interface Romalrc {
    version: number
    lyric: string
}

