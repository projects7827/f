import { useState, useRef, useEffect } from 'react';
import './App.css';
import arrowImg from "./Images/arrow.webp"


function App() {
  let baseURL = 'https://ptserver.netlify.app/.netlify/functions/api/'
  // let baseURL = 'http://localhost:1000/'
  let ref = useRef({})
  let ref2 = useRef({})
  let ref3 = useRef({})

  const [state, setState] = useState({ "selectedCountryCode": "", "subLoader1": true, "countryData": [], "stateData": [{ "isoCode": "", "name": "Select State" }], "cityData": [{ "isoCode": "", "name": "Select City" }], "section": "form", "showLoader": false, "loaderMessage": "", "userData": [] })

  function redirectSection(value) {
    if (value === "details") {
      showLoader(true, "Loading...")
    }
    setState((state) => ({ ...state, "section": value }))
  }

  function getInputData(type = "", countryCode = "", stateCode = "") {
    let loaderKey = "", dataKey = "", url = `${baseURL}get-input-data?type=${type}`, selectedCountryCode = "", key;

    if (type === "get_country") {
      loaderKey = "subLoader1"
      dataKey = "countryData"
      key = "country"
    }
    if (type === "get_state") {
      loaderKey = "subLoader2"
      dataKey = "stateData"
      key = "state"
      selectedCountryCode = countryCode
    }
    if (type === "get_city") {
      loaderKey = "subLoader3"
      key = "city"
      dataKey = "cityData"
      selectedCountryCode = countryCode
    }

    setState((state) => ({ ...state, [loaderKey]: true, "selectedCountryCode": selectedCountryCode }))
    if (countryCode !== "") {
      url = url + `&country_code=` + countryCode
    }
    if (stateCode !== "") {
      url = url + `&state_code=` + stateCode
    }
    fetch(url).then((res) => {
      if (res.status === 200 || res.status === 201) {
        return res.json()
      }
      else {
        throw new Error(res)
      }

    }).then((data) => {
      if (data["status"] === "success") {
        let finalData = data.data

        if (finalData.length === 0) {
          finalData.unshift({ "isoCode": "", "name": "no results Found" })
        }
        else {
          finalData.unshift({ "isoCode": "", "name": "Select " + key })
        }
        setState((state) => ({ ...state, [loaderKey]: false, [dataKey]: finalData }))
        showLoader(false)
      }
    }).catch((err) => {
      console.log("Error, Please Try Again")
      console.log(err)
      showLoader(false)
      redirectSection("form")
    })
  }

  function showLoader(show, loaderMessage = "") {
    setState((state) => ({ ...state, "showLoader": show, "loaderMessage": loaderMessage }))
  }

  function getSelectedGender() {
    let gender = ref3.current;
    for (let i in gender) {
      if (gender[i].checked) {
        return gender[i].id
      }
    }
  }
  useEffect(() => {
    if (state["section"] === "details") {
      getDetailData();
    }
  }, [state["section"]])  // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    getInputData("get_country")
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  function getDetailData() {// get user info detail
    fetch(`${baseURL}get-data`).then((res) => {
      if (res.status === 200 || res.status === 201) {
        return res.json()
      }
      else {
        throw new Error(res)
      }
    }).then((data) => {
      if (data["status"] === "success") {
        setState((state) => ({ ...state, "userData": data.data }))
        showLoader(false)
      }
    }).catch((err) => {
      console.log("Error, Please Try Again")
      console.log(err)
      showLoader(false)
      redirectSection("form")
    })
  }

  function format_time(time, enable_utc = true) { //time formatting function
    var mydate = new Date(time);
    let data = { "day": "numeric", "month": "short", "year": "numeric", "hour": "numeric", "minute": "numeric" }
    if (enable_utc === true) {
      data["timeZone"] = "UTC"
    }
    return mydate.toLocaleDateString('en-US', data)
  }

  function validateEmail(email) { //email validation function
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return emailRegex.test(email);
  }

  function submitForm() { //form submitting function
    showErr(false)
    let first_name = ref.current["firstName"].value
    let last_name = ref.current["lastName"].value
    let email = ref.current["email"].value
    let dob = ref.current["dob"].value
    let countryCode = ref.current["country"].value
    let stateCode = ref.current["state"].value
    let cityCode = ref.current["city"].value
    let countryName = document.querySelectorAll("#country option")[ref.current["country"].selectedIndex].id
    let stateName = document.querySelectorAll("#state option")[ref.current["state"].selectedIndex].id
    let cityName = document.querySelectorAll("#city option")[ref.current["city"].selectedIndex].id

    let age = ref.current["age"].value
    let selectedGender = getSelectedGender()
    let isError = false;
    if (first_name === undefined || first_name.trim() === "") {
      showErr(true, "Enter First Name", "firstNameErr")
      isError = true
    }
    else if (/^[A-Za-z ]+$/.test(first_name) === false) {
      showErr(true, "Only Alphabets are Allowed", "firstNameErr")
      isError = true
    }
    if (last_name === undefined || last_name.trim() === "") {
      showErr(true, "Enter Last Name", "lastNameErr")
      isError = true
    }
    else if (/^[A-Za-z ]+$/.test(last_name) === false) {
      showErr(true, "Only Alphabets are Allowed", "lastNameErr")
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
    if (countryCode === undefined) {
      showErr(true, "Enter Country", "countryErr")
      isError = true
    }

    if (stateCode === undefined || stateCode.trim() === "") {
      showErr(true, "Enter State", "stateErr")
      isError = true
    }

    if (cityCode === undefined) {
      showErr(true, "Enter City", "cityErr")
      isError = true
    }


    if (dob === undefined || dob.trim() === "") {
      showErr(true, "Enter Date Of Birth", "dobErr")
      isError = true
    }

    else if ((new Date().getFullYear() - new Date(dob).getFullYear()) < 14) {
      showErr(true, "User cant be less than 14", "dobErr")
      isError = true
    }
    else if (new Date(dob).getFullYear() > (new Date() - 1)) {
      showErr(true, "Invalid Date Of Birth", "dobErr")
      isError = true
    }

    if (isError === false) {
      showLoader(true, "Submitting Data...")
      let body = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "dob": dob,
        "country": countryName,
        "state": stateName,
        "city": cityName,
        "age": age,
        "gender": selectedGender,
      }

      let options = {
        "method": "post",
        "body": JSON.stringify(body),
        "headers": {
          'Content-Type': 'application/json'
        }
      }
      fetch(`${baseURL}submit`, options).then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.json()
        }
        else {
          throw new Error(res)
        }
      }).then((data) => {
        if (data["status"] === "success") {
          alert(data["message"])
          window.location.reload();
        }
      }).catch((err) => {
        alert("Error, Please Try Again")
        showLoader(false)
        console.log(err)
      })
    }
  }



  function detailsLayout() {
    return (<>
      <div className="detailsContainer">
        <table className="detailsTable">
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Country</th>
          <th>State</th>
          <th>City</th>
          <th>Gender</th>
          <th>Age</th>
          <th>Date Of Birth</th>
          {state["userData"].map((value,index) => {
            return (<>
              <tr key={index}>
                <td>{value["first_name"]}</td>
                <td>{value["last_name"]}</td>
                <td>{value["email"]}</td>
                <td>{value["country"]}</td>
                <td>{value["state"]}</td>
                <td>{value["city"]}</td>
                <td>{value["gender"]}</td>
                <td>{value["age"]}</td>
                <td>{format_time(value["dob"])}</td>
              </tr>
            </>)
          })}
        </table>
      </div>
    </>)
  }

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


  function processAge(dob) { //processing age according to date of birth
    let currentDate, age = "";
    dob = new Date(dob);
    currentDate = new Date()
    if (dob === undefined) {
      showErr(true, "Enter Date Of Birth", "dobErr")
    }
    else if ((currentDate.getFullYear() - dob.getFullYear()) <= 14) {
      showErr(true, "User cant be less than 14", "dobErr")
    }
    else {
      age = currentDate.getFullYear() - dob.getFullYear()
      showErr(false)
    }
    console.log(age)

    if (age !== "") {
      ref.current["age"].value = age
    }
  }

  function formLayout() { //layout for form
    return (<>
      <div className="formContainer">
        <div className="formMainHeading">Fill The Form</div>
        <div className="formHeading">First Name</div>
        <input ref={el => ref.current["firstName"] = el} type="text" className="formInput" id="firstName" />
        <span className="errMsg" ref={el => ref2.current["firstNameErr"] = el} id="firstNameErr"></span>
        <div className="formHeading">Last Name</div>
        <input ref={el => ref.current["lastName"] = el} type="text" className="formInput" id="lastName" />
        <span className="errMsg" ref={el => ref2.current["lastNameErr"] = el} id="lastNameErr"></span>
        <div className="formHeading">Email</div>
        <input ref={el => ref.current["email"] = el} type="email" className="formInput" id="email" />
        <span className="errMsg" ref={el => ref2.current["emailErr"] = el} id="emailErr"></span>
        <div className="formHeading">Country</div>
        {state["subLoader1"] === true ?
          <div className='inputLoader'>
            <div className='loaderSpinner'></div>
          </div> :
          <select ref={el => ref.current["country"] = el} id="country" className="formInput" onChange={(e) => getInputData("get_state", e.target.value)}>
            {state["countryData"].map((value,index) => {
              return <option key={index} id={value["name"]} value={value["isoCode"]}>{value["name"]}</option>
            })}
          </select>}
        <span className="errMsg" ref={el => ref2.current["countryErr"] = el} id="countryErr"></span>


        <div className="formHeading">State</div>
        {state["subLoader2"] === true ?
          <div className='inputLoader'>
            <div className='loaderSpinner'></div>
          </div> :
          <select ref={el => ref.current["state"] = el} id="state" className="formInput" onChange={(e) => getInputData("get_city", state["selectedCountryCode"], e.target.value)}>
            {state["stateData"].map((value,index) => {
              return <option key={index} id={value["name"]} value={value["isoCode"]}>{value["name"]}</option>
            })}
          </select>}
        <span className="errMsg" ref={el => ref2.current["stateErr"] = el} id="stateErr"></span>


        <div className="formHeading">City</div>
        {state["subLoader3"] === true ?
          <div className='inputLoader'>
            <div className='loaderSpinner'></div>
          </div> :
          <select ref={el => ref.current["city"] = el} id="city" className="formInput">
            {state["cityData"].map((value,index) => {
              return <option key={index} id={value["name"]} value={value["isoCode"]}>{value["name"]}</option>
            })}
          </select>}
        <span className="errMsg" ref={el => ref2.current["cityErr"] = el} id="cityErr"></span>

        {/* <input ref={el => ref.current["country"] = el} type="text" className="formInput" id="country" /> */}
        {/* <div className="formHeading">Country</div>
        <input ref={el => ref.current["country"] = el} type="text" className="formInput" id="country" />
        <span className="errMsg" ref={el => ref2.current["countryErr"] = el} id="countryErr"></span>
        <div className="formHeading">State</div>
        <input ref={el => ref.current["state"] = el} type="text" className="formInput" id="state" />
        <span className="errMsg" ref={el => ref2.current["stateErr"] = el} id="stateErr"></span>
        <div className="formHeading">City</div>
        <input ref={el => ref.current["city"] = el} type="text" className="formInput" id="city" />
        <span className="errMsg" ref={el => ref2.current["cityErr"] = el} id="cityErr"></span> */}

        <div className="formHeading">Gender</div>
        <div className="inputContainer">
          <label for="male" className="formLabel">
            <input ref={el => ref3.current["male"] = el} type="radio" name="gender" id="male" className="formInput formInput--radio" checked />Male
          </label>
          <label for="female" className="formLabel">
            <input ref={el => ref3.current["female"] = el} type="radio" name="gender" id="female" className="formInput formInput--radio" />Female
          </label>
          <label for="others" className="formLabel">
            <input ref={el => ref3.current["others"] = el} type="radio" name="gender" id="others" className="formInput formInput--radio" />Others
          </label>
        </div>
        <span className="errMsg" ref={el => ref2.current["genderErr"] = el} id="genderErr"></span>
        <div className="formHeading">Date Of Birth</div>
        <input ref={el => ref.current["dob"] = el} type="date" className="formInput" id="dob" onChange={(e) => processAge(e.target.value)} />
        <span className="errMsg" ref={el => ref2.current["dobErr"] = el} id="dobErr"></span>
        <div className="formHeading">Age</div>
        <input ref={el => ref.current["age"] = el} type="text" className="formInput" id="age" disabled />
        <span className="errMsg" ref={el => ref2.current["ageErr"] = el} id="ageErr"></span>
        <button className="formSubmit" onClick={submitForm}>Submit</button>
      </div>
    </>)
  }
  return (<>
    <div className="mainContainer">
      <div className="redirectionContainer">
        {state["section"] === "form" ?
          <div className="redirectToDetails redirectionBtns" onClick={() => redirectSection('details')}>
            See Details <img alt="arrow icon" src={arrowImg} height="30" width="30" loading='lazy' className="arrows rightArrow" />
          </div> : <div className="redirectToForm redirectionBtns" onClick={() => redirectSection('form')}>
            <img alt="arrow icon" src={arrowImg} height="30" width="30" className="arrows leftArrow" loading='lazy' />
            Go To Form
          </div>
        }
      </div>
      {state["section"] === "form" ? formLayout() : detailsLayout()}
      {state["showLoader"] === true ? <div className="loader">{state["loaderMessage"]}</div>
        : null}
    </div>

  </>

  );
}

export default App;




