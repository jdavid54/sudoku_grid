// sudoku functions
// dynamic style when used in separate js file 


var columns= new Array(9);
var zones= new Array(9);

combo=grid9x9();   //union of row, column, zone
candidates=grid9x9();
c_col=grid9x9();
c_zone=grid9x9();

m_edit=grid9x9();

var changed = true;

function grid9x9(){
	var x = new Array(9);
	for (var i = 0; i < x.length; i++) {
		x[i] = new Array(9);
	}		
	return x;
}


function showForm() {      //crÃ©e form et affiche les valeurs de rows
	content='';
	content+='<p id="title"><h3>Sudoku grid input</b></h3>';
	content+='<p>Enter 0 for unknown numbers<br>';
	content+='Replace them with your solutions!</p>';
    content+='<form id="basegrid">';
	content+='<input type="text" id="row1" value="row1"><br>'; 
	content+='<input type="text" id="row2" value="row2"><br>'; 
	content+='<input type="text" id="row3" value="row3"><br>'; 
	content+='<input type="text" id="row4" value="row4"><br>'; 
	content+='<input type="text" id="row5" value="row5"><br>'; 
	content+='<input type="text" id="row6" value="row6"><br>'; 
	content+='<input type="text" id="row7" value="row7"><br>'; 
	content+='<input type="text" id="row8" value="row8"><br>'; 
	content+='<input type="text" id="row9" value="row9"><br>';	
	content+='</form>';
	content+='<p>Then push update button !</p>';
	//document.write('<button onclick="myFunction()">Try it</button>');
	//document.write('<button onclick="fillForm()">Fill it</button>');
	content+='<button onclick="updateValues()">Update it</button>&nbsp;&nbsp;&nbsp;&nbsp;';
	content+='<button onclick="save_grid()">Save grid</button>';
	content+='<p>Just keep updating if any changes occur !</p>';
	//document.write('</div>');
	var x = document.getElementById("formdiv");
	//console.log(x);
	x.innerHTML=content;
	fillForm();
	updateAll();
}

function fillForm() {     // met Ã  jour de form avec rows[] qui doit etre mis Ã  jour avec sync() Ã  partir de candidates
	for (k=0;k<9;k++) {
		var x = document.getElementById("row"+(k+1));
		x.value = rows[k];
	}
}

function updateValues() {  //lit les valeurs dans form et met Ã  jour rows si on rentre une valeur
	for (k=0;k<9;k++) {
		var x = document.getElementById("row"+(k+1));
		rows[k] = x.value;
	}
	console.log(rows);
	updateAll();
}

// Function to download data to a file
// https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
	console.log(file);
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function exportToCsv() {
    var myCsv = "Col1,Col2,Col3\nval1,val2,val3";
    window.open('data:text/csv;charset=utf-8,' + escape(myCsv));
        }

function save_grid() {
	console.log(rows);
	download(rows, 'rows.txt', '');
	//exportToCsv();
}

function populate() {
  //grid to solve
  //console.log('Row array in rows[]');
  for (k=0;k<9;k++){
	//console.log(k,rows[k]);
	}

  //populate column array
  //console.log('Column array in columns[]');
  for (k=0;k<9;k++){
	s='';
	for (l=0;l<9;l++){
		s=s+rows[l].substr(k,1);
		}
	columns[k]=s;
	//console.log(k,s);
  } 

  //populate zone array
  //console.log('Zone array in zones[]');
  for (k=0;k<3;k++){	
	for (l=0;l<3;l++){s=pattern.substr(k,1);
		s='';
		for (m=0;m<3;m++){
			for (n=0;n<3;n++){
				s=s+rows[3*k+m].substr(3*l+n,1);
				zones[3*k+l]=s;					
			}		
		}
	//console.log(3*k+l,s);
	}
  }

  //populate candidates
  //console.log('Candidates array in candidates[rows][columns]');
  //console.log('Combo is union of row, column and zone for each slot');

  for (m=0;m<9;m++){
	for (n=0;n<9;n++){	
		candidates[m][n]='';
		combo[m][n]=rows[m]+'-'+columns[n]+'-'+zones[3*Math.floor(m/3)+Math.floor(n/3)]+m_edit[m][n];
		
		//console.log(m,n,combo[m][n]);
		if (rows[m].substr(n,1)=='0') {
			s='';
			for (k=0;k<9;k++){
				s=pattern.substr(k,1);				
				//document.write(s+'<br>');
				if (!combo[m][n].includes(s)){
					candidates[m][n]+=s;					
				}
				//console.log(m,n,combo[m][n],s,combo[m][n].includes(s));
				//console.log(m,n,candidates[m]);
			}
		}
		else
			candidates[m][n]=rows[m].substr(n,1);
	}

  }

} //end populate()

function makegrid(array) {	// crÃ©e la grille avec candidates
	content='';
	content+='<style>td {font-family:arial; border: 1px solid black; font-size:12px; text-align:left; vertical-align:top; width:50px; height:50px;} .found {font-weight:bold;font-size:20px;text-align:center; vertical-align:middle;} div{display:inline; float:left;} p {font-family:arial; font-size:12px;} .grey {background-color:#f1eeee;}</style>';

	content+='<table width="100%">';
	for (m=0;m<9;m++){
		content+='<tr>';
		for (n=0;n<9;n++){
                        if (((m==0 | m==1 | m==2 | m==6 | m==7 | m==8) && (n==0 | n==1 | n==2 | n==6 | n==7 | n==8))
                         | ((m==3 | m==4 | m==5) && (n==3 | n==4 | n==5))){
                             content += '<td name='+m+n+' class="grey ';}
                        else {
                             content += '<td name='+m+n+' class="';}
			l=array[m][n].length;
			if (l==1) 
				content+=' found">';
			else content+='">';
			content+=array[m][n];
			content+='</td>';
		}
	content+='</tr>';
	}
	content+='</table>';
	var x = document.getElementById("candidategrid");
	//console.log(x);
	x.innerHTML=content;

}

