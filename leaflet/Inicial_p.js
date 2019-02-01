
var procesoMR =0;
var proceso =0;
var nivelActual;
var MesoREGvigente = "00";
var iniciado =false;

$(document).ready(function() {
/// revisamos si existe mesoregion y en su caso la reemplazamos por la solicitada
   //dosletras= window.location.href.substr(window.location.href.length -2);
//   if (dosletras.substr(0,1) === "0"){
 //	  	MesoREGvigente = dosletras;
 //  };
   console.log("  comenzando con la mesorregion " + MesoREGvigente)

});



function goRegion(codigo){
	REGvigente = codigo;
	preparaRegion(codigo);
};


function goEstado(codigo){
	//tooglehome('seccionEstados')
	EDOvigente = codigo;
	preparaEstado(codigo);
};


function goMunicipio(codigo){
	MPOvigente = codigo;
	preparaMunicipio(codigo);
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
		    onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeatureEstado,
		        mouseout: resetHighlightEstado,
		        click: //highlightFeatureR,
				          function (layer){
				          	var layerM = layer.target
							REGvigente =  layerM.feature.properties.ENTREG;
							EDOvigente =  layerM.feature.properties.CVE_ENT;
							MesoREGvigente =  "0" + layerM.feature.properties.CVE_MRE;
							goRegion(REGvigente);
				        }
		    });
		},	        

		zoomToFeature

	});

	geojsonregionM2.eachLayer(function (layer) {
    	layer.bindTooltip(layer.feature.properties.REGION);
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
		    onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeatureEstado,
		        mouseout: resetHighlightEstado,
		        click: //highlightFeatureR,
				          function (layer){
				          	var layerM = layer.target
							var	clave =  layerM.feature.properties.MESOREGI_1;
							var objeto = "#BtnMR" + clave.substr(1,1);
							toggleMS(clave,objeto);
							location.hash = "CincoMesReg";
				        }
		    });
		},	        
		zoomToFeature

	});


    ajusta01layer('geojsonmunicipioM2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOREG!='0000'");

    ajusta01layer('geojsonregionesM2','getColor2(checkTotal_reg2(layer.feature.properties.ENTREG,4),imunac_breakr,imunac_colors)[0]',0,1,"CVE_ENT!='00'");

	geojsonmesoregionM2.eachLayer(function (layer) {
    	layer.bindTooltip(layer.feature.properties.MESOREGI_2);
	});

	// carga los polígonos de las entidades
	geojsonstateM2 =L.geoJson(entidades, {
			name:'entidades',
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
		    onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeatureEstado,
		        mouseout: resetHighlightEstado,
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
							EDOvigente =  layerM.feature.properties.CVE_ENT;
							MesoREGvigente =  "0" + layerM.feature.properties.CVE_MREG;
				        	goEstado(EDOvigente);
				        	
				        }
		    });
		},
		zoomToFeature

	}).addTo(map2);

	geojsonstateM2.eachLayer(function (layer) {
    	layer.bindTooltip(layer.feature.properties.NOM_ENT);
	});
		
	var baseMaps2 = {
	    "Municipios": geojsonmunicipioM2,
	    "Regiones": geojsonregionesM2
	};

	var overlayMaps2 = {
	    "Estados": geojsonstateM2,
	    "Regiones": geojsonregionM2,
	    "Mesorregiones": geojsonmesoregionM2
	};

	L.control.layers(overlayMaps2).addTo(map2);


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
	  	goEstado( this.value );
	})
//});        



// add an OpenStreetMap tile layer
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map2);

};


	function highlightFeatureEstado(e) {
		
		objetivo = e.target;
	    var layer = e.target;
		    layer.setStyle({
		        color: 'black',
		        weight: 2,
		        fillColor: 'coral',
		        opacity : 1,
		        fillOpacity: 0.4,
		        clickable: true 
		    });

	    //info.update(layer.feature.properties);
	};

	// reajusta el poligono (estados)
	function resetHighlightEstado(e) {
		
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
	    $('#edomsg').text('');    
	};

