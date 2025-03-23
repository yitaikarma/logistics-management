import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','email','phone','password','role','gender','nickname','avatar','address','desc','status','createdAt','updatedAt']);

export const RoleScalarFieldEnumSchema = z.enum(['id','name','value','desc','status','createdAt','updatedAt']);

export const Login_LogScalarFieldEnumSchema = z.enum(['id','email','browser','ip','status','createdAt','updatedAt']);

export const System_LogScalarFieldEnumSchema = z.enum(['id','account','business_type','ip','method','module','createdAt','updatedAt']);

export const CommodityScalarFieldEnumSchema = z.enum(['id','name','price','desc','status','createdAt','updatedAt','categoryId']);

export const CommodityCategoryScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt']);

export const WarehouseScalarFieldEnumSchema = z.enum(['id','name','province','city','district','address','desc','status','createdAt','updatedAt','userId','username','categoryId']);

export const WarehouseCategoryScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt']);

export const InventoryScalarFieldEnumSchema = z.enum(['id','total','desc','status','createdAt','updatedAt','commodityId']);

export const InventoryExtensionScalarFieldEnumSchema = z.enum(['id','total','desc','status','createdAt','updatedAt','warehouseId','inventoryId']);

export const InventoryRecordScalarFieldEnumSchema = z.enum(['id','type','total','desc','status','createdAt','updatedAt','warehouseId','commodityId']);

export const VehicleScalarFieldEnumSchema = z.enum(['id','name','license','desc','status','createdAt','updatedAt','userId','username','categoryId']);

export const VehicleCategoryScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt']);

export const EmployeeScalarFieldEnumSchema = z.enum(['id','name','gender','id_card','phone','address','desc','department','status','createdAt','updatedAt']);

export const OrderScalarFieldEnumSchema = z.enum(['id','fromProvince','fromCity','fromDistrict','fromAddress','toProvince','toCity','toDistrict','toAddress','receiver','phone','total','desc','status','createdAt','updatedAt','inventoryId','warehouseId','userId','categoryId']);

export const OrderCategoryScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt']);

export const TaskScalarFieldEnumSchema = z.enum(['id','name','desc','startTime','endTime','status','createdAt','updatedAt','userId','username','categoryId']);

export const TaskCategoryScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt']);

export const DistributionScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt','categoryId']);

export const DistributionCategoryScalarFieldEnumSchema = z.enum(['id','name','desc','status','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['username','email','phone','password','nickname','avatar','address','desc']);

export const RoleOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const Login_LogOrderByRelevanceFieldEnumSchema = z.enum(['email','ip']);

export const System_LogOrderByRelevanceFieldEnumSchema = z.enum(['account','business_type','ip','method','module']);

export const CommodityOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const CommodityCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const WarehouseOrderByRelevanceFieldEnumSchema = z.enum(['name','province','city','district','address','desc','username']);

export const WarehouseCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const InventoryOrderByRelevanceFieldEnumSchema = z.enum(['desc']);

export const InventoryExtensionOrderByRelevanceFieldEnumSchema = z.enum(['desc']);

export const InventoryRecordOrderByRelevanceFieldEnumSchema = z.enum(['desc']);

export const VehicleOrderByRelevanceFieldEnumSchema = z.enum(['name','license','desc','username']);

export const VehicleCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const EmployeeOrderByRelevanceFieldEnumSchema = z.enum(['name','id_card','phone','address','desc']);

export const OrderOrderByRelevanceFieldEnumSchema = z.enum(['fromProvince','fromCity','fromDistrict','fromAddress','toProvince','toCity','toDistrict','toAddress','receiver','phone','desc']);

export const OrderCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const TaskOrderByRelevanceFieldEnumSchema = z.enum(['name','desc','username']);

export const TaskCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const DistributionOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);

export const DistributionCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','desc']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  username: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  password: z.string().nullish(),
  role: z.number().int().nullish(),
  gender: z.number().int().nullish(),
  nickname: z.string().nullish(),
  avatar: z.string().nullish(),
  address: z.string().nullish(),
  desc: z.string().nullish(),
  status: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  value: z.number().int(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Role = z.infer<typeof RoleSchema>

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
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryId: z.number().int().nullish(),
})

