/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:15:32
 * @LastEditTime : 2025-03-12 16:39:05
 * @LastEditors  : Karma
 * @Description  : 
 */
import { PrismaClient } from '@prisma/client';

// 实例化一次 PrismaClient 并重用它，避免创建多个连接
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error']
});

export default prisma;
