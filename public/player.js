$(function() {
	var params = window.location.hash.replace('#', '').split(';');
	//player.html#HASH;0;360p;640x360
	var infoHash = params[0];
	var fileID = params[1];
	var quality = params[2];
	var size = params[3];
	if(infoHash.length < 40) {
		console.error('[ERROR] Missing infoHash parameter!');
		console.log('Exiting...');
		return;
	}
	if(fileID == '') {
		console.warn('[WARNING] Missing fileID parameter, using "0" as the default. ');
		fileID = '0';
	}
	if(quality == '') {
		console.warn('[WARNING] Missing quality parameter, using "360p" as the default. ');
		quality = '360p';
	}
	if(size == '') {
		console.warn('[WARNING] Missing size parameter, using "640x360" as the default. ');
		var size = '640x360';
	}
	var width = size.split('x')[0];
	var height = size.split('x')[1];
	$('#video').attr('width', width);
	$('#video').attr('height', height);
	$('body').css({
		width: width,
		height: height
	});
	setInterval(function() {
		$.get('/api/torrent/' + infoHash + '/keep-alive', function() {
			console.debug('[DEBUG] Sent keep-alive request...');
		});
	}, 5000);
	$.getJSON('/api/torrent/' + infoHash + '/stream/' + fileID + '/metadata.json', function(data) {
		var video = videojs('video');
		video.duration = function() { return video.theDuration; };
		video.start = 0;
		video.oldCurrentTime = video.currentTime;
		video.currentTime = function(time) { 
			if(time == undefined) {
				return video.oldCurrentTime() + video.start;
			}
			video.start = time;
			video.oldCurrentTime(0);
			video.src('/api/torrent/' + infoHash + '/stream/' + fileID + '/' + quality + '.webm?start=' + time);
			setTimeout(function() {
				video.play();
			}, 100);
			return this;
		};
		video.src('/api/torrent/' + infoHash + '/stream/' + fileID + '/' + quality + '.webm');
		video.theDuration = Math.floor(data.streams[0].duration);
		setTimeout(function() {
			$('#loading').fadeOut(300);
			$('#player').fadeIn(300);
		}, 1000);
	});
});
