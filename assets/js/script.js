const offset_limit = 20
var total_pk = 0

function cardGenerator(name, image_href) {
  let pokemon_string_html = `
    <div class="card shadow-sm p-2 h-100" style="width: 18rem;">
      <h3 class="card-title text-center mt-2">${name}</h3>
      <img src="${image_href}" class="card-img-top p-4 text-center" alt="we didn't find an image to show">
      <div class="card-body d-flex flex-column justify-content-end">
        <a class="modal-call btn btn-danger d-flex justify-content-center" data-pokemon="${name}" data-bs-toggle="modal" href="#ModalToggle" role="button">¡Quiero saber más de este pokémon!</a>
      </div>
    </div>
  `;

  let pokemon_card = document.createElement('div');
  pokemon_card.className = "col d-flex justify-content-center mb-3";
  pokemon_card.innerHTML = pokemon_string_html;

  return pokemon_card;
}

function render20(offset = 0, limit = offset_limit) {
  fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data){
    let cards_container = document.querySelector('#cards-container');
    total_pk = data['count'];
  
    query = data['results'];
    query.forEach(pokemon => {
      let name = pokemon['name'];
      let pokemon_id = pokemon['url'].split("/")[6];
      let pokemon_img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon_id}.svg`;
      
      cards_container.appendChild(cardGenerator(name, pokemon_img));
    })
  });
}

window.onload = function() {
  render20();
}

let counter = 0;
let render_button = document.querySelector('#render-more');
render_button.addEventListener('click', function(evento) {
  if ((total_pk - counter) >= offset_limit) {
    counter += offset_limit;
    render20(counter);
  } else {
    if ((total_pk - counter) > 0) {
      counter += total_pk - counter;
      render20(counter);
    } else {
      render_button.disabled = true;
    }
  }
});

let cards_container = document.querySelector('#cards-container');
let modal_title = document.querySelector('.modal-title');
let modal_body = document.querySelector('.modal-body');
let modal_button_stat = document.querySelector('#stat-button');
cards_container.addEventListener('click', function(evento) {
  let name = evento.target.dataset.pokemon;
  if (name != undefined) {
    modal_title.innerHTML = name;
    modal_button_stat.innerHTML = `<button class="btn btn-warning ms-2 btn-sm" data-pokemon="${name}" data-bs-target="#ModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Stats</button>`;

    let t = modal_body.querySelector('#modal-body-types');
    let g = modal_body.querySelector('#modal-body-abilities');
    let m = modal_body.querySelector('#modal-body-moves');
    t.innerHTML = null;
    g.innerHTML = null;
    m.innerHTML = null;

    fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data['types'].forEach(type => {
        let li = document.createElement('li');
        li.innerHTML = type['type']['name'];
        t.appendChild(li);
      });

      data['abilities'].forEach(ability => {
        let li = document.createElement('li');
        li.innerHTML = ability['ability']['name'];
        g.appendChild(li);
      });

      for (let move_index = 0; move_index < 5; move_index++) {
        let li = document.createElement('li');
        let move = data['moves'][move_index]['move']['name'];
        li.innerHTML = `<button class="btn-sm btn btn-outline-dark p-0 px-1" data-bs-target="#ModalToggle3" data-move="${move}" data-bs-toggle="modal" data-bs-dismiss="modal">${move}</button>`;
        m.appendChild(li);
      }

      // Stats
      document.querySelector('.modal-title-stats').innerHTML = data.name + " stats";
      let body_stat_modal = document.querySelector('.stats-modal-body');
      let stat_ul = document.createElement('ul');
      data['stats'].forEach(element => {
        stat_value = element.base_stat;
        stat_name = element.stat.name;

        let stat_li = document.createElement('li');
        stat_li.innerHTML = `${stat_name}: ${stat_value}`;
        stat_ul.appendChild(stat_li);
      });
      body_stat_modal.appendChild(stat_ul);
    });
  };
});

let moves_body = document.querySelector('.modal-body-power');
let moves_buttons = document.querySelector('#moves');
let moves_ol = document.createElement('ol');
moves_buttons.addEventListener('click', function(evento) {
  let move_name = evento.target.dataset.move;
  document.querySelector('.modal-title-power').innerHTML = `Pokemon with ${move_name} move`;

  fetch(`https://pokeapi.co/api/v2/move/${move_name}/`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    data.learned_by_pokemon.forEach(element => {
      let pk_li = document.createElement('li');
      pk_li.innerHTML = element.name;
      moves_ol.appendChild(pk_li);
    });
    moves_body.appendChild(moves_ol);
  });
});


let blah =  document.querySelector("#blahblah");
blah.addEventListener('click', function(){
  blah.remove();
});
