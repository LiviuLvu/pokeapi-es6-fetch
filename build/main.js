'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
	getPromiseData(trainerTypeCalls).then(function (result) {
		console.log(result);
		getDoubleDamagePokemon(result);
	});
});

function getDoubleDamagePokemon(pokemonTypes) {
	// get data as pokemonTypes
	pokemonTypes = pokemonTypes.map(function (types) {
		// multiple arrays inside an array
		return types.damage_relations.double_damage_from;
	})
	// flatten to a simple array of objects
	.reduce(flatten, [])
	// take each object in array and get type
	.map(function (type) {
		return fetch(type.url, fetchOptions);
	});
	getPromiseData(pokemonTypes).then(function (results) {
		console.log(results);
		buildTeam(results);
	});
}

function buildTeam(pokemons) {
	var team = [];
	pokemons = pokemons.map(function (pokemon) {
		return pokemon.pokemon;
	})
	// parameters are: callback to run, initial value
	.reduce(flatten, []).map(function (pokemon) {
		return pokemon.pokemon;
	});

	for (var i = 0; i < 6; i++) {
		team.push(getRandomPokemon(pokemons));
	}

	team = team.map(function (pokemon) {
		return fetch(pokemon.url, fetchOptions);
	});
	getPromiseData(team).then(function (pokemonData) {
		displayPokemon(pokemonData);
	});
}

function getRandomPokemon(pokemonArray) {
	return pokemonArray[Math.round(Math.random() * pokemonArray.length)];
}

var flatten = function flatten(a, b) {
	return [].concat(_toConsumableArray(a), _toConsumableArray(b));
};

// takes array of fetch calls
function getPromiseData(promisesArray) {
	return new Promise(function (resolve, reject) {
		// call promise.all on array of fetch calls
		Promise.all(promisesArray)
		// get json data
		.then(function (res) {
			return res.map(function (type) {
				return type.json();
			});
		})
		// array of json calls passed to callback
		.then(function (res) {
			Promise.all(res).then(resolve);
		}).catch(reject);
	});
}

function displayPokemon(pokemon) {
	// loop through and display the pokemon on page
	pokemon.forEach(function (poke) {
		var $container = $('<div>').addClass('pokemon');
		var $image = $('<img>').attr('src', 'http://pokeapi.co/media/img/' + poke.id + '.png');
		var $title = $('<h2>').text(poke.name);
		$container.append($image, $title);
		$('.poke-container').append($container);
	});
}