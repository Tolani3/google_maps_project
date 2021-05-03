var RC2KEY = '6Lcb9rsaAAAAAEIFaRqR7WdgzCxtqrSCaTEbPn7O',
    doSubmit = false;

function reCaptchaVerify(response) {
    if (response === document.querySelector('.g-recaptcha-response').value) {
        doSubmit = true;
    }
}

function reCaptchaExpired () {
    /* do something when it expires */
}

function reCaptchaCallback () {
    grecaptcha.render('id', {
        '6Lcb9rsaAAAAAEIFaRqR7WdgzCxtqrSCaTEbPn7O': RC2KEY,
        'callback': reCaptchaVerify,
        'expired-callback': reCaptchaExpired
    });
}

document.forms['form-name'].addEventListener('submit',function(e){
    if (doSubmit) {
        /* submit form or do something else */
    }
})