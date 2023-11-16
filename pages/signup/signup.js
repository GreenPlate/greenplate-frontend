import { API_URL } from "../../settings.js"
import { handleHttpErrors, makeOptions } from "../../utility.js";

const URL = API_URL + "/users"


export function initSignup(){
    document.querySelector("#btn-signup").addEventListener("click", signup);
}

async function signup(){
    event.preventDefault();
    
    const firstName = document.querySelector("#input-firstname").value;
    const lastName = document.querySelector("#input-lastname").value;
    const email = document.querySelector("#input-email").value;
    const username = document.querySelector("#input-username").value;
    const password = document.querySelector("#input-password").value;

    const signupRequest = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
    }

    try {
        const res = await fetch(URL, makeOptions("POST", signupRequest)).then(r => handleHttpErrors(r))
        console.log(res)
    } catch(err){
        console.log(err.message)
    }

}