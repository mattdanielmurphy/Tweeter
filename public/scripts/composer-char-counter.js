$(document).ready( function countChars(cb) {
	// Set default remaining characters message:
	$('.new-tweet form .counter').html('140 characters remaining.');

	$('.new-tweet form').on('input', ':input', function(param) {
		const counter = '.new-tweet form .counter';
		const tweetLength = $(this).val().length;

		// Determine if characters should be pluralized:
		let pluralization = 's';
		if(140 - tweetLength === 1 || 140 - tweetLength === -1) {
			pluralization = '';
		}

		// Print either remaining characters or characters over limit:
		if (tweetLength <= 140) {
			$(counter)
				.html(`${140 - tweetLength} character${pluralization} remaining.`).toggleClass('invalidLength', false)
		} else if (tweetLength > 140) {
			$(counter)
				.html(`Over by ${tweetLength - 140} character${pluralization}.`).toggleClass('invalidLength', true)
		}
	})
});