Common.checkLogin();
const urlParams = new URLSearchParams(location.search);
const shopId = urlParams.get("shopId");
let allDishes = [];
let currentCatId = null;

async function loadShop() {
    // 商家详情
    const shopRes = await Api.getShopDetail(shopId);
    if (shopRes.code === 200) {
        const s = shopRes.data;
        document.getElementById("shopTitle").innerText = s.name;
        document.getElementById("shopBanner").style.display = "block";
        document.getElementById("shopName").innerText = s.name;
        document.getElementById("shopInfo").innerHTML =
            `⭐ ${s.rating || '暂无'}  |  🛵 配送费 ¥${s.deliveryFee}  |  起送 ¥${s.minPrice}  |  🕐 ${s.businessHours || '营业中'}<br>${s.description || ''}`;
    }

    // 菜品分类
    const catRes = await Api.getDishCategory(shopId);
    const cats = catRes.code === 200 ? catRes.data : [];

    // 全部菜品
    const dishRes = await Api.getDishByShop(shopId);
    allDishes = dishRes.code === 200 ? dishRes.data : [];

    // 渲染分类标签
    let catHtml = `<span class="cat-tab ${currentCatId === null ? 'active' : ''}" data-cat="">全部</span>`;
    cats.forEach(c => {
        catHtml += `<span class="cat-tab ${currentCatId === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</span>`;
    });
    document.getElementById("catTabs").innerHTML = catHtml;

    renderDishes();
}

function renderDishes() {
    let dishes = allDishes;
    if (currentCatId !== null) {
        dishes = allDishes.filter(d => d.categoryId == currentCatId);
    }

    // 按分类分组
    if (currentCatId === null) {
        // 全部模式：按分类分组显示
        const catRes = Api.getDishCategory(shopId);
        let html = "";
        const cats = document.querySelectorAll(".cat-tab");
        allDishes.forEach(d => {
            html += `
            <div class="food-item" data-food-id="${d.id}" data-shop-id="${shopId}">
                <img src="${d.image || 'https://picsum.photos/id/20/80/80'}" alt="">
                <div class="food-info">
                    <div class="name">${d.name}</div>
                    <div class="desc">${d.description || ''}</div>
                    <span class="price">¥${d.price}</span>
                    ${d.originalPrice ? `<span class="origin">¥${d.originalPrice}</span>` : ''}
                    <span style="color:#999;font-size:12px;margin-left:8px">销量 ${d.salesVolume}</span>
                </div>
                <button class="add-cart-btn">加入购物车</button>
            </div>`;
        });
        if (allDishes.length === 0) html = "<div style='text-align:center;color:#999;padding:40px'>暂无菜品</div>";
        document.getElementById("foodBox").innerHTML = html;
    } else {
        let html = "";
        dishes.forEach(d => {
            html += `
            <div class="food-item" data-food-id="${d.id}" data-shop-id="${shopId}">
                <img src="${d.image || 'https://picsum.photos/id/20/80/80'}" alt="">
                <div class="food-info">
                    <div class="name">${d.name}</div>
                    <div class="desc">${d.description || ''}</div>
                    <span class="price">¥${d.price}</span>
                    ${d.originalPrice ? `<span class="origin">¥${d.originalPrice}</span>` : ''}
                    <span style="color:#999;font-size:12px;margin-left:8px">销量 ${d.salesVolume}</span>
                </div>
                <button class="add-cart-btn">加入购物车</button>
            </div>`;
        });
        if (dishes.length === 0) html = "<div style='text-align:center;color:#999;padding:40px'>该分类暂无菜品</div>";
        document.getElementById("foodBox").innerHTML = html;
    }
}

// 分类切换
document.getElementById("catTabs").onclick = function(e) {
    if (e.target.classList.contains("cat-tab")) {
        currentCatId = e.target.dataset.cat || null;
        currentCatId = currentCatId ? parseInt(currentCatId) : null;
        document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        renderDishes();
    }
};

// 加入购物车
document.getElementById("foodBox").onclick = async function(e) {
    if (e.target.classList.contains("add-cart-btn")) {
        const itemDom = e.target.closest(".food-item");
        const foodId = itemDom.dataset.foodId;
        const sid = itemDom.dataset.shopId;
        const res = await Api.addCart(foodId, sid, 1);
        if (res.code === 200) Common.showMsg("已加入购物车");
        else Common.showMsg(res.message || "添加失败");
    }
};

loadShop();
