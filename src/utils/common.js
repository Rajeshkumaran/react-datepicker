

export const isClientSide = () => typeof window === 'object';

export const getViewPortHeight = () =>
  isClientSide() ? window.innerHeight : null;

export const smoothScroll = (MoveTo, animationDelay, scrollBy = true) => {
  // scrollBy used for moving downwards with some distance
  let start = null;
  let runTime;
  let counter;
  const InitialScrollPosition =
    document.body.scrollTop ||
    document.documentElement.scrollTop ||
    document.scrollingElement.scrollTop;
  const fps = 16; //  standard rate
  const Loop = animationDelay / fps; // 59.9 or 60 for 1sec
  const distanceToCover = scrollBy && Math.abs(MoveTo);
  const interval = distanceToCover / Loop;
  counter = InitialScrollPosition;
    function scrollByStep(timestamp) {
    counter += interval;
    if (!start) start = timestamp;
    runTime = timestamp - start;

    document.body.scrollTo({ top: counter }); // scrolling

    if (runTime < animationDelay) {
      window.requestAnimationFrame(scrollByStep);
    }
  }
  if (scrollBy) window.requestAnimationFrame(scrollByStep);
};
