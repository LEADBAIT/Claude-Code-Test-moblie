class SwiperPriceWidgetHandler extends elementorModules.frontend.handlers.Base {

    /**
     * Update Widget Content
     *
     * Custom method used by the widget to insert control values using JS.
     */
    updateWidgetContent() {
        if ( ! this.contentWrapper ) {
            const widgetUniqueSelector = `div[data-id="${this.getID()}"] .swiper-price-container-uco`;
            this.contentWrapper = document.querySelector( widgetUniqueSelector );
        }

        if (typeof Swiper !== 'undefined') {

            let slidesPerView = this.getElementSettings('slides_per_view') || 3 ;
            let slidesPerViewTablet = this.getElementSettings('slides_per_view_tablet') || 3 ;
            let slidesPerViewMobile = this.getElementSettings('slides_per_view_mobile') || 3 ;
            let spaceBetween = this.getElementSettings('slides_space_between') || 10 ;
            let spaceBetweenTablet = this.getElementSettings('slides_space_between_tablet') || 10 ;
            let spaceBetweenMobile = this.getElementSettings('slides_space_between_mobile') || 10 ;

            let autoplay = this.getElementSettings('autoplay') === 'yes' ? true : false;
            let delay = this.getElementSettings('delay') || 5000;

            if (this.swiperInstance) {
                this.swiperInstance.destroy();
            }

            this.swiperInstance = new Swiper(this.contentWrapper, {
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
                centeredSlides: true,
                speed: 600,
                loop: true,
                autoplay: autoplay ? {
                    delay: delay,
                } : false,
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: slidesPerViewMobile,
                        spaceBetween: spaceBetweenMobile
                    },

                    780: {
                        slidesPerView: slidesPerViewTablet,
                        spaceBetween: spaceBetweenTablet
                    },
                    1024: {
                        slidesPerView: slidesPerView,
                        spaceBetween: spaceBetween,
                    }
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
            });

        }
    }

    /**
     * On Init
     *
     * Runs when the widget is loaded and initialized in the frontend.
     */
    onInit() {
        this.updateWidgetContent();
    }

    /**
     * On Element Change
     *
     * Runs every time a control value is changed by the user in the editor.
     *
     * @param {string} propertyName - The ID of the control that was changed.
     */
    onElementChange(propertyName) {
        if (propertyName === 'slides_per_view' || propertyName === 'slides_per_view_tablet' || propertyName === 'slides_per_view_mobile' || propertyName === 'slides_space_between' || propertyName === 'slides_space_between_tablet' || propertyName === 'slides_space_between_mobile' ) {
            this.updateWidgetContent();
        }
    }

}

/**
 * Register JS Handler for the Widget
 *
 * When Elementor frontend is initiated, and the widget is ready, register the widget JS handler.
 */
window.addEventListener('elementor/frontend/init', () => {
    const addHandler = ($element) => {
        elementorFrontend.elementsHandler.addHandler(SwiperPriceWidgetHandler, { $element });
    };

    elementorFrontend.hooks.addAction('frontend/element_ready/price-slider-widget.default', addHandler);
});


class SwiperContentWidgetHandler extends elementorModules.frontend.handlers.Base {

