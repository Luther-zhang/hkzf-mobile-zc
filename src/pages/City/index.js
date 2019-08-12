import React from 'react'
import { Toast } from 'antd-mobile'
import { getCurrentCity, setCity, API } from 'utils'
import { List, AutoSizer } from 'react-virtualized'
import styles from './index.module.scss'
import NavHeader from 'common/NavHeader'
const TITLE_HEIGHT = 36
const CITY_HEIGHT = 50
// 有房源的城市
const CITYS = ['北京', '上海', '广州', '深圳']

class City extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shortList: [],
      cityObj: {},
      currentIndex: 0
    }
    // 获取dom
    this.listRef = React.createRef()
  }
  async componentDidMount() {
    await this.getCityList()
    // List的方法，预测量所有行的高度
    this.listRef.current.measureAllRows()
  }
  // 城市数据格式调整
  forMatData(list) {
    const cityObj = {}
    // 遍历城市列表
    list.forEach(item => {
      // 拿到首字母
      const key = item.short.slice(0, 1)
      if (key in cityObj) {
        // 如果新对象中有 "首字母" 的这个属性，对属性存入城市对象
        cityObj[key].push(item)
      } else {
        // 如果没有，使属性成为数组，并存入城市对象，使属性成为 对象数组
        cityObj[key] = [item]
      }
    })
    // 拿到cityObj的所有属性（即首字母），存到数组中
    const shortList = Object.keys(cityObj).sort()
    return { cityObj, shortList }
  }

  async getCityList() {
    const res = await API.get('area/city?level=1')
    const { body } = res
    const { cityObj, shortList } = this.forMatData(body)
    // 添加热门城市
    const hotRes = await API.get('area/hot')
    shortList.unshift('hot')
    cityObj.hot = hotRes.body
    // 添加当前城市
    const city = await getCurrentCity()
    shortList.unshift('#')
    cityObj['#'] = [city]

    this.setState({
      shortList,
      cityObj
    })
  }
  // 标题格式匹配
  formatTitle(title) {
    if (title === '#') {
      return '当前城市'
    } else if (title === 'hot') {
      return '热门城市'
    } else {
      return title.toUpperCase()
    }
  }
  // 城市名称的点击事件，有房源的存储并返回上一层，没有的弹出提示框
  selectCity(city) {
    if (CITYS.includes(city.label)) {
      setCity(city)
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源信息', 1, null, false)
    }
  }

  // 计算动态行高
  caclHeight({ index }) {
    const letter = this.state.shortList[index]
    const list = this.state.cityObj[letter]
    return TITLE_HEIGHT + list.length * CITY_HEIGHT
  }
  // 索引的点击事件，通过索引号让对应的行置顶
  scrollToRow(index) {
    this.listRef.current.scrollToRow(index)
  }
  // 渲染每一行
  rowRenderer({
    key, // 唯一的key值
    index, // 每一行的索引号
    // isScrolling, // 是否在滚动中
    // isVisible,   // 是否可见
    style // 样式对象
  }) {
    // 根据下标获得首字母
    const letter = this.state.shortList[index]
    // 根据首字母获得城市列表
    const list = this.state.cityObj[letter]
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatTitle(letter)}</div>
        {list.map(item => (
          <div
            key={item.value}
            className="name"
            onClick={this.selectCity.bind(this, item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 渲染右侧列表
  renderRightMenu() {
    return (
      <ul className="city-index">
        {this.state.shortList.map((item, index) => (
          <li
            key={item}
            className="city-index-item"
            onClick={this.scrollToRow.bind(this, index)}
          >
            <span
              className={
                index === this.state.currentIndex ? 'index-active' : ''
              }
            >
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    )
  }
  // 判断下标，第几行为当前显示
  onRowsRendered({ startIndex }) {
    if (startIndex === this.state.currentIndex) return
    this.setState({
      currentIndex: startIndex
    })
  }

  render() {
    return (
      /* 
        css module 中，对于驼峰命名，正常使用.语法，
        对于非正常的的命名，如 nav-bar,可以使用[]语法 
      */
      <div className={styles.city}>
        {/* 头部导航栏组件 */}
        <NavHeader>城市列表</NavHeader>
        {/* 长列表 渲染城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={this.state.shortList.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        {/* 右侧列表 */}
        {this.renderRightMenu()}
      </div>
    )
  }
}

export default City