function toggleMS(clave,objeto) {
	MesoREGvigente=clave;
	console.log(clave +"  "+  iniciado)
	$("#BtnMR1").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR2").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR3").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR4").removeClass('btn-outline-warning waves-dark');
	$("#BtnMR5").removeClass('btn-outline-warning waves-dark');
	$(objeto).addClass('btn-outline-warning waves-dark');

	if (clave != '00' & iniciado == true ){
		console.log('estoy en el if');
		var table = $('#rec_tablaMR').DataTable();
	    table.destroy();
	};
	if (clave == '00' & iniciado == false ) {
		clave='01';
	};
	var mesodata = getRow(imunac_mesoregiones,clave,1);
	var nomMR = getCol(mesodata,2);
	var edosMR=getRow(imunac_estados,clave,0);
	var mpo10MR=getRow(imunac_municipios,clave,10);
    var mpo10MR2 =  transpose([getCol(mpo10MR, 1),getCol(mpo10MR, 58),getCol(mpo10MR, 2),getCol(mpo10MR, 4),getCol(mpo10MR, 13),getCol(mpo10MR, 1),getCol(mpo10MR, 3)]);

    
	
	var arr = mpo10MR2.sort(function(a,b) {
      return b[3] - a[3];
    });
    datostbl = arr.slice(0, 10);
    datostbl2 = arr.slice(0, 4);
    $("#MR_sel").empty();
    $("#MR_sel").append(generalinks(nomMR,edosMR));
    $("#nomMR").text($(objeto).text()+ ". Top 10 municipios IMUNAC"); 
	
    $("#recMRDatos").empty();
    var cedenaPil = '<div class="centerdiv"><table > '
    cedenaPil =  cedenaPil + '<tr class="txt_12em"> <td class="tds1">IMUNAC</td><td class="tds2">' + fixedfmt(mesodata[0][4])  + ' </td>'
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Servicios básicos </td><td class="tds2">' + fixedfmt(mesodata[0][5]) + ' </td>'
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Entorno urbano</td><td class="tds2">' + fixedfmt(mesodata[0][6])+ ' </td>'
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Conectividad</td><td class="tds2">' + fixedfmt(mesodata[0][7]) + ' </td>' 
    cedenaPil =  cedenaPil + '<tr> <td class="tds1">Destinos</td><td class="tds2">' + fixedfmt(mesodata[0][8]) + ' </td></table><div>'
    $("#recMRDatos").append(cedenaPil);
    $("#rec_tablaMR").empty();
    var encabezado = [ { width: 0,title: ""},{ width: 3,title: ""},{ width: 30,title: ""},{ width: 3,title: ""}];
    var colorcols =[0];
    var ocultar =[0];
    var datostbl2 = transpose([getCol(datostbl,0),getCol(datostbl,1),getCol(datostbl,2),getCol(datostbl,3).map(fixedfmt)]);
	GeneraTabla(datostbl2,encabezado,'#rec_tablaMR',colorcols,breaks_5,colors_5,false,false,ocultar,true);
	iniciado = true;
	ajusta01layer('geojsonMR',"'#c0b0a0' ",0.3,0.6, "MESOREGI_1!="+ clave +"" );
	ajusta01layer('geojsonMR',"'orange' ",1,0, "MESOREGI_1=="+ clave +"" );


        $('#rec_tablaMR tbody').on( 'mouseenter', 'td', function () {
    	    var table = $('#rec_tablaMR').DataTable();
            var clave_clk =  table.row( this ).data()[0];
			var rowIdx = table.cell(this).index().row;
            $( table.row( rowIdx ).nodes() ).addClass( 'boldROW' );
            ajusta01layer('geojsonmunicipioMR2',"'#ff0000'",0.7,1,"EDOMUN==='"+clave_clk+"'");
            ajusta01layer('geojsonstateMR2',"'#0000fa'",0.7,0.2,"CVE_ENT==='"+clave_clk.substr(0,2)+"'");
            
    	});

        $('#rec_tablaMR tbody').on( 'mouseleave', 'td', function () {
    	    var table2 = $('#rec_tablaMR').DataTable();
            var clave_clk2 =  table2.row( this ).data()[0];
            var rowIdx2 = table2.cell(this).index().row;
            $( table2.row( rowIdx2 ).nodes() ).removeClass( 'boldROW' );
            ajusta01layer('geojsonmunicipioMR2','getColor2(checkTotal_mpo2(layer.feature.properties.EDOMUN,4),imunac_breaks,imunac_colors)[0]',0,1,"EDOMUN=='"+clave_clk2+"'");
            ajusta01layer('geojsonstateMR2',"'#0000fa'",1,0,"CVE_ENT==='"+clave_clk2.substr(0,2)+"'");

    	});

	    $('#rec_tablaMR tbody').on('click', 'td', function () {
	    	var table3 = $('#rec_tablaMR').DataTable();
	    	var clave_clk3 =  table3.row( this ).data()[0];
	    	var nombre03 =  table3.row( this ).data()[2];
	        var rowIdx3 = table3.cell(this).index().row;
	        MPOvigente=clave_clk3
		  	var datMunicipio=getRow(imunac_municipios,MPOvigente,1);
		  	REGvigente=datMunicipio[0][0];
		  	EDOvigente=MPOvigente.substr(0,2);
			MesoREGvigente= datMunicipio[0][10];
			goMunicipio(MPOvigente);

	    } );


  		$('#rec_tablaMR tbody').on( 'mouseleave', 'tr', function () {
  			var table = $('#rec_tablaMR').DataTable();
  			if ( table.rows( '.boldROW' ).any()){
  			}else{
  				setTimeout(function() {
  		  			if ( table.rows( '.boldROW' ).any()==false){
	
		            	mapMR.fitBounds(geojsonextMR.getBounds());  				
		            };
			}, 1000);
  			};
  			
        } );

	    $('#rec_tablaMR tbody').on( 'mouseenter', 'tr', function () {
    	    var table = $('#rec_tablaMR').DataTable();
            var clave_clk =  table.row( this ).data()[0];
            var coords =[];
            geojsonstateMR2.eachLayer(function(layer) {
             if (layer.feature.properties.CVE_ENT===clave_clk.substr(0,2)){
             	coords =layer.getBounds();
             };
             });
	        mapMR.fitBounds(coords);

        } );

