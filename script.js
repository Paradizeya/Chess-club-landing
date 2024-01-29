//If JS is enabled, remove auto overflow on carousels
const vasykiCarousel = document.querySelector(".vasyki__stages");
vasykiCarousel.classList.add("vasyki__carousel");

const tournamentCarousel = document.querySelector(".tournament__carousel");

vasykiCarousel.style.overflowX = "hidden";
tournamentCarousel.style.overflowX = "hidden";

//For grouping vasykiCarousel items in carousel elems
const vasykiCarouselBreakpoint = 1028;
const vasykiCarouselItemsAmount = 5;
let vasykiCarouselExists = false;
const vasykiCarouselWrapper = document.querySelector(
  ".vasyki__carouselWrapper"
);

//Getting buttons for vasykiCarousel
//Event listeners are set/removed in window resize function resizeFn() as it has to happen with elem grouping logic
const vasykiCarouselNav = document.querySelector(".vasyki__carouselNav");
const vasykiBtnBack = vasykiCarouselNav.querySelector(".btnBack");
const vasykiBtnForward = vasykiCarouselNav.querySelector(".btnForward");

// Getting buttons for tournamentCarousel (multiple navs!)
// Setting event listeners for all navs buttons
const tournamentCarouselNav = document.querySelectorAll(
  ".tournament__carouselNav"
);
tournamentCarouselNav.forEach((nav) => {
  const tournamentBtnBack = nav.querySelector(".btnBack");
  const tournamentBtnForward = nav.querySelector(".btnForward");

  tournamentBtnBack.targetCarousel = tournamentCarousel;
  tournamentBtnBack.carouselElem = tournamentCarousel;
  tournamentBtnForward.targetCarousel = tournamentCarousel;
  tournamentBtnForward.carouselElem = tournamentCarousel;

  tournamentBtnBack.addEventListener("click", scrollToPrevItem);
  tournamentBtnForward.addEventListener("click", scrollToNextItem);
});

window.onresize = resizeFn;
resizeFn();

function resizeFn() {
  // ---Vasyki Part
  //Breakpoint reached?
  if (window.innerWidth < vasykiCarouselBreakpoint) {
    //Carousel does not exists?
    if (!vasykiCarouselExists) {
      groupItems(
        vasykiCarouselItemsAmount,
        "vasyki__carouselElem",
        "data-carousel-index"
      );
      vasykiCarouselExists = true;

      //Adding buttons event listeners
      const vasykiCarouselElem = vasykiCarousel.querySelector(
        ".vasyki__carouselElem"
      );

      vasykiBtnBack.targetCarousel = vasykiCarousel;
      vasykiBtnBack.carouselElem = vasykiCarouselElem;
      vasykiBtnForward.targetCarousel = vasykiCarousel;
      vasykiBtnForward.carouselElem = vasykiCarouselElem;
      vasykiBtnBack.addEventListener("click", scrollToPrevItem);
      vasykiBtnForward.addEventListener("click", scrollToNextItem);
    }
  } else {
    // Check if carousel exists to not run removal function without a reason
    if (vasykiCarouselExists) {
      unGroupItems(".vasyki__carouselElem");
      vasykiCarouselExists = false;
      vasykiBtnBack.removeEventListener("click", scrollToPrevItem);
      vasykiBtnForward.removeEventListener("click", scrollToNextItem);
    }
  }
  // ---Tournament part 720 | 1220
}

function groupItems(count, itemsToWrap, sharedDataSet) {
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
}

function unGroupItems(itemsToReplace) {
  const items = document.querySelectorAll(itemsToReplace);
  items.forEach((item) => {
    item.replaceWith(...item.childNodes);
  });
}

function scrollToPrevItem(e) {
  const whatToScroll = e.currentTarget.targetCarousel;
  const itemWidth = e.currentTarget.carouselElem.clientWidth;
  console.log(whatToScroll);
  console.log(itemWidth);
  whatToScroll.scrollBy({
    left: -itemWidth,
    top: 0,
    behavior: "smooth",
  });
}
function scrollToNextItem(e) {
  const whatToScroll = e.currentTarget.targetCarousel;
  const itemWidth = e.currentTarget.carouselElem.clientWidth;
  console.log(whatToScroll);
  console.log(itemWidth);
  whatToScroll.scrollBy({
    left: itemWidth,
    top: 0,
    behavior: "smooth",
  });
}
