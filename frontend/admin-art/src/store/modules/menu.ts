import { defineStore } from 'pinia'
import { MenuListType } from '@/types/menu'

interface MenuState {
  completeMenuList: MenuListType[]
  menuList: MenuListType[]
  menuWidth: string
}

export const useMenuStore = defineStore({
  id: 'menuStore',
  state: (): MenuState => ({
    completeMenuList: [],
    menuList: [],
    menuWidth: ''
  }),
  getters: {
    getCompleteMenuList(): MenuListType[] {
      return this.completeMenuList
    },
    getMenuList(): MenuListType[] {
      return this.menuList
    }
  },
  actions: {
    setCompleteMenuList(list: MenuListType[]) {
      this.completeMenuList = list
    },
    setMenuList(list: []) {
      this.menuList = list
    },
    setMenuWidth(width: string) {
      this.menuWidth = width
    }
  }
})