vistaregMR(clave)

};


$(document).ready(function() {
	$("#ImunacSummary").empty();
     res_imunac(imunac_municipios,"#ImunacSummary");
     carga_tablaescala(1);
     var objeto = "#BtnMR"+ MesoREGvigente.substr(1,1);
     if (MesoREGvigente=='00'){objeto='#BtnMR1'};
     toggleMS(MesoREGvigente, objeto );
});

function generalinks(leyenda,datos){
	var links = "<span class= 'txt_12em'>"+leyenda+":</span><span> &emsp; -";
	for(var i=0; i<datos.length; i++){
		links = links + '<a href="javascript:goEstado('+ "'" + datos[i][1] +  "'" + ')">'+datos[i][2]+'</a>- &emsp;'
	};
	links = links + "</span> ";
	return links;
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


function carga_tablaescala(columna){
    var vacia = ["","","","",""];	
  var datostbl =  transpose([getCol(tablaescala_m,0),getCol(tablaescala_m,columna),vacia]);
  console.log(datostbl)
  var mediciones = ['NIVEL',"IMUNAC","ISB","IEU","ICN","IDT"];
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
          { title: medicion},
          { title: ""}
          ],
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": [2],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	colref=columna-1;
		    	$(td).css('background-color', colors_5[colref][row]);
		    }
		  },
		  { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": [1],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	$(td).css('text-align', 'center');
		    }
		  },
		  { //  agragamos la clase gris que en css se define el color de fondo en gris
		  	"sClass": "gris", 
		    "aTargets": [ 0] 
		  }
		   ]

          
  } );
};

 
