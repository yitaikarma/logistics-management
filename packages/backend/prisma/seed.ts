/*
 * @Author       : Karma
 * @Date         : 2025-03-14 15:52:31
 * @LastEditTime : 2025-03-15 02:06:58
 * @LastEditors  : Karma
 * @Description  :
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const roles = [
        { key: 1, name: '用户' },
        { key: 10, name: '服务人员' },
        { key: 100, name: '管理员' },
    ]
    for (const role of roles) {
        await prisma.role.upsert({
            where: { key: role.key },
            update: role,
            create: role,
        })
    }
    
    const password = bcrypt.hashSync('123123', 10)
    await prisma.user.upsert({
        where: { email: `admin@test.dev` },
        update: {
            email: `admin@test.dev`,
            phone: `1888888888`,
            username: `admin`,
            nickname: `coko`,
            password: password,
            role: 100,
            gender: 1,
        },
        create: {
            email: `admin@test.dev`,
            phone: `1888888888`,
            username: `admin`,
            nickname: `coko`,
            password: password,
            role: 100,
            gender: 1,
        },
    })
    for (let i = 1; i <= 3; i++) {
        await prisma.user.upsert({
            where: { email: `admin@test.dev${i}` },
            update: {
                email: `admin@test.dev${i}`,
                phone: `1888888888${i}`,
                username: `admin${i}`,
                nickname: `coko${i}`,
                password: password,
                role: 100,
                gender: 1,
            },
            create: {
                email: `admin@test.dev${i}`,
                phone: `1888888888${i}`,
                username: `admin${i}`,
                nickname: `coko${i}`,
                password: password,
                role: 100,
                gender: 1,
            },
        })
    }
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
