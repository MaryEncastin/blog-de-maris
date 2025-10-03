document.addEventListener('DOMContentLoaded', function() {
    const showerContainer = document.getElementById('showerContainer');
    if (showerContainer) {
        const foodIcons = ['🍓', '🍇', '🍉', '🍌', '🍎', '🥭', '🍍', '🥑', '🥦', '🥕', '🥚', '🍳', '🥞', '🍔', '🍕', '🌮'];
        const config = {
            density: 2.0,
            speed: 2,
            size: { min: 1, max: 2 },
            rotation: true,
            wind: 0.2,
            opacity: { min: 0.6, max: 0.9 }
        };

        let activeElements = [];
        let animationFrameId;

        function createFoodItem() {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.textContent = foodIcons[Math.floor(Math.random() * foodIcons.length)];

            const props = {
                x: Math.random() * 100,
                y: -10,
                size: Math.random() * (config.size.max - config.size.min) + config.size.min,
                speed: Math.random() * 0.8 + 0.7,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 4,
                windEffect: (Math.random() - 0.5) * config.wind,
                opacity: Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min,
                createdAt: Date.now(),
                lifeTime: 4000 + Math.random() * 3000
            };

            updateFoodItemStyle(foodItem, props);
            showerContainer.appendChild(foodItem);
            activeElements.push({ element: foodItem, properties: props });

            if (activeElements.length > 50) {
                const oldest = activeElements.shift();
                if (oldest.element.parentNode) oldest.element.parentNode.removeChild(oldest.element);
            }
        }

        function updateFoodItemStyle(element, props) {
            element.style.position = 'absolute';
            element.style.fontSize = `${props.size}rem`;
            element.style.opacity = props.opacity;
            element.style.left = `${props.x}%`;
            element.style.top = `${props.y}%`;
            element.style.transform = `translate(-50%, -50%) rotate(${props.rotation}deg)`;
            element.style.pointerEvents = 'none';
        }

        function animateShower() {
            const currentTime = Date.now();
            for (let i = activeElements.length - 1; i >= 0; i--) {
                const item = activeElements[i];
                const props = item.properties;
                const elapsed = currentTime - props.createdAt;

                if (elapsed > props.lifeTime) {
                    if (item.element.parentNode) item.element.parentNode.removeChild(item.element);
                    activeElements.splice(i, 1);
                    continue;
                }

                props.y += props.speed * config.speed;
                props.x += props.windEffect;
                if (config.rotation) props.rotation += props.rotationSpeed;

                if (elapsed / props.lifeTime > 0.7) {
                    props.opacity = config.opacity.min * (1 - ((elapsed / props.lifeTime - 0.7) / 0.3));
                }

                if (props.y > 100) props.y = 100;
                if (props.x < 0) props.x = 0;
                if (props.x > 100) props.x = 100;

                updateFoodItemStyle(item.element, props);
            }

            if (Math.random() < config.density * 0.1) createFoodItem();
            animationFrameId = requestAnimationFrame(animateShower);
        }

        for (let i = 0; i < 12; i++) setTimeout(createFoodItem, i * 150);
        animationFrameId = requestAnimationFrame(animateShower);

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) cancelAnimationFrame(animationFrameId);
            else animationFrameId = requestAnimationFrame(animateShower);
        });

        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrameId);
            activeElements = [];
        });
    }

    const hamburguesa = document.querySelector('.hamburguesa');
    const nav = document.querySelector('nav');
    if (hamburguesa && nav) {
        hamburguesa.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburguesa.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    const modoOscuro = document.getElementById('modo-oscuro');
    if (modoOscuro) {
        modoOscuro.addEventListener('click', function() {
            document.body.classList.toggle('dark');
            this.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
            localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        });

        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            modoOscuro.textContent = '☀️';
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const formNewsletter = document.getElementById('form-newsletter');
    if (formNewsletter) {
        formNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`¡Gracias por suscribirte con el email: ${email}!`);
            this.reset();
        });
    }
});
