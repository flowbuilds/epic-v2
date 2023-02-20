/* epic maps - Mapbox */
if(typeof epic !== "object") {var epic = {}}
epic.map = {
	options: {
		default: {
			style: "mapbox://styles/mapbox/streets-v11",
			center: {lat: -41.270634, lng: 173.283966},
			zoom: 4,
		},
		marker: {
			color: "#ee3c49",
		},
		popup: {
			focusAfterOpen: false,
			closeButton: false,
		},
	},
	maps: {},
	update: (id) => {
		if(id === undefined || id === null || id === "") {return}
		if(!epic.map.maps.hasOwnProperty(id)) {return}
		epic.map.maps[id].bounds = new mapboxgl.LngLatBounds();
		let bounds = false;
		let x = epic.map.maps[id];
		for(itemId in x.items) {
			if(x.items[itemId].hasOwnProperty("popup") && x.items[itemId].popup.hasOwnProperty("remove")) {
				x.items[itemId].popup.remove();
			}
			if(x.activeItems.includes(itemId)) {
				x.items[itemId].marker._element.style.removeProperty("display");
				epic.map.maps[id].bounds.extend([x.items[itemId].lng, x.items[itemId].lat]);
				bounds = true;
			}
			else {
				x.items[itemId].marker._element.style.display = "none";
			}
		}
		if(bounds) {
			x.map.fitBounds(x.bounds, {padding: 64, maxZoom: 12});
		}
	},
	filterInit: () => {
		window.fsAttributes = window.fsAttributes || [];
		window.fsAttributes.push([
			"cmsfilter",
			(filterInstances) => {
				filterInstances.forEach((filterInstance) => {
					let list = filterInstance.listInstance.list;
					filterInstance.listInstance.on("renderitems", (renderedItems) => {
						let id = $(list).attr("epic-map-id");
						epic.map.maps[id].activeItems = [];
						let x = epic.map.maps[id];
						renderedItems.forEach((item) => {
							epic.map.maps[id].activeItems.push($(item.element).attr("epic-map-id"));
						});
						epic.map.update(id);
					});
				});
			}
		]);
	},
	init: () => {
		$("[epic-map-element='container']").each(function(i) {
			let x = {
				container: this,
				map: this.querySelector("[epic-map-element='map']"),
				options: {},
				items: {},
				activeItems: [],
			}
			if(x.map === undefined || x.map === null) {return}
			/* map options */
			x.options = $(this).attr("epic-map-options");
			if(x.options !== undefined && x.options !== null && !epic.map.options.hasOwnProperty(x.options)) {
				x.options = epic.map.options[x.options];
			}
			else {x.options = epic.map.options.default}
			/* map */
			x.options.container = x.map;
			x.map = new mapboxgl.Map(x.options);
			x.map.addControl(new mapboxgl.NavigationControl());
			x.bounds = new mapboxgl.LngLatBounds();
			/* items */
			function createMarker(lnglat) {
				if(lnglat === undefined) {return}
				let marker = new mapboxgl.Marker(epic.map.options.marker).setLngLat(lnglat).addTo(x.map);
				/* bounds */
				x.bounds.extend(lnglat);
				x.map.fitBounds(x.bounds, {padding: 64});
				return marker;
			}
			function createPopup(marker, el) {
				if(typeof marker !== "object") {return}
				if(typeof el !== "object") {return}
				let popup = new mapboxgl.Popup(epic.map.options.popup).setDOMContent(el);
				return popup;
			}
			$(this).find("[epic-map-element='list']").each(function() {
				$(this).attr("epic-map-id", i);
				$(this).children().each(function(j) {
					let item = {
						el: this,
						data: this.querySelector("[epic-map-element='data']"),
					}
					if(item.data === undefined || item.data === null) {
						item.data = false;
						x.items.push(item);
						return
					}
					item.lat = $(item.data).attr("epic-map-lat");
					if(item.lat === undefined || item.lat === null || isNaN(item.lat)) {item.lat = false}
					else {item.lat = Number(item.lat)}
					item.lng = $(item.data).attr("epic-map-lng");
					if(item.lng === undefined || item.lng === null || isNaN(item.lng)) {item.lng = false}
					else {item.lng = Number(item.lng)}
					item.address = $(item.data).attr("epic-map-address");
					if(item.address === undefined || item.address === null || item.address === "") {item.address = false}
					//
					let id = $(item.data).attr("epic-map-id");
					if(id === undefined || id === null || id === "") {id = j}
					$(this).attr("epic-map-id", id);
					//
					let popup = this.querySelector("[epic-map-element='popup']");
					//
					if(item.lat !== false && item.lng !== false) {
						item.marker = createMarker([item.lng, item.lat]);
						if(typeof popup === "object") {
							item.popup = createPopup(item.marker, popup);
							item.marker.setPopup(item.popup);
						}
					}
					else if(item.address !== false) {/* reverse geocode */}
					x.items[id] = item;
				});
			});
			epic.map.maps["" + i + ""] = x;
		});
	}
}
setTimeout(() => {
	epic.map.init();
	epic.map.filterInit();
}, 100);
