var $window = $(window);
$window.load(function() {
	var preloader = $('.preloader');
	preloader.addClass('active');
	setTimeout(function() {
		preloader.hide();
	}, 2500);
});


jQuery(function($){
			// on DomReady !
			
		//alert('COUCOU');


	var navbar = $('.navbar');
	var navbarCollapse = $('.navbar-collapse');
	var navbarLinks = $('.navbar-nav > li > a');
	var scrollTop = $window.scrollTop();
	
	if (scrollTop > 0) {
		navbar.toggleClass('navbar-default navbar-inverse');
	}
	$window.scroll(function() {
		scrollTop = $window.scrollTop();
		if (scrollTop > 0 && $('.navbar-default').length) {
			navbar.removeClass('navbar-default').addClass('navbar-inverse');
		} else if (scrollTop == 0) {
			navbar.removeClass('navbar-inverse').addClass('navbar-default');
		}
	});
	
	navbarCollapse.on('show.bs.collapse', function() {
		$(this).parents('.navbar').removeClass('navbar-default').addClass('navbar-inverse');
	});
	
	navbarCollapse.on('hidden.bs.collapse', function() {
		var scrollTop = $window.scrollTop();
		if (scrollTop == 0) {
			$(this).parents('.navbar').removeClass('navbar-inverse').addClass('navbar-default');
		}
	});
	
	$('[href*="#section_"]').on('click', function() {
		navbarCollapse.collapse('hide');
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top - 80
				}, 1000);
				return false;
			}
		}
	});
	
	var bannerCarouselImg = $('.banner__carousel__img');
	if (bannerCarouselImg.length) {
		var bannerCarouselImgArr = bannerCarouselImg.data('img').split(',');
		bannerCarouselImg.backstretch(bannerCarouselImgArr, {
			duration: 5000,
			fade: 750
		});
		bannerCarouselImg.backstretch('pause');
	}
	
	var bannerCarousel = $('.banner__carousel');
	bannerCarousel.on('slid.bs.carousel', function(e) {
		var slideIndex = $(e.relatedTarget).index();
		bannerCarouselImg.backstretch('show', slideIndex);
	});
	
	bannerCarousel.waypoint(function(direction) {
		if (direction == "down") {
			bannerCarousel.carousel('pause');
		} else {
			bannerCarousel.carousel('cycle');
		}
	}, {
		offset: function() {
			return -bannerCarousel.outerHeight();
		}
	});
	
	var bannerSection = $('.section_banner');
	if (bannerSection.length) {
		var bannerSectionOffsetTop = bannerSection.offset().top;
		var bannerSectionHeight = bannerSection.height();
		var parallaxRate = 5;
		$window.scroll(function() {
			if (bannerSection.hasClass('parallax')) {
				setTimeout(function() {
					var windowScrollTop = $window.scrollTop(),
						bannerSectionOffset = windowScrollTop - bannerSectionOffsetTop,
						parallaxOffset = Math.round(bannerSectionOffset / parallaxRate);
					if (bannerSectionOffset <= bannerSectionHeight) {
						bannerCarouselImg.css({
							'-webkit-transform': 'translateY(' + parallaxOffset + 'px)',
							'transform': 'translateY(' + parallaxOffset + 'px)'
						});
					}
				}, 10);
			}
		});
	}
	
	$('#modal_portfolio').on('show.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var modal = $(this);
		var heading = button.data('heading');
		var img = button.data('img');
		var content = button.data('content');
		modal.find('#modal_portfolio__heading').text(heading);
		modal.find('#modal_portfolio__img').attr('src', img);
		modal.find('#modal_portfolio__content').text(content);
	});
	
	var statsItem = $('.stats__item__value');
	//console.log(statsItem);
	if (statsItem.length) {
		statsItem.each(function() {
			var $this = $(this);
			$this.waypoint(function(direction) {
				$this.not('.finished').countTo({
					'onComplete': function() {
						$this.addClass('finished');
					}
				});
			}, {
				offset: '75%'
			});
		});
	}
	var currentYear = new Date().getFullYear();
	$('#footer__year').text(currentYear);
	
	$('[data-animate]').each(function() {
		
		var $this = $(this);
		var animation = $this.data('animate');
		//console.log(animation);
		$this.waypoint(function(direction) {
			$this.addClass(animation);
		}, {
			offset: '75%'
		});
	});
	
	var screenshotsOwlCarousel = $('.screenshots__carousel');
	if (screenshotsOwlCarousel.length) {
		screenshotsOwlCarousel.owlCarousel({
			items: 3,
			loop: true
		})
	}
	
	var fullPageContainer = $('#fullpage');
	if (fullPageContainer.length) {
		var fullpageCarouselImg = $('#fullpage__carousel');
		var fullpageCarouselImgArr = fullpageCarouselImg.data('images').split(',');
		fullpageCarouselImg.backstretch(fullpageCarouselImgArr, {
			duration: 5000,
			fade: 750
		});
		fullpageCarouselImg.backstretch('pause');
		fullPageContainer.fullpage({
			menu: '.navbar-nav',
			anchors: ['fp-section_banner', 'fp-section_features', 'fp-section_portfolio', 'fp-section_pricing', 'fp-section_team', 'fp-section_stats', 'fp-section_skills', 'fp-section_about', 'fp-section_testimonials', 'fp-section_news', 'fp-section_contact'],
			sectionSelector: 'section',
			scrollOverflow: true,
			scrollOverflowReset: true,
			scrollingSpeed: 750,
			paddingTop: '100px',
			paddingBottom: '100px',
			onLeave: function(index, nextIndex, direction) {
				fullpageCarouselImg.backstretch('show', nextIndex - 1);
				navbarCollapse.collapse('hide');
			},
			afterLoad: function(anchorLink, index) {
				if ($('section.active').is('.section_stats')) {
					$('.stats__item__value:not(.finished)').countTo({
						onComplete: function() {
							$(this).addClass('finished');
						}
					});
				}
			}
		});
	}
	
	
});