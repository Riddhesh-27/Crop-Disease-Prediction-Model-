document.addEventListener('DOMContentLoaded', () => {
    /* =======================================
       1. ACTIVE NAVIGATION HIGHLIGHT
    ======================================= */
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Remove trailing slash for comparison if necessary, but here exact match is fine
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-nav');
        } else if (currentPath === '/' && link.getAttribute('href') === '/') {
            link.classList.add('active-nav');
        }
    });

    /* =======================================
       1.5. BUBBLE / WATER TRAIL CURSOR
    ======================================= */
    let lastBubbleTime = 0;
    
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Create a bubble every 40ms to avoid too many DOM elements
        if (now - lastBubbleTime > 40) {
            createBubble(e.clientX, e.clientY);
            lastBubbleTime = now;
        }
    });

    function createBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.className = 'water-bubble';
        
        // Randomize size slightly for organic feel
        const size = Math.random() * 15 + 5; // 5px to 20px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Position at cursor
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        
        document.body.appendChild(bubble);
        
        // Remove bubble after animation ends (1 second)
        setTimeout(() => {
            bubble.remove();
        }, 1000);
    }

    /* =======================================
       2. E-COMMERCE SHOPPING CART
    ======================================= */
    let cart = [];
    const GST_RATE = 0.18; // 18% Tax

    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items');
    
    // Toggle Cart
    function toggleCart() {
        cartPanel.classList.toggle('open');
        cartOverlay.classList.toggle('active');
    }

    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // Check if item exists
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            updateCartUI();
            
            // Visual feedback
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i>'; }, 1000);
        });
    });

    // Remove from Cart
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateCartUI() {
        // Update Badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) cartBadge.innerText = totalItems;

        // Render Items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            document.getElementById('cart-subtotal').innerText = '₹0.00';
            document.getElementById('cart-tax').innerText = '₹0.00';
            document.getElementById('cart-total').innerText = '₹0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += (item.price * item.quantity);
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Calculate Totals
        const tax = subtotal * GST_RATE;
        const total = subtotal + tax;

        document.getElementById('cart-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
        document.getElementById('cart-tax').innerText = `₹${tax.toFixed(2)}`;
        document.getElementById('cart-total').innerText = `₹${total.toFixed(2)}`;
        document.getElementById('checkout-total-display').innerText = `₹${total.toFixed(2)}`;
    }

    // Checkout Flow
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const cancelCheckout = document.getElementById('cancel-checkout');
    const payBtn = document.getElementById('pay-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Your cart is empty!');
            toggleCart();
            checkoutModal.classList.remove('hidden');
        });
    }

    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', () => {
            checkoutModal.classList.add('hidden');
        });
    }

    if (payBtn) {
        payBtn.addEventListener('click', () => {
            payBtn.innerText = 'Processing...';
            setTimeout(() => {
                alert('Payment Successful! Thank you for your purchase.');
                cart = [];
                updateCartUI();
                checkoutModal.classList.add('hidden');
                payBtn.innerText = 'Pay Now';
            }, 1500);
        });
    }

    // Shop Filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.product-card').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    /* =======================================
       3. GLOBAL FLOATING CHATBOT
    ======================================= */
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    
    // Remember last analysis
    let currentContext = JSON.parse(sessionStorage.getItem('lastAnalysis')) || null;
    
    // Chat State variables for Crop Recommendation Flow
    let recommendingMode = false;
    let awaitingSoil = false;
    let awaitingTemp = false;
    let userSoil = '';
    let userTemp = '';

    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if(!chatWindow.classList.contains('hidden')) chatInput.focus();
        });
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    function handleChat() {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;

        addUserMessage(chatInput.value);
        chatInput.value = '';

        setTimeout(() => {
            // Crop Recommendation Flow logic
            if (text.includes('plant') || text.includes('grow') || text.includes('recommend') || recommendingMode) {
                if (!recommendingMode) {
                    recommendingMode = true;
                    awaitingSoil = true;
                    addBotMessage("I can help you decide what to plant! First, what type of **soil** do you have in your region? (e.g., Loamy, Clay, Sandy)");
                    return;
                }
                
                if (awaitingSoil) {
                    userSoil = text;
                    awaitingSoil = false;
                    awaitingTemp = true;
                    addBotMessage(`Got it. Your soil is mostly **${userSoil}**. Now, what is the average **temperature** or climate right now? (e.g., Warm, Cold, 25C)`);
                    return;
                }

                if (awaitingTemp) {
                    userTemp = text;
                    awaitingTemp = false;
                    recommendingMode = false; // Reset flow
                    
                    // Simple logic simulation
                    let recommendation = "Corn or Soybeans";
                    if(userSoil.includes('sand') || userTemp.includes('hot') || userTemp.includes('warm')) recommendation = "Tomatoes or Peppers";
                    if(userSoil.includes('clay') || userTemp.includes('cold')) recommendation = "Potatoes or Apples";

                    addBotMessage(`Based on your **${userSoil}** soil and **${userTemp}** climate, I highly recommend planting **${recommendation}**! You can buy the premium seeds directly from our Marketplace.`);
                    return;
                }
            }

            // Disease context logic
            if (!currentContext) {
                addBotMessage("Please analyze an image in the Analyze page, or ask me *'What should I plant?'* for a recommendation!");
                return;
            }

            const info = currentContext.info;
            let response = "I'm not sure. Ask me about 'fertilizers', 'pesticides', 'treatment', or 'what to plant'.";

            if (text.includes('fertilizer') || text.includes('npk')) {
                response = `**Fertilizers for ${currentContext.disease}:** ${info.fertilizers}`;
            } else if (text.includes('pesticide') || text.includes('chemical') || text.includes('spray')) {
                response = `**Pesticides to use:** ${info.pesticides}`;
            } else if (text.includes('solution') || text.includes('treatment') || text.includes('cure') || text.includes('how to fix')) {
                response = `**Treatment Solution:** ${info.solution}`;
            } else if (text.includes('what is') || text.includes('describe') || text.includes('details')) {
                response = `**Description:** ${info.description}`;
            } else if (text.includes('quality') || text.includes('health')) {
                response = `The plant quality is currently estimated at ${currentContext.quality.toFixed(1)}%.`;
            }

            addBotMessage(response);
        }, 600);
    }

    function addBotMessage(text) {
        const chatMessages = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addUserMessage(text) {
        const chatMessages = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    /* =======================================
       4. ANALYZE IMAGE UPLOAD
    ======================================= */
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadForm = document.getElementById('upload-form');

    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drop-zone--over');
        });

        ['dragleave', 'dragend'].forEach(type => {
            dropZone.addEventListener(type, () => dropZone.classList.remove('drop-zone--over'));
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drop-zone--over');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                updateDropZoneText(e.dataTransfer.files[0].name);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) updateDropZoneText(fileInput.files[0].name);
        });
    }

    function updateDropZoneText(filename) {
        const prompt = dropZone.querySelector('.drop-zone__prompt');
        prompt.innerHTML = `<i class="fa-solid fa-file-image"></i> ${filename}`;
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!fileInput.files.length) return;

            const formData = new FormData(uploadForm);
            const submitBtn = document.getElementById('analyze-btn');
            const loading = document.getElementById('loading');
            const resultsSection = document.getElementById('results-section');

            submitBtn.classList.add('hidden');
            loading.classList.remove('hidden');
            resultsSection.classList.add('hidden');

            try {
                const response = await fetch('/predict', { method: 'POST', body: formData });
                const data = await response.json();

                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    displayResults(data);
                    
                    // Save to session storage for the global chatbot
                    sessionStorage.setItem('lastAnalysis', JSON.stringify(data));
                    currentContext = data;
                    
                    // Pop open chatbot to alert user
                    if (chatWindow.classList.contains('hidden')) {
                        setTimeout(() => {
                            chatWindow.classList.remove('hidden');
                            addBotMessage(`I've analyzed the image and detected **${data.disease}**. How can I assist you further?`);
                        }, 1000);
                    }
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred during analysis.");
            } finally {
                submitBtn.classList.remove('hidden');
                loading.classList.add('hidden');
            }
        });
    }

    function displayResults(data) {
        const resultsSection = document.getElementById('results-section');
        resultsSection.classList.remove('hidden');

        const previewImg = document.getElementById('preview-image');
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => { previewImg.src = e.target.result; }
        reader.readAsDataURL(file);

        document.getElementById('disease-name').innerText = data.disease;
        
        const qualityFill = document.getElementById('quality-fill');
        const qualityText = document.getElementById('quality-text');
        
        setTimeout(() => {
            qualityFill.style.width = `${data.quality}%`;
            qualityText.innerText = `${data.quality.toFixed(1)}%`;
            if (data.quality > 70) qualityFill.style.background = 'linear-gradient(90deg, #eab308, #22c55e)';
            else if (data.quality > 40) qualityFill.style.background = 'linear-gradient(90deg, #ef4444, #eab308)';
            else qualityFill.style.background = '#ef4444';
        }, 300);

        document.getElementById('desc-text').innerText = data.info.description || "No description available.";
        document.getElementById('fert-text').innerText = data.info.fertilizers || "N/A";
        document.getElementById('pest-text').innerText = data.info.pesticides || "N/A";
        document.getElementById('sol-text').innerText = data.info.solution || "N/A";
    }
});
