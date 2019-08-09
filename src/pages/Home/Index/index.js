import React from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import { getCurrentCity } from 'utils'
import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'
import styles from './index.module.scss'

const navList = [
  { title: '整租', img: Nav1, path: '/home/house' },
  { title: '合租', img: Nav2, path: '/home/house' },
  { title: '地图找房', img: Nav3, path: '/map' },
  { title: '去出租', img: Nav4, path: '/rent' }
]

class Index extends React.Component {
  state = {
    // 轮播图初始数据
    swipers: [],
    // 租房小组
    groups: [],
    // 资讯
    news: [],
    // 基于375的图片默认高度
    imgHeight: 212,
    isLoaded: false,
    cityName: '北京'
  }
  // 挂载钩子
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    // IP定位城市, 使用工具函数获取
    const city = await getCurrentCity()
    this.setState({
      cityName: city.label
    })
  }
  // 请求轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    // console.log(res)
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        swipers: body,
        isLoaded: true
      })
    }
  }
  // 请求租房小组数据
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        groups: body
      })
    }
  }
  // 请求资讯数据
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        news: body
      })
    }
  }
  // 渲染搜索框
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-form">
          <div
            className="location"
            onClick={() => this.props.history.push('/city')}
          >
            <span className="name">{this.state.cityName}</span>
            <i className="iconfont icon-arrow"> </i>
          </div>
          <div
            className="search-input"
            onClick={() => this.props.history.push('/search')}
          >
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        {/* 地图小图标 */}
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
  // 渲染轮播图
  renderSwiper() {
    // if (!this.state.isLoader) {
    //   return null
    // }
    return (
      this.state.isLoaded && (
        <Carousel autoplay infinite>
          {this.state.swipers.map(item => (
            <a
              key={item.id}
              href="null"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight
              }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                // 图片加载完成，会自动调整图片的高度
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      )
    )
  }
  // 渲染导航链接
  renderNav() {
    return (
      <div className="nav">
        <Flex>
          {navList.map(item => (
            <Flex.Item key={item.title}>
              <Link to={item.path}>
                <img src={item.img} alt="" />
                <p>{item.title}</p>
              </Link>
            </Flex.Item>
          ))}
        </Flex>
      </div>
    )
  }
  // 渲染租房小组
  renderGroups() {
    return (
      <div className="group-content">
        <Grid
          data={this.state.groups}
          activeStyle
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={item => (
            <Flex className="group-item" justify="around">
              <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </div>
    )
  }
  // 渲染资讯
  renderNews() {
    return (
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        {this.state.news.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))}
      </div>
    )
  }
  render() {
    return (
      <div className={styles.index}>
        <div className="swiper" style={{ height: this.state.imgHeight }}>
          {/* 搜索框 */}
          {this.renderSearch()}
          {/* 轮播图 */}
          {this.renderSwiper()}
        </div>
        {/* 导航链接 */}
        {this.renderNav()}
        {/* 租房小组 */}
        <div className="group">
          {/* 标题 */}
          <h3 className="group-title">
            租房小组
            <span className="more">更多</span>
          </h3>
          {/* 内容 */}
          {this.renderGroups()}
        </div>
        {/* 资讯 */}
        {this.renderNews()}
      </div>
    )
  }
}

export default Index
