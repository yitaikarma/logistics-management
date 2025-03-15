/*
 * @Author       : Karma
 * @Date         : 2025-03-13 21:26:04
 * @LastEditTime : 2025-03-13 21:30:08
 * @LastEditors  : Karma
 * @Description  :
 */

import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/zh-CN/zod.json'

// 设置国际化
i18next.init({
    lng: 'zh-CN',
    resources: {
        'zh-CN': { zod: translation },
    },
})
z.setErrorMap(zodI18nMap)

// 暴露zod实例
export { z }
