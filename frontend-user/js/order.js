Common.checkLogin();
let cartList = [];
let addrList = [];
let totalMoney = 0;

// 加载地址
async function loadAddr() {
    const res = await Api.getAddressList();
    if (res.code === 200) addrList = res.data;
    const box = document.getElementById("addrBox");
    if (addrList.length === 0) {
        box.innerHTML = "暂无收货地址，请先添加地址";
    } else {
        let html = "";
        addrList.forEach(item => {
            html += `
                <div style="padding:8px;border:1px solid #ddd;margin:6px 0" data-addr-id="${item.id}">
                    ${item.username} ${item.phone} | ${item.detail}
                </div>
            `
        })
        box.innerHTML = html;
    }
}

// 加载购物车商品
async function loadCartGoods() {
    const res = await Api.getCartList();
    if (res.code !== 200) return;
    cartList = res.data;
    const goodsBox = document.getElementById("goodsBox");
    let html = "";
    totalMoney = 0;
    cartList.forEach(item => {
        const sub = Number(item.price) * item.num;
        totalMoney += sub;
        html += `
            <div class="goods-item">
                <span>${item.foodName} × ${item.num}</span>
                <span>¥${Common.calcPrice(sub)}</span>
            </div>
        `
    })
    goodsBox.innerHTML = html;
    document.getElementById("payTotal").innerText = "¥" + Common.calcPrice(totalMoney);
}

// 提交订单
document.getElementById("submitBtn").onclick = async function () {
    if (addrList.length === 0) return Common.showMsg("请先添加收货地址");
    // 取第一条地址（可优化选择地址）
    const addrId = addrList[0].id;
    // 组装商品id数组
    const foodIds = cartList.map(v => v.id);
    const res = await Api.createOrder({ addressId: addrId, cartIds: foodIds });
    if (res.code === 200) {
        Common.showMsg("下单成功");
        setTimeout(() => location.href = "./order-list.html", 1200);
    } else {
        Common.showMsg(res.msg);
    }
}

loadAddr();
loadCartGoods();