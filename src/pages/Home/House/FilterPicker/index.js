import React from 'react'
import styles from './index.module.scss'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../FilterFooter'

class FilterPicker extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: this.props.defaultValue
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      })
    }
  }

  handleChange = value => {
    this.setState({
      value
    })
    // console.log(value)
  }

  render() {
    const { onCancel, onSave, data, cols } = this.props
    const { value } = this.state
    return (
      <div className={styles['filter-picker']}>
        <PickerView
          data={data}
          cols={cols}
          value={value}
          onChange={this.handleChange}
        />
        <FilterFooter
          onCancel={onCancel}
          onSave={() => {
            onSave(value)
          }}
        />
      </div>
    )
  }
}

export default FilterPicker
