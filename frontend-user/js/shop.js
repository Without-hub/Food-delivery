Common.checkLogin();
// 获取地址栏店铺id
const urlParams = new URLSearchParams(location.search);
const shopId = urlParams.get("shopId");

async function renderFood() {
    const res = await Api.getFoodByShopId(shopId);
    if (res.code !== 200) return Common.showMsg("加载菜品失败");
    const list = res.data;
    const box = document.getElementById("foodBox");
    let html = "";
    list.forEach(item => {
        html += `
            <div class="food-item" data-food-id="${item.id}" data-shop-id="${shopId}" data-price="${item.price}">
                <img src="${item.img || 'https://picsum.photos/id/20/80/80'}">
                <div class="food-info">
                    <div style="font-weight:bold">${item.foodName}</div>
                    <div style="color:#f40">¥${item.price}</div>
                </div>
                <button class="add-cart-btn">加入购物车</button>
            </div>
        `
    })
    box.innerHTML = html;
    // 加入购物车点击事件
    box.onclick = async function (e) {
        if (e.target.classList.contains("add-cart-btn")) {
            const itemDom = e.target.closest(".food-item");
            const foodId = itemDom.dataset.foodId;
            const sid = itemDom.dataset.shopId;
            const price = itemDom.dataset.price;
            const res = await Api.addCart({ foodId, shopId: sid, num: 1, price });
            if (res.code === 200) Common.showMsg("加入购物车成功");
            else Common.showMsg(res.msg);
        }
    }
}
renderFood();