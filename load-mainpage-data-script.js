const api_url = "http://localhost:5000"; // local test url

// this is a separated script to display the common components of the main webpage
document.addEventListener('DOMContentLoaded', () => {

    fetch(api_url+'/authorised/about', {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('some_acc_token'),
        }
    })
        .then(response => response.json())
        .then(data => {
            const aboutElement = document.getElementById('about-container');

            const nameElement = document.createElement('h3');
            nameElement.textContent = data.text;
            aboutElement.appendChild(nameElement);

            const sloganElement = document.createElement('h2');
            sloganElement.textContent = data.slogan;
            aboutElement.appendChild(sloganElement);

        })
        .catch(error => {
            console.error('Error loading the About Me section:', error);
        });

});
