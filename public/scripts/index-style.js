$(document).ready(() => {
    if ($('#unitAB').text() === 'a') {
        $('#btn-alpha').addClass('btn-primary');
        $('#btn-alpha').removeClass('btn-secondary');
        $('#btn-beta').addClass('btn-secondary');
        $('#btn-beta').removeClass('btn-primary');
    } else if ($('#unitAB').text() === 'b') {
        $('#btn-beta').addClass('btn-primary');
        $('#btn-beta').removeClass('btn-secondary');
        $('#btn-alpha').addClass('btn-secondary');
        $('#btn-alpha').removeClass('btn-primary');
    }
});