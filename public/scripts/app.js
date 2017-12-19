/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready( function() {
	$('#composeTweet').on('click', () => {
		$('.new-tweet').slideToggle();
		$('.new-tweet textarea').focus();
	});

	function loadTweets() {
		$.ajax({
			url: '/tweets',
			method: 'GET',
			success: function(tweets) {
				renderTweets(tweets);
			}
		})
	}

	loadTweets();

	var form = $('.new-tweet form');

	// fetches tweets from /tweets
	form.on('submit', function(event) {
		// prevent redirect:
		event.preventDefault();

		// remove leading and trailing whitespace:
		let potentialTweet = $('.new-tweet form textarea').val().replace(/^\s+|\s+$/g, '');

		// check for invalid tweet:
		if (potentialTweet.length > 140) {
			$('.new-tweet').prepend(`<span class="error">Error: Your tweet is too long.</span>`);
		} else if (potentialTweet === '') {
			$('.new-tweet').prepend(`Error: Your tweet is empty.`);
		} else {
			// if valid, POST:
			$.ajax({
				type: 'POST',
				url: form.attr('action'),
				data: form.serialize(),
				success: function() {
					$('.new-tweet textarea').val('');
					loadTweets();
				}
			});
		}
	});

	function renderTweets(array) {
		let tweets = $('#tweets-container');
		tweets.empty();
		// loop through and create each tweet
		for (const i in array) {
			// Add each tweet to container
			tweets.prepend(
				createTweetElement(array[i])
			);
		}

		// put h2 back at the top
		tweets.prepend( $('#tweets-container h2') );
		// render all times shown on the page:
		timeago().render($('.time'));
	}

	function escape(str) {
		let span = document.createElement('span');
		span.appendChild(document.createTextNode(str));
		return span.innerHTML;
	}

	function createTweetElement(tweet) {
		var $tweet = $(`
			<article class="tweet">
				<header>
					<img src='images/bird.svg'>
					<h3>${escape(tweet.user.name)}</h3>
					<span class='handle'>${escape(tweet.user.handle)}</span>
				</header>
				<p>${escape(tweet.content.text)}</p>
				<footer>
					<span datetime='${escape(tweet.created_at)}' class='time'></span>
					<span class='buttons'>
						<a href="/"><i class="fas fa-flag"></i></a>
						<a href="/"><i class="fas fa-retweet"></i></a>
						<a href="/"><i class="fas fa-heart"></i></a>
					</span>
				</footer>
			</article>
		`)
		return $tweet;
	}
});