'use strict';
// continue from 14:23

const fetchOptions = {
	headers: {
		'Content-Type': 'application/json'
	},
	// accept cross origin resources
	mode: 'cors'
}

$('form').on('submit', function(e) {
	e.preventDefault();
	let types = $('input[type=text]').val().replace(/\s/g, '');
	types = types.split(',');
	// map over our types array, return fetch calls
	let trainerTypeCalls = types.map(elem => {
		// configuration object
		// fetch returns a promise
		return fetch(`http://pokeapi.co/api/v2/type/${elem}/`, fetchOptions)
	});
	// when fetch resolves it will return a response object
	Promise.all(trainerTypeCalls)
		.then(data => {
			data = data.map(singleData => singleData.json());
			Promise.all(data)
				.then(res => {
					console.log(res);
				});
		});
});

// takes array of fetch calls
function getPromiseData(promisesArray) {
	return new Promise((resolve, reject) => {
		// call promise.all on array of fetch calls
		Promise.all(promisesArray)
			// get json data
			.then(res => {
				return res.map(type => type.json());
			})
			// array of json calls passed to callback
			.then(res => {
				Promise.all(res).then(resolve);
			})
			.catch(reject);
	})
}

function displayPokemon(pokemon) {
	// loop through and display the pokemon
	pokemon.forEach(function(poke) {
		let $container = $('<div>').addClass('pokemon');
		let $image = $('<img>').attr('src', `http://pokeapi.co/media/img/${poke.id}.png`);
		let $title = $('<h2>').text(poke.name);
		$container.append($image, $title);
		$('.poke-container').append($container);
	});
}

