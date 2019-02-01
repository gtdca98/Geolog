//Funciones compartidas en JS

function popitup() {
	newwindow=window.open('tree_vision.html','name');
	if (window.focus) {newwindow.focus()}
	return false;
}



function fixedfmt(value){
	return parseFloat(Math.round(value * 100) / 100).toFixed(1);
}

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



function takeFromMun1 (element) {
  var valork = Number(datosmun1k[0][element]);
  return valork;
};

function translucido(valor){
	return (100-valor);
};

function takeFromNombres (element) {
  var nomine = col_nombres[element];
  return nomine;
};




// carga la tabla en rec_tabla


function findjson (arr, key, val) { // Find array element which has a key value of val 
  for (var ai, i = arr.length; i--;)
    if ((ai = arr[i]) && ai[key] == val)
      return ai;
  return null;
}


function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function checkTotal_est(clave) {
	function checkClave(unalinea) {
    	return unalinea[1] == clave;
	}
	buscado = imunac_estados.filter(checkClave);
	return buscado[0][4] 
};

function checkTotal_reg(clave) {
	function checkClave(unalinea) {
    	return unalinea[1] == clave;
	}
	buscado = imunac_regiones.filter(checkClave);
	return buscado[0][4] 
};


function checkTotal_mpo(clave) {
    if(clave==='23011'){
    	// ajuste para puerto moreloes en Quintana Roo 
		clave= '23005';
	};
	function checkClave(unalinea) {
    	return unalinea[1] == clave;
	};
	buscado = imunac_municipios.filter(checkClave);
	return buscado[0][4] 
};


//col = IMUNAC=4  SB=5 EU=6 IC=7 ID=8
function checkTotal_mpo2(clave,col) {
    if(clave==='23011'){
		clave= '23005'
	}
	function checkClave(unalinea) {
    	return unalinea[1] == clave;
	}
	buscado = imunac_municipios.filter(checkClave);
	return buscado[0][col] 
};

function checkTotal_reg2(clave,col) {
	function checkClave(unalinea) {
    	return unalinea[1] == clave;
	}
	buscado = imunac_regiones.filter(checkClave);
	return buscado[0][col] 
	
};


var etiquetas_breaks=['Muy Alto','Alto','Medio','Bajo','Muy Bajo'];
var imunac_breaks= [69.39,51.67,44.15,37.64];
var isb_breaks   = [88.27,80.40,71.78,60.16];
var ieu_breaks   = [76.20,61.18,52.19,41.57];
var ic_breaks    = [64.41,35.53,27.99,21.22];
var id_breaks    = [60.76,32.23,25.65,18.93];

var Rimunac_breaks= imunac_breaks.map(function(i){return math.round(i,0)});
var Risb_breaks   = isb_breaks.map(function(i){return math.round(i,0)});
var Rieu_breaks   = ieu_breaks.map(function(i){return math.round(i,0)});
var Ric_breaks    = ic_breaks.map(function(i){return math.round(i,0)});
var Rid_breaks    = id_breaks.map(function(i){return math.round(i,0)});


breaks_5 = [imunac_breaks,isb_breaks,ieu_breaks,ic_breaks,id_breaks];
Rbreaks_5 = [Rimunac_breaks,Risb_breaks,Rieu_breaks,Ric_breaks,Rid_breaks];


var imunac_breake= [76.07,63.39,60.69,56.58];
var isb_breake   = [88.86,84.07,81.26,78.22];
var ieu_breake   = [82.62,71.99,68.70,62.18];
var ic_breake    = [74.80,49.13,45.18,40.28];
var id_breake    = [70.76,50.47,48.07,42.05];
breaks_5e = [imunac_breake,isb_breake,ieu_breake,ic_breake,id_breake];

var imunac_breakr= [71.29,58.75,50.49,43.97];
var isb_breakr   = [88.45,82.91,75.66,65.95];
var ieu_breakr   = [77.96,66.99,58.50,49.72];
var ic_breakr    = [70.18,42.56,34.35,28.73];
var id_breakr    = [62.63,44.79,34.77,27.96];
breaks_5r = [imunac_breakr,isb_breakr,ieu_breakr,ic_breakr,id_breakr];

