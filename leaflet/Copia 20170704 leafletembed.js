///nuevos objetos
var map;
var algo;
var mapselected;
var nivelActual;
// carga la tabla en rec_tabla



function checkTotal_est(clave) {
	function checkClave(unalinea) {
    	return unalinea[1] == clave;
	}
	buscado = imunac_estados.filter(checkClave);
	return buscado[0][4] 
};

// tiene los rangos de verdes que se usan para ilumimar renglones y poligonos del mapa
function getColor(cellData){
		      if ( cellData < 50 ) {
		        colorOut='#e4f1c3';
		      };
		      if ( cellData >= 50 & cellData < 70 ) {
		        colorOut='#bad696';
		      };
		      if ( cellData >=  70 ) {
		        colorOut='#9ebf6d';
		      };
		      return colorOut;
};


$(document).ready(function() {
  var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8)]);
  nivelActual = 'Nacional';
  leyenda = 'ESTADO'
  //var nuevosdatos = transpose(datosTbl);
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
          { title: "CLAVE"},
          { title: leyenda},
          { title: "ID"},
          { title: "IMUNAC"},
          { title: "SERVICIOS BÁSICOS"},
          { title: "ENTORNO URBANO"},
          { title: "DESTINOS"},
          { title: "CONECTIVIDAD"}
          ],
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": [3,4,5,6,7],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	$(td).css('background-color', getColor(cellData))
		    }
		  },
		  { //  agragamos la clase column_color que en css se define el color de fondo en gris
		  	"sClass": "column_color", 
		    "aTargets": [ 0,1 ] 
		  }
		   ]

          
  } );


} );







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
	map.setView(new L.LatLng(22.870697, -101.393824),4.4);
    
    //  al inhibirlo no se carga el mapa
    ///map.addLayer(osm);
	


	// carga los polígonos de las entidades
	var	geojsonstate =L.geoJson(entidades, {
			name:'entidades'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: getColor(checkTotal_est(feature.properties.CVE_ENT)),
	            	weight: 1,
	            	opacity: 1,
	            	fillOpacity: 1,
	            	clickable: true 
	            };
	        },
	        onEachFeature: function(feature, layer) {
	        entidades.push({
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
					// map2tbl(edosel);
					document.getElementById("edo_select").innerHTML = edosel;
					document.getElementById("sele_plot").innerHTML = clave;
					dibujaplots();
					document.getElementById("mpo_select").innerHTML = "";
					document.getElementById("fake").click();
					console.log("llamando vistareg 	" + clave);
					//un_selected(mapselected);
					mapselected = clave;
					//do_selected(mapselected);
					document.getElementById('sele_overshp').innerHTML=edosel
					vistareg(clave)


				}

		    });
		},
		zoomToFeature

	}).addTo(map);



	var	geojson =L.geoJson(municipios, {

	        style: function (feature) {
	            return { 
	            	color: "black",
	            	fillColor: '#dddddd',
	            	weight: 1,
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
		        mouseover: highlightFeatureMunicipio,
		        mouseout: resetHighlightMunicipio,
		        //click: zoomToFeature
		    });
		},
		filter: filtroestados

	}).addTo(map);


	// filtro para indicar si se muesta o no un objeto

	function filtroestados(feature) {
		var clavebuscada = document.getElementById('TEXTBOX_ID');
	  if (feature.properties.CVE_ENT === clavebuscada.value) return true

	//return true
	}

	//resalta el poligono seleccionado
	function highlightFeatureEstado(e) {
	    var layer = e.target;
		    layer.setStyle({
		        color: 'white',
		        weight: 2,
		        fillColor: 'blue',
		        opacity : 1,
		        fillOpacity: 1,
		        clickable: true 
		    });
	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	        layer.bringToFront();
	    }
        var	entsel =  layer.feature.properties.NOM_ENT;
        var	cveedo =  layer.feature.properties.CVE_ENT;
	    document.getElementById("sele_overshp").innerHTML =  "Estado: " + entsel;
	    map2tbl(cveedo);
	        

	    //info.update(layer.feature.properties);
	}

	function highlightFeatureMunicipio(e) {
	    var layer = e.target;
		    layer.setStyle({
		        color: 'black',
		        weight: 2,
		        fillColor: '#FED976',
		        opacity : 1,
		        fillOpacity: 1,
		        clickable: true 
		    });
	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	        layer.bringToFront();
	    }
        var	entsel =  layer.feature.properties.NOM_ENT;
	        document.getElementById("sele_over").innerHTML =  entsel;
	        

	    //info.update(layer.feature.properties);
	}

	// reajusta el poligono (estados)
	function resetHighlightEstado(e) {
		var layer = e.target;

	        layer.setStyle({
	        
		        color: 'white',
		        weight: 2,
		        //fillColor: 'gray',
		        fillColor: getColor(checkTotal_est(layer.feature.properties.CVE_ENT)),
		        opacity: 1,
		        fillOpacity: 1,
		        clickable: true 

	    });
	    document.getElementById("sele_over").innerHTML =  'Selección...';
	    

	        //info.update();

	}

	// reajusta el poligono (municipios)
	function resetHighlightB(e) {
		var layer = e.target;
	        layer.setStyle({
	        weight: 1,
	        color: 'black',
	        fillColor: 'navy',
	        opacity: 1,
	        fillOpacity: 1
	    });
		document.getElementById("sele_over").innerHTML =  'Selección...';
		

	       // info.update();

	}

	// pasa el valor de la cve_ent bajo clic a un input text box 
