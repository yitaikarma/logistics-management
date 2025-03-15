import request from "axios"
import { message } from 'ant-design-vue'
import router from '../router/index'

// 创建axios实例
var service = request.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 50000
});

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
service.interceptors.request.use(config => {
    console.log("执行config")
    let token = localStorage.getItem("token");
    if (token != null) {
        const bearerToken = `Bearer ${token}`
        config.headers['Authorization'] = bearerToken;  // 设置请求头
    }
    return config
}, error => {
    return Promise.reject(error)
});


service.interceptors.response.use(
    response => {
        const res = response.data;
        //判断response状态
        if (!res.success) message.error('请求错误: ' + res.msg)
        if (res.code === 403) router.push("/403")
        return res
    },
    error => {
        message.error(error)
        router.push('/500')
        return Promise.reject(error)
    }
);
console.log("执行request.js2");

export default service