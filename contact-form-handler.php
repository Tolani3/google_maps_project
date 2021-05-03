<?php

$errors = '';
$myemail = 'nofire.rc@gmail.com'; //<-----Put your DkIT email address here.
if (
    empty($_POST['name'])  ||
    empty($_POST['email']) ||
    empty($_POST['message']) ||
    empty($_POST['g-recaptcha-response'])
) {
    $errors .= "\n Error: all fields are required";
}

$name = $_POST['name'];
$email_address = $_POST['email'];
$message = $_POST['message'];
$captcha = $_POST['g-recaptcha-response'];

$errormessage = 'Please check the the captcha form.';
if (!$captcha) {
    //What you do here is up to you!
    echo "<SCRIPT> 
  alert('$errormessage')
  window.location.replace('index.html#contact');
</SCRIPT>";
}
//exit;

if (!preg_match(
    "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i",
    $email_address
)) {
    $errors .= "\n Error: Invalid email address";
}

$secretKey = "6Lcb9rsaAAAAAHJSGUrujIRU61Leqz5vobArhPBd";
$ip = $_SERVER['REMOTE_ADDR'];


if (empty($errors)) {
    $to = $myemail;
    $email_subject = "Contact form submission: $name";
    $email_body = "You have received a new message. " .
        " Here are the details:\n Name: $name \n Email: $email_address \n Message \n $message";

    $headers = "From: $myemail\n";
    $headers .= "Reply-To: $email_address";

    mail($to, $email_subject, $email_body, $headers);
    //redirect to the 'thank you' page
    header('Location: contact-form-thank-you.html');
}
?>
<!DOCTYPE HTML>
<html>

<head>
    <title>Contact form handler</title>
</head>

<body>
    <!-- This page is displayed only if there is some error -->
    <?php
    echo nl2br($errors);
    ?>


</body>

</html>