/*	function loadmpos(e){
		var layer = e.target;
		var	clave = layer.feature.properties.CVE_ENT
		edockl= document.getElementById("TEXTBOX_ID")
		edockl.value = clave;
		console.log("entrada a loadmpos")
		
	}*/


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





var ajaxRequest;
var plotlist;
var plotlayers=[];
var geojsonext;
var geojsonext2;
var geojsonext3;
var edoactual;


var customControl =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map2) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';     
    container.style.backgroundImage = "url(img/refresh.png)";
    container.style.backgroundSize = "25px 25px";
    container.style.width = '30px';
    container.style.height = '30px';

    container.onclick = function(){
      	map2.setView(new L.LatLng(22.870697, -101.393824),4.5);
      	cargatabla('00');

    }

    return container;
  }
});
var proceso;
proceso =0;

var proceso2;
proceso2 =0;

	//resalta el poligono seleccionado
	function highlightFeatureR(e) {
	    var layer = e.target;
		    layer.setStyle({
		        weight: 2,
		        color: 'black',
		        fillColor: '#aa0000',
		        opacity: 1.7,
		        fillOpacity:1,
		        clickable: true 
		    });
	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	        layer.bringToFront();
	    }
	    var	regsel =  layer.feature.properties.ENTREG;
	    var	regnom =  layer.feature.properties.REGION;
	    document.getElementById("sele_overshp").innerHTML = "Region: " + regnom;
	    map2tbl(regsel);
	   // info.update(layer.feature.properties);
	}

	function resetHighlightBR(e) {
		var layer = e.target;
	        layer.setStyle({
     		color: 'black',
	        weight: 1,
	        fillColor: '#04B45F',
	        opacity: 1,
	        fillOpacity: 1
	    });
	        
	    document.getElementById("sele_over").innerHTML =  'Selección...';
	    
	       // info.update();

	}


	//resalta el poligono seleccionado
	function highlightFeatureM(e) {
	    var layer = e.target;
		    layer.setStyle({
		        weight: 2,
		        color: 'black',
		        fillColor: '#aaee00',
		        opacity: 1.7,
		        fillOpacity:1,
		        clickable: true 
		    });
	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	        layer.bringToFront();
	    }
	    var	mposel =  layer.feature.properties.EDOMUN;
	    var	mponom =  layer.feature.properties.NOM_MUN;
	    document.getElementById("sele_overshp").innerHTML = "Municipio: " + mponom;
	    map2tbl(mposel);
	   // info.update(layer.feature.properties);
	}



	// reajusta el poligono (municipios)
	function resetHighlightBM(e) {
		var layer = e.target;
	        layer.setStyle({
     		color: 'black',
	        weight: 1,
	        fillColor: '#F4B45F',
	        opacity: 1,
	        fillOpacity: 1
	    });
	        
	    document.getElementById("sele_over").innerHTML =  'Selección...';
	    
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


// inicializa el mapa
function initmap2() {
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
	map.setView(new L.LatLng(22.870697, -101.393824),4.4);
    
    //  al inhibirlo no se carga el mapa
    map.addLayer(osm);
	


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


  	
map.addControl(new customControl()); 

};



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
			            	fillColor: "#04B45F",
			            	weight: 1,
			            	fill: true,
			            	opacity: 1,
			            	fillOpacity: 1,
			            	clickable: true };
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
							dibujaplots();
							document.getElementById("mpo_select").innerHTML = "";
							document.getElementById("fake").click();
							console.log("llamando vistampo 	" + clave);
							//un_selected(mapselected);
							mapselected = clave;
							//do_selected(mapselected);
							document.getElementById('sele_overshp').innerHTML=mposel
							vistampo(clave)
						}
				    });
				},
				//filter: filtroestados
				    filter: function(feature, layer) {
				        if (feature.properties.CVE_ENT === clavebuscada) {
				        	console.log( "Ya lo encontre el submapa de " + clavebuscada);
				        	return true;
				        };
				    }
			}).addTo(map);
			map.fitBounds(geojsonext.getBounds());
		};
};


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
			            	fillColor: "#F4B45F",
			            	weight: 1,
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
				//filter: filtroestados
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
				        mouseover: highlightFeatureM,
				        mouseout: resetHighlightBM,
				        click: zoomToFeatureM
				    });
				}
		   
			}).addTo(map);
			map.fitBounds(geojsonext3.getBounds());

};


