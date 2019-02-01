var procesoMpoReg =0;
var REGvigente = "";



$(document).ready(function() {
  
  var datostbl =  transpose([getCol(imunac_regiones, 1),getCol(imunac_regiones, 2),getCol(imunac_regiones, 3),getCol(imunac_regiones, 4),getCol(imunac_regiones, 5),getCol(imunac_regiones, 6),getCol(imunac_regiones, 7),getCol(imunac_regiones, 8),getCol(imunac_regiones, 9)]);
  nivelActual = 'Estatal';


  var encabezado= [ { title: "CLAVE"},{ title: 'ESTADO'},{ title: "ID"},{ title: "IMUNAC"},{ title: "SERVICIOS BÁSICOS"},{ title: "ENTORNO URBANO"},{ title: "CONECTIVIDAD"},{ title: "DESTINOS"},{ title: "POBLACIÓN"}];
  var colorcols = [3,4,5,6,7];
  var ocultar = [0,2];

  

  var datostblnac =  transpose([getCol(imunac_nacional, 1),getCol(imunac_nacional, 2),getCol(imunac_nacional, 3),getCol(imunac_nacional, 4),getCol(imunac_nacional, 5),getCol(imunac_nacional, 6),getCol(imunac_nacional, 7),getCol(imunac_nacional, 8),getCol(imunac_nacional, 9)]);
  leyenda = 'NIVEL'
  
  var colorcols = [0];
  
  //inicializa objetos en seccion de cosnultas por estado
  GeneraTabla(imunac_nacional,encabezado,'#TabMunicipioREG',colorcols,breaks_5e,colors_5,false,false,ocultar, true)
  //preparaEstado('20')
  // REGvigente= window.location.href.substr(window.location.href.length -4);
  // EDOvigente= REGvigente.substr(0,2);
   //var subdata = getRow(imunac_estados,EDOvigente,1);
   //MesoREGvigente = subdata[0][0];
   //preparaRegion(REGvigente)
   carga_tablaescala2('Tmun','#TabEscalaREG');
} );



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


function cargaSeleccionREG() {
	mapMunicipioREG.removeLayer(geojsonmunicipioMpoReg);

	geojsonmunicipioMpoReg =L.geoJson(municipios, {
			name:'municipiostodosMpoReg'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 0.4,
	            	clickable: false 
	            };
	        },
	        filter: function(feature, layer) {
				        if (feature.properties.EDOREG === REGvigente){
				        	return true;
				        };
				    },
		zoomToFeature

	}).addTo(mapMunicipioREG);



    ajusta01layer('geojsonmunicipioMpoReg','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,0.7,"EDOREG!='0000'");


	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}



}

