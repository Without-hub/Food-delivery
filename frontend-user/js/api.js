const BASE_URL = "";

function request(opt) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let url = BASE_URL + opt.url;
        // GET 请求加时间戳防浏览器缓存
        if (!opt.method || opt.method === "GET") {
            const sep = url.includes("?") ? "&" : "?";
            url += sep + "_t=" + Date.now();
        }
        xhr.open(opt.method || "GET", url);
        xhr.setRequestHeader("token", Common.getToken());
        if (opt.method === "POST" || opt.method === "PUT") {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.onload = function () {
            const res = JSON.parse(xhr.responseText);
            if (res.code === 401) {
                Common.removeToken();
                location.href = "./login.html";
                return;
            }
            resolve(res);
        }
        xhr.onerror = reject;
        if (opt.data) {
            xhr.send(JSON.stringify(opt.data));
        } else {
            xhr.send();
        }
    })
}

const Api = {
    // ========== 用户 ==========
    login(data) {
        return request({ url: "/user/login", method: "POST", data })
    },
    register(data) {
        return request({ url: "/user/register", method: "POST", data })
    },
    getUserInfo() {
        return request({ url: "/user/info" })
    },

    // ========== 商家 ==========
    getShopList() {
        return request({ url: "/api/shop/list" })
    },
    getShopDetail(shopId) {
        return request({ url: `/api/shop/detail?shopId=${shopId}` })
    },

    // ========== 菜品 ==========
    getDishCategory(shopId) {
        return request({ url: `/api/dish/category/list?shopId=${shopId}` })
    },
    getDishByShop(shopId) {
        return request({ url: `/api/dish/list?shopId=${shopId}` })
    },
    getDishDetail(dishId) {
        return request({ url: `/api/dish/detail?dishId=${dishId}` })
    },

    // ========== 地址 ==========
    getAddressList() {
        return request({ url: `/address/list?userId=${Common.getUserId()}` })
    },
    addAddress(data) {
        data.userId = Common.getUserId();
        return request({ url: "/address?userId=" + Common.getUserId(), method: "POST", data })
    },
    deleteAddress(id) {
        return request({ url: `/address/${id}?userId=${Common.getUserId()}`, method: "DELETE" })
    },

    // ========== 购物车 ==========
    getCartList() {
        return request({ url: `/cart/list?userId=${Common.getUserId()}` })
    },
    addCart(dishId, shopId, quantity) {
        const uid = Common.getUserId();
        return request({ url: `/cart/add?userId=${uid}&dishId=${dishId}&shopId=${shopId}&quantity=${quantity || 1}`, method: "POST" })
    },
    updateCart(id, quantity) {
        return request({ url: `/cart/update?id=${id}&quantity=${quantity}`, method: "PUT" })
    },
    delCart(cartId) {
        return request({ url: `/cart/delete?id=${cartId}`, method: "DELETE" })
    },

    // ========== 订单 ==========
    createOrder(data) {
        return request({ url: "/api/orders", method: "POST", data })
    },
    getOrderList(status) {
        let url = "/api/orders";
        if (status !== undefined && status !== null) url += "?status=" + status;
        return request({ url: url })
    },
    cancelOrder(id) {
        return request({ url: `/api/orders/${id}/cancel`, method: "PUT" })
    },

    // ========== 评价 ==========
    addReview(dishId, orderId, content, rating) {
        return request({ url: `/review/add?userId=${Common.getUserId()}&dishId=${dishId}&orderId=${orderId}&content=${encodeURIComponent(content)}&rating=${rating}`, method: "POST" })
    },
    getDishReviews(dishId) {
        return request({ url: `/review/dish?dishId=${dishId}` })
    },
    getDishRating(dishId) {
        return request({ url: `/review/rating?dishId=${dishId}` })
    }
};