var  codigoextrajs = 	function(){
	loadJS('leaflet/puntosxal.js', yourCodeToBeCalled, document.body);
};



//carga los seis plots inferiores
$(document).ready(function(){
    
        //cambiaPlot(imunac_estados, 27,'rgb(12,112,200)','Grafico 1','plot_01');
       // cambiaPlot(imunac_estados, 21,'rgb(112,112,200)','Grafico 2 ','plot_02');
        //cambiaPlot(imunac_estados, 22,'rgb(212,112,200)','Grafico 3','plot_03');
        //cambiaPlot(imunac_estados, 23,'rgb(12,12,20)','Grafico 4','plot_04');
       // cambiaPlot(imunac_estados, 24,'rgb(112,212,200)','Grafico 5','plot_05');
       // cambiaPlot(imunac_estados, 27,'rgb(212,112,20)','Grafico 6','plot_06');
    
  });


$(document).ready(function(){
		cambiaPlot2(imunac_estados, 5,6,'rgb(12,112,200)','Idx 1 vs 2','plot_01','idx 01', 'idx 02');
        cambiaPlot2(imunac_estados, 5,7,'rgb(112,112,200)','Idx 1 vs 3','plot_02','idx 01', 'idx 03');
        cambiaPlot2(imunac_estados, 5,8,'rgb(212,112,200)','Idx 1 vs 4','plot_03','idx 01', 'idx 04');
        cambiaPlot2(imunac_estados, 6,7,'rgb(12,12,20)','Idx 2 vs 3','plot_04','idx 02', 'idx 03');
        cambiaPlot2(imunac_estados, 6,8,'rgb(112,212,200)','Idx 2 vs 4','plot_05','idx 02', 'idx 04');
        cambiaPlot2(imunac_estados, 7,8,'rgb(212,112,20)','Idx 3 vs 4','plot_06','idx 03', 'idx 04');
  });


function dibujaplots(){
		agregaSelec('plot_01',5,6);
		agregaSelec('plot_02',5,7);
		agregaSelec('plot_03',5,8);
		agregaSelec('plot_04',6,7);
		agregaSelec('plot_05',6,8);
		agregaSelec('plot_06',7,8);

}

function agregaSelec(seccion,col1,col2){
	while (window[seccion].data.length > 1 ) { Plotly.deleteTraces(seccion,1); } ;
	edoXloc= document.getElementById('sele_plot').innerHTML;
	var rowse=getRow(imunac_estados,edoXloc,1);
	console.log(edoXloc +'nvoplot');	
	var nvax= Number(rowse[0][col1]);
	var nvay= Number(rowse[0][col2]);
	var nval= edoXloc;
	console.log("tratando de agregar in diamente a "+  nval + '  en el grafico id ' + seccion + ' puntos ' + nvax + ' '+ nvay)
	Plotly.addTraces(seccion, {x: [nvax], y: [nvay] ,text: nval, type: 'scatter', marker: {symbol:'diamond', size:10, color: '#8A0808', opacity: .8 }} );

  };




