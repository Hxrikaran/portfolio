$(document).ready(function() {
    'use strict';

    const hideLoader = function() {
        $('#loader').delay(500).fadeOut('slow', function() {
            checkScroll();
        });
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        $(window).on('load', hideLoader);
    }

    // Theme toggle logic
    const themeToggleBtn = $('#themeToggle');
    const themeIcon = themeToggleBtn.find('i');
    
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        $('html').attr('data-theme', 'light');
        themeIcon.removeClass('fa-moon').addClass('fa-sun');
    }

    themeToggleBtn.on('click', function() {
        if ($('html').attr('data-theme') === 'light') {
            $('html').removeAttr('data-theme');
            localStorage.setItem('portfolio-theme', 'dark');
            themeIcon.removeClass('fa-sun').addClass('fa-moon');
        } else {
            $('html').attr('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
            themeIcon.removeClass('fa-moon').addClass('fa-sun');
        }
    });

    const navbar = $('#navbar');
    const backToTop = $('#backToTop');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }

        if ($(this).scrollTop() > 500) {
            backToTop.addClass('show');
        } else {
            backToTop.removeClass('show');
        }
    });

    $('a.nav-link, .hero-btns a').on('click', function(e) {
        if (this.hash !== '') {
            e.preventDefault();
            const hash = this.hash;
            $('.navbar-collapse').collapse('hide');
            
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 800, 'swing');
            
            $('a.nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });

    backToTop.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800, 'swing');
        return false;
    });

    const roles = ["MERN Stack Developer", "Frontend Developer", "Web Enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            $('.typing-text').text(currentRole.substring(0, charIndex - 1));
            charIndex--;
            typeSpeed = 50;
        } else {
            $('.typing-text').text(currentRole.substring(0, charIndex + 1));
            charIndex++;
            typeSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    if ($('.typing-text').length) {
        setTimeout(typeEffect, 1000);
    }

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
                
                if (entry.target.querySelector('.counter')) {
                    startCounters(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    function checkScroll() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add('active');
            }
        });
    }

    function startCounters(container) {
        const counters = container.querySelectorAll('.counter');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const inc = target / speed;
            
            let current = 0;
            const updateCount = () => {
                current += inc;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
            counter.classList.remove('counter');
        });
    }

    document.addEventListener("mousemove", parallax);
    function parallax(e) {
        const icons = document.querySelectorAll(".floating-icon");
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        icons.forEach(icon => {
            const speed = icon.classList.contains('icon-react') ? 2 : 
                          icon.classList.contains('icon-node') ? -3 : 4;
            icon.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    }

    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;
            
            fetch("https://formsubmit.co/ajax/harikarank31@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    _subject: document.getElementById('subject').value || "New submission from Portfolio!",
                    message: document.getElementById('message').value,
                    _captcha: "false"
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check ms-2"></i>';
                submitBtn.classList.remove('btn-primary-glass');
                submitBtn.classList.add('btn-success');
                
                form.reset();
                form.classList.remove('was-validated');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.add('btn-primary-glass');
                    submitBtn.classList.remove('btn-success');
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                submitBtn.innerHTML = '<span>Error! Try Again</span> <i class="fas fa-times ms-2"></i>';
                submitBtn.classList.remove('btn-primary-glass');
                submitBtn.classList.add('btn-danger');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.add('btn-primary-glass');
                    submitBtn.classList.remove('btn-danger');
                    submitBtn.disabled = false;
                }, 3000);
            });
            
        }, false);
    }

    $('#currentYear').text(new Date().getFullYear());
    
    // 3D Glass Card Tilt Effect
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Disable on mobile to save performance
            if(window.innerWidth < 992) return; 
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            
            setTimeout(() => {
                if(!card.matches(':hover')) card.style.transform = '';
            }, 500);
        });
    });
});
