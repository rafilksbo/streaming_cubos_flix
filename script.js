const imagemDofilme = document.querySelectorAll(".movie");
const tituloDoFilme = document.querySelectorAll(".movie__title");
const rating = document.querySelectorAll(".movie__rating");
const ratingImg = document.querySelectorAll(".movie__rating img");

const previous = document.querySelector(".btn-prev");
const next = document.querySelector(".btn-next");
const input = document.querySelector(".input");

const backgroundImage = document.querySelector(".highlight__video");
const movieTitle = document.querySelector(".highlight__title");
const movieRating = document.querySelector(".highlight__rating");
const movieGenres = document.querySelector(".highlight__genres");
const movieDate = document.querySelector(".highlight__launch");
const sinopse = document.querySelector(".highlight__description");
const movieHref = document.querySelector(".highlight__video-link");

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalSinopse = document.querySelector(".modal__description");
const modalRating = document.querySelector(".modal__average");
const closeModal = document.querySelector(".modal__close");

let control_id = 0;
let control_movie = 0;
let control_title = 0;
let control_rating = 0;
let page = 0;

let control_global = false;

function logarFilmes() {
  for (let i = 0; i < imagemDofilme.length; i++) {
    const promise = fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
    );
    const response = promise.then((response) => response.json());
    response.then(function (body) {
      const { results } = body;
      imagemDofilme[
        i
      ].style.backgroundImage = `url('${results[control_movie].poster_path}')`;
      if (results[control_title].title.length > 10) {
        tituloDoFilme[i].textContent = `${results[control_title].title.slice(
          0,
          10
        )}...`;
      } else {
        tituloDoFilme[i].textContent = results[control_title].title;
      }
      rating[i].textContent = results[control_rating].vote_average;
      imagemDofilme[i].dataset.id = results[control_id].id;

      control_rating++;
      control_title++;
      control_id++;
      control_movie++;
    });
  }
}
logarFilmes();
function controls(number) {
  control_movie = number;
  control_title = number;
  control_rating = number;
  control_id = number;
}
function nextPage() {
  if (page === 3) {
    controls(0);
    page = -1;
  }
}
function previousPage() {
  if (page === 0) {
    controls(25);
    page = 4;
  }
}

next.addEventListener("click", () => {
  if (control_global === false) {
    nextPage();
    logarFilmes();
    page++;
  } else {
    nextPage();
    proximosFilmesFiltrado();
    page++;
  }
});

previous.addEventListener("click", () => {
  console.log(control_global);
  if (control_global === false) {
    previousPage();
    control_movie -= 10;
    control_rating -= 10;
    control_title -= 10;
    control_id -= 10;
    logarFilmes();
    page--;
  } else {
    previousPage();
    control_movie -= 10;
    control_rating -= 10;
    control_title -= 10;
    control_id -= 10;
    proximosFilmesFiltrado();
    page--;
  }
});

function proximosFilmesFiltrado() {
  const promise = fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
  );
  const response = promise.then((response) => response.json());
  control_global = true;

  response.then(function (body) {
    const { results } = body;
    for (let i = 0; i <= imagemDofilme.length; i++) {
      imagemDofilme[
        i
      ].style.backgroundImage = `url('${results[control_movie].poster_path}')`;
      if (results[control_title].title.length > 10) {
        tituloDoFilme[i].textContent = `${results[control_title].title.slice(
          0,
          10
        )}...`;
      } else {
        tituloDoFilme[i].textContent = results[control_title].title;
      }
      rating[i].textContent = results[control_rating].vote_average;
      imagemDofilme[i].dataset.id = results[control_id].id;
      control_movie++;
      control_title++;
      control_rating++;
      control_id++;
    }
  });
}
input.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    if (input.value.trim() === "") {
      page = 0;
      controls(0);
      logarFilmes();
      control_global = false;
      return;
    }
    proximosFilmesFiltrado();
  }
});

const promiseHighlight = fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
);
const response = promiseHighlight.then((response) => response.json());
response.then(function (body) {
  const { backdrop_path, title, vote_average, genres, release_date, overview } =
    body;
  backgroundImage.style.backgroundImage = `url('${backdrop_path}')`;
  movieTitle.textContent = title;
  movieRating.textContent = vote_average;
  const genresArray = [];
  for (let item of genres) {
    genresArray.push(item.name);
  }
  movieGenres.textContent = `${genresArray
    .join(", ")
    .toUpperCase()} / Data de Lançamento:  `;
  const date = release_date.split("-").reverse();
  const dateFormatada = `${date[0]}/${date[1]} de ${date[2]}`;
  movieDate.textContent = dateFormatada;
  if (overview.length > 200) {
    sinopse.textContent = `${overview.slice(0, 250)}...`;
  } else {
    sinopse.textContent = overview;
  }
});

const moviePromise = fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
);
const movieResponse = moviePromise.then((response) => response.json());
movieResponse.then(function (body) {
  const key = body.results[0].key;
  movieHref.href = `https://www.youtube.com/watch?v=${key}`;
});

imagemDofilme.forEach((imagem) => {
  imagem.addEventListener("click", (event) => {
    modal.classList.remove("hidden");
    const promise = fetch(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${event.target.dataset.id}?language=pt-BR`
    );
    const response = promise.then((response) => response.json());
    response.then(function (body) {
      console.log(body);
      modalTitle.textContent = body.title;
      modalImg.src = body.backdrop_path;
      if (modalSinopse.textContent.length > 350) {
        modalSinopse.textContent = `${body.overview.slice(0, 350)}...`;
      } else {
        modalSinopse.textContent = body.overview;
      }

      modalRating.textContent = body.vote_average;
    });
  });
});
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});
