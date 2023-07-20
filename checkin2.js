
let characteristic;

function connect() {
    navigator.bluetooth.requestDevice({ acceptAllDevices: true, 
        optionalServices: ['0000feea-0000-1000-8000-00805f9b34fb'] })
        .then(device => {
        return device.gatt.connect();
    })
    .then(server => {
        // Get the service you want to use.
        return server.getPrimaryService('0000feea-0000-1000-8000-00805f9b34fb');
    })
    .then(service => {
        // Get the characteristic you want to read.
        return service.getCharacteristic("00002aa1-0000-1000-8000-00805f9b34fb");
    })
    .then(char => {
        characteristic = char;
        characteristic.addEventListener('characteristicvaluechanged', handleValueChanged);
        characteristic.startNotifications();
        // Read the value of the characteristic.
        return characteristic.readValue({type: 'bigint'});
    })
    .then(value => {
        // Use the value to check-in the user.
        // ...
    })
    //append service.device.name to input type="text" id="device-name" once connected
    .then( () => {
        document.getElementById("device-name").value = characteristic.service.device.name;
    })
    //save the device name, address, and service UUID to local storage along with the characteristic UUID
    .then( () => {
        let deviceName = characteristic.service.device.name;
        let deviceAddress = characteristic.service.device.id;
        let serviceUUID = characteristic.service.uuid;
        let characteristicUUID = characteristic.uuid;
        localStorage.setItem("deviceName", deviceName);
        localStorage.setItem("deviceAddress", deviceAddress);
        localStorage.setItem("serviceUUID", serviceUUID);
        localStorage.setItem("characteristicUUID", characteristicUUID);
    })
    .catch(error => { console.log(error); })
}   

//function to connect to the device using the saved UUIDs.
//we'll use the stored data to filter the device list
function connectToSavedDevice() {
    let deviceName = localStorage.getItem("deviceName");
    let deviceAddress = localStorage.getItem("deviceAddress");
    let serviceUUID = localStorage.getItem("serviceUUID");
    let characteristicUUID = localStorage.getItem("characteristicUUID");
    navigator.bluetooth.requestDevice({ filters: [{name: deviceName, id: deviceAddress}],
        optionalServices: [serviceUUID] })
        .then(device => {
        return device.gatt.connect();
    })
    .then(server => {
        // Get the service you want to use.
        return server.getPrimaryService(serviceUUID);
    })
    .then(service => {
        // Get the characteristic you want to read.
        return service.getCharacteristic(characteristicUUID);
    })
    .then(char => {
        characteristic = char;
        characteristic.addEventListener('characteristicvaluechanged', handleValueChanged);
        characteristic.startNotifications();
        // Read the value of the characteristic.
        return characteristic.readValue({type: 'bigint'});
    })
    .then(value => {
        // Use the value to check-in the user.
        // ...
    })
    //append service.device.name to input type="text" id="device-name" once connected
    .then( () => {
        document.getElementById("device-name").value = characteristic.service.device.name;

    })
    .catch(error => { console.log(error); })
}

//handle value changed event occurs when a notification is received from the device
//we'll use this to read the value of the characteristic by storing it in a variable and then appending it to the input type="text" id="ep-token"


//list devices stored in local storage, and append the "connecttosaveddevice" function to the onclick event
function listSavedDevices() {
    let deviceName = localStorage.getItem("deviceName");
    let deviceAddress = localStorage.getItem("deviceAddress");
    let serviceUUID = localStorage.getItem("serviceUUID");
    let characteristicUUID = localStorage.getItem("characteristicUUID");
    let deviceList = document.getElementById("device-list");
    let deviceListItem = document.createElement("button");
    deviceListItem.innerHTML = deviceName;
    deviceListItem.setAttribute("onclick", "connectToSavedDevice()");
    deviceList.appendChild(deviceListItem);
}
listSavedDevices()

let value = '';
let lastPacketTime = Date.now();
let epToken = '';
let intervalId;

