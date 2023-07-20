//only perform fetch request if the number of entries in the fetchData array is different than the total number of entries in the form id 2
//using this fetch request: https://americanevents.com/wp-json/gf/v2/forms/1/results
//if the number of entries in the fetchData array is different than the total number of entries in the form id 2, then perform a new fetch request
//if the number of entries in the fetchData array is the same as the total number of entries in the form id 2, then do not perform a new fetch request

function fetchEntries() {
  const form1Promise = fetch(`https://americanevents.com/wp-json/gf/v2/entries?search={"field_filters":[{"key":"form_id","value":"2","operator":"is"}]}&paging[page_size]=3500`, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa('ck_7606aa328b6b7ed1c7fc46d9b48a31ea8651cf0e:cs_3a9c9a0831408c8c04d24b59d715d0f5e00a9494')
    }
  }).then(response => response.json());
  const form2Promise = fetch(`https://americanevents.com/wp-json/gf/v2/entries?search={"field_filters":[{"key":"form_id","value":"73","operator":"is"}]}&paging[page_size]=3000`, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa('ck_7606aa328b6b7ed1c7fc46d9b48a31ea8651cf0e:cs_3a9c9a0831408c8c04d24b59d715d0f5e00a9494')
    }
  }).then(response => response.json());
    Promise.all([form1Promise, form2Promise])
    .then(([form1Data, form2Data]) => {
      const combinedData = [...form1Data.entries, ...form2Data.entries];
      console.log(`Total number of entries: ${combinedData.length}`);
      // Add combined data to IndexedDB
      const request = indexedDB.open("visitorData", 1);
      //create entries object store
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("entries")) {
          const objectStore = db.createObjectStore("entries", {keyPath: "id"});
          //create index for fg_easypassthrough_token as epToken
          objectStore.createIndex("epToken", "fg_easypassthrough_token", {unique: false});
          //form_id key
          objectStore.createIndex("form_id", "form_id", {unique: false});
        }
        //if the object store already exists, then delete it and create a new one
        else {
          db.deleteObjectStore("entries");
          const objectStore = db.createObjectStore("entries", {keyPath: "id"});
          //create index for fg_easypassthrough_token as epToken
          objectStore.createIndex("epToken", "fg_easypassthrough_token", {unique: false});
          //create objectStore for form_id
          //form_id key
          objectStore.createIndex("form_id", "form_id", {unique: false});
        }

      }
      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["entries"], "readwrite");
        const objectStore = transaction.objectStore("entries");
        for (let i in combinedData) {
          objectStore.put(combinedData[i]);
        }
        transaction.oncomplete = function(event) {
          db.close();
        }
      }
    })
    .catch(error => console.log(error));
}

fetchEntries();

//count the number of entries for form 2 and 54. if it's different than the visitorData indexed db, then delete and re-add the entries to the indexed db
function countEntries() {
  const form1Promise = fetch(`https://americanevents.com/wp-json/gf/v2/entries?search={"field_filters":[{"key":"form_id","value":"2","operator":"is"}]}&paging[page_size]=3500`, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa('ck_7606aa328b6b7ed1c7fc46d9b48a31ea8651cf0e:cs_3a9c9a0831408c8c04d24b59d715d0f5e00a9494')
    }
  }).then(response => response.json());
  const form2Promise = fetch(`https://americanevents.com/wp-json/gf/v2/entries?search={"field_filters":[{"key":"form_id","value":"73","operator":"is"}]}&paging[page_size]=3000`, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa('ck_7606aa328b6b7ed1c7fc46d9b48a31ea8651cf0e:cs_3a9c9a0831408c8c04d24b59d715d0f5e00a9494')
    }
  }).then(response => response.json());
    Promise.all([form1Promise, form2Promise])
    .then(([form1Data, form2Data]) => {
      if (form1Data.total_count + form2Data.total_count !== visitorData.length) {
        console.log('The number of entries in the database is different than the number of entries in the form. Deleting and re-adding entries to the database.');
        const request = indexedDB.open("visitorData", 1);
        request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(["entries"], "readwrite");
          const objectStore = transaction.objectStore("entries");
          objectStore.clear();
          transaction.oncomplete = function(event) {
            db.close();
            fetchEntries();
          }
        }
      }
    })
    .catch(error => console.log(error));
}

// function to post to form 85 where:
// 1.3 = first name, 1.6 = last name, title = 3, email = 4, company name = 5, check-in time = 6, form_title = 13, form id = 7, fg_easypassthrough_token = 8
function postToForm85(epToken) {
  const request = indexedDB.open("visitorData", 1);
  console.log(epToken);
  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(["entries"], "readonly");
    const objectStore = transaction.objectStore("entries");
    const request = objectStore.get(epToken);
    request.onsuccess = function(event) {
      const data = event.target.result;
      const form85Data = {
        input_1_3: data['1.3'],
        input_1_6: data['1.6'],
        input_3: data['3'],
        input_4: data['4'],
        input_5: data['5'],
        input_6: data['6'],
        input_13: data['13'],
        input_7: data['7'],
        input_8: data['8']
      }
      fetch('https://americanevents.com/wp-json/gf/v2/forms/85/entries', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('ck_7606aa328b6b7ed1c7fc46d9b48a31ea8651cf0e:cs_3a9c9a0831408c8c04d24b59d715d0f5e00a9494')
        }
      })
      console.log(form85Data);
    }
  }
}              

