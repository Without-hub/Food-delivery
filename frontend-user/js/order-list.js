Common.checkLogin();

async function renderOrder() {
    const res = await Api.getOrderList(0);
    const box = document.getElementById("orderBox");
    if (res.code !== 200) return Common.showMsg("加载订单失败");
    const list = res.data;
    if (list.length === 0) {
        box.innerHTML = "<div style='text-align:center;color:#999;margin-top:100px'>暂无订单记录</div>";
        return;
    }
    let html = "";
    list.forEach(item => {
        html += `
            <div class="order-item">
                <div class="order-top">
                    <span>订单号：${item.orderNo}</span>
                    <span class="status-tag">${item.statusName}</span>
                </div>
                <div>订单总价：¥${item.totalPrice}</div>
                <div style="margin-top:8px;color:#999">下单时间：${item.createTime}</div>
            </div>
        `
    })
    box.innerHTML = html;
}
renderOrder();