$(function() {
	$('.explain.section .close').off('click').on('click', function() {
		$('.explain').stop(true,true).fadeOut(300);
		setTimeout(function() {
			$('.content-other-than-about').stop(true,true).fadeIn(300);
		}, 300);
	});
	$('.about-global-nav').off('click').on('click', function() {
		$('.content-other-than-about').stop(true,true).fadeOut(300);
		setTimeout(function() {
			$('.explain').stop(true,true).fadeIn(300);
		}, 300);
	});
});
