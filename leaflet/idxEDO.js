var procesoRegEdo =0;
var MesoREGvigente = "";
var EDOvigente = "";



$(document).ready(function() {
  
  var datostbl =  transpose([getCol(imunac_estados, 1),getCol(imunac_estados, 2),getCol(imunac_estados, 3),getCol(imunac_estados, 4),getCol(imunac_estados, 5),getCol(imunac_estados, 6),getCol(imunac_estados, 7),getCol(imunac_estados, 8),getCol(imunac_estados, 9)]);
  nivelActual = 'Nacional';


  var encabezado= [ { title: "CLAVE"},{ title: 'ESTADO'},{ title: "ID"},{ title: "IMUNAC"},{ title: "SERVICIOS BÁSICOS"},{ title: "ENTORNO URBANO"},{ title: "CONECTIVIDAD"},{ title: "DESTINOS"},{ title: "POBLACIÓN"}];
  var colorcols = [3,4,5,6,7];
  var ocultar = [0,2];

  

  var datostblnac =  transpose([getCol(imunac_nacional, 1),getCol(imunac_nacional, 2),getCol(imunac_nacional, 3),getCol(imunac_nacional, 4),getCol(imunac_nacional, 5),getCol(imunac_nacional, 6),getCol(imunac_nacional, 7),getCol(imunac_nacional, 8),getCol(imunac_nacional, 9)]);
  leyenda = 'NIVEL'
  
  var colorcols = [0];
  
  //inicializa objetos en seccion de cosnultas por estado
  GeneraTabla(imunac_nacional,encabezado,'#TabRegionEDO',colorcols,breaks_5e,colors_5,false,false,ocultar, true)
  //preparaEstado('20')


   var EDOvigente= window.location.href.substr(window.location.href.length -2);
   var subdata = getRow(imunac_estados,EDOvigente,1);

   preparaEstado(EDOvigente);
   MesoREGvigente= subdata[0][0];
} );


function goRegion(codigo){
	var ruta= 'idxREG.html?' + codigo;
	window.open(ruta);

};

function goMesoRegion(){
	var ruta= 'index.html?' + MesoREGvigente;
	window.open(ruta);
};


///nuevos objetos
/*
 ▄▄                               ▄▄▄▄   ▄▄▄▄                         
 ██                              ██▀▀▀   ▀▀██                  ██     
 ██         ▄████▄    ▄█████▄  ███████     ██       ▄████▄   ███████  
 ██        ██▄▄▄▄██   ▀ ▄▄▄██    ██        ██      ██▄▄▄▄██    ██     
 ██        ██▀▀▀▀▀▀  ▄██▀▀▀██    ██        ██      ██▀▀▀▀▀▀    ██     
 ██▄▄▄▄▄▄  ▀██▄▄▄▄█  ██▄▄▄███    ██        ██▄▄▄   ▀██▄▄▄▄█    ██▄▄▄  
 ▀▀▀▀▀▀▀▀    ▀▀▀▀▀    ▀▀▀▀ ▀▀    ▀▀         ▀▀▀▀     ▀▀▀▀▀      ▀▀▀▀  
 */



