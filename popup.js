toggle_pass.addEventListener('click', function () {  // toggle password section
  let x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    toggle_pass.className = "fa fa-fw fa-eye field-icon toggle-password"
  } else {
    x.type = "password";
    toggle_pass.className = "fa fa-fw fa-eye-slash field-icon toggle-password"
  }
})

alert_type.addEventListener('change', function () {       // to show/hide scheduled trip in main setting
  const options = document.getElementById('alert_type').options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].selected) {
      console.log(options[i].value);
      if (options[i].value == 2)
        document.getElementById('d_trip').style.display = "block";
      else
        document.getElementById('d_trip').style.display = "none";
    }
  }
})


let switch_btn = document.getElementById("switch_btn")    // switch toggle button

switch_btn.addEventListener('click', function () {
  console.log("clicked")
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let counter = 1
        counter++;
        console.log(counter);
        if (counter % 2 == 0) {
          location.href = "https://ha2.flica.net/ui/public/login/";
        }
        // else
        //   window.close();

      },
    })
  })
})

// funtion to send username and password to server
user_add.addEventListener('click', async function () {
  let url = 'http://localhost/users';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  let data = { 'username': username, 'password': password };

  document.getElementById("users_tbody").innerHTML = `<tr id="user_row"><td>${username}</td><td>${password}</td><td><p>none</p></td></tr>`;

  let res = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

})

// function to get username and password from server
const api_url = "http://localhost/users";
async function getapi(url) {
  const response = await fetch(url);
  const data_users = await response.json();
  showUsers(data_users[0].username, data_users[0].password);
}
getapi(api_url);

// function to define innerHTML for HTML table
function showUsers(username, password) {
  document.getElementById("users_tbody").innerHTML = `<tr id="user_row"><td>${username}</td><td>${password}</td><td><p>none</p></td></tr>`;
}


// funtion to send email to server
email_add.addEventListener('click', async function () {
  let url = 'http://localhost/emails';
  const email = document.getElementById('email').value;
  let data = { 'email': email };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const data_email = await res.json();
  showEmails(data_email);

})

// function to get email from server
const email_url = "http://localhost/emails";
async function getEmail(url) {
  const response = await fetch(url);
  const data_email = await response.json();
  showEmails(data_email);
}
getEmail(email_url);

// function to define innerHTML for HTML table

function showEmails(emails) {
  console.log(emails);
  var str_email = ``;
  emails.map((value, index) => {
    str_email += `<tr id="${value.id}">
      <td>${index + 1}</td>
      <td>${value.email}</td>
      <td><a href="#" name="remove_email" key=${value.id}>remove</a></td>
    </tr>`
  })

  document.getElementById("email_tbody").innerHTML = str_email;
  remove_email = document.getElementsByName("remove_email");
  // console.log(remove_email)
  for (var i = 0; i < remove_email.length; i++) {
    // console.log(typeof (remove_email[i]));
    remove_email[i].addEventListener('click', function (e) {
      let email_id = e.target.getAttribute("key");
      fetch(`http://localhost/emails/delete-email${email_id}`, {
        method: 'DELETE',
      })
        .then(res => res.text()) // or res.json()
        .then(res => console.log(res))
      const remove_email_ele = document.getElementById(email_id);
      remove_email_ele.remove();
    })
  }
}

// funtion to send refresh time to server
refresh_add.addEventListener('click', async function () {
  let url = 'http://localhost/refresh';
  const time1 = document.getElementById('time1').value;
  const time2 = document.getElementById('time2').value;
  let data = { 'firstTime': time1, 'secondTime': time2 };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const data_refresh = await res.json();
  showRefresh(data_refresh[0].first_time, data_refresh[0].second_time);

})

// function to get refresh time from server
const refresh_url = "http://localhost/refresh";
async function getRefresh(url) {
  const response = await fetch(url);
  const data_refresh = await response.json();
  showRefresh(data_refresh[0].first_time, data_refresh[0].second_time);
}
getRefresh(refresh_url);

function showRefresh(time1, time2) {
  document.getElementById('refresh_time1').innerHTML = time1;
  document.getElementById('refresh_time2').innerHTML = time2;
}