    /**
     * Update Widget Content
     *
     * Custom method used by the widget to insert control values using JS.
     */
    updateWidgetContent() {
        if ( ! this.contentWrapper ) {
            const widgetUniqueSelector = `div[data-id="${this.getID()}"] .content-slider-container-uco`;
            this.contentWrapper = document.querySelector( widgetUniqueSelector );
        }

        function setEqualSlideHeights(contentWrapper) {
            const slides = contentWrapper.querySelectorAll('.swiper-slide');
            if(!slides.length) return;
            
            let maxHeight = 0;

            slides.forEach(slide => {
                slide.style.height = 'auto';
                maxHeight = Math.max(maxHeight, slide.offsetHeight);
            });

            slides.forEach(slide => {
                slide.style.height = maxHeight + 'px';
            });
        }

        if (typeof Swiper !== 'undefined') {

            let slidesPerView = this.getElementSettings('slides_per_view') || 3 ;
            let slidesPerViewTablet = this.getElementSettings('slides_per_view_tablet') || 3 ;
            let slidesPerViewMobile = this.getElementSettings('slides_per_view_mobile') || 3 ;
            let spaceBetween = this.getElementSettings('slides_space_between') || 10 ;
            let spaceBetweenTablet = this.getElementSettings('slides_space_between_tablet') || 10 ;
            let spaceBetweenMobile = this.getElementSettings('slides_space_between_mobile') || 10 ;

            let autoplay = this.getElementSettings('autoplay') === 'yes' ? true : false;
            let delay = this.getElementSettings('delay') || 5000;

            if (this.swiperInstance) {
                this.swiperInstance.destroy();
            }

            this.swiperInstance = new Swiper(this.contentWrapper, {
                slidesPerView: slidesPerViewMobile,
                spaceBetween: spaceBetween,
                speed: 800,
                loop: true,
                autoplay: autoplay ? {
                    delay: delay,
                } : false,
                // on: {
                //     init: () => setEqualSlideHeights(this.contentWrapper),
                //     resize: () => setEqualSlideHeights(this.contentWrapper),
                // },
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: slidesPerViewMobile,
                        spaceBetween: spaceBetweenMobile
                    },

                    780: {
                        slidesPerView: slidesPerViewTablet,
                        spaceBetween: spaceBetweenTablet
                    },
                    1024: {
                        slidesPerView: slidesPerView,
                        spaceBetween: spaceBetween,
                    }
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
            });

        }
    }

    /**
     * On Init
     *
     * Runs when the widget is loaded and initialized in the frontend.
     */
    onInit() {
        this.updateWidgetContent();
    }

    /**
     * On Element Change
     *
     * Runs every time a control value is changed by the user in the editor.
     *
     * @param {string} propertyName - The ID of the control that was changed.
     */
    onElementChange(propertyName) {
        if (propertyName === 'slides_per_view' || propertyName === 'slides_per_view_tablet' || propertyName === 'slides_per_view_mobile' || propertyName === 'slides_space_between' || propertyName === 'slides_space_between_tablet' || propertyName === 'slides_space_between_mobile' ) {
            this.updateWidgetContent();
        }
    }

}


window.addEventListener('elementor/frontend/init', () => {
    const addHandlerContent = ($element) => {
        elementorFrontend.elementsHandler.addHandler(SwiperContentWidgetHandler, { $element });
    };

    elementorFrontend.hooks.addAction('frontend/element_ready/content-slider-widget.default', addHandlerContent);
});

class SwiperTestimonialsVideoWidgetHandler extends elementorModules.frontend.handlers.Base {

    /**
     * Update Widget Content
     *
     * Custom method used by the widget to insert control values using JS.
     */
    updateWidgetContent() {
        if ( ! this.contentWrapper ) {
            const widgetUniqueSelector = `div[data-id="${this.getID()}"] .video-testimonials-slider-container-uco`;
            this.contentWrapper = document.querySelector( widgetUniqueSelector );
        }

        if (typeof Swiper !== 'undefined') {

            let slidesPerView = this.getElementSettings('slides_per_view') || 3 ;
            let slidesPerViewTablet = this.getElementSettings('slides_per_view_tablet') || 3 ;
            let slidesPerViewMobile = this.getElementSettings('slides_per_view_mobile') || 3 ;
            let spaceBetween = this.getElementSettings('slides_space_between') || 10 ;
            let spaceBetweenTablet = this.getElementSettings('slides_space_between_tablet') || 10 ;
            let spaceBetweenMobile = this.getElementSettings('slides_space_between_mobile') || 10 ;

            let autoplay = this.getElementSettings('autoplay') === 'yes' ? true : false;
            let delay = this.getElementSettings('delay') || 5000;


            if (this.swiperInstance) {
                this.swiperInstance.destroy();
            }

            this.swiperInstance = new Swiper(this.contentWrapper, {
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
                speed: 800,
                a11y: false,
                simulateTouch: false,
                autoplay: autoplay ? {
                    delay: delay,
                } : false,
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: slidesPerViewMobile,
                        spaceBetween: spaceBetweenMobile
                    },

                    780: {
                        slidesPerView: slidesPerViewTablet,
                        spaceBetween: spaceBetweenTablet
                    },
                    1024: {
                        slidesPerView: slidesPerView,
                        spaceBetween: spaceBetween,
                    }
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
            });

        }