function initMapRegionEDO() {
    var codigoZ= window.location.href.substr(window.location.href.length -2);

	// set up the map
    mapRegionEDO = new L.map('mapRegionEDO',{attributionControl: false,zoomSnap: 0.125,zoomControl: false }).setView(new L.LatLng(22.870697, -101.393824),3.6);
    mapRegionEDO.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    mapRegionEDO.dragging.disable(); // sin drah event
    mapRegionEDO.touchZoom.disable(); 
    mapRegionEDO.doubleClickZoom.disable();

	var orl= L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20//,
		//attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});
	mapRegionEDO.addLayer(orl);


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
	        filter: function(feature, layer) {
				        if (feature.properties.CVE_ENT === codigoZ){
				        	return true;
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
};

function preparaEstado(clave){
	console.log(clave)
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
	var resuEDO = '<div> <span> IMUNAC ' + fixedfmt(datEstado[0][4])  + '</span>' ;
	$('#ImunacSummaryEDO').append(resuEDO);
    res_imunac(datMunicipios,'#ImunacSummaryEDO');

	
  	var dataplot = [['Muy Bajo',datEstado[0][11]],['Bajo',datEstado[0][12]],['Medio',datEstado[0][13]],['Alto',datEstado[0][14]],['Muy alto',datEstado[0][15]]];
  	var identplot = 'grafico_AE_' + datEstado[0][1];
  	var objetocadena = "<div id='"+ identplot +"' class= 'barplotareaEDO'> </div>" 
    $("#PlotGrupEDO").append(objetocadena);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    
    var colores = ['#ccccee','#aaaacc','#8888aa','#565678','#333355'];
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

     /*coloresP = [   getColor2(datEstado[0][8],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][7],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][6],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][5],breaks_5e[0],colors_5[0])[0],
				    getColor2(datEstado[0][4],breaks_5e[0],colors_5[0])[0]]; */

    cambiaPlotBar(pilaplot, 1,coloresP,"",identplotP,'pilar');



	var encabezado= [ { title: "CLAVE"},{ title: 'REGION'},{ title: "ID"},{ title: "IMUNAC"},{ title: "ISB"},{ title: "IEU"},{ title: "ICN"},{ title: "IDT"},{ title: "POBLACIÓN"}];
	var colorcols = [3,4,5,6,7];
	var ocultar = [0,2];
	var table = $("#TabRegionEDO").DataTable();
	table.destroy();	

    var datRegiones2 =transpose([getCol(datRegiones, 1),getCol(datRegiones, 2),getCol(datRegiones, 3),getCol(datRegiones, 4).map(fixedfmt),getCol(datRegiones, 5).map(fixedfmt),getCol(datRegiones, 6).map(fixedfmt),getCol(datRegiones, 7).map(fixedfmt),getCol(datRegiones, 8).map(fixedfmt),getCol(datRegiones, 9),getCol(datRegiones, 10),getCol(datRegiones, 11),getCol(datRegiones, 12),getCol(datRegiones, 13),getCol(datRegiones, 14)]);
	
	GeneraTabla(datRegiones2,encabezado,'#TabRegionEDO',colorcols,breaks_5r,colors_5,true,true,ocultar, false)
    

        $('#TabRegionEDO tbody').on( 'mouseenter', 'td', function () {
    	    var table = $('#TabRegionEDO').DataTable();
            var clave_clk =  table.row( this ).data()[0];
            var rowIdx = table.cell(this).index().row;
            $( table.row( rowIdx ).nodes() ).addClass( 'boldROW' );
            ajusta01layer('geojsonRegEdo',"'coral'",1,0.5, "ENTREG=='"+ clave_clk +"'" );
    	});

        $('#TabRegionEDO tbody').on( 'mouseleave', 'td', function () {
    	    var table2 = $('#TabRegionEDO').DataTable();
            var clave_clk2 =  table2.row( this ).data()[0];
            var rowIdx2 = table2.cell(this).index().row;
            $( table2.row( rowIdx2 ).nodes() ).removeClass( 'boldROW' );

            ajusta01layer('geojsonRegEdo',"'pink' ",1,0, "ENTREG=='"+ clave_clk2 +"'" );
    	});

	    $('#TabRegionEDO tbody').on('click', 'td', function () {
	    	var table3 = $('#TabRegionEDO').DataTable();
	    	var clave_clk3 =  table3.row( this ).data()[0];
	    	var nombre03 =  table3.row( this ).data()[1];
	        var rowIdx3 = table3.cell(this).index().row;
	        goRegion(clave_clk3);
	    } );


    vistaregRegEdo(clave);
    carga_tablaescala2('Treg','#TabEscalaEDO');

    ajusta01layer('geojsonstateRegEdo',"'#c0b0a0'",1,0.6,"CVE_ENT!='"+clave+"'");
    ajusta01layer('geojsonstateRegEdo',"'orange'",1,0,"CVE_ENT=='"+clave+"'");
    

    $("#ER_sel").append(muetraEnPlot(datEstado[0][2],datRegiones));


    	var axislab=['Servicios Básicos','Entorno Urbano','Conectividad','Destinos'];
    	var axisXvar=[4,4,4,5,5,6];
    	var axisYvar=[5,6,7,6,7,7];
	   $("#relacionPilaresEDO").empty();
	   for(var i=0; i<6;i++){
	   		var idobj ="relPil" + i ;
	   		
	   	    $("#relacionPilaresEDO").append("<div id='" + idobj +"'class= 'scatterplotareaEDO'> </div>");	
	   	     cambiaPlot2(datRegiones2, axisXvar[i],axisYvar[i],'rgb(12,112,200)',datEstado[0][2],idobj, axislab[axisXvar[i]-4],axislab[axisYvar[i]-4]);	    
	   };
	dibujaplots(clave)

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
				        click: //highlightFeatureR,
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
				        	goRegion(clave);
				        	
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

