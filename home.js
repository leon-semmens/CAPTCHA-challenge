let profile = JSON.parse(localStorage.getItem("profile"))

function logout() {
    localStorage.removeItem("profile")
    window.location = "./login.html"
}

// Didn't want to setup a token system
if (!profile) logout();

// Captcha id's are being used as tokens
Api.login(profile.username, profile.password, profile.captchaid).then(response => {
    if (!response.loggedin || !response.exists) {
        logout()
    }
}).catch(err => {
    logout()
})

function changepassword() {
    let currentpassword = $("#changepasswordcurrent")
    let newpassword1 = $("#changepasswordnew1")
    let newpassword2 = $("#changepasswordnew2")

    let error = $("#changepassworderror")
    error.html("")

    if (newpassword1.val() != newpassword2.val()) {
        error.html("New passwords must match")
        return
    }

    Api.validatePassword(newpassword1.val()).then(response => {
        if (response.valid) {
            Api.changePassword(profile.username, currentpassword.val(), newpassword1.val()).then(response => {
                if (response.changed) {
                    profile.password = newpassword1.val()
                    localStorage.setItem("profile", JSON.stringify(profile))

                    $("#notification").text("Password successfully changed")
                    $("#changepasswordbox").hide()
                } else {
                    error.html(response.reason)
                }
            })
        } else {
            error.html(response.reason)
        }
    })
}

$(document).ready(() => {
    Api.getUser(profile.username, profile.password).then(response => {
        if (response.exists) {
            let user = response.user
            $("#username").html(user.firstname + " " + user.lastname + "<br>Username: " + user.username)
        } else {
            logout()
        }
    })

    $("#changepassword").click(() => {
        $("#changepasswordbox").show()
    })
    $("#changepasswordcancel").click(() => {
        $("#changepasswordbox").hide()
    })
    $("#changepasswordconfirm").click(changepassword)
    $("#logout").click(logout)
})
