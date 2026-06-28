Common.checkLogin();
let cartList = [];
let addrList = [];
let totalMoney = 0;
let deliveryFee = 0;

// 加载地址
async function loadAddr() {
    const res = await Api.getAddressList();
    if (res.code === 200) addrList = res.data;
    const box = document.getElementById("addrBox");
    if (!addrList || addrList.length === 0) {
        box.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:12px;">暂无收货地址</div>';
        return;
    }
    let html = "";
    addrList.forEach(item => {
        const def = item.isDefault === 1;
        html += `
            <label class="addr-radio-item">
                <input type="radio" name="addr" value="${item.id}" ${def ? "checked" : ""}>
                <div style="flex:1;">
                    <div class="addr-name">
                        ${item.contactName}
                        <span>${item.contactPhone}</span>
                        ${def ? '<span class="default-tag">默认</span>' : ''}
                    </div>
                    <div class="addr-detail">${item.province || ''}${item.city || ''}${item.district || ''} ${item.detail || ''}</div>
                </div>
            </label>
        `;
    });
    box.innerHTML = html;
}

// 加载商品
async function loadCartGoods() {
    const res = await Api.getCartList();
    if (res.code !== 200) return;
    cartList = res.data;
    const box = document.getElementById("goodsBox");
    let html = "";
    totalMoney = 0;

    cartList.forEach(item => {
        const sub = Number(item.subtotal || item.price * item.quantity);
        totalMoney += sub;
        html += `
            <div class="goods-item">
                <div>
                    <div class="goods-name">${item.dishName}</div>
                    <div class="goods-meta">¥${Common.calcPrice(item.price)} × ${item.quantity}</div>
                </div>
                <div style="font-weight:600;color:var(--text);">¥${Common.calcPrice(sub)}</div>
            </div>
        `;
    });
    box.innerHTML = html || "<div style='color:var(--text-muted);text-align:center;padding:20px;'>购物车为空</div>";

    // 获取配送费
    deliveryFee = 0;
    if (cartList.length > 0 && cartList[0].shopId) {
        try {
            const sr = await Api.getShopDetail(cartList[0].shopId);
            if (sr.code === 200 && sr.data.deliveryFee) deliveryFee = parseFloat(sr.data.deliveryFee);
        } catch(e) {}
    }

    document.getElementById("goodsTotal").innerText = "¥" + Common.calcPrice(totalMoney);
    document.getElementById("deliveryFee").innerText = deliveryFee > 0 ? "¥" + Common.calcPrice(deliveryFee) : "免配送费";
    const pay = totalMoney + deliveryFee;
    document.getElementById("payTotal").innerText = "¥" + Common.calcPrice(pay);
    document.getElementById("bottomTotal").innerText = "¥" + Common.calcPrice(pay);
}

// 提交
document.getElementById("submitBtn").addEventListener("click", async function () {
    if (!addrList || addrList.length === 0) return Common.showMsg("请添加收货地址");
    const sel = document.querySelector("input[name='addr']:checked");
    if (!sel) return Common.showMsg("请选择收货地址");
    this.disabled = true; this.innerText = "提交中...";
    const remark = document.getElementById("remarkInput").value.trim();
    const res = await Api.createOrder({ addressId: parseInt(sel.value), remark: remark || undefined });
    if (res.code === 200) {
        Common.showMsg("🎉 下单成功！");
        setTimeout(() => location.href = "./order-list.html", 1200);
    } else {
        Common.showMsg(res.message || "下单失败");
        this.disabled = false; this.innerText = "提交订单";
    }
});

// ===== 新增地址弹窗 =====
document.getElementById("showAddrForm").addEventListener("click", function() {
    document.getElementById("addrPopup").classList.add("show");
});
document.getElementById("cancelAddr").addEventListener("click", function() {
    document.getElementById("addrPopup").classList.remove("show");
});
document.getElementById("saveAddr").addEventListener("click", async function() {
    const name = document.getElementById("newName").value.trim();
    const phone = document.getElementById("newPhone").value.trim();
    const detail = document.getElementById("newDetail").value.trim();
    if (!name) return Common.showMsg("请输入收货人姓名");
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) return Common.showMsg("手机号格式不正确");
    if (!detail) return Common.showMsg("请输入详细地址");
    this.disabled = true; this.innerText = "保存中...";
    const res = await Api.addAddress({
        contactName: name, contactPhone: phone, detail: detail,
        province: "", city: "", district: ""
    });
    if (res.code === 200) {
        Common.showMsg("✅ 地址添加成功");
        document.getElementById("addrPopup").classList.remove("show");
        document.getElementById("newName").value = "";
        document.getElementById("newPhone").value = "";
        document.getElementById("newDetail").value = "";
        this.disabled = false; this.innerText = "保存";
        loadAddr();
    } else {
        Common.showMsg(res.message || "添加失败");
        this.disabled = false; this.innerText = "保存";
    }
});

loadAddr();
loadCartGoods();