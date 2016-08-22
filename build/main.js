'use strict';

var fetchOptions = {
	headers: {
		'Content-Type': 'application/json'
	},
	// accept cross origin resources
	mode: 'cors'
};

$('form').on('submit', function (e) {
	e.preventDefault();
	var types = $('input[type=text]').val().replace(/\s/g, '');
	types = types.split(',');
	// map over our types array, return fetch calls
	var trainerTypeCalls = types.map(function (elem) {
		// configuration object
		// fetch returns a promise
		return fetch('http://pokeapi.co/api/v2/type/' + elem + '/', fetchOptions);
	});
	// when fetch resolves it will return a response object
	Promise.all(trainerTypeCalls).then(function (data) {
		data = data.map(function (singleData) {
			return singleData.json();
		});
		Promise.all(data).then(function (res) {
			console.log(res);
		});
	});
});

function getPromiseData(promisesArray) {
	return new Promise(function (resolve, reject) {
		Promise.all(promisesArray).then(function (res) {
			return res.map();
		});
	});
}

function displayPokemon(pokemon) {
	// loop through and display the pokemon
	pokemon.forEach(function (poke) {
		var $container = $('<div>').addClass('pokemon');
		var $image = $('<img>').attr('src', 'http://pokeapi.co/media/img/' + poke.id + '.png');
		var $title = $('<h2>').text(poke.name);
		$container.append($image, $title);
		$('.poke-container').append($container);
	});
}