<template>
  <div class="table-bar">
    <div class="top-wrap" v-show="showSearchWrap">
      <slot name="top"> </slot>
      <!-- <div class="buttons">
        <el-button type="primary" @click="search" v-ripple>搜索</el-button>
        <el-button @click="reset" v-ripple>重置</el-button>
      </div> -->
    </div>
    <div class="bottom-wrap" v-if="showBottom">
      <div class="left-wrap">
        <slot name="bottom"></slot>
        <el-button-group>
          <el-button
            :type="showSearchWrap ? 'primary' : 'default'"
            :icon="Search"
            @click="isShowSearchWrap()"
            v-if="layout.indexOf('search') !== -1"
          />
          <el-button :icon="RefreshRight" @click="refresh()" v-if="layout.indexOf('refresh') !== -1" />

          <el-popover
            placement="bottom-end"
            width="100"
            trigger="hover"
            @show="showPopover"
            v-if="layout.indexOf('column') !== -1"
          >
            <el-checkbox-group v-model="colOptions" :min="1">
              <el-checkbox
                v-for="(item, index) in colSelect"
                :label="item.name"
                :value="item.show"
                :key="index"
                @change="changeColumn($event, index)"
              />
            </el-checkbox-group>
            <template #reference>
              <el-button :icon="Operation"></el-button>
            </template>
          </el-popover>
        </el-button-group>

        <div v-show="showSearchWrap" class="buttons">
          <el-button type="primary" @click="search" v-ripple>搜索</el-button>
          <el-button @click="reset" v-ripple>重置</el-button>
        </div>
        <div v-show="showDeleteBottom" class="buttons">
          <el-button type="danger" @click="deleteSelect" v-ripple>删除选中</el-button>
        </div>
      </div>
      <div v-if="0" class="right-wrap">
        <el-button-group>
          <el-button :icon="Search" @click="isShowSearchWrap()" v-if="layout.indexOf('search') !== -1" />
          <el-button :icon="RefreshRight" @click="refresh()" v-if="layout.indexOf('refresh') !== -1" />

          <el-popover
            placement="bottom-end"
            width="100"
            trigger="hover"
            @show="showPopover"
            v-if="layout.indexOf('column') !== -1"
          >
            <el-checkbox-group v-model="colOptions" :min="1">
              <el-checkbox
                v-for="(item, index) in colSelect"
                :label="item.name"
                :value="item.show"
                :key="index"
                @change="changeColumn($event, index)"
              />
            </el-checkbox-group>
            <template #reference>
              <el-button :icon="Operation"></el-button>
            </template>
          </el-popover>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { Search, RefreshRight, Operation } from '@element-plus/icons-vue'

  const emit = defineEmits(['search', 'reset', 'delete', 'changeColumn'])

  const props = defineProps({
    showTop: {
      type: Boolean,
      default: true
    },
    showBottom: {
      type: Boolean,
      default: true
    },
    showDeleteBottom: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    layout: {
      type: String,
      default: 'search, refresh, column'
    }
  })

  const settingStore = useSettingStore()
  const showSearchWrap = ref(true)
  const colOptions = ref([])
  const colSelect = ref<{ name: string; show: number | boolean }[]>([])
  const columnChange = ref(false)

  onMounted(() => {
    showSearchWrap.value = props.showTop
  })

  // 刷新页面
  const refresh = () => {
    settingStore.reload()
  }

  // 是否显示搜索区域
  const isShowSearchWrap = () => {
    showSearchWrap.value = !showSearchWrap.value
  }

  // 列显示隐藏
  const showPopover = () => {
    if (!columnChange.value) {
      let ops: any = []
      let options: any = []
      props.columns.map((item: any) => {
        ops.push({ name: item.name, value: item.show })
        options.push(item.name)
      })
      colOptions.value = options
      colSelect.value = ops
      columnChange.value = true
    }
  }

  // 选择列
  const changeColumn = (show: any, index: number) => {
    let columns = props.columns

    columns.map((item: any, i: number) => {
      if (index === i) {
        item.show = show
      }
    })

    emit('changeColumn', columns)
  }

  const search = () => {
    emit('search')
  }

  const reset = () => {
    emit('reset')
  }

  const deleteSelect = () => {
    emit('delete')
  }
</script>

<style lang="scss" scoped>
  .table-bar {
    padding: 0 0 20px;

    .top-wrap {
      position: relative;
      transition: height 0.3s;

      .buttons {
        position: absolute;
        right: 0;
        bottom: 20px;
      }
    }

    .bottom-wrap {
      display: flex;
      justify-content: space-between;

      > * {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }

  .el-button-group {
    display: flex;
  }

  @media screen and (max-width: $device-phone) {
    .table-bar {
      .top-wrap {
        padding-bottom: 60px;
      }
    }

    .el-form {
      padding-bottom: 15px;
    }
  }
</style>
