const categorias = document.getElementById('categorie')
const talles = document.getElementById('cbl')
const talles2 = document.getElementById('cbl2')
const talles3 = document.getElementById('cbl3')
const talles4 = document.getElementById('cbl4')
const titulo = document.getElementById('titTalles')
const titulo2 = document.getElementById('titTamaño')
const titulo3 = document.getElementById('titPeso')



function CambiarValor() {

    const valor = categorias.value

    if (valor == 'zapatillas') {
        talles2.classList.remove('hidden')
        titulo.classList.remove('hidden')
        talles.classList.add('hidden')
        titulo2.classList.add('hidden')
        talles3.classList.add('hidden')
        titulo3.classList.add('hidden')
        talles4.classList.add('hidden')

    } else if (valor == 'ropa') {
        talles.classList.remove('hidden')
        titulo.classList.remove('hidden')
        talles2.classList.add('hidden')
        titulo2.classList.add('hidden')
        talles3.classList.add('hidden')
        titulo3.classList.add('hidden')
        talles4.classList.add('hidden')

    } else if (valor == 'suplementos') {
        talles2.classList.add('hidden')
        talles.classList.add('hidden')
        titulo.classList.add('hidden')
        titulo2.classList.remove('hidden')
        talles3.classList.remove('hidden')
        titulo3.classList.add('hidden')
        talles4.classList.add('hidden')

    } else if (valor == 'equipo') {
        talles2.classList.add('hidden')
        talles.classList.add('hidden')
        titulo.classList.add('hidden')
        titulo2.classList.add('hidden')
        talles3.classList.add('hidden')
        titulo3.classList.remove('hidden')
        talles4.classList.remove('hidden')

    }
    else {
        talles2.classList.add('hidden')
        talles.classList.add('hidden')
        titulo.classList.add('hidden')
        titulo2.classList.add('hidden')
        talles3.classList.add('hidden')
        titulo3.classList.add('hidden')
        talles4.classList.add('hidden')
    }
}


categorias.addEventListener('change', CambiarValor)


CambiarValor()

