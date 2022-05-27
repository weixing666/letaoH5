// 延时函数sleep
export function sleep(time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },time)
    })
}

export function userInfo(){
    let user;
    try{
        user = JSON.parse(localStorage.getItem('userInfo'));
    }catch(err){
        return false
    }

    let token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    return user;
}

export function genOrderId() {
    var randomNumber = ""; //订单号
    for (var i = 0; i < 6; i++) { //6位随机数，加在时间戳后面。

        randomNumber += Math.floor(Math.random() * 10);   // 20200304131312123412341212
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();


    // 补0操作    2021813
    const formatNumber = n => {
        n = n.toString()
        // '8' => '08'
        return n[1] ? n : '0' + n
    }

    return [year, month, day, hour, minute, second].map(formatNumber).join('') + randomNumber;
}

export function searchParam(url) {
    let search = location.search.slice(1) || '';
    let params = {};
    search && search.split('&').forEach(v => {
        let [key, value] = v.split('=')
        params[key] = decodeURIComponent(value)
    })
    return params;
}

export function throttle(func, delay) {
    var prev = Date.now();
    return function () {
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
    }
}
