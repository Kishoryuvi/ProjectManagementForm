var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var empDBName = 'EMP-DB';
var empRelationName = 'EmpData';
var connToken = '90932630|-31949276183372406|90948624';

$('#projid').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var projid = $('#projid').val();
    var jsonStr = {
        id: projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#projame').val(data.name);
    $('#empsal').val(data.salary);
    $('#hra').val(data.hra);
    $('#da').val(data.da);
    $('#deduct').val(data.deduction);


}
function resetForm() {
    $('#projid').val("");
    $('#projame').val("");
    $('#empsal').val("");
    $('#hra').val("");
    $('#da').val("");
    $('#deduct').val("");
    $('#projid').prop('disabled', false);
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#projid').focus();

}

function validateData()
{
    var projid, projname, assignedTo, assignedDate, deadline;
    projid = $('#projid').val();
    projname = $('#projame').val();
    assignedTo = $('#assignedTo').val();
    assignedDate = $('#assignedDate').val();
    deadline = $('#deadline').val();

    if (projid === "") {
        alert("Employee ID missing");
        $('#projid').focus();
        return "";
    }

    if (projname === "") {
        alert("Employee Name missing");
        $('#projame').focus();
        return "";
    }

    if (assignedTo === "") {
        alert('Employee salary missing');
        $('#assignedTo').focus();
        return "";
    }

    if (assignedDate === "") {
        alert("HRA missing");
        $('#assignedDate').focus();
        return "";
    }

    if (deadline === "") {
        alert("DA missing");
        $('#deadline').focus();
        return "";
    }

    var jsonStrObj = {
        id: projid,
        name: projname,
        assignement: assignedTo,
        date: assignedDate,
        Deadline: deadline,
    };
    return JSON.stringify(jsonStrObj);

}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBame, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonobj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop('disabled', false);
        $("#empname").focus();

    } else if (resJsonObj.status === 200) {
        $("#empid").prop('disabled', true);
        fillData(resJsonObj);
        $("#change").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#empname").focus();
    }

    function saveData() {
        var jsonStrObj = validateData();
        if (jsonStrObj === '') {
            return "";
        }

        var putRequest = createPutRequest(connToken, jsonStrObj, empDBName, empRelationName);
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommandAtGivenBaseURL(putRequest, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        resetForm();
        $("#empid").focus();
    }

    function changeData() {
        $("#change").prop("disabled", true);
        jsonChg = validateData();
        var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem('recno'));
                jQuery.ajaxSetup({async: false});
        var resJsonCbj = executeCommandAtGivenBaseURl(updateRequest, jpdbBaseUPL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        console.log(resJsonObj);
        resetForm();
        $("#projid").focus();

    }

}
