import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { MenuThemeType, SystemThemeTypes } from '@/types/store'

// Element plus theme
export const ElementPlusTheme = {
  primary: '#5D87FF'
}

// 系统信息
export const SystemInfo = {
  // 系统名称
  name: 'Art Design Pro',
  // 登录默认帐号、密码
  login: {
    username: 'admin',
    password: '123456'
  }
}

// 系统主题样式（light | dark）
export const SystemThemeStyles: SystemThemeTypes = {
  [SystemThemeEnum.LIGHT]: {
    className: ''
  },
  [SystemThemeEnum.DARK]: {
    className: SystemThemeEnum.DARK
  }
}

// 设置中心主题列表
export const SettingThemeList = [
  {
    name: '浅色',
    theme: SystemThemeEnum.LIGHT,
    color: ['#fff', '#fff'],
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0'
  },
  {
    name: '深色',
    theme: SystemThemeEnum.DARK,
    color: ['#22252A'],
    leftLineColor: '#3F4257',
    rightLineColor: '#3F4257'
  },
  {
    name: '系统',
    theme: SystemThemeEnum.AUTO,
    color: ['#fff', '#22252A'],
    leftLineColor: '#EDEEF0',
    rightLineColor: '#3F4257'
  }
]

// 菜单样式
export const ThemeList: MenuThemeType[] = [
  {
    theme: MenuThemeEnum.DESIGN,
    background: '#FFFFFF',
    systemNameColor: 'var(--art-text-gray-800)',
    iconColor: '#6B6B6B',
    textColor: '#29343D',
    textActiveColor: '#3F8CFF',
    iconActiveColor: '#333333',
    tabBarBackground: '#FAFBFC',
    systemBackground: '#FAFBFC',
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0'
  },
  {
    theme: MenuThemeEnum.DARK,
    background: '#191A23',
    systemNameColor: '#BABBBD',
    iconColor: '#BABBBD',
    textColor: '#BABBBD',
    textActiveColor: '#FFFFFF',
    iconActiveColor: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#3F4257',
    rightLineColor: '#EDEEF0'
  },
  {
    theme: MenuThemeEnum.LIGHT,
    background: '#ffffff',
    systemNameColor: '#68758E',
    iconColor: '#6B6B6B',
    textColor: '#29343D',
    textActiveColor: '#3F8CFF',
    iconActiveColor: '#333333',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0'
  }
]

// dark 模式下 菜单样式
export const DarkMenuStyles: MenuThemeType[] = [
  {
    theme: MenuThemeEnum.DARK,
    background: '#161618',
    systemNameColor: '#DDDDDD',
    iconColor: '#BABBBD',
    textColor: 'rgba(#FFFFFF, 0.7)',
    textActiveColor: '',
    iconActiveColor: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#3F4257',
    rightLineColor: '#EDEEF0'
  }
]

// 系统主色
export const SystemMainColor = [
  '#5D87FF',
  '#B48DF3',
  '#1D84FF',
  '#60C041',
  '#38C0FC',
  '#F9901F',
  '#FF80C8'
]

// 系统设置中心配置
export const SystemSetting = {
  defaultMenuWidth: 252, // 菜单展开宽度默认值
  defaultCustomRadius: '0.75' // 圆角默认值
}
