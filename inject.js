window.alert = function alert(msg) {
  console.log('Hidden Alert ' + msg);
};
window.confirm = function confirm(msg) {
  console.log('Hidden Confirm ' + msg);
  return true; /*simulates user clicking yes*/
};

//Getting a random integer between two values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


//section that get refresh random time
const refresh_time_url = "http://localhost/refresh"
let timeConvertMin;
async function getRefreshTime(url) {
  const response = await fetch(url);
  const refresh_time = await response.json();
  timeConvertMin = getRandomInt(refresh_time[0].first_time, refresh_time[0].second_time) * 1000;
  console.log("time---", timeConvertMin);
}
getRefreshTime(refresh_time_url)

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const pasteToElement = (element) => {
  element.select();
  document.execCommand('paste');
};

const copyText = (str, element) => {
  // console.log(str);
  // console.log(element);
  const el = document.createElement('textarea');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('paste');
  copyToClipboard(str);
  pasteToElement(element);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

class B extends Error {
  constructor(e, t) {
    super(e), (this.name = 'CustomError'), (this.title = t);
  }
}
class L extends B {
  constructor(e, t) {
    super(e, t), (this.name = 'SystemError');
  }
}
class S extends B {
  constructor(e, t) {
    super(e, t), (this.name = 'ConfigError');
  }
}

let diff = ['25AUG'];
const getElementByXpath = (path) => {
  var elements;
  try {
    const result = document.evaluate(
      path,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (0 !== result.snapshotLength) {
      elements = [];
      let t = 0;
      for (; t < result.snapshotLength;)
        elements.push(result.snapshotItem(t)), (t += 1);
    }
  } catch (e) {
    throw new S(`elementFinder: ${e.message.split(':')[1]}`, 'Invalid Xpath');
  }
  return elements;
};


if (location.href.indexOf('https://ha2.flica.net/ui/public/login/') >= 0) {

  const user_url = "http://localhost/users";
  async function autoSignIn(url) {
    const response = await fetch(url);
    const credential_data = await response.json();

    const id = credential_data[0].username;
    const element_id = document.getElementsByTagName('input')[0];
    const password = credential_data[0].password;
    const element_pass = document.getElementsByTagName('input')[1];
    const login_btn = document.getElementsByTagName('button')[0];
    console.log("ID------", credential_data[0].username)
    console.log("pass----", credential_data[0].password)
    copyText(id, element_id);
    copyText(password, element_pass);
    login_btn.click();
  }

  autoSignIn(user_url);

} else if (
  location.href.indexOf('https://ha2.flica.net/online/mainmenu.cgi') >= 0
) {
  const firstThread = setInterval(() => {
    console.log('here');

    const els = Array.from(
      document.body.firstChild.nextSibling.firstChild.contentWindow.document.getElementsByTagName(
        'a'
      )
    ).filter((e) => e.innerHTML.indexOf('View Reserve Grid') >= 0);
    if (els.length > 0) {
      els[1].click();
      const secondThread = setInterval(async () => {
        console.log(
          document
            .getElementsByTagName('iframe')[1]
            .contentWindow.document.querySelectorAll(
              'table td.ng-scope.buffer-color-red'
            ).length
        );
        if (
          document
            .getElementsByTagName('iframe')[1]
            .contentWindow.document.querySelectorAll(
              'table td.ng-scope.buffer-color-red'
            ).length == 0
        )
          return;
        const outdated = Array.from(
          document
            .getElementsByTagName('iframe')[1]
            .contentWindow.document.querySelectorAll(
              'table td.ng-scope.buffer-color-red'
            ),
          (e) =>
            e.previousElementSibling.previousElementSibling
              .previousElementSibling.innerText
        );
        diff =
          localStorage.outdated &&
          outdated.filter(
            (x) => !JSON.parse(localStorage.outdated).includes(x)
          );
        console.log("diff============>", diff);
        localStorage.setItem('outdated', JSON.stringify(outdated));
        localStorage.setItem('diff', JSON.stringify(diff));
        location.href =
          'https://ha2.flica.net/full/otframe.cgi?BCID=004.049&ViewOT=1';
        console.log('I will go to Opentime Pot');

        clearInterval(secondThread);
      }, 100);

      clearInterval(firstThread);
    }
  }, 500);
} else if (
  location.href.indexOf('https://ha2.flica.net/full/otframe.cgi') >= 0
) {
  const fourthThread = setInterval(() => {

    // getting a range date from server
    const alert_url = "http://localhost/alerts";
    let firstDate, secondDate, curMonth, curFirstDate, curSecondDate;
    async function getAlert(url) {
      const response = await fetch(url);
      const data_alert = await response.json();
      firstDate = data_alert[0].first_date;
      secondDate = data_alert[0].second_date;

      curMonth = firstDate.match(/[a-zA-Z]+/g).toString().toUpperCase();  // string for specific month e: AUG
      curFirstDate = firstDate.match(/\d+/g);                             // first date for specific month  e: 22
      curSecondDate = secondDate.match(/\d+/g);                           // second date for specific month  e: 24
      if (
        document
          .getElementsByTagName('iframe')[2]
          .contentDocument.getElementsByTagName('td').length > 0
      ) {
        localStorage.setItem('diff', JSON.stringify(['25AUG']));        

        const days = [
          ...document
            .getElementsByTagName('iframe')[2]
            .contentDocument.getElementsByTagName('td'),
        ].filter((e) => e.innerText.includes(curMonth))
          .map((e) => [
            e.innerText,
            e.previousElementSibling.innerText,
            e.nextElementSibling.nextElementSibling.innerText,
            e.nextElementSibling.nextElementSibling.nextElementSibling
              .nextElementSibling.nextElementSibling.nextElementSibling
              .nextElementSibling.nextElementSibling.innerText,
          ]);

          
        let results = [];     // data between firstDate and secondDate
        let searchKey = []
        let s_date = parseInt(curFirstDate);
        let e_date = parseInt(curSecondDate);
        for (let i = s_date; i <= e_date; i++) {
          searchKey.push(i + curMonth)
        }

        days.forEach(function (item) {
          let date = item[0].trim();
          let flag = false;
          searchKey.forEach(function (keyItem) {
            if (date.includes(keyItem)) {
              flag = true;
              return;
            }
          })
          if (flag) {
            results.push(item)
          }
        })

        // console.log("results--------", results);

        // let minDate = parseInt(firstDate.split(curMonth)[0]);
        // let maxDate = parseInt(secondDate.split(curMonth)[0]);

        let finalResult = [];
        
        // console.log("localStorage.diff ===========>", localStorage.diff);
        results.forEach(function (item) {
          let curDate = parseInt(item[0].trim().split(curMonth)[0]);
          let offset = parseInt(item[2]);
          let redDate = parseInt(diff[0].split(curMonth)[0]);
          console.log("redDate======>", redDate)
          if (redDate >= (curDate + offset - 1)) {
            finalResult.push(item);
          }
        })

        console.log("finalResult----", finalResult)
        // console.log("finalResult------------", JSON.stringify(finalResult));

        localStorage.setItem("opentime", JSON.stringify(finalResult))
        // console.log("localStorage.opentime =====>",localStorage.opentime);

        if (localStorage.diff && localStorage.opentime) {
          // console.log("opentime ====>", localStorage.opentime);
          // console.log("diff ====>", localStorage.diff);
          const data = JSON.parse(localStorage.opentime);
          chrome.runtime.sendMessage({ data }, function (response) {
            console.log(response.farewell);
          });

          localStorage.setItem('diff', '');
        }

        setTimeout(() => location.href = "https://ha2.flica.net/online/mainmenu.cgi", timeConvertMin);
        clearInterval(fourthThread);
      }
    }
    getAlert(alert_url);



  }, 1000);
}

