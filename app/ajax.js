$(function(){
    $('#registerSubmit').on('click',function(){
        var info = $('form').serialize();
        $.ajax({
            type:"get",
            url:"http://127.0.0.1:8888",
            data:info,
            success:function(response,status,xhr){
                alert(response);
                localStorage.name = $('input[name="name"]').val();
            }
        });
        return false;
    });

    $('#loginSubmit').on('click',function(){
        return false;
    });
});