var Rimunac_breakr= imunac_breakr.map(function(i){return math.round(i,0)});
var Risb_breakr   = isb_breakr.map(function(i){return math.round(i,0)});
var Rieu_breakr   = ieu_breakr.map(function(i){return math.round(i,0)});
var Ric_breakr    = ic_breakr.map(function(i){return math.round(i,0)});
var Rid_breakr    = id_breakr.map(function(i){return math.round(i,0)});

Rbreaks_5r = [Rimunac_breakr,Risb_breakr,Rieu_breakr,Ric_breakr,Rid_breakr];

var imunac_colors = ['#333355','#565678','#8888aa','#aaaacc','#ccccee'];
var isb_colors   = ['#013548','#045560','#247782','#4699a4','#68aab7'];
var ieu_colors	 = ['#907b10','#a28c32','#c4ae53','#e6d175','#f8e497'];
var ic_colors	 =   ['#566609','#78882a','#9aaa4c','#bccc6e','#deee8f'];
var id_colors    = ['#863010','#a85232','#ca7454','#ec9676','#feb898'];

colors_5 = [imunac_colors,isb_colors,ieu_colors,ic_colors,id_colors]


function rango_exp(breaks,id){
	var nc_1=[];
	c_1 = breaks[id];
	nc_1[0]='(' +c_1[0] + '- 100]';
	nc_1[1]='(' +c_1[1] +' - '+ c_1[0] +']';
	nc_1[2]='(' +c_1[2] +' - '+ c_1[1] +']';
	nc_1[3]='(' +c_1[3] +' - '+ c_1[2] +']';
	nc_1[4]='[0 -' +c_1[3]  +']';
	return nc_1;
};



var tablaescala_m = transpose([etiquetas_breaks,rango_exp(Rbreaks_5,0),rango_exp(Rbreaks_5,1),rango_exp(Rbreaks_5,2),rango_exp(Rbreaks_5,3),rango_exp(Rbreaks_5,4)])
var tablaescala_r = transpose([etiquetas_breaks,rango_exp(Rbreaks_5r,0),rango_exp(Rbreaks_5r,1),rango_exp(Rbreaks_5r,2),rango_exp(Rbreaks_5r,3),rango_exp(Rbreaks_5r,4)])
var tablaescala_e = transpose([etiquetas_breaks,rango_exp(breaks_5e,0),rango_exp(breaks_5e,1),rango_exp(breaks_5e,2),rango_exp(breaks_5e,3),rango_exp(breaks_5e,4)])





function getColor2(cellData,breaks,color){
		      if ( cellData <= breaks[3] ) {
		        colorOut=color[4];
		        grupoOut=etiquetas_breaks[4];
		      };
		      if ( cellData > breaks[3] & cellData <= breaks[2] ) {
		        colorOut=color[3];
		        grupoOut=etiquetas_breaks[3];
		      };
			  if ( cellData > breaks[2] & cellData <= breaks[1] ) {
		        colorOut=color[2];
		        grupoOut=etiquetas_breaks[2];
		      };
			  if ( cellData > breaks[1] & cellData <= breaks[0] ) {
		        colorOut=color[1];
		        grupoOut=etiquetas_breaks[1];
		      };

		      if ( cellData >  breaks[0] ) {
		        colorOut=color[0];
		        grupoOut=etiquetas_breaks[0];
		      };
		      var salida = [colorOut,grupoOut]
		      return salida;
};

function getGrupo(cellData,breaks){
		      if ( cellData < breaks[3] ) {
		        grupoOut=etiquetas_breaks[4];
		      };
		      if ( cellData >= breaks[3] & cellData < breaks[2] ) {
		        grupoOut=etiquetas_breaks[3];
		      };
			  if ( cellData >= breaks[2] & cellData < breaks[1] ) {
		        grupoOut=etiquetas_breaks[2];
		      };
			  if ( cellData >= breaks[1] & cellData < breaks[0] ) {
		        grupoOut=etiquetas_breaks[1];
		      };

		      if ( cellData >=  breaks[0] ) {
		        grupoOut=etiquetas_breaks[0];
		      };
		      return grupoOut;
};


// tiene los rangos de verdes que se usan para ilumimar renglones y poligonos del mapa
function getColor(cellData){
		      if ( cellData < 37.64 ) {
		        colorOut='#e4f1c3';
		      };
		      if ( cellData >= 37.64 & cellData < 44.15 ) {
		        colorOut='#bad696';
		      };
			  if ( cellData >= 44.15 & cellData < 51.67 ) {
		        colorOut='#9ebf6d';
		      };

		      if ( cellData >=  51.67 ) {
		        colorOut='#83993a';
		      };
		      return colorOut;
};


