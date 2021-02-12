$(document).ready(() => {
    if ($('#unitAB').innerText === 'a') {
        $('#btn-alpha-container').addClass('button-current');
        $('#btn-beta-container').removeClass('button-current');
    } else if ($('#unitAB').innerText === 'b') {
        $('#btn-beta-container').addClass('button-current');
        $('#btn-alpha-container').removeClass('button-current');
    }
});