<?php
    session_start();

    include("db.php");

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        
        $email = $_POST['email'];
        $password = $_POST['psw'];

        if(!empty($email) && !empty($password) && !is_numeric($email)){
            $query = "SELECT * FROM users WHERE EMAIL = '$email' LIMIT 1";
            $result = mysqli_query($conn, $query);

            if($result){
                if(mysqli_num_rows($result) > 0){
                    $user_data = mysqli_fetch_assoc($result);
                    if($user_data['PASSWORD'] == $password){
                        echo '<script>alert("success")</script>';
                        header('Location: log-in.js');
                    }

                }else {
                    echo '<script>alert("User not found")</script>';
                }
            }
        } 
    }
?>
