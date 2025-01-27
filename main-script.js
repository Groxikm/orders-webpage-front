let debugSet = false;
let server_url = `http://localhost:5000`; // local test url
let addNewsButtonClicked = false;

// this script loads the posts
if(!debugSet) {
    document.addEventListener('DOMContentLoaded', async function() {

    try {
            const response = await fetch(server_url+`/auth/token`, {
                method: 'GET',
                headers: {
                    'accessToken': localStorage.getItem('some_token'),
                }
            }).then(response => { // yes this comparison with 200 is not very optimal; however it worked
                if (response.status != 200) window.location.replace('login-index.html');
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Authentication failed');
            window.location.replace('login-index.html');
        }
    });
};

document.getElementById("add-news").onclick = function() {
    if (addNewsButtonClicked) {
        console.log("add news button still clicked!")
        return;
    }
    addNewsButtonClicked = true;

    // fetching previous posts to display on the main-page
    fetch(server_url+'/authorised/posts'+"?"+"last_post_id="+localStorage.getItem("last_post_id")+"&"+"page_size="+"5", {
        method: 'GET',
        headers: {
            'accessToken': localStorage.getItem('some_token'),
        }
    })

        // accessing the posts available to certain user (credentials) by getting the data
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById('feed-container');

            // parsing the posts container of the received data to display in a formatted way
            data.posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'feed-post';

                const headerElement = document.createElement('h3');
                headerElement.textContent = post.header;
                postElement.appendChild(headerElement);

                const dateElement = document.createElement('div');
                dateElement.className = 'post-date';
                dateElement.textContent = post.date;
                postElement.appendChild(dateElement);

                const bodyElement = document.createElement('p');
                bodyElement.textContent = post.text;
                postElement.appendChild(bodyElement);

                feedContainer.appendChild(postElement);

                // update last post id
                localStorage.setItem("last_post_id", post.id);
            });
        })
        .catch(error => {
            console.error('Error loading the posts:', error);

            addNewsButtonClicked = false;
        });

        addNewsButtonClicked = false;
};
