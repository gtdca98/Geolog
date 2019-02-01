///nuevos objetos
var map;
var mapMR;
var mapRegionEDO;
var algo;
var mapselected;
var nivelActual;
var entidadesk = {}
var muncipiosk = {}
var geojsonstate;
var datosactivos;
var valorT;
var datosmun1k;
var unestado ;
var unregion ;

var claveEdoAct = '00';
var claveRegAct = '0000';
var claveMpoAct = '00000';

var proceso =0;
var proceso2 =0;
var proceso3=0;
var procesoMR =0;
var procesoRegEdo =0;


var col_SB = [5,15,17,18,19,20,21,22,23,23];
var col_EU = [6,24,25,26,27,28,29,30,32];
var col_C = [7,33,34,35,36];
var col_Dacc =[8,37,40,43,46,49,51,54];
var col_Dden =[8,38,41,44,47,50,52,55];
var col_Ddis =[8,39,42,45,48,53,56];
var col_nombres =[ "cve_fk","cve_ctrl","nombre","abr",
"IMUNAC","SERVICIOS BÁSICOS","ENTORNO URBANO","CONECTIVIDAD","DESTINOS",
"pop","REGION","grupo","Lugar_nac","Lugar_edo","Lugar_reg",
'Agua potable','Almacenamieno de agua','Energía eléctrica','Uso de combustible para cocinar','Material de vivienda adecuada',
'Saneamiento','Manejo de residuos','Telecomunicaciones','Espacio vital suficiente',            
"Acceso a vivienda","Banquetas","Guarniciones","Vegetación","Rampas","Alumbrado",
"Señalización","eu_area","AVU","Velocidad: longitud de calles entre tiempo promedio del viaje","Densidad: longitud de calles por metro cuadrado","Proporción de viajes en transporte alterno / privado","Porcentaje de Accidentes del total de viajes realizados",
"Acc. Consultorios","Den. Consultorios","Dis. Consultorios","Acc. Educación","Den. Educación","Dis. Educación",
"Acc. Entretenimiento","Den. Entretenimiento","Dis. Entretenimiento","Acc. Deporte","Den. Deporte",
"Dis. Deporte","Acc. Farmacia","Den. Farmacia","Acc. Hospital","Den. Hospital","Dis. Hospital",
"Acc. Nutrición","Den. Nutrición","Dis. Nutrición"]  




$(document).ready(function() {
	$("#ImunacSummary").empty();
     res_imunac(imunac_municipios,"#ImunacSummary")
});

$(document).ready(function() {
  
  var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8),getCol(imunac_estados, 9)]);
  nivelActual = 'Nacional';


  var encabezado= [ { title: "CLAVE"},{ title: 'ESTADO'},{ title: "ID"},{ title: "IMUNAC"},{ title: "SERVICIOS BÁSICOS"},{ title: "ENTORNO URBANO"},{ title: "CONECTIVIDAD"},{ title: "DESTINOS"},{ title: "POBLACIÓN"}];
  var colorcols = [3,4,5,6,7];
  var ocultar = [0,2];

  GeneraTabla(datostbl,encabezado,'#rec_tablashp',colorcols,breaks_5e,colors_5,true,true,ocultar, false)


  var datostblnac =  transpose([getCol(imunac_nacional, 1),getCol(imunac_nacional, 2),getCol(imunac_nacional, 3),getCol(imunac_nacional, 4),getCol(imunac_nacional, 5),getCol(imunac_nacional, 6),getCol(imunac_nacional, 7),getCol(imunac_nacional, 8),getCol(imunac_nacional, 9)]);
  leyenda = 'NIVEL'
  
  var colorcols = [0];
  GeneraTabla(datostblnac,encabezado,'#rec_tablatotales',colorcols,breaks_5e,colors_5,false,false,ocultar, true)
  
  //inicializa objetos en seccion de cosnultas por estado
  GeneraTabla(imunac_nacional,encabezado,'#TabRegionEDO',colorcols,breaks_5e,colors_5,false,false,ocultar, true)
  //preparaEstado('20')

carga_tablaescala2('Tedo')
 toggleMS('00')
} );



var objetivo;


function toggleMNU(option){
	var objetos =["#seccionNacional","#seccionEstados","#seccionRegiones", "#seccionMunicipios","#Resto"];
	var relOption = ["Nac","Edo","Reg","Mpo","Otr"];
	for (var i=0; i<5; i++){
		if (option === relOption[i]){
			//$(objetos[i]).fadeIn();
		}else{	
			//$(objetos[i]).fadeOut();
		};
	};
	if (option === 'Edo' && claveEdoAct!='00'){
		//preparaEstado(claveEdoAct)
	}
	if (option === 'Reg' && claveRegAct!='0000'){

	}
	if (option === 'Mpo' && claveMpoAct!='00000'){

	}
};



/*
 ▄▄                               ▄▄▄▄   ▄▄▄▄                         
 ██                              ██▀▀▀   ▀▀██                  ██     
 ██         ▄████▄    ▄█████▄  ███████     ██       ▄████▄   ███████  
 ██        ██▄▄▄▄██   ▀ ▄▄▄██    ██        ██      ██▄▄▄▄██    ██     
 ██        ██▀▀▀▀▀▀  ▄██▀▀▀██    ██        ██      ██▀▀▀▀▀▀    ██     
 ██▄▄▄▄▄▄  ▀██▄▄▄▄█  ██▄▄▄███    ██        ██▄▄▄   ▀██▄▄▄▄█    ██▄▄▄  
 ▀▀▀▀▀▀▀▀    ▀▀▀▀▀    ▀▀▀▀ ▀▀    ▀▀         ▀▀▀▀     ▀▀▀▀▀      ▀▀▀▀  
 */


function ajusta01layer(objeto,fillColor,opacity,fillOpacity,condicion){
	var condstr=  objeto + ".eachLayer(function(layer) { if (layer.feature.properties."+condicion+")";
		var comando= condstr + " {layer.setStyle({color: 'black',weight: 2,fillColor: "+fillColor+",opacity:" +opacity+ " ,fillOpacity: "+fillOpacity+"});};});";
	 	eval(comando);
	 	console.log(comando);
};


function vistaregMR(clavebuscada){
	console.log("Estoy buscando las MESO regiones   " + clavebuscada  + "  " + procesoMR);
	procesoMR= procesoMR +1
		//var clavebuscada= document.getElementById("edo_select").innerHTML 
		//var clavebuscada = document.getElementById('TEXTBOX_ID');
		//var n = clavebuscada.value.length
		//if (n===2 && Number(clavebuscada.value) > 0 && Number(clavebuscada.value) < 32  ){
			 n = clavebuscada.length

			 console.log(n)
		if (n===2 && Number(clavebuscada) > 0 && Number(clavebuscada) < 33 ){
			if ( proceso >1 ){map.removeLayer(geojsonextMR);};
			geojsonextMR =L.geoJson(mesoregiones, {

			        style: function (feature) {
				            return { 
				            	color: "black",
				            	fillColor: 'pink',//getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors),
				            	weight: 1,
				            	fill: true,
				            	opacity: 1,
				            	fillOpacity: 0,
				            	clickable: true 
				            };
			        },
			        onEachFeature: function(feature, layer) {
			        regiones.push({
			            name: layer.feature.properties.REGION,
			            source: "regiones",
			            id: L.stamp(layer),
			            bounds: layer.getBounds()
			        });
			    },
			        onEachFeature: function (feature, layer) {
			            layer.bindPopup(feature.properties.REGION + '  ' +
			            	feature.properties.CVE_REG
			            	);
			    },
				    onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: highlightFeatureR,
				        mouseout: resetHighlightBR,
				        //click: zoomToFeatureR
				        click: 	function (layer){
				        	var layerM = layer.target
							var	clave =  layerM.feature.properties.ENTREG
							var	regsel =  layerM.feature.properties.REGION
							document.getElementById("edo_select").innerHTML = regsel;
							document.getElementById("sele_plot").innerHTML = clave;
							//dibujaplots();
							document.getElementById("mpo_select").innerHTML = "";
							document.getElementById("fake").click();
							console.log("llamando vistampo desde mapa	" + clave);
							//un_selected(mapselected);
							mapselected = clave;
							//do_selected(mapselected);

							vistampo(clave)
						}
				    });
				},
				
				    filter: function(feature, layer) {
				        if (feature.properties.MESOREGI_1 === clavebuscada) {
				        	console.log( "Ya lo encontre el submapa del estado " + clavebuscada);

				        	return true;
				        };
				    }
			}).addTo(mapMR);
			//zoomToFeature;
			mapMR.fitBounds(geojsonextMR.getBounds());
		};

};

