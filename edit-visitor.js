globalEntryID = '';
//when a user clicks the 'editButton' in the modal, fetch that user's data from the database and populate the form with it to get the most up-to-date information
//do this on 'editbutton' click
var editButton = document.getElementById("editButton");
editButton.addEventListener("click", function () {
var visitorEditor = document.getElementById("visitorEditor");
var firstName = document.querySelector("#firstName");
var lastName = document.querySelector("#lastName");
var companyName = document.querySelector("#companyName");
var title = document.querySelector("#title");
var email = document.querySelector("#email");
var phone = document.querySelector("#phone");
var address = document.querySelector("#streetAddress");
var address2 = document.querySelector("#streetAddress2");
var city = document.querySelector("#city");
var state = document.querySelector("#state");
var zip = document.querySelector("#zip");
var country = document.querySelector("#country");
var epToken = document.querySelector("#epToken");
var entryID = document.querySelector("#entryID");

//use the epToken to fetch the user's data from the database

fetch(`https://americanevents.com/wp-json/gf/v2/entries?search={"field_filters": [{"key":"form_id","value":"2"},{"key":"fg_easypassthrough_token","value":"` + epToken.value + `"}]}`, {
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + btoa('ck_88f71f290fb7a0584ec2709f5424f7ecd4e5d9c4:cs_622f5926d7108322a8700fbba7e56e8773702c57')
    }
})
.then(function (response) {
    return response.json();
})
.then(function (data) {
    var updating = document.getElementById("updating");
    updating.style.display = "none";
    
//create an array of the user's data in a local storage key called 'visitorData'
localStorage.setItem("visitorData", JSON.stringify(data));
//get the user's data from the local storage key called 'visitorData'
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
//populate the form with the user's data
firstName.value = visitorData.entries[0][1.3];
lastName.value = visitorData.entries[0][1.6];
companyName.value = visitorData.entries[0][2];
title.value = visitorData.entries[0][3];
email.value = visitorData.entries[0][4];
phone.value = visitorData.entries[0][5];
address.value = visitorData.entries[0][6.1];
address2.value = visitorData.entries[0][6.2];
city.value = visitorData.entries[0][6.3];
state.value = visitorData.entries[0][6.4];
zip.value = visitorData.entries[0][6.5];
country.value = visitorData.entries[0][6.6];
//unhide the form and editorcontainer
visitorEditor.style.display = "block";
var editorContainer = document.getElementById("editorcontainer");
editorContainer.style.display = "block";
});
});
//when the user clicks 'editButton' in the modal, unhide the 'updating' div and animate a '...' ellipses to show that the form is updating
var editButton = document.getElementById("editButton");
editButton.addEventListener("click", function () {
    //dots should be on same line as text
var updating = document.getElementById("updating");
updating.style.display = "block";
var dots = document.getElementById("dots");
var dotCount = 0;
var interval = setInterval(function () {
if (dotCount < 3) {
dots.innerHTML += ".";
dotCount++;
} else {
dots.innerHTML = "";
dotCount = 0;
}
//make the updating text and dots smoothly cycle colors while the dots are animating
var updating = document.getElementById("updating");
updating.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
//i can make this transition smoother by using a transition property in the css
updating.style.transition = "color 1s";
}, 500);
});

//update the visitorData object if any of the form fields are changed
var firstName = document.querySelector("#firstName");
firstName.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][1.3] = firstName.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var lastName = document.querySelector("#lastName");
lastName.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][1.6] = lastName.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var companyName = document.querySelector("#companyName");
companyName.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][2] = companyName.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var title = document.querySelector("#title");
title.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][3] = title.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var email = document.querySelector("#email");
email.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][4] = email.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var phone = document.querySelector("#phone");
phone.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][5] = phone.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var address = document.querySelector("#streetAddress");
address.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][6.1] = address.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var address2 = document.querySelector("#streetAddress2");
address2.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][6.2] = address2.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var city = document.querySelector("#city");
city.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][6.3] = city.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var state = document.querySelector("#state");
state.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][6.4] = state.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var zip = document.querySelector("#zip");
zip.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][6.5] = zip.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});
var country = document.querySelector("#country");
country.addEventListener("change", function () {
var visitorData = JSON.parse(localStorage.getItem("visitorData"));
visitorData.entries[0][6.6] = country.value;
localStorage.setItem("visitorData", JSON.stringify(visitorData));
});

var saveButton = document.getElementById("saveEdits");
saveButton.addEventListener("click", function () {
  event.preventDefault();
  var visitorData = JSON.parse(localStorage.getItem("visitorData"))
  var entryData = visitorData.entries[0]
  fetch(`https://americanevents.com/wp-json/gf/v2/entries/` + '' + globalEntryID, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa("ck_88f71f290fb7a0584ec2709f5424f7ecd4e5d9c4:cs_622f5926d7108322a8700fbba7e56e8773702c57"),
    },
    body: JSON.stringify(entryData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
        modal.style.display = "none";       
      }
      return response.json();
      
    })
    .then((data) => {
            //close the modal
            modal.style.display = "none";
            //make a small 'edits saved' message appear over the top of the screen in the middle of the page pop up and fade out after 1 second
            var editsSaved = document.createElement("div");
            editsSaved.id = "editsSaved";
            editsSaved.innerHTML = "Edits Saved";
            document.body.appendChild(editsSaved);
            editsSaved.style.position = "fixed";
            editsSaved.style.top = "50%";
            editsSaved.style.left = "50%";
            editsSaved.style.transform = "translate(-50%, -50%)";
            setTimeout(function () {
              editsSaved.style.transition = "opacity 1s";
              editsSaved.style.opacity = "0";
            }, 100);
            setTimeout(function () {
              document.body.removeChild(editsSaved);
            }, 2000);
      console.log(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

    });    