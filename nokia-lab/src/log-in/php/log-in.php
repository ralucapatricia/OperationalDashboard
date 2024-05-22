<?php
session_start();

include("db.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
// Trimiterea email-ului de aprobare folosind PHPMailer
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $email = $_POST['email'];
    $password = $_POST['psw'];

    if (!empty($email) && !empty($password) && !is_numeric($email)) {
        $query = "SELECT u.*, r.NUME_ROL FROM users u
                  JOIN users_to_roles ur ON u.ID = ur.USER_ID
                  JOIN roles r ON ur.ROLE_ID = r.ID
                  WHERE u.EMAIL = ?";
        $stmt = mysqli_prepare($conn, $query);
        var_dump($email); // Verifică dacă adresa de email este preluată corect din formular
var_dump($password); // Verifică dacă parola este preluată corect din formular
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $user_data = mysqli_fetch_assoc($result);
                
                // Assuming passwords are stored in plain text for simplicity
                // In practice, use password_hash and password_verify
                if (password_verify($password, $user_data['PASSWORD'])){
                    $role = $user_data['NUME_ROL'];
                    if ($role == 'user_basic') {


                        $mail = new PHPMailer(true);

                        try {
                            //Server settings
                            $mail->isSMTP();
                            $mail->SMTPDebug = 2; // 1 pentru mesaje mai detaliate, 2 pentru debug complet

                            $mail->Host = 'smtp.gmail.com';
                            $mail->SMTPAuth = true;
                            $mail->Username = 'tnokia532@gmail.com';
                            $mail->Password = 'qweasdzxc4432';
                            $mail->SMTPSecure = 'tls';
                            $mail->Port = 587;
                            $mail->SMTPOptions = array(
                                'ssl' => array(
                                        'verify_peer' => false,
                                        'verify_peer_name' => false,
                                        'allow_self_signed' => true
                                )
                                );
                            $mail->CharSet = 'UTF-8';

                            //Recipients
                            $mail->setFrom('tnokia532@gmail.com', 'login');
                            $mail->addAddress($email, ' '); // Target email

                            //Content
                            $mail->isHTML(true);
                            $mail->Subject = 'Approval Needed for Basic User Login';
                            $mail->Body    = 'User ' . $user_data['EMAIL'] . ' has logged in and requires approval.';

                            $mail->send();
                            echo json_encode(['status' => 'Success', 'role' => 'user_basic']);
                        } catch (Exception $e) {
                            echo json_encode(['status' => 'Error', 'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
                        }
                    } else {
                        echo json_encode(['status' => 'Success', 'role' => $role]);
                    }
                } else {
                    echo json_encode(['status' => 'Error', 'message' => 'Incorrect password']);
                }
            } else {
                echo json_encode(['status' => 'Error', 'message' => 'User not found']);
            }

            mysqli_stmt_close($stmt);
        }
    }
}
?>