function vistaregRegEdo(clavebuscada){
	console.log("Estoy buscando las regiones  estatales " + clavebuscada  + "  " + procesoRegEdo);
	procesoRegEdo= procesoRegEdo +1
		//var clavebuscada= document.getElementById("edo_select").innerHTML 
		//var clavebuscada = document.getElementById('TEXTBOX_ID');
		//var n = clavebuscada.value.length
		//if (n===2 && Number(clavebuscada.value) > 0 && Number(clavebuscada.value) < 32  ){
			 n = clavebuscada.length

			 console.log(n)
		if (n===2 && Number(clavebuscada) > 0 && Number(clavebuscada) < 3300 ){
			if ( procesoRegEdo >1 ){map.removeLayer(geojsonRegEdo);};
			geojsonRegEdo =L.geoJson(regiones, {

			        style: function (feature) {
				            return { 
				            	color: "black",
				            	fillColor: 'pink',//getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors),
				            	weight: 1,
				            	fill: true,
				            	opacity: 1,
				            	fillOpacity: 0,
				            	clickable: true 
				            };
			        },
			        onEachFeature: function(feature, layer) {
			        regiones.push({
			            name: layer.feature.properties.REGION,
			            source: "regiones",
			            id: L.stamp(layer),
			            bounds: layer.getBounds()
			        });
			    },
			        onEachFeature: function (feature, layer) {
			            layer.bindPopup(feature.properties.REGION + '  ' +
			            	feature.properties.CVE_REG
			            	);
			    },
				    onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: //highlightFeatureR,
				          function (layer){
				          	var layerM = layer.target
				        	layerM.setStyle({
						        color: 'black',
						        weight: 2,
						        fillColor: 'coral',
						        opacity : 1,
						        fillOpacity: 0.4,
						        clickable: true 
						    });
							var	clave =  layerM.feature.properties.ENTREG;
				        	map2tbl(clave,"#TabRegionEDO");
				        	
				        },

				        mouseout: //resetHighlightBR,
				          function (layer){
				        			var layerM = layer.target
								        layerM.setStyle({
							     		color: 'black',
								        weight: 2,
								        fillColor: 'pink',
								        opacity: 1,
								        fillOpacity: 0
								    });
							map2tbl('nada',"#TabRegionEDO")
							$('#mre_sel').text("");

				        },
				        //click: zoomToFeatureR
				        click: 	function (layer){
				        	var layerM = layer.target
							var	clave =  layerM.feature.properties.ENTREG
							var	regsel =  layerM.feature.properties.REGION
							document.getElementById("edo_select").innerHTML = regsel;
							document.getElementById("sele_plot").innerHTML = clave;
							//dibujaplots();
							document.getElementById("mpo_select").innerHTML = "";
							document.getElementById("fake").click();
							console.log("llamando vistampo desde mapa	" + clave);
							//un_selected(mapselected);
							mapselected = clave;
							//do_selected(mapselected);

							vistampo(clave)
						}
				    });
				},
				
				    filter: function(feature, layer) {
				        if (feature.properties.CVE_ENT === clavebuscada){
				        	console.log( "Ya lo encontre el submapa del estado " + clavebuscada);

				        	return true;
				        };
				    }
			}).addTo(mapRegionEDO);
			//zoomToFeature;
			mapRegionEDO.fitBounds(geojsonRegEdo.getBounds());
		};

};



	function highlightFeatureEstado(e) {
		if (nivelActual=='Nacional'){
		objetivo = e.target;
	    var layer = e.target;
		    layer.setStyle({
		        color: 'red',
		        weight: 2,
		        fillColor: 'coral',
		        opacity : 1,
		        fillOpacity: 0.4,
		        clickable: true 
		    });
        var	entsel =  layer.feature.properties.NOM_ENT;
        var	cveedo =  layer.feature.properties.CVE_ENT;
	    map2tbl(cveedo,'#rec_tablashp');
	    };    

	    //info.update(layer.feature.properties);
	};

	// reajusta el poligono (estados)
	function resetHighlightEstado(e) {
		if (nivelActual=='Nacional'){
		var layer = e.target;

	        layer.setStyle({
	        
		        color: 'black',
		        weight: 2,
		        //fillColor: 'gray',
		        fillColor: 'transparent',
		        opacity: 1,
		        fillOpacity: 0,
		        clickable: true 

	    });
	    map2tbl('nada','#rec_tablashp')
		};
	        //info.update();

	};



function initMapRegionEDO() {
	// set up the map
    mapRegionEDO = new L.map('mapRegionEDO',{attributionControl: false,zoomSnap: 0.125,zoomControl: false }).setView(new L.LatLng(22.870697, -101.393824),3.6);
    mapRegionEDO.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    mapRegionEDO.dragging.disable(); // sin drah event
    mapRegionEDO.touchZoom.disable(); 
    mapRegionEDO.doubleClickZoom.disable();


	geojsonmunicipioRegEdo =L.geoJson(municipios, {
			name:'municipiostodosRegEdo'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: 'lightblue',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 1,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	}).addTo(mapRegionEDO);


    ajusta01layer('geojsonmunicipioRegEdo','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOREG!='0000'");



// carga los polígonos de las entidades
	geojsonstateRegEdo =L.geoJson(entidades, {
			name:'stateRegEdo'	,
	        style: function (feature) {
	            return { 
	            	color: "#000000",
					//fillColor: "gray",
					fillColor: 'lightblue',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 1,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	}).addTo(mapRegionEDO);


	// carga los polígonos de las regiones
	 geojsonRegEdo =L.geoJson(regiones, {
			name:'RegEdo'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 1,
	            	opacity: 0,
	            	fillOpacity: 0,
	            	clickable: false 
	            };
	        },
		    onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: nada,
		        mouseout: nada
		    });
		},
		zoomToFeature

	}).addTo(mapRegionEDO);

	 function nada(){

	 };

	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}

L.control.attribution({position: 'topright'}).addTo(mapRegionEDO);
};



function initmapMR() {
	// set up the map
    mapMR = new L.map('mapMR',{attributionControl: false,zoomSnap: 0.125,zoomControl: false }).setView(new L.LatLng(22.870697, -101.393824),3.6);
    mapMR.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    mapMR.dragging.disable(); // sin drah event
    mapMR.touchZoom.disable(); 
    mapMR.doubleClickZoom.disable();

	geojsonmunicipioMR2 =L.geoJson(municipios, {
			name:'municipiostodosMR'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: 'lightblue',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 1,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	}).addTo(mapMR);

    ajusta01layer('geojsonmunicipioMR2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOREG!='0000'");


// carga los polígonos de las entidades
	geojsonstateMR2 =L.geoJson(entidades, {
			name:'mesoregionestodos'	,
	        style: function (feature) {
	            return { 
	            	color: "#000000",
					//fillColor: "gray",
					fillColor: 'lightblue',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 1,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	}).addTo(mapMR);


	// carga los polígonos de las mesoregiones
	 geojsonMR =L.geoJson(mesoregiones, {
			name:'mesoregA'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: false 
	            };
	        },
		    onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: nada,
		        mouseout: nada
		    });
		},
		zoomToFeature 

	}).addTo(mapMR); 


	 function nada(){

	 };
	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}

L.control.attribution({position: 'topright'}).addTo(mapMR);
};

// inicializa el mapa
function initmap2() {
	// set up the map
var map2 = L.map('map2',{zoomSnap: 0.125,zoomControl: false }).setView(new L.LatLng(22.870697, -101.393824),4.8);
    map2.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    map2.dragging.disable(); // sin drah event
    map2.touchZoom.disable(); 
    map2.doubleClickZoom.disable();



// carga los polígonos de las municipios
	geojsonmunicipioM2 =L.geoJson(municipios, {
			name:'municipiostodos'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: 'lightblue',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 1,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	}).addTo(map2);


	geojsonregionesM2 =L.geoJson(regiones, {
			name:'regionestodos'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: 'lightgreen',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 1,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	});//.addTo(map);


   geojsonregionM2 =L.geoJson(regiones, {
			name:'regionestodos'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: true 
	            };
	        },
		zoomToFeature

	});

   geojsonmesoregionM2 =L.geoJson(mesoregiones, {
			name:'mesoregionestodos'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: true 
	            };
	        },
		zoomToFeature

	});


    ajusta01layer('geojsonmunicipioM2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOREG!='0000'");

    ajusta01layer('geojsonregionesM2','getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors)[0]',0,1,"CVE_ENT!='00'");


	// carga los polígonos de las entidades
	geojsonstateM2 =L.geoJson(entidades, {
			name:'entidades'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: true 
	            };
	        },
	        onEachFeature: function(feature, layer) {

	        entidadesk.push({
	            name: layer.feature.properties.NOM_ENT,
	            source: "entidades",
	            id: L.stamp(layer),
	            bounds: layer.getBounds()
	        });
	    },
	        onEachFeature: function (feature, layer) {

	            layer.bindPopup(feature.properties.NOM_ENT + '  ' +
	            	feature.properties.CVE_ENT
	            	);
	    },
		    onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeatureEstado,
		        mouseout: resetHighlightEstado
		    });
		},
		zoomToFeature

	}).addTo(map2);


		
	var baseMaps2 = {
	    "Municipios": geojsonmunicipioM2,
	    "Regiones": geojsonregionesM2
	};

	var overlayMaps2 = {
	    "Estados": geojsonstateM2,
	    "Regiones": geojsonregionM2,
	    "Mesoregiones": geojsonmesoregionM2
	};

	L.control.layers(baseMaps2,overlayMaps2).addTo(map2);


	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}


var k01="<select id='select_estados'><option value='00'>Estados</option>";
  for(var i = 0; i < imunac_estados.length; i++){
  	k01= k01 + "<option value='" + imunac_estados[i][1] + "'>"+imunac_estados[i][2]+"</option>";
  };
  k01= k01 + "</select>";

var k02 = '<div class="escalaSize"><table id="rec_tablaescala" class="compact hover"></table></div>';

//$("#map_filt_edo").append(k01)

var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = k01;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map2);

var legend2 = L.control({position: 'bottomleft'});
legend2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = k02;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend2.addTo(map2);




//$(document).ready(function() {
	$('#select_estados').on('change', function() {
		toggleMNU("Edo")

	  	preparaEstado( this.value );
	})
//});        



// add an OpenStreetMap tile layer
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map2);

};



// inicializa el mapa
function initmap() {
	// set up the map
	map = new L.Map('map',{
        zoomSnap: 0.125,
        scrollWheelZoom: false,	// no hay zoom  con el wheel 
        zoomControl: false // no haya zoom control
    });

    map.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    map.dragging.disable(); // sin drah event
    map.touchZoom.disable(); 
    map.doubleClickZoom.disable();




		// si seañade en forma particular se controla la posision
		//	L.control.zoom({
		//	     position:'topright'
		//	}).addTo(map);

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});
	var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});		

	/*var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});*/

	// start the map in Mexico
	map.setView(new L.LatLng(22.870697, -101.393824),4);
    
    //  al inhibirlo no se carga el mapa
    //var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});
    ///map.addLayer(osm);
	

