function attachEvents() {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students";
    const auth = `Basic ${btoa("guest:guest")}`;
    const requestHeaders = {
        "Authorization": auth,
        "Content-type": "application/json"
    };



    let [ID, FirstName, LastName, FacultyNumber, Grade] = [1111111,'Gergana','Tsirkova','123123123',5.55];

    if (ID, FirstName, LastName, FacultyNumber, Grade) {
        $("#studentData input").val("");
        let data = {
            ID: Number(ID),
            FirstName,
            LastName,
            FacultyNumber,
            Grade: Number(Grade)
        };

        $.ajax({
            method: "POST",
            url: baseUrl,
            headers: requestHeaders,
            data: JSON.stringify(data)
        }).then(() => {
            loadStudents();
        })
    }

    async function loadStudents() {
        let students = await $.ajax({
            method: "GET",
            url: baseUrl,
            headers: requestHeaders
        });

        //first we sort the students
        let orderedStudents = students.sort((a, b) => {
            return Number(a.ID) - Number(b.ID);
        });
        //after we append them
        for (let student of orderedStudents) {
            $("#results").append($(`<tr>`)
                .append($(`<td>${student.ID}</td>`))
                .append($(`<td>${student.FirstName}</td>`))
                .append($(`<td>${student.LastName}</td>`))
                .append($(`<td>${student.FacultyNumber}</td>`))
                .append($(`<td>${student.Grade}</td>`)))
        }
    }


}