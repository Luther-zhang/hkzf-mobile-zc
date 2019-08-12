import React from 'react'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import classnames from 'classnames'

const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '更多', type: 'more' }
]

class FilterTitle extends React.Component {
  render() {
    const { titleSelectedStatus, changeStatus } = this.props
    return (
      <Flex align="center" className={styles['filter-title']}>
        {titleList.map(item => {
          const isSelected = titleSelectedStatus[item.type]
          return (
            <Flex.Item key={item.title}>
              <span
                className={classnames('dropdown', { selected: isSelected })}
                onClick={() => changeStatus(item.type)}
              >
                <span>{item.title}</span>
                <i className="iconfont icon-arrow" />
              </span>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }
}

export default FilterTitle
