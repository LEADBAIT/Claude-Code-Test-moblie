let btbFunctions = {

    init: function () {
        this.clearStorage();
        this.navigationArrow();
        this.toggleButton();
        this.elementorFormControl();
        this.stickyNav();
        this.sideMenuScroll();
        this.featuresItemsMobileSliderInit();
        this.employersBoxMobileSliderInit();
        this.changeFileUploadFieldInCareerForm();
        this.mobileSwiperRoutes();
        this.lobbyMenuLinksBehavior();
        this.initBankAmount();
    },

    initBankAmount: function (){
        fetch("https://investors.btbisrael.co.il/webapi/api/indexres/GetHeTotals")
            .then(res => res.json())
            .then(data => {
                const value = data.totalInvestment;
                const counterEl = document.getElementById("btb-counter");

                if (counterEl) {
                    let current = 0;
                    const duration = 1000;
                    const steps = 60;
                    const increment = value / steps;
                    const interval = duration / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= value) {
                            current = value;
                            clearInterval(timer);
                        }

                        counterEl.textContent = Math.floor(current).toLocaleString('en-US');
                    }, interval);
                }
            })
            .catch(() => {
                const el = document.getElementById("btb-counter");
                if (el) el.textContent = 0;
            });

    },

    clearStorage: function () {
        localStorage.removeItem('invest');
        localStorage.removeItem('loan');
    },

    sideMenuScroll: function () {
        const sideMenu = document.querySelector('.side-nav');
        const footer = document.querySelector('#main-footer');
        const pageHeader = document.querySelector('.page-header');

        let footerInViewPort = false;
        let pageHeaderInViewPort = false;

        if (!sideMenu || !pageHeader) return;

        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                pageHeaderInViewPort = entry.isIntersecting;
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        headerObserver.observe(pageHeader);

        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                footerInViewPort = entry.isIntersecting;
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        footerObserver.observe(footer);



        window.addEventListener('scroll', e => {
            if (footerInViewPort || pageHeaderInViewPort) {
                sideMenu.classList.add('hide-nav');
            } else {
                sideMenu.classList.remove('hide-nav');
            }
        })

    },

    getCurrentLanguage: function () {
        const htmlLang = document.documentElement.getAttribute('lang');
        if (htmlLang) {
            return htmlLang.substring(0, 2).toLowerCase();
        }
        return 'he';
    },

    setPolylangLink: function ( link ) {
      const switcher = document.querySelector('.lang-svg-switch');

      if (switcher) {
          switcher.href = link;
      }
    },

    getPageUrls: function ( inverse = false ) {
        const lang = this.getCurrentLanguage();

        if ( inverse ) {
            if ( lang === 'en' ) {
                return {
                    'invest': `${ajax_object.site_url}/invest`,
                    'loan': `${ajax_object.site_url}/loan`
                };
            } else {
                return {
                    'invest': `${ajax_object.site_url}/en/invest-en`,
                    'loan': `${ajax_object.site_url}/en/get-loan-en`
                };
            }
        }

        if (lang === 'en') {
            return {
                'invest': `${ajax_object.site_url}/en/invest-en`,
                'loan': `${ajax_object.site_url}/en/get-loan-en`
            };
        } else {
            return {
                'invest': `${ajax_object.site_url}/invest`,
                'loan': `${ajax_object.site_url}/loan`
            };
        }
    },

    toggleButton: function () {
        const toggleContainer = document.getElementById("toggle-container");
        const toggle = document.getElementById('toggle-circle');
        const investBtn = document.getElementById('invest-btn');
        const loanBtn = document.getElementById('loan-btn');
        const lobby = document.getElementById('lobby');
        const lobbyTitles = document.getElementById('lobby-titles');
        const investNav = document.getElementById('invest-nav');
        const loanNav = document.getElementById('loan-nav');
        const lobbyArrow = document.getElementById('lobby-arrow');
        const investMobileToggleText = document.querySelector('#invest-toggle-title');
        const loanMobileToggleText = document.querySelector('#loan-toggle-title');

        if( !toggleContainer ) {
            return;
        }

        let debounceTime;
        let lobbyDebounceId;
        let cachedTimeoutId;
        let ajaxTimeoutId;

        let isDragging = false;
        let startX = new DOMMatrixReadOnly(window.getComputedStyle(toggle).transform).m41;
        let currentX = 0;
        let offsetX = 0;
        let startTranslateX = 0;
        let currentTranslateX = new DOMMatrixReadOnly(window.getComputedStyle(toggle).transform).m41;;
        let startMove = false;
        let timeoutId = 0;
        let liTimeoutIds = [];
        const toggleContainerWidth = toggleContainer.clientWidth;
        const toggleWidth = toggle.clientWidth;
        let moveToRight = Math.trunc((toggleContainerWidth / 2) - ((toggleWidth / 2) + 7));
        let moveToLeft = Math.trunc(-((toggleContainerWidth / 2) - ((toggleWidth / 2) + 7)));

        if (!toggle || !investBtn || !loanBtn || !lobby) return;

        function handleClick(buttonType,mobile = false) {
            const isHidden = hideLobbyTitles();
            const isInvest = buttonType === "invest";


            clearTimeout(cachedTimeoutId);
            clearTimeout(ajaxTimeoutId);

            if(isCurrentLobby(buttonType)){
                return;
            };

            let mobileToggleText = {
                'invest': investMobileToggleText,
                'loan': loanMobileToggleText,
            }

            if( window.innerWidth <= 768 ) {
                if (mobileToggleText.hasOwnProperty(buttonType)) {
                    Object.values(mobileToggleText).forEach((item) => {
                        if (item) {

                            item.classList.remove('visible');
                        }
                    });
                    setTimeout(() => { mobileToggleText[buttonType].classList.add('visible'); }, 300);
                }
            }

            lobby.classList.toggle('invest', isInvest);
            lobby.classList.toggle('loan', !isInvest);

            if (isHidden) {
                setTimeout(() => {
                    if (isInvest) {
                        toggle.style.transform = `translateX(${moveToRight}px)`;
                        showLobbyNavDebounce(buttonType);
                        currentTranslateX = moveToRight;
                        startMove = true;
                        if (investBtn.classList.contains('opacity')) {
                            investBtn.classList.remove('opacity');
                        }
                        loanBtn.classList.add('opacity');
                    } else {
                        toggle.style.transform = `translateX(${moveToLeft}px)`;
                        showLobbyNavDebounce(buttonType);
                        currentTranslateX = moveToLeft;
                        startMove = true;
                        if (loanBtn.classList.contains('opacity')) {
                            loanBtn.classList.remove('opacity');
                        }
                        investBtn.classList.add('opacity');
                    }
                }, 300);
            } else {
                if (isInvest) {
                    toggle.style.transform = `translateX(${moveToRight}px)`;
                    showLobbyNavDebounce(buttonType);
                    currentTranslateX = moveToRight;
                    startMove = true;
                    if (investBtn.classList.contains('opacity')) {
                        investBtn.classList.remove('opacity');
                    }
                    loanBtn.classList.add('opacity');
                } else {
                    toggle.style.transform = `translateX(${moveToLeft}px)`;
                    showLobbyNavDebounce(buttonType);
                    currentTranslateX = moveToLeft;
                    startMove = true;
                    if (loanBtn.classList.contains('opacity')) {
                        loanBtn.classList.remove('opacity');
                    }
                    investBtn.classList.add('opacity');
                }
            }

            loadTemplate(buttonType);
        }

        function hideLobbyTitles() {
            if (!lobbyTitles || lobbyTitles.classList.contains('hidden')) return false;
            let lobbyVideo = document.getElementById('lobby-video');
            if (lobbyVideo) {
                lobbyVideo.classList.add('hide');
            }
            lobbyTitles.classList.add('hidden');
            return true;
        }

        function isCurrentLobby(name) {
            if (lobby.classList.contains(name)) {
                return true;
            }
            return false;
        }

        function showLobbyNav(lobby) {
            const navs = {'invest': investNav, 'loan': loanNav};

            const navigationArrowLinks = {
                'invest': '#invest-first-block',
                'loan': '#loan-first-block',
            }

            let navigation = navs[lobby];

            liTimeoutIds.forEach(id => {
                clearTimeout(id);
            })

            if (window.innerWidth <= 768) {
                let investLobbyTitle = document.querySelector('#invest-nav-title');
                let loanLobbyTitle = document.querySelector('#loan-nav-title');

                const mobileNavTitles = {
                    'invest': investLobbyTitle,
                    'loan': loanLobbyTitle,
                }

                Object.values(mobileNavTitles).forEach((item) => {
                    if(item) {
                        item.classList.remove('visible-title');
                    }
                });

                if (mobileNavTitles.hasOwnProperty(lobby)) {
                    mobileNavTitles[lobby]?.classList.add('visible-title');
                }

            }

            if (!navigation) return;

            if(lobbyArrow) {
                lobbyArrow.classList.remove('visible');
                if(navigationArrowLinks.hasOwnProperty(lobby)) {
                    lobbyArrow.href = navigationArrowLinks[lobby];
                }
            }

            navigation.style.display = "block";

            clearTimeout(timeoutId);

            timeoutId = setTimeout(function () {
                navigation.classList.add('show');
                let listItems = navigation.getElementsByTagName('li');

                Array.from(listItems).forEach((item, index) => {
                    let liTimeout = setTimeout(() => {
                        item.classList.add("show");
                        if ( index === listItems.length - 1 ) {
                            lobbyArrow.classList.add('visible');
                        }
                    }, index * 200);

                    liTimeoutIds.push(liTimeout);
                });

            }, 200);

        }

        function showLobbyNavDebounce(lobby){
            clearTimeout(lobbyDebounceId);

            let navs = {'invest': investNav, 'loan': loanNav};
            let navigation = navs[lobby];

            Object.values(navs).forEach(nav => {
                if(!nav) return;

                nav.classList.remove('first-view');

                if (nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    nav.style.display = "none";
                }
                if (nav !== navigation) {
                    nav.style.display = "none";
                    nav.querySelectorAll('li').forEach(li => {
                        li.classList.remove('show');
                    });
                }
            });

            lobbyDebounceId = setTimeout(function () {
                showLobbyNav(lobby);
            },200);
        }

        function preloadTemplate() {
            const currentPath = window.location.pathname;
            const isLobbyPage = currentPath === '/' ||
                currentPath.includes('/homepage-eng') ||
                currentPath.includes('/invest') ||
                currentPath.includes('/loan') ||
                currentPath.includes('/get-loan-en') ||
                currentPath.includes('/invest-en');

            if (isLobbyPage) {
                let templates = ['invest', 'loan'];
                templates.forEach(template => {
                    loadTemplate(template,true);
                })
            } else {
                console.log("The current page does not match the lobby pages.");
            }
        }

        preloadTemplate();

        async function loadTemplate(name,preload = false) {
            const container = document.getElementById('lobby-content');

            if (!container) {
                return;
            }

            let pagesUrl = btbFunctions.getPageUrls();
            const lang = btbFunctions.getCurrentLanguage();
            const cacheKey = lang === 'en' ? `${name}_en` : name;

            if(!preload) {
                let cachedContent = localStorage.getItem(cacheKey);
                if (cachedContent) {
                    // container.innerHTML = cachedContent;
                    cachedTimeoutId = setTimeout(()=>{
                        container.innerHTML = cachedContent;
                        elementorFrontend.init();
                        btbFunctions.stickyNav();
                        btbFunctions.featuresItemsMobileSliderInit(true);
                        btbFunctions.initBankAmount();

                        let inverse = true;
                        let inverseUrls = btbFunctions.getPageUrls( inverse );

                        btbFunctions.setPolylangLink(inverseUrls[name]);

                        window.history.pushState({ path: pagesUrl[name] }, '', pagesUrl[name]);
                    },500);
                    return;
                }
            }

            try {
                const response = await fetch(ajax_object.ajax_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ action: 'lobby_template', template: name })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem(name, data.data.content);
                    localStorage.setItem(cacheKey, data.data.content);

                    if(preload) return;

                    ajaxTimeoutId = setTimeout(()=>{
                        container.innerHTML = data.data.content;
                        btbFunctions.stickyNav();
                        elementorFrontend.init();
                        btbFunctions.featuresItemsMobileSliderInit(true);
                        btbFunctions.initBankAmount();

                        let inverse = true;
                        let inverseUrls = btbFunctions.getPageUrls( inverse );

                        btbFunctions.setPolylangLink(inverseUrls[name]);

                        window.history.pushState({ path: pagesUrl[name] }, '', pagesUrl[name]);
                    },500);

                } else {
                    console.error('Error parsing template');
                }
            } catch (err) {
                console.error('Error:', err);
            }
        }

        function handleClickDebounce(buttonType, mobile = false, delay = 500) {
            clearTimeout(debounceTime);

            debounceTime = setTimeout(() => {
                handleClick(buttonType, mobile);
            }, 500);
        }

        investBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleClickDebounce("invest");
        });

        loanBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleClickDebounce("loan");
        });

        function moveToggle() {

            toggleContainer.addEventListener("click", function (e) {
                e.stopPropagation();


                if (e.target === toggle) return;

                const containerRect = toggleContainer.getBoundingClientRect();
                const toggleRect = toggle.getBoundingClientRect();

                const clickX = e.clientX - containerRect.left;
                const toggleCenterX = toggleRect.left + toggleRect.width / 2 - containerRect.left;
                const threshold = 20;

                toggle.style.transition = "transform 0.5s ease-in-out";

                if (clickX > toggleCenterX + threshold) {
                    toggle.style.transform = `translateX(${moveToRight}px)`;
                    handleClickDebounce('invest', false);
                    currentTranslateX = moveToRight;
                } else if (clickX < toggleCenterX - threshold) {
                    toggle.style.transform = `translateX(${moveToLeft}px)`;
                    handleClickDebounce('loan', false);
                    currentTranslateX = moveToLeft;
                }
                startMove = true;
            });

            toggle.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX - currentTranslateX;
                toggle.style.transition = 'none';
            });

            document.addEventListener('mousemove', (event) => {
                if (!isDragging) return;

                currentX = event.clientX;
                let deltaX = currentX - startX;
                currentTranslateX = Math.max(moveToLeft, Math.min(moveToRight, startTranslateX + deltaX));

                toggle.style.transform = `translateX(${currentTranslateX}px)`;

                if (currentTranslateX <= (-11) || (currentTranslateX >= 11)) {
                    startMove = true;
                }
            });

            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                toggle.style.transition = 'transform 0.5s ease-in-out';

                if (Math.abs(startTranslateX) === moveToRight) {
                    if (currentTranslateX < startTranslateX && startMove) {
                        toggle.style.transform = `translateX(${moveToLeft}px)`;
                        handleClickDebounce('loan', false);
                        currentTranslateX = moveToLeft;
                    } else {
                        toggle.style.transform = `translateX(${moveToRight}px)`;
                        handleClickDebounce('invest', false);
                        currentTranslateX = moveToRight;
                    }
                }

                if (currentTranslateX >= -10 && currentTranslateX <= 10 && !startMove) {
                    toggle.style.transform = `translateX(0px)`;
                    currentTranslateX = 0;
                } else if (currentTranslateX < 0 && startMove) {
                    toggle.style.transform = `translateX(${moveToLeft}px)`;
                    handleClickDebounce('loan', false);
                    currentTranslateX = moveToLeft;
                } else {
                    toggle.style.transform = `translateX(${moveToRight}px)`;
                    handleClickDebounce('invest', false);
                    currentTranslateX = moveToRight;
                }

                offsetX = currentX;
            });


            if( window.innerWidth <= 768 ) {

                toggle.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    startX = e.touches[0].clientX - currentTranslateX;
                    toggle.style.transition = 'none';
                });

                document.addEventListener('touchmove', (event) => {
                    if (!isDragging) return;

                    currentX = event.touches[0].clientX;
                    let deltaX = currentX - startX;
                    currentTranslateX = Math.max(moveToLeft, Math.min(moveToRight, startTranslateX + deltaX));

                    toggle.style.transform = `translateX(${currentTranslateX}px)`;

                    if (currentTranslateX <= (-11) || (currentTranslateX >= 11)) {
                        startMove = true;
                    }
                });

                document.addEventListener('touchend', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    toggle.style.transition = 'transform 0.5s ease-in-out';

                    if (Math.abs(startTranslateX) === moveToRight) {
                        if (currentTranslateX < startTranslateX && startMove) {
                            toggle.style.transform = `translateX(${moveToLeft}px)`;
                            handleClickDebounce('loan', false);
                            currentTranslateX = moveToLeft;
                        } else {
                            toggle.style.transform = `translateX(${moveToRight}px)`;
                            handleClickDebounce('invest', false);
                            currentTranslateX = moveToRight;
                        }
                    }

                    if (currentTranslateX >= -10 && currentTranslateX <= 10 && !startMove) {
                        // toggle.style.transform = `translateX(0px)`;
                        // currentTranslateX = 0;
                    } else if (currentTranslateX < 0 && startMove) {
                        toggle.style.transform = `translateX(${moveToLeft}px)`;
                        handleClickDebounce('loan', false);
                        currentTranslateX = moveToLeft;
                    } else {
                        toggle.style.transform = `translateX(${moveToRight}px)`;
                        handleClickDebounce('invest', false);
                        currentTranslateX = moveToRight;
                    }

                    offsetX = currentX;
                });

            }
        }

        moveToggle();

    },

    lobbyMenuLinksBehavior: function () {
        const investMenu = document.getElementById('invest-nav');
        const loanMenu = document.getElementById('loan-nav');

        let menus = [investMenu, loanMenu];

        menus.forEach(menu => {
            if(menu) {
                let links = menu.querySelectorAll('a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            let targetId = link.getAttribute('href').substring(1);
                            let targetSection = document.getElementById(targetId);

                            if (targetSection) {
                                const offset = 100;
                                const top = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                                window.scrollTo({
                                    top: top,
                                    behavior: 'smooth'
                                });
                            }
                        });
                    }
                })
            }
        })


    },

    stickyNav: function (){
        let stickyNav = document.querySelector('.sticky-navigation');
        let lobbyContent = document.querySelector('#lobby-content');

        if(!stickyNav || !lobbyContent) {
            return;
        }

        let lobbyContentOffset = lobbyContent.offsetTop;

        window.addEventListener('scroll', function () {
            var scrollPosition = window.scrollY;

            if (scrollPosition >= lobbyContentOffset) {
                stickyNav.classList.add('visible');
            } else {
                stickyNav.classList.remove('visible');
            }
        });

        let navLinks = document.querySelectorAll('.sticky-navigation li a');

        window.addEventListener('scroll', function () {
            let scrollPosition = window.scrollY;

            if(!navLinks && navLinks.length < 0){
                return;
            }

            navLinks.forEach(function (link) {
                    let targetId = link.getAttribute('href').substring(1);
                    let targetSection = document.getElementById(targetId);

                    if (targetSection) {
                        let sectionOffsetTop = targetSection.offsetTop;
                        let sectionHeight = targetSection.offsetHeight;

                        if (scrollPosition >= sectionOffsetTop + 200 && scrollPosition < sectionOffsetTop + sectionHeight + 200) {
                            link.parentElement.classList.add('active-item');
                        } else {
                            link.parentElement.classList.remove('active-item');
                        }

                        link.addEventListener('click', function (e) {
                            e.preventDefault();

                            if (targetSection) {
                                const offset = 100;
                                const top = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                                window.scrollTo({
                                    top: top,
                                    behavior: 'smooth'
                                });
                            }
                        });
                    }
                }
            );
        });

    },

    elementorFormControl: function (){

        //Disable first option in select
        let selectField = document.querySelector('#form-field-field_0441916 option:first-child');

        if( selectField ) {
            selectField.disabled = true;
        }

        //Make label moveable
        const form = document.querySelector('.page-form');

        if(!form) return;

        const inputFields = form.querySelectorAll(
            '.elementor-field-type-tel, .elementor-field-type-text, .elementor-field-type-email'
        );

        if(inputFields && inputFields.length > 0) {
            inputFields.forEach(function (inputField) {
                let input = inputField.querySelector('input');
                let label = inputField.querySelector('label');

                if(!input || !label) return;

                if( document.activeElement === input ) {
                    label.classList.add('active-label');
                } else {
                    label.classList.remove('active-label');
                }

                input.addEventListener('change', (e) => {
                    if (e.target.value.length > 1) {
                        label.classList.add('active-label');
                    } else {
                        label.classList.remove('active-label');
                    }
                })

            })
        }
    },

    navigationArrow: function() {
        const lobbyArrow = document.getElementById('lobby-arrow');

        if(!lobbyArrow) return;

        lobbyArrow.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let targetId = lobbyArrow.getAttribute('href').substring(1);
            let targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    },

    featuresItemsMobileSliderInit: function (invoke = false) {
        let swiperInstance = null;

        if (window.elementorFrontend && window.elementorFrontend.isEditMode()) {
            return;
        }

        function setEqualSlideHeights() {
            const slides = document.querySelectorAll('#features-slider .swiper-slide');
            let maxHeight = 0;

            slides.forEach(slide => {
                slide.style.height = 'auto';
                maxHeight = Math.max(maxHeight, slide.offsetHeight) + 5;
            });

            slides.forEach(slide => {
                slide.style.height = maxHeight + 'px';
            });
        }

        function initMobileSwiper() {
            const container = document.getElementById('features-slider');
            const wrapper = document.getElementById('features-inner');
            const tariffsContainer = document.getElementById('routes-tariffs');
            const tariffsWrapper = document.getElementById('routes-tariffs');

            if (!container || !wrapper ) return;

            const slides = wrapper.querySelectorAll('.features-item');

            if(!slides) return;

            if (window.innerWidth < 768 && !swiperInstance) {
                // Add Swiper classes
                container.classList.add('swiper');
                wrapper.classList.add('swiper-wrapper');
                slides.forEach(slide => slide.classList.add('swiper-slide'));

                const existingPagination = container.querySelector('.swiper-pagination');
                if (existingPagination) existingPagination.remove();

                const pagination = document.createElement('div');
                pagination.classList.add('swiper-pagination');
                container.appendChild(pagination);

                swiperInstance = new Swiper('#features-slider', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    autoplay: {
                        delay: 5000,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    on: {
                        init: setEqualSlideHeights,
                        resize: setEqualSlideHeights
                    }
                });
            } else if (window.innerWidth >= 768 && swiperInstance) {
                swiperInstance.destroy(true, true);
                swiperInstance = null;

                container.classList.remove('swiper');
                wrapper.classList.remove('swiper-wrapper');
                slides.forEach(slide => {
                    slide.classList.remove('swiper-slide');
                    slide.style.height = '';
                });
            }
        }

        if (invoke) {
            initMobileSwiper();
        }

        window.addEventListener('load', initMobileSwiper);
        window.addEventListener('resize', initMobileSwiper);
    },

    mobileSwiperRoutes: function () {

        let swiperInstance = null;

        if (window.elementorFrontend && window.elementorFrontend.isEditMode()) {
            return;
        }

        function setEqualSlideHeights() {
            const slides = document.querySelectorAll('#routes-tariffs .swiper-slide');
            let maxHeight = 0;

            slides.forEach(slide => {
                slide.style.height = 'auto';
                maxHeight = Math.max(maxHeight, slide.offsetHeight) + 5;
            });

            slides.forEach(slide => {
                slide.style.height = maxHeight + 'px';
            });
        }

        function initMobileSwiper() {
            const container = document.getElementById('routes-tariffs-slider');
            const wrapper = document.getElementById('routes-tariffs-inner');

            if (!container || !wrapper ) return;

            const slides = wrapper.querySelectorAll('.routes-tariffs-item');

            if(!slides) return;

            if (window.innerWidth < 768 && !swiperInstance) {
                // Add Swiper classes
                container.classList.add('swiper');
                wrapper.classList.add('swiper-wrapper');
                slides.forEach(slide => slide.classList.add('swiper-slide'));

                const existingPagination = container.querySelector('.swiper-pagination');
                if (existingPagination) existingPagination.remove();

                const pagination = document.createElement('div');
                pagination.classList.add('swiper-pagination','dynamic-pagination');
                container.appendChild(pagination);

                swiperInstance = new Swiper('#routes-tariffs-slider', {
                    slidesPerView: 3,
                    spaceBetween: 10,
                    centeredSlides: true,
                    loop: true,
                    // autoplay: {
                    //     delay: 5000,
                    // },
                    autoplay: false,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    on: {
                        init: setEqualSlideHeights,
                        resize: setEqualSlideHeights
                    }
                });
            } else if (window.innerWidth >= 768 && swiperInstance) {
                swiperInstance.destroy(true, true);
                swiperInstance = null;

                container.classList.remove('swiper');
                wrapper.classList.remove('swiper-wrapper');
                slides.forEach(slide => {
                    slide.classList.remove('swiper-slide');
                    slide.style.height = '';
                });
            }
        }

        window.addEventListener('load', initMobileSwiper);
        window.addEventListener('resize', initMobileSwiper);

    },
    employersBoxMobileSliderInit: function () {
        let swiperInstance = null;

        if (window.elementorFrontend && window.elementorFrontend.isEditMode()) {
            return;
        }

        function initSwiper() {
            const employersContainer = document.getElementById('employers-container');
            const employersContainerInner = document.getElementById('employers-container-inner');

            if (!employersContainer || !employersContainerInner) return;


            const allEmployers = employersContainer.querySelectorAll('.elementor-widget-employee-popup-box-widget');


            if (window.innerWidth < 768 && !swiperInstance) {
                // Hide originals
                allEmployers.forEach(el => {
                    el.style.display = 'none';
                });

                // Create Swiper container
                const swiperContainer = document.createElement('div');
                swiperContainer.classList.add('swiper');
                swiperContainer.id = 'employers-swiper';

                const swiperWrapper = document.createElement('div');
                swiperWrapper.classList.add('swiper-wrapper');

                function bindDialogEvents(clone) {
                    const dialog = clone.querySelector('.employee-dialog');
                    const closeBtn = dialog?.querySelector('.close-btn');
                    const popUpLink = clone.querySelector('.popup-link');

                    if (!dialog || !closeBtn || !popUpLink) return;

                    popUpLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        dialog.showModal();
                    });

                    closeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        dialog.close();
                    });
                }

                allEmployers.forEach(el => {
                    const clone = el.cloneNode(true);
                    clone.classList.add('swiper-slide');
                    clone.style.display = '';
                    swiperWrapper.appendChild(clone);
                    bindDialogEvents(clone);
                });

                swiperContainer.appendChild(swiperWrapper);

                const pagination = document.createElement('div');
                pagination.classList.add('swiper-pagination');
                swiperContainer.appendChild(pagination);

                employersContainerInner.appendChild(swiperContainer);

                swiperInstance = new Swiper('#employers-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    preventClicksPropagation: false
                });

                if (typeof elementorFrontend !== 'undefined') {
                    elementorFrontend.init();
                }

            }

            if (window.innerWidth >= 768 && swiperInstance) {
                swiperInstance.destroy(true, true);
                swiperInstance = null;
                let swiperContainer = document.getElementById('employers-swiper');
                if (swiperContainer) {
                    swiperContainer.remove();
                }
                allEmployers.forEach(el => {
                    el.style.display = '';
                });
            }
        }

        window.addEventListener('load', initSwiper);
        window.addEventListener('resize', initSwiper);
    },
    changeFileUploadFieldInCareerForm: function (){
        const input = document.querySelector('.custom-fileinput-wrapper input[type="file"]');
        const filenameSpan = document.querySelector('.custom-fileinput-wrapper .custom-filename');
        const button = document.querySelector('.custom-fileinput-wrapper .elementor-upload-button');

        if(!input || !filenameSpan || !button) return;

        const lang = this.getCurrentLanguage();
        const uploadText = {
            he: 'אנא העלה קובץ PDF או Word',
            en: 'Please upload a PDF or Word file'
        };

        filenameSpan.textContent = uploadText[lang] || uploadText.he;

        button.addEventListener("click", () => {
            input.click();
        });

        input.addEventListener('change', () => {
            filenameSpan.textContent = input.files.length ? input.files[0].name : 'No file chosen';
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    btbFunctions.init();
});