function sync(){  // prend les valeurs de candidates pour mettre Ã  jour rows[] et form avec fillForm()
	for (k=0;k<9;k++){
		for (l=0;l<9;l++){
			if (candidates[k][l].length==1){
				//console.log(candidates[k][l].length);
				if (rows[k].substr(l,1)=='0'){
					//console.log(rows[k].substr(l,1));
					rows[k]=rows[k].substr(0,l)+candidates[k][l]+rows[k].substr(l+1,8-l)
					//console.log(rows[k]);
				}
			}
		}
	}
	fillForm();
}



// fonctions utilisÃ©es par scan()=======================================
function unique(list) {
     changed = false;
     //console.log('unique',list);
     for (k=0;k<9;k++){ 
	s=pattern.substr(k,1);
	var n=0;
	for (l=0;l<list.length;l++){
	    if (list[l].includes(s)){
		n += 1;
		var j1 = l
	    }
	}
     //console.log(list[j1]);
     if (n==1 & list[j1].length != 1) {
        //console.log('unique',s);
	changed = true;
        list[j1] = s
     }
     }
     //console.log(list);
     return list;
} // end unique

function twins(list) {
  changed = false;
  //console.log('twins',list);
  var duo = [];
  var d = 0;
  var criter = "";
  for (i=0;i<9;i++) {
    if (list[i].length == 2) {
        //console.log(list[i]);
	if (list.slice(i+1,9).includes(list[i])) {  // recherche de duos
        //console.log('duo de ',list[i]);
	    duo.push(list[i]);        
        }
              
    }
  }
  //console.log('liste de duos',duo);

  for (d=0;d<duo.length;d++) {
    //console.log('duo en cours',duo[d]);
    for (i=0;i<9;i++) {
      //console.log(list[i]);
      if (list[i] != duo[d] & list[i].length != 1 & duo.indexOf(list[i]) == -1) {
	//console.log(list[i],'case changer');	
        var new2 = "";
	
	for (j=0;j<list[i].length;j++) {
           //console.log(list[i][j]);
           if (duo[d].indexOf(list[i][j]) == -1) {
           //console.log(list[i][j]);
	     changed = true;	
             new2 += list[i].toString()[j];
           }
        }
        list[i] = new2;
      }
    }
  }
  return list;
} //end twins


function makeColumns() {
  // candidates by columns
  for (k=0; k<9; k++){
	for (l=0; l<9; l++){
		c_col[k][l]=candidates[l][k];
		//console.log(c_col[k][l]);
	}
  //console.log(k,candidates[k],c_col[k]);
  }

} //end makeColumns

function makeZones() {
  // candidates by zones
  for (k=0;k<9;k++){	
	for (l=0;l<9;l++){
		c_zone[k][l]=candidates[Math.floor(l/3)+Math.floor(k/3)*3][k%3*3+l%3];					
	}
  }
} //end makeZones

function updateFromCol() {
  for (k=0;k<9;k++){	
	for (l=0;l<9;l++){
           candidates[k][l] = c_col[l][k];
        }
  }
} //end updateFromCol


function updateFromZone() {
  for (k=0;k<9;k++){	
	for (l=0;l<9;l++){
	    //console.log(candidates[Math.floor(l/3)+Math.floor(k/3)*3][k%3*3+l%3]);
            candidates[Math.floor(l/3)+Math.floor(k/3)*3][k%3*3+l%3] = c_zone[k][l];
        }    
  }
  //console.log('end of updateFromZone');
}//end updateFromZone

// end fonctions pour scan()========================================

function scan_rows() {
     //while (changed == true) {
	  //console.log('Scan');
	  // recherche des uniques et des duos dans row,col,zone
	  for (r=0;r<9;r++) {
	    //console.log(candidates[r]);
	    unique(candidates[r]);
	    twins(candidates[r]);
	  }
	  //console.log(candidates);
}

function scan_cols() {	
	  makeColumns();
	  for (r=0;r<9;r++) {
	    //console.log(c_col[r]);
	    unique(c_col[r]);
	    twins(c_col[r]);
	  }
	  //console.log(c_col);
	  updateFromCol();
}

function scan_zones() {	
	  makeZones();
	  for (r=0;r<9;r++) {
	    //console.log(c_zone[r]);
	    unique(c_zone[r]);
	    twins(c_zone[r]);
	  }
	  //console.log(c_zone);
	  updateFromZone();
	  //console.log('end of scan');
}
	  
function scan(){
	scan_rows();
	scan_cols();
	scan_zones(); 
} //end scan


function updateAll(){
	populate();
	scan();  // cherche unique et doublets dans candidates	
	makegrid(candidates);  // redessine grille avec nouvelles valeurs de candidates
	sync();  // met Ã  jour rows[] Ã  partir de candidates	
}

