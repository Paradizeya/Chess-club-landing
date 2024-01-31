const vasykiCarousel = document.querySelector(".vasyki__stages");
vasykiCarousel.classList.add("vasyki__carousel");

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

//Pages in nav
const vasykiPages = vasykiCarouselNav.querySelectorAll(
  ".vasyki__carouselPageDot"
);

//Observer for vasykiCarousel
const vasykiObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //Setting page
        vasykiPages.forEach((page) => {
          if (page.dataset.page == entry.target.dataset.carouselElementIndex)
            page.classList.add("vasyki__carouselPageDot--active");
          else page.classList.remove("vasyki__carouselPageDot--active");
        });

        //Enabling|disabling buttons
        //If this is first elem
        if (entry.target.dataset.carouselElementIndex == 1) {
          vasykiBtnBack.disabled = true;
          vasykiBtnForward.disabled = false;
        }
        //If this is last elem
        else if (
          entry.target.dataset.carouselElementIndex == vasykiCarouselItemsAmount
        ) {
          vasykiBtnBack.disabled = false;
          vasykiBtnForward.disabled = true;
        }
        //If this is in between elem
        else {
          vasykiBtnBack.disabled = false;
          vasykiBtnForward.disabled = false;
        }
      }
    });
  },
  {
    root: vasykiCarousel,
  }
);

window.onresize = resizeFn;
resizeFn();
//
//--------------------
//
const tournamentCarousel = document.querySelector(".tournament__carousel");
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
//Observer for tournamentCarousel

//
//
// ------------ Functions
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

      vasykiBtnBack.targetCarousel = vasykiCarousel;
      vasykiBtnBack.carouselElem = vasykiCarousel;
      vasykiBtnForward.targetCarousel = vasykiCarousel;
      vasykiBtnForward.carouselElem = vasykiCarousel;
      vasykiBtnBack.addEventListener("click", scrollToPrevItem);
      vasykiBtnForward.addEventListener("click", scrollToNextItem);
      //Adding observer to created elements
      document.querySelectorAll(".vasyki__carouselElem").forEach((elem) => {
        vasykiObserver.observe(elem);
      });
    }
  } else {
    // Check if carousel exists to not run removal function without a reason
    if (vasykiCarouselExists) {
      unGroupItems(".vasyki__carouselElem");

      vasykiCarouselExists = false;

      vasykiBtnBack.removeEventListener("click", scrollToPrevItem);
      vasykiBtnForward.removeEventListener("click", scrollToNextItem);
      vasykiObserver.disconnect();
    }
  }
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
  whatToScroll.scrollBy({
    left: -itemWidth,
    top: 0,
    behavior: "smooth",
  });
}
function scrollToNextItem(e) {
  const whatToScroll = e.currentTarget.targetCarousel;
  const itemWidth = e.currentTarget.carouselElem.clientWidth;
  whatToScroll.scrollBy({
    left: itemWidth,
    top: 0,
    behavior: "smooth",
  });
}