function handleValueChanged(event) {
    let packet = event.target.value;
    let packetString = "";
    for (let i = 0; i < packet.byteLength; i++) {
    packetString += String.fromCharCode(packet.getUint8(i));
    }
    value += packetString;
    lastPacketTime = Date.now();
    setTimeout(function() {
    if (Date.now() - lastPacketTime > 150) {
        //get rid of carriage returns
        value = value.replace(/(\r\n|\n|\r)/gm, "");
        //get rid of spaces
        value = value.replace(/\s/g, '');
        epToken = value;
        value = '';
        //append epToken to input type="text" id="ep-token"
        document.getElementById("ep-token").value = epToken;
        //stop the interval
        clearInterval(intervalId);
    }
    if (epToken != '') {
    populateCheckinSection(epToken);
    }
    }, 150);
    //if epToken is not empty, populateCheckinSection
}
    
//staff ID functions
//create a new staff ID in local storage using 'staff-ID' input value
function createStaffID() {
    let staffID = document.getElementById("staff-ID").value;
    localStorage.setItem("staffID", staffID);
    document.getElementById("staff-container").style.display = "none";
    //display staff greeting
    document.getElementById("staff-greeting").style.display = "block";
    document.getElementById("staff-greeting").innerHTML = "Hello, " + staffID;
    //display update button
    document.getElementById("update-button").style.display = "block";
    }
//on 'submit-button' click or 'enter' keypress while focused on 'staff-ID' input, call the createStaffID function
document.getElementById("staff-ID").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submit-button").click();
    }
});
//on 'submit-button' click, call the createStaffID function
document.getElementById("submit-button").addEventListener("click", createStaffID);

//if staff ID exists in local storage, hide 'staff-container' div and show 'update-button' button
if(localStorage.getItem("staffID") !== null || localStorage.getItem("staffID") !== undefined || localStorage.getItem("staffID") !== "") {
    document.getElementById("staff-container").style.display = "none";
    document.getElementById("update-button").style.display = "block";
    //show 'staff-greeting' h2 element and append "Hello, " + staff ID from local storage
    document.getElementById("staff-greeting").style.display = "block";
    document.getElementById("staff-greeting").innerHTML = "Hello, " + localStorage.getItem("staffID");
}
//if 'update-button' is clicked, show 'staff-container' div and hide 'update-button' button, and clear local storage for staff ID
document.getElementById("update-button").addEventListener("click", function() {
    document.getElementById("staff-container").style.display = "block";
    document.getElementById("update-button").style.display = "none";
    localStorage.removeItem("staffID");
    //hide 'staff-greeting' h2 element
    document.getElementById("staff-greeting").style.display = "none";
});

