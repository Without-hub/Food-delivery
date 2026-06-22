const regBtn = document.getElementById("regBtn");
regBtn.onclick = async function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pwd = document.getElementById("pwd").value.trim();

    if (!name) return Common.showMsg("请填写用户名");
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) return Common.showMsg("手机号格式错误");
    if (pwd.length < 6) return Common.showMsg("密码至少6位");

    try {
        const res = await Api.register({ username: name, phone, password: pwd });
        if (res.code === 200) {
            Common.showMsg("注册成功，请登录");
            setTimeout(() => location.href = "./login.html", 1200);
        } else {
            Common.showMsg(res.msg);
        }
    } catch {
        Common.showMsg("注册请求失败");
    }
}