        let playBtns = this.contentWrapper.querySelectorAll('.play-btn');
        const allVideos = this.contentWrapper.querySelectorAll('video');

        playBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let wrap = e.target.closest('.swiper-slide');
                let video = wrap.querySelector('video');
                let navigation = wrap.querySelector('.video-nav');
                let poster = wrap.querySelector('.poster-image');

                console.log('click');

                poster.classList.add('hide');

                allVideos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        if (!otherVideo.paused) {
                            otherVideo.pause();
                        }
                    }
                });

                navigation.classList.add('hide-nav');
                video.play();
                video.setAttribute('controls', 'controls');

                video.addEventListener('pause', (e) => {
                    video.removeAttribute('controls');
                    navigation.classList.remove('hide-nav');
                    poster.classList.remove('hide');
                });

                video.addEventListener('ended', (e) => {
                    video.removeAttribute('controls');
                    navigation.classList.remove('hide-nav');
                    poster.classList.remove('hide');
                })



            })
        });
    }

    /**
     * On Init
     *
     * Runs when the widget is loaded and initialized in the frontend.
     */
    onInit() {
        this.updateWidgetContent();
    }

    /**
     * On Element Change
     *
     * Runs every time a control value is changed by the user in the editor.
     *
     * @param {string} propertyName - The ID of the control that was changed.
     */
    onElementChange(propertyName) {
        if (propertyName === 'slides_per_view' || propertyName === 'slides_per_view_tablet' || propertyName === 'slides_per_view_mobile' || propertyName === 'slides_space_between' || propertyName === 'slides_space_between_tablet' || propertyName === 'slides_space_between_mobile' ) {
            this.updateWidgetContent();
        }
    }

}


window.addEventListener('elementor/frontend/init', () => {
    const addHandlerTestimonials = ($element) => {
        elementorFrontend.elementsHandler.addHandler(SwiperTestimonialsVideoWidgetHandler, { $element });
    };

    elementorFrontend.hooks.addAction('frontend/element_ready/testimonials-video-slider-widget.default', addHandlerTestimonials);
});

class SideMenuWidgetHandler extends elementorModules.frontend.handlers.Base {

    /**
     * Update Widget Content
     *
     * Custom method used by the widget to insert control values using JS.
     */
    updateWidgetContent() {
        if ( ! this.contentWrapper ) {
            const widgetUniqueSelector = `div[data-id="${this.getID()}"] .uco-side-menu-wrap`;
            this.contentWrapper = document.querySelector( widgetUniqueSelector );
        }



        let menuIconWrap = this.contentWrapper.querySelector('.menu-icon-wrap');
        let sideMenu = this.contentWrapper.querySelector('.uco-side-menu');
        let closeBtn = this.contentWrapper.querySelector('.close');

        if(!menuIconWrap || !sideMenu || !closeBtn) return;

        menuIconWrap.addEventListener('click', (e) => {
            console.log('click');
            sideMenu.classList.add('open');
        });

        closeBtn.addEventListener('click', (e) => {
            console.log('close');
            sideMenu.classList.remove('open');
        })

    }

    /**
     * On Init
     *
     * Runs when the widget is loaded and initialized in the frontend.
     */
    onInit() {
        this.updateWidgetContent();
    }

    /**
     * On Element Change
     *
     * Runs every time a control value is changed by the user in the editor.
     *
     * @param {string} propertyName - The ID of the control that was changed.
     */
    onElementChange(propertyName) {

    }

}


window.addEventListener('elementor/frontend/init', () => {
    const addHandlerTestimonials = ($element) => {
        elementorFrontend.elementsHandler.addHandler(SideMenuWidgetHandler, { $element });
    };

    elementorFrontend.hooks.addAction('frontend/element_ready/side-menu-widget.default', addHandlerTestimonials);
});

class EmployeeBoxWidgetHandler extends elementorModules.frontend.handlers.Base {

