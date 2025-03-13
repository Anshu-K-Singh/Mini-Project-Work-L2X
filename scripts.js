var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var connToken = "90934308|-31949201673221452|90957783";

$("#stuRoll").focus();

function saveRecNoToLocal(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $("#stuRoll").val();
    return JSON.stringify({ id: rollNo });
}

function fillForm(jsonObj) {
    saveRecNoToLocal(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stuName").val(record.fullName);
    $("#stuClass").val(record.class);
    $("#stuDOB").val(record.birthDate);
    $("#stuAddress").val(record.address);
    $("#stuEnrollDate").val(record.enrollDate);

    $("#stuRoll").prop("disabled", true);
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", false);
    $("#resetBtn").prop("disabled", false);
    $("#stuName").focus();
}

function resetForm() {
    $("#studentForm")[0].reset();
    $("#stuRoll").prop("disabled", false);
    $("#saveBtn, #updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);
    $("#stuRoll").focus();
}

function validateForm() {
    var rollNo = $("#stuRoll").val();
    var fullName = $("#stuName").val();
    var stuClass = $("#stuClass").val();
    var birthDate = $("#stuDOB").val();
    var address = $("#stuAddress").val();
    var enrollDate = $("#stuEnrollDate").val();

    if (!rollNo) { alert("Roll No is required!"); $("#stuRoll").focus(); return ""; }
    if (!fullName) { alert("Full Name is required!"); $("#stuName").focus(); return ""; }
    if (!stuClass) { alert("Class is required!"); $("#stuClass").focus(); return ""; }
    if (!birthDate) { alert("Birth Date is required!"); $("#stuDOB").focus(); return ""; }
    if (!address) { alert("Address is required!"); $("#stuAddress").focus(); return ""; }
    if (!enrollDate) { alert("Enrollment Date is required!"); $("#stuEnrollDate").focus(); return ""; }

    return JSON.stringify({
        id: rollNo,
        fullName: fullName,
        class: stuClass,
        birthDate: birthDate,
        address: address,
        enrollDate: enrollDate
    });
}

function getStudent() {
    var rollNoJson = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, rollNoJson);

    jQuery.ajaxSetup({ async: false });
    var resJson = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJson.status === 400) {
        $("#saveBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        $("#stuName").focus();
    } else if (resJson.status === 200) {
        fillForm(resJson);
    }
}

function saveStudent() {
    var jsonData = validateForm();
    if (!jsonData) return;

    var putRequest = createPUTRequest(connToken, jsonData, dbName, relationName);

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Student Saved!");
    resetForm();
}

function updateStudent() {
    var jsonData = validateForm();
    if (!jsonData) return;

    var updateRequest = createUPDATERecordRequest(connToken, jsonData, dbName, relationName, localStorage.getItem("recno"));

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Student Updated!");
    resetForm();
}