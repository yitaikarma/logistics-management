import service from "../utils/request";

export function FindAllEmployee(params) {
    return service({
        url: '/employees',
        method: 'get',
        params
    })
}

export function SaveEmployee(data) {
    return service({
        url: '/employees',
        method: 'post',
        data
    })
}

export function DeleteEmployeeById(id) {
    return service({
        url: `/employees/${id}`,
        method: 'delete'
    })
}