
require.config({
	baseUrl: '/scripts',
	shim: {
		'socket.io': {
			exports: 'io'
		},
		'deckjs/deck.core': ['jquery'],
		'deckjs/deck.active': ['jquery']
	},
	paths: {
		'jquery': 'http://code.jquery.com/jquery-1.7.2.min',
		'socket.io': '/socket.io/socket.io'
	}
});

require([
	'jquery', 
	'socket.io',
	'deckjs/deck.core',
	'deckjs/deck.active',
	'deckjs/modernizr.custom'

], function ($, io) {

	function getParameterByName(name)
	{
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	$(function() {
		$.deck('.slide');

		var following = false, broadcasting = false, masterSlide = -1, followLink = $("#FollowLink");

		if (getParameterByName("broadcast") === "true") {
			var result;
			do {
				result = prompt("Enter the broadcast password:");
				if (result === "candies") {
					setFollowing(false);
					setBroadcasting(true);
					break;
				}
				else {
					alert("Incorrect broadcast password")
				}
			 } while (result)
			
		}
		else {
			setFollowing(true);
			setBroadcasting(false);
		}

		function setFollowing(f) {
			following = f;
			followLink.text(f ? "Stop following" : "Follow").data("action", f ? "unfollow" : "follow");
		}

		function setBroadcasting(b) {
			broadcasting = b;
			console.log("Broadcasting: "+b)
			if (b) {
				followLink.hide();
			}
			else {
				followLink.show();
			}
		}

		$("#FollowLink").on("click", function() {
			setFollowing($(this).data("action") === "follow");
			return false;
		})

		var socket = io.connect('http://127.0.0.1:7565');
		//var socket = io.connect('http://10.0.1.3:7565');
		//var socket = io.connect('http://108.172.142.155:7565');
		
		socket.on('deck.change', function (data) {
			masterSlide = data.to;
			if (following)
				$.deck('go', data.to);
		});

		$(document).on('deck.change', function(event, from, to) {
			if (broadcasting) {
				console.log("Sending deck change")
				socket.emit('deck.change', { from: from, to: to });
			}
			if (to !== masterSlide) {
				setFollowing(false)
			}
		});

		$(document).on('keydown', function(event) {
			if (event.keyCode === 65) {
				$("#Container").toggleClass("OnDemo")
			}
		})
		
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
		navigator.getUserMedia({video: true, audio: true}, function(stream) {
			console.log("VIDYAS")
			document.getElementById('Video').src = window.URL.createObjectURL(stream);
		}, function() {
			alert("failed")
		})
		
	});
});