// carga los polígonos de las municipios
	geojsonmunicipio =L.geoJson(municipios, {
			name:'municipiostodos'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'lightblue',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 1,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	}).addTo(map);


//este layer corresponde unicamente a superficie de las regiones
	geojsonregiones =L.geoJson(regiones, {
			name:'regionestodos'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'lightgreen',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 1,
	            	clickable: false 
	            };
	        },
		zoomToFeature

	});//.addTo(map);

//este layer corresponde unicamente a bordes de las regiones
   geojsonregion =L.geoJson(regiones, {
			name:'regionestodos'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: true 
	            };
	        },
		zoomToFeature

	});

    ajusta01layer('geojsonmunicipio','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOREG!='0000'");


    ajusta01layer('geojsonregiones',"getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breaks,imunac_colors)[0]",0,1, "ENTREG!='0000'" );


	// carga los polígonos de las entidades
	geojsonstate =L.geoJson(entidades, {
			name:'entidades'	,
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: 'gray',
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: true 
	            };
	        },
	        onEachFeature: function(feature, layer) {

	        entidadesk.push({
	            name: layer.feature.properties.NOM_ENT,
	            source: "entidades",
	            id: L.stamp(layer),
	            bounds: layer.getBounds()
	        });
	    },
	        onEachFeature: function (feature, layer) {

	            layer.bindPopup(feature.properties.NOM_ENT + '  ' +
	            	feature.properties.CVE_ENT
	            	);
	    },
		    onEachFeature(feature, layer) {
		    layer.on({
		    	
		        mouseover: highlightFeatureEstado,
		        mouseout: resetHighlightEstado,
		        //click: loadmpos
		        click: 	function (layer){
		        	var layer2 = layer.target
					var	clave =  layer2.feature.properties.CVE_ENT
					var	edosel =  layer2.feature.properties.NOM_ENT
					document.getElementById("edo_select").innerHTML = edosel;
					document.getElementById("sele_plot").innerHTML = clave;
					dibujaplots();
					document.getElementById("mpo_select").innerHTML = "";
					document.getElementById("fake").click();
					console.log("llamando vistareg 	" + clave);
					//un_selected(mapselected);
					mapselected = clave;
					//do_selected(mapselected);

					vistareg(clave)


				}

		    });
		},
		zoomToFeature

	}).addTo(map);


		
	var baseMaps = {
	    "Municipios": geojsonmunicipio,
	    "Regiones": geojsonregiones
	};

	var overlayMaps = {
	    "Estados": geojsonstate,
	    "Regiones": geojsonregion
	};

	///L.control.layers(baseMaps,overlayMaps).addTo(map);





	//resalta el poligono seleccionado


	// zoom al poligono seleccionado
	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}


	// muestra una etiqueta en evento onmouse over
	function showLabel(e) {
		var layer = e.target;
		municipios.push({
	            name: layer.feature.properties.NOM_MUN,
	            source: "municipios",
	            id: L.stamp(layer),
	            bounds: layer.getBounds()
	        });
	}

		//agregamos un boton par reestablecer la vista al plano original
		// que muestra zoon general a  mexico
};

//// termina init map


var ajaxRequest;
var plotlist;
var plotlayers=[];
var geojsonext;
var geojsonext2;
var geojsonext3;
var edoactual;

	//resalta el poligono seleccionado
	function highlightFeatureR(e) {
		if (nivelActual=='Regional'){
	    var layer = e.target;
		    layer.setStyle({
		        color: 'red',
		        weight: 2,
		        fillColor: 'coral',
		        opacity : 1,
		        fillOpacity: 0.4,
		        clickable: true 
		    });
//	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//	        layer.bringToFront();
//	    }
	    var	regsel =  layer.feature.properties.ENTREG;
	    var	regnom =  layer.feature.properties.REGION;
	    map2tbl(regsel,'#rec_tablashp');
	    };
	    // info.update(layer.feature.properties);
	};

	function resetHighlightBR(e) {
		if (nivelActual=='Regional'){
		var layer = e.target;
	        layer.setStyle({
     		color: 'black',
	        weight: 1,
	        fillColor: getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors)[0],
	        opacity: 1,
	        fillOpacity: 1
	    });
	        
	    map2tbl('nada','#rec_tablashp')
	       // info.update();
	    };
	};


	//resalta el poligono seleccionado
	function highlightFeatureM(e) {
	    var layer = e.target;
		    layer.setStyle({
		        color: 'red',
		        weight: 2,
		        fillColor: 'coral',
		        opacity : 1,
		        fillOpacity: 0.4,
		        clickable: true 
		    });
	    var	mposel =  layer.feature.properties.EDOMUN;
	    var	mponom =  layer.feature.properties.NOM_MUN;

	    map2tbl(mposel,'#rec_tablashp');
	   // info.update(layer.feature.properties);
	}



	// reajusta el poligono (municipios)
	function resetHighlightBM(e) {
		var fiop=0.2;
		if(nivelActual=='Municipio'){
	  		fiop=0;
		}
		var layer = e.target;
	        layer.setStyle({
     		color: 'black',
	        weight: 2,
	        fillColor: getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0],
	        //getColor(checkTotal_mpo(layer.feature.properties.EDOMUN)),
	        opacity: 1,
	        fillOpacity: fiop
	    });
	        

	    map2tbl('nada','#rec_tablashp')
	       // info.update();

	}
	// zoom al poligono seleccionado
	function zoomToFeatureM(e) {
	    map.fitBounds(e.target.getBounds());
		var layer = e.target
		var	clave =  layer.feature.properties.CVE_MUN
		var	mposel =  layer.feature.properties.NOM_MUN
		document.getElementById("mpo_select").innerHTML = "Municipio: " + clave + ' ' + mposel;

	}

	function zoomToFeatureR(e) {
	    map.fitBounds(e.target.getBounds());
		var layer = e.target
		var	clave =  layer.feature.properties.CVE_REG
		var	regsel =  layer.feature.properties.REGION
		document.getElementById("mpo_select").innerHTML = "Municipio: " + clave + ' ' + regsel;

	}





function vistareg(clavebuscada){
	console.log("Estoy buscando las regiones   " + clavebuscada  + "  " + proceso);
	proceso= proceso +1
		//var clavebuscada= document.getElementById("edo_select").innerHTML 
		//var clavebuscada = document.getElementById('TEXTBOX_ID');
		//var n = clavebuscada.value.length
		//if (n===2 && Number(clavebuscada.value) > 0 && Number(clavebuscada.value) < 32  ){
			 n = clavebuscada.length
		if (n===2 && Number(clavebuscada) > 0 && Number(clavebuscada) < 33 ){
			if ( proceso >1 ){map.removeLayer(geojsonext);};
			geojsonext =L.geoJson(regiones, {

			        style: function (feature) {
				            return { 
				            	color: "black",
				            	fillColor: 'pink',//getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors),
				            	weight: 1,
				            	fill: true,
				            	opacity: 0,
				            	fillOpacity: 1,
				            	clickable: true 
				            };
			        },
			        onEachFeature: function(feature, layer) {
			        regiones.push({
			            name: layer.feature.properties.REGION,
			            source: "regiones",
			            id: L.stamp(layer),
			            bounds: layer.getBounds()
			        });
			    },
			        onEachFeature: function (feature, layer) {
			            layer.bindPopup(feature.properties.REGION + '  ' +
			            	feature.properties.CVE_REG
			            	);
			    },
				    onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: highlightFeatureR,
				        mouseout: resetHighlightBR,
				        //click: zoomToFeatureR
				        click: 	function (layer){
				        	var layerM = layer.target
							var	clave =  layerM.feature.properties.ENTREG
							var	regsel =  layerM.feature.properties.REGION
							document.getElementById("edo_select").innerHTML = regsel;
							document.getElementById("sele_plot").innerHTML = clave;
							//dibujaplots();
							document.getElementById("mpo_select").innerHTML = "";
							document.getElementById("fake").click();
							console.log("llamando vistampo desde mapa	" + clave);
							//un_selected(mapselected);
							mapselected = clave;
							//do_selected(mapselected);

							vistampo(clave)
						}
				    });
				},
				
				    filter: function(feature, layer) {
				        if (feature.properties.CVE_ENT === clavebuscada) {
				        	console.log( "Ya lo encontre el submapa del estado " + clavebuscada);

				        	return true;
				        };
				    }
			}).addTo(map);
			map.fitBounds(geojsonext.getBounds());
		};
};


/// despliega los municipios de una region
function vistampo(clavebuscada){
	console.log(" estoy buscando los Municipios " + clavebuscada  + "  " + proceso2);
	proceso2= proceso2 +1
		//var clavebuscada= document.getElementById("edo_select").innerHTML 
		//var clavebuscada = document.getElementById('TEXTBOX_ID');
		//var n = clavebuscada.value.length
		//if (n===2 && Number(clavebuscada.value) > 0 && Number(clavebuscada.value) < 32  ){
			 n = clavebuscada.length
		if (n===4 && Number(clavebuscada) > 99 && Number(clavebuscada) < 3208 ){
			if ( proceso2 >1 ){map.removeLayer(geojsonext2);};
			geojsonext2 =L.geoJson(municipios, {

			        style: function (feature) {
			            return { 
			            	color: "black",
			            	fillColor: 'red',
			            	weight: 2,
			            	fill: true,
			            	opacity: 1,
			            	fillOpacity: 1,
			            	clickable: true };
			        },
			        onEachFeature: function(feature, layer) {
			        municipios.push({
			            name: layer.feature.properties.NOM_MUN,
			            source: "municipios",
			            id: L.stamp(layer),
			            bounds: layer.getBounds()
			        });
			    },
			        onEachFeature: function (feature, layer) {
			            layer.bindPopup(feature.properties.NOM_MUN + '  ' +
			            	feature.properties.CVE_MUN
			            	);
			    },
				    onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: highlightFeatureM,
				        mouseout: resetHighlightBM,
				        click: zoomToFeatureM
				    });
				},
				
				    filter: function(feature, layer) {
				        if (feature.properties.EDOREG === clavebuscada) {
				        	console.log( "Ya lo encontre el submapa de " + clavebuscada);
				        	return true;
				        };
				    }
			}).addTo(map);
			map.fitBounds(geojsonext2.getBounds());
		};
};


