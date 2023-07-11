
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

//search the fg_easypassthrough_token key in the entries object store under the visitorData indexDb for the value of the epToken variable
function populateCheckinSection(epToken) {
    let db;
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
                    document.getElementById("first-name").innerHTML = data[1];
                    // add logging functionality here
                }
            }
        }
    }
}

//for testing, create a function to set trigger the populateCheckinSection function with the epToken "ac5da0fbd5c95e10de1d35dd3b615aa3"
function test() {
    populateCheckinSection("ac5da0fbd5c95e10de1d35dd3b615aa3");
}
//test2 is an approved visitor
function test2() {
    populateCheckinSection("089223a03d1c456cda2d4b76b7a87416");
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
        
      //attach the printBadge function to the print button
        document.getElementById('printbadge').onclick = printBadge;

        document.getElementById("bottomtoolbar").style.display = "flex";