function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function getCol(matrix, col){
       var column = [];
       for(var i=0; i<matrix.length; i++){
          column.push(matrix[i][col]);
       }
       return column;
}


function getRow(matrix, row_n, col){
       var row_s = [];
       for(var i=0; i<matrix.length; i++){
          if(matrix[i][col]===row_n){
          	//row_s=matrix[i];
          	row_s.push(matrix[i])
          };
       }
       return row_s;
}




function transpose(matrix) {  
    return zeroFill(getMatrixWidth(matrix)).map(function(r, i) {
        return zeroFill(matrix.length).map(function(c, j) {
            return matrix[j][i];
        });
    });
}

function getMatrixWidth(matrix) {
    return matrix.reduce(function (result, row) {
        return Math.max(result, row.length);
    }, 0);
}

function zeroFill(n) {
    return new Array(n+1).join('0').split('').map(Number);
}



//dibuja individualmente los plots
    function cambiaPlot(matrix, col,tonos, titulo,elemento){
        var dataSetY = getCol(matrix, col); 
       var dataSetX = getCol(matrix, 1);
       var TESTER = document.getElementById(elemento);
        Plotly.newPlot( TESTER, [{
            x: dataSetX,
            y: dataSetY,
            type: 'bar',
            marker: {
              color: tonos,
              opacity: 0.8,
              line: {
                color: 'rbg(8,48,107)',
                width: 1.5
              }
            }
             }], { title : titulo, 
            margin: { t: 50,  r:25, l:25 } } );

        /* Current Plotly.js version */
        console.log( Plotly.BUILD ); 
    }



//dibuja individualmente los plots
    function cambiaPlot2(matrix, col1,col2,tonos, titulo,elemento,xlab,ylab){
        var dataSetY = getCol(matrix, col2); 
       var dataSetX = getCol(matrix, col1);
		var dataLbl = getCol(matrix, 1);
		edoXloc= document.getElementById('sele_plot').innerHTML;
		var sumx=0;
		var sumy=0;
		var mediax= dataSetX.reduce(function(sumx, a) { return sumx + Number(a) },0)/(dataSetX.length||1);
		var mediay= dataSetY.reduce(function(sumy, a) { return sumy + Number(a) },0)/(dataSetX.length||1);
		var nvax =mediax;
		var nvay =mediay;
		var nval ='.';
		var nls = edoXloc.length;
		
		if ( nls > 3 ) {
			var rowse=getRow(imunac_estados,edoXloc,1);
			console.log(edoXloc +'nvoplot');	
			nvax= rowse[col1];
			nvay= rowse[col2];
			nval= edoXloc;
		};		

		var trace1 = {
            x: dataSetX,
            y: dataSetY,
            text: dataLbl,
            marker: { size: 6, color: "navy" },
            type: 'scatter',
            mode: 'markers',
            hoverinfo:'text'			
		};

		var layout = {
			showlegend: false,	
			title : titulo, 
            margin: { t: 50, l: 30 ,r:25, b:30} ,
            xaxis: {
            	showgrid: true,
            	ticks: 'inside',
            	title: xlab,
			    range: [ 0, 100 ],
				tickvals:[0,10,20,30,40,50,60,70,80,90,100],
			    tickfont: {
			      family: 'Old Standard TT, serif',
			      size: 10,
			      color: '#765432'
			    }

			  },
			yaxis: {
				ticks: 'inside',
				showgrid: true,
				title: ylab,
				titleoffset:100,
			    range: [0, 100],
			    tickvals:[0,10,20,30,40,50,60,70,80,90,100],
			    tickfont: {
			      family: 'Old Standard TT, serif',
			      size: 10,
			      color: '#765432'
			    }
			},
			shapes: [ {
	                  type: 'line',
	                  x0: 0,
	                  y0: mediay,
	                  x1: 100,
	                  y1: mediay,
	                  line: {
	                    color: 'rgb(128, 128, 128)',
	                    width: 2}

	                },
	                {
	                  type: 'line',
	                  x0: mediax,
					  y0: 0,
	                  x1: mediax,
	                  y1: 100,
	                  line: {
	                    color: 'rgb(128, 128, 128)',
	                    width: 2}
	                    
	                }  ]
		};
		var data = [ trace1];

       var TESTER = document.getElementById(elemento);
        Plotly.newPlot( TESTER, data, layout ,{displayModeBar: false} );

        /* Current Plotly.js version */
        console.log( Plotly.BUILD ); 
    }





 
