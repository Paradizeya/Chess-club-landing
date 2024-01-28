const btnBack = `<button class="btn btnBack">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" transform="rotate(-180 22 22)" fill="currentColor"/>
    <path
        d="M24.5382 30.4614L16.0767 21.9999L24.5382 13.5384"
        stroke="white"
        stroke-width="2"
        stroke-linecap="square"
        fill="none"
    />
    </svg>
</button>`;
const btnForward = `<button class="btn btnForward">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="currentColor"/>
    <path
        d="M19.4618 13.5384L27.9233 21.9999L19.4618 30.4615"
        stroke="white"
        stroke-width="2"
        stroke-linecap="square"
        fill="none"
    />
    </svg>
</button>`;

const vasykiCarouselBreakpoint = 1028;
const vasykiCarouselItemsAmount = 5;
let vasykiCarouselExists = false;
const vasykiCarouselWrapper = document.querySelector(
  ".vasyki__carouselWrapper"
);
const vasykiCarouselNav = `<div class="vasyki__carouselNav">${btnBack}<div></div>${btnForward}</div>`;

const tournamentHeader = document.querySelector(".tournament__header");

const createCarousel = (
  count,
  itemsToWrap,
  sharedDataSet,
  whereToPutNavigation,
  navigation
) => {
  for (let i = 1; i <= count; i++) {
    //Create a new wrapper
    const wrapper = document.createElement("div");
    //Add class to the wrapper
    wrapper.classList.add(itemsToWrap);
    //Get all items with the same carousel index
    const items = document.querySelectorAll(
      `.vasyki__stage[${sharedDataSet}="${i}"]`
    );
    //Insert wrapper before first of the found carousel items
    items[0].parentNode.insertBefore(wrapper, items[0]);
    //Add corresponding dataset value to the wrapper for carousel indexing
    wrapper.dataset.carouselElementIndex = i;
    //Append wrapper with found items
    wrapper.append(...items);
  }
  //Add carousel navigation
  whereToPutNavigation.insertAdjacentHTML("beforeend", navigation);
};

const removeCarousel = (itemsToReplace, whereNavigation) => {
  const items = document.querySelectorAll(itemsToReplace);
  items.forEach((item) => {
    item.replaceWith(...item.childNodes);
  });
  //Remove carousel navigation
  whereNavigation.removeChild(whereNavigation.lastChild);
};

function resizeFn() {
  //Breakpoint reached?
  if (window.innerWidth < vasykiCarouselBreakpoint) {
    //Carousel does not exists?
    if (!vasykiCarouselExists) {
      createCarousel(
        vasykiCarouselItemsAmount,
        "vasyki__carouselElem",
        "data-carousel-index",
        vasykiCarouselWrapper,
        vasykiCarouselNav
      );
      vasykiCarouselExists = true;
    }
  } else {
    // Check if carousel exists to not run removal function without a reason
    if (vasykiCarouselExists) {
      removeCarousel(".vasyki__carouselElem", vasykiCarouselWrapper);
      vasykiCarouselExists = false;
    }
  }
}

// ---------------------

//   .vasyki__carousel .tournament__carousel
//If JS is enabled, remove auto overflow on carousels
const vasykiCarousel = document.querySelector(".vasyki__stages");
//add .vasyki__carousel
vasykiCarousel.classList.add("vasyki__carousel");
const tournamentCarousel = document.querySelector(".tournament__carousel");
vasykiCarousel.style.overflowX = "hidden";
tournamentCarousel.style.overflowX = "hidden";

window.onresize = resizeFn;
resizeFn();

// Adding nav buttons to tournament section
const tournamentNavs = document.querySelectorAll(".tournament__carouselNav");
tournamentNavs.forEach((nav) => {
  nav.insertAdjacentHTML("afterbegin", btnBack);
  nav.insertAdjacentHTML("beforeend", btnForward);
});
