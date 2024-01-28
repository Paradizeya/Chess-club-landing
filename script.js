const carouselBreakpoint = 1028;
const carouselItemsAmount = 5;
let carouselExists = false;

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

const vasykiCarousel = document.querySelector(".vasyki__carousel");
const vasykiCarouselNav = `<div class="vasyki__carouselNav">${btnBack}${btnForward}</div>`;

const createCarousel = (count) => {
  for (let i = 1; i <= count; i++) {
    //Create a new wrapper
    const wrapper = document.createElement("div");
    //Add class to the wrapper
    wrapper.classList.add("vasyki__carouselElem");
    //Get all items with the same carousel index
    const items = document.querySelectorAll(
      `.vasyki__stage[data-carousel-index="${i}"]`
    );
    //Insert wrapper before first of the found carousel items
    items[0].parentNode.insertBefore(wrapper, items[0]);
    //Add corresponding dataset value to the wrapper for carousel indexing
    wrapper.dataset.carouselElementIndex = i;
    //Append wrapper with found items
    wrapper.append(...items);
  }
  //Add carousel navigation
  vasykiCarousel.insertAdjacentHTML("beforeend", vasykiCarouselNav);
  carouselExists = true;
};

const removeCarousel = () => {
  const items = document.querySelectorAll(".vasyki__carouselElem");
  items.forEach((item) => {
    item.replaceWith(...item.childNodes);
  });
  //Remove carousel navigation
  vasykiCarousel.removeChild(vasykiCarousel.lastChild);
  carouselExists = false;
};

function resizeFn() {
  //Breakpoint reached?
  if (window.innerWidth < carouselBreakpoint) {
    //Carousel does not exists?
    if (!carouselExists) {
      createCarousel(carouselItemsAmount);
    }
  } else {
    //If width is greater then Breakpoint, check if carousel exists to not run removal function without a reason
    if (carouselExists) {
      removeCarousel();
    }
  }
}

window.onresize = resizeFn;
resizeFn();