//// Resalta en azul  el renglon de la tabla si la celda en la columna 0 
//// coincide con la clave recibida

function map2tbl(clave0){
    var table = $('#rec_tablashp').DataTable();
    var grafSel = clave0;
console.log('estamos dasda'+ clave0)
 
     var indexesno = table.rows().eq( 0 ).filter( function (rowIdx) {
                return table.cell( rowIdx, 0 ).data() != grafSel ? true : false;
            } );

      // encuentra los indices que contienen el texto grafSel text en la segunda columna
      var indexes = table.rows().eq( 0 ).filter( function (rowIdx) {
          return table.cell( rowIdx, 0 ).data() === grafSel ? true : false;
      } );

    table.rows( indexesno )
        .nodes()
        .to$()
        .removeClass( 'boldROW' );
       
      // Add a class boldROW to those rows using an index selector
      table.rows( indexes )
          .nodes()
          .to$()
          .addClass( 'boldROW' );
    
} ;





//cambia el contenido de 
   // tabla indicada (tabactiva) 
   // a partir de un set de datos (matrix)
   // hay dos columas fijas 0 y 1
   // la tercer columna es col
   // y llevara por encabezado la variable titulo

function cambiaDT(matrix, col,titulo,tabactiva){
   var table = $(tabactiva).DataTable();
   table.destroy();
   var datostbl =  transpose([getCol(matrix, 0),getCol(matrix, 1),getCol(matrix, col)]);
  //var nuevosdatos = transpose(datosTbl);
   $(tabactiva).DataTable( {
        "scrollY":        "280px",
        "scrollCollapse": true,
        "paging":         false,
        "pageLength": 300,
        "searching":false,

      data: datostbl,
      columns: [
          { title: "Semana"},
          { title: "Periodo"},
          { title: titulo}
          ]
  } );
   table.draw();
 
}


$(document).ready(function() {
    //var table = $('#rec_tablashp').DataTable();
    

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
            map2tbl(clave_clk)
            if (nivelActual =='Nacional')  {
            	console.log ("voy a llamar la construccion del mapa viatareg " + clave_clk)
            	vistareg(clave_clk)
            }else{
            	console.log ("voy a llamar la construccion del mapa vistampo "  + clave_clk)
            	vistampo(clave_clk)
            };
            cargatabla(clave_clk,'Regional')
            document.getElementById('edo_select').innerHTML=grafedo;
        }
    } );


} );


function buscavalor(registro,columna,valorbuscado) {
    return registro[columna] >= valorbuscado;
}





function cargatabla(clave_fk,nivel) {
	console.log('buscando clave_fk: ' + clave_fk + ' nivelActual: ' + nivelActual + ' niveldestino: ' + nivel )
	//destruye el contenido de la tabla actual
	var table = $('#rec_tablashp').DataTable();
	table.destroy();
	if (clave_fk == '00' && nivelActual == 'Nacional' ){
		var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8)]);
  		var leyenda= "ESTADO"
	};
	if (clave_fk != '00' && nivelActual == 'Nacional' ){
		//identificamos los renglones de las regiones que corresponden al estado seleccionado
		var datosreg=getRow(imunac_regiones,clave_fk,0);
		var datostbl =  transpose([getCol(datosreg, 1),getCol(datosreg, 2),getCol(datosreg, 3),getCol(datosreg, 4),getCol(datosreg, 5),getCol(datosreg, 6),getCol(datosreg, 7),getCol(datosreg, 8)]);
  		var leyenda= "REGIÓN"
	};

	if(clave_fk.length == 4 && nivelActual == 'Regional'){
		//falta integar los casos donde no existen regiones
	  	var datosmun=getRow(imunac_municipios,clave_fk,0);
	  	var datostbl =  transpose([getCol(datosmun, 1),getCol(datosmun, 2),getCol(datosmun, 3),getCol(datosmun, 4),getCol(datosmun, 5),getCol(datosmun, 6),getCol(datosmun, 7),getCol(datosmun, 8)]);
	  	var leyenda = "MUNICIPIO"
	  	nivelActual = 'Municipal';
	};
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
          { title: "CLAVE"},
          { title: leyenda},
          { title: "ID"},
          { title: "IMUNAC"},
          { title: "SERVICIOS BÁSICOS"},
          { title: "ENTORNO URBANO"},
          { title: "DESTINOS"},
          { title: "CONECTIVIDAD"}
          ],
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": [3,4,5,6,7],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	$(td).css('background-color', getColor(cellData))
		    }
		  },
		  { //  agragamos la clase column_color que en css se define el color de fondo en gris
		  	"sClass": "column_color", 
		    "aTargets": [ 0,1 ] 
		  }
		   ]
  } );
   	if(clave_fk!='00' && nivelActual == 'Nacional' ){
   		//ajusta el nivel cuando se ha seleccionado y ajustado la tabla
		nivelActual = 'Regional';
	}

 //table.draw();
}


