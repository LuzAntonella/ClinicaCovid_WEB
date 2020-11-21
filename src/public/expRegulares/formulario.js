 const formulario = document.getElementById('formulario');
 const inputs = document.querySelectorAll('#formulario input');
 //Expresiones regulares
 const expresiones = {
    //usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, Letras, numeros, guion y guion_bajo
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    password: /^.{4,12}$/, // 4 a 12 digitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,14}$/ // 7 a 14 numeros.
}

const validarFormulario = (e) => {
    switch(e.target.name){
        case "name":
            console.log('el nombre');
            validarCampo(expresiones.nombre, e.target, 'name');
        case "apellido":
            validarCampo(expresiones.apellido, e.target, 'apellido');
            break;
        case "email":
            validarCampo(expresiones.correo, e.target, 'email');
             break;
        case "telefono":
            validarCampo(expresiones.telefono, e.target, 'telefono');
            break;
         
    }
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){
		console.log('Está correcto');
	} else {
		console.log('Está incorrecto');
	}
}

inputs.forEach((input)=> {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

/*formulario.addEventListener('submit',(e) =>{
    //e.preventDefault();
});*/