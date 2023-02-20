/* Carousels */
function carouselInit() {
  var a = {a: "epic-carousel"}
  a.el = a.a + "-element";
  a.cont = "[" + a.el + "='container'";
  a.list = "[" + a.el + "='list'";
  a.item = "[" + a.el + "='item'";
  a.dur = a.a + "-duration";
  a.dir = a.a + "-direction";
  a.durmob = a.dur + "-mob";
  a.dirmob = a.dir + "-mob";
  /* */
  const container = gsap.utils.toArray(a.cont);
  container.forEach((c) => {
    const list = c.querySelector(a.list);
    const items = gsap.utils.toArray(a.item, c);
    $(list).clone().appendTo($(c));
    const lists = gsap.utils.toArray(a.list, c);
    /* defaults */
    var duration = 5 * items.length;
    var axis = "x";
    var direction = "-";
    var dimensions = list.offsetWidth;
    /* duration */
    function setDuration(dur) {
      dur = c.getAttribute(dur);
      if(!isNaN(dur)) {duration = Number(dur) * items.length}
    }
    if(c.hasAttribute(a.durmob) && window.innerWidth <= 767) {setDuration(a.durmob);}
    else if(c.hasAttribute(a.dur)) {setDuration(a.dur);}
    /* direction */
    function setDirection(dir) {
      dir = c.getAttribute(dir).toLowerCase();
      if(dir.charAt(0) === "x" || dir.charAt(0) === "y") {axis = dir.charAt(0)}
      if(dir.charAt(1) === "-" || dir.charAt(1) === "+") {direction = dir.charAt(1)}
    }
    if(c.hasAttribute(a.dirmob) && window.innerWidth <= 767) {setDirection(a.dirmob);}
    else if(c.hasAttribute(a.dir)) {setDirection(a.dir)}
    /* dimensions */
    if(axis === "y") {dimensions = list.offsetHeight}
    /* initialise */
    let tl = gsap.timeline({ repeat: -1 });
    let options = {
      duration: duration,
      ease: "none",
      onInterrupt: (self) => {
        console.log("paused");
      },
    }
    options[axis] = direction + "=" + dimensions;
    tl.to(lists, options);
    $(c).hover(
      function () {tl.timeScale(0.5);},
      function () {tl.timeScale(1);}
    );
  })
}
carouselInit();
