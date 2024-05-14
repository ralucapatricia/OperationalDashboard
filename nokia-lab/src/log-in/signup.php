<?php
session_start();

include("db.php");

header("Access-Control-Allow-Origin: *");

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $user_name = $_POST['uname'];
    $email = $_POST['email'];
    $password = $_POST['psw'];
    $telephone = $_POST['tel'];
    $birth_day = $_POST['date'];

    if(!empty($email) && !empty($password) && !empty($telephone) && !empty($birth_day) && !empty($user_name) && !is_numeric($email) && is_numeric($telephone)){
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (USERNAME, EMAIL, PASSWORD, PHONE_NUMBER, BIRTH_DATE) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "sssss", $user_name, $email, $hashed_password, $telephone, $birth_day);
            
            if (mysqli_stmt_execute($stmt)) {
                echo "Success";
            } else {
                echo "Failed to register user";
            }
            
            mysqli_stmt_close($stmt);
        }
    } else {
        echo "Please enter valid information";
    }
}
?>
