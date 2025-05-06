<template>
  <div>
    <div id="container" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts">
  import AMapLoader from '@amap/amap-jsapi-loader'
  import '@amap/amap-jsapi-types'

  type Location = {
    lat: number
    lng: number
  }

  const props = defineProps<{
    start: string
    end: string
  }>()

  const isMounted = ref(false)
  const initLoaded = ref(false)
  let AMap: any = null
  let mapInstance: any = null
  let drivingInstance: any = null

  watch(
    () => [props.start, props.end],
    ([newStart, newEnd]) => {
      if (AMap && isMounted.value) {
        drawDrivingRoute(newStart, newEnd)
      }
    }
  )

  watch(
    () => initLoaded.value,
    () => {
      if (AMap && isMounted.value) {
        if (!mapInstance) initMap()
        drawDrivingRoute(props.start, props.end)
      }
    }
  )

  initAMapLoader()

  onMounted(() => {
    isMounted.value = true
  })

  /** 获取2个地点距离 */
  async function getCoordinates(address: string) {
    const apiKey = '4321fd5bbd6c20b5784b377897f67ee8'
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${apiKey}&address=${encodeURIComponent(address)}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log('data', data)

      if (data.status === '1' && data.geocodes.length > 0) {
        const [lng, lat] = data.geocodes[0].location.split(',')
        console.log('经纬度:', lat, lng)

        return { lat: parseFloat(lat), lng: parseFloat(lng) }
      }
      return null
    } catch (error) {
      console.error('地理编码失败:', error)
      return null
    }
  }

  function initAMapLoader() {
    window._AMapSecurityConfig = {
      securityJsCode: '0e9188e74b7bca231d0a885b1f90473b'
    }
    AMapLoader.load({
      key: '8b51d22d758d0aa083e5143734fc747a', //申请好的 Web 端开发者 Key，首次调用 load 时必填
      version: '2.0', //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      plugins: [] //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
    })
      .then((_AMap) => {
        AMap = _AMap
        initLoaded.value = true
        console.log('高德地图加载成功')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function initMap() {
    //基本地图加载
    mapInstance = new AMap.Map('container', {
      mapStyle: 'amap://styles/blue',
      theme: 'dark',
      zoom: 10 //地图显示的缩放级别
    })
  }

  // 清除现有路线
  function clearDrivingRoute() {
    if (drivingInstance) {
      drivingInstance.clear()
    }
  }

  // 加载路线，增加了对现有路线的清除
  function loadDrivingRoute(start: Location | null, end: Location | null) {
    // 清除已有路线
    clearDrivingRoute()

    AMap.plugin('AMap.Driving', () => {
      // 创建新的驾车规划实例
      drivingInstance = new AMap.Driving({
        map: mapInstance,
        showTraffic: false
      })

      if (!start || !end) {
        console.error('起点或终点坐标无效')
        return
      }

      drivingInstance.search([start.lng, start.lat], [end.lng, end.lat], (status, result) => {
        if (status === 'complete') {
          console.log('驾车路线规划完成', result)
        } else {
          console.error('驾车路线规划失败', result)
        }
      })
    })
  }

  // 添加绘制新路线的函数
  async function drawDrivingRoute(newStart: string, newEnd: string) {
    const startCoords = await getCoordinates(newStart)
    const endCoords = await getCoordinates(newEnd)
    loadDrivingRoute(startCoords, endCoords)
  }

  defineExpose({
    clearDrivingRoute,
    drawDrivingRoute
  })
</script>

<style lang="scss" scoped></style>
