import React from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'
import { API, getCurrentCity } from 'utils'

class Filter extends React.Component {
  state = {
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 记录点击的类型
    openType: '',
    filtersData: {},
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  componentDidMount() {
    this.getFiltersData()
  }

  async getFiltersData() {
    const { value } = await getCurrentCity()
    const res = await API.get(`houses/condition?id=${value}`)
    this.setState({
      filtersData: res.body
    })
  }

  changeStatus = type => {
    const { titleSelectedStatus } = this.state
    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus,
        [type]: true
      },
      openType: type
    })
  }

  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  onSave = value => {
    const { openType, selectedValues } = this.state
    this.setState({
      openType: '',
      selectedValues: {
        ...selectedValues,
        [openType]: value
      }
    })
  }

  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    // if(openType===''||openType==='more') return
    let data, cols
    // 根据点击的类型，获取value值
    const defaultValue = selectedValues[openType]
    if (openType === 'area') {
      data = [area, subway]
      cols = 3
    } else if (openType === 'mode') {
      data = rentType
      cols = 1
    } else if (openType === 'price') {
      data = price
      cols = 1
    } else {
      return
    }

    return (
      <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
      />
    )
  }

  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.filter}>
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className="mask" onClick={this.onCancel} />
        ) : null}
        <div className="content">
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            changeStatus={this.changeStatus}
          />
          {this.renderFilterPicker()}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}

export default Filter
