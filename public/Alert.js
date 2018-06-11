function InputCheck(register) {
    if (register.username.value == "") {
        alert("用户名不能为空！");
        register.username.focus();
        return false;
    }

    if (register.password.value.length <= 6 || typeof (register.password.value) == "number") {
        alert("用户设置的密码必须比6位大并且不能是纯数字！");
        register.password.focus();
        return false;
    }
}