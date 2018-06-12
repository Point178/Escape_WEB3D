<?php
session_start();

@$link = mysqli_connect("localhost", "root", "970511","escape") or die("数据库未连接" . mysqli_error());

@$username = ($_POST["username"]);
@$password = ($_POST["password"]);

@$check_query = mysqli_query($link,"SELECT * FROM users where userName='$username' and password='$password' ");

if (@$result=mysqli_fetch_array($check_query)) {
    header("Location:chooseCharacter.html");
}else{
    echo '用户名或密码错误，请重新登录';
    echo '点击此处 <a href="javascript:history.back(-1);">返回</a> 重试';
}