export type Commodity = z.infer<typeof CommoditySchema>

/////////////////////////////////////////
// COMMODITY CATEGORY SCHEMA
/////////////////////////////////////////

export const CommodityCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CommodityCategory = z.infer<typeof CommodityCategorySchema>

/////////////////////////////////////////
// WAREHOUSE SCHEMA
/////////////////////////////////////////

export const WarehouseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  province: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string().nullish(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int().nullish(),
  username: z.string().nullish(),
  categoryId: z.number().int().nullish(),
})

export type Warehouse = z.infer<typeof WarehouseSchema>

/////////////////////////////////////////
// WAREHOUSE CATEGORY SCHEMA
/////////////////////////////////////////

export const WarehouseCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type WarehouseCategory = z.infer<typeof WarehouseCategorySchema>

/////////////////////////////////////////
// INVENTORY SCHEMA
/////////////////////////////////////////

export const InventorySchema = z.object({
  id: z.number().int(),
  total: z.number().int(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  commodityId: z.number().int().nullish(),
})

export type Inventory = z.infer<typeof InventorySchema>

/////////////////////////////////////////
// INVENTORY EXTENSION SCHEMA
/////////////////////////////////////////

export const InventoryExtensionSchema = z.object({
  id: z.number().int(),
  total: z.number().int(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  warehouseId: z.number().int().nullish(),
  inventoryId: z.number().int().nullish(),
})

export type InventoryExtension = z.infer<typeof InventoryExtensionSchema>

/////////////////////////////////////////
// INVENTORY RECORD SCHEMA
/////////////////////////////////////////

export const InventoryRecordSchema = z.object({
  id: z.number().int(),
  type: z.number().int(),
  total: z.number().int(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  warehouseId: z.number().int().nullish(),
  commodityId: z.number().int().nullish(),
})

export type InventoryRecord = z.infer<typeof InventoryRecordSchema>

/////////////////////////////////////////
// VEHICLE SCHEMA
/////////////////////////////////////////

export const VehicleSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  license: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int().nullish(),
  username: z.string().nullish(),
  categoryId: z.number().int().nullish(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

/////////////////////////////////////////
// VEHICLE CATEGORY SCHEMA
/////////////////////////////////////////

export const VehicleCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type VehicleCategory = z.infer<typeof VehicleCategorySchema>

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
  desc: z.string().nullish(),
  department: z.number().int(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Employee = z.infer<typeof EmployeeSchema>

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  id: z.number().int(),
  fromProvince: z.string().nullish(),
  fromCity: z.string().nullish(),
  fromDistrict: z.string().nullish(),
  fromAddress: z.string().nullish(),
  toProvince: z.string(),
  toCity: z.string(),
  toDistrict: z.string(),
  toAddress: z.string().nullish(),
  receiver: z.string(),
  phone: z.string(),
  total: z.number().int(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  inventoryId: z.number().int().nullish(),
  warehouseId: z.number().int().nullish(),
  userId: z.number().int().nullish(),
  categoryId: z.number().int().nullish(),
})

export type Order = z.infer<typeof OrderSchema>

/////////////////////////////////////////
// ORDER CATEGORY SCHEMA
/////////////////////////////////////////

export const OrderCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type OrderCategory = z.infer<typeof OrderCategorySchema>

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  startTime: z.date().nullish(),
  endTime: z.date().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int().nullish(),
  username: z.string().nullish(),
  categoryId: z.number().int().nullish(),
})

export type Task = z.infer<typeof TaskSchema>

/////////////////////////////////////////
// TASK CATEGORY SCHEMA
/////////////////////////////////////////

export const TaskCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TaskCategory = z.infer<typeof TaskCategorySchema>

/////////////////////////////////////////
// DISTRIBUTION SCHEMA
/////////////////////////////////////////

export const DistributionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryId: z.number().int().nullish(),
})

export type Distribution = z.infer<typeof DistributionSchema>

/////////////////////////////////////////
// DISTRIBUTION CATEGORY SCHEMA
/////////////////////////////////////////

export const DistributionCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  desc: z.string().nullish(),
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type DistributionCategory = z.infer<typeof DistributionCategorySchema>
