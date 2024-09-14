
import { useState, useEffect } from 'react'
import { deleteCookie, format_time, getCookie, setCookie } from '../funtions/main'
import Form from './form'
import axios from 'axios'

const Details = () => {
    const [state, setState] = useState({ "show_form": false, "show_loader": false, "data": [], form_type: "add_data", selected_data: {} })
    // let baseURL = 'https://ptserver.netlify.app/.netlify/functions/api/'
    let baseURL = 'http://localhost:2000'

    function showLoader(show) {
        setState((state) => ({ ...state, "show_loader": show }))
    }

    useEffect(() => {
        get_data();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    function handle_error(err) {
        if (err.status === 403) {
            setCookie("UT", "")
            toggle_form(true, "login")
        }

        else {
            alert("Error, please try again")
            console.log(err);
        }
        showLoader(false)
    }

    async function get_data() {// get employee info

        try {
            showLoader(true)
            let response = await axios.get(`${baseURL}/employee`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('UT')}`
                }
            })
            setState((state) => ({ ...state, "data": response.data.data }))
            showLoader(false)

        }
        catch (err) {
            handle_error(err);
        }

    }

    function toggle_form(value, form_type = state['form_type'], selected_data = state['selected_data']) {
        setState((state) => ({ ...state, "show_form": value, form_type: form_type, selected_data }))
    }

    function delete_employee(id) {// used to delete employee data
        showLoader(true)
        axios.delete(`${baseURL}/employee`, {
            data: { id },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('UT')}`
            }
        })
            .then((response) => {
                response = response.data
                if (response["status"] === "success") {
                    alert("Data Deleted Successfully")
                    showLoader(false)
                    window.location.reload(false)

                }
            })
            .catch(error => {
                handle_error(error);
            });

    }
    function value_handler(value, convert_to_string = false) {
        if (value === undefined || value === null) {
            return "null"
        }

        if (convert_to_string) {
            return JSON.stringify(value)
        }
        return value
    }
    function logout() {
        deleteCookie("UT")
        window.location.reload(false);
    }

    return (<>

        <div className='mainContainer'>
            {state.show_form && <Form toggle_form={toggle_form} form_type={state.form_type} prepopulated_data={state['selected_data']} />}
            {state["show_loader"] === true ? <div className="loader">Loading, Please Wait...</div>
                : null}

            <div className="redirectionContainer">
                <div className="redirectToDetails redirectionBtns" onClick={logout}>
                    Logout
                </div>
                <div className="redirectToDetails redirectionBtns" onClick={() => toggle_form('add_data')}>
                    Add Data
                </div>
            </div>

            <div className="detailsContainer">
                <table className="detailsTable">
                    <th>Operations</th>
                    <th>Sno.</th>
                    <th>Full Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Post</th>
                    <th>Join date</th>
                    <th>Leave date</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Country</th>
                    <th>Postal Code</th>
                    <th>Experience</th>
                    <th>Salary(P.A.)</th>
                    <th>Gender</th>
                    <th>DOB</th>

                    {state.data.map((value, index) => {
                        return (<>
                            <tr key={index}>
                                <td><button className='operation_btn' onClick={() => toggle_form(true, "edit_data", value)}>Edit</button><button className='operation_btn' onClick={() => delete_employee(value['id'])}>Delete</button></td>
                                <td>{index + 1}</td>
                                <td>{value_handler(value["full_name"])}</td>
                                <td>{value_handler(value["mobile"])}</td>
                                <td>{value_handler(value['email'])}</td>
                                <td>{value_handler(value["post"])}</td>
                                <td>{value_handler(format_time(value["join_date"]))}</td>
                                <td>{value_handler(format_time(value["leave_date"]))}</td>
                                <td>{value["address"]}</td>
                                <td>{value_handler(value["city"])}</td>
                                <td>{value_handler(value["state"])}</td>
                                <td>{value_handler(value["country"])}</td>
                                <td>{value_handler(value["postal_code"])}</td>
                                <td>{value_handler(value["experience"])}</td>
                                <td>Rs.{value_handler(value["salary"])}</td>
                                <td>{value_handler(value["gender"])}</td>
                                <td>{value_handler(format_time(value["dob"]))}</td>
                            </tr>
                        </>)
                    })}
                </table>
            </div>




        </div>


    </>
    )
}

export default Details
