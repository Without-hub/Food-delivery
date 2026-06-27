// 进入页面先校验登录
Common.checkLogin();

// 渲染商家列表
async function renderShop() {
    const res = await Api.getShopList();
    const box = document.getElementById("shopBox");
    if (res.code !== 200) return Common.showMsg("加载商家失败");
    const list = res.data;
    let html = "";
    list.forEach(item => {
        html += `
            <div class="card shop-item" data-id="${item.id}">
                <img src="${item.logo || 'https://picsum.photos/id/10/300/140'}" alt="">
                <div class="shop-name">${item.name}</div>
                <div>起送 ¥${item.minPrice}</div>
            </div>
        `
    })
    box.innerHTML = html;
    // 点击店铺跳详情
    box.onclick = function (e) {
        const shopItem = e.target.closest(".shop-item");
        if (shopItem) {
            const sid = shopItem.dataset.id;
            location.href = `./shop.html?shopId=${sid}`;
        }
    }
}
renderShop();