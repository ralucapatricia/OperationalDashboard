<?php
    session_start();

    include("db.php");

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $user_name = $_POST['uname'];
        $email = $_POST['email'];
        $password = $_POST['psw'];
        $telephone = $_POST['tel'];
        $birth_day = $_POST['date'];

        if(!empty($email) && !empty($password) && !empty($telephone) && !empty($birth_day) && !empty($user_name) && !is_numeric($email) && is_numeric($telephone)){
            $query = "insert into users (USERNAME, EMAIL, PASSWORD, PHONE_NUMBER, BIRTH_DATE) values('$user_name','$email','$password','$telephone','$birth_day')";
            mysqli_query($conn,$query);
            echo '<script>alert("success")</script>';
        }
        else{
            echo '<script>alert("please enter valid information")</script>';
        }
    }
?>