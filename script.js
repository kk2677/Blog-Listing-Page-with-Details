// This script will handle fetching data and rendering blog posts.

document.addEventListener('DOMContentLoaded', () => {
    const blogListing = document.getElementById('blog-listing');
    const blogDetails = document.getElementById('blog-details');

    // Function to fetch blog data
    async function fetchBlogs() {
        try {
            const response = await fetch('data.json');
            const blogs = await response.json();
            return blogs;
        } catch (error) {
            console.error('Error fetching blog data:', error);
            return [];
        }
    }

    // Function to render blog listing page
    async function renderBlogListing() {
        if (!blogListing) return;

        const blogs = await fetchBlogs();
        const searchInput = document.getElementById('search-input');
        const blogCardsContainer = document.createElement('div');
        blogCardsContainer.id = 'blog-cards-container';
        blogListing.appendChild(blogCardsContainer);

        function filterAndRenderBlogs(query = '') {
            const filteredBlogs = blogs.filter(blog => 
                blog.title.toLowerCase().includes(query.toLowerCase()) ||
                blog.shortDescription.toLowerCase().includes(query.toLowerCase())
            );
            blogCardsContainer.innerHTML = ''; // Clear previous content

            filteredBlogs.forEach(blog => {
                const blogCard = document.createElement('div');
                blogCard.classList.add('blog-post-card');
                blogCard.innerHTML = `
                    <img src="${blog.thumbnail}" alt="${blog.title}">
                    <h2>${blog.title}</h2>
                    <p>${blog.shortDescription}</p>
                    <a href="#" class="read-more" data-id="${blog.id}">Read More</a>
                `;
                blogCardsContainer.appendChild(blogCard);
            });

            document.querySelectorAll('.read-more').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const blogId = parseInt(event.target.dataset.id);
                    renderBlogDetails(blogId);
                });
            });
        }

        searchInput.addEventListener('input', (event) => {
            filterAndRenderBlogs(event.target.value);
        });

        filterAndRenderBlogs(); // Initial render
    }

    // Function to render blog details page
    async function renderBlogDetails(blogId) {
        if (!blogDetails) return;

        const blogs = await fetchBlogs();
        const blog = blogs.find(b => b.id === blogId);

        if (blog) {
            blogDetails.innerHTML = `
                <article>
                    <img src="${blog.thumbnail}" alt="${blog.title}">
                    <h2>${blog.title}</h2>
                    <div>${blog.fullContent}</div>
                    <a href="#" id="back-to-blogs" class="read-more">Back to Blogs</a>
                </article>
            `;

            blogListing.classList.add('fade-out');
            blogListing.addEventListener('animationend', () => {
                blogListing.style.display = 'none';
                blogListing.classList.remove('fade-out');
                blogDetails.classList.add('fade-in');
                blogDetails.style.display = 'block';
            }, { once: true });

            document.getElementById('back-to-blogs').addEventListener('click', (event) => {
                event.preventDefault();
                blogDetails.classList.add('fade-out');
                blogDetails.addEventListener('animationend', () => {
                    blogDetails.style.display = 'none';
                    blogDetails.classList.remove('fade-out');
                    blogListing.classList.add('fade-in');
                    blogListing.style.display = 'block';
                }, { once: true });
            });
        } else {
            blogDetails.innerHTML = '<p>Blog post not found.</p>';
            blogListing.classList.add('fade-out');
            blogListing.addEventListener('animationend', () => {
                blogListing.style.display = 'none';
                blogListing.classList.remove('fade-out');
                blogDetails.classList.add('fade-in');
                blogDetails.style.display = 'block';
            }, { once: true });
        }
    }

    // Initial setup
    blogDetails.style.display = 'none'; // Hide details on initial load
    renderBlogListing();
});