function vistampo_i(clavebuscada){
	console.log(" estoy buscando los Municipios " + clavebuscada  + "  " + proceso3);
	proceso3= proceso3 +1
		//var clavebuscada= document.getElementById("edo_select").innerHTML 
		//var clavebuscada = document.getElementById('TEXTBOX_ID');
		//var n = clavebuscada.value.length
		//if (n===2 && Number(clavebuscada.value) > 0 && Number(clavebuscada.value) < 32  ){
			 n = clavebuscada.length
		if (n===5 && Number(clavebuscada) > 99 && Number(clavebuscada) < 32008 ){

			if ( proceso3 >1 ){map.removeLayer(geojsonext3);};

			geojsonext3 =L.geoJson(municipios, {

			        style: function (feature) {
			            return { 
			            	color: "black",
			            	fillColor: "gray",
			            	weight: 1,
			            	opacity: 1,
			            	fillOpacity: 0,
			            	clickable: true };
			        },
			        onEachFeature: function(feature, layer) {
			        municipios.push({
			            name: layer.feature.properties.NOM_MUN,
			            source: "municipios",
			            id: L.stamp(layer),
			            bounds: layer.getBounds()
			        });
			    },
			        onEachFeature: function (feature, layer) {
			            layer.bindPopup(feature.properties.NOM_MUN + '  ' +
			            	feature.properties.CVE_MUN
			            	);
			    },
				    onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: highlightFeatureM,
				        mouseout: resetHighlightBM,
				        click: zoomToFeatureM
				    });
				},
				
				    filter: function(feature, layer) {
				        if (feature.properties.EDOMUN === clavebuscada) {
				        	console.log( "Ya lo encontre el submapa de " + clavebuscada);
				        	return true;
				        };
				    }
			}).addTo(map);
			map.fitBounds(geojsonext3.getBounds());


			map.removeLayer(geojsonmunicipio)
			map.removeLayer(geojsonext)
			map.removeLayer(geojsonext2)
			//map.removeLayer(geojsonext3)
			map.removeLayer(geojsonstate)

			var orl= L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
			maxZoom: 20,
				attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});

			var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
			var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});
			map.addLayer(orl);
			L.control.zoom().addTo(map)



		};
};




var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to 
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};
var yourCodeToBeCalled = function(){
	console.log ("funcion al cargar")

			geojsonext3 =L.geoJson(xalto, {

			        style: function (feature) {
			            return { 
			            	color: "black",
			            	fillColor: "#04B45F",
			            	weight: 1,
			            	fill: true,
			            	opacity: 0.9,
			            	fillOpacity: 0.9,
			            	clickable: true };
			        },
			        onEachFeature: function(feature, layer) {
			        xalto.push({
			            name: layer.feature.properties.NOM_MUN,
			            source: "municipios",
			            id: L.stamp(layer),
			            bounds: layer.getBounds()
			        });
			    },
			        onEachFeature: function (feature, layer) {
			            layer.bindPopup(feature.properties.NOM_MUN + '  ' +
			            	feature.properties.CVE_MUN
			            	);
			    },
				    onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: highlightFeat,
				        mouseout: resetHighlig,
				        click: zoomToFeatureM
				    });
				}
		   
			}).addTo(map);
			map.fitBounds(geojsonext3.getBounds());

};


var  codigoextrajs = 	function(){
	loadJS('leaflet/puntosxal.js', yourCodeToBeCalledrtr, document.body);
};





$(document).ready(function(){
	// carga de los plots de las diversas ventanas
	$("#lbl_nivel1").text("NACIONAL");
	$("#lbl_nivel2").text("");
	$("#lbl_nivel3").text("");
	var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8),getCol(imunac_estados, 9),getCol(imunac_estados, 10),getCol(imunac_estados, 11),getCol(imunac_estados, 12),getCol(imunac_estados, 13),getCol(imunac_estados, 14),getCol(imunac_estados, 15)]);
	datosactivos = datostbl
	genera_plots(datosactivos,'#PlotGrupos');

	carga_tablaescala(1);

  });

jQuery(document).ready(function(){
		$('input:radio[name="postage"]').change(function(){

		    valorT= $(this).val();

		 	if (valorT=='Tedo'){
		 		var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8),getCol(imunac_estados, 9),getCol(imunac_estados, 10),getCol(imunac_estados, 11),getCol(imunac_estados, 12),getCol(imunac_estados, 13),getCol(imunac_estados, 14),getCol(imunac_estados, 15)]);
		 	};
		 	if (valorT=='Treg'){
		 		datostbl = transpose([getCol(imunac_regiones, 1),getCol(imunac_regiones, 2),getCol(imunac_regiones, 3),getCol(imunac_regiones, 4),getCol(imunac_regiones, 5),getCol(imunac_regiones, 6),getCol(imunac_regiones, 7),getCol(imunac_regiones, 8),getCol(imunac_regiones, 9),getCol(imunac_regiones, 10),getCol(imunac_regiones, 11),getCol(imunac_regiones, 12),getCol(imunac_regiones, 13),getCol(imunac_regiones, 14),getCol(imunac_regiones, 15)]);
		 	};
		 	if (valorT=='Tmun'){
		 		datostbl = transpose([getCol(imunac_municipios, 1),getCol(imunac_municipios, 2),getCol(imunac_municipios, 3),getCol(imunac_municipios, 4),getCol(imunac_municipios, 5),getCol(imunac_municipios, 6),getCol(imunac_municipios, 7),getCol(imunac_municipios, 8),getCol(imunac_municipios, 9),getCol(imunac_municipios, 10),getCol(imunac_municipios, 11),getCol(imunac_municipios, 12),getCol(imunac_municipios, 13),getCol(imunac_municipios, 14),getCol(imunac_municipios, 15)]);
		 	};

		  if (valorT!='nada'){
			var table = $('#rec_tablashp').DataTable();
			table.destroy();
			var table2 = $('#rec_tablaescala2').DataTable();
            table2.destroy();

			carga_tablaescala2(valorT)

		   $('#rec_tablashp').DataTable( {
		   	// configuracion de mensajes en español
		   	language: {
			   	sProcessing:     "Procesando...",
			    sLengthMenu:     "Mostrar _MENU_ registros",
			    sZeroRecords:    "No se encontraron resultados",
			    sEmptyTable:     "Ningún dato disponible en esta tabla",
			    sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
			    sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
		   		sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
		   		// se añade codificacion para mostrar una lupa de busqueda
		   		search:          "Búsqueda por " + leyenda.toLowerCase() + " : <span class='glyphicon glyphicon-search'></span>",
		   		LoadingRecords:  "Cargando...",
		   		sPaginate: {
			        First:    "Primero",
			        Last:     "Último",
			        Next:     "Siguiente",
			        Previous: "Anterior"
			    },
		   	},
		     
		      data: datostbl,

		        //"scrollY":        "300px",
		        "sScrollY": ($(window).height() + 250),
		        "scrollCollapse": true,
		        "paging":         false,
		        "pageLength": 300,
		      columns: [ // definicion de los titulos de los encabezados
		          { width: 10,title: "CLAVE"},
		          { width: 20,title: leyenda},
		          { width: 10,title: "ID"},
		          { width: 10,title: "IMUNAC"},
		          { width: 10,title: "SERVICIOS BÁSICOS"},
		          { width: 10,title: "ENTORNO URBANO"},
		          { width: 10,title: "CONECTIVIDAD"},
		          { width: 10, title: "DESTINOS"},
		          { width: 10, title: "POBLACIÓN"}
		          ],
		       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
				    "targets": [3,4,5,6,7],
				    "createdCell": function (td, cellData, rowData, row, col) {
				    	colref=col-3;
				    	if (valorT=='Tedo'){
				    		$(td).css('background-color', getColor2(cellData,breaks_5e[colref],colors_5[colref])[0]);
				    	};
				        if (valorT=='Treg'){
				    		$(td).css('background-color', getColor2(cellData,breaks_5r[colref],colors_5[colref])[0]);
				    	};
				        if (valorT=='Tmun'){
				    		$(td).css('background-color', getColor2(cellData,breaks_5[colref],colors_5[colref])[0]);
				    	};

				    }
				  },
				  { //  agragamos la clase gris que en css se define el color de fondo en gris
				  	"sClass": "gris", 
				    "aTargets": [ 0,1,8 ] 
				  }
				   ]
		  } );
		};

		});
});


function generalinks(leyenda,datos){
	var links = "<span class= 'txt_12em'>"+leyenda+":</span><span> &emsp; -";
	for(var i=0; i<datos.length; i++){
		links = links + '<a href="javascript:PrepreparaEstado('+ "'" + datos[i][1] +  "'" + ')">'+datos[i][2]+'</a>- &emsp;'
	};
	links = links + "</span> ";
	return links;
};

function PrepreparaEstado(clave){
	mapRegionEDO._onResize();
	toggleMNU('Edo');
	preparaEstado(clave);
	window.open('idxEDO.html?clave='+clave,'_self');
};

