/* ==========================================================
   MS SERVICE — COMPLETE PROFESSIONAL JAVASCRIPT
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // DEVICE DETECTION
    // ===============================
    const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // ===============================
    // LUCIDE ICONS INIT
    // ===============================
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // ===============================
    // PRELOADER
    // ===============================
    const preloader = document.getElementById("preloader");
    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add("fade-out");
            setTimeout(() => {
                preloader.style.display = "none";
            }, 700);
        }
    };

    if (document.readyState === "complete") {
        setTimeout(hidePreloader, 800);
    } else {
        window.addEventListener("load", () => {
            setTimeout(hidePreloader, 800);
        });
    }

    // ===============================
    // CUSTOM CURSOR (desktop only)
    // ===============================
    if (!isTouchDevice) {
        const cursor = document.getElementById("custom-cursor");
        const cursorDot = document.getElementById("custom-cursor-dot");

        if (cursor && cursorDot) {
            let cursorX = 0, cursorY = 0;
            let dotX = 0, dotY = 0;

            document.addEventListener("mousemove", (e) => {
                cursorX = e.clientX;
                cursorY = e.clientY;
                // Dot follows immediately
                cursorDot.style.left = cursorX + "px";
                cursorDot.style.top = cursorY + "px";
            });

            // Smooth ring follow
            const animateCursor = () => {
                dotX += (cursorX - dotX) * 0.15;
                dotY += (cursorY - dotY) * 0.15;
                cursor.style.left = dotX + "px";
                cursor.style.top = dotY + "px";
                requestAnimationFrame(animateCursor);
            };
            animateCursor();

            // Scale cursor on interactive elements
            const hoverElements = document.querySelectorAll(
                "a, button, .btn, .service-card, .faq-question, input, textarea, select"
            );
            hoverElements.forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
                    cursor.style.borderColor = "rgba(0, 229, 255, 0.6)";
                });
                el.addEventListener("mouseleave", () => {
                    cursor.style.transform = "translate(-50%, -50%) scale(1)";
                    cursor.style.borderColor = "rgba(0, 229, 255, 0.4)";
                });
            });
        }
    }

    // ===============================
    // NAVBAR SCROLL EFFECT
    // ===============================
    const navbar = document.querySelector(".navbar");
    const handleNavbarScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Initial check

    // ===============================
    // ACTIVE NAV LINK ON SCROLL
    // ===============================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const updateActiveNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };
    window.addEventListener("scroll", updateActiveNav, { passive: true });

    // ===============================
    // MOBILE MENU
    // ===============================
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("open");
            navMenu.classList.toggle("open");
        });

        // Close menu on link click
        navMenu.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                mobileToggle.classList.remove("open");
                navMenu.classList.remove("open");
            });
        });
    }

    // ===============================
    // PARTICLES SYSTEM (desktop only)
    // ===============================
    const canvas = document.getElementById("particles");
    if (canvas && !isTouchDevice) {
        const ctx = canvas.getContext("2d");
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.15 + 0.05;
            }
            draw() {
                ctx.beginPath();
                ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                this.draw();
            }
        }

        // Create particles
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.03 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => p.update());
            drawConnections();
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // ===============================
    // VIRTUAL CARD 3D TILT
    // ===============================
    const card = document.getElementById("virtual-card");
    if (card && !isTouchDevice) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -18;
            const rotateY = ((x / rect.width) - 0.5) * 18;
            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    }

    // ===============================
    // TYPING EFFECT
    // ===============================
    const typingText = document.getElementById("typing-text");
    if (typingText) {
        const texts = [
            "Netflix Premium",
            "ChatGPT Plus",
            "Amazon Shopping",
            "Spotify Premium",
            "Canva Pro"
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const typeEffect = () => {
            const currentText = texts[textIndex];

            if (!isDeleting) {
                typingText.textContent = currentText.slice(0, charIndex++);
                typingSpeed = 100;

                if (charIndex > currentText.length) {
                    isDeleting = true;
                    typingSpeed = 1800; // Pause before deleting
                }
            } else {
                typingText.textContent = currentText.slice(0, charIndex--);
                typingSpeed = 50;

                if (charIndex < 0) {
                    isDeleting = false;
                    charIndex = 0;
                    textIndex = (textIndex + 1) % texts.length;
                    typingSpeed = 400; // Pause before new word
                }
            }

            setTimeout(typeEffect, typingSpeed);
        };
        typeEffect();
    }

    // ===============================
    // SCROLL REVEAL ANIMATIONS
    // ===============================
    const revealElements = document.querySelectorAll(".scroll-reveal");
    if (revealElements.length > 0) {
        const observerOptions = {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger reveal for sibling elements
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add("revealed");
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach((el, i) => {
            // Auto-stagger cards in the same grid
            const parent = el.parentElement;
            if (parent) {
                const siblings = parent.querySelectorAll(".scroll-reveal");
                const index = Array.from(siblings).indexOf(el);
                el.dataset.delay = index * 100;
            }
            observer.observe(el);
        });
    }

    // ===============================
    // STATS COUNTER ANIMATION
    // ===============================
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    const suffix = el.textContent.replace(/[0-9]/g, "").trim();
                    const duration = 2000;
                    const startTime = performance.now();

                    const animateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);

                        el.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            el.textContent = target + suffix;
                        }
                    };
                    requestAnimationFrame(animateCount);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach((el) => counterObserver.observe(el));
    }

    // ===============================
    // FAQ ACCORDION
    // ===============================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                const isOpen = item.classList.contains("open");

                // Close all others
                faqItems.forEach((other) => other.classList.remove("open"));

                // Toggle current
                if (!isOpen) {
                    item.classList.add("open");
                }
            });
        }
    });

    // ===============================
    // TESTIMONIALS SLIDER
    // ===============================
    const sliderContainer = document.getElementById("testimonials-slider");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const dotsContainer = document.getElementById("slider-dots");

    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll(".testimonial-slide");
        let currentSlide = 0;
        let autoSlideInterval;

        // Generate dots
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement("button");
                dot.classList.add("slider-dot");
                if (i === 0) dot.classList.add("active");
                dot.setAttribute("aria-label", `Avis ${i + 1}`);
                dot.addEventListener("click", () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll(".slider-dot");
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentSlide);
            });
        };

        const goToSlide = (index) => {
            slides.forEach((s) => s.classList.remove("active"));
            currentSlide = ((index % slides.length) + slides.length) % slides.length;
            slides[currentSlide].classList.add("active");
            updateDots();
            resetAutoSlide();
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        if (nextBtn) nextBtn.addEventListener("click", nextSlide);
        if (prevBtn) prevBtn.addEventListener("click", prevSlide);

        // Auto-slide
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 6000);
        };
        resetAutoSlide();
    }

    // ===============================
    // SHOPPING CART (PANIER) SYSTEM
    // ===============================
    let cart = JSON.parse(localStorage.getItem("ms_cart") || "[]");

    // UI Elements
    const cartToggle = document.getElementById("cart-toggle");
    const cartClose = document.getElementById("cart-close");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartDrawerBackdrop = document.getElementById("cart-drawer-backdrop");
    const cartDrawerItems = document.getElementById("cart-drawer-items");
    const cartBadge = document.getElementById("cart-badge");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartFees = document.getElementById("cart-fees");
    const cartTotal = document.getElementById("cart-total");
    const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
    const cartClearBtn = document.getElementById("cart-clear-btn");

    // Receipt Modal Elements
    const receiptModal = document.getElementById("receipt-modal");
    const receiptModalBackdrop = document.getElementById("receipt-modal-backdrop");
    const receiptCloseBtn = document.getElementById("receipt-close-btn");
    const receiptClientName = document.getElementById("receipt-client-name");
    const receiptInvoiceId = document.getElementById("receipt-invoice-id");
    const receiptDate = document.getElementById("receipt-date");
    const receiptItemsList = document.getElementById("receipt-items-list");
    const receiptSubtotal = document.getElementById("receipt-subtotal");
    const receiptTotalVal = document.getElementById("receipt-total-val");
    const receiptWhatsappBtn = document.getElementById("receipt-whatsapp-btn");

    // Global variables for active receipt details
    let activeInvoiceData = null;

    // Toggle Drawer functions
    const openCart = () => {
        if (cartDrawer) cartDrawer.classList.add("open");
    };
    const closeCart = () => {
        if (cartDrawer) cartDrawer.classList.remove("open");
    };

    if (cartToggle) cartToggle.addEventListener("click", openCart);
    if (cartClose) cartClose.addEventListener("click", closeCart);
    if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener("click", closeCart);

    // Save cart
    const saveCart = () => {
        localStorage.setItem("ms_cart", JSON.stringify(cart));
        updateCartUI();
    };

    // Add item to cart with quantity aggregation
    const addToCart = (name, price) => {
        const priceNum = parseInt(price.replace(/[^0-9]/g, "")) || 0;
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            existingItem.priceNum += priceNum;
            // Update displayed price string to reflect new total for this item
            existingItem.price = `${existingItem.priceNum.toLocaleString('fr-FR')} FCFA`;
        } else {
            cart.push({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                name: name,
                price: `${priceNum.toLocaleString('fr-FR')} FCFA`,
                priceNum: priceNum,
                quantity: 1
            });
        }
        saveCart();
        openCart();
    };
    // Remove item from cart
    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        saveCart();
    };

    // Update Cart UI
    const updateCartUI = () => {
        if (!cartBadge || !cartDrawerItems) return;

        // Badge count (total items)
        const totalQuantity = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
        cartBadge.textContent = totalQuantity;

        // Render items
        cartDrawerItems.innerHTML = "";
        if (cart.length === 0) {
            cartDrawerItems.innerHTML = `
                <div class="text-muted-center" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:12px;">
                    <i data-lucide="shopping-bag" style="width:48px; height:48px; opacity:0.3;"></i>
                    <p>Votre panier est vide.</p>
                </div>
            `;
            if (typeof lucide !== "undefined") lucide.createIcons();

            if (cartSubtotal) cartSubtotal.textContent = "0 FCFA";
            if (cartFees) cartFees.textContent = "0 FCFA";
            if (cartTotal) cartTotal.textContent = "0 FCFA";
            if (cartCheckoutBtn) cartCheckoutBtn.disabled = true;
            return;
        }

        if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;

        let totalSum = 0;
        cart.forEach(item => {
            totalSum += item.priceNum;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-qty">x${item.quantity}</span>
                <span class="cart-item-price">${item.price}</span>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" aria-label="Retirer l'article">
                <i data-lucide="trash-2" style="width:16px; height:16px;"></i>
            </button>
        `;
            cartDrawerItems.appendChild(div);
        });

        // Add event listeners to remove buttons
        cartDrawerItems.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                removeFromCart(btn.dataset.id);
            });
        });

        if (typeof lucide !== "undefined") lucide.createIcons();

        // Calculate totals
        if (cartSubtotal) cartSubtotal.textContent = `${totalSum.toLocaleString('fr-FR')} FCFA`;
        if (cartFees) cartFees.textContent = "Inclus";
        if (cartTotal) cartTotal.textContent = `${totalSum.toLocaleString('fr-FR')} FCFA`;
    };

    // Checkout handler
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return;

            if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) {
                window.location.href = 'login.html';
                return;
            }

            const currentUser = Auth.getCurrentUser();
            if (!currentUser) return;

            // Generate Invoice ID
            const invoiceId = "MS-" + Math.floor(100000 + Math.random() * 900000);
            const currentDate = new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            let totalSum = 0;
            const itemizedTextList = [];

            // Add all items in the cart as orders
            cart.forEach(item => {
                totalSum += item.priceNum;
                itemizedTextList.push(`- ${item.name} (${item.price})`);

                // Save to local database
                if (typeof Auth !== 'undefined') {
                    Auth.addOrder({
                        user_id: currentUser.id,
                        service: item.name,
                        montant: item.price,
                        statut: "En attente"
                    });
                }
            });

            // Set active invoice data for WhatsApp redirect
            activeInvoiceData = {
                id: invoiceId,
                clientName: currentUser.nom,
                date: currentDate,
                items: itemizedTextList,
                total: `${totalSum.toLocaleString('fr-FR')} FCFA`
            };

            // Populate Receipt Modal UI
            if (receiptInvoiceId) receiptInvoiceId.textContent = `N° ${invoiceId}`;
            if (receiptClientName) receiptClientName.textContent = currentUser.nom;
            if (receiptDate) receiptDate.textContent = currentDate;
            if (receiptSubtotal) receiptSubtotal.textContent = `${totalSum.toLocaleString('fr-FR')} FCFA`;
            if (receiptTotalVal) receiptTotalVal.textContent = `${totalSum.toLocaleString('fr-FR')} FCFA`;

            if (receiptItemsList) {
                receiptItemsList.innerHTML = "";
                cart.forEach(item => {
                    const row = document.createElement("div");
                    row.className = "receipt-item-row";
                    row.innerHTML = `
                        <span>${item.name}${item.quantity > 1 ? ' x' + item.quantity : ''}</span>
                        <strong>${item.price}</strong>
                    `;
                    receiptItemsList.appendChild(row);
                });
            }

            // Show modal and close drawer
            // Show modal and close drawer
            closeCart();
            if (receiptModal) receiptModal.style.display = "flex";
        });
    }

    // Clear cart handler
    if (cartClearBtn) {
        cartClearBtn.addEventListener("click", () => {
            if (cart.length === 0) return;
            cart = [];
            saveCart();
        });
    }

    // Close Receipt Modal
    const closeReceipt = () => {
        if (receiptModal) receiptModal.style.display = "none";
        // Clear cart after checkout validation
        cart = [];
        saveCart();
    };

    if (receiptCloseBtn) receiptCloseBtn.addEventListener("click", closeReceipt);
    if (receiptModalBackdrop) receiptModalBackdrop.addEventListener("click", closeReceipt);

    // Continue Shopping button - keep cart
    const receiptContinueBtn = document.getElementById('receipt-continue-btn');
    if (receiptContinueBtn) {
        receiptContinueBtn.addEventListener('click', () => {
            if (receiptModal) receiptModal.style.display = 'none';
            // Do not clear cart
        });
    }

    // WhatsApp Direct Redirect from Receipt
    if (receiptWhatsappBtn) {
        receiptWhatsappBtn.addEventListener("click", () => {
            if (!activeInvoiceData) return;

            const message = encodeURIComponent(
                `📋 REÇU DE COMMANDE MS SERVICE\n` +
                `------------------------------------\n` +
                `Facture N° : ${activeInvoiceData.id}\n` +
                `Client : ${activeInvoiceData.clientName}\n` +
                `Date : ${activeInvoiceData.date}\n\n` +
                `Services commandés :\n` +
                activeInvoiceData.items.join("\n") + `\n\n` +
                `------------------------------------\n` +
                `Total à régler : ${activeInvoiceData.total}\n` +
                `Statut : En attente de paiement\n\n` +
                `Merci de me confirmer le dépôt Mobile Money pour l'activation.`
            );

            window.open(
                `https://wa.me/241074083695?text=${message}`,
                "_blank"
            );

            closeReceipt();
        });
    }

    // Initialize UI on load
    updateCartUI();

    // ===============================
    // WHATSAPP ORDER BUTTONS (Cart-linked)
    // ===============================
    const orderButtons = document.querySelectorAll(".btn-order");
    orderButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const serviceName = btn.dataset.name || "Service";
            const servicePrice = btn.dataset.price || "";
            addToCart(serviceName, servicePrice);
        });
    });

    // ===============================
    // SMOOTH SCROLL FOR NAV LINKS
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                e.preventDefault();
                const offset = 90;
                const targetPosition =
                    target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ===============================
    // LIVE TRANSACTION FEED ANIMATION
    // ===============================
    const feed = document.getElementById("activation-feed");
    if (feed) {
        const feedData = [
            { time: "À l'instant", text: 'Paiement <strong>Amazon (24.99 USD)</strong> effectué par Carte UBA', status: "Payé" },
            { time: "Il y a 3 min", text: 'Abonnement <strong>Netflix UHD</strong> activé par Carte Verso', status: "Payé" },
            { time: "Il y a 8 min", text: 'Recharge <strong>App Store (15 USD)</strong> via Airtel Money', status: "Payé" },
            { time: "Il y a 12 min", text: '<strong>ChatGPT Plus</strong> abonné via Carte UBA', status: "Payé" },
            { time: "Il y a 20 min", text: 'Paiement <strong>Hostinger (35 USD)</strong> par Carte Verso', status: "Payé" },
            { time: "Il y a 25 min", text: 'Abonnement <strong>Spotify Premium</strong> activé', status: "Payé" },
        ];

        let feedIndex = 2; // Start after initial two
        setInterval(() => {
            const item = feedData[feedIndex % feedData.length];
            const newItem = document.createElement("div");
            newItem.classList.add("feed-item");
            newItem.style.opacity = "0";
            newItem.style.transform = "translateY(-10px)";
            newItem.innerHTML = `
                <span class="feed-time">${item.time}</span>
                <span class="feed-text">${item.text}</span>
                <span class="feed-status status-success">${item.status}</span>
            `;

            // Remove last item if more than 3
            const items = feed.querySelectorAll(".feed-item");
            if (items.length >= 3) {
                const last = items[items.length - 1];
                last.style.opacity = "0";
                last.style.transform = "translateY(10px)";
                setTimeout(() => last.remove(), 300);
            }

            feed.prepend(newItem);
            // Trigger animation
            requestAnimationFrame(() => {
                newItem.style.transition = "all 0.4s ease";
                newItem.style.opacity = "1";
                newItem.style.transform = "translateY(0)";
            });

            feedIndex++;
        }, 5000);
    }

    // ===============================
    // CONTACT FORM HANDLER
    // ===============================
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name")?.value.trim() || "";
            const phone = document.getElementById("phone")?.value.trim() || "";
            const email = document.getElementById("email-field")?.value.trim() || "";
            const subject = document.getElementById("subject")?.value || "";
            const message = document.getElementById("message")?.value.trim() || "";

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>⏳ Envoi en cours...</span>';
            }

            // Label du service
            const serviceLabels = {
                "abonnement": "Abonnement (Netflix, Spotify, ChatGPT...)",
                "achat-site": "Achat sur site étranger (Amazon, etc.)",
                "app-store": "Crédits App Store / Google Play",
                "carte-virtuelle": "Carte bancaire virtuelle",
                "hebergement": "Hébergement Web & Domaine"
            };
            const serviceLabel = serviceLabels[subject] || "Demande de Paiement";

            // Enregistrer la commande si connecté
            if (typeof Auth !== 'undefined') {
                const currentUser = Auth.getCurrentUser();
                if (currentUser) {
                    Auth.addOrder({
                        user_id: currentUser.id,
                        service: serviceLabel,
                        montant: "À définir",
                        statut: "En attente"
                    });
                }
            }

            // ── Envoi email via EmailJS (prioritaire) ──────────────────
            const EMAILJS_PUBLIC_KEY = "ca5xOYAoZrI6YvDKr";
            const EMAILJS_SERVICE_ID = "service_5glknwy";
            const EMAILJS_TEMPLATE_ID = "template_oxqnot8";

            let sent = false;

            if (EMAILJS_PUBLIC_KEY !== "ca5xOYAoZrI6YvDKr" && typeof emailjs !== "undefined") {
                try {
                    emailjs.init(EMAILJS_PUBLIC_KEY);
                    const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        from_name: name,
                        from_phone: phone,
                        from_email: email,
                        service_type: serviceLabel,
                        message: message,
                        to_email: "morelstone15@gmail.com"
                    });
                    if (result.status === 200) sent = true;
                } catch (ejsErr) {
                    console.warn("EmailJS failed, trying backend:", ejsErr);
                }
            }

            // ── Fallback : backend Flask SMTP ──────────────────────────
            if (!sent) {
                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nom: name, phone, email, subject, message })
                    });
                    const data = await response.json();
                    if (data.success) sent = true;
                } catch (fetchErr) {
                    console.error("Backend contact error:", fetchErr);
                }
            }

            // ── Résultat visuel ────────────────────────────────────────
            if (sent) {
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>✓ Demande envoyée !</span>';
                    submitBtn.style.background = "linear-gradient(135deg, #00ffb3, #00e5ff)";
                }
            } else {
                // Fallback ultime : ouvrir WhatsApp avec les infos pré-remplies
                const waText = encodeURIComponent(
                    `Bonjour MS SERVICE !\n\n` +
                    `Nom : ${name}\nTél : ${phone}\nEmail : ${email}\n` +
                    `Service : ${serviceLabel}\n\nDemande : ${message}`
                );
                window.open(`https://wa.me/241074083695?text=${waText}`, "_blank");
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>📱 Redirigé vers WhatsApp</span>';
                    submitBtn.style.background = "linear-gradient(135deg, #25d366, #128c7e)";
                }
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.style.background = "";
                    submitBtn.disabled = false;
                    lucide && lucide.createIcons();
                }
                if (sent) contactForm.reset();
            }, 3500);
        });
    }

});


// ============================
// PAYMENT REQUEST FORM
// ============================

const paymentForm = document.getElementById('paymentForm');

if(paymentForm){

paymentForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = {
        nom: paymentForm.nom.value,
        whatsapp: paymentForm.whatsapp.value,
        email: paymentForm.email.value,
        service: paymentForm.service.value,
        details: paymentForm.details.value
    };

    try {

        const response = await fetch('/api/payment-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if(data.success){
            alert('Demande envoyée avec succès ✅');
            paymentForm.reset();
        } else {
            alert('Erreur lors de l’envoi ❌');
        }

    } catch(error){
        console.error(error);
        alert('Erreur serveur');
    }

});

}

// ============================
// PREMIUM ENHANCEMENTS v2.0
// ============================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.scroll-reveal, .service-card, .workflow-step-card, .benefit-card, .stat-box');
    
    // Add base class to elements that don't have it yet
    revealElements.forEach(el => {
        if (!el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
        }
    });

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index if multiple elements appear at once
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});

// Global Toast Notification System
window.showToast = function(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    let color = '';
    
    if (type === 'success') {
        icon = '<i data-lucide="check-circle"></i>';
        color = 'var(--success)';
        toast.style.borderLeftColor = color;
    } else if (type === 'error') {
        icon = '<i data-lucide="alert-circle"></i>';
        color = 'var(--danger)';
        toast.style.borderLeftColor = color;
        toast.style.borderColor = 'rgba(255, 71, 87, 0.25)';
    } else {
        icon = '<i data-lucide="info"></i>';
        color = 'var(--primary)';
        toast.style.borderLeftColor = color;
        toast.style.borderColor = 'rgba(0, 229, 255, 0.25)';
    }

    toast.innerHTML = `
        <div class="toast-icon" style="color: ${color}">${icon}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
    `;

    container.appendChild(toast);
    
    if (window.lucide) {
        lucide.createIcons({ root: toast });
    }

    // Auto remove after animation completes (5s total: 0.4 in + 4.6 out)
    setTimeout(() => {
        if(toast.parentNode) {
            toast.remove();
        }
    }, 5000);
};

// Example usage override for the forms to use premium toasts
const originalAlert = window.alert;
window.alert = function(msg) {
    if (msg.includes('✅') || msg.toLowerCase().includes('succès')) {
        showToast('Succès', msg.replace('✅', '').trim(), 'success');
    } else if (msg.includes('❌') || msg.toLowerCase().includes('erreur')) {
        showToast('Erreur', msg.replace('❌', '').trim(), 'error');
    } else {
        showToast('Information', msg, 'info');
    }
};