function initMapMunicipioREG() {
    codigo=REGvigente;
    codigo2= EDOvigente;
	//var codigo= window.location.href.substr(window.location.href.length -4);
	//var codigo2= codigo.substr(0, 2);
	console.log( "es el código en el mapa " + codigo);
	// set up the map
    mapMunicipioREG = new L.map('mapMunicipioREG',{attributionControl: false,zoomSnap: 0.125,zoomControl: false }).setView(new L.LatLng(22.870697, -101.393824),3.6);
    mapMunicipioREG.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    mapMunicipioREG.dragging.disable(); // sin drah event
    mapMunicipioREG.touchZoom.disable(); 
    mapMunicipioREG.doubleClickZoom.disable();


	var orl= L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20//,
		//attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});
	mapMunicipioREG.addLayer(orl);
	//L.control.zoom().addTo(mapMunicipioREG)


	geojsonmunicipioMpoReg =L.geoJson(municipios, {
			name:'municipiostodosMpoReg'	,
	        style: function (feature) {
	            return { 
	            	color: "white",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 0,
	            	opacity: 0,
	            	fillOpacity: 0.4,
	            	clickable: false 
	            };
	        },
	        filter: function(feature, layer) {
				        if (feature.properties.EDOREG === '0101'){
				        	return true;
				        };
				    },
		

	}).addTo(mapMunicipioREG);



// carga los polígonos de las regiones
	geojsonRegionMpoReg =L.geoJson(regiones, {
			name:'regionMpo'	,
	        style: function (feature) {
	            return { 
	            	color: "#000000",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 1,
	            	opacity: 1,
	            	fillOpacity: 0,
	            	clickable: false 
	            };
	        },
	        filter: function(feature, layer) {
	        	console.log("hhadoel do codigo 2")
				        if (feature.properties.CVE_ENT === codigo2){
				        	return true;
				        };
				    }
				    //,zoomToFeature

	}).addTo(mapMunicipioREG);



	// carga los polígonos de las municipios
	 geojsonMpoReg =L.geoJson(municipios, {
			name:'MpoReg'	,
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
		filter: function(feature, layer) {
	        	console.log("hhadoel do codigo 2")
				        if (feature.properties.CVE_ENT === codigo2){
				        	return true;
				        };
				    }

		//zoomToFeature

	}).addTo(mapMunicipioREG); 

	 function nada(){

	 };


L.control.attribution({position: 'topright'}).addTo(mapMunicipioREG);
};




function generalinks_otroB(leyenda,datos){
	var links = "<span class= 'txt_12em'>"+leyenda+":</span><span> &emsp; -";
	for(var i=0; i<datos.length; i++){
		links = links + '<a href="javascript:PrepreparaRegion('+ "'" + datos[i][1] +  "'" + ')">'+datos[i][2]+'</a>- &emsp;'
	};
	links = links + "</span> ";
	return links;
};

function PrepreparaRegion(clave){
	mapMunicipioREG._onResize();
	toggleMNU('Edo');
	preparaRegion(clave);
};

