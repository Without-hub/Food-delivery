Common.checkLogin();
let cartData = [];

async function renderCart() {
    const res = await Api.getCartList();
    if (res.code !== 200) return Common.showMsg("加载购物车失败");
    cartData = res.data;
    const box = document.getElementById("cartBox");
    if (cartData.length === 0) {
        box.innerHTML = "<div style='text-align:center;margin-top:100px;color:#999'>购物车暂无商品，快去选购吧</div>";
        document.getElementById("totalPrice").innerText = "¥0.00";
        return;
    }
    let html = "";
    let total = 0;
    cartData.forEach(item => {
        const sub = Number(item.subtotal || item.price * item.quantity);
        total += sub;
        html += `
            <div class="cart-item" data-cart-id="${item.id}">
                <div style="flex:1">
                    <div style="font-weight:bold">${item.dishName}</div>
                    <div style="color:#f40">¥${item.price} × ${item.quantity}</div>
                </div>
                <div class="num-box">
                    <button class="minus">-</button>
                    <input value="${item.quantity}" readonly>
                    <button class="plus">+</button>
                </div>
                <div style="margin-left:20px">小计：¥${Common.calcPrice(sub)}</div>
            </div>
        `
    })
    box.innerHTML = html;
    document.getElementById("totalPrice").innerText = "¥" + Common.calcPrice(total);
}

document.getElementById("cartBox").onclick = async function (e) {
    const target = e.target;
    const cartItem = target.closest(".cart-item");
    if (!cartItem) return;
    const cartId = cartItem.dataset.cartId;
    const item = cartData.find(v => v.id == cartId);
    if (!item) return;
    let newNum = item.quantity;
    if (target.classList.contains("minus")) {
        newNum = newNum - 1;
        if (newNum < 1) return Common.showMsg("数量不能小于1");
    }
    if (target.classList.contains("plus")) {
        newNum = newNum + 1;
    }
    await Api.updateCart(cartId, newNum);
    renderCart();
}

document.getElementById("goOrderBtn").onclick = function () {
    if (cartData.length === 0) return Common.showMsg("购物车无商品，无法结算");
    location.href = "./order.html";
}
renderCart();
