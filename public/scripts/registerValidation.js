window.addEventListener('load', function () {
    const form = document.querySelector('.registerForm');
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');

    form.addEventListener('submit', function (event) {
        let hasErrors = false;

        if (nameInput.value.length < 2) {
            nameError.innerText = 'El nombre debe tener al menos 2 caracteres.';
            hasErrors = true;
        } else {
            nameError.innerText = '';
        }


        if (hasErrors) {
            event.preventDefault();
        }
    });

    nameInput.addEventListener('blur', function () {
        if (nameInput.value.length < 2) {
            nameError.innerText = 'El nombre debe tener al menos 2 caracteres.';
        } else {
            nameError.innerText = '';
        }
    });
});