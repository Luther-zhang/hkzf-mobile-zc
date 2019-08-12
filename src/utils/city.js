import { API } from './api'
// 定义常量
const CURRENT_CITY = 'current_city'
// 获取城市 --->对象
function getCity() {
  return JSON.parse(localStorage.getItem(CURRENT_CITY))
}
// 设置城市 --->字符串
export function setCity(city) {
  localStorage.setItem(CURRENT_CITY, JSON.stringify(city))
}
// 暴露方法 获取当前城市
export function getCurrentCity() {
  // 尝试从localStorage缓存中获取城市信息
  const city = getCity()
  if (!city) {
    // 缓存中没有，调用API获取，并返回promise对象
    return new Promise((resolve, reject) => {
      const myCity = new window.BMap.LocalCity()
      // BMap方法得到城市名，根据城市名发送ajax
      myCity.get(result => {
        const name = result.name
        API.get('area/info', {
          params: {
            name
          }
        })
          .then(res => {
            // 成功，缓存中设置城市，并返回
            const { body } = res.data
            setCity(body)
            resolve(body)
          })
          .catch(err => {
            // 失败，返回错误信息
            reject(err)
          })
      })
    })
  } else {
    // 缓存中有城市信息，返回promise对象
    return Promise.resolve(city)
  }
}
