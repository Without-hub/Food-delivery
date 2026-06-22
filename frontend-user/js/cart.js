Common.checkLogin();
let cartData = [];

// 渲染购物车
async function renderCart() {
    const res = await Api.getCartList();
    if (res.code !== 200) return Common.showMsg("加载购物车失败");
    cartData = res.data;
    const box = document.getElementById("cartBox");
    let html = "";
    let total = 0;
    if (cartData.length === 0) {
        box.innerHTML = "<div style='text-align:center;margin-top:100px;color:#999'>购物车暂无商品，快去选购吧</div>";
    } else {
        cartData.forEach(item => {
            const itemTotal = Number(item.price) * item.num;
            total += itemTotal;
            html += `
                <div class="cart-item" data-cart-id="${item.id}">
                    <img src="${item.foodImg || 'https://picsum.photos/id/30/70/70'}">
                    <div style="flex:1">
                        <div>${item.foodName}</div>
                        <div style="color:#f40">¥${item.price}</div>
                    </div>
                    <div class="num-box">
                        <button class="minus">-</button>
                        <input value="${item.num}" readonly>
                        <button class="plus">+</button>
                    </div>
                    <div style="margin-left:20px">小计：¥${Common.calcPrice(itemTotal)}</div>
                </div>
            `
        })
        box.innerHTML = html;
    }
    document.getElementById("totalPrice").innerText = "¥" + Common.calcPrice(total);
}

// 增减数量
document.getElementById("cartBox").onclick = async function (e) {
    const target = e.target;
    const cartItem = target.closest(".cart-item");
    const cartId = cartItem.dataset.cartId;
    const item = cartData.find(v => v.id == cartId);
    if (!item) return;
    let newNum = item.num;
    if (target.classList.contains("minus")) {
        newNum = newNum - 1;
        if (newNum < 1) return Common.showMsg("数量不能小于1");
    }
    if (target.classList.contains("plus")) {
        newNum = newNum + 1;
    }
    await Api.updateCart({ cartId, num: newNum });
    renderCart();
}

// 去结算跳转
document.getElementById("goOrderBtn").onclick = function () {
    if (cartData.length === 0) return Common.showMsg("购物车无商品，无法结算");
    location.href = "./order.html";
}
renderCart();