$(function() {
	window._timers = [];
	window.cancelTimers = function() {
		$.each(window._timers, function(i, timer) {
			clearTimeout(window._timers[i]);
		});
	};
	$('.input-file-picker').click(function() {
		$('.input-file').click();
	});
	$('.input-file').on('change', function() {
		var formData = new FormData();
		formData.append('file', $('.input-file')[0].files[0]);
		$.ajax({
			   url : '/api/upload-torrent',
			   type : 'POST',
			   data : formData,
			   processData: false,
			   contentType: false,
			   success: function(data) {
				   $('.input-field').val('magnet:?xt=urn:btih:' + data.infoHash);
				   $('.input-submit').click();
			   }
		});
	});
	$('.explain.section .close').off('click').on('click', function() {
		$('.explain').stop(true,true).fadeOut(300);
		window._timers.push(setTimeout(function() {
			$('.content-other-than-about').stop(true,true).fadeIn(300);
		}, 300));
	});
	$('.about-global-nav').off('click').on('click', function() {
		$('.content-other-than-about').stop(true,true).fadeOut(300);
		window._timers.push(setTimeout(function() {
			$('.explain').stop(true,true).fadeIn(300);
		}, 300));
	});
	$('.torrent-player.section .close').off('click').on('click', function() {
		window.cancelTimers();
		$('.torrent-player').stop(true,true).fadeOut(300);
		window._timers.push(setTimeout(function() {
			$('.torrents-list').stop(true,true).fadeIn(300);
			$('.player iframe').attr('src', 'about:blank');
		}, 300));
	});
	$('.cancel-torrent a').off('click').on('click', function(e) {
		e.preventDefault();
		var infoHash = $(this).attr('data-infoHash');
		$.post('/api/torrent/' + infoHash + '/delete', function(data) {
			window.cancelTimers();
			$('.torrents-list').stop(true,true).fadeOut(300);
			window._timers.push(setTimeout(function() {
				$('.call-to-action').stop(true,true).fadeIn(300);
			}, 300));
		});
		return;
	});
	$('.input-submit').click(function() {
		window.cancelTimers();
		var torrent = $('.input-field').val();
		$('.input-field').val('');
		$('.call-to-action').stop(true,true).fadeOut(300);
		window._timers.push(setTimeout(function() {
			$('.loading-screen').stop(true,true).fadeIn(300);
		}, 300));
		$.post('/api/parse-torrent', {uri: torrent}, function(data) {
			var infoHash = data.infoHash;
			$.post('/api/add-torrent', {infoHash: infoHash}, function(data) {
				$('.cancel-torrent a').attr('data-infoHash', infoHash);
				$.get('/api/torrent/' + infoHash + '/files', function(data) {
					$('.torrent-title').html(data.title);
					$('.torrent-files').html('');
					$.each(data.files, function(i, file) {
						var name = file.name;
						var ext = name.substr(name.lastIndexOf('.')+1).toLowerCase();
						if(ext == 'mp4' || ext == 'avi' || ext == 'flv' || ext == 'mkv' || ext == 'wmv') {
							var icon = 'fa-file-video-o';
							var is_video = '1';
						} else {
							var icon = 'fa-file-o';
							var is_video = '0';
						}
						$('.torrent-files').append('<div class="torrent-file"><span class="icon"><i class="fa ' + icon + ' fa-2x"></i></span><span class="name"><a href="#" data-name="' + name + '" data-is-video="' + is_video + '" data-infoHash="' + infoHash + '" data-index="' + file.index + '">' + file.name + '</a></span><span class="size">(' + file.size + ' B)</span><div class="clearfix"></div></div>');
					});
					$('.torrent-files').off('click').on('click', '.torrent-file a', function(e) {
						e.preventDefault();
						var infoHash = $(this).attr('data-infoHash');
						var index = $(this).attr('data-index');
						var name = $(this).attr('data-name');
						var is_video = $(this).attr('data-is-video');
						$('.torrent-player .title h2.left').html(name);
						if(is_video == '0') {
							window.open('/api/torrent/' + infoHash + '/download/' + index);
							return;
						}
						var size = '760x427';
						var player_url = '/player.html#' + infoHash + ';' + index + ';480p;' + size;
						$('.player iframe').attr('src', player_url);
						$('.torrents-list').stop(true,true).fadeOut(300);
						window.cancelTimers();
						window._timers.push(setTimeout(function() {
							$('.torrent-player').stop(true,true).fadeIn(300);
						}, 300));
						return;
					});
					$('.loading-screen').stop(true,true).fadeOut(300);
					window.cancelTimers();
					window._timers.push(setTimeout(function() {
						$('.torrents-list').stop(true,true).fadeIn(300);
					}, 300));
				});
			});
		});
	});
});
