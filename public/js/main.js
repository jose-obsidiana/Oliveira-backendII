import { json } from "stream/consumers";

console.log('hola mundo')

const myForm = document.getElementById('myForm')
const readCookies = document.getElementById('readCookies');
const submit = document.getElementById('submit')

readCookies.addEventListener('click', function () {
    try {
        fetch('/api/cookies/getCookies')
            .then(response => response.json())
            .then(data => console.log(data))
    } catch (error) {
        console.log('error al leer las cookies', error)
    }
})

myForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;

    fetch('/api/cookies/setCookies', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
    })
        .then(res => res.json())
        .then(data => console.log(data))



})

