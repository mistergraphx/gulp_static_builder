/**
@file Main
@desc main javascript file
*/

// # Dom Ready

$(function(){
	// Initialize menu 
	var headDesktopHeight = $('.head-desktop').height();
		
	//console.log(headDesktopHeight);
	var menu = $('.js-menumaker').responsiveMenu({
		format: 'multitoggle',
		sticky: true,
		stickyTreshold: headDesktopHeight
	});
	menu.on();	
	// Local Scroll on Anchor Links
	$.localScroll();
});
