<?php
session_start();

@$link = mysqli_connect("localhost", "root", "970511","escape") or die("数据库未连接" . mysqli_error());
//$db_selected = mysqli_select_db("escape", $link);

@$username = ($_POST["username"]);
@$password = ($_POST["password"]);


@$check_query = mysqli_query($link,"SELECT * FROM users where userName='$username' ");
if (@$result=mysqli_fetch_array($check_query)) {
    echo '错误：用户名 ', $username, ' 已存在。<a href="javascript:history.back(-1);">返回</a>';
    exit;
}
@$sql="INSERT INTO users(userName,password) VALUES ('$username','$password')";
//mysqli_query(@$link,@$sql);
if(mysqli_query(@$link,@$sql)){
    header("Location:chooseCharacter.html");
} else {
    echo @$username;
    echo @$password;
    echo '抱歉！添加数据失败：',mysqli_error($link),'<br />';
    echo '点击此处 <a href="javascript:history.back(-1);">返回</a> 重试';
}
