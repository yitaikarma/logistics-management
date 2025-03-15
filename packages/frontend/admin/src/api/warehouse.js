import service from "../utils/request";

export function FindAllWarehouse(params) {
    return service({
        url: '/warehouses',
        method: 'get',
        params
    })
}

export function SaveWarehouse(data) {
    return service({
        url: '/warehouses',
        method: 'post',
        data
    })
}

export function DeleteWarehouseById(id) {
    return service({
        url: `/warehouses/${id}`,
        method: 'delete'
    })
}