// funtion to send main information to server
alert_add_btn.addEventListener('click', async function () {
  let url = 'http://localhost/alerts';
  const alertName = document.getElementById('alertname').value;
  const firstDate = document.getElementById('fdate').value;
  const secondDate = document.
  getElementById('sdate').value;
  const selectOption = document.getElementById('alert_type');
  const alertType = selectOption.options[selectOption.selectedIndex].value;
  let scheduledTrip, stringFirstMonth, stringSecondMonth, convertedFirstDate;
  if (alertType == 1) scheduledTrip = "";
  else scheduledTrip = document.getElementById('sch_trip').value;
  let firstDateArray = firstDate.split("-");
  let secondDateArray = secondDate.split("-");
  let numFirstMonth = Number(firstDateArray[1]);
  let numFirstDate = Number(firstDateArray[2]);
  let numSecondMonth = Number(secondDateArray[1]);
  let numSecondDate = Number(secondDateArray[2]);
  console.log("numSecondMonth---", numSecondMonth);
  switch (numFirstMonth) {
    case 1:
      stringFirstMonth = "Jan";
      break;
    case 2:
      stringFirstMonth = "Feb";
      break;
    case 3:
      stringFirstMonth = "Mar";
      break;
    case 4:
      stringFirstMonth = "Apr";
      break;
    case 5:
      stringFirstMonth = "May";
      break;
    case 6:
      stringFirstMonth = "Jun";
      break;
    case 7:
      stringFirstMonth = "Jul";
      break;
    case 8:
      stringFirstMonth = "Aug";
      break;
    case 9:
      stringFirstMonth = "Sep";
      break;
    case 10:
      stringFirstMonth = "Oct";
      break;
    case 11:
      stringFirstMonth = "Nov";
      break;
    case 12:
      stringFirstMonth = "Dec";
      break;
    default:
      console.log("Invalid Month");

  }

  switch (numSecondMonth) {
    case 1:
      stringSecondMonth = "Jan";
      break;
    case 2:
      stringSecondMonth = "Feb";
      break;
    case 3:
      stringSecondMonth = "Mar";
      break;
    case 4:
      stringSecondMonth = "Apr";
      break;
    case 5:
      stringSecondMonth = "May";
      break;
    case 6:
      stringSecondMonth = "Jun";
      break;
    case 7:
      stringSecondMonth = "Jul";
      break;
    case 8:
      stringSecondMonth = "Aug";
      break;
    case 9:
      stringSecondMonth = "Sep";
      break;
    case 10:
      stringSecondMonth = "Oct";
      break;
    case 11:
      stringSecondMonth = "Nov";
      break;
    case 12:
      stringSecondMonth = "Dec";
      break;
    default:
      console.log("Invalid Month");

  }
  
  convertedFirstDate = (numFirstDate + stringFirstMonth).toString();
  convertedSecondDate = (numSecondDate + stringSecondMonth).toString();

  let data = {
    'alertName': alertName,
    'firstDate': convertedFirstDate,
    'secondDate': convertedSecondDate,
    'alertType': alertType,
    'scheduledTrip': scheduledTrip,
  };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const data_alert = await res.json();
  showAlert(data_alert);

})


// function to get alerts information from server
const alert_url = "http://localhost/alerts";
async function getAlert(url) {
  const response = await fetch(url);
  const data_alert = await response.json();
  showAlert(data_alert);
}
getAlert(alert_url);

function showAlert(data_alert) {
  let type;
  if (data_alert[0].type == "1") type = "PPU";
  else type = "DROP";

  document.getElementById("alert_tbody").innerHTML = `<p>Name : <strong class="text-danger">${data_alert[0].name}</strong></p>
    <p>First Date : <strong class="text-danger">${data_alert[0].first_date}</strong></p>
    <p>Second Date : <strong class="text-danger">${data_alert[0].second_date}</strong></p>
    <p>Type : <strong class="text-danger">${type}</strong></p>
    <p>Scheduled Trip : <strong class="text-danger">${data_alert[0].scheduled_trip}</strong></p>`
}