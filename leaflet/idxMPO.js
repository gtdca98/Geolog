var procesoMpoReg =0;
var EDOvigente = "";
var REGvigente = "";
var MPOvigente = "";
var MesoREGvigente = "";

$(document).ready(function() {
  
  var datostbl =  transpose([getCol(imunac_regiones, 1),getCol(imunac_regiones, 2),getCol(imunac_regiones, 3),getCol(imunac_regiones, 4),getCol(imunac_regiones, 5),getCol(imunac_regiones, 6),getCol(imunac_regiones, 7),getCol(imunac_regiones, 8),getCol(imunac_regiones, 9)]);
  nivelActual = 'Estatal';


  var encabezado= [ { title: "CLAVE"},{ title: 'ESTADO'},{ title: "ID"},{ title: "IMUNAC"},{ title: "ISB"},{ title: "IEU"},{ title: "ICN"},{ title: "IDT"},{ title: "POBLACIÓN"}];
  var colorcols = [3,4,5,6,7];
  var ocultar = [0,2];

  

  var datostblnac =  transpose([getCol(imunac_nacional, 1),getCol(imunac_nacional, 2),getCol(imunac_nacional, 3),getCol(imunac_nacional, 4),getCol(imunac_nacional, 5),getCol(imunac_nacional, 6),getCol(imunac_nacional, 7),getCol(imunac_nacional, 8),getCol(imunac_nacional, 9)]);
  leyenda = 'NIVEL'
  
  var colorcols = [0];
  
  //inicializa objetos en seccion de cosnultas por estado
  GeneraTabla(imunac_nacional,encabezado,'#TabMunicipioMPO',colorcols,breaks_5e,colors_5,false,false,ocultar, true)
  //preparaEstado('20')
   MPOvigente= window.location.href.substr(window.location.href.length -5);
	
   var subdata = getRow(imunac_municipios,MPOvigente,1);
   EDOvigente= MPOvigente.substr(0,2);
   REGvigente= subdata[0][0];
   MesoREGvigente= subdata[0][10];
   preparaMunicipio(MPOvigente)


} );


function goEstado(){
	var ruta= 'idxEDO.html?' + EDOvigente;
	window.open(ruta,'_blank');
};

function goRegion(){
	var ruta= 'idxREG.html?' + REGvigente;
	window.open(ruta,'_blank');
};

function goMesoRegion(){
	var ruta= 'index.html?' + MesoREGvigente;
	window.open(ruta,'_blank');
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



function initMapMunicipal() {
	 var mMPOvigente= window.location.href.substr(window.location.href.length -5);
	 var subdata = getRow(imunac_municipios,mMPOvigente,1);
     mEDOvigente= mMPOvigente.substr(0,2);
     mREGvigente= subdata[0][0];
     mMesoREGvigente= subdata[0][10];


	var codigo= window.location.href.substr(window.location.href.length -5);
	var codigo2= codigo.substr(0, 2);
	console.log( "es el código en el mapa " + codigo);
	// set up the map
    mapMunicipioMPO = new L.map('mapMunicipioMPO',{attributionControl: false,zoomSnap: 0.125,zoomControl: false }).setView(new L.LatLng(22.870697, -101.393824),3.6);
    mapMunicipioMPO.scrollWheelZoom.disable(); // sin mouse o pad wheel zoom
    //mapMunicipioMPO.dragging.disable(); // sin drah event
    mapMunicipioMPO.touchZoom.disable(); 
    mapMunicipioMPO.doubleClickZoom.disable();


	var orl= L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20//,
		//attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});
	mapMunicipioMPO.addLayer(orl);
	//L.control.zoom().addTo(mapMunicipioREG)

	geojsonmunicipioMpoMesoReg =L.geoJson(mesoregiones, {
			name:'municipiostodosMpoMesoReg'	, className: 'my_polyline',
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 3,
	            	opacity: 1,
	            	fillOpacity: 0.0,
	            	clickable: false 
	            };
	        },
	        filter: function(feature, layer) {
				        if (feature.properties.MESOREGI_1 === mMesoREGvigente){
				        	return true;
				        };
				    },


	}).addTo(mapMunicipioMPO);

	geojsonmunicipioMpoReg =L.geoJson(regiones, {
			name:'municipiostodosMpoReg'	,
	        style: function (feature) {
	            return { 
	            	color: "darkred",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 2,
	            	opacity: 1,
	            	fillOpacity: 0.0,
	            	clickable: false 
	            };
	        },
	        filter: function(feature, layer) {
				        if (feature.properties.ENTREG === mREGvigente){
				        	return true;
				        };
				    },


	}).addTo(mapMunicipioMPO);

	geojsonmunicipioMpoEnt =L.geoJson(entidades, {
			name:'municipiostodosMpoReg'	, className: 'my_polyline' ,
	        style: function (feature) {
	            return { 
	            	color: "green",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 3,
	            	opacity: 1,
	            	fillOpacity: 0.0,
	            	clickable: false 
	            };
	        },
	        filter: function(feature, layer) {
				        if (feature.properties.CVE_ENT === mEDOvigente){
				        	return true;
				        };
				    }
	

	}).addTo(mapMunicipioMPO);



	geojsonmunicipioMpoMpo =L.geoJson(municipios, {
			name:'municipiostodosMpoMpo',
	        style: function (feature) {
	            return { 
	            	color: "black",
					//fillColor: "gray",
					fillColor: '#4B0082',//getColor(checkTotal_mpo2(feature.properties.EDOMUN)),
	            	weight: 1,
	            	opacity: 1,
	            	fillOpacity: 0.05,
	            	clickable: true 
	            };
	        },
	        filter: function(feature, layer) {
				        if (feature.properties.EDOMUN === mMPOvigente){
				        	return true;
				        };
				    },

			onEachFeature(feature, layer) {
				    layer.on({
				        mouseover: nada,
				        mouseout: nada,
				        click: zoomToFeatureK
				    });
				},

		//zoomToFeature

	}).addTo(mapMunicipioMPO);

    mapMunicipioMPO.fitBounds(geojsonmunicipioMpoMpo.getBounds());
    L.control.zoom().addTo(mapMunicipioMPO);



	 function nada(){

	 };

	function zoomToFeatureK	(e) {
	    mapMunicipioMPO.fitBounds(e.target.getBounds());
	}

	L.control.attribution({position: 'topright'}).addTo(mapMunicipioMPO);
};






