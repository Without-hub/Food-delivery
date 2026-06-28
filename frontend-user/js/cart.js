Common.checkLogin();
let cartData = [];

async function renderCart() {
    const res = await Api.getCartList();
    if (res.code !== 200) return Common.showMsg("加载购物车失败");
    cartData = res.data;
    const box = document.getElementById("cartBox");
    const totalEl = document.getElementById("totalPrice");
    const countEl = document.getElementById("cartCount");

    if (!cartData || cartData.length === 0) {
        box.innerHTML = `
            <div class="empty-state" style="margin-top:60px;">
                <div class="empty-icon">🛒</div>
                <div class="empty-text">购物车是空的</div>
                <a href="./index.html" class="btn btn-sm">去逛逛</a>
            </div>
        `;
        totalEl.innerText = "¥0.00";
        if (countEl) countEl.innerText = "0";
        return;
    }

    let html = "";
    let total = 0;
    let totalCount = 0;

    cartData.forEach(item => {
        const price = Number(item.price);
        const qty = Number(item.quantity);
        const sub = Number(item.subtotal || price * qty);
        total += sub;
        totalCount += qty;
        const img = item.dishImage || `/images/food${((item.dishId - 1) % 12) + 1}.jpg`;

        html += `
            <div class="cart-item" data-cart-id="${item.id}">
                <img src="${img}" alt="${item.dishName}" loading="lazy">
                <div class="info">
                    <div class="name">${item.dishName}</div>
                    <div class="price-sm">¥${Common.calcPrice(price)}</div>
                </div>
                <div class="qty-ctrl">
                    <button class="minus">−</button>
                    <input value="${qty}" readonly>
                    <button class="plus">+</button>
                </div>
                <div class="item-total">¥${Common.calcPrice(sub)}</div>
            </div>
        `;
    });

    box.innerHTML = html;
    totalEl.innerText = "¥" + Common.calcPrice(total);
    if (countEl) countEl.innerText = String(totalCount);
}

// 加减数量
document.getElementById("cartBox").addEventListener("click", async function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    const item = btn.closest(".cart-item");
    if (!item) return;
    const cartId = item.dataset.cartId;
    const data = cartData.find(v => String(v.id) === cartId);
    if (!data) return;

    let newNum = data.quantity;
    if (btn.classList.contains("minus")) {
        if (newNum <= 1) {
            await Api.delCart(cartId);
            Common.showMsg("已移除");
            renderCart();
            return;
        }
        newNum--;
    } else if (btn.classList.contains("plus")) {
        newNum++;
    }
    await Api.updateCart(cartId, newNum);
    renderCart();
});

// 清空购物车
document.getElementById("clearCart").addEventListener("click", async function () {
    if (!cartData || cartData.length === 0) return Common.showMsg("购物车已经空了");
    if (!confirm("确定要清空购物车吗？")) return;
    // 逐个删除所有商品
    for (const item of cartData) {
        await Api.delCart(item.id);
    }
    Common.showMsg("🗑️ 已清空");
    renderCart();
});

// 结算
document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (!cartData || cartData.length === 0) return Common.showMsg("购物车为空");
    location.href = "./order.html";
});

renderCart();