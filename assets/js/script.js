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
let modal_title = document.querySelector('.modal-title')
let modal_body = document.querySelector('.modal-body')
cards_container.addEventListener('click', function(evento) {
  let name = evento.target.dataset.pokemon;
  if (name != undefined) {
    modal_title.innerHTML = name;

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
        li.innerHTML = data['moves'][move_index]['move']['name'];
        m.appendChild(li);
        
      }
    });
  };
});
