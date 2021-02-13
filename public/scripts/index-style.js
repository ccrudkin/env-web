$(document).ready(() => {
    if ($('#unitAB').text() === 'a') {
        $('#btn-alpha-container').addClass('button-primary');
        $('#btn-alpha-container').removeClass('button-secondary');
        $('#btn-beta-container').addClass('button-secondary');
        $('#btn-beta-container').removeClass('button-primary');
    } else if ($('#unitAB').text() === 'b') {
        $('#btn-beta-container').addClass('button-primary');
        $('#btn-beta-container').removeClass('button-secondary');
        $('#btn-alpha-container').addClass('button-secondary');
        $('#btn-alpha-container').removeClass('button-primary');
    }
});