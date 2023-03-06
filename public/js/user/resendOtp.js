var resend_otp = document.getElementById('resend-otp');
// var success_otp = document.getElementById('otp-success');
// var verify_btn = document.getElementById('verify-btn');
var timeLeft = 5;


    var otpTimer = setInterval(()=>{
        if(timeLeft<=0){
            clearInterval(otpTimer);
            resend_otp.innerHTML = `<a href="/ResendOtp" id="resend-otp">Resend otp</a>`;
            
        }else{
           
            resend_otp.innerHTML = `<a href="#" class="text-light" id="resend-otp">resend otp in ${timeLeft}</a>`;
        }
        timeLeft-=1;
    },1000);

    // verify_btn.addEventListener('click',()=>{
    //     success_otp.style = "visibility:hidden";
    // })