function preparaRegion(clave){
	$('#seccionRegiones').removeClass('hidden');
	tooglehome('seccionRegiones');
	cargaSeleccionREG()

	console.log(clave)
	claveRegAct =clave;
	//inicializando
	$('#REGseleccionado').empty();
	$('#ImunacSummaryREG').empty();
	$("#PlotGrupREG").empty();
	$("#ResPilarREG").empty();
	$("#RM_sel").empty();
	// carga inicial de datos
	var datEstado  =getRow(imunac_estados,clave.substr(0,2)	,1);
	var datRegion  =getRow(imunac_regiones,clave,1);
	var abrev=datRegion[0][1];
	//var datRegiones=getRow(imunac_regiones,clave,0);
	var datMunicipios=getRow(imunac_municipios,abrev,0);

	var txtselreg = ' Región: ' + datRegion[0][2] ;
	$('#Eseleccionado').text(datEstado[0][2]);
	$('#REGseleccionado').append(txtselreg);
	$('#mrr_sel').text(txtselreg);	
	var resuREG = '<div> <span> IMUNAC ' + fixedfmt(datRegion[0][4])  + '</span>' ;
	$('#ImunacSummaryREG').append(resuREG);
    res_imunac(datMunicipios,'#ImunacSummaryREG');

	
  	var dataplot = [['Muy Bajo',datRegion[0][11]],['Bajo',datRegion[0][12]],['Medio',datRegion[0][13]],['Alto',datRegion[0][14]],['Muy alto',datRegion[0][15]]];
  	var identplot = 'grafico_AR_' + datRegion[0][1];
  	var objetocadena = "<div id='"+ identplot +"' class= 'barplotareaREG'> </div>" 
    $("#PlotGrupREG").append(objetocadena);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    //var colores = ['#bfb1d5','#f0e0a2','#abe1fd','#adddcf','#ffddcf'];
    var colores = ['#ccccee','#aaaacc','#8888aa','#565678','#333355'];
    cambiaPlotBar(dataplot, 1,colores,"IMUNAC - " + datRegion[0][2],identplot,'uno');

  	var pilaplot = [['Destinos',datRegion[0][8]],['Conectividad',datRegion[0][7]],['Entorno Urbano',datRegion[0][6]],['Servicios Básicos',datRegion[0][5]],['<b>IMUNAC</b>',datRegion[0][4]]];
  	var identplotP = 'grafico_PI_' + datRegion[0][1];
  	var objetocadenaP = "<div id='"+ identplotP +"' class= 'barplotareaREG'> </div>" 
  
    $("#ResPilarREG").append(objetocadenaP);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    var coloresP = [ getColor2(datRegion[0][8],breaks_5r[4],colors_5[4])[0],
				    getColor2(datRegion[0][7],breaks_5r[3],colors_5[3])[0],
				    getColor2(datRegion[0][6],breaks_5r[2],colors_5[2])[0],
				    getColor2(datRegion[0][5],breaks_5r[1],colors_5[1])[0],
				    getColor2(datRegion[0][4],breaks_5r[0],colors_5[0])[0]];

     

    cambiaPlotBar(pilaplot, 1,coloresP,"",identplotP,'pilar');



	var encabezado= [ { title: "CLAVE"},{ title: 'MUNICIPIO'},{ title: "ID"},{ title: "IMUNAC"},{ title: "ISB"},{ title: "IEU"},{ title: "ICN"},{ title: "IDT"},{ title: "POBLACIÓN"}];
	var colorcols = [3,4,5,6,7];
	var ocultar = [0,2];
	var table = $("#TabMunicipioREG").DataTable();
	table.destroy();	

    var datMunicipios2 =transpose([getCol(datMunicipios, 1),getCol(datMunicipios, 2),getCol(datMunicipios, 3),getCol(datMunicipios, 4).map(fixedfmt),getCol(datMunicipios, 5).map(fixedfmt),getCol(datMunicipios, 6).map(fixedfmt),getCol(datMunicipios, 7).map(fixedfmt),getCol(datMunicipios, 8).map(fixedfmt),getCol(datMunicipios, 9),getCol(datMunicipios, 10),getCol(datMunicipios, 11),getCol(datMunicipios, 12),getCol(datMunicipios, 13),getCol(datMunicipios, 14)]);
	
	GeneraTabla(datMunicipios2,encabezado,'#TabMunicipioREG',colorcols,breaks_5,colors_5,true,true,ocultar, false)
    

        $('#TabMunicipioREG tbody').on( 'mouseenter', 'td', function () {
    	    var table = $('#TabMunicipioREG').DataTable();
            var clave_clk =  table.row( this ).data()[0];
            var rowIdx = table.cell(this).index().row;
            $( table.row( rowIdx ).nodes() ).addClass( 'boldROW' );
            console.log( "seleccionado en tabla la clave: "+ clave_clk);
            ajusta01layer('geojsonMpoReg',"'crimson'",1,0.5, "EDOMUN=='"+ clave_clk +"'" );
    	});

        $('#TabMunicipioREG tbody').on( 'mouseleave', 'td', function () {
    	    var table2 = $('#TabMunicipioREG').DataTable();
            var clave_clk2 =  table2.row( this ).data()[0];
            var rowIdx2 = table2.cell(this).index().row;
            $( table2.row( rowIdx2 ).nodes() ).removeClass( 'boldROW' );
            console.log( "Saliendo de la clave: "+ clave_clk2);
            ajusta01layer('geojsonMpoReg',"'pink' ",1,0, "EDOMUN=='"+ clave_clk2 +"'" );
    	});

	    $('#TabMunicipioREG tbody').on('click', 'td', function () {
	    	var table3 = $('#TabMunicipioREG').DataTable();
	    	var clave_clk3 =  table3.row( this ).data()[0];
	    	var nombre03 =  table3.row( this ).data()[1];
	        var rowIdx3 = table3.cell(this).index().row;
	        goMunicipio(clave_clk3)
	        //alert( 'Esta liga se direcciona al municipio con clave ' + clave_clk3 + "  " + nombre03 );
	    } );



    console.log("soy la " + clave)
    vistaregMpoReg(clave);
    var tableSLC = $('#TabEscalaREG').DataTable();
	tableSLC.destroy();

	carga_tablaescala2('Tmun','#TabEscalaREG');
    ajusta01layer('geojsonRegionMpoReg',"'#c0b0a0'",1,0.6,"ENTREG!='"+clave+"'");
    ajusta01layer('geojsonRegionMpoReg',"'orange'",1,0,"ENTREG=='"+clave+"'");
    

    $("#RM_sel").append(muestraEnPlot(datRegion[0][2],datMunicipios,"M"));


    	var axislab=['Servicios Básicos','Entorno Urbano','Conectividad','Destinos'];
    	var axisXvar=[4,4,4,5,5,6];
    	var axisYvar=[5,6,7,6,7,7];
	   $("#relacionPilaresREG").empty();
	   for(var i=0; i<6;i++){
	   		var idobj ="MrelPil" + i ;
	   		
	   	    $("#relacionPilaresREG").append("<div id='" + idobj +"'class= 'scatterplotareaREG'> </div>");	
	   	     cambiaPlot2(datMunicipios2, axisXvar[i],axisYvar[i],'rgb(12,112,200)',datRegion[0][2],idobj, axislab[axisXvar[i]-4],axislab[axisYvar[i]-4]);	    
	   };
	dibujaplots(clave,"M")

};



