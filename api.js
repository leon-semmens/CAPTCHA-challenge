const TOKEN = "L30y4ATqjqGi6Wqwd79Y5vlq5rswOtAK.Tq50NhdN40vECNYY3nFsLbyprh8kZdPRw9nCPRrs" // DO NOT SHARE
const PROXY = "https://computer-science-db.herokuapp.com"

class Api {
    static async getCaptcha() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-captcha",
                type: "GET",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-Captcha-Data": JSON.stringify({
                        get: true
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }

    static async checkCaptcha(id, answer) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-captcha",
                type: "GET",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-Captcha-Data": JSON.stringify({
                        try: true,
                        id: id,
                        answer: answer
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }

    static async validatePassword(password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-validate-password",
                type: "POST",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-User-Validation": JSON.stringify({
                        password: password
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }

    static async changePassword(username, oldpassword, newpassword) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-change-password",
                type: "POST",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-User-Content": JSON.stringify({
                        username: username,
                        oldpassword: oldpassword,
                        newpassword: newpassword
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }

    static async login(username, password, captchaid = -1) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-validate-login",
                type: "POST",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-User-Validation": JSON.stringify({
                        username: username,
                        password: password,
                        captchaid: captchaid
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }

    static async signup(firstname, lastname, password, captchaid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-signup",
                type: "POST",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-User-Content": JSON.stringify({
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        captchaid: captchaid
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }

    static async getUser(username, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PROXY + "/captcha-project-user",
                type: "POST",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": TOKEN,
                    "X-User-Validation": JSON.stringify({
                        username: username,
                        password: password
                    })
                },
                success: resolve,
                error: reject
            })
        })
    }
}