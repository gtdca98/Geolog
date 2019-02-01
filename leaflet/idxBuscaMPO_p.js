
	function searchTree(obj,search,path){
		if(obj.name === search){ //if search is found return, add the object to the path and return it
			path.push(obj);
			return path;
		}
		else if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
			var children = (obj.children) ? obj.children : obj._children;
			for(var i=0;i<children.length;i++){
				path.push(obj);// we assume this path is the right one
				var found = searchTree(children[i],search,path);
				if(found){// we were right, this should return the bubbled-up path from the first if statement
					return found;
				}
				else{//we were wrong, remove this parent from the path and continue iterating
					path.pop();
				}
			}
		}
		else{//not the right object, return false so it will continue to iterate in the loop
			return false;
		}
	}

	function extract_select2_data(node,leaves,index){
	        if (node.children){
	            for(var i = 0;i<node.children.length;i++){
	                index = extract_select2_data(node.children[i],leaves,index)[0];
	            }
	        }
	        else {
	            leaves.push({id:++index,text:node.name});
	        }
	        return [index,leaves];
	}


// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 1300 - margin.right - margin.left,
	height = 570 - margin.top - margin.bottom;
	//height = 35500 - margin.top - margin.bottom;
var i = 0,
	duration = 3750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#arbol").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#arbol").append("div")
   .attr("class", "tooltip")
   .style("opacity", 1e-6);


var tooltip = d3.select("#arbol")
	.append("div")
	.style("position", "absolute")
	.style("background-color", "#ffaacc")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip" );

root = treeData[0];

select2_data = extract_select2_data(root,[],0)[1];

root.x0 = height / 2;
root.y0 = 0;

root.children.forEach(collapse);  
update(root);


$("#search").select2({
  data: select2_data,
  containerCssClass: "search"
});

//update(root);
	//attach search box listener
	$("#search").on("select2-selecting", function(e) {

		root.children.forEach(collapse);  
		update(root);
		var paths = searchTree(root,e.object.text,[]);
		for(var i =0;i<paths.length;i++){
			paths[i].class = 'nofound';
			console.log(paths[i].class)
		}
		
		if(typeof(paths) !== "undefined"){

			openPaths(paths);
		}
		else{
			alert(" No se localizó:" + e.object.text);
		}
	})


d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6)
	  .on("mouseover", mouseover)
      .on("mousemove", function(d){mousemove(d);})
      .on("mouseout", mouseout)
      .on('contextmenu',clickl);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  
		nodeUpdate.select("circle")
			.attr("r", 4.5)
			.style("fill", function(d) {
				if(d.class === "found"){
					return "#ff4136"; //red
				}
				else if(d._children){
					return "lightsteelblue";
				}
				else{
					return "#fff";
				}
			})
			.style("stroke", function(d) {

				if(d.class === "found"){
					return "#ff4136"; //red
				}else{
					return "#ccc"; //gray
				}
		});



  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.

	link.transition()
		.duration(duration)
		.attr("d", diagonal)
		.style("stroke",function(d){
			if(d.target.class==="found"){
				return "#ff4136";
			}else{
				return "#ccc";
			}
		});


  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });

  nodes.forEach(function(d) {
  	//console.log(d)
  	//var  k = d.text;
  	//k.on("mouseover", alert("esud"));
  });

 

}


// Toggle children on normal mouse click.
function click(d) {
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
  // solo si es nodo de municipio se va a la página con click
  console.log(d.clave)
  kks=d.clave
  if (kks.length==5){
  	MPOvigente=kks;
  	var datMunicipio=getRow(imunac_municipios,MPOvigente,1);
  	REGvigente=datMunicipio[0][0];
  	EDOvigente=MPOvigente.substr(0,2);
	MesoREGvigente= datMunicipio[0][10];
	goMunicipio(MPOvigente);
  }

}


//asi muestra el primer nivel abierto
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }


// rutina del boton alterno del mouse
function clickl(d) {
	 d3.event.preventDefault();
		kks=d.clave
		if (kks.length==5){
		 	MPOvigente=kks;
		  	var datMunicipio=getRow(imunac_municipios,MPOvigente,1);
		  	REGvigente=datMunicipio[0][0];
		  	EDOvigente=MPOvigente.substr(0,2);
			MesoREGvigente= datMunicipio[0][10];
			goMunicipio(MPOvigente);
		}

    	if (kks.length==4){
		 	REGvigente=kks;
		  	EDOvigente=REGvigente.substr(0,2);
			goRegion(REGvigente);
		}
    	if (kks.length==2){
    		EDOvigente=kks
			goEstado(kks);
		}
    	if (kks.length==1){
			tooglehome('seccionNacional');
		}
}

// estas rutinas se activan al presionar el boton alterno del mouse
/*function goMunicipio(codigo){
	var ruta= 'idxMPO.html?' + codigo;
	window.open(ruta,'_blank');

};

function goEstado(codigo){
	var ruta= 'idxEDO.html?' + codigo;
	window.open(ruta,'_blank');
};

function goRegion(codigo){
	var ruta= 'idxREG.html?' + codigo;
	window.open(ruta,'_blank');
};

function goMesoregion(codigo){
	var ruta= 'imunac.html?' + codigo;
	window.open(ruta,'_blank');
};*/



function flatten(root) {
  var nodes = [], i = 0;
  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }
  recurse(root);
  return nodes;
}

function openPaths(paths){
	for(var i =0;i<paths.length;i++){
		if(paths[i].id !== "1"){//i.e. not root
			paths[i].class = 'found';
			if(paths[i]._children){ //if children are hidden: open them, otherwise: don't do anything
				paths[i].children = paths[i]._children;
    			paths[i]._children = null;
			}
			update(paths[i]);
		};
	}
	// esta seccion cambia remueve la clase que da color pero al no hacer update()
	// la vista no se actualiza
	for(var i =0;i<paths.length;i++){
		if(paths[i].id !== "1"){//i.e. not root
			paths[i].class = 'nofound';
			if(paths[i]._children){ //if children are hidden: open them, otherwise: don't do anything
				paths[i].children = paths[i]._children;
    			paths[i]._children = null;
			}
			//update(paths[i]);
		};
	}
}


function mouseover() {
    div.transition()
    .duration(300)
    .style("opacity", 1);
}

function mousemove(d) {
    div
    .text( d.info)
    .style("left", (d3.event.pageX ) + "px")
    .style("top", (d3.event.pageY) + "px");
}

function mouseout() {
    div.transition()
    .duration(300)
    .style("opacity", 1e-6);
}
	

  function contrae(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

