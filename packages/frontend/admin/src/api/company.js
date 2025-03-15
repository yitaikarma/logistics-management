import service from "../utils/request";

export function FindAllCompany(params) {
    return service({
        url: '/companies',
        method: 'get',
        params
    })
}

export function SearchCompany(params) {
    return service({
        url: '/companies/',
        method: 'get',
        params
    })
}

export function SaveCompany(data) {
    return service({
        url: '/companies',
        method: 'post',
        data
    })
}

export function DeleteCompanyById(id) {
    return service({
        url: `/companies/${id}`,
        method: 'delete'
    })
}