function preparaEstado(clave){
	$('#seccionEstados').removeClass('hidden');
	mapRegionEDO.off();
    mapRegionEDO.remove();
	initMapRegionEDO();


	claveEdoAct =clave;
	//inicializando
	$('#EDOseleccionado').empty();
	$('#ImunacSummaryEDO').empty();
	$("#PlotGrupEDO").empty();
	$("#ResPilarEDO").empty();
	$("#ER_sel").empty();
	// carga inicial de datos
	var datEstado  =getRow(imunac_estados,clave,1);
	var abrev=datEstado[0][3];
	var datRegiones=getRow(imunac_regiones,clave,0);
	var datMunicipios=getRow(imunac_municipios,abrev,58);

	var txtseledo = 'ENTIDAD: ' + datEstado[0][2];
	$('#EDOseleccionado').append(txtseledo);
	$('#me_sel').text(txtseledo);	
	var resuEDO = '<div> <span> IMUNAC ' + datEstado[0][4]  + '</span>' ;
	$('#ImunacSummaryEDO').append(resuEDO);
    res_imunac(datMunicipios,'#ImunacSummaryEDO');

	
  	var dataplot = [['Muy Bajo',datEstado[0][11]],['Bajo',datEstado[0][12]],['Medio',datEstado[0][13]],['Alto',datEstado[0][14]],['Muy alto',datEstado[0][15]]];
  	var identplot = 'grafico_AE_' + datEstado[0][1];
  	var objetocadena = "<div id='"+ identplot +"' class= 'barplotareaEDO'> </div>" 
    $("#PlotGrupEDO").append(objetocadena);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    var colores = ['#bfb1d5','#f0e0a2','#abe1fd','#adddcf','#ffddcf'];
    cambiaPlotBar(dataplot, 1,colores,"IMUNAC - " + abrev,identplot,'uno');

  	var pilaplot = [['Destinos',datEstado[0][8]],['Conectividad',datEstado[0][7]],['Entorno Urbano',datEstado[0][6]],['Servicios Básicos',datEstado[0][5]],['<b>IMUNAC</b>',datEstado[0][4]]];
  	var identplotP = 'grafico_PI_' + datEstado[0][1];
  	var objetocadenaP = "<div id='"+ identplotP +"' class= 'barplotareaEDO'> </div>" 
  
    $("#ResPilarEDO").append(objetocadenaP);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    var coloresP = [ getColor2(datEstado[0][8],breaks_5e[4],colors_5[4])[0],
				    getColor2(datEstado[0][7],breaks_5e[3],colors_5[3])[0],
				    getColor2(datEstado[0][6],breaks_5e[2],colors_5[2])[0],
				    getColor2(datEstado[0][5],breaks_5e[1],colors_5[1])[0],
				    getColor2(datEstado[0][4],breaks_5e[0],colors_5[0])[0]];

     coloresP = [   getColor2(datEstado[0][8],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][7],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][6],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][5],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][4],breaks_5e[0],colors_5[0])[0]];

    cambiaPlotBar(pilaplot, 1,coloresP,"",identplotP,'pilar');



	var encabezado= [ { title: "CLAVE"},{ title: 'REGION'},{ title: "ID"},{ title: "IMUNAC"},{ title: "SERVICIOS BÁSICOS"},{ title: "ENTORNO URBANO"},{ title: "CONECTIVIDAD"},{ title: "DESTINOS"},{ title: "POBLACIÓN"}];
	var colorcols = [3,4,5,6,7];
	var ocultar = [0,2];
	var table = $("#TabRegionEDO").DataTable();
	table.destroy();	

    var datRegiones2 =transpose([getCol(datRegiones, 1),getCol(datRegiones, 2),getCol(datRegiones, 3),getCol(datRegiones, 4),getCol(datRegiones, 5),getCol(datRegiones, 6),getCol(datRegiones, 7),getCol(datRegiones, 8),getCol(datRegiones, 9),getCol(datRegiones, 10),getCol(datRegiones, 11),getCol(datRegiones, 12),getCol(datRegiones, 13),getCol(datRegiones, 14)]);
	
	GeneraTabla(datRegiones2,encabezado,'#TabRegionEDO',colorcols,breaks_5r,colors_5,true,true,ocultar, false)
    

        $('#TabRegionEDO tbody').on( 'mouseenter', 'td', function () {
        	
    	    var table = $('#TabRegionEDO').DataTable();
            var clave_clk =  table.row( this ).data()[0];
            console.log(clave_clk + '    ' + nivelActual);
            var rowIdx = table.cell(this).index().row;
            $( table.row( rowIdx ).nodes() ).addClass( 'boldROW' );
            ajusta01layer('geojsonRegEdo',"'coral'",1,0.7, "ENTREG=='"+ clave_clk +"'" );
    	});

        $('#TabRegionEDO tbody').on( 'mouseleave', 'td', function () {
    	    var table2 = $('#TabRegionEDO').DataTable();
            var clave_clk2 =  table2.row( this ).data()[0];
            var rowIdx2 = table2.cell(this).index().row;
            $( table2.row( rowIdx2 ).nodes() ).removeClass( 'boldROW' );

            ajusta01layer('geojsonRegEdo',"'pink' ",1,0, "ENTREG=='"+ clave_clk2 +"'" );
    	});


    vistaregRegEdo(clave);
    //aplica un color distinto para el resto
    ajusta01layer('geojsonstateRegEdo',"'#00aaff'",1,0.5,"CVE_ENT!='"+clave+"'");
    ajusta01layer('geojsonstateRegEdo',"'orange'",1,0,"CVE_ENT=='"+clave+"'");
    

    $("#ER_sel").append(muetraEnPlot(datEstado[0][2],datRegiones));


    	var axislab=['Servicios Básicos','Entorno Urbano','Conectividad','Destinos'];
    	var axisXvar=[4,4,4,5,5,6];
    	var axisYvar=[5,6,7,6,7,7];
	   $("#relacionPilaresEDO").empty();
	   for(var i=0; i<6;i++){
	   		var idobj ="relPilEdo" + i ;
	   		
	   	    $("#relacionPilaresEDO").append("<div id='" + idobj +"'class= 'scatterplotareaEDO'> </div>");	
	   	     cambiaPlot2(datRegiones2, axisXvar[i],axisYvar[i],'rgb(12,112,200)',datEstado[0][2],idobj, axislab[axisXvar[i]-4],axislab[axisYvar[i]-4]);	    
	   };
	dibujaplots(clave)

};

function toggleMS(clave,objeto) {

	$("#BtnMR1").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR2").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR3").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR4").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR5").removeClass('btn-outline-warning waves-dark');
	$(objeto).addClass('btn-outline-warning waves-dark');

	if (clave != '00'){
		console.log('estoy en el if')
		var table = $('#rec_tablaMR').DataTable();
	    table.destroy();
	}else{
		clave='01'
	};
	var mesodata = getRow(imunac_mesoregiones,clave,1);
	var nomMR =getCol(mesodata,2);
	var edosMR=getRow(imunac_estados,clave,0);
	var mpo10MR=getRow(imunac_municipios,clave,10);
    var mpo10MR2 =  transpose([getCol(mpo10MR, 1),getCol(mpo10MR, 58),getCol(mpo10MR, 2),getCol(mpo10MR, 4),getCol(mpo10MR, 13),getCol(mpo10MR, 1),getCol(mpo10MR, 3)]);
	var arr = mpo10MR2.sort(function(a,b) {
      return b[3] - a[3];
    });
    datostbl = arr.slice(0, 10)
    datostbl2 = arr.slice(0, 4)
    $("#MR_sel").empty();
    $("#MR_sel").append(generalinks(nomMR,edosMR));
	

	
    $("#recMRDatos").empty();
    var cedenaPil = '<div class="centerdiv"><table > '
    cedenaPil =  cedenaPil + '<tr class="txt_12em"> <td class="tds1">IMUNAC</td><td class="tds2">' + Number(mesodata[0][4]).toFixed(1)  + ' </td>'
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Servicios básicos </td><td class="tds2">' + Number(mesodata[0][5]).toFixed(1) + ' </td>'
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Entorno urbano</td><td class="tds2">' + Number(mesodata[0][6]).toFixed(1)+ ' </td>'
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Conectividad</td><td class="tds2">' + Number(mesodata[0][7]).toFixed(1) + ' </td>' 
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Destinos</td><td class="tds2">' + Number(mesodata[0][8]).toFixed(1) + ' </td></table><div>'
    $("#recMRDatos").append(cedenaPil);
    $("#rec_tablaMR").empty();
    var encabezado = [ { width: 0,title: ""},{ width: 3,title: ""},{ width: 30,title: ""},{ width: 3,title: "IMUNAC"}];
    var colorcols =[0];
    var ocultar =[0];
    var datostbl2 = transpose([getCol(datostbl,0),getCol(datostbl,1),getCol(datostbl,2),getCol(datostbl,3)]);
	GeneraTabla(datostbl2,encabezado,'#rec_tablaMR',colorcols,breaks_5,colors_5,false,false,ocultar,true);

	ajusta01layer('geojsonMR',"'orange' ",0.3,0.3, "MESOREGI_1!="+ clave +"" );
	ajusta01layer('geojsonMR',"'orange' ",1,0, "MESOREGI_1=="+ clave +"" );


        $('#rec_tablaMR tbody').on( 'mouseenter', 'td', function () {
    	    var table = $('#rec_tablaMR').DataTable();
            var clave_clk =  table.row( this ).data()[0];
			var rowIdx = table.cell(this).index().row;
            $( table.row( rowIdx ).nodes() ).addClass( 'boldROW' );
            ajusta01layer('geojsonmunicipioMR2',"'#ff0000'",0.7,1,"EDOMUN==='"+clave_clk+"'");
    	});

        $('#rec_tablaMR tbody').on( 'mouseleave', 'td', function () {
    	    var table2 = $('#rec_tablaMR').DataTable();
            var clave_clk2 =  table2.row( this ).data()[0];
            var rowIdx2 = table2.cell(this).index().row;
            $( table2.row( rowIdx2 ).nodes() ).removeClass( 'boldROW' );
            ajusta01layer('geojsonmunicipioMR2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOMUN=='"+clave_clk2+"'");
    	});

vistaregMR(clave)

};

	
function toggle5(objetoplot, lbl_btnpress,btnpress) {
		var lstobj =['#PlotGrupos','#PlotServiciosBasicos','#PlotEntornoUrbano','#PlotConectividad','#PlotDestinos'];
		var lstobj2 =['#BtnGrupos','#BtnServiciosBasicos','#BtnEntornoUrbano','#BtnConectividad','#BtnDestinos'];
		for(var i=0; i<lstobj.length; i++){
			$(lstobj[i]).fadeOut();
			$(lstobj2[i]).removeClass('btn-outline-warning waves-dark');
		};
			$(objetoplot).fadeIn();
			$(lbl_botonseleccionado).text(lbl_btnpress);
			$(btnpress).addClass('btn-outline-warning waves-dark');
			genera_plots(datosactivos,objetoplot)

};


