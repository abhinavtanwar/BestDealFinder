$(document).ready(function () {
	$("#search_button").on("click", function (e) {
		e.preventDefault();
		get_data();
	});

	$("#search_bar").keypress(function (e) {
		var key = e.which;
		if (key == 13) // user presses the enter key code in the search bar
		{
			e.preventDefault();
			get_data();
			$('input[name = butAssignProd]').click();
			return false;
		}
	});

	function get_data() {
		// Create Results Title after keypress
		$(".results_div").html(
			$('<h2>').prop({
				id: 'results_title',
				innerHTML: 'Results:'
			})
		);

		if (document.getElementById('csv_download_button') != null) {
			document.getElementById('csv_download_button').remove();
		}

		// Check connection with flask server
		var form_data = $('form').serializeArray();
		$.ajax({
			url: '/check_connection',
			type: 'POST',
			success: function (response) {
				// console.log(response);
			},
			error: function (error) {
				console.log(error);
			}


		});

		var search_query = form_data[0]['value'];
		var search_count = form_data[1]['value'];


		// remove first two elements from array which are search_query and search_count
		var removed = form_data.splice(0, 2);