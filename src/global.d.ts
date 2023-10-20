declare module '*.avif' {
    export default src as string
}

declare module '*.bmp' {
    export default src as string
}

declare module '*.gif' {
    export default src as string
}

declare module '*.jpg' {
    export default src as string
}

declare module '*.jpeg' {
    export default src as string
}

declare module '*.png' {
    export default src as string
}

declare module '*.webp' {
    export default src as string
}

declare module '*.svg' {
    export default src as string
}
declare module '*.svg?component' {
    export default src as string
}
declare module '*.module.css' {
    export default classes as { readonly [key: string]: string }
}

declare module '*.module.less' {
    export default classes as { readonly [key: string]: string }
}

declare module '*.less' {
    export default classes as { readonly [key: string]: string }
}

declare module 'tvision-color'

declare module 'react-inlinesvg'

declare module 'colorthief' {
    export type RGBColor = [number, number, number];
    export default class ColorThief {
        getColor: (img: HTMLImageElement | null, quality: number=10) => RGBColor;
        getPalette: (img: HTMLImageElement | null, colorCount: number=10, quality: number=10) => RGBColor[];
    }
}

declare interface ImportMeta {
    env: {
        MODE: 'development' | 'test' | 'release' | 'mock' | 'site'
    }
}
