$(document).ready(function() {
	adjustMapSize();
});

$(window).resize(function() {
	adjustMapSize();
});

function adjustMapSize() {
	var lastLeftChild = $("#left-column .card:last-child");
	var mapContainer = $(".card-body").has("#map");
	var mapContainerPadding = parseInt(mapContainer.css('padding'));
	var leftColumnBottom = lastLeftChild.offset().top + lastLeftChild[0].clientHeight;	
	var mapHeight = leftColumnBottom - mapContainer.offset().top - (mapContainerPadding * 2);
	mapHeight = mapHeight < 0 ? mapHeight * -1 : mapHeight;
	var aproxHeight = parseInt(mapHeight);	
	var mapWidth = mapContainer[0].clientWidth - (mapContainerPadding * 2);
	mapWidth = mapWidth < 0 ? mapWidth * -1 : mapWidth;	
	$("#map").css({height: aproxHeight, width: mapWidth});	
	mapContainer.css('padding-bottom', mapContainerPadding + (mapHeight - aproxHeight));
}