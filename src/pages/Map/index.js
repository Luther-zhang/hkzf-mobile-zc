import React from 'react'
import './index.scss'

const BMap = window.BMap

class Map extends React.Component {
  componentDidMount() {
    // {lng: 121.61887341233741, lat: 31.040603951746952}
    // 创建地图实例
    const map = new BMap.Map('container')
    // 创建点坐标
    const point = new BMap.Point(121.61887341233741, 31.040603951746952)
    // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(point, 18)
    // 创建点标注
    const marker = new BMap.Marker(point)
    // 将标注添加到地图中
    map.addOverlay(marker)
  }

  render() {
    return (
      <div className="map">
        {/* div必须是全屏 */}
        <div id="container" />
      </div>
    )
  }
}

export default Map
