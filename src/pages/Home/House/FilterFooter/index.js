import React from 'react'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'

class FilterFooter extends React.Component {
  render() {
    const { onCancel, onSave } = this.props
    return (
      <Flex className={styles['filter-footer']}>
        <span className="btn cancel" onClick={onCancel}>
          取消
        </span>
        <span className="btn ok" onClick={onSave}>
          确认
        </span>
      </Flex>
    )
  }
}

export default FilterFooter
