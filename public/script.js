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