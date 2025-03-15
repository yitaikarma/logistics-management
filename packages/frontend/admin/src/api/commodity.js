import service from "../utils/request";

export function FindAllCommodity(params) {
    return service({
        url: '/commodities',
        method: 'get',
        params
    })
}

export function SaveCommodity(data) {
    return service({
        url: '/commodities',
        method: 'post',
        data
    })
}

export function DeleteCommodityById(id) {
    return service({
        url: `/commodities/${id}`,
        method: 'delete'
    })
}