function togglemap(breaks,colors, lbl_btnpress,btnpress,col) {
		var lstobj2 =['#MBtnIMUNAC','#MBtnServiciosBasicos','#MBtnEntornoUrbano','#MBtnConectividad','#MBtnDestinos'];
		for(var i=0; i<lstobj2.length; i++){
			$(lstobj2[i]).removeClass('btn-outline-warning waves-dark');
		};
			$(lbl_Mbotonseleccionado).text(lbl_btnpress);
			$(btnpress).addClass('btn-outline-warning waves-dark');
			var tonalidades ="["+colors.map(function(a){return "'"+a+"'";})+"]";
            ajusta01layer('geojsonmunicipioM2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,'+col+'),['+breaks+'],'+tonalidades+')[0]',0,1,"EDOREG!='0000'");

	        var table = $('#rec_tablaescala').DataTable();
            table.destroy();

			carga_tablaescala(col-3)
};


/*  
 ▄▄▄▄▄▄    ▄▄▄▄                          ▄▄▄▄               
 ██▀▀▀▀█▄  ▀▀██                  ██      ▀▀██               
 ██    ██    ██       ▄████▄   ███████     ██      ▀██  ███ 
 ██████▀     ██      ██▀  ▀██    ██        ██       ██▄ ██  
 ██          ██      ██    ██    ██        ██        ████▀  
 ██          ██▄▄▄   ▀██▄▄██▀    ██▄▄▄     ██▄▄▄      ███   
 ▀▀           ▀▀▀▀     ▀▀▀▀       ▀▀▀▀      ▀▀▀▀      ██    
                                                    ███     

*/


function genera_plots_Grupos(datostbl){
	if (nivelActual != 'Municipal') {
	    $("#PlotGrupos").empty();
	    for(var i=0; i<datostbl.length; i++){
	      	var dataplot = [['Muy </br> Bajo',datostbl[i][10]],['Bajo',datostbl[i][11]],['Medio',datostbl[i][12]],['Alto',datostbl[i][13]],['Muy <br> alto',datostbl[i][14]]];
	      	var identplot = 'grafico_A_' + datostbl[i][0];
	      	var objetocadena = "<div id='"+ identplot +"' class= 'barplotarea'> </div>" 
	        $("#PlotGrupos").append(objetocadena);
	        //cambiaPlot(matrix, col,tonos, titulo,elemento)
	        var colores = ['#bfb1d5','#f0e0a2','#abe1fd','#adddcf','#ffddcf'];
	        cambiaPlotBar(dataplot, 1,colores,datostbl[i][1],identplot,'gpo');
	    };
	};
	//$("#PlotGrupos").fadeOut();

};

function genera_plots_ServiciosBasicos(datostbl){
	    $("#PlotServiciosBasicos").empty();
        $("#PlotServiciosBasicos").append("<div id='PSB_EU' class= 'scatterplotarea'> </div>");
        $("#PlotServiciosBasicos").append("<div id='PSB_C' class= 'scatterplotarea'> </div>");
        $("#PlotServiciosBasicos").append("<div id='PSB_D' class= 'scatterplotarea'> </div>");
        cambiaPlot2(datostbl, 7,4,'rgb(12,112,200)',nivelActual,'PSB_D', 'Destinos', 'Servicios Básicos');
        cambiaPlot2(datostbl, 5,4,'rgb(12,112,200)',nivelActual,'PSB_EU','Entorno Urbano', 'Servicios Básicos');
        cambiaPlot2(datostbl, 6,4,'rgb(12,112,200)',nivelActual,'PSB_C', 'Conectividad', 'Servicios Básicos');
        //$("#PlotServiciosBasicos").fadeOut();


	
};
function genera_plots_EntornoUrbano(datostbl){
	   $("#PlotEntornoUrbano").empty();
        $("#PlotEntornoUrbano").append("<div id='PEU_SB' class= 'scatterplotarea'> </div>");
        $("#PlotEntornoUrbano").append("<div id='PEU_C' class= 'scatterplotarea'> </div>");
        $("#PlotEntornoUrbano").append("<div id='PEU_DE' class= 'scatterlotarea'> </div>");
        cambiaPlot2(datostbl, 7,5,'rgb(12,112,200)',nivelActual,'PEU_DE', 'Destinos','Entorno Urbano');	
        cambiaPlot2(datostbl, 4,5,'rgb(12,112,200)',nivelActual,'PEU_SB', 'Servicios Básicos','Entorno Urbano');
        cambiaPlot2(datostbl, 6,5,'rgb(12,112,200)',nivelActual,'PEU_C', 'Conectividad','Entorno Urbano');
         //$("#PlotEntornoUrbano").fadeOut();
};
function genera_plots_Conectividad(datostbl){
	    $("#PlotConectividad").empty();
        $("#PlotConectividad").append("<div id='PC_SB' class= 'scatterplotarea'> </div>");
        $("#PlotConectividad").append("<div id='PC_EU' class= 'scatterplotarea'> </div>");
        $("#PlotConectividad").append("<div id='PC_D' class= 'scatterplotarea'> </div>");
        cambiaPlot2(datostbl, 7,6,'rgb(12,112,200)',nivelActual,'PC_D', 'Destinos','Conectividad');
        cambiaPlot2(datostbl, 4,6,'rgb(12,112,200)',nivelActual,'PC_SB', 'Servicios Básicos','Conectividad');
        cambiaPlot2(datostbl, 5,6,'rgb(12,112,200)',nivelActual,'PC_EU', 'Entorno Urbano','Conectividad');
        //$("#PlotConectividad").fadeOut();	
};


function genera_plots_Destinos(datostbl){
	    $("#PlotDestinos").empty();
        $("#PlotDestinos").append("<div id='PD_SB' class= 'scatterplotarea'> </div>");
        $("#PlotDestinos").append("<div id='PD_EU' class= 'scatterplotarea'> </div>");
        $("#PlotDestinos").append("<div id='PD_C' class= 'scatterplotarea'> </div>");
        cambiaPlot2(datostbl, 4,7,'rgb(12,112,200)',nivelActual,'PD_SB', 'Servicios Básicos','Destinos');
        cambiaPlot2(datostbl, 5,7,'rgb(12,112,200)',nivelActual,'PD_EU', 'Entorno Urbano','Destinos');
        cambiaPlot2(datostbl, 6,7,'rgb(12,112,200)',nivelActual,'PD_C', 'Conectividad','Destinos');
        //$("#PlotDestinos").fadeOut();
};



function genera_plots(datostbl,Graficasel){
	
	if(Graficasel=='#PlotGrupos'){
		genera_plots_Grupos(datostbl);
	};
	if(Graficasel=='#PlotServiciosBasicos'){
		genera_plots_ServiciosBasicos(datostbl);
	};
	if(Graficasel=='#PlotEntornoUrbano'){
		genera_plots_EntornoUrbano(datostbl);
	};
	if(Graficasel=='#PlotConectividad'){
		genera_plots_Conectividad(datostbl);
	};
	if(Graficasel=='#PlotDestinos'){
		genera_plots_Destinos(datostbl);
	};

};


/*
 ▄▄▄▄▄                                   ▄▄▄▄▄▄▄▄            ▄▄        ▄▄▄▄               
 ██▀▀▀██               ██                ▀▀▀██▀▀▀            ██        ▀▀██               
 ██    ██   ▄█████▄  ███████    ▄█████▄     ██      ▄█████▄  ██▄███▄     ██       ▄████▄  
 ██    ██   ▀ ▄▄▄██    ██       ▀ ▄▄▄██     ██      ▀ ▄▄▄██  ██▀  ▀██    ██      ██▄▄▄▄██ 
 ██    ██  ▄██▀▀▀██    ██      ▄██▀▀▀██     ██     ▄██▀▀▀██  ██    ██    ██      ██▀▀▀▀▀▀ 
 ██▄▄▄██   ██▄▄▄███    ██▄▄▄   ██▄▄▄███     ██     ██▄▄▄███  ███▄▄██▀    ██▄▄▄   ▀██▄▄▄▄█ 
 ▀▀▀▀▀      ▀▀▀▀ ▀▀     ▀▀▀▀    ▀▀▀▀ ▀▀     ▀▀      ▀▀▀▀ ▀▀  ▀▀ ▀▀▀       ▀▀▀▀     ▀▀▀▀▀  

*/


