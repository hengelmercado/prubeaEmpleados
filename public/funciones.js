/**Variables globales */
const label = document.querySelector('#label');
const message = document.querySelector('#message');
const paginacion = document.querySelector('#paginate');
const bodyForm = document.querySelector('#bodyForm');
const butonForm = document.querySelector('#butonForm');
const buttonLoading = document.querySelector('#loading');
const txtRH = document.querySelector('#rh');
const txtRS = document.querySelector('#rs');
const allData = document.querySelector('#allData');
const serial = document.querySelector('#serial');serial

const mes = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
var urlHost = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8081/'
            : 'https://scavi-backend.herokuapp.com/';

function ajax(coleccion = '', limite = 5, desde = 0){
    var url = urlHost + "api/" + coleccion + '?limite=' + limite + '&desde=' + desde;
    capitalizacion(coleccion);

    $.ajax({
        type: "GET",
        dataType: 'json',
        url: url,
        success: function(response) {
            if(response.total > 0){
                
                let labels = Object.keys(response.datos[0]).reverse();
                let thead = tableHead(labels);
                let tbody = tableBody(response, labels, coleccion);
                paginado(response,coleccion);
                makeForm(labels.reverse(), coleccion);
                
                $("#thead").html(thead);
                $("#tbody").html(tbody);
                $("table").css("display", "block");
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            console.log(ajaxOptions);
        }
    });
}

function getOne(uid = '', coleccion = '') {

    var url = urlHost + "api/" + coleccion + '/' + uid;

    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.text())
    .then(data => {
        const object = JSON.parse(data);
        const keys = Object.keys(object);
        keys.forEach(key => {
            if(key != "habilitado"){
                if(typeof object[key] === "object"){
                    document.querySelector('#'+ key).value = object[key]['_id'];
                }else if( key.includes('fecha')){
                    const date = new Date(Number(object[key]));
                    document.querySelector('#'+ key).value = date.getFullYear() + '-' + mes[date.getMonth()] + '-' + date.getDate();
                } else {
                    document.querySelector('#'+ key).value = object[key];
                }
            }
        });

        let button = '<button class="w-100 btn btn-primary btn-lg" onclick="update(\''+ coleccion +'\')">Actualizar</button>';
        butonForm.innerHTML = button;
    })
    .catch(error => {
        console.log("error", error);
        var errors = JSON.parse(error.responseText).errors;
        var list = '<ul>';
        for (let index = 0; index < errors.length; index++) {
            const element = errors[index];
            list += '<li>' + element.msg + '</li>';
            
        }
        
        list += '</ul>';

        message.innerHTML = list;
        message.style.display = '';
        setTimeout( function (){
            message.style.display = 'none';
        }, 3000);
    });
}

function send(coleccion = ''){
    var url = urlHost + "api/" + coleccion;
    
    if(validarCampos()){

        loading(true);

        const serialize = $( "#form" ).serializeArray();
        let data = new Object();

        for (const key in serialize) {
            if (Object.hasOwnProperty.call(serialize, key)) {
                const element = serialize[key];
                if(element.name.includes('fecha')){
                    data[element.name] = new Date(element.value).getTime();
                }else{
                    data[element.name] = element.value;
                }
                
            }
        }

        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then( resp => resp.json() )
        .then( data => {
            message.innerText = JSON.stringify(data);
            message.style.display = '';

            setTimeout( function (){
                message.style.display = 'none';
            }, 3000);

            
            removeValidar();
            ajax(coleccion);
            loading(false);
        })
        .catch( error => {
            console.log("error", error);
            var errors = JSON.parse(error.responseText).errors;
            var list = '<ul>';
            for (let index = 0; index < errors.length; index++) {
                const element = errors[index];
                list += '<li>' + element.msg + '</li>';
                
            }
            
            list += '</ul>';

            message.innerHTML = list;
            message.style.display = '';
            loading(false);

        });
    }

}

