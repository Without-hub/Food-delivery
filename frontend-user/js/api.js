// 后端统一基础地址（后续后端部署后替换真实地址）
const BASE_URL = "http://localhost:8080";

// 统一请求封装
function request(opt) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let url = BASE_URL + opt.url;
        xhr.open(opt.method || "GET", url);
        // 请求头携带token
        xhr.setRequestHeader("token", Common.getToken());
        if (opt.method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.onload = function () {
            const res = JSON.parse(xhr.responseText);
            // 未登录/登录过期
            if (res.code === 401) {
                Common.removeToken();
                location.href = "./login.html";
                return;
            }
            resolve(res);
        }
        xhr.onerror = reject;
        // post传参
        if (opt.data) {
            xhr.send(JSON.stringify(opt.data));
        } else {
            xhr.send();
        }
    })
}

// 所有接口统一导出
const Api = {
    // ========== 用户模块（对接李享洋） ==========
    // 登录
    login(data) {
        return request({
            url: "/user/login",
            method: "POST",
            data
        })
    },
    // 注册
    register(data) {
        return request({
            url: "/user/register",
            method: "POST",
            data
        })
    },
    // 获取用户地址列表
    getAddressList() {
        return request({ url: "/address/list" })
    },

    // ========== 商家菜品模块（对接毛帅） ==========
    // 获取首页商家列表
    getShopList() {
        return request({ url: "/shop/list" })
    },
    // 根据店铺id获取菜品
    getFoodByShopId(shopId) {
        return request({ url: `/food/list?shopId=${shopId}` })
    },

    // ========== 购物车模块（对接赵涵） ==========
    // 查询购物车
    getCartList() {
        return request({ url: "/cart/list" })
    },
    // 添加购物车
    addCart(data) {
        return request({ url: "/cart/add", method: "POST", data })
    },
    // 修改购物车数量
    updateCart(data) {
        return request({ url: "/cart/update", method: "POST", data })
    },
    // 删除购物车商品
    delCart(cartId) {
        return request({ url: `/cart/del?cartId=${cartId}` })
    },

    // ========== 订单模块（对接魏子皓组长） ==========
    // 提交下单
    createOrder(data) {
        return request({ url: "/order/create", method: "POST", data })
    },
    // 获取订单列表
    getOrderList(status = 0) {
        return request({ url: `/order/list?status=${status}` })
    }
}