function carga_tablaescala2(nivel){
	var datosbase;
  if (nivel == 'Tedo'){
  	datosbase = tablaescala_e;
  };
  if (nivel == 'Treg'){
  	datosbase = tablaescala_r;
  };
  if (nivel == 'Tmun'){
  	datosbase = tablaescala_m;
  };



  var datostbl =  transpose([getCol(datosbase,0),getCol(datosbase,1),getCol(datosbase,2),getCol(datosbase,3),getCol(datosbase,4),getCol(datosbase,5)]);
  var mediciones = ['NIVEL',"IMUNAC","SERVICIOS BÁSICOS","ENTORNO URBANO","CONECTIVIDAD","DESTINOS"];
 
  //var nuevosdatos = transpose(datosTbl);

   $('#rec_tablaescala2').DataTable( {
   	// configuracion de mensajes en español
   	language: {
	   	sProcessing:     "Procesando...",
	    sLengthMenu:     "Mostrar _MENU_ registros",
	    sZeroRecords:    "No se encontraron resultados",
	    sEmptyTable:     "",
	    sInfoEmpty:      "",
	    sInfoFiltered:   "",
   		sInfo:           "",
   		// se añade codificacion para mostrar una lupa de busqueda
   		//search:          "Búsqueda por " + leyenda.toLowerCase() + " : <span class='glyphicon glyphicon-search'></span>",
   		LoadingRecords:  "Cargando...",
   		sPaginate: {
	        First:    "Primero",
	        Last:     "Último",
	        Next:     "Siguiente",
	        Previous: "Anterior"
	    },
   	},
     
      data: datostbl,

        //"scrollY":        "300px",
        "sScrollY": ($(window).height() + 250),
        "scrollCollapse": true,
        "paging":         false,
        "pageLength": 300,
         "ordering": false,
         "searching": false,
      columns: [ // definicion de los titulos de los encabezados
          { title: "NIVEL"},
          { title: "IMUNAC"},
          { title: "SERVICIOS BÁSICOS"},
          { title: "ENTORNO URBANO"},
          { title: "CONECTIVIDAD"},
          { title: "DESTINOS"},
          ],
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": [1,2,3,4,5],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	colref=col-1;
		    	$(td).css('background-color', colors_5[colref][row]);
		    	if (row <2 ){
		    		$(td).css('color', "white");
		    	};
		    }
		  },
		  { //  agragamos la clase gris que en css se define el color de fondo en gris
		  	"sClass": "gris", 
		    "aTargets": [ 0] 
		  }
		   ]

          
  } );

};

function carga_tablaescala(columna){
  var datostbl =  transpose([getCol(tablaescala_m,0),getCol(tablaescala_m,columna)]);//transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8),getCol(imunac_estados, 9)]);
  var mediciones = ['NIVEL',"IMUNAC","SERVICIOS BÁSICOS","ENTORNO URBANO","CONECTIVIDAD","DESTINOS"];
  medicion=mediciones[columna];
  //var nuevosdatos = transpose(datosTbl);

   $('#rec_tablaescala').DataTable( {
   	// configuracion de mensajes en español
   	language: {
	   	sProcessing:     "Procesando...",
	    sLengthMenu:     "Mostrar _MENU_ registros",
	    sZeroRecords:    "No se encontraron resultados",
	    sEmptyTable:     "",
	    sInfoEmpty:      "",
	    sInfoFiltered:   "",
   		sInfo:           "",
   		// se añade codificacion para mostrar una lupa de busqueda
   		//search:          "Búsqueda por " + leyenda.toLowerCase() + " : <span class='glyphicon glyphicon-search'></span>",
   		LoadingRecords:  "Cargando...",
   		sPaginate: {
	        First:    "Primero",
	        Last:     "Último",
	        Next:     "Siguiente",
	        Previous: "Anterior"
	    },
   	},
     
      data: datostbl,

        //"scrollY":        "300px",
        "sScrollY": ($(window).height() + 250),
        "scrollCollapse": true,
        "paging":         false,
        "pageLength": 300,
         "ordering": false,
         "searching": false,
      columns: [ // definicion de los titulos de los encabezados
          { title: "NIVEL"},
          { title: medicion}
          ],
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": [1],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	colref=columna-1;
		    	$(td).css('background-color', colors_5[colref][row]);
		    	if (row <2 ){
		    		$(td).css('color', "white");
		    	};
		    }
		  },
		  { //  agragamos la clase gris que en css se define el color de fondo en gris
		  	"sClass": "gris", 
		    "aTargets": [ 0] 
		  }
		   ]

          
  } );
};

 


$(document).ready(function() {
    //var table = $('#rec_tablashp').DataTable();
    $('#rec_tablashp tbody').on( 'mouseenter', 'td', function () {
    	    var table = $('#rec_tablashp').DataTable();
            var clave_clk =  table.row( this ).data()[0];
            console.log(clave_clk + '    ' + nivelActual)
            if (nivelActual=='Nacional'){
		        ajusta01layer('geojsonstate',"'coral'",1,0.7,"CVE_ENT=='"+ clave_clk+ "'");	
	        };
	        if (nivelActual=='Regional'){
		        ajusta01layer('geojsonext',"'coral'",1,0.7,"ENTREG=='"+ clave_clk+ "'");	
	        };
	        if (nivelActual=='Municipal'){
	        	ajusta01layer('geojsonext2',"'coral'",1,0.7,"EDOMUN=='"+ clave_clk+ "'");	
            };

        } );


    $('#rec_tablashp tbody').on( 'mouseleave', 'td', function () {
    	    var table = $('#rec_tablashp').DataTable();
            var clave_clk2 =  table.row( this ).data()[0];
            if (nivelActual=='Nacional'){
            	ajusta01layer('geojsonstate',"'lightblue'",1,0,"CVE_ENT=='"+ clave_clk2+ "'");
	         };
            if (nivelActual=='Regional'){
            	ajusta01layer('geojsonext',"getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors)[0]",1,1,"ENTREG=='"+ clave_clk2+ "'");
	         };
            if (nivelActual=='Municipal'){
            	ajusta01layer('geojsonext2',"getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]",1,1,"EDOMUN=='"+ clave_clk2+ "'");
	         };
        } );

    $('#rec_tablashp tbody').on( 'click', 'tr', function () {
    	var table = $('#rec_tablashp').DataTable();
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var grafedo=table.row( this ).data()[1]

            var clave_clk =  table.row( this ).data()[0] 
            console.log('el renglon tiene la clave ' + clave_clk)
            $('#edo_select2').text( grafedo  );
            $('#sele_plot').text( grafedo  );
           // dibujaplots();
            map2tbl(clave_clk,'#rec_tablashp')
            if (nivelActual =='Nacional')  {
            	vistareg(clave_clk);
            }else{
            	if (nivelActual =='Regional')  {
            		vistampo(clave_clk);	
            	}else{

            	if (nivelActual =='Municipal')  {
            		vistampo_i(clave_clk)	
            	}
            	
            };
            	
            };
            cargatabla(clave_clk,'Regional',grafedo)
        }
    } );
} );


function buscavalor(registro,columna,valorbuscado) {
    return registro[columna] >= valorbuscado;
}


