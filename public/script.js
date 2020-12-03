window.onload = () => {
    Load();
    LoadJobs();
    LoadHistory();

    // Bind event
    $("#_btnSource1").click(() => ChangeSource1());
    $("#_btnSource2").click(() => ChangeSource2());
    $("#_btnScheduleSource1").click(() => ScheduleSource1());
    $("#_btnScheduleSource2").click(() => ScheduleSource2());
    $("#_btnClearHis").click(() => clearHistory());
    $('#_btnReset').click(() => Reset());
}

// Load status of all sources
function Load() {
    ajaxHelper('/api/sources', 'GET', null, 'JSON', loadSuccessHandler, errorHandler);
}

// Change status
function ChangeSource1() {
    let value = $('#source1').val();
    let onoff = value === 'on' ? true : false;
    let data = {
        index: 1,
        onoff: onoff
    }

    ajaxHelper('/api/sources', 'PUT', JSON.stringify(data), 'JSON', successHandler1, errorHandler);
}

function ChangeSource2() {
    let value = $('#source2').val();
    let onoff = value === 'on' ? true : false;
    let data = {
        index: 2,
        onoff: onoff
    }

    ajaxHelper('/api/sources', 'PUT', JSON.stringify(data), 'JSON', successHandler2, errorHandler);
}

function ScheduleSource1() {
    let value = $('#schedule-source1').val();
    let onoff = value === 'on' ? true : false;
    let datetime = new Date($('#datetime-source1').val());
    console.log(datetime);
    let data = {
        index: 1,
        onoff: onoff,
        datetime: datetime
    }
    
    ajaxHelper('/api/jobs', 'POST', JSON.stringify(data), 'JSON', scheduleSuccessHandler1, errorHandler);
}

function LoadJobs() {
    ajaxHelper('/api/jobs', 'GET', null, 'JSON', loadJobsSuccessHandler, errorHandler);
}

function LoadHistory() {
    ajaxHelper('/api/history', 'GET', null, 'JSON', loadHistorySuccessHandler, errorHandler);
}

function clearHistory() {
    ajaxHelper('/api/history', 'DELETE', null, 'JSON', clearHistorySuccessHandler, errorHandler);
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
    // Source1
    if (data.data[0].onoff === false) {
        $('#status-source1').text('off');
        $('#note-source1').text('');
        $('#source1').val('off');
        $('#schedule-source1').val('off');
    }
    else {
        $('#status-source1').text('on');
        $('#note-source1').text('');
        $('#source1').val('on');
        $('#schedule-source1').val('on');
    }

    // Source2
    if (data.data[1].onoff === false) {
        $('#status-source2').text('off');
        $('#note-source2').text('');
        $('#source2').val("off");
        $('#schedule-source2').val('off');
    }
    else {
        $('#status-source2').text('on');
        $('#note-source2').text('');
        $('#source2').val("on");
        $('#schedule-source2').val('on');
    }
}
  
function successHandler1(data, status, xhr) {
    $('#status-source1').text(data.data.source.onoff ? 'on' : 'off');
}

function successHandler2(data, status, xhr) {
    $('#status-source1').text(data.data.source.onoff ? 'on' : 'off');
}

function scheduleSuccessHandler1(data, status, xhr) {
    $('#note-source1').text('Schedule source 1 successfully');
}

function scheduleSuccessHandler2(data, status, xhr) {
    $('#note-source2').text('Schedule source 2 successfully');
}

function loadJobsSuccessHandler(data, status, xhr) {
    console.log(data);
    let jobs = document.getElementById('jobs');
    let arr = data.data;

    if (arr.length > 0) {
        for (let i = 0; i < arr.length; ++i) {
            let node = document.createElement('p');
            let text = document.createTextNode(`${new Date((new Date(arr[i].data.datetime) - (new Date()).getTimezoneOffset()))} - Source ${arr[i].data.index} will turn ${arr[i].data.onoff ? 'on' : 'off'}`);
            node.appendChild(text);
            jobs.appendChild(node);
        }
    }
}

function loadHistorySuccessHandler(data, status, xhr) {
    console.log(data);
    let his = document.getElementById('history');
    let arr = data.data;

    if (arr.length > 0) {
        for (let i = 0; i < arr.length; ++i) {
            let node = document.createElement('p');
            //new Date((new Date(arr[i].date) - (new Date()).getTimezoneOffset()))
            let text = document.createTextNode(`${new Date((new Date(arr[i].date) - (new Date()).getTimezoneOffset()))} - ${arr[i].text}`);
            node.appendChild(text);
            his.appendChild(node);
        }
    }
}

function clearHistorySuccessHandler(data, status, xhr) {
    console.log(data);
    document.getElementById('history').innerHTML = '';
}
  
function errorHandler(xhr, status, error) {
    console.log(error);
    console.warn(xhr.responseText)
}

function resetSuccessHandler(data, status, xhr) {
    window.location.href = "/";
}

function Reset() {
    ajaxHelper('/api/reset', 'GET', null, 'JSON', resetSuccessHandler, errorHandler);
}
