
import React, { useEffect, useRef, useState } from 'react'
import { get_date, getCookie, setCookie, validate_number, validateEmail } from '../funtions/main'
import close from "../Images/close.webp"
import axios from 'axios'

const Form = ({ form_type, toggle_form, prepopulated_data }) => {
    let [state, setState] = useState({ 'loader': false, form_type, show_error_popup: false, error_popup_message: "" })
    let ref = useRef({})
    let ref2 = useRef({})
    let baseURL = 'https://ptmainserver.netlify.app/.netlify/functions/api'

    function showErr(showError, message = "", id = "") { //showing validiation error message
        if (showError === true) {
            let element = ref2.current[id]
            element.style.display = "block"
            element.innerHTML = message
        }
        else {
            let errorMsgElements = ref2.current;
            for (let i in errorMsgElements) {
                errorMsgElements[i].style.display = "none"
            }
        }
    }


    function handle_error(err) {
        console.log(err)
        if (err.status === 403) {
            setCookie("UT", "")
            toggle_form(true, "login")
        }
        else {
            alert("Error, please try again")
            console.log(err);
        }
        show_loader(false)
    }

    function show_loader(value) {
        setState((state) => ({ ...state, 'loader': value }))
    }

    useEffect(() => {
        if (form_type === "edit_data") {
            ref.current['fullName'].value = prepopulated_data.full_name
            ref.current['email'].value = prepopulated_data.email
            ref.current['mobile'].value = prepopulated_data.mobile
            ref.current['post'].value = prepopulated_data.post

            ref.current['joinDate'].value = get_date(prepopulated_data.join_date)
            ref.current['leaveDate'].value = get_date(prepopulated_data.leave_date)
            ref.current['address'].value = prepopulated_data.full_name
            ref.current['experience'].value = prepopulated_data.experience
            ref.current['salary'].value = prepopulated_data.salary
            ref.current['city'].value = prepopulated_data.city
            ref.current['state'].value = prepopulated_data.state
            ref.current['country'].value = prepopulated_data.country
            ref.current['postalCode'].value = prepopulated_data.postal_code
            ref.current['gender'].value = prepopulated_data.gender
            ref.current['dob'].value = prepopulated_data.dob
        }
    }, [form_type])  // eslint-disable-line react-hooks/exhaustive-deps



    function submit_data_form() { //form submitting function
        showErr(false)
        let full_name = ref.current["fullName"].value
        let email = ref.current["email"].value
        let dob = ref.current["dob"].value
        let country = ref.current["country"].value
        let state_name = ref.current["state"].value
        let city = ref.current["city"].value
        let gender = ref.current["gender"].value
        let postalCode = ref.current["postalCode"].value
        let mobile = ref.current["mobile"].value
        let join_date = ref.current["joinDate"].value
        let leave_date = ref.current["leaveDate"].value
        let post = ref.current["post"].value
        let address = ref.current['address'].value
        let experience = ref.current["experience"].value
        let salary = ref.current["salary"].value
        // console.log(new Date(join_date))
        // console.log(new Date(leave_date))
        let isError = false;
        if (full_name === undefined || full_name.trim() === "") {
            showErr(true, "Enter Full Name", "fullNameErr")
            isError = true
        }
        else if (/^[A-Za-z ]+$/.test(full_name, true) === false) {
            showErr(true, "Only Alphabets are Allowed", "fullNameErr")
            isError = true
        }

        if (address === undefined || address.trim() === "") {
            showErr(true, "Enter Address", "addressErr")
            isError = true
        }

        if (post === undefined || post.trim() === "") {
            showErr(true, "Enter Post", "postErr")
            isError = true
        }

        else if (/^[A-Za-z ]+$/.test(post, true) === false) {
            showErr(true, "Only Alphabets are Allowed", "postErr")
            isError = true
        }
        if (mobile === undefined || mobile.trim() === "") {
            showErr(true, "Enter Mobile", "mobileErr")
            isError = true
        }
        else if (mobile.length !== 10) {
            showErr(true, "Invalid Mobile", "mobileErr")
            isError = true
        }
        else if (validate_number(mobile.trim()) === false) {
            showErr(true, "Only Numbers Allowed", "mobileErr")
            isError = true
        }

        if (experience === undefined || experience.trim() === "") {
            showErr(true, "Enter Experience", "experienceErr")
            isError = true
        }
        else if (validate_number(experience.trim()) === false) {
            showErr(true, "Only Numbers Allowed", "experienceErr")
            isError = true
        }

        if (salary === undefined || salary.trim() === "") {
            showErr(true, "Enter Salary", "salaryErr")
            isError = true
        }
        else if (validate_number(salary, true) === false) {
            showErr(true, "Invalid Salary Entered", "salaryErr")
            isError = true
        }

        if (email === undefined || email.trim() === "") {
            showErr(true, "Enter Email", "emailErr")
            isError = true
        }
        else if (validateEmail(email) === false) {
            showErr(true, "Invalid Email", "emailErr")
            isError = true
        }

        if (city === undefined || city.trim() === "") {
            showErr(true, "Enter City", "cityErr")
            isError = true
        }
        else if (validate_number(city.trim(), true)) {
            showErr(true, "No Numbers Allowed", "cityErr")
            isError = true
        }

        if (state_name === undefined || state_name.trim() === "") {
            showErr(true, "Enter State", "stateErr")
            isError = true
        }
        else if (validate_number(state_name.trim(), true)) {
            showErr(true, "No Numbers Allowed", "stateErr")
            isError = true
        }
        if (country === undefined || country.trim() === "") {
            showErr(true, "Enter Country", "countryErr")
            isError = true
        }
        else if (validate_number(country.trim(), true)) {
            showErr(true, "No Numbers Allowed", "countryErr")
            isError = true
        }

        if (postalCode === undefined || postalCode.trim() === "") {
            showErr(true, "Enter Postal Code", "postalCodeErr")
            isError = true
        }


        else if (validate_number(postalCode.trim()) === false) {
            showErr(true, "Only Numbers Allowed", "postalCodeErr")
            isError = true
        }
        if (gender === "") {
            showErr(true, "Select gender", "genderErr")
            isError = true
        }
        if (dob === undefined || dob.trim() === "") {
            showErr(true, "Enter Date Of Birth", "dobErr")
            isError = true
        }

        else if (new Date(dob).getFullYear() > (new Date() - 1)) {
            showErr(true, "Invalid Date Of Birth", "dobErr")
            isError = true
        }

        if (join_date === undefined || join_date.trim() === "") {
            showErr(true, "Enter Date Of Birth", "joinDateErr")
            isError = true
        }
        else if (new Date(leave_date).getTime() <= new Date(join_date).getTime()) {
            showErr(true, "Leave Date cannot be less than join date", "leaveDateErr")
            isError = true
        }
        else if (new Date(join_date).getTime() >= new Date(leave_date).getTime()) {
            showErr(true, "Join Date cannot be greater than leave date", "leaveDateErr")
            isError = true
        }
        else if (new Date(dob).getTime() >= (new Date(leave_date).getTime() || new Date(join_date).getTime())) {
            showErr(true, "Join Date cannot be greater than leave date", "leaveDateErr")
            isError = true
        }

        if (join_date === undefined || join_date.trim() === "") {
            showErr(true, "Enter Date Of Birth", "dobErr")
            isError = true
        }

        if (isError === true) {
            setState((state) => ({ ...state, "show_error_popup": true }))
            setTimeout(() => {
                setState((state) => ({ ...state, "show_error_popup": false }))
            }, 1500)
        }
        else {
            show_loader(true)
            let body = {
                full_name,
                email,
                dob,
                country,
                state: state_name,
                join_date: join_date,
                leave_date: leave_date,
                city,
                gender,
                salary,
                address,
                experience,
                postal_code: postalCode,
                mobile,
                post
            }

            let request_type = 'post'

            if (form_type === 'edit_data') {
                request_type = "put"
                body["id"] = prepopulated_data['id']
            }

            axios({
                method: request_type,  // You can specify any HTTP method here: 'get', 'post', 'put', 'delete', etc.
                url: `${baseURL}/employee`,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('UT')
                }
            })
                .then(response => {
                    let data = response.data
                    if (data["status"] === "success") {
                        alert(data["message"])
                        setState((state) => ({ ...state, loader: false }))
                        toggle_form(true)
                        window.location.reload(false)
                    }
                })
                .catch(error => {
                    handle_error(error)
                });
        }
    }

    function manage_error_popup(value, error_popup_message = "Please fill valid values in fields") {
        setState((state) => ({ ...state, "show_error_popup": value, "error_popup_message": error_popup_message }))
    }

    function submit_login_form() {
        showErr(false)
        let email = ref.current["email"].value
        let password = ref.current["password"].value

        let isError = false;

        if (email === undefined || email.trim() === "") {
            showErr(true, "Enter Email", "emailErr")
            isError = true
        }
        else if (validateEmail(email) === false) {
            showErr(true, "Invalid Email", "emailErr")
            isError = true
        }
        if (password === undefined || password.trim() === "") {
            showErr(true, "Enter Password", "passwordErr")
            isError = true
        }

        if (isError === true) {
            manage_error_popup(true)
            setTimeout(() => {
                manage_error_popup(false)
            }, 1500)
        }

        else {
            show_loader(true)
            let body = {
                email,
                password
            }

            axios({
                method: 'post',  // You can specify any HTTP method here: 'get', 'post', 'put', 'delete', etc.
                url: `${baseURL}/employee/login`,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('UT')
                }
            })
                .then(response => {
                    let data = response.data
                    setCookie("UT", data.token)
                    alert("Welcome " + body.email)
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                    let error_message = error.response.data.message;
                    if (error_message === "wrong_email" || error_message === "wrong_password") {
                        let message = error_message === 'wrong_email' ? "wrong email entered" : "wrong password entered"
                        manage_error_popup(true, message)
                        setTimeout(() => {
                            manage_error_popup(false)
                        }, 2000)

                        show_loader(false)
                    }
                    else {
                        handle_error(error)
                    }
                });
        }

    }



    function display_form_heading() {
        if (state.form_type === "add_data") {
            return "Add Data"
        }
        if (state.form_type === "edit_data") {
            return "Edit Data"
        }
        if (state.form_type === "login") {
            return "Login"
        }
    }


    function error_popup_layout() {
        return <div className={form_type !== "login" ? "error_popup" : "error_popup login_error_popup"}>
            {state.error_popup_message}
        </div>
    }
    function decide_form_layout() {
        if (state.form_type === "add_data" || state.form_type === "edit_data") {
            return (<>
                <div className="formMainHeading">{display_form_heading() + " data"}</div>
                <div className="formHeading">Full Name</div>
                <input ref={el => ref.current["fullName"] = el} type="text" className="formInput" id="fullName" />
                <span className="errMsg" ref={el => ref2.current["fullNameErr"] = el} id="fullNameErr"></span>
                <div className="formHeading">Mobile</div>
                <input ref={el => ref.current["mobile"] = el} type="text" className="formInput" id="mobile" />
                <span className="errMsg" ref={el => ref2.current["mobileErr"] = el} id="mobileErr"></span>
                <div className="formHeading">Email</div>
                <input ref={el => ref.current["email"] = el} type="email" className="formInput" id="email" />
                <span className="errMsg" ref={el => ref2.current["emailErr"] = el} id="emailErr"></span>
                <div className="formHeading">City</div>
                <input ref={el => ref.current["city"] = el} type="text" className="formInput" id="city" />
                <span className="errMsg" ref={el => ref2.current["cityErr"] = el} id="cityErr"></span>
                <div className="formHeading">State</div>
                <input ref={el => ref.current["state"] = el} type="text" className="formInput" id="state" />
                <span className="errMsg" ref={el => ref2.current["stateErr"] = el} id="stateErr"></span>
                <div className="formHeading">Country</div>
                <input ref={el => ref.current["country"] = el} type="text" className="formInput" id="country" />
                <span className="errMsg" ref={el => ref2.current["countryErr"] = el} id="countryErr"></span>
                <div className="formHeading">Postal Code</div>
                <input ref={el => ref.current["postalCode"] = el} type="text" className="formInput" id="postalCode" />
                <span className="errMsg" ref={el => ref2.current["postalCodeErr"] = el} id="postalCodeErr"></span>
                <div className="formHeading">Post</div>
                <input type="text" ref={el => ref.current["post"] = el} className="formInput" id="post" />
                <span className="errMsg" ref={el => ref2.current["postErr"] = el} id="postErr"></span>

                <div className="formHeading">Address</div>
                <textarea ref={el => ref.current["address"] = el} className="formInput" id="address" />
                <span className="errMsg" ref={el => ref2.current["addressErr"] = el} id="addressErr"></span>

                <div className="formHeading">Experience</div>
                <input type="text" ref={el => ref.current["experience"] = el} className="formInput" id="experience" />
                <span className="errMsg" ref={el => ref2.current["experienceErr"] = el} id="experienceErr"></span>


                <div className="formHeading">Salary(P.A.)</div>
                <input ref={el => ref.current["salary"] = el} type="text" className="formInput" id="salary" />
                <span className="errMsg" ref={el => ref2.current["salaryErr"] = el} id="salaryErr"></span>


                <div className="formHeading">Gender</div>
                <div className="inputContainer">
                    <select className="formInput" id='gender' ref={el => ref.current["gender"] = el} >
                        <option value="">Select gender</option>
                        <option value={"male"}>male</option>
                        <option value={"female"}>female</option>
                        <option value={"others"}>others</option>
                    </select>
                </div>
                <span className="errMsg" ref={el => ref2.current["genderErr"] = el} id="genderErr"></span>
                <div className="formHeading">Date Of Birth</div>
                <input ref={el => ref.current["dob"] = el} type="date" className="formInput" id="dob" />
                <span className="errMsg" ref={el => ref2.current["dobErr"] = el} id="dobErr"></span>

                <div className="formHeading">Join Date</div>
                <input ref={el => ref.current["joinDate"] = el} type="date" className="formInput" id="joinDate" />
                <span className="errMsg" ref={el => ref2.current["joinDateErr"] = el} id="joinDateErr"></span>


                <div className="formHeading">Leave Date</div>
                <input ref={el => ref.current["leaveDate"] = el} type="date" className="formInput" id="leaveDate" />
                <span className="errMsg" ref={el => ref2.current["leaveDateErr"] = el} id="leaveDate"></span>


                <button className="formSubmit" onClick={submit_data_form}>Submit</button>
            </>)
        }
        else if (state.form_type === "login") {
            return (<>
                <div className="formMainHeading">{display_form_heading()}</div>
                <div className="formHeading">Email</div>
                <input ref={el => ref.current["email"] = el} type="email" className="formInput" id="email" />
                <span className="errMsg" ref={el => ref2.current["emailErr"] = el} id="emailErr"></span>
                <div className="formHeading">Password</div>
                <input ref={el => ref.current["password"] = el} type="password" className="formInput" id="password" />
                <span className="errMsg" ref={el => ref2.current["passwordErr"] = el} id="passwordErr"></span>
                <button className="formSubmit" onClick={submit_login_form}>Submit</button>
            </>)
        }

    }

    return (<>
        {state["loader"] === true ? <div className="loader">Processing, Please Wait...</div>
            : null}
        <div className="form_background"></div>
        <div className="formContainer">
            {state.show_error_popup && error_popup_layout()}
            {form_type !== "login" && <img src={close} alt='close icon' height={50} width={50} loading='lazy' className='close' onClick={() => toggle_form(false)} />}

            {decide_form_layout()}
        </div>
    </>
    )
}

export default Form
