'use strict';

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
	getPromiseData(trainerTypeCalls)
		.then(result => {
			console.log(result);
			getDoubleDamagePokemon(result);
		});
});

function getDoubleDamagePokemon(pokemonTypes) {
	// get data as pokemonTypes
	pokemonTypes = pokemonTypes
		.map(types => {
			// multiple arrays inside an array
			return types.damage_relations.double_damage_from
		})
		// flatten to a simple array of objects
		.reduce(flatten, [])
		// take each object in array and get type
		.map(type => {
			return fetch(type.url, fetchOptions);
		});
	getPromiseData(pokemonTypes)
		.then(results => {
			console.log(results);
			buildTeam(results);
		});
}

function buildTeam(pokemons) {
	let team = [];
	pokemons = pokemons
		.map(pokemon => {
			return pokemon.pokemon;
		})
		// parameters are: callback to run, initial value
		.reduce(flatten, [])
		.map(pokemon => pokemon.pokemon);

	for (let i = 0; i < 6; i++) {
		team.push(getRandomPokemon(pokemons));
	}
	
	team = team.map(pokemon => {
		return fetch(pokemon.url,fetchOptions);
	});
	getPromiseData(team)
		.then(pokemonData => {
			displayPokemon(pokemonData);
		});
}

function getRandomPokemon(pokemonArray) {
	return pokemonArray[Math.round(Math.random() * pokemonArray.length)];
}

const flatten = (a, b) => [...a, ...b];

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
	});
}

function displayPokemon(pokemon) {
	// loop through and display the pokemon on page
	pokemon.forEach(function(poke) {
		let $container = $('<div>').addClass('pokemon');
		let $image = $('<img>').attr('src', `http://pokeapi.co/media/img/${poke.id}.png`);
		let $title = $('<h2>').text(poke.name);
		$container.append($image, $title);
		$('.poke-container').append($container);
	});
}
