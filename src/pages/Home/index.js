import React from 'react'
import { Route } from 'react-router-dom'
import Index from './Index/index.js'
import House from './House'
import News from './News'
import My from './My'
import styles from './index.module.scss'
// 导入TabBar组件
import { TabBar } from 'antd-mobile'

const itemList = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/house' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/my' }
]

// function inject_unount(target) {
//   // 改装componentWillUnmount，销毁的时候记录一下
//   let next = target.prototype.componentWillUnmount
//   target.prototype.componentWillUnmount = function() {
//     if (next) next.call(this, ...arguments)
//     this.unmount = true
//   }
//   // 对setState的改装，setState查看目前是否已经销毁
//   let setState = target.prototype.setState
//   target.prototype.setState = function() {
//     if (this.unmount) return
//     setState.call(this, ...arguments)
//   }
// }
// // export default inject_unount
// // //以后我们写组件时直接继承BaseComponent
// // class BaseComponent extends React.Component {}

// @inject_unount
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 默认选中
      selectedTab: props.location.pathname
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  renderItem() {
    return itemList.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.props.history.push(item.path)
        }}
      />
    ))
  }
  render() {
    return (
      <div className={styles.home}>
        {/* 配置路由规则 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        {/* 配置导航链接 */}
        <div className="tabBar">
          <TabBar
            unselectedTintColor="#888"
            tintColor="#21b97a"
            barTintColor="white"
            noRenderContent={true}
          >
            {this.renderItem()}
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home