function res_imunac(datos,objeto){
	var htmltxt = "<div class ='centra_4lin'> <h6 > Desv. estándar " +  math.round(math.std(getCol(datos,4)),2).toFixed(2) +" </h6>";
        htmltxt = htmltxt +  "<h6 > Mínimo " + math.round(math.min(getCol(datos,4)),2).toFixed(1) + "</h6>";
        htmltxt = htmltxt +  "<h6 > Máximo " + math.round(math.max(getCol(datos,4)),2).toFixed(1) + "</h6>";
        htmltxt = htmltxt +  "<h6 > Municipios " + datos.length  + "</h6> </div>";    
    $(objeto).append(htmltxt);
};


//// Resalta en azul  el renglon de la tabla si la celda en la columna 0 
//// coincide con la clave recibida

function map2tbl(clave0,objeto){
	console.log(clave0+ " "+ objeto)
    var table = $(objeto).DataTable();


    var grafSel = clave0;
    var indexesno = table.rows().eq( 0 ).filter( function (rowIdx) {
                return table.cell( rowIdx, 0 ).data() != grafSel ? true : false;
            } );

      // encuentra los indices que contienen el texto grafSel text en la segunda columna
      var indexes = table.rows().eq( 0 ).filter( function (rowIdx) {
          return table.cell( rowIdx, 0 ).data() === grafSel ? true : false;
      } );

      //var datos = table.cell(indexes[0],3).data();
      $('#mre_sel').text(table.cell(indexes[0],1).data() +" IMUNAC  " + table.cell(indexes[0],3).data());

	  //var selectedRow = $(objeto + ' tbody tr').eq(indexes[0]);
	   //$('.dataTables_scrollBody').scrollTop(selectedRow.prop('offsetTop') - $('.dataTables_scrollBody').height()/2);

       //table.row( indexes[0] ).scrollTo(true);

    table.rows( indexesno )
        .nodes()
        .to$()
        .removeClass( 'boldROW' );

    table.rows( indexes )
          .nodes()
          .to$()
          .addClass( 'boldROW' );
} ;


function ajusta01layer(objeto,fillColor,opacity,fillOpacity,condicion){
	var condstr=  objeto + ".eachLayer(function(layer) { if (layer.feature.properties."+condicion+")";
		var comando= condstr + " {layer.setStyle({color: 'black',weight: 2,fillColor: "+fillColor+",opacity:" +opacity+ " ,fillOpacity: "+fillOpacity+"});};});";
	 	eval(comando);
	 	//console.log(comando);
};