function otrosmapas(){
//Base layers and overlays
var OSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
maxZoom: 18
});
var OSM2 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
maxZoom: 18
});




// carga los polígonos de las entidades
var	geojsonregion =L.geoJson(regiones, {
		name:'regiones'	,
        style: function (feature) {
            return { 
            	color: "white",
				//fillColor: "gray",
				fillColor: "pink",
            	weight: 1,
            	opacity: 1,
            	fillOpacity: 1,
            	clickable: true 
            };
        },
        onEachFeature: function(feature, layer) {
        entidades.push({
            name: layer.feature.properties.REGION,
            source: "regiones",
            id: L.stamp(layer),
            bounds: layer.getBounds()
        });
    },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.ENTREG + '  ' +
            	feature.properties.REGION
            	);
    },
	    onEachFeature(feature, layer) {
	    layer.on({
	    	
	        mouseover: highlightFeatureRegion,
	        mouseout: resetHighlightRegion,
	        //click: loadmpos
	      /*  click: 	function (layer){
	        	var layer2 = layer.target
				var	clave =  layer2.feature.properties.CVE_ENT
				var	edosel =  layer2.feature.properties.NOM_ENT
				map2tbl(edosel);
				document.getElementById("edo_select").innerHTML = edosel;
				document.getElementById("sele_plot").innerHTML = edosel;
				dibujaplots();
				document.getElementById("mpo_select").innerHTML = "";
				document.getElementById("fake").click();
				console.log("llamando vistareg 	" + clave)
				vistareg(clave)

			} */

	    });
	},
	zoomToFeatureBIS

});

function highlightFeatureRegion(e) {
    var layer = e.target;
	    layer.setStyle({
	        color: 'white',
	        weight: 2,
	        fillColor: 'blue',
	        opacity : 1,
	        fillOpacity: 1,
	        clickable: true 
	    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    //var	entsel =  layer.feature.properties.NOM_ENT;
    //    document.getElementById("sele_over").innerHTML =  entsel;
        

    //info.update(layer.feature.properties);
}

function resetHighlightRegion(e) {
	var layer = e.target;

        layer.setStyle({
        
	        color: 'white',
	        weight: 2,
	        //fillColor: 'gray',
	        fillColor: 'pink',
	        opacity: 1,
	        fillOpacity: 1,
	        clickable: true 

    });
    //document.getElementById("sele_over").innerHTML =  'Selección...';
    

        //info.update();

}

function zoomToFeatureBIS(e) {
    map1.fitBounds(e.target.getBounds());
}

var mapR= new L.map('map1', {
    zoomSnap: 0.125,
    scrollWheelZoom: false,	// no hay zoom  con el wheel 
    zoomControl: false, // no haya zoom control
    scrollWheelZoom: false,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
	center: new L.LatLng(22.870697, -101.393824),
	zoom: 4.5,
	layers: [geojsonregion]
});


//map1.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
//map1.dragging.disable(); // sin drah event
//map1.touchZoom.disable(); 
//map1.doubleClickZoom.disable();








var map = new L.map('map2', {
center: new L.LatLng(22.870697, -101.393824),
zoom: 14,
layers: [OSM2],
zoomControl: false
});

///map.addLayer(osm);


};




