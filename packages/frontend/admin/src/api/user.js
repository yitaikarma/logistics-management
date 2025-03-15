import service from "../utils/request";

export function FindAllAdmin(params) {
    return service({
        url: '/users',
        method: 'get',
        params
    })
}

export function SaveAdmin(data) {
    return service({
        url: '/users',
        method: 'post',
        data
    })
}

export function AdminSendEmail(email) {
    return service({
        url: `/users/sendEmail?email=${email}`,
        method: 'get'
    })
}

export function DeleteAdmin(id) {
    return service({
        url: '/users?id=' + id,
        method: 'delete',
    })
}

