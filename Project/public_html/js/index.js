var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbURL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var connToken = "ADD TOKEN HERE !!";

$(document).ready(function () {
    $("#rollNo").focus();
});

function resetForm() {
    $("#rollNo, #fullName, #class, #birthDate, #address, #enrollmentDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#save, #update, #reset").prop("disabled", true);
    $("#rollNo").focus();
}

function validateData() {
    var rollNo = $("#rollNo").val();
    var fullName = $("#fullName").val();
    var studentClass = $("#class").val();
    var birthDate = $("#birthDate").val();
    var address = $("#address").val();
    var enrollmentDate = $("#enrollmentDate").val();

    if (rollNo === "") {
        alert("Roll No is missing");
        $("#rollNo").focus();
        return null;
    }
    if (fullName === "") {
        alert("Full Name is missing");
        $("#fullName").focus();
        return null;
    }
    if (studentClass === "") {
        alert("Class is missing");
        $("#class").focus();
        return null;
    }
    if (birthDate === "") {
        alert("Birth Date is missing");
        $("#birthDate").focus();
        return null;
    }
    if (address === "") {
        alert("Address is missing");
        $("#address").focus();
        return null;
    }
    if (enrollmentDate === "") {
        alert("Enrollment Date is missing");
        $("#enrollmentDate").focus();
        return null;
    }

    var studentData = {
        rollNo: rollNo,
        fullName: fullName,
        studentClass: studentClass,
        birthDate: birthDate,
        address: address,
        enrollmentDate: enrollmentDate
    };
    return JSON.stringify(studentData);
}

function saveStudent() {
    var jsonStrObj = validateData();
    if (!jsonStrObj) {
        return;
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    saveRecNo2LS(resJsonObj);
    resetForm();
    $("#rollNo").focus();
}

function updateStudent() {
    var studentData = validateData();
    if (!studentData) {
        return;
    }

    var updateRequest = createUPDATERecordRequest(connToken, studentData, dbName, relationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function checkStudent() {
    var rollNo = $("#rollNo").val();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, JSON.stringify({ rollNo: rollNo }));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbURL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save, #reset").prop("disabled", false);
        $("#rollNo, #fullName, #class, #birthDate, #address, #enrollmentDate").prop("disabled", false);
        $("#fullName").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        $("#fullName, #class, #birthDate, #address, #enrollmentDate").prop("disabled", false);
        fillData(resJsonObj);
        $("#update, #reset").prop("disabled", false);
        $("#fullName").focus();
    }
}


function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record.fullName);
    $("#class").val(record.studentClass);
    $("#birthDate").val(record.birthDate);
    $("#address").val(record.address);
    $("#enrollmentDate").val(record.enrollmentDate);
}
