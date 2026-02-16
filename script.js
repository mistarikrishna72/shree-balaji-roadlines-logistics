// Initialize Icons
lucide.createIcons();

// Add SVG Gradient for half stars to the document
const svgNS = "http://www.w3.org/2000/svg";
const svgTemplate = `
<svg width="0" height="0" style="position: absolute;">
  <defs>
    <linearGradient id="star-half-gradient">
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="50%" stop-color="#d1d5db" />
    </linearGradient>
  </defs>
</svg>`;
document.body.insertAdjacentHTML('beforeend', svgTemplate);

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.getElementById('star-half-gradient').querySelectorAll('stop')[1].setAttribute('stop-color', '#4b5563');
    } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        document.getElementById('star-half-gradient').querySelectorAll('stop')[1].setAttribute('stop-color', '#d1d5db');
    }
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme === 'dark' || (!savedTheme && systemDark));

if (themeToggle) {
    themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('dark')));
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

function toggleMenu() {
    if (mobileMenu && menuToggle) {
        mobileMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', mobileMenu.classList.contains('active') ? 'x' : 'menu');
            lucide.createIcons();
        }
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

// Scroll Reveal with Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// --- Reviews & Star Rating System ---

const initialReviews = [
    {
        name: "Rajesh Mehta",
        company: "Tata Motors Vendor",
        rating: 5,
        text: "Reliable partner for over 5 years. Their commitment is unparalleled in the logistics sector."
    },
    {
        name: "Suresh Iyer",
        company: "Adani Logistics Partner",
        rating: 4.5,
        text: "Professional team that understands complexity. Their 24/7 support is a real game changer."
    },
    {
        name: "Anjali Sharma",
        company: "Reliance Industries",
        rating: 5,
        text: "Zero damage and very professional handling of heavy equipment. Highly recommended!"
    },
    {
        name: "Vikram Singh",
        company: "Industrial Logistics Co.",
        rating: 4.0,
        text: "Great experience with Part Truck Load. Very affordable rates for cross-state transport."
    },
    {
        name: "Mehul Patel",
        company: "SME Owner",
        rating: 3.5,
        text: "Good service overall. The local transport team is very professional, although tracking updates could be faster."
    }
];

const starInput = document.getElementById('star-input');
const selectedRatingInput = document.getElementById('selected-rating');
const ratingDisplayVal = document.getElementById('rating-display-val');
const reviewsContainer = document.getElementById('reviews-container');
const reviewForm = document.getElementById('review-form');
const viewMoreBtn = document.getElementById('view-more-reviews');

let showAllReviews = false;

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'testimonial-card scroll-reveal';
    
    let starsHtml = '';
    const rating = parseFloat(review.rating);
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            // Full star
            starsHtml += `<span class="star-fill full"><i data-lucide="star" fill="currentColor"></i></span>`;
        } else if (rating >= i - 0.5) {
            // Half star
            starsHtml += `<span class="star-fill half"><i data-lucide="star" style="fill: url(#star-half-gradient)"></i></span>`;
        } else {
            // Empty star
            starsHtml += `<span class="star-fill"><i data-lucide="star"></i></span>`;
        }
    }

    card.innerHTML = `
        <div class="stars">${starsHtml}</div>
        <p>"${review.text}"</p>
        <div class="test-user">
            <div class="user-avatar">${review.name.charAt(0)}</div>
            <div class="user-info">
                <strong>${review.name}</strong>
                <span>${review.company}</span>
            </div>
        </div>
    `;
    return card;
}

function renderReviews() {
    if (!reviewsContainer) return;
    const customReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
    const allReviews = [...initialReviews, ...customReviews];
    
    reviewsContainer.innerHTML = '';
    const reviewsToShow = showAllReviews ? allReviews : allReviews.slice(0, 3);
    
    reviewsToShow.forEach(review => {
        const card = createReviewCard(review);
        reviewsContainer.appendChild(card);
        observer.observe(card);
    });
    
    if (allReviews.length <= 3) {
        viewMoreBtn.style.display = 'none';
    } else {
        viewMoreBtn.style.display = 'inline-flex';
        viewMoreBtn.innerHTML = showAllReviews ? `Show Less <i data-lucide="chevron-up"></i>` : `View More Reviews <i data-lucide="chevron-down"></i>`;
    }
    
    lucide.createIcons();
}

if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
        showAllReviews = !showAllReviews;
        renderReviews();
    });
}

// Custom Granular Star Rating Interaction
if (starInput) {
    const starItems = starInput.querySelectorAll('.star-item');
    
    const setRating = (val) => {
        selectedRatingInput.value = val;
        ratingDisplayVal.textContent = val.toFixed(1);
        
        starItems.forEach((item, index) => {
            const itemIdx = index + 1;
            item.classList.remove('active', 'half');
            const icon = item.querySelector('svg');
            
            if (val >= itemIdx) {
                item.classList.add('active');
                if (icon) {
                    icon.style.fill = 'currentColor';
                    icon.style.color = 'var(--star-active)';
                }
            } else if (val >= itemIdx - 0.5) {
                item.classList.add('half');
                if (icon) {
                    icon.style.fill = 'url(#star-half-gradient)';
                    icon.style.color = 'var(--star-active)';
                }
            } else {
                if (icon) {
                    icon.style.fill = 'none';
                    icon.style.color = 'var(--star-inactive)';
                }
            }
        });
    };

    starItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const index = parseInt(item.getAttribute('data-index'));
            const val = (x < rect.width / 2) ? index - 0.5 : index;
            setRating(val);
        });

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const index = parseInt(item.getAttribute('data-index'));
            const previewVal = (x < rect.width / 2) ? index - 0.5 : index;
            
            // Temporary visual feedback
            starItems.forEach((s, i) => {
                const sIdx = i + 1;
                const svg = s.querySelector('svg');
                if (sIdx <= previewVal) {
                    svg.style.color = 'var(--star-active)';
                    svg.style.fill = 'currentColor';
                } else if (sIdx - 0.5 === previewVal) {
                    svg.style.color = 'var(--star-active)';
                    svg.style.fill = 'url(#star-half-gradient)';
                } else {
                    svg.style.color = 'var(--star-inactive)';
                    svg.style.fill = 'none';
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            setRating(parseFloat(selectedRatingInput.value));
        });
    });

    setRating(5); // Default
}

// Review Form Submission
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newReview = {
            name: document.getElementById('review-name').value,
            company: document.getElementById('review-company').value,
            rating: parseFloat(selectedRatingInput.value),
            text: document.getElementById('review-text').value
        };

        const customReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
        customReviews.unshift(newReview); // Add to beginning
        localStorage.setItem('user_reviews', JSON.stringify(customReviews));

        reviewForm.reset();
        ratingDisplayVal.textContent = "5.0";
        selectedRatingInput.value = "5";
        
        renderReviews();
        
        const btn = reviewForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Submitted!';
        setTimeout(() => { btn.innerHTML = originalText; }, 3000);
    });
}

// Initial Render
renderReviews();

// --- Quote Form Handling ---
const quoteForm = document.getElementById('quote-form');
const successMsg = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (quoteForm && submitBtn) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';

        setTimeout(() => {
            quoteForm.reset();
            submitBtn.style.display = 'none';
            if (successMsg) successMsg.style.display = 'block';

            setTimeout(() => {
                submitBtn.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (successMsg) successMsg.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// Observe reveal elements
document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

// Smooth scroll logic
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});