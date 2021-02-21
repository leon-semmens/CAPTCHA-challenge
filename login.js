let tries = sessionStorage.getItem("tries") ? sessionStorage.getItem("tries") : 0;
if (tries > 3) {
    sessionStorage.setItem("tries", 0)
    tries = 0;
}

let stages = [
    "loginbox",
    "signupbox"
]

function setStage(num = 0) {
    sessionStorage.setItem("stage", stages[num])
    let stage = sessionStorage.getItem("stage")
    
    stages.forEach(id => {
        if (id == stage) {
            $(`#${id}`).show()
        } else {
            $(`#${id}`).hide()
        }
    })
}

if (!sessionStorage.getItem("stage")) sessionStorage.setItem("stage", stages[0]);

function loadStage() {
    let stage = sessionStorage.getItem("stage")
    
    stages.forEach(id => {
        if (id == stage) {
            $(`#${id}`).show()
        } else {
            $(`#${id}`).hide()
        }
    })
}

function goToHome() {
    setStage(0)
    window.location = "./home.html"
}

let completingCaptcha = false
async function runCaptcha(captcha) {
    return new Promise((resolve, reject) => {
        completingCaptcha = true
        let captchatries = 0

        let captchabox = $("#captcha")

        $("#captchaquestion").text(captcha.question)
        let answer = $("#captchaanswer")
        answer.val("")

        let error = $("#captchaerror")
        error.html("")

        $("#captchaconfirm").click(() => {
            if (captchatries > 3) { 
                captchabox.hide()
                completingCaptcha = false
                return resolve(false)
            }

            let number = Number(answer.val())
            if (isNaN(number) || number == null) {
                error.html("Answer must be a number")
                return
            }

            Api.checkCaptcha(captcha.id, answer.val()).then((response) => {
                if (response.completed) {
                    $("#captchaconfirm").click(false)
                    captchabox.hide()
                    completingCaptcha = false
                    resolve(true)
                } else {
                    error.html("Incorrect answer, try again")
                    captchatries++
                }
            })
        })

        captchabox.show()
    })
}

function login() {
    if (completingCaptcha) return;

    let username = $("#username")
    let password = $("#loginpassword")
    let error = $("#loginerror")
    error.html("")

    if (tries > 3) {
        return error.html("Out of tries (reload page to try again)")
    }

    if (username.val() == "" || password.val() == "") {
        return error.html("Both username and password fields must be filled")
    }

    //Having to use my database as browser wouldn't let me edit local files
    Api.login(username.val(), password.val()).then((response) => {
        if (response.exists) {
            Api.getCaptcha().then(captcha => {
                runCaptcha(captcha).then(completed => {
                    if (!completed) {
                        username.val("")
                        password.val("")
                        error.html("Failed captcha")
                        return
                    }
        
                    Api.login(username.val(), password.val(), captcha.id).then((response) => {
                        if (response.loggedin) {
                            localStorage.setItem("profile", JSON.stringify({
                                username: username.val(),
                                password: password.val(),
                                captchaid: captcha.id
                            }))
                            
                            goToHome()
                        } else {
                            error.html("Failed to login.")
                            username.val("")
                            password.val("")
                        }
                    })
                })
            })
        } else {
            error.html("Incorrect username or password.")
            password.val("")

            tries++
        }
    })
}

function signup() {
    if (completingCaptcha) return;

    let firstname = $("#firstname");
    let lastname = $("#lastname");
    let password = $("#signuppassword");
    let error = $("#signuperror");
    error.html("")

    if (firstname.val() == "" || lastname.val() == "" || password.val() == "") {
        return error.html("All fields must be filled")
    }

    Api.validatePassword(password.val()).then(response => {
        if (response.valid) {
            Api.getCaptcha().then(captcha => {
                runCaptcha(captcha).then(completed => {
                    if (!completed) {
                        username.val("")
                        password.val("")
                        error.html("Failed captcha")
                        return
                    }
        
                    Api.signup(firstname.val(), lastname.val(), password.val(), captcha.id).then(response => {
                        if (response.created) {
                            localStorage.setItem("profile", JSON.stringify({
                                username: response.username,
                                password: password.val(),
                                captchaid: captcha.id
                            }))
                            
                            goToHome()
                        } else {
                            error.html(response.reason)
                            password.val("")
                        }
                    })
                })
            })
        } else {
            error.html(response.reason)
            password.val("")
        }
    })
}

$(document).ready(() => {
    loadStage()

    $("#signup").click(signup)
    $("#login").click(login)
    $("#loginsignup").click(() => {setStage(1)})
    $("#signupback").click(() => {setStage(0)})
})
