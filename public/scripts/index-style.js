$(document).ready(() => {
    if ($('#unitAB').text() === 'a') {
        $('#btn-alpha-container').addClass('button-current');
        $('#btn-beta-container').removeClass('button-current');
    } else if ($('#unitAB').text() === 'b') {
        $('#btn-beta-container').addClass('button-current');
        $('#btn-alpha-container').removeClass('button-current');
    }
});