function cargatabla(clave_fk,nivel,grafedo) {
	//oculta la seccion de detalle siempre
	$("#detalleMpo").fadeOut();
	//rec_tablatotales
	//reset seccion de botones
	toggle5('showHideDiv', '','btnpress')
	//destruye el contenido de la tabla actual
	var table = $('#rec_tablashp').DataTable();
	table.destroy();
	var table2 = $('#rec_tablaescala2').DataTable();
	table2.destroy();
	var table3 = $('#rec_tablatotales').DataTable();
	
	if (clave_fk == '00' && nivelActual == 'Nacional' ){
		var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8),getCol(imunac_estados, 9),getCol(imunac_estados, 10),getCol(imunac_estados, 11),getCol(imunac_estados, 12),getCol(imunac_estados, 13),getCol(imunac_estados, 14)]);
  		var leyenda= "ESTADO"
  		$("#lbl_nivel1").text("NACIONAL ");
  		$("#lbl_nivel2").text("");
  		$("#lbl_nivel3").text("");
  		carga_tablaescala2('Tedo');
	};
	if (clave_fk != '00' && nivelActual == 'Nacional' ){
		unestado = getRow(imunac_estados,clave_fk,1);
		table3.row.add( [
            unestado[0][2],unestado[0][2],unestado[0][4],unestado[0][4],unestado[0][5],
            unestado[0][6],unestado[0][7],unestado[0][8],unestado[0][9],unestado[0][10]
        ] ).draw( false );
		//identificamos los renglones de las regiones que corresponden al estado seleccionado
		var datosreg=getRow(imunac_regiones,clave_fk,0);
		var datostbl =  transpose([getCol(datosreg, 1),getCol(datosreg, 2),getCol(datosreg, 3),getCol(datosreg, 4),getCol(datosreg, 5),getCol(datosreg, 6),getCol(datosreg, 7),getCol(datosreg, 8),getCol(datosreg, 9),getCol(datosreg, 10),getCol(datosreg, 11),getCol(datosreg, 12),getCol(datosreg, 13),getCol(datosreg, 14)]);
  		var leyenda= "REGIÓN"
  		nivelActual = 'Regional';
  		$("#lbl_nivel1").text("ESTADO: " + clave_fk + " - "+ grafedo);
  		$("#lbl_nivel2").text("");
  		$("#lbl_nivel3").text("");
  		carga_tablaescala2('Treg');
        $("#sele_overshp").text("Estado: " + grafedo);

	};

	if(clave_fk.length == 4 && nivelActual == 'Regional'){
		unregion = getRow(imunac_regiones,clave_fk,1);
		table3.row.add( [
            unregion[0][2],unregion[0][2],unregion[0][4],unregion[0][4],unregion[0][5],
            unregion[0][6],unregion[0][7],unregion[0][8],unregion[0][9],unregion[0][10]
        ] ).draw( false );

		//falta integar los casos donde no existen regiones
	  	var datosmun=getRow(imunac_municipios,clave_fk,0);
	  	var datostbl =  transpose([getCol(datosmun, 1),getCol(datosmun, 2),getCol(datosmun, 3),getCol(datosmun, 4),getCol(datosmun, 5),getCol(datosmun, 6),getCol(datosmun, 7),getCol(datosmun, 8),getCol(datosmun, 9)]);
	  	var leyenda = "MUNICIPIO"
	  	nivelActual = 'Municipal';
	  	var palabra = "REGIÓN: "
	  	if (clave_fk==20){palabra="REGIÓN-DISTRITO: "}
	  	$("#lbl_nivel2").text(palabra + clave_fk + " - "+ grafedo);
	  	$("#lbl_nivel3").text("");
	  	$("#sele_overshp").text(palabra + grafedo);
	  	carga_tablaescala2('Tmun')
	};


	if(clave_fk.length == 5 && nivelActual == 'Municipal'){
			//falta integar los casos donde no existen regiones
		  	var datosmun=getRow(imunac_municipios,clave_fk,1);
		  	datosmun1k=datosmun;
		  	var datostbl =  transpose([getCol(datosmun, 1),getCol(datosmun, 2),getCol(datosmun, 3),getCol(datosmun, 4),getCol(datosmun, 5),getCol(datosmun, 6),getCol(datosmun, 7),getCol(datosmun, 8),getCol(datosmun, 9)]);
		  	$("#sqr01mun").text('IMUNAC '+ datosmun[0][4])
		  	$("#sqr02mun_pob").text('Población: '+ datosmun[0][9])
		  	$("#sqr02mun_rr").text('Ranking regional:  '+ datosmun[0][14] + ' municipios ')
		  	$("#sqr02mun_re").text('Ranking estatal:  '+ datosmun[0][13] + ' municipios ')
		  	$("#sqr02mun_rn").text('Ranking nacional:  '+ datosmun[0][12] + ' municipios ')
		  	$("#sqr02mun_cla").text('Clasificación:  '+ datosmun[0][11] )
		  	var leyenda = "MUNICIPIO"
		  	nivelActual = 'Municipio';
		  	var palabra = "MUNICIPIO: "
		  	$("#lbl_nivel3").text(palabra + clave_fk + " - "+ grafedo);
		  	$("#sele_overshp").text(palabra + grafedo);
		  	console.log(datostbl)
		  	carga_tablaescala2('Tmun')
		};

	datosactivos = datostbl	
	texto = 'hola'
 	if (clave_fk.length == 5 && nivelActual == 'Municipio') {
 		$("#detalleMpo").fadeIn();
 		$("#seccionBotones").fadeOut();
 		$("#tbl_esc2").fadeOut();
 		$("#maintable").fadeOut();
 		tbl_esc2
 		$("#ResPilar").empty();
 		//genera_plotsMPO(datostbl);

 		var solidos = [Number(datosmun1k[0][4]),Number(datosmun1k[0][5]),Number(datosmun1k[0][6]),Number(datosmun1k[0][7]),Number(datosmun1k[0][8])];
 		var leyendasR = ['&emsp; &emsp; <b>IMUNAC</b>','&emsp;&emsp;&emsp;SERVICIOS BÁSICOS','&emsp;&emsp;&emsp;ENTORNO URBANO','&emsp;&emsp;&emsp;CONECTIVIDAD','&emsp;&emsp;&emsp;DESTINOS'];
 		var transparencia = [(100 - Number(datosmun1k[0][4])),(100 - Number(datosmun1k[0][5])),(100 - Number(datosmun1k[0][6])),(100 - datosmun1k[0][7]),(100 - Number(datosmun1k[0][8]))];
      	var cedenaPil_lbl0 = '<div class="row tama"> <div class="col-sm-4 col-md-4 col-xs-4 nopad"></div> <div class="col-sm-4 col-md-4 col-xs-4 nopad">0</div><div class="txtder col-sm-4 col-md-4 col-xs-4 nopad">100</div></div>';
      	console.log(leyendasR);
      	console.log(transparencia);
      	console.log(solidos);
 		for(var i=0; i<leyendasR.length; i++){
 			var colores_p=getColor2(solidos[i],breaks_5[i],colors_5[i]);
      		var cadenagrad = 'style="background-image: linear-gradient(-90deg, transparent ' + transparencia[i] +  '%, '+ colores_p[0]+ ' 100%);" "=""'
      		var cedenaPil_lbl  = '<div class="row bordederecho"> <div class="col-sm-4 col-md-4 col-xs-4 nopad"><div class = "gris ads ">' + leyendasR[i] +  ' </div> </div>';
      		var cedenaPil_data = '<div class="col-sm-6 col-md-6 col-xs-6 nopad"><div id ="R_' + leyendasR[i] + ' class = "ads" '+ cadenagrad + ' ><span style="padding-left:'+  solidos[i] +'% ;">' + solidos[i] +  '</span> </div> </div> ';
      		var cedenaPil_lbl2 = '<div class="col-sm-2 col-md-2 col-xs-2 nopad"><div class = " ads22">' + colores_p[1] +  ' </div> </div> </div>'; //getGrupo(solidos[i],breaks_5[i])
      		var cedenaPil =cedenaPil_lbl + cedenaPil_data+cedenaPil_lbl2;
       		 $("#ResPilar").append(cedenaPil);
       		 cedenaPil_lbl0= "";
 		};

 		detalle_pilares_bar("#ResIndicIBS",col_SB,'barra','ISB',1);
 		detalle_pilares_bar("#ResIndicIEU",col_EU,'barra','IEU',2);
 		detalle_pilares_bar("#ResIndicIC",col_C,'conec','I_C',3);
 		detalle_pilares_bar("#ResIndicIDacc",col_Dacc,'otro','I_Dacc',4);
 		detalle_pilares_bar("#ResIndicIDdis",col_Ddis,'otro','I_Ddis',4);
 		detalle_pilares_bar("#ResIndicIDden",col_Dden,'otro','I_Dden',4);
 	};


		var encabezado= [ { title: "CLAVE"},{ title: 'ESTADO'},{ title: "ID"},{ title: "IMUNAC"},{ title: "SERVICIOS BÁSICOS"},{ title: "ENTORNO URBANO"},{ title: "CONECTIVIDAD"},{ title: "DESTINOS"},{ title: "POBLACIÓN"}];
		var colorcols = [3,4,5,6,7];
		var ocultar = [0,2];
    	if (nivelActual=='Nacional'){
    		var cortes = breaks_5e;
    		var colores_tab = colors_5;
    	};
        if (nivelActual=='Regional'){
    		var cortes = breaks_5r;
    		var colores_tab = colors_5;
    	};
        if (nivelActual=='Municipal' || nivelActual=='Municipio' ){
    		var cortes = breaks_5r;
    		var colores_tab = colors_5;
    	};


		GeneraTabla(datostbl,encabezado,'#rec_tablashp',colorcols,cortes,colores_tab,true,true,ocultar, false)

   console.log('por aca tenemos nivel :' + nivelActual);
   	if(clave_fk!='00' && nivelActual == 'Nacional' ){
   		//ajusta el nivel cuando se ha seleccionado y ajustado la tabla
		nivelActual = 'Regional';
	}

    if (nivelActual=='Regional'){
			ajusta01layer('geojsonstate',"'#ffebee'",0.7,0.7,"CVE_ENT!='"+ "00" + "'");
			ajusta01layer('geojsonext',"getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors)[0]",1,1,"ENTREG!='"+ "0000" + "'");
     };


    if (nivelActual=='Municipal'){

    		ajusta01layer('geojsonstate',"'#ffebee'",0.7,0.7, "CVE_ENT!='00'" );
    		ajusta01layer('geojsonext',"'#fffde7'",0.7,0.7, "ENT_REG!='0000'");
    		ajusta01layer('geojsonext2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',1,1, "ENT_REG!='0000'");

    };
};







function detalle_pilares_bar(objeto,columnasDet,tipo,idattr,color){
 		$(objeto).empty();

 		//genera_plotsMPO(datostbl);
 		var solidos = columnasDet.map(takeFromMun1);
 		var leyendasR = columnasDet.map(takeFromNombres);
        leyendasR[0]='<b>'+leyendasR[0]+'</b>'
 		var transparencia = solidos.map(translucido);
      	var cedenaPil_lbl0 = '<div class="row tama"> <div class="col-sm-4 col-md-4 col-xs-4 nopad"></div> <div class="col-sm-4 col-md-4 col-xs-4 nopad">0</div><div class="txtder col-sm-4 col-md-4 col-xs-4 nopad">100</div></div>';
      	//console.log(leyendasR);
      	//console.log(transparencia);
      	//console.log(solidos);
 		for(var i=0; i<leyendasR.length; i++){
			var cedenaPil_lbl  = '<div class="row bordederecho2"> <div class="col-sm-5 col-md-5 col-xs-5 nopad"><div class = "gris ads bder">' + leyendasR[i] +  ' </div> </div>';
			var cedenaPil_lbl2 = '<div class="col-sm-3 col-md-3 col-xs-3 nopad"><div class = " ads22"> </div> </div> </div>'; 
			var cedenaPil_data = '<div class="col-sm-4 col-md-4 col-xs-4 nopad"><div id ="R_' + idattr + i + ' ><span style="padding-left:20% ;">' + solidos[i] +  '</span> </div> </div> ';
			var cadenagrad = '';
			if (tipo == 'conec'){ 
			    cedenaPil_lbl  = '<div class="row bordederecho2"> <div class="col-sm-8 col-md-8 col-xs-8 nopad"><div class = "gris ads bder">' + leyendasR[i] +  ' </div> </div>';
			    cedenaPil_lbl2 = ' </div>'; 

			};


			if (tipo == 'barra'){ 
 			    var colores_p=getColor2(solidos[i],breaks_5[color],colors_5[color]);
      		    cadenagrad = 'style="background-image: linear-gradient(-90deg, transparent ' + transparencia[i] +  '%, '+ colores_p[0]+ ' 100%);" "=""'
      			cedenaPil_data = '<div class="col-sm-4 col-md-4 col-xs-4 nopad"><div id ="R_' +  idattr + i +  ' class = "ads" '+ cadenagrad + ' ><span style="padding-left:'+  solidos[i] +'% ;">' + solidos[i] +  '</span> </div> </div> ';
      			cedenaPil_lbl2 = '<div class="col-sm-3 col-md-3 col-xs-3 nopad"><div class = " ads22">' + colores_p[1] +  ' </div> </div> </div>'; 
      		};
      		var cedenaPil =cedenaPil_lbl + cedenaPil_data+cedenaPil_lbl2;
       		 $(objeto).append(cedenaPil);
       		 cedenaPil_lbl0= "";
 		};
};






