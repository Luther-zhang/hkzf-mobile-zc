import React from 'react'
import NavHeader from 'common/NavHeader'
import styles from './index.module.scss'
import { getCurrentCity, API, BASE_URL } from 'utils'
import { Toast } from 'antd-mobile'

const BMap = window.BMap

class Map extends React.Component {
  // componentDidMount() {
  //   // {lng: 121.61887341233741, lat: 31.040603951746952}
  //   // 创建地图实例
  //   const map = new BMap.Map('container')
  //   // 创建点坐标
  //   const point = new BMap.Point(121.61887341233741, 31.040603951746952)
  //   // 初始化地图，设置中心点坐标和地图级别
  //   map.centerAndZoom(point, 18)
  //   // 创建点标注
  //   const marker = new BMap.Marker(point)
  //   // 将标注添加到地图中
  //   map.addOverlay(marker)
  state = {
    isShow: false,
    houses: []
  }

  async renderOverlays(id) {
    Toast.loading('加载中...', 0)
    const { type, nextZoom } = this.getTypeAndZoom()
    const res = await API.get(`area/map?id=${id}`)
    // console.log(res.data.body)
    res.body.forEach(item => {
      this.addOverlay(item, type, nextZoom)
    })
    Toast.hide()
  }

  addOverlay(item, type, nextZoom) {
    // console.log('我负责添加覆盖物', item, type, nextZoom)
    if (type === 'circle') {
      this.createCircle(item, nextZoom)
    } else {
      this.createRect(item, nextZoom)
    }
  }

  createCircle(item, nextZoom) {
    const html = `
      <div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>
    `
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    // console.log(point)
    const options = {
      position: point,
      offset: new BMap.Size(-35, -35)
    }
    const label = new BMap.Label(html, options)

    label.setStyle({
      border: 'none',
      padding: 0
    })
    this.map.addOverlay(label)

    label.addEventListener('click', () => {
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      this.map.centerAndZoom(point, nextZoom)
      this.renderOverlays(item.value)
    })
  }

  async getHouses(id) {
    Toast.loading('加载中...', 0)
    const res = await API.get(`houses?cityId=${id}`)
    this.setState({
      isShow: true,
      houses: res.body.list
    })
    Toast.hide()
  }

  createRect(item) {
    const html = `
    <div class="rect">
      <span class="housename">${item.label}</span>
      <span class="housenum">${item.count} 套</span>
      <i class="arrow"></i>
    </div>
    `
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const options = {
      position: point,
      offset: new BMap.Size(-50, -20)
    }
    const label = new BMap.Label(html, options)

    label.setStyle({
      border: 'none',
      padding: 0
    })

    this.map.addOverlay(label)
    label.addEventListener('click', e => {
      this.getHouses(item.value)
      // console.log(e)
      const clientX = e.changedTouches[0].clientX
      const clientY = e.changedTouches[0].clientY
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330 - 45) / 2 - (clientY - 45)
      this.map.panBy(x, y)
    })
  }

  getTypeAndZoom() {
    let type, nextZoom
    const zoom = this.map.getZoom()
    if (zoom === 11) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom === 13) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
      nextZoom = 15
    }
    return {
      type,
      nextZoom
    }
  }

  async initMap() {
    const { label, value } = await getCurrentCity()
    const map = new BMap.Map('container')
    this.map = map

    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })

    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      async point => {
        if (!point) return
        // 地图居中并缩放
        map.centerAndZoom(point, 11)
        // 添加控件
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())

        this.renderOverlays(value)
      },
      label
    )
  }

  componentDidMount() {
    this.initMap()
  }

  renderHouses() {
    return this.state.houses.map(item => (
      <div className="house" key={item.houseCode}>
        <div className="imgWrap">
          <img
            className="img"
            src={`${BASE_URL}${item.houseImg}`}
            alt=""
          />
        </div>
        <div className="content">
          <h3 className="title">{item.title}</h3>
          <div className="desc">{item.desc}</div>
          <div>
            {item.tags.map((item, index) => {
              const num = (index % 3) + 1
              const name = `tag tag${num}`
              return (
                <span className={name} key={item}>
                  {item}
                </span>
              )
            })}
          </div>
          <div className="price">
            <span className="priceNum">{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        {/* div必须是全屏 */}
        <div id="container" />
        <div className={`houseList ${this.state.isShow ? 'show' : ''}`}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">{this.renderHouses()}</div>
        </div>
      </div>
    )
  }
}

export default Map
