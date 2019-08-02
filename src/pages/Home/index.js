import React from 'react'
import { Route } from 'react-router-dom'
import Index from './Index/index.js'
import House from './House'
import News from './News'
import My from './My'
import './index.scss'
// 导入TabBar组件
import { TabBar } from 'antd-mobile'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 默认选中
      selectedTab: 'blueTab',
      // 是否隐藏
      hidden: false,
      // 是否全屏
      fullScreen: true
    }
  }
  // 渲染TabBar内容
  renderContent(pageText) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          height: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{ paddingTop: 60 }}>
          Clicked “{pageText}” tab， show “{pageText}” information
        </div>
        <a
          href="sdfsd"
          style={{
            display: 'block',
            marginTop: 40,
            marginBottom: 20,
            color: '#108ee9'
          }}
          onClick={e => {
            e.preventDefault()
            this.setState({
              hidden: !this.state.hidden
            })
          }}
        >
          Click to show/hide tab-bar
        </a>
        <a
          href="sdf"
          style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={e => {
            e.preventDefault()
            this.setState({
              fullScreen: !this.state.fullScreen
            })
          }}
        >
          Click to switch fullscreen
        </a>
      </div>
    )
  }
  render() {
    return (
      <div className="home">
        Home组件
        {/* 配置路由规则 */}
        <Route path="/home/index" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        {/* 配置导航链接 */}
        <div
          style={
            this.state.fullScreen
              ? { position: 'fixed', height: '100%', width: '100%', top: 0 }
              : { height: 400 }
          }
        >
          {/* 
            unselectedTintColor: 未选中的颜色
            tintColor： 选中的颜色
            barTintColor: 背景色
           */}
          <TabBar
            unselectedTintColor="gray"
            tintColor="Lightgreen"
            barTintColor="white"
          >
            {/* 
              title： 显示的文字
              icon: 未选中的图标
              selectedIcon： 选中的图标
              selected： 是否被选中
              badge： 徽章
              onPress：点击事件
             */}
            <TabBar.Item
              title="首页"
              key="首页"
              icon={<i className="iconfont icon-ind" />}
              selectedIcon={<i className="iconfont icon-ind" />}
              selected={this.state.selectedTab === 'blueTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'blueTab'
                })
              }}
            />
            <TabBar.Item
              title="找房"
              key="找房"
              icon={<i className="iconfont icon-findHouse" />}
              selectedIcon={<i className="iconfont icon-findHouse" />}
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'redTab'
                })
              }}
            />
            <TabBar.Item
              title="咨讯"
              key="咨讯"
              icon={<i className="iconfont icon-infom" />}
              selectedIcon={<i className="iconfont icon-infom" />}
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'greenTab'
                })
              }}
            />
            <TabBar.Item
              title="我的"
              key="我的"
              icon={<i className="iconfont icon-my" />}
              selectedIcon={<i className="iconfont icon-my" />}
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'yellowTab'
                })
              }}
            />
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home
