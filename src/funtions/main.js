
export function format_time(time, enable_utc = true) { //time formatting function
    if (time === undefined || time === null) {
        return null
    }
    var mydate = new Date(time);
    let data = { "day": "numeric", "month": "short", "year": "numeric", "hour": "numeric", "minute": "numeric" }
    if (enable_utc === true) {
        data["timeZone"] = "UTC"
    }
    return mydate.toLocaleDateString('en-US', data)
}

export function validateEmail(email) { //email validation function
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return emailRegex.test(email);
}

export function validate_number(value, allow_decimal_value = false) {
    if (allow_decimal_value) {
        return /^\d+(\.\d+)?$/.test(value)
    }
    return /^\d+$/.test(value)
}

export function get_date(value) { // get seprarted date in particular format from particular date and time
    let result;
    if (value !== null) {
        let date = new Date(value);
        let dateArr = date.toLocaleDateString("ja-JP", { "timeZone": "UTC" }).split("/");
        if (dateArr[1].length === 1) {
            dateArr[1] = "0" + dateArr[1]
        }
        if (dateArr[2].length === 1) {
            dateArr[2] = "0" + dateArr[2]
        }
        result = dateArr.join("-")
        return result;
    }
    return null;
}

export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


export function deleteCookie(name) {
    // Set the cookie's expiration date to a past date
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}