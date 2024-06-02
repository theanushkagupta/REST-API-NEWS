document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

async function fetchPosts() {
    try {
        showLoadingIndicator();
        const [postsResponse, usersResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        const posts = await postsResponse.json();
        const users = await usersResponse.json();

        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = ''; // Clear previous posts

        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.dataset.postId = post.id;
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>Author:</strong> ${user ? user.name : 'Unknown User'} (${user ? user.email : 'Unknown Email'})</p>
            `;
            postElement.addEventListener('click', () => fetchPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });

        hideLoadingIndicator();
    } catch (error) {
        showError('Error fetching posts or users.');
        console.error('Error fetching posts or users:', error);
    }
}

async function fetchPostDetails(postId) {
    try {
        showLoadingIndicator();
        const [postResponse, commentsResponse] = await Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        ]);

        const post = await postResponse.json();
        const comments = await commentsResponse.json();

        const postDetailsContainer = document.getElementById('post-details-container');
        postDetailsContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments</h3>
            <div id="comments-container"></div>
            <button id="back-button">Back to Posts</button>
        `;

        const commentsContainer = document.getElementById('comments-container');
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong> (${comment.email})</p>
                <p>${comment.body}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });

        document.getElementById('back-button').addEventListener('click', () => {
            postDetailsContainer.classList.add('hidden');
            document.getElementById('posts-container').classList.remove('hidden');
        });

        document.getElementById('posts-container').classList.add('hidden');
        postDetailsContainer.classList.remove('hidden');

        hideLoadingIndicator();
    } catch (error) {
        showError('Error fetching post details or comments.');
        console.error('Error fetching post details or comments:', error);
    }
}

function showLoadingIndicator() {
    document.getElementById('loading-indicator').classList.remove('hidden');
}

function hideLoadingIndicator() {
    document.getElementById('loading-indicator').classList.add('hidden');
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.innerText = message;
    document.body.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 3000);
}

