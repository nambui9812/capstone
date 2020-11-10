window.onload = () => {
    Load();

    // Bind event
    $("#_btnSource1").click(() => ChangeSource1());
    $("#_btnSource2").click(() => ChangeSource2());
}

// Load status of all sources
function Load() {
    ajaxHelper('http://localhost:5000/api/sources', 'GET', null, 'JSON', loadSuccessHandler, errorHandler);
}

// Change status
function ChangeSource1() {
    let value = $('#source1').val();

    ajaxHelper('http://localhost:5000/api/sources', 'PUT', { index: 1, onoff: value === 'on' ? true : false }, 'JSON', successHandler1, errorHandler);
}

function ChangeSource2() {
    let value = $('#source2').val();

    ajaxHelper('http://localhost:5000/api/sources', 'PUT', { index: 2, onoff: value === 'on' ? true : false }, 'JSON', successHandler2, errorHandler);
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

function loadSuccessHandler(data, status, xhr) {
    console.log(data);

    // Source1
    if (data.data[0].onoff === false) {
        $('#status-source1').text('off');
        $('#note-source1').text('');
        $('#source1').val('off');
    }
    else {
        $('#status-source1').text('on');
        $('#note-source1').text('');
        $('#source1').val('on');
    }

    // Source2
    if (data.data[1].onoff === false) {
        $('#status-source2').text('off');
        $('#note-source2').text('');
        $('#source2').val("off");
    }
    else {
        $('#status-source2').text('on');
        $('#note-source2').text('');
        $('#source2').val("on");
    }
}
  
function successHandler1(data, status, xhr) {
    console.log(data);
}

function successHandler2(data, status, xhr) {
    console.log(data);
}
  
function errorHandler(xhr, status, error) {
    console.log(error);
}