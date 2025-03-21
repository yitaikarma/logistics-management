import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function role() {
    const roles: Prisma.RoleCreateInput[] = [
        { name: '管理员', value: 100, desc: '拥有所有权限', status: 1 },
        { name: '服务人员', value: 10, desc: '拥有部分权限', status: 1 },
        { name: '客户', value: 0, desc: '普通客户', status: 1 },
        { name: '用户', value: 0, desc: '其他用户', status: 1 },
    ]
    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: role,
            create: role,
        })
    }
}

async function user() {
    const password = bcrypt.hashSync('123123', 10)
    const user: Prisma.UserCreateInput = {
        email: `admin@test.dev`,
        phone: `12312312300`,
        username: `admin`,
        nickname: `coko`,
        password: password,
        role: 100,
        address: '室女座超星系团银河系太阳系地球',
        desc: '这是一个超级管理员',
        gender: 1,
        status: 2,
    }
    await prisma.user.upsert({
        where: { username: `admin` },
        update: user,
        create: user,
    })

    const user2 = (i: number): Prisma.UserCreateInput => ({
        email: `admin@test${i}.dev`,
        phone: `1231231230${i}`,
        username: `admin${i}`,
        nickname: `coko${i}`,
        password: password,
        role: 100,
        address: '室女座超星系团银河系太阳系地球',
        desc: '这是一个超级管理员',
        status: 2,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.user.upsert({
            where: { username: `admin${i}` },
            update: user2(i),
            create: user2(i),
        })
    }
}

async function commodity() {
    const data = (i: number): Prisma.CommodityCategoryCreateInput => ({
        name: `商品分类${i}`,
        desc: `这是一个商品分类${i}`,
        status: 1,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.commodityCategory.upsert({
            where: { name: `商品分类${i}` },
            update: data(i),
            create: data(i),
        })
    }
}

async function warehouse() {
    const data = (i: number): Prisma.WarehouseCategoryCreateInput => ({
        name: `仓库分类${i}`,
        desc: `这是一个仓库分类${i}`,
        status: 1,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.warehouseCategory.upsert({
            where: { name: `仓库分类${i}` },
            update: data(i),
            create: data(i),
        })
    }
}

async function vehicle() {
    const data = (i: number): Prisma.VehicleCategoryCreateInput => ({
        name: `车辆分类${i}`,
        desc: `这是一个车辆分类${i}`,
        status: 1,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.vehicleCategory.upsert({
            where: { name: `车辆分类${i}` },
            update: data(i),
            create: data(i),
        })
    }
}

async function order() {
    const data = (i: number): Prisma.OrderCategoryCreateInput => ({
        name: `订单分类${i}`,
        desc: `这是一个订单分类${i}`,
        status: 1,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.orderCategory.upsert({
            where: { name: `订单分类${i}` },
            update: data(i),
            create: data(i),
        })
    }
}

async function task() {
    const data = (i: number): Prisma.TaskCategoryCreateInput => ({
        name: `任务分类${i}`,
        desc: `这是一个任务分类${i}`,
        status: 1,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.taskCategory.upsert({
            where: { name: `任务分类${i}` },
            update: data(i),
            create: data(i),
        })
    }
}

async function distribution() {
    const data = (i: number): Prisma.DistributionCategoryCreateInput => ({
        name: `配送分类${i}`,
        desc: `这是一个配送分类${i}`,
        status: 1,
    })

    for (let i = 1; i <= 20; i++) {
        await prisma.distributionCategory.upsert({
            where: { name: `配送分类${i}` },
            update: data(i),
            create: data(i),
        })
    }
}

async function main() {
    await role()
    await user()
    await commodity()
    await warehouse()
    await vehicle()
    await order()
    await task()
    await distribution()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
