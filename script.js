// Accordion Event
const firstContents = document.querySelectorAll(".accordion .content");
firstContents[0].style.display = "block";

const titles = document.querySelectorAll(".accordion .title");
titles.forEach((title) => {
  title.addEventListener("click", () => {
    document.querySelectorAll(".content").forEach((item) => {
      item.style.display = "none";
    });
    titles.forEach((otherTitle) => {
      if (otherTitle !== title) otherTitle.classList.remove("active");
    });
    let content = title.nextElementSibling;
    if (title.classList.contains("active")) {
      title.classList.remove("active");
      content.style.display = "none";
    } else {
      title.classList.add("active");
      content.style.display = "block";
    }
  });
});

// Gnb Event
const naviItems = document.querySelectorAll(".gnb > ul > li");
const menuBg = document.querySelector(".menu_bg");

naviItems.forEach((naviItem) => {
  naviItem.addEventListener("mouseover", () => {
    const submenus = document.querySelectorAll(".submenu");
    submenus.forEach((submenu) => {
      submenu.style.opacity = "1";
      submenu.style.maxHeight = "260px";
      menuBg.style.opacity = "1";
      menuBg.style.maxHeight = "260px";
    });
  });

  naviItem.addEventListener("mouseout", () => {
    const submenus = document.querySelectorAll(".submenu");
    submenus.forEach((submenu) => {
      submenu.style.opacity = "0";
      submenu.style.maxHeight = "0px";
      menuBg.style.opacity = "0";
      menuBg.style.maxHeight = "0px";
    });
  });
});

// madal-search event
const searchBtn = document.querySelector(".fa-magnifying-glass");
searchBtn.addEventListener("click", () => {
  document.querySelector(".modal-search").classList.add("active");
});
document.querySelectorAll(".close, section").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".modal-search").classList.remove("active");
  });
});

const searchBar = document.querySelector(".search input[type='search']");
searchBar.addEventListener("focus", function () {
  this.parentElement.nextElementSibling.style.opacity = "1";
});
searchBar.addEventListener("blur", function () {
  this.parentElement.nextElementSibling.style.opacity = "0";
});

const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = encodeURIComponent(e.target[0].value);
  window.location.href = `searchResult.html?q=${keyword}`;
});

// movidata
import { API_KEY } from "./env.js";

const tmdbCommand = "https://api.themoviedb.org/3";

const fetchMovies = async () => {
  const URL = `${tmdbCommand}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
  const response = await fetch(URL);
  const { results } = await response.json();
  return results;
};

const fetchMovies1 = async () => {
  const URL = `${tmdbCommand}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1`;
  const response = await fetch(URL);
  const { results } = await response.json();
  return results;
};

const fetchMovies2 = async () => {
  const URL = `${tmdbCommand}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`;
  const response = await fetch(URL);
  const { results } = await response.json();
  return results;
};

const getMovies = async () => {
  const [movies, movies1, movies2] = await Promise.all([
    fetchMovies(),
    fetchMovies1(),
    fetchMovies2(),
  ]);

  // movier section

  const ul = document.querySelector(".nowPlaying ul");
  const ul2 = document.querySelector(".upcoming ul");
  const ul3 = document.querySelector(".toprated ul");

  const movieItemcreateElement = (movie, index, category) => {
    const { adult, id, poster_path, title, release_date, vote_average } = movie;
    const li = document.createElement("li");
    const moviePoster = document.createElement("div");
    const movieTitle = document.createElement("div");
    const movieDesc = document.createElement("div");
    const img = document.createElement("img");
    const ageLimit = document.createElement("span");
    const movieNum = document.createElement("span");
    const release = document.createElement("span");
    const vote = document.createElement("span");

    img.src = `https://image.tmdb.org/t/p/original/${poster_path}`;

    let adultKo = adult === false ? "ALL" : "18";
    ageLimit.innerText = adultKo;

    movieNum.innerText = index + 1;

    release.innerText = release_date;

    vote.innerText = `⭐${vote_average.toFixed(2)}`;

    moviePoster.className = "moviePoster";
    movieTitle.className = "movieTitle";
    movieDesc.className = "movieDesc";

    moviePoster.append(img, ageLimit, movieNum);
    movieTitle.innerText = title;
    movieDesc.append(release, vote);

    li.className = id;
    li.setAttribute("data-category", category);
    li.append(moviePoster, movieTitle, movieDesc);

    if (category === "nowPlaying") ul.appendChild(li);
    else if (category === "upcoming") ul2.appendChild(li);
    else if (category === "toprated") ul3.appendChild(li);
  };

  movies.forEach((movie, index) => {
    movieItemcreateElement(movie, index, "nowPlaying");
  });

  movies1.forEach((movie, index) => {
    movieItemcreateElement(movie, index, "upcoming");
  });

  movies2.forEach((movie, index) => {
    movieItemcreateElement(movie, index, "toprated");
  });

  // movieslider event
  const initializeSlider = (
    sliderSelector,
    leftArrowSelector,
    rightArrowSelector
  ) => {
    const slider = document.querySelector(sliderSelector);
    const slides = Array.from(slider.querySelectorAll("li"));
    console.log(slides);
    const slidesToShow = 5;
    const slideWidth = 160;
    const slideMargin = 25;
    let currentIndex = 0;
    let isTransitioning = false;

    const cloneCount = slidesToShow;
    const firstClones = slides
      .slice(0, cloneCount)
      .map((slide) => slide.cloneNode(true));
    const lastClones = slides
      .slice(-cloneCount)
      .map((slide) => slide.cloneNode(true));

    slider.append(...firstClones);
    slider.prepend(...lastClones);

    const updateSlider = () => {
      const offset =
        -(slideWidth + slideMargin) * (currentIndex + slidesToShow);
      slider.style.transform = `translateX(${offset}px)`;
    };
    updateSlider();
  };

  initializeSlider(
    ".nowPlaying ul",
    "#nowPlayingLeftArrow",
    "#nowPlayingRightArrow"
  );

  initializeSlider(".upcoming ul", "#upcomingLeftArrow", "#upcomingRightArrow");

  initializeSlider(".toprated ul", "#topratedLeftArrow", "#topratedRightArrow");

  // mainslider event
  const mainSlider = document.querySelector(".mainSlider");

  movies.forEach((movie) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="${movie.title}" />`;
    mainSlider.appendChild(figure);
  });

  const figures = mainSlider.querySelectorAll("figure");
  let currentIndex = 0;

  const showNextSlide = () => {
    figures[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % figures.length;
    figures[currentIndex].classList.add("active");
  };

  figures[currentIndex].classList.add("active");

  setInterval(showNextSlide, 3000);
};

getMovies();
