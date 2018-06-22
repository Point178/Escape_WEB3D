function InputCheck(register) {
    if(register.username.value.length > 8){
        alert("用户名不能超过8位！");
        register.username.focus();
        return false;
    }
}