//on page load, check if staff ID exists in local storage
// if not "do something", else "do something else"
window.onload = function() {
    if(localStorage.getItem("staffID") !== null || localStorage.getItem("staffID") !== undefined || localStorage.getItem("staffID") !== "") {
        //display a 
    } else {
        //do something else
    }
}
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
      if (data !== undefined) {
        const form85Data = {
            "input_1_3": data['1.3'],
            "input_1_6": data['1.6'],
            "input_3": data['3'],
            "input_4": data['4'],
            "input_5": data['5'],
            "input_6": data['6'],
            "input_7": data['7'],
            "input_8": data['8'],
            "input_13": data['13'],
            "form_id": 85
          }
                  console.log(form85Data);   
        fetch('https://americanevents.com/wp-json/gf/v2/forms/85/entries', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa('ck_7606aa328b6b7ed1c7fc46d9b48a31ea8651cf0e:cs_3a9c9a0831408c8c04d24b59d715d0f5e00a9494')
          }
        })
        console.log(form85Data);
      } else {
        console.log('Data not found for epToken: ' + epToken);
      }
    }
    request.onerror = function(event) {
      console.log('Error retrieving data for epToken: ' + epToken);
    }
  }
}
//search the fg_easypassthrough_token key in the entries object store under the visitorData indexDb for the value of the epToken variable
function populateCheckinSection(epToken) {
    const request = indexedDB.open("visitorData", 1);

    // open the "log" database
    const logRequest = indexedDB.open("log", 1);
    logRequest.onerror = function(event) {
        console.error("Failed to open log database");
    }
    logRequest.onsuccess = function(event) {
        console.log("Log database opened successfully");
        const logDb = event.target.result;
        // add logging functionality here
    }

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["entries"], "readonly");
        const objectStore = transaction.objectStore("entries");
        const index = objectStore.index("epToken");
        const request = index.get(epToken);

        //if the epToken is not found in the index, run a fetchEntries()
        if (request == undefined) {
            fetchEntries();
            //console.log("epToken not found in index, updating index");
        } else {
            request.onsuccess = function(event) {
                // add logging functionality here
                //upon populating the checkin section, if the 'is_approved' status is false or 2, then show a red popup message
                if (event.target.result.is_approved == false || event.target.result.is_approved == 2) {
                    //make it fade in over half a second, then show it
                    document.getElementById("warningPopover").style.transition = "opacity 0.5s";
                    document.getElementById("warningPopover").style.opacity = "1";
                    document.getElementById("warningPopover").style.display = "block";
                    //show in the middle of the screen
                    document.getElementById("warningPopover").style.top = "50%";
                    document.getElementById("warningPopover").style.left = "50%";
                    //scroll with the page
                    document.getElementById("warningPopover").style.position = "fixed";
                    //make it bigger
                    document.getElementById("warningPopover").style.width = "300px";
                    document.getElementById("warningPopover").style.height = "200px";
                    //give a red border
                    document.getElementById("warningPopover").style.borderColor = "red";
                } else {
                    //hide the warningPopover div
                    document.getElementById("warningPopover").style.display = "none";
                }
                const data = event.target.result;
                if (data.form_id == 2) {
                    document.getElementById("ep-token").innerHTML = data.fg_easypassthrough_token;
                    document.getElementById("company-name").innerHTML = data[2];
                    document.getElementById("first-name").innerHTML = data[1.3];
                    document.getElementById("last-name").innerHTML = data[1.6];
                    document.getElementById("email").innerHTML = data[4];
                    // https://americanevents.com/wp-content/uploads/gravity_forms/2-b86e11c27810acd2a201751fdb206ce1/2023/07/dog-png-30.png|:||:||:||:|
                    // we need to split the string at the |:| delimiter
                    document.getElementById("profile-picture").src = data[21].split("|:|")[0];
                    document.getElementById("badge-name").innerHTML = data[1.3] + " " + data[1.6];
                    document.getElementById("badge-company-name").innerHTML = data[2];
                    document.getElementById("badge-title").innerHTML = data[3];
                    fetch('https://americanevents.com/wp-json/gf/v2/entries', {
                        method: 'POST',
                        headers: {
                          'Authorization': 'Basic ' + btoa('ck_88f71f290fb7a0584ec2709f5424f7ecd4e5d9c4:cs_622f5926d7108322a8700fbba7e56e8773702c57'),
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            // 1.3 = first name, 1.6 = last name, title = 3, email = 4, company name = 5, check-in time = 6, form_title = 13, form id = 7, fg_easypassthrough_token = 8
                            "form_id": 85,
                            "1.3": data[1.3],
                            "1.6": data[1.6],
                            "3": data[3],
                            "4": data[4],
                            "5": data[2],
                            // output current time in the format "2021-01-01 12:00:00"
                            "6": new Date().toISOString().slice(0, 19).replace('T', ' '),
                            "7": data.form_id,
                            "8": data.fg_easypassthrough_token
                        }),
                    })
                }
                else if (data.form_id == 73) {
                    document.getElementById("ep-token").innerHTML = data[11];
                    document.getElementById("company-name").innerHTML = data[4];
                    document.getElementById("first-name").innerHTML = data[1.3];
                    document.getElementById("last-name").innerHTML = data[1.6];
                    document.getElementById("email").innerHTML = data[13];
                    // populate badge with first name, last name, company name, title, and a qr code with the epToken
                    document.getElementById("badge-name").innerHTML = data[1.3] + " " + data[1.6];
                    document.getElementById("badge-company-name").innerHTML = data[4];
                    document.getElementById("badge-title").innerHTML = data[3];
                    fetch('https://americanevents.com/wp-json/gf/v2/entries', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + btoa('ck_88f71f290fb7a0584ec2709f5424f7ecd4e5d9c4:cs_622f5926d7108322a8700fbba7e56e8773702c57'),
                            'Content-Type': 'application/json'
                          },
                        body: JSON.stringify({
                            // 1.3 = first name, 1.6 = last name, title = 3, email = 4, company name = 5, check-in time = 6, form_title = 13, form id = 7, fg_easypassthrough_token = 8
                            "form_id": 85,
                            "1.3": data[1.3],
                            "1.6": data[1.6],
                            "3": data[3],
                            "4": data[13],
                            "5": data[4],
                            "6": new Date().toISOString().slice(0, 19).replace('T', ' '),
                            "7": data.form_id,
                            "8": data.fg_easypassthrough_token
                        }),
                    })
                    }
                }
            }  
        }
    }
    const form = document.querySelector('#registration-form');
    // open modal with <button class="open-registration-modal" id="open-registration-modal">On-Site Registration</button>
    const openModal = document.querySelector('.open-registration-modal');
    const modal = document.querySelector('#registration-modal');
    const closeButton = document.querySelector('.close-button');
    const registerButton = document.querySelector('#register-button');
    
    openModal.addEventListener('click', () => {
      modal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });

    form.addEventListener('submit', (event) => {
          event.preventDefault(); // prevent the form from submitting normally
    
      const firstName = document.querySelector('#form-first-name').value;
      const lastName = document.querySelector('#form-last-name').value;
      const email = document.querySelector('#form-email').value;
      const company = document.querySelector('#form-company').value;
      const title = document.querySelector('#form-title').value;
    
      // make a POST request to the form 85 endpoint with the form data
      fetch('https://americanevents.com/wp-json/gf/v2/entries', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('ck_88f71f290fb7a0584ec2709f5424f7ecd4e5d9c4:cs_622f5926d7108322a8700fbba7e56e8773702c57'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "form_id": 85,
          "1.3": firstName,
          "1.6": lastName,
          "3": title,
          "4": email,
          "5": company,
          "6": new Date().toISOString().slice(0, 19).replace('T', ' '),
          "13": "On-Site Registration"
        }),
      })
      .then(response => response.json())
      .then(data => {
        // populate the badge with the submitted information
        document.getElementById("badge-name").innerHTML = firstName + " " + lastName;
        document.getElementById("badge-company-name").innerHTML = company;
        document.getElementById("badge-title").innerHTML = title;
        // populate the checkin section with the submitted information
        document.getElementById("ep-token").innerHTML = data[8];
        document.getElementById("company-name").innerHTML = company;
        document.getElementById("first-name").innerHTML = firstName;
        document.getElementById("last-name").innerHTML = lastName;
        document.getElementById("email").innerHTML = email;
        // close the modal
        modal.style.display = 'none';
      })
      .catch(error => console.error(error));
    });
