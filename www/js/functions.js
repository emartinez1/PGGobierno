$(document).ready(function(){
	
	
	var lat = 19.3907337;
	var lng = -99.1436126;
	var accuracy = 5;

	
    $(this).bind("contextmenu", function(e) {
       e.preventDefault();
    });
	/*
	$("#mainContent").load("vista/main.html", function( response, status, xhr ) {
		  if ( status == "error" ) {
				alert("No se puede cargar la aplicación");
		 	 }
	});	
	*/
     FastClick.attach(document.body);
			
	$("#btnMovilidad").click(function(){
		$("#mainContent").load("vista/mapa.html", function( response, status, xhr ) {
		  if ( status == "error" ) {
				alert("No se puede cargar el componente");
		 	 }else{
				 getLocation();
			}
			});
		})
		
	$("#btnHome").click(function(){
		$("#mainContent").load("vista/main.html", function( response, status, xhr ) {
		  if ( status == "error" ) {
				alert("No se puede cargar el componente");
		 	 }else{
				 	alert('OK');
				 }
			});
		})	
		
})

function CAlert(titulo,msj){
	var txt = "<h3>"+titulo+"</h3>"+
      		"<p>"+msj+"</p>";
	$("#contPopUp").html(txt);
	$("#alertPopUp").popup("open")

}

function getLocation() {
	navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);
}

function onSuccessGeo(position) {
	lat = position.coords.latitude;
	lng =  position.coords.longitude; 
	accuracy = position.coords.accuracy;
	goMap();
}

function onErrorGeo(error){
	goMap();
	alert(error.message);
}

function goMap(){
	var viewport = {
    width  : $(window).width(),
    height : $(window).height()
};
	var rad;
	var map = $('#map_canvas').gmap('get', 'map');
	var geocoder = new google.maps.Geocoder();
	var latLng = new google.maps.LatLng(lat,lng);

	if(accuracy > 30)
		rad = 25
	else if(accuracy > 20 & accuracy < 30)
		rad = 15
	else if(accuracy > 10 & accuracy < 20)
		rad = 10
	else if(accuracy > 0 & accuracy < 10)
		rad = 7
	else
		rad = 5

	
	$("#map_canvas").css("height",viewport.height*0.8);
		$('#map_canvas').gmap().bind('init', function(ev, map) {
		$('#map_canvas').gmap('option', 'center', latLng);
		$('#map_canvas').gmap('option', 'zoom', 18);  
		$('#map_canvas').gmap('option', 'disableDefaultUI', true);  

	});
	$('#map_canvas').gmap('addMarker', {'position': latLng, 'bounds': true}).click(function() {
		$('#map_canvas').gmap('openInfoWindow', {'content': 'ústed está aquí!'}, this);
	});
			$('#map_canvas').gmap('addShape', 'Circle', { 
				'strokeWeight': 0, 
				'fillColor': "#008595", 
				'fillOpacity': 0.3, 
				'center': latLng, 
				'radius': rad, 
				'clickable': false 
			});
	geocoder.geocode({'location': latLng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
		alert(results[1].formatted_address)
	}else{
		alert("Error");	
	}
	});

	$(map).addEventListener('zoom_changed', function(event) {
		if(map.zoom < 10){
    			$('#map_canvas').gmap('option', 'zoom', 10);   
		}
	});
	$(map).addEventListener('center_changed', function(event) {
		// 117.301348 Tijuana
		// 14.470012 chiapas
		var newLatLng = map.getCenter();
		var latitude = newLatLng.lat();
		var longitude = newLatLng.lng();
		if(parseFloat(longitude) < -99.497640 || parseFloat(longitude) > -98.625601){
			newLatLng = new google.maps.LatLng(latitude,-99.076040);
			$('#map_canvas').gmap('option', 'center', newLatLng);
		}
		if(parseFloat(latitude) > 19.135372 || parseFloat(latitude) < 18.321219){
			newLatLng = new google.maps.LatLng(18.713178,longitude);
			$('#map_canvas').gmap('option', 'center', newLatLng);
		}


	});
}