function update(coleccion = ''){
    var url = urlHost + "api/" + coleccion;
    
    if(validarCampos()){

        loading(true);

        const serialize = $( "#form" ).serializeArray();
        let data = new Object();

        for (const key in serialize) {
            if (Object.hasOwnProperty.call(serialize, key)) {
                const element = serialize[key];
                if(element.name.includes('fecha')){
                    data[element.name] = new Date(element.value).getTime();
                }else{
                    data[element.name] = element.value;
                }
                
            }
        }

        url += '/' + data.uid;
        delete data.uid;
        fetch(url, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then( resp => resp.json() )
        .then( data => {
            message.innerText = JSON.stringify(data);
            message.style.display = '';

            setTimeout( function (){
                message.style.display = 'none';
            }, 3000);

            
            removeValidar();
            ajax(coleccion);
            loading(false);
        })
        .catch( error => {
            console.log("error", error);
            var errors = JSON.parse(error.responseText).errors;
            var list = '<ul>';
            for (let index = 0; index < errors.length; index++) {
                const element = errors[index];
                list += '<li>' + element.msg + '</li>';
                
            }
            
            list += '</ul>';

            message.innerHTML = list;
            message.style.display = '';
            loading(false);

        });
    }
}

function deleteOne(uid = '', coleccion = '') {

    const url = urlHost + 'api/' + coleccion + '/' + uid;
    const data ={
        habilitado: false
    }

    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( data => {
        message.innerText = JSON.stringify(data);
        message.style.display = '';

        setTimeout( function (){
            message.style.display = 'none';
        }, 3000);

        
        removeValidar();
        ajax(coleccion);
        loading(false);
    })
    .catch( error => {
        console.log("error", error);
        var errors = JSON.parse(error.responseText).errors;
        var list = '<ul>';
        for (let index = 0; index < errors.length; index++) {
            const element = errors[index];
            list += '<li>' + element.msg + '</li>';
            
        }
        
        list += '</ul>';

        message.innerHTML = list;
        message.style.display = '';
        loading(false);

    });


}

function ecgFunction(limite = 5, desde = 0){

    var data = new Object();

    data["collection"] = serial.value;

    var url = urlHost + "api/ecg/todos" + '?limite=' + limite + '&desde=' + desde;
    capitalizacion(serial.value);

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( data => {
        if(data.total > 0){
                
            let labels = Object.keys(data.datos[0]).reverse();
            let thead = tableHead(labels);
            let tbody = tableBody(data, labels, serial.value);
            paginadoEcg(data,serial.value);
            //makeForm(labels.reverse(), coleccion);
            
            $("#thead").html(thead);
            $("#tbody").html(tbody);
            $("table").css("display", "block");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function validarCampos() {
'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('form')
    var valido = true;
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                valido = false;
            }

            form.classList.add('was-validated')
    })
    return valido;
}

function removeValidar(){
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var form = document.querySelector('form')
    // Loop over them and prevent submission
    form.classList.remove('was-validated')
    form.reset();
}

function tableHead(labels) {

    let thead = "<tr>";
    labels.forEach(label => {
        thead += "<th scope='col'>" + label + "</th>";
    });

    thead += "<th>Accines</th>";
    
    thead += "</tr>";

    return thead;
}

function tableBody(response, labels, coleccion) {
    var tbody = '';
    let datos = response.datos.reverse();
    for( i = 0; i < datos.length; i++){
        let uid = '';
        tbody += "<tr>";
        labels.forEach(label => {

            if(typeof datos[i][label] === "object"){
                var object = datos[i][label];
                tbody += "<td>" + object.nombre + "</td>";
                if(label == "uid")
                    uid = object.nombre
            }else{
                tbody += "<td>" + datos[i][label] + "</td>";
                if(label == "uid")
                    uid = datos[i][label];
            }
        });

        tbody += '<td> <button class="btn btn-outline-success" onclick="getOne(\''+ uid +'\', \''+ coleccion +'\')">  <i class=" fa fa-pen"></i>  </button> <button class="btn btn-outline-danger" onclick="deleteOne(\''+ uid +'\', \''+ coleccion +'\')"> <i class=" fa fa-trash"></i> </button> </td>';



        tbody += "</tr>";
    }
    return tbody;
}

function capitalizacion(nameCollection = '') {
    label.innerText = nameCollection.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function paginado(response, coleccion = '') {
    let paginate = '';
    if(parseInt(response.total) <= 5){
        paginate +=  "<li class='page-item' onclick='ajax( \"" + coleccion +"\" )'><a class='page-link'>1</a></li>" ;
    }else{
        const numPage = (parseInt(response.total) /5 );
        var pages = String(numPage).split('.');
        let numInit = 0, numView = 0; index = 0;
        if( pages.length > 1 ){
            index = parseInt(pages[0]) + 1;                      
        }else{
            index = parseInt(pages[0]);                                
        }
        
        for (let i = 0; i < index; i++) {
            numView += 1;
            paginate += "<li class='page-item' onclick='ajax(\"" + coleccion +"\", 5, \"" + numInit +"\")'><a class='page-link'>" + numView + "</a></li>";
            numInit += 5;
        }
    }
    paginacion.innerHTML = paginate;
}

function paginadoEcg(response, coleccion = '') {
    let paginate = '';
    if(parseInt(response.total) <= 5){
        paginate +=  "<li class='page-item' onclick='ecgFunction()'><a class='page-link'>1</a></li>" ;
    }else{
        const numPage = (parseInt(response.total) /5 );
        var pages = String(numPage).split('.');
        let numInit = 0, numView = 0; index = 0;
        if( pages.length > 1 ){
            index = parseInt(pages[0]) + 1;                      
        }else{
            index = parseInt(pages[0]);                                
        }
        
        for (let i = 0; i < index; i++) {
            numView += 1;
            paginate += "<li class='page-item' onclick='ecgFunction(\ 5, \"" + numInit +"\")'><a class='page-link'>" + numView + "</a></li>";
            numInit += 5;
        }
    }
    paginacion.innerHTML = paginate;
}

function makeForm(labels, coleccion) {

    let inputform = '';
    let button = '<button class="w-100 btn btn-primary btn-lg" onclick="send(\''+ coleccion +'\')">Grabar</button>'

    labels.forEach( label => {

        if(label != 'uid' && label != 'habilitado' ){
            if(label == "descripcion"){
                inputform += '<div class="col-sm-12"> <label for="firstName" class="form-label">'+ label +'</label> <textarea type="text" class="form-control" id="'+ label +'" name="'+ label +'" ></textarea> </div>'
            }else if(label.includes('fecha')){
                inputform += '<div class="col-sm-12"> <label for="firstName" class="form-label">'+ label +'</label> <input type="date" class="form-control" id="'+ label +'" name="'+ label +'" placeholder="" value="" required> <div class="invalid-feedback"> El '+ label +' es requerido. </div> </div>';
            } else {
                inputform += '<div class="col-sm-12"> <label for="firstName" class="form-label">'+ label +'</label> <input type="text" class="form-control" id="'+ label +'" name="'+ label +'" placeholder="" value="" required> <div class="invalid-feedback"> El '+ label +' es requerido. </div> </div>';
            }
        }
    });

    bodyForm.innerHTML = inputform;
    butonForm.innerHTML = button;

    
}

function loading(estado){
    
    if(estado){
        butonForm.style.display = 'none';
        buttonLoading.style.display = '';
    }else {butonForm.style.display = '';
        buttonLoading.style.display = 'none';
    }
}

function ecg(){

    var coleccion = serial.value;
    var url = urlHost + "api/ecg/"+ coleccion + "/true";

    if(coleccion != ""){
        fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.text())
        .then(data => {
    
            const data0 = JSON.parse(data);
            txtRH.innerText = "RH: " + data0.HR;
            txtRS.innerText = "FRS: " + data0.RR;
            allData.innerText = data;
        })
        .catch(error => {
            console.log("error", error);
            var errors = JSON.parse(error.responseText).errors;
            var list = '<ul>';
            for (let index = 0; index < errors.length; index++) {
                const element = errors[index];
                list += '<li>' + element.msg + '</li>';
                
            }
            
            list += '</ul>';
    
            message.innerHTML = list;
            message.style.display = '';
            setTimeout( function (){
                message.style.display = 'none';
            }, 3000);
        });
    }
}

setInterval(ecg, 3000);