//for testing, create a function to set trigger the populateCheckinSection function with the epToken "ac5da0fbd5c95e10de1d35dd3b615aa3"
function test() {
    populateCheckinSection("66f1bc7766b5d5658d3c21824cccf3d3");
}
//test2 is an approved visitor
function test2() {
    populateCheckinSection("14279b4ddf6a9ba35ae80f380a09a261");
}

function logMessage(message) {
    const request = indexedDB.open("log", 1);
    request.onerror = function(event) {
      console.error("Failed to open log database");
    };
    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction("logs", "readwrite");
      const objectStore = transaction.objectStore("logs");
      const logEntry = { timestamp: new Date(), message: message };
      const addRequest = objectStore.add(logEntry);
      addRequest.onerror = function(event) {
        console.error("Failed to add log entry to database");
      };
      addRequest.onsuccess = function(event) {
        console.log("Log entry added to database");
      };
    };
  }

  function printBadge() {
    var tmp = document.createDocumentFragment(),
    printme = document.getElementById('badge').cloneNode(true);
    printme.style.height = '37mm';
    printme.style.width = '90mm';
    printme.style.marginBottom = '0';
    printme.style.border = 'none';
    //get rid of the background image 
    printme.style.top = '0';
    printme.style.left = '0';
    //clear .badgetext elements top style in the cloned element
    let badgeText = printme.getElementsByClassName("badgetext");
    for(let i = 0; i < badgeText.length; i++) {
        badgeText[i].style.top = '0';
    }
    //do the same for the badge-qr 
    let badgeQR = printme.getElementsByClassName("badge-qr");
    for(let i = 0; i < badgeQR.length; i++) {
    }      
    while (document.body.firstChild) {
      tmp.appendChild(document.body.firstChild);
    }
    setTimeout(function() {

    document.body.appendChild(printme);
    window.print();
  
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    document.body.appendChild(tmp);
  }
    , 100);
}
document.getElementById('printbadge').onclick = printBadge;

document.getElementById("bottomtoolbar").style.display = "flex";

