window.onload = () => {
    console.log("Loaded");
    Load();

    // Bind event
    $("#_btnSource1").click(() => Source1());
}

// Load status of all sources
function Load() {
    ajaxHelper('http://localhost:5000/api/sources', 'GET', null, 'JSON', successHandler, errorHandler);
}

// Change status
function Source1() {
    let value = $('#source1').val();
    console.log(value);
}

function ajaxHelper(url, type, data, dataType, success, error) {
    $.ajax({
        url,
        type,
        data,
        dataType,
        success,
        error
    });
}
  
function successHandler(data, status, xhr) {
    console.log(data);
}
  
function errorHandler(xhr, status, error) {
    console.log(error);
}