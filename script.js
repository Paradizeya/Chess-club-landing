const carouselBreakpoint = 1028;
const carouselItemsAmount = 5;
let carouselExists = false;

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
  carouselExists = true;
};

const removeCarousel = () => {
  const items = document.querySelectorAll(".vasyki__carouselElem");
  items.forEach((item) => {
    item.replaceWith(...item.childNodes);
  });
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
