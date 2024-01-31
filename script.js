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
      const index = Number(entry.target.dataset.carouselElementIndex);
      if (entry.isIntersecting) {
        //Setting page
        vasykiPages.forEach((page) => {
          if (page.dataset.page == index)
            page.classList.add("vasyki__carouselPageDot--active");
          else page.classList.remove("vasyki__carouselPageDot--active");
        });

        //Enabling|disabling buttons
        //If this is first elem
        if (index === 1) {
          vasykiBtnBack.disabled = true;
          vasykiBtnForward.disabled = false;
        }
        //If this is last elem
        else if (index === vasykiCarouselItemsAmount) {
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
//
//--------------------
//
let intervalId;
const tournamentCarouselBreakpointMedium = 1221;
const tournamentCarouselBreakpointSmall = 721;
const tournamentCarouselItemsAmount = 6;
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
const tournamentCarouselElems = tournamentCarousel.querySelectorAll(
  ".tournament__carouselElem"
);
const tournamentObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      const index = Number(entry.target.dataset.carouselElementIndex);
      if (entry.isIntersecting) {
        entry.target.dataset.visible = true;
      } else {
        entry.target.dataset.visible = false;
      }
    });
    //Find max visible elem for page number in nav
    let page = 1;
    tournamentCarousel
      .querySelectorAll(".tournament__carouselElem")
      .forEach((elem) => {
        if (elem.dataset.visible === "true") {
          let index = elem.dataset.carouselElementIndex;
          page = page >= index ? page : index;
        }
      });
    tournamentCarouselNav.forEach((nav) => {
      nav.querySelector(".tournament__carouselPageCurrent").innerHTML = page;
    });
  },
  {
    root: tournamentCarousel,
  }
);

//adding copies for loop
const tournamentCarouselElemsArray = [];
tournamentCarouselElems.forEach((elem) => {
  tournamentCarouselElemsArray.push(elem.cloneNode(true));
});
tournamentCarouselElemsArray
  .slice(
    tournamentCarouselElemsArray.length / 2,
    tournamentCarouselElemsArray.length
  )
  .reverse()
  .forEach((elem) => {
    tournamentCarousel.prepend(elem);
  });
tournamentCarouselElemsArray
  .slice(0, tournamentCarouselElemsArray.length / 2)
  .forEach((elem) => {
    tournamentCarousel.append(elem);
  });
//Scroll to first elem if it's not on the screen
tournamentCarousel
  .querySelector(".tournament__carouselElem[data-carousel-element-index='1']")
  .scrollIntoView();
//Setting observer
tournamentCarousel
  .querySelectorAll(".tournament__carouselElem")
  .forEach((elem) => {
    tournamentObserver.observe(elem);
  });

tournamentCarousel.addEventListener("scroll", function () {
  let ItemsOnScreen = 3;
  if (window.innerWidth < tournamentCarouselBreakpointMedium) ItemsOnScreen = 2;
  if (window.innerWidth < tournamentCarouselBreakpointSmall) ItemsOnScreen = 1;

  if (tournamentCarousel.scrollLeft === 0) {
    stopInterval();
    tournamentCarousel.style.scrollBehavior = "auto";
    tournamentCarousel.scrollLeft =
      tournamentCarousel.clientWidth *
      (tournamentCarouselItemsAmount / ItemsOnScreen);
    tournamentCarousel.style.scrollBehavior = "smooth";
    startInterval();
  } else if (
    Math.ceil(
      tournamentCarousel.scrollLeft + tournamentCarousel.clientWidth + 41
    ) >= Math.ceil(tournamentCarousel.scrollWidth)
  ) {
    stopInterval();
    tournamentCarousel.style.scrollBehavior = "auto";
    tournamentCarousel.scrollLeft = tournamentCarousel.clientWidth;
    tournamentCarousel.style.scrollBehavior = "smooth";
    startInterval();
  }
});

window.onresize = resizeFn;
resizeFn();
startInterval();
tournamentCarousel.addEventListener("mouseenter", function () {
  stopInterval();
});

tournamentCarousel.addEventListener("mouseleave", function () {
  startInterval();
});

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
      vasykiCarousel
        .querySelectorAll(".vasyki__carouselElem")
        .forEach((elem) => {
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
  // --Tournament part
  tournamentCarouselResize();
}

function tournamentCarouselResize() {
  const first = tournamentCarousel.firstElementChild;
  const last = tournamentCarousel.lastElementChild;
  const second = first.nextElementSibling;
  const prelast = last.previousElementSibling;
  if (window.innerWidth < tournamentCarouselBreakpointMedium) {
    first.style.display = "none";
    last.style.display = "none";
    second.style.display = "grid";
    prelast.style.display = "grid";
    if (window.innerWidth < tournamentCarouselBreakpointSmall) {
      second.style.display = "none";
      prelast.style.display = "none";
    }
  } else {
    first.style.display = "grid";
    last.style.display = "grid";
    second.style.display = "grid";
    prelast.style.display = "grid";
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
  stopInterval();
  const whatToScroll = e.currentTarget.targetCarousel;
  const itemWidth = e.currentTarget.carouselElem.clientWidth;
  whatToScroll.scrollBy({
    left: -itemWidth,
    top: 0,
    behavior: "smooth",
  });
  startInterval();
}
function scrollToNextItem(e) {
  stopInterval();
  const whatToScroll = e.currentTarget.targetCarousel;
  const itemWidth = e.currentTarget.carouselElem.clientWidth;
  whatToScroll.scrollBy({
    left: itemWidth,
    top: 0,
    behavior: "smooth",
  });
  startInterval();
}

function startInterval() {
  intervalId = setInterval(() => {
    tournamentCarousel.scrollBy({
      left: tournamentCarousel.clientWidth,
      top: 0,
      behavior: "smooth",
    });
  }, 4000);
}

function stopInterval() {
  clearInterval(intervalId);
}
