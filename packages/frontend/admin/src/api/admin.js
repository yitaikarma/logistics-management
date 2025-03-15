/*
 * @Author       : Karma
 * @Date         : 2025-03-14 23:53:57
 * @LastEditTime : 2025-03-14 23:58:35
 * @LastEditors  : Karma
 * @Description  : 
 */
import service from "../utils/request";

export function IsInit() {
    return service({
        url: '/admin/hasInit',
        method: 'get',
    })
}

export function Init(data) {
    return service({
        url: '/admin/init',
        method: 'post',
        data: data
    })
}

//管理员登陆
export function AdminLogin(data) {
    return service({
        url: '/auth/login',
        method: 'post',
        data: data
    })
}