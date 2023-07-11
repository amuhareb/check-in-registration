var globalID;
$(document).ready(function () {
    //use dexie to get the visitorData indexed db under the entries object store
    var db = new Dexie("visitorData");
    //update dexie to the latest version

    db.version(1).stores({
        //entries is the object store
        //id is primary key path, fg_easypassthrough_token is another key path
        entries: 'id, fg_easypassthrough_token'

    });
    db.open().catch(function (error) {
        alert("Uh oh : " + error);
    });
    //get the entries object store
    db.entries.toArray().then(function (entries) {
        //create an array to hold the entries
        var entriesArray = [];
        //loop through the entries
        for (var i = 0; i < entries.length; i++) {
            //create an array to hold the entry data
            var entryArray = [];
            //add the entry data to the array
            entryArray.push(entries[i].id);
            entryArray.push(entries[i][1.3]);
            entryArray.push(entries[i][1.6]);
            entryArray.push(entries[i][2]);
            entryArray.push(entries[i][3]);
            entryArray.push(entries[i][4]);
            entryArray.push(entries[i][5]);
            entryArray.push(entries[i].fg_easypassthrough_token);
            entryArray.push(entries[i][6.1]);
            entryArray.push(entries[i][6.2]);
            entryArray.push(entries[i][6.3]);
            entryArray.push(entries[i][6.4]);
            entryArray.push(entries[i][6.5]);
            entryArray.push(entries[i][6.6]);
            entryArray.push(entries[i].form_id);
        }
        //add the entry array to the entries array
        entriesArray.push(entryArray);
        //create the datatable
        $('#visitor_listing').DataTable({
            data: entriesArray,
            columns: [
                { title: "Entry ID" },
                { title: "First Name" },
                { title: "Last Name" },
                { title: "Company" },
                { title: "Title" },
                { title: "Email" },
                { title: "Phone" },
                { title: "epToken" },
                { title: "Street Address" },
                { title: "Street Address 2" },
                { title: "City" },
                { title: "State" },
                { title: "Zip" },
                { title: "Country" },
                { title: "Form ID" }
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [1],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [2],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [3],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [4],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [5],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [6],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [7],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [8],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [9],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [10],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [11],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [12],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [13],
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": [14],
                    "visible": false,
                    "searchable": true
                }
            ]
        });
    });
});


//if there is an epToken as a query url parameter, use that to filter the table
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var epToken = urlParams.get('epToken');
    if (epToken) {
        $('#visitor_listing').DataTable().search(epToken).draw();
    }
}
);
//when a user clicks on a row, open a bootstrap modal with the visitor's details at  $('#visitorModal')
//build the modal content
$(document).ready(function () {
    var table = $('#visitor_listing').DataTable();
    $('#visitor_listing tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        var epToken = data[6];
        var visitor = data[1.3] + " " + data[1.6];
        var company = data[2];
        var title = data[3];
        var email = data[4];
        var phone = data[5];
        var entryID = data.id;
        var modal = document.getElementById("visitorModal");
        var modalContent = document.getElementById("visitorModalContent");
        var modalOptions = document.getElementById("visitorModalOptions");
        var modalBody = document.getElementById("visitorModalBody");
        var modalFooter = document.getElementById("visitorModalFooter");
        var modalHeader = document.getElementById("visitorModalHeader");
        var modalTitle = document.getElementById("visitorModalTitle");
        var modalClose = document.getElementById("visitorModalClose");
        var modalBodyContent = document.getElementById("visitorModalBodyContent");
    });
});
