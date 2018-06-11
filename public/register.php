<?php
session_start();
if (!isset($_POST['submit'])) {
    exit('非法访问!');
}
$link = mysqli_connect("localhost", "root", "123456") or die("数据库未连接" . mysqli_error());
$db_selected = mysqli_select_db("escape", $link);

$username = ($_POST['username']);
$password = ($_POST['password']);

$check_query = mysqli_query("SELECT * FROM users where userName='$username' ");
if ($result=mysqli_fetch_array($check_query)) {
    echo '错误：用户名 ', $username, ' 已存在。<a href="javascript:history.back(-1);">返回</a>';
    exit;
}
$sql="INSERT INTO users(userName,password) VALUES ('$username','$password')";
mysqli_query($sql1,$link);
if(mysqli_query($sql,$link)){
    $_SESSION['username'] = $username;
    echo $username,'用户注册成功！点击此处 <a href="FirstPage.php">首页</a>';
} else {
    echo '抱歉！添加数据失败：',mysqli_error(),'<br />';
    echo '点击此处 <a href="javascript:history.back(-1);">返回</a> 重试';
}
