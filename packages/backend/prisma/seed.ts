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
    await prisma.role.createMany({ data: roles })
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
        address: '拉尼亚凯亚超星系团室女座超星系团银河系太阳系地球',
        desc: '你归我管！',
        gender: 1,
        status: 2,
    }
    await prisma.user.upsert({
        where: { username: `admin` },
        update: user,
        create: user,
    })

    const user2 = (i: number): Prisma.UserCreateInput => ({
        email: `admin${i}@test.dev`,
        phone: `1231231230${i}`,
        username: `不明所以柴可夫斯基${i}`,
        nickname: `coko${i}`,
        password: password,
        role: 100,
        address: '拉尼亚凯亚超星系团室女座超星系团银河系太阳系地球',
        desc: '这里是正在反转的小陀螺',
        status: 2,
    })

    for (let i = 1; i <= 5; i++) {
        await prisma.user.upsert({
            where: { username: `admin${i}` },
            update: user2(i),
            create: user2(i),
        })
    }
}

async function commodity() {
    const data: Prisma.CommodityCategoryCreateManyInput[] = [
        { name: '数码产品', desc: '数码产品', status: 1 },
        { name: '家具', desc: '家具', status: 1 },
        { name: '食品', desc: '食品', status: 1 },
        { name: '服装', desc: '服装', status: 1 },
        { name: '日用品', desc: '日用品', status: 1 },
        { name: '其他', desc: '其他', status: 1 },
    ]

    await prisma.commodityCategory.createMany({ data })

    const data2: Prisma.CommodityCreateManyInput[] = [
        { name: 'A100', desc: 'A100', status: 1, categoryId: 1 },
        { name: 'H100', desc: 'A200', status: 1, categoryId: 1 },
        { name: 'H200', desc: 'H200', status: 1, categoryId: 1 },
        { name: '小陀螺', desc: '小陀螺', status: 1, categoryId: 6 },
    ]

    await prisma.commodity.createMany({ data: data2 })
}

async function warehouse() {
    const data: Prisma.WarehouseCategoryCreateInput[] = [
        { name: '小型仓库', desc: '小型仓库', status: 1 },
        { name: '中型仓库', desc: '中型仓库', status: 1 },
        { name: '大型仓库', desc: '大型仓库', status: 1 },
        { name: '超大型仓库', desc: '超大型仓库', status: 1 },
    ]

    await prisma.warehouseCategory.createMany({ data })

    const data2: Prisma.WarehouseCreateManyInput[] = [
        { name: 'A仓库', desc: 'A仓库', province: '广东省', city: '广州市', district: '天河区', address: '天河区', status: 1, categoryId: 1, userId: 1 },
        { name: 'B仓库', desc: 'B仓库', province: '广东省', city: '广州市', district: '天河区', address: '天河区', status: 1, categoryId: 1, userId: 1 },
        { name: 'C仓库', desc: 'C仓库', province: '广东省', city: '广州市', district: '天河区', address: '天河区', status: 1, categoryId: 1, userId: 1 },
        { name: 'D仓库', desc: 'D仓库', province: '广东省', city: '广州市', district: '天河区', address: '天河区', status: 1, categoryId: 1, userId: 1 },
    ]

    await prisma.warehouse.createMany({ data: data2 })
}

async function vehicle() {
    const data: Prisma.VehicleCategoryCreateInput[] = [
        { name: '小型车辆', desc: '小型车辆', status: 1 },
        { name: '中型车辆', desc: '中型车辆', status: 1 },
        { name: '大型车辆', desc: '大型车辆', status: 1 },
        { name: '超大型车辆', desc: '超大型车辆', status: 1 },
    ]

    await prisma.vehicleCategory.createMany({ data })

    const data2: Prisma.VehicleCreateManyInput[] = [
        { name: 'A车辆', desc: 'A车辆', license: '粤A12345', status: 1, categoryId: 1, userId: 1 },
        { name: 'B车辆', desc: 'B车辆', license: '粤A12346', status: 1, categoryId: 2, userId: 1 },
        { name: 'C车辆', desc: 'C车辆', license: '粤A12347', status: 1, categoryId: 3, userId: 1 },
        { name: 'D车辆', desc: 'D车辆', license: '粤A12348', status: 1, categoryId: 4, userId: 1 },
    ]

    await prisma.vehicle.createMany({ data: data2 })
}

async function order() {
    const data: Prisma.OrderCategoryCreateInput[] = [
        { name: '急件', desc: '急件', status: 1 },
        { name: '普通件', desc: '普通件', status: 1 },
    ]

    await prisma.orderCategory.createMany({ data })
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