    /**
     * Update Widget Content
     *
     * Custom method used by the widget to insert control values using JS.
     */
    updateWidgetContent() {
        if ( ! this.contentWrapper ) {
            const widgetUniqueSelector = `div[data-id="${this.getID()}"]`;
            this.contentWrapper = document.querySelector( widgetUniqueSelector );
        }

        console.log("test");

        let contentBox = this.contentWrapper.querySelector('.uco-employee-box');
        let popUpLink = this.contentWrapper.querySelector('.popup-link');
        let dialog = this.contentWrapper.querySelector('.employee-dialog');
        let closeBtn = dialog.querySelector('.close-btn');

        // if(!contentBox || !popUpLink || !dialog || !closeBtn) return;

        popUpLink.addEventListener('click', (e) => {
            dialog.showModal();
        })

        closeBtn.addEventListener('click', (e) => {
            dialog.close();
        })

    }

    /**
     * On Init
     *
     * Runs when the widget is loaded and initialized in the frontend.
     */
    onInit() {
        this.updateWidgetContent();
    }

    /**
     * On Element Change
     *
     * Runs every time a control value is changed by the user in the editor.
     *
     * @param {string} propertyName - The ID of the control that was changed.
     */
    onElementChange(propertyName) {
        // if( propertyName === 'employee_description' ) {
        //     this.updateWidgetContent();
        // }
    }

}


window.addEventListener('elementor/frontend/init', () => {
    const addHandlerEmployee = ($element) => {
        elementorFrontend.elementsHandler.addHandler(EmployeeBoxWidgetHandler, { $element });
    };

    elementorFrontend.hooks.addAction('frontend/element_ready/employee-popup-box-widget.default', addHandlerEmployee);
});


class TableSliderWidgetHandler extends elementorModules.frontend.handlers.Base {

    onInit() {
        this.updateWidgetContent();
        this.bindResizeHandler();
    }

    bindResizeHandler() {
        this._onResize = this.updateWidgetContent.bind(this);
        window.addEventListener('resize', this._onResize);
    }

    updateWidgetContent() {
        if (!this.contentWrapper) {
            const widgetUniqueSelector = `div[data-id="${this.getID()}"] .table-slider-container-uco`;
            this.contentWrapper = document.querySelector(widgetUniqueSelector);
        }

        const isMobile = window.innerWidth <= 768;

        if (typeof Swiper !== 'undefined') {
            if (isMobile) {
                const slidesPerViewMobile = this.getElementSettings('slides_per_view_mobile') || 1;
                const spaceBetweenMobile = this.getElementSettings('slides_space_between_mobile') || 10;
                const autoplay = this.getElementSettings('autoplay') === 'yes';
                const delay = this.getElementSettings('delay') || 5000;

                if (!this.swiperInstance) {
                    this.swiperInstance = new Swiper(this.contentWrapper, {
                        slidesPerView: 3,
                        spaceBetween: 10,
                        loop: true,
                        loopAdditionalSlides: 2,
                        centeredSlides: true,
                        speed: 800,
                        autoHeight:true,
                        autoplay: {
                            delay: 5000,
                        },
                        on: {
                            slideChangeTransitionStart: function (swiper) {
                                swiper.slides.forEach(slide => slide.classList.remove('swiper-slide-active'));
                            },
                            slideChangeTransitionEnd: function (swiper) {
                                swiper.slides[swiper.activeIndex].classList.add('swiper-slide-active');
                            }
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });

                    const indexToRemove = [...this.swiperInstance.slides].findIndex(slide =>
                        slide.classList.contains('mobile-hide')
                    );

                    if (indexToRemove !== -1) {
                        this.swiperInstance.removeSlide(indexToRemove);
                        this.swiperInstance.update();
                    }
                }

            } else {
                if (this.swiperInstance) {
                    this.swiperInstance.destroy(true, true);
                    this.swiperInstance = null;
                }
            }
        }
    }

    onElementChange(propertyName) {
        const responsiveControls = [
            'slides_per_view_mobile',
            'slides_space_between_mobile',
            'autoplay',
            'delay'
        ];
        if (responsiveControls.includes(propertyName)) {
            this.updateWidgetContent();
        }
    }

    onDestroy() {
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
        }
        if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
            this.swiperInstance = null;
        }
    }

}


window.addEventListener('elementor/frontend/init', () => {
    const addHandlerTable = ($element) => {
        elementorFrontend.elementsHandler.addHandler(TableSliderWidgetHandler, { $element });
    };

    elementorFrontend.hooks.addAction('frontend/element_ready/table-slider-widget.default', addHandlerTable);
});



