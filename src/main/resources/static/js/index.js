Common.checkLogin();

// Banner 轮播
const banners = [
    "https://picsum.photos/seed/banner1/800/280",
    "https://picsum.photos/seed/banner2/800/280",
    "https://picsum.photos/seed/banner3/800/280"
];
let bannerIdx = 0;
setInterval(() => {
    bannerIdx = (bannerIdx + 1) % banners.length;
    const img = document.getElementById("bannerImg");
    if (img) { img.style.opacity = 0; setTimeout(() => { img.src = banners[bannerIdx]; img.style.opacity = 1; }, 200); }
    document.querySelectorAll("#bannerDots .dot").forEach((d, i) => d.classList.toggle("active", i === bannerIdx));
}, 4000);

// 分类
const CATEGORIES = [
    { icon: "🍔", name: "汉堡" }, { icon: "🥤", name: "茶饮" },
    { icon: "🍗", name: "炸鸡" }, { icon: "🍜", name: "快餐" },
    { icon: "🥟", name: "小吃" }, { icon: "🍣", name: "日料" },
    { icon: "🥩", name: "中餐" }, { icon: "🍰", name: "甜品" }
];
document.getElementById("categoryGrid").innerHTML = CATEGORIES.map(c =>
    `<div class="cat-item" data-cat="${c.name}"><div class="cat-icon">${c.icon}</div><div class="cat-label">${c.name}</div></div>`
).join("");

document.getElementById("categoryGrid").addEventListener("click", function(e) {
    const item = e.target.closest(".cat-item");
    if (!item) return;
    const cat = item.dataset.cat;
    document.querySelectorAll(".food-card").forEach(el => {
        const tags = (el.dataset.category || "").toLowerCase();
        el.style.display = (!cat || tags.includes(cat.toLowerCase())) ? "" : "none";
    });
});

// 渲染商家
async function renderShop() {
    const res = await Api.getShopList();
    const box = document.getElementById("shopBox");
    if (res.code !== 200) return Common.showMsg("加载失败");
    const list = res.data || [];
    if (!list.length) { box.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">暂无店铺</div>'; return; }

    let html = "";
    list.forEach(item => {
        const img = item.logo || `/images/shop${item.id}.jpg`;
        const rating = item.rating ? parseFloat(item.rating).toFixed(1) : "新店";
        const sales = item.salesVolume || 0;
        const fee = item.deliveryFee ? parseFloat(item.deliveryFee).toFixed(0) : "免";
        const minP = item.minPrice ? parseFloat(item.minPrice).toFixed(0) : "0";
        html += `
            <div class="food-card shop-item" data-id="${item.id}" data-category="${item.category || ''}">
                <img class="food-img" src="${img}" alt="${item.name}" loading="lazy">
                <div class="food-body">
                    <div class="food-name">${item.name}</div>
                    <div class="food-meta">
                        <span class="rating">⭐ ${rating}</span>
                        <span>月售 ${sales}</span>
                        <span>配送¥${fee}</span>
                    </div>
                    <div class="food-bottom">
                        <span class="price">${minP}起</span>
                        <span class="btn-orange" style="font-size:11px;height:26px;padding:0 10px;">进店</span>
                    </div>
                </div>
            </div>
        `;
    });
    box.innerHTML = html;

    box.querySelectorAll(".shop-item").forEach(el => {
        el.addEventListener("click", () => location.href = `./shop.html?shopId=${el.dataset.id}`);
    });
}

renderShop();

// 更新购物车角标
setInterval(async () => {
    try {
        const r = await Api.getCartList();
        if (r.code === 200 && r.data) {
            const count = r.data.reduce((s, i) => s + i.quantity, 0);
            document.getElementById("cartBadge").innerText = count;
        }
    } catch(e) {}
}, 3000);

// 初始角标
(async () => {
    try {
        const r = await Api.getCartList();
        if (r.code === 200 && r.data) {
            document.getElementById("cartBadge").innerText = r.data.reduce((s, i) => s + i.quantity, 0);
        }
    } catch(e) {}
})();