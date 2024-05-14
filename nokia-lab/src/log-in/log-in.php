<?php
session_start();

include("db.php");

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $email = $_POST['email'];
    $password = $_POST['psw'];

    if(!empty($email) && !empty($password) && !is_numeric($email)){
        $query = "SELECT * FROM users WHERE EMAIL = ?";
        $stmt = mysqli_prepare($conn, $query);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $email);
            
            mysqli_stmt_execute($stmt);
            
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $user_data = mysqli_fetch_assoc($result);
                if ($user_data['PASSWORD'] == $password) {
                    echo "Success";
                } else {
                    echo "Incorrect password";
                }
            } else {
                echo "User not found";
            }
            
            mysqli_stmt_close($stmt);
        }
    }
}
?>