function vistaregMpoReg(clavebuscada){
	console.log("Estoy buscando las municipios de la region " + clavebuscada  + "  " + procesoMpoReg);
	procesoMpoReg= procesoMpoReg +1
		//var clavebuscada= document.getElementById("edo_select").innerHTML 
		//var clavebuscada = document.getElementById('TEXTBOX_ID');
		//var n = clavebuscada.value.length
		//if (n===2 && Number(clavebuscada.value) > 0 && Number(clavebuscada.value) < 32  ){
			 n = clavebuscada.length

			 console.log(n)
		if (n===4 && Number(clavebuscada) > 0 && Number(clavebuscada) < 33000 ){
			if ( procesoMpoReg >1 ){mapMunicipioREG.removeLayer(geojsonMpoReg);};
			geojsonMpoReg =L.geoJson(municipios, {

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
			            name: layer.feature.properties.NOM_MUN,
			            source: "regiones",
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
				        mouseover: //highlightFeatureR,
				          function (layer){
				          	var layerM = layer.target
				        	layerM.setStyle({
						        color: 'black',
						        weight: 2,
						        fillColor: 'crimson',
						        opacity : 1,
						        fillOpacity: 0.4,
						        clickable: true 
						    });
							var	clave =  layerM.feature.properties.EDOMUN;
				        	map2tbl(clave,"#TabMunicipioREG");
				        	
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
							map2tbl('nada',"#TabMunicipioREG")
							$('#mre_sel').text("");

				        },
				        //click: zoomToFeatureR
				        click: //highlightFeatureR,
				          function (layer){
				          	var layerM = layer.target
				        	layerM.setStyle({
						        color: 'black',
						        weight: 2,
						        fillColor: 'crimson',
						        opacity : 1,
						        fillOpacity: 0.4,
						        clickable: true 
						    });
							var	clave =  layerM.feature.properties.EDOMUN;
							goMunicipio(clave)
				        	
				        },

				    });
				},
				
				    filter: function(feature, layer) {
				        if (feature.properties.EDOREG === clavebuscada){
				        	console.log( "Ya lo encontre el submapa del Region " + clavebuscada);

				        	return true;
				        };
				    }
			}).addTo(mapMunicipioREG);
			//zoomToFeature;
			mapMunicipioREG.fitBounds(geojsonMpoReg.getBounds());
		};

};