//download indexed db as a json file
function download() {
    const request = indexedDB.open("visitorData", 1);
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["entries"], "readonly");
        const objectStore = transaction.objectStore("entries");
        const request = objectStore.getAll();
        request.onsuccess = function(event) {
            const data = event.target.result;
            const a = document.createElement('a');
            const file = new Blob([JSON.stringify(data)], {type: 'application/json'});
            a.href = URL.createObjectURL(file);
            a.download = 'visitorData.json';
            a.click();
        }
    }
}

//create a dataTable and display the visitor data in the table by iterating through the visitorData array and adding the data to the table
function displayVisitorData() {
  const request = indexedDB.open("visitorData", 1);
  request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(["entries"], "readonly");
      const objectStore = transaction.objectStore("entries");
      const request = objectStore.getAll();
      request.onsuccess = function(event) {
        //console log the visitorData array
        console.log(event.target.result);
        //create a dataTable, and add each entry as a row
        //don't use the one in the dom, make a new one
        const table = document.createElement('table');
        table.setAttribute('id', 'visitorDataTable');
        table.setAttribute('class', 'display');
        table.setAttribute('style', 'width:100%');
        //append to dataTablePlaceholder
        const dataTablePlaceholder = document.getElementById('dataTablePlaceholder');
        dataTablePlaceholder.appendChild(table);
        //for every key, add a column but exclude 0
        const columns = [];
        for (let key in event.target.result) {
          if (key !== '0') {
            columns.push({title: key, visible: true});
          }
        }
        const result = event.target.result;
        const data = result.map(row => ({
          first_name: row['1.3'],
          last_name: row['1.6'],
          company: row[row['form_id'] === '2' ? '2' : '4'],
          title: row['3'],
          email: row['form_id'] === '2' ? row['4'] : row['13'],
          phone: row['5'],
          address1: row[row['form_id'] === '2' ? '6.1' : '5.1'],
          address2: row[row['form_id'] === '2' ? '6.2' : '5.2'],
          city: row[row['form_id'] === '2' ? '6.3' : '5.3'],
          state: row[row['form_id'] === '2' ? '6.4' : '5.4'],
          zip: row[row['form_id'] === '2' ? '6.5' : '5.5'],
          country: row[row['form_id'] === '2' ? '6.6' : '5.6'],
          easypassthrough_token: row['fg_easypassthrough_token'],
          form_id: row['form_id'],
          id: row['id']
        }));
        //if first_name is empty, remove the row
        for (let i = 0; i < data.length; i++) {
          if (data[i].first_name === '') {
            data.splice(i, 1);
          }
        }

        //if there is a duplicate email, remove the row
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].email === data[j].email) {
              data.splice(j, 1);
            }
          }
        }
        const dataTable = $('#visitorDataTable').DataTable({
          data: data,
          columns: [
            {title: 'First Name', data: 'first_name'},
            {title: 'Last Name', data: 'last_name'},
            {title: 'Company', data: 'company'},
            {title: 'Email', data: 'email'},
            {title: 'Phone', data: 'phone'},
            {title: 'Address 1', data: 'address1'},
            {title: 'Address 2', data: 'address2'},
            {title: 'City', data: 'city'},
            {title: 'State', data: 'state'},
            {title: 'Zip', data: 'zip'},
            {title: 'Country', data: 'country'},
            {title: 'Token', data: 'easypassthrough_token'},
            {title: 'Form ID', data: 'form_id'},
            {title: 'ID', data: 'id'}
          ],
          dom: 'Bfrtip',
          buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          //style the dataTable - make it fit the screen and scrollable
          scrollY: '100vh',
          scrollX: true,
          scrollCollapse: true,
          paging: true,
          fixedColumns: {
            leftColumns: 1
          },
          columnDefs: [{
            defaultContent : "-",
            targets : "_all"
          }],
          //make the dataTable responsive
          responsive: true,
          //pagination
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
          //add pagination to top and bottom of table
          pageLength: 50,
          //search
          search: {
            caseInsensitive: true,
            smart: true,
            regex: true
          },
          //orderings
          order: [[0, 'asc'], [1, 'asc']],
          //language
          language: {
            search: "Search all columns:",
            searchPlaceholder: "Enter search term..."
          },
          //make the epToken a link, when a user clicks it, run the populateCheckinSection(epToken) function with that epToken
          createdRow: function(row, data, dataIndex) {
            $(row).find('td:eq(11)').html('<a href="javascript:void(0)" onclick="populateCheckinSection(\'' + data.easypassthrough_token + '\')">' + data.easypassthrough_token + '</a>');
          }
        });
      }
  }
}
//attach document.querySelector("#dataTableButton") to the displayVisitorData() function
document.querySelector("#dataTableButton").addEventListener("click", displayVisitorData);