Common.checkLogin();
let cartList = [];
let addrList = [];
let totalMoney = 0;

async function loadAddr() {
    const res = await Api.getAddressList();
    if (res.code === 200) addrList = res.data;
    const box = document.getElementById("addrBox");
    if (addrList.length === 0) {
        box.innerHTML = "<div style='color:#999;padding:10px'>暂无收货地址，请在下方新增</div>";
    } else {
        let html = "";
        addrList.forEach(item => {
            html += `
                <label>
                    <input type="radio" name="addr" value="${item.id}" ${item.isDefault === 1 ? 'checked' : ''}>
                    ${item.contactName} &nbsp; ${item.contactPhone} &nbsp;&nbsp; ${item.detail}
                    ${item.isDefault === 1 ? '<span style="color:#f40;font-size:12px">[默认]</span>' : ''}
                </label>
            `
        });
        box.innerHTML = html;
    }
}

document.getElementById("showAddrForm").onclick = function() {
    document.getElementById("addrForm").style.display = "flex";
};

document.getElementById("saveAddr").onclick = async function() {
    const name = document.getElementById("newName").value.trim();
    const phone = document.getElementById("newPhone").value.trim();
    const detail = document.getElementById("newDetail").value.trim();
    if (!name || !phone || !detail) return Common.showMsg("请填写完整地址信息");
    const res = await Api.addAddress({
        contactName: name,
        contactPhone: phone,
        detail: detail,
        province: "", city: "", district: ""
    });
    if (res.code === 200) {
        Common.showMsg("地址新增成功");
        document.getElementById("addrForm").style.display = "none";
        document.getElementById("newName").value = "";
        document.getElementById("newPhone").value = "";
        document.getElementById("newDetail").value = "";
        loadAddr();
    } else {
        Common.showMsg(res.message || "新增失败");
    }
};

async function loadCartGoods() {
    const res = await Api.getCartList();
    if (res.code !== 200) return;
    cartList = res.data;
    const goodsBox = document.getElementById("goodsBox");
    let html = "";
    totalMoney = 0;
    cartList.forEach(item => {
        const sub = Number(item.subtotal || item.price * item.quantity);
        totalMoney += sub;
        html += `
            <div class="goods-item">
                <span>${item.dishName} × ${item.quantity}</span>
                <span style="color:#f40">¥${Common.calcPrice(sub)}</span>
            </div>
        `
    });
    goodsBox.innerHTML = html || "<div style='color:#999'>购物车为空</div>";
    document.getElementById("payTotal").innerText = "¥" + Common.calcPrice(totalMoney);
}

document.getElementById("submitBtn").onclick = async function() {
    if (addrList.length === 0) return Common.showMsg("请先添加收货地址");
    const selected = document.querySelector("input[name='addr']:checked");
    if (!selected) return Common.showMsg("请选择收货地址");
    const res = await Api.createOrder({ addressId: parseInt(selected.value) });
    if (res.code === 200) {
        Common.showMsg("下单成功！");
        setTimeout(() => location.href = "./order-list.html", 1200);
    } else {
        Common.showMsg(res.message || "下单失败");
    }
};

loadAddr();
loadCartGoods();
