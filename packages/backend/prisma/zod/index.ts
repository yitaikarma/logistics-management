import { z } from 'zod'
import type { Prisma } from '@prisma/client'

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable'])

export const RoleScalarFieldEnumSchema = z.enum(['id', 'key', 'name', 'createdAt', 'updatedAt'])

export const UserScalarFieldEnumSchema = z.enum(['id', 'email', 'username', 'phone', 'password', 'role', 'gender', 'nickname', 'avatar', 'createdAt', 'updatedAt'])

export const Login_LogScalarFieldEnumSchema = z.enum(['id', 'email', 'browser', 'ip', 'status', 'createdAt', 'updatedAt'])

export const System_LogScalarFieldEnumSchema = z.enum(['id', 'account', 'business_type', 'ip', 'method', 'module', 'createdAt', 'updatedAt'])

export const CommodityScalarFieldEnumSchema = z.enum(['id', 'name', 'price', 'total', 'description', 'createdAt', 'updatedAt'])

export const CompanyScalarFieldEnumSchema = z.enum(['id', 'name', 'phone', 'address', 'description', 'createdAt', 'updatedAt'])

export const EmployeeScalarFieldEnumSchema = z.enum(['id', 'name', 'gender', 'id_card', 'phone', 'address', 'description', 'department', 'createdAt', 'updatedAt'])

export const WarehouseScalarFieldEnumSchema = z.enum(['id', 'name', 'responsible', 'address', 'description', 'createdAt', 'updatedAt'])

export const SaleScalarFieldEnumSchema = z.enum(['id', 'commodity', 'company', 'count', 'price', 'total', 'account_number', 'phone', 'description', 'createdAt', 'updatedAt'])

export const SortOrderSchema = z.enum(['asc', 'desc'])

export const RoleOrderByRelevanceFieldEnumSchema = z.enum(['name'])

export const NullsOrderSchema = z.enum(['first', 'last'])

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['email', 'username', 'phone', 'password', 'nickname', 'avatar'])

export const Login_LogOrderByRelevanceFieldEnumSchema = z.enum(['email', 'ip'])

export const System_LogOrderByRelevanceFieldEnumSchema = z.enum(['account', 'business_type', 'ip', 'method', 'module'])

export const CommodityOrderByRelevanceFieldEnumSchema = z.enum(['name', 'description'])

export const CompanyOrderByRelevanceFieldEnumSchema = z.enum(['name', 'phone', 'address', 'description'])

export const EmployeeOrderByRelevanceFieldEnumSchema = z.enum(['name', 'id_card', 'phone', 'address', 'description'])

export const WarehouseOrderByRelevanceFieldEnumSchema = z.enum(['name', 'responsible', 'address', 'description'])

export const SaleOrderByRelevanceFieldEnumSchema = z.enum(['commodity', 'company', 'account_number', 'phone', 'description'])
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
    id: z.number().int(),
    key: z.number().int(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
    id: z.number().int(),
    email: z.string(),
    username: z.string(),
    phone: z.string().nullish(),
    password: z.string(),
    role: z.number().int(),
    gender: z.number().int(),
    nickname: z.string(),
    avatar: z.string().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// LOGIN LOG SCHEMA
/////////////////////////////////////////

export const Login_LogSchema = z.object({
    id: z.number().int(),
    email: z.string(),
    browser: z.number().int(),
    ip: z.string(),
    status: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Login_Log = z.infer<typeof Login_LogSchema>

/////////////////////////////////////////
// SYSTEM LOG SCHEMA
/////////////////////////////////////////

export const System_LogSchema = z.object({
    id: z.number().int(),
    account: z.string(),
    business_type: z.string(),
    ip: z.string(),
    method: z.string(),
    module: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type System_Log = z.infer<typeof System_LogSchema>

/////////////////////////////////////////
// COMMODITY SCHEMA
/////////////////////////////////////////

export const CommoditySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    price: z.number(),
    total: z.number().int(),
    description: z.string().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Commodity = z.infer<typeof CommoditySchema>

/////////////////////////////////////////
// COMPANY SCHEMA
/////////////////////////////////////////

export const CompanySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    phone: z.string().nullish(),
    address: z.string().nullish(),
    description: z.string().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Company = z.infer<typeof CompanySchema>

/////////////////////////////////////////
// EMPLOYEE SCHEMA
/////////////////////////////////////////

export const EmployeeSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    gender: z.number().int(),
    id_card: z.string(),
    phone: z.string().nullish(),
    address: z.string().nullish(),
    description: z.string().nullish(),
    department: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Employee = z.infer<typeof EmployeeSchema>

/////////////////////////////////////////
// WAREHOUSE SCHEMA
/////////////////////////////////////////

export const WarehouseSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    responsible: z.string().nullish(),
    address: z.string().nullish(),
    description: z.string().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Warehouse = z.infer<typeof WarehouseSchema>

/////////////////////////////////////////
// SALE SCHEMA
/////////////////////////////////////////

export const SaleSchema = z.object({
    id: z.number().int(),
    commodity: z.string(),
    company: z.string(),
    count: z.number().int(),
    price: z.number(),
    total: z.number(),
    account_number: z.string(),
    phone: z.string().nullish(),
    description: z.string().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Sale = z.infer<typeof SaleSchema>
