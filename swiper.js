/* ws swiper - swiperjs + html video */
if(typeof ws !== "object") {var ws = {}}
ws.swiper = {
	options: {
		default: {
			slidesPerView: "auto",
			loop: true,
			navigation: {},
			pagination: {},
		}
	},
	swipers: {},
	vidsplaypause: (id, y, z) => {
		/* y = true (play) or false (pause) */
		/* if y undefined => toggles play/pause */
		/* z = true (update paused) or false (do no update) */
		if(id === undefined) {return}
		if(!ws.swiper.swipers.hasOwnProperty(id)) {return}
		if(!ws.swiper.swipers[id].swiper.hasOwnProperty("$el")) {return}
		let x = ws.swiper.swipers[id];
		if(typeof y !== "boolean") {
			if(!x.paused) {y = false}
			else {y = true}
		}
		if(typeof z !== "boolean") {z = true}
		$(x.swiper.slides[x.swiper.activeIndex]).find("video").each(function() {
			if(!y) {
				if(z) {ws.swiper.swipers[id].paused = true}
				this.pause();
			}
			else {
				if(z) {ws.swiper.swipers[id].paused = false}
				this.play();
			}
		});
	},
	vidsinit: (id) => {
		if(id === undefined) {return}
		if(!ws.swiper.swipers.hasOwnProperty(id)) {return}
		if(!ws.swiper.swipers[id].swiper.hasOwnProperty("$el")) {return}
		let x = ws.swiper.swipers[id];
		$(x.swiper.$el).find("video").each(function() {
			this.addEventListener("error", (ev) => {
				this.load();
			});
			this.currentTime = 0.1;
		});
		if(x.videos === "autoplay") {
			ws.swiper.swipers[id].paused = false;
			$(x.swiper.$el).find("video").each(function() {
				$(this).on("ended", () => {
					x.swiper.slideNext();
				});
			});
			$(window).on("DOMContentLoaded load resize scroll", () => {
				if(ws.swiper.swipers[id].paused === true) {return}
				let rect = x.swiper.$el[0].getBoundingClientRect();
				if(rect.top >= 0 && rect.top <= window.innerHeight / 2 || 
					rect.top < 0 && rect.bottom > window.innerHeight || 
					rect.bottom <= window.innerHeight && rect.bottom >= window.innerHeight / 2) {
					ws.swiper.vidsplaypause(id, true, false);
				}
				else {
					ws.swiper.vidsplaypause(id, false, false);
				}
			});
		}
		x.swiper.on("slideChange", function() {
			$(x.swiper.$el).find("video").each(function() {
				this.pause();
				this.currentTime = 0.1;
			});
			if(x.videos === "autoplay") {
				ws.swiper.vidsplaypause(id, true);
			}
		});
		$(x.container).find("[ws-swiper-element='play']").each(function() {
			$(this).on("click", () => {ws.swiper.vidsplaypause(id, true)});
		});
		$(x.container).find("[ws-swiper-element='pause']").each(function() {
			$(this).on("click", () => {ws.swiper.vidsplaypause(id, false)});
		});
		$(x.container).find("[ws-swiper-element='playpause']").each(function() {
			$(this).on("click", () => {ws.swiper.vidsplaypause(id);});
		});
	},
	init: () => {
		$("[ws-swiper-element='container']").each(function(i) {
			let x = {
				container: this,
				swiper: this.querySelector("[ws-swiper-element='swiper']"),
				options: {},
			}
			if(x.swiper === undefined || x.swiper === null) {return}
			x.options = $(this).attr("ws-swiper-options");
			if(x.options !== undefined && ws.swiper.options.hasOwnProperty(x.options)) {
				x.options = ws.swiper.options[x.options]
			}
			else {x.options = ws.swiper.options.default}
			$(x.swiper).find("[ws-swiper-element]").each(function() {
				$(this).addClass($(this).attr("ws-swiper-element"))
			});
			// navigation
			x.options.navigation["nextEl"] = this.querySelector("[ws-swiper-element='swiper-button-next']");
			x.options.navigation["prevEl"] = this.querySelector("[ws-swiper-element='swiper-button-prev']");
			// pagination
			x.options.pagination["el"] = this.querySelector("[ws-swiper-element='swiper-pagination']");
			// initialise
			x.swiper = new Swiper(x.swiper, x.options);
			let id = $(this).attr("ws-swiper-id");
			if(id === undefined || id === null || id === "") {id = "" + i + ""}
			ws.swiper.swipers[id] = x;
			// videos
			let videos = $(this).attr("ws-swiper-videos");
			if(videos !== undefined && videos !== null) {
				ws.swiper.swipers[id].videos = videos.toLowerCase();
				ws.swiper.swipers[id].paused = true;
				ws.swiper.vidsinit(id);
			}
		});
	}
}
ws.swiper.init();
