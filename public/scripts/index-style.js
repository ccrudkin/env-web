$(document).ready(() => {
    if ($('#unitAB').text() === 'a') {
        $('#btn-alpha').addClass('button-primary');
        $('#btn-alpha').removeClass('button-secondary');
        $('#btn-beta').addClass('button-secondary');
        $('#btn-beta').removeClass('button-primary');
    } else if ($('#unitAB').text() === 'b') {
        $('#btn-beta').addClass('button-primary');
        $('#btn-beta').removeClass('button-secondary');
        $('#btn-alpha').addClass('button-secondary');
        $('#btn-alpha').removeClass('button-primary');
    }
});