function ajusta02layer(objeto,fillColor,opacity,fillOpacity,condicion){
	var coords=[]; 
	var condstr=  objeto + ".eachLayer(function(layer) { if (layer.feature.properties."+condicion+")";
		var comando= condstr + " {coords =layer.getBounds();};});";
	 	eval(comando);
	    mapMR.fitBounds(coords);
	 	
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



function muetraEnPlot(leyenda,datos){
	var links = "<span class= 'txt_12em'>"+leyenda+":</span><span> &emsp; -";
	for(var i=0; i<datos.length; i++){
		links = links + '<a href="javascript:dibujaplots('+ "'" + datos[i][1] +  "'" + ')">'+datos[i][2]+'</a>- &emsp;'
	};
	links = links + "</span> ";
	return links;
};


function dibujaplots(clave){
	var nivel = "R";
	if (clave.length==2){
		var nivel = "E";
	}
	if (clave.length==4){
		var nivel = "R";
	}
	if (clave.length==5){
		var nivel = "M";
	}

	if (nivel === "E"){
		var rowse=getRow(imunac_estados,clave,1);
		var diamcol='#000FFF';
	};
	if (nivel === "R"){
		var rowse=getRow(imunac_regiones,clave,1);
		var diamcol='#000FFF';
	};
	if (nivel === "M"){
		var rowse=getRow(imunac_municipios,clave,1);
		var diamcol='#000FFF';
	};


		
		agregaSelec('relPil0',5,6,clave,nivel,rowse,diamcol);
		agregaSelec('relPil1',5,7,clave,nivel,rowse,diamcol);
		agregaSelec('relPil2',5,8,clave,nivel,rowse,diamcol);
		agregaSelec('relPil3',6,7,clave,nivel,rowse,diamcol);
		agregaSelec('relPil4',6,8,clave,nivel,rowse,diamcol);
		agregaSelec('relPil5',7,8,clave,nivel,rowse,diamcol);

};

function agregaSelec(seccion,col1,col2,clave,nivel,rowse,diamcol){
	while (window[seccion].data.length > 2 ) { Plotly.deleteTraces(seccion,2); } ;
	edoXloc= clave;
	
	var nvax= Number(rowse[0][col1]);
	var nvay= Number(rowse[0][col2]);
	var nval= edoXloc;
	
	Plotly.addTraces(seccion, {x: [nvax], y: [nvay] ,text: nval, type: 'scatter',hoverinfo: "x+y",  marker: {symbol:'diamond', size:12, color: diamcol, opacity: .6 }} );

  };





//dibuja individualmente los plots de barras de los grupos 
function cambiaPlotBar(matrix, col,tonos, titulo,elemento,cantidad){
       var angulo = 270;
       var fonty =10;
       var margL = 30;
       var xlabel ='Porcentaje de municipios';
       var anchos = [.7,.7,.7,.7,.7];
       var gradacion = [0,10,20,30,40,50,60,70,80,90,100];
       var xran =[ -10, 120 ];
       var psx = 'bottom';
       var tkfnt =10;
       var txpos ='outside';
       if (cantidad==='uno'){
	       angulo = 0;
	       fonty =14;
	       margL = 60;
	       xran =[ -3, 115 ];
       };
       if (cantidad==='pilar'){
	       angulo = 0;
	       fonty =18;
	       margL = 200;
	       xlabel = " ";
	       anchos = [.9,.8,.8,.8,.8];
	       gradacion= [0 , 100];
	       psx = "top";
	       xran =[ -3, 110 ];
	       tkfnt =15;
	       txpos = 'outside';
       };


       var dataSetY = getCol(matrix, col); 
       var dataSetX = getCol(matrix, 0);
       var txtdataSetY = getCol(matrix, col); 
       if (cantidad!='pilar'){
       		for(var i=0;i<txtdataSetY.length;i++){
    		   txtdataSetY[i]=txtdataSetY[i]+'%';
			};
		};

       if (cantidad==='pilar'){
       		for(var i=0;i<txtdataSetY.length;i++){
    		   txtdataSetY[i]=fixedfmt(txtdataSetY[i],1);
			};
		};


       var TESTER = document.getElementById(elemento);
        Plotly.newPlot( TESTER, [{
            y: dataSetX,
            x: dataSetY,
            type: 'bar',
            text: txtdataSetY,
  			textposition: txpos,//'outside',
  			hoverinfo: 'none',
            //text:dataSetX,
            //hoverinfo:'none',
            orientation: 'h',
            width: anchos,
            marker: {
            	//color: imunac_colors.reverse(),
              color: tonos,
              opacity: 0.8,
              line: {
                color: 'rbg(8,48,107)',
                width: 0.5
              }
            }
             }], { title : titulo, 
             	titlefont: {
             		family: 'Arial',
             		size: 15,
             		color: '#5b5b5b'
             	},
             	xaxis: {
             	side: psx,
            	showgrid: true,
            	range: xran,
				tickvals:gradacion,
            	ticks: 'inside',
            	title: xlabel,
            	titlefont: {
             		family: 'Arial',
             		size: 12,
             		color: '#5f5f5f'
             	},
			    tickfont: {
			      family: 'Old Standard TT, serif',
			      size: tkfnt,
			      color: '#765432'
			    }
			},
			    yaxis: {
            	showgrid: true,
            	tickangle: angulo,
            	ticks: 'outside',
            	ticklen:2,
            	title: '',
			    tickfont: {
			      family: 'Old Standard TT, serif',
			      size: fonty,
			      color: '#765432'
			    }

			  },
            margin: { t: 50,  r:25, l:margL ,b:35}} ,{displayModeBar: false});
    }



//dibuja individualmente los plots
    function cambiaPlot2(matrix, col1,col2,tonos, titulo,elemento,xlab,ylab){

        var dataSetY = getCol(matrix, col2); 
        var dataSetX = getCol(matrix, col1);
        var maxY= Math.max.apply(Math, dataSetY)+5
        var maxX= Math.max.apply(Math, dataSetX)+5
        var minY= Math.min.apply(Math, dataSetY)-5
        var minX= Math.min.apply(Math, dataSetX)-5

		var dataLbl = getCol(matrix, 2);
		for(var i=0;i<dataLbl.length;i++){
    		dataLbl[i]='<b>'+dataLbl[i]+'</b>';
			};
		var dataHov = getCol(matrix, 1);
		var sumx=0;
		var sumy=0;
		var mediax= dataSetX.reduce(function(sumx, a) { return sumx + Number(a) },0)/(dataSetX.length||1);
		var mediay= dataSetY.reduce(function(sumy, a) { return sumy + Number(a) },0)/(dataSetX.length||1);

		var trace1 = {
            x: dataSetX,
            y: dataSetY,
            text: dataHov,
            marker: { size: 6, color: "black" },
            type: 'scatter',
            mode: 'markers',
            hoverinfo: 'text',
            			
		};

		var trace2 = {
            x: dataSetX,
            y: dataSetY,
            text: dataLbl,
            type: 'scatter',
            mode: 'text',
            hoverinfo: 'none',
            textposition:'bottom',
            textfont: {
			      family:  "Arial Narrow",
			      size: 12,
			      color: '#dd0000'
			    }

		};


		var layout = {
			showlegend: false,	
			title : titulo, 
            margin: { t: 50, l: 35 ,r:25, b:35} ,
            xaxis: {
            	showgrid: true,
            	ticks: 'inside',
            	title: xlab,
			    //range: [ 0, 100 ],
				//tickvals:[0,10,20,30,40,50,60,70,80,90,100],
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
			    //range: [0, 100],
			    //tickvals:[0,10,20,30,40,50,60,70,80,90,100],
			    tickfont: {
			      family: 'Old Standard TT, serif',
			      size: 10,
			      color: '#765432'
			    }
			},
			shapes: [ {
	                  type: 'rect',
	                  x0: minX,
	                  y0: minY,
	                  x1: mediax,
	                  y1: mediay,
	                  line: {
	                    color: '#eff2f1',
	                    width: 1
	                	},
	                  fillcolor:'#eff2f1',
	                  opacity:.4

	                },
	                {
	                  type: 'rect',
	                  x0: minX,
	                  y0: mediay,
	                  x1: mediax,
	                  y1: maxY,
	                  line: {
	                    color: '#d0deca',
	                    width: 1
	                	},
	                  fillcolor:'#d0deca',
	                  opacity:.4

	                },
					{
	                  type: 'rect',
	                  x0: mediax,
	                  y0: minY,
	                  x1: maxX,
	                  y1: mediay,
	                  line: {
	                    color: '#d0deca',
	                    width: 1
	                	},
	                  fillcolor:'#d0deca',
	                  opacity:.4

	                },
	                {
	                  type: 'rect',
	                  x0: mediax,
	                  y0: mediay,
	                  x1: maxX,
	                  y1: maxY,
	                  line: {
	                    color: '#9ed8a7',
	                    width: 1
	                	},
	                  fillcolor:'#9ed8a7',
	                  opacity:.4


	                },
	                {
	                  type: 'line',
	                  x0: minX,
	                  y0: mediay,
	                  x1: maxX,
	                  y1: mediay,
	                  line: {
	                    color: 'rgb(128, 128, 128)',
	                    width: 2}

	                },
	                {
	                  type: 'line',
	                  x0: mediax,
					  y0: minY,
	                  x1: mediax,
	                  y1: maxY,
	                  line: {
	                    color: 'rgb(128, 128, 128)',
	                    width: 2}
	                    
	                }  ],
	                margin: { t: 35,  r:25, l:30 ,b:35}
		};
		var data = [ trace1]; //,trace2

       var TESTER = document.getElementById(elemento);
        Plotly.newPlot( TESTER, data, layout ,{displayModeBar: false} );

    }



function GeneraTabla(datos,encabezado,objeto,colorcols,cortes,colores,buscar,ordenar,ocultar,simple){
   var paginacion = false;
   if (datos.length > 16) {
   		paginacion = true;
   };
   if (simple===true){
   	    var Mensajestbl = { sProcessing:"Procesando...", sLengthMenu:  "Mostrar _MENU_ registros",
	    sZeroRecords:"No se encontraron resultados",sEmptyTable:"",sInfoEmpty:"",sInfoFiltered:"",sInfo:"",
   		LoadingRecords:  "Cargando...", sPaginate: {First:"Primero",Last:"Último",Next:"Siguiente",Previous: "Anterior"}};
   	    var grises = [ 0,1,2,3];

   	    paginacion = false;
   }else{
   	    var Mensajestbl = {sProcessing:"Procesando...",sLengthMenu:"Mostrar _MENU_ registros",
   	    sZeroRecords:"No se encontraron resultados",sEmptyTable:"Ningún dato disponible en esta tabla",
	    sInfoEmpty:"Mostrando registros del 0 al 0 de un total de 0 registros",sInfoFiltered:"(filtrado de un total de _MAX_ registros)",
   		sInfo:"Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
   		search:"Búsqueda  : <img src= 'img/search.png' height='22' width='22'>",
   		LoadingRecords:"Cargando...", oPaginate: {sFirst:"Primero",sLast:"Último",sNext:"Siguiente",sPrevious: "Anterior"}};
   		var grises = [ 0,1,8 ];
   };

   $(objeto).DataTable( {
   	// configuracion de mensajes en español
      language : Mensajestbl,
     
      data: datos,

        "scrollY":        "400px",
        //"sScrollY": ($(window).height() + 250),
        "scrollCollapse": true,
        "paging":         paginacion,
        "pageLength": 16,
         "ordering": ordenar,
         "searching": buscar,

      columns: encabezado,
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		    "targets": colorcols,
		    "createdCell": function (td, cellData, rowData, row, col) {

		    	if (colorcols.length>3) {
			    	colref=col-3;
			    	colores_p=getColor2(cellData,cortes[colref],colores[colref])
			    	$(td).css('background-color', colores_p[0]);
	                if (colref==0){
	                	$(td).css('font-size', "1.2em");
	                }
	                if (colores_p[1] === 'Muy Alto' || colores_p[1] === 'Alto'){
			    		$(td).css('color', "white");
			    	};
			    };

		    }
		  },
			{
       	    	"visible": false, 
       	    	"aTargets": ocultar
       	    }, 

		  { //  agragamos la clase gris que en css se define el color de fondo en gris
		  	"sClass": "gris", 
		    "aTargets": grises 
		  }
		   ]

          
  } );

};

function carga_tablaescala2(nivel,objeto){
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


  var vacia = ["","","","",""];
  var datostbl =  transpose([getCol(datosbase,0),getCol(datosbase,1),vacia,getCol(datosbase,2),vacia,getCol(datosbase,3),vacia,getCol(datosbase,4),vacia,getCol(datosbase,5),vacia]);
 
  var mediciones = ['NIVEL',"IMUNAC","","SERVICIOS BÁSICOS","","ENTORNO URBANO","","CONECTIVIDAD","","DESTINOS",""];
 
  //var nuevosdatos = transpose(datosTbl);

   $(objeto).DataTable( {
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

        "scrollY":        "100px",
        //"sScrollY": ($(window).height() + 250),
        "scrollCollapse": true,
        "paging":         false,
        "pageLength": 300,
         "ordering": false,
         "searching": false,
      columns: [ // definicion de los titulos de los encabezados
          { title: "NIVEL"},
          { title: "IMUNAC"},
          { title: ""},
          { title: "ISB"},
          { title: ""},
          { title: "IEU"},
          { title: ""},
          { title: "ICN"},
          { title: ""},
          { title: "IDT"},
          { title: ""}
          ],
       columnDefs: [ { // damos color a celdas particulares de acuerdo a su valor numerico
		   // "targets": [1,2,3,4,5],
		    "targets": [2,4,6,8,10],
		    "createdCell": function (td, cellData, rowData, row, col) {
		    	//colref=col-1;
		    	colref=(col/2)-1;
		    	$(td).css('background-color', colors_5[colref][row]);
		    	if (row <2 ){
		    		
		    		$(td).css('color', "white");
		    	};
		    }
		  },
		  {
		  	"targets": [1,3,5,7,9],
		  	"createdCell": function (td, cellData, rowData, row, col) {
		    	$(td).css('text-align','center');
		    }

		  },
		  { //  agragamos la clase gris que en css se define el color de fondo en gris
		  	"sClass": "sgris", 
		    "aTargets": [ 0] 
		  }
		   ]

          
  } );

};


