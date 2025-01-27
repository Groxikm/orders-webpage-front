

const api_url = "http://localhost:5000";

document.getElementById('auth-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let isUsernameValid = true; // the variables re set true for testing
    let isPasswordValid = true; // can easily be changed corresponding to the server

    // handling input validity
    const dirCharValidDict = 'character-validation-dict-dict';
    const usernameCharValidFile = 'correct-symbols-username.csv';
    const passwordCharValidFile = 'correct-symbols-password.csv';

    const allowedSymbolsUsername = await fetchCSV(`${dirCharValidDict}/${usernameCharValidFile}`);
    const allowedSymbolsPassword = await fetchCSV(`${dirCharValidDict}/${passwordCharValidFile}`);
    isUsernameValid = validateInput(username, allowedSymbolsUsername) && (username.length >= 4) && (username.length <= 32);
    isPasswordValid = (password.length >= 8) && (password.length <= 64) && validateInput(password, allowedSymbolsPassword);

    if (isUsernameValid && isPasswordValid) {

        try { // accessing the posts page
            const response = await fetch(api_url + '/auth/login', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "username": username,
                    "password": password
                }
            });

            if (response.ok) {
                const data = await response.json();
                // storing the token
                localStorage.setItem("some_acc_token", data.accessToken);
                // console.log("accToken: "+localStorage.getItem("order_of_stake_acc_token")); // testing how the token service

                // redirect to main page
                window.location.replace("main-index.html");
            } else {
                alert('Failed to login. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    } else {
        alert('Invalid characters found in username or password.');
    }
});

// functionality for processing input during login
async function fetchCSV(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return text.split(',');
}

function validateInput(input, allowedSymbols) {
    return [...input].every(char => allowedSymbols.includes(char));
}