function generalinks(leyenda,datos){
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

function preparaMunicipio(clave){
	console.log(clave)
	//inicializando
	$('#MPOseleccionado').empty();
	$('#ImunacSummaryMPO').empty();
	$("#PlotGrupMPO").empty();
	$("#ResPilarMPO").empty();
	$("#RM_sel").empty();
	// carga inicial de datos
	var datEstado  =getRow(imunac_estados,EDOvigente ,1);
	var datRegion  =getRow(imunac_regiones,REGvigente,1);
	var abrev=datRegion[0][1];
	var datMunicipio=getRow(imunac_municipios,clave,1);

	var txtselreg = ' Municipio: ' + datMunicipio[0][2] ;
	$('#MRseleccionado').text("Región: "+datRegion[0][2]);
	$('#MEseleccionado').text('Estado: '+datEstado[0][2]);
	$('#MPOseleccionado').append(txtselreg);
	$('#mrr_sel').text(txtselreg);

	$('#ImunacSummaryMPO').append('<div> <span> IMUNAC ' + fixedfmt(datMunicipio[0][4])  + '</span>');

    $('#recMpoDatos').append("<tr ><td class='lin5'> Población: </td>"+ "<td class= 'lin5b'> "+ datMunicipio[0][9] + " </td></tr>")
    $('#recMpoDatos').append("<tr><td> Ranking regional: </td>"+ "<td class= 'lin5b'> "+datMunicipio[0][15] + "</td></tr>")
    $('#recMpoDatos').append("<tr><td> Ranking estatal: </td>"+  "<td class= 'lin5b'> "+datMunicipio[0][14] + "</td></tr>")
    $('#recMpoDatos').append("<tr><td> Ranking mesorregional: </td>"+  "<td class= 'lin5b'> "+datMunicipio[0][13] + "</td></tr>")
    $('#recMpoDatos').append("<tr><td> Ranking nacional: </td>"+ "<td class= 'lin5b'> "+datMunicipio[0][12] + "</td></tr>")
    $('#recMpoDatos').append("<tr><td> Clasificación: </td>"+"<td class= 'lin5b'> "+ etiquetas_breaks[math.abs(datMunicipio[0][11]-5)] + "</td></tr>")





    //res_imunac(datMunicipio,'#ImunacSummaryMPO');
    var columna=getRow(getCol(imunac_municipios,11),5,0)
    var maximo = math.max(getCol(imunac_municipios,4))
	var minimo = math.min(getCol(imunac_municipios,4))


  	//var dataplot = [['Muy Bajo',imunac_municipios[0][11]],['Bajo',imunac_municipios[0][12]],['Medio',imunac_municipios[0][13]],['Alto',imunac_municipios[0][14]],['Muy alto',imunac_municipios[0][15]]];
  	//var identplot = 'grafico_mpos_' + datRegion[0][1];
  	//var objetocadena = "<div id='"+ identplot +"' class= 'barplotareaMPO'> </div>" 
  	
    //$("#PlotGrupMPO").append(objetocadena);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    //var colores = ['#bfb1d5','#f0e0a2','#abe1fd','#adddcf','#ffddcf'];
    //var colores = ['#ccccee','#aaaacc','#8888aa','#565678','#333355'];
    //cambiaPlotBar(dataplot, 1,colores,"IMUNAC - " + datRegion[0][2],identplot,'uno');

  	var pilaplot = [['Destinos',datMunicipio[0][8]],['Conectividad',datMunicipio[0][7]],['Entorno Urbano',datMunicipio[0][6]],['Servicios Básicos',datMunicipio[0][5]],['<b>IMUNAC</b>',datMunicipio[0][4]]];
  	var identplotP = 'grafico_PI_' + datMunicipio[0][1];
  	var objetocadenaP = "<div id='"+ identplotP +"' class= 'barplotareaMPO'> </div>" 
  
    $("#ResPilarMPO").append(objetocadenaP);
    //cambiaPlot(matrix, col,tonos, titulo,elemento)
    var coloresP = [ getColor2(datRegion[0][8],breaks_5[4],colors_5[4])[0],
				    getColor2(datRegion[0][7],breaks_5[3],colors_5[3])[0],
				    getColor2(datRegion[0][6],breaks_5[2],colors_5[2])[0],
				    getColor2(datRegion[0][5],breaks_5[1],colors_5[1])[0],
				    getColor2(datRegion[0][4],breaks_5[0],colors_5[0])[0]];

     
    cambiaPlotBar(pilaplot, 1,coloresP,"",identplotP,'pilar');



	var encabezado= [ { title: "CLAVE"},{ title: 'Nivel'},{ title: "ID"},{ title: "IMUNAC"},{ title: "ISB"},{ title: "IEU"},{ title: "ICN"},{ title: "IDT"},{ title: "POBLACIÓN"}];
	var colorcols = [3,4,5,6,7];
	//colorcols = [0];
	var ocultar = [0,2];
	var table = $("#TabMunicipioMPO").DataTable();
	table.destroy();	

    var datMunicipios2 =transpose([getCol(datMunicipio, 1),getCol(datMunicipio, 2),getCol(datMunicipio, 3),getCol(datMunicipio, 4).map(fixedfmt),getCol(datMunicipio, 5).map(fixedfmt),getCol(datMunicipio, 6).map(fixedfmt),getCol(datMunicipio, 7).map(fixedfmt),getCol(datMunicipio, 8).map(fixedfmt),getCol(datMunicipio, 9),getCol(datMunicipio, 10),getCol(datMunicipio, 11),getCol(datMunicipio, 12),getCol(datMunicipio, 13),getCol(datMunicipio, 14)]);
	
	GeneraTabla(datMunicipios2,encabezado,'#TabMunicipioMPO',colorcols,breaks_5,colors_5,false,false,ocultar, true)
    var table3 = $('#TabMunicipioMPO').DataTable();
    //añadimos otros niveles
     
     unaregion = getRow(imunac_regiones,REGvigente,1);
     unestado = getRow(imunac_estados,EDOvigente,1);
     unaMesoRegion = getRow(imunac_mesoregiones,MesoREGvigente,1);
		table3.row.add( [
            unaregion[0][1], "Región: " +  unaregion[0][2],unaregion[0][4],fixedfmt(unaregion[0][4]),fixedfmt(unaregion[0][5]),
            fixedfmt(unaregion[0][6]),fixedfmt(unaregion[0][7]),fixedfmt(unaregion[0][8]),unaregion[0][9],unaregion[0][10]
        ] ).draw( false );
     
     table3 = $('#TabMunicipioMPO').DataTable();
		table3.row.add( [
            unestado[0][1],"Estado: " +  unestado[0][2],unestado[0][4],fixedfmt(unestado[0][4]),fixedfmt(unestado[0][5]),
            fixedfmt(unestado[0][6]),fixedfmt(unestado[0][7]),fixedfmt(unestado[0][8]),unestado[0][9],unestado[0][10]
        ] ).draw( false );

	table3 = $('#TabMunicipioMPO').DataTable();
		table3.row.add( [
            unaMesoRegion[0][1],"Mesorregión: " +  unaMesoRegion[0][2],unaMesoRegion[0][4],fixedfmt(unaMesoRegion[0][4]),fixedfmt(unaMesoRegion[0][5]),
            fixedfmt(unaMesoRegion[0][6]),fixedfmt(unaMesoRegion[0][7]),fixedfmt(unaMesoRegion[0][8]),unaMesoRegion[0][9],unaMesoRegion[0][10]
        ] ).draw( false );

	table3 = $('#TabMunicipioMPO').DataTable();
		table3.row.add( [
            imunac_nacional[0][1],imunac_nacional[0][2],imunac_nacional[0][4],fixedfmt(imunac_nacional[0][4]),fixedfmt(imunac_nacional[0][5]),
            fixedfmt(imunac_nacional[0][6]),fixedfmt(imunac_nacional[0][7]),fixedfmt(imunac_nacional[0][8]),imunac_nacional[0][9],imunac_nacional[0][10]
        ] ).draw( false );


	    $('#TabMunicipioMPO tbody').on('mouseenter', 'td', function () {
	    	var table3 = $('#TabMunicipioMPO').DataTable();
	    	var clave_clk3 =  table3.row( this ).data()[0];
	    	var nombre03 =  table3.row( this ).data()[1];
	        var rowIdx3 = table3.cell(this).index().row;
			if(clave_clk3==EDOvigente){
				mapMunicipioMPO.fitBounds(geojsonmunicipioMpoEnt.getBounds());
			}
			if(clave_clk3.length==4){
				mapMunicipioMPO.fitBounds(geojsonmunicipioMpoReg.getBounds());	
			}
			if(clave_clk3.length==5){
				mapMunicipioMPO.fitBounds(geojsonmunicipioMpoMpo.getBounds());	
			}
			if(clave_clk3=='00'){
				mapMunicipioMPO.setView(new L.LatLng(22.870697, -101.393824),3.6);	
			}
			if(clave_clk3==MesoREGvigente){
				mapMunicipioMPO.fitBounds(geojsonmunicipioMpoMesoReg.getBounds());	
			}

	        //alert( 'Esta liga se direcciona al municipio con clave ' + clave_clk3 + "  " + nombre03 );
	    } );

	    $('#TabMunicipioMPO tbody').on('click', 'td', function () {
	    	var table3 = $('#TabMunicipioMPO').DataTable();
	    	var clave_clk3 =  table3.row( this ).data()[0];
	    	var nombre03 =  table3.row( this ).data()[1];
	        var rowIdx3 = table3.cell(this).index().row;
			if(clave_clk3==EDOvigente){
				goEstado();
			}
			if(clave_clk3.length==4){
				goRegion();	
			}
			if(clave_clk3=='00'){
				goMesoRegion();
			}
			if(clave_clk3==MesoREGvigente){
				goMesoRegion();
			}

	        //alert( 'Esta liga se direcciona al municipio con clave ' + clave_clk3 + "  " + nombre03 );
	    } );




console.log("soy la " + clave)
    vistaregMpoReg(clave);

    	carga_tablaescala2('Tmun','#TabEscalaMPO');

   // ajusta01layer('geojsonRegionMpoReg',"'#c0b0a0'",1,0.6,"ENTREG!='"+clave+"'");
   // ajusta01layer('geojsonRegionMpoReg',"'orange'",1,0,"ENTREG=='"+clave+"'");
    

    /*$("#RM_sel").append(muetraEnPlot(datRegion[0][2],datMunicipios));


    	var axislab=['Servicios Básicos','Entorno Urbano','Conectividad','Destinos'];
    	var axisXvar=[4,4,4,5,5,6];
    	var axisYvar=[5,6,7,6,7,7];
	   $("#relacionPilaresREG").empty();
	   for(var i=0; i<6;i++){
	   		var idobj ="relPil" + i ;
	   		
	   	    $("#relacionPilaresREG").append("<div id='" + idobj +"'class= 'scatterplotareaREG'> </div>");	
	   	     cambiaPlot2(datMunicipios2, axisXvar[i],axisYvar[i],'rgb(12,112,200)',datRegion[0][2],idobj, axislab[axisXvar[i]-4],axislab[axisYvar[i]-4]);	    
	   };
	dibujaplots(clave)*/

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
			if ( procesoMpoReg >1 ){map.removeLayer(geojsonMpoReg);};
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



