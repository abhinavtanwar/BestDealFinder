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
        
		// if items remain -> those are websites to query
		if (form_data.length > 0) {
			var products_data = new Object();
			var received_response_count = 0;

			//For csv file
			var csvrows = [];
			let csvheaders = [
				["Website"],
				["Item Number"],
				["Product Name"],
				["Product Rating"],
				["Product Price (in Rupees)"],
				["Product Link"]
			];
			csvrows.push(csvheaders.join(","));


			// Send all ajax requests
			form_data.forEach(send_data);


			function send_data(item) {
				let query = {
					search_query: search_query,
					search_count: search_count
				};
				let data_to_send = Object.assign(query, item);

				$.ajax({
					url: '/data',
					type: 'POST',
					data: data_to_send,
					dataType: 'json',
					success: function (response) {

						// Check if empty object received from server
						let checkbox_name = data_to_send['name'];
						products_data[checkbox_name] = response;
						if (Object.keys(response).length == 0) {

							no_results_error_function(checkbox_name, response);
						}
						else {
							success_function(checkbox_name, response);
						}
						if (document.getElementById('csv_download_button') == null) {
							create_csv(products_data);
						}
					},
					error: function (error) {
						let checkbox_name = data_to_send['name'];
						products_data[checkbox_name] = {};
						server_error_function(checkbox_name, response);
					},
					complete: function (data) {
						received_response_count++;
					}

				});


				function success_function(checkbox_name, curr_response) {


					create_product_title_div(checkbox_name);

					$.each(curr_response, function (k, v) {
						create_product_details_div(k, v, checkbox_name);
					});


				}

				function no_results_error_function(curr_checkbox_name, curr_response) {
					create_product_title_div(curr_checkbox_name);
					let parent = '#' + curr_checkbox_name + '_result';

					$(parent).append(
						$('<h2>').prop({

							innerHTML: "No products were found.",
							className: 'error_text'
						})
					);

					// console.log("Error Checkbox = " + curr_checkbox_name + " No Results");

				}


				function server_error_function(curr_checkbox_name, curr_response) {

					create_product_title_div(curr_checkbox_name);
					let parent = '#' + curr_checkbox_name + '_result';

					$(parent).append(
						$('<h2>').prop({
							innerHTML: "Server Error while fetching results.",
							className: 'error_text'
						})
					);

					console.log("Error Checkbox = " + curr_checkbox_name + 'AJAX Response = ' + curr_response);


				}

				function create_product_title_div(checkbox_name) {

					let website_dict = {
						'amazon_checkbox': 'Amazon',
						'flipkart_checkbox': 'Flipkart',
						'mdcomputers_checkbox': 'MD Computers',
						'theitdepot_checkbox': 'The IT Depot',
						'neweggindia_checkbox': 'Newegg India',
						'primeabgb_checkbox': 'Prime ABGB'
					};
					let website_name = website_dict[checkbox_name];

					$('.results_div').append(
						$('<div>').prop({
							id: checkbox_name + '_result',
							innerHTML: website_name,
							className: 'results_product_title'

						})
					);


				}