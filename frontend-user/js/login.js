// 登录逻辑
const loginBtn = document.getElementById("loginBtn");
loginBtn.onclick = async function () {
    const phone = document.getElementById("phone").value.trim();
    const pwd = document.getElementById("pwd").value.trim();
    // 前端简单校验
    if (!phone) return Common.showMsg("请输入手机号");
    if (!/^1[3-9]\d{9}$/.test(phone)) return Common.showMsg("手机号格式错误");
    if (!pwd) return Common.showMsg("请输入密码");

    try {
        const res = await Api.login({ phone, password: pwd });
        if (res.code === 200) {
            Common.setToken(res.data.token);
            Common.showMsg("登录成功");
            // 跳首页
            setTimeout(() => location.href = "./index.html", 1200);
        } else {
            Common.showMsg(res.message || "登录失败");
        }
    } catch (err) {
        Common.showMsg("网络请求失败");
    }
}