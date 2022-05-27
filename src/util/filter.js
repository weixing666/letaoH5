
import Vue from 'vue'

// 全局过滤器
import moment from 'moment'
Vue.filter('dateFormat', function (date, format = 'YYYY-MM-DD') {
  return moment(date).format(format)
})


Vue.filter('unixToFormat', function (unixTime, format = 'YYYY-MM-DD') {
    return moment.unix(unixTime).format(format)
})
