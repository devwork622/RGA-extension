window.alert = function alert(msg) {
  console.log('Hidden Alert ' + msg);
};
window.confirm = function confirm(msg) {
  console.log('Hidden Confirm ' + msg);
  return true; /*simulates user clicking yes*/
};

let diff1 = [];
let diff2 = [];
const month_url = "https://topwebdev.pro/alerts";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let data_alert, requestMonth, correctIndex, alertType, firstDate, secondDate, limitCount, j, curMonth;
async function getAlertData(url) {
  const response = await fetch(url);
  data_alert = await response.json();
  limitCount = data_alert.length;

  if (data_alert == undefined) return;
  else {
    j = Math.floor(Math.random() * limitCount)

    console.log("data_alert------", data_alert);
    console.log("limitCount------", limitCount);
    console.log("j------", j);

    firstDate = data_alert[j].first_date;
    secondDate = data_alert[j].second_date;
    alertType = data_alert[j].type;
    console.log("firstDate------", firstDate);
    console.log("secondDate------", secondDate);
    console.log("type------", alertType);

    curMonth = firstDate.match(/[a-zA-Z]+/g).toString().toUpperCase();  // string for specific month e: AUG
    localStorage.setItem('curMonth', curMonth)
    // curFirstDate = firstDate.match(/\d+/g);                             // first date for specific month  e: 22
    // curSecondDate = secondDate.match(/\d+/g);                           // second date for specific month  e: 24
    requestMonth = firstDate.match(/[a-zA-Z]+/g).toString();
    const d = new Date();
    const realMonth = months[d.getMonth()];
    const realDate = d.getDate();

    if (realDate < 23) {
      correctIndex = 1;
    }
    else {
      if (requestMonth == realMonth)
        correctIndex = 1;
      else
        correctIndex = 2;
    }
  }
}


// get opentimeurl automatically
function goToCurrentOpentimeUrl() {
  const openTimeUrl2022Aug = "https://ha2.flica.net/full/otframe.cgi?BCID=003.100&ViewOT=1";
  let i = months.indexOf(requestMonth) + 1;
  let gap;
  gap = 100 + i - 8;
  const myArray = openTimeUrl2022Aug.split("100");
  let newIdx = gap.toString();
  let openTimeNewUrl = myArray[0] + newIdx + myArray[1];
  location.href = openTimeNewUrl;
}

//Getting a random integer between two values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//section that get refresh random time
const refresh_time_url = "https://topwebdev.pro/refresh"
let timeConvertMin;
async function getRefreshTime(url) {
  const response = await fetch(url);
  const refresh_time = await response.json();
  timeConvertMin = getRandomInt(refresh_time[0].first_time, refresh_time[0].second_time) * 1000;
  console.log("refresh time---", timeConvertMin);
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

  const user_url = "https://topwebdev.pro/users";
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

  getAlertData(month_url);
  const firstThread = setInterval(() => {
    const els = Array.from(document.body.firstChild.nextSibling.firstChild.contentWindow.document.getElementsByTagName('a')).filter((e) => e.innerHTML.indexOf('View Reserve Grid') >= 0);
    // const els_opentime = Array.from(document.body.firstChild.nextSibling.firstChild.contentWindow.document.getElementsByTagName('a')).filter((e) => e.innerHTML.indexOf('View Opentime Pot') >= 0);

    if (els.length > 0) {
      els[correctIndex].click();
      if (alertType == 1) {
        const secondThread = setInterval(async () => {
          if (document.getElementsByTagName('iframe')[1].contentWindow.document.querySelectorAll('table td.ng-scope.buffer-color-red').length == 0)
            return;

          const outdated1 = Array.from(document.getElementsByTagName('iframe')[1].contentWindow.document.querySelectorAll('table td.ng-scope.buffer-color-red'),
            (e) => e.previousElementSibling.previousElementSibling.previousElementSibling.innerText);

          if (localStorage.outdated1 == null) diff1 = null;
          else diff1 = localStorage.outdated1 && outdated1.filter((x) => !JSON.parse(localStorage.outdated1).includes(x));   
          // diff1 = ['13SEP'];
          console.log("diff1============>", diff1);

          localStorage.setItem('outdated1', JSON.stringify(outdated1));
          localStorage.setItem('diff1', diff1);

          goToCurrentOpentimeUrl();

          clearInterval(secondThread);
        }, 100);
      }
      else {
        const secondThread = setInterval(async () => {
          if (document.getElementsByTagName('iframe')[1].contentWindow.document.querySelectorAll('table td.ng-scope.buffer-color-green').length == 0)
            return;

          const outdated2 = Array.from(document.getElementsByTagName('iframe')[1].contentWindow.document.querySelectorAll('table td.ng-scope.buffer-color-green'),
            (e) => e.previousElementSibling.previousElementSibling.previousElementSibling.innerText);
          if (localStorage.outdated2 == null) diff2 = null;
          else diff2 = localStorage.outdated2 && outdated2.filter((x) => !JSON.parse(localStorage.outdated2).includes(x));   
          // diff2 = ['21SEP'] ;
          console.log("diff2============>", diff2);

          localStorage.setItem('outdated2', JSON.stringify(outdated2));
          localStorage.setItem('diff2', diff2);

          const month_url = "https://topwebdev.pro/alerts";
          async function getDropFromAlert(url) {
            const response = await fetch(url);
            data_alert = await response.json();
            let data_drop = [];
            for (let i = 0; i < data_alert.length; i++) {
              if (data_alert[i].type == 2)
                data_drop.push(data_alert[i]);
            }

            let dropCount = data_drop.length;
            if (localStorage.diff2) {
              let m = 0;
              function sendMessage() {
                console.log('sendMessage')
               
                let searchKey = "";
                let getClass;
                let count = 0;
                let s_date = parseInt(data_drop[m].first_date.match(/\d+/g));
                let e_date = parseInt(data_drop[m].second_date.match(/\d+/g));
                let diff2Num = parseInt(diff2[0].match(/\d+/g));
                let period = e_date - s_date + 1;
                let strMonth = data_drop[m].first_date.match(/[a-zA-Z]+/g).toString().toUpperCase();

                if(diff2Num >= s_date && diff2Num <= e_date) {
                  for (let i = s_date; i <= e_date; i++) {
                    if (i < 10) searchKey = ("0" + i + strMonth)
                    else searchKey = (i + strMonth)
  
                    getClass = [...document.getElementsByTagName('iframe')[1].contentDocument.getElementsByTagName('td'),].filter((e) => e.innerText.includes(searchKey))
                      .map((e) => [
                        e.nextElementSibling.nextElementSibling.nextElementSibling.getAttribute('class')
                      ]);
                     
                    if (getClass[0][0] == "ng-scope buffer-color-green") {
                       count++;
                    }
                  }
  
                  console.log("count", count);
                  console.log("period", period);
                  if (count == period) {
                    console.log("sending result");
                    console.log("data_drop[m]", (data_drop[m]));
                    let data = [];
                    data.push(data_drop[m]);
                    chrome.runtime.sendMessage({ data }, function (response) {
                      console.log(response.farewell);
                    });
  
                    localStorage.setItem('diff2', '');
  
                  }
                }

              }

              function callSendMessage() {
                if (m < dropCount) {
                  sendMessage();
                  m++;
                  againCallSendMessage();
                }
                else
                  return;
              }

              function againCallSendMessage() {
                callSendMessage();
              }

              callSendMessage();
            }

            setTimeout(() => {
              location.href = "https://ha2.flica.net/online/mainmenu.cgi"
            }, timeConvertMin)
            
          }
          getDropFromAlert(month_url);

          clearInterval(secondThread);
        }, 100);
      }

      clearInterval(firstThread);

    }
  }, 500);
} else if (
  location.href.indexOf('https://ha2.flica.net/full/otframe.cgi') >= 0
) {
  const fourthThread = setInterval(() => {

    // getting a range date from server    
    if (document.getElementsByTagName('iframe')[2].contentDocument.getElementsByTagName('td').length > 0) {
      // localStorage.setItem('diff', JSON.stringify(['29AUG']));

      const days = [...document.getElementsByTagName('iframe')[2].contentDocument.getElementsByTagName('td'),].filter((e) => e.innerText.includes(localStorage.curMonth))
        .map((e) => [
          e.innerText,
          e.previousElementSibling.innerText,
          e.nextElementSibling.nextElementSibling.innerText,
          e.nextElementSibling.nextElementSibling.nextElementSibling
            .nextElementSibling.nextElementSibling.nextElementSibling
            .nextElementSibling.nextElementSibling.innerText,
        ]);

      const month_url = "https://topwebdev.pro/alerts";
      async function getAlertDataAgain(url) {
        const response = await fetch(url);
        data_alert = await response.json();
        let data_ppu = [];
        for (let i = 0; i < data_alert.length; i++) {
          if (data_alert[i].type == 1)
            data_ppu.push(data_alert[i]);
        }

        let ppuCount = data_ppu.length
        // let dropCount = data_drop.length
        if (localStorage.diff1) {
          console.log("diff1", localStorage.diff1)
          let k = 0;
          function sendMessage() {
            let results = [];     // data between firstDate and secondDate
            let searchKey = []
            let s_date = parseInt(data_ppu[k].first_date.match(/\d+/g));
            let e_date = parseInt(data_ppu[k].second_date.match(/\d+/g));
            let strMonth = data_ppu[k].first_date.match(/[a-zA-Z]+/g).toString().toUpperCase();
            for (let i = s_date; i <= e_date; i++) {
              if (i < 10) searchKey.push("0" + i + strMonth)
              else searchKey.push(i + strMonth)
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
          
            let finalResult = [];
           
            results.forEach(function (item) {
              let curDate = parseInt(item[0].trim().split(strMonth));    //Dates
              let offset = parseInt(item[2]);     //Days
              let diffDate = parseInt(localStorage.diff1.split(strMonth));
              if(curDate <= diffDate) {
                item.push("PPU");
                item.push(data_ppu[k].name);
                item.push(data_ppu[k].first_date);
                item.push(data_ppu[k].second_date);
                finalResult.push(item);
              }
              else {
                if (diffDate >= (curDate + offset - 1)) {
                  item.push("PPU");
                  item.push(data_ppu[k].name);
                  item.push(data_ppu[k].first_date);
                  item.push(data_ppu[k].second_date);
                  finalResult.push(item);
                }
              }
            })

            if (finalResult.length == 0) {
              console.log("no result");
            }
            else {
              console.log("sending result");
              localStorage.setItem("opentime", JSON.stringify(finalResult))

              if (localStorage.diff1 && localStorage.opentime) {
                const data = JSON.parse(localStorage.opentime);
                chrome.runtime.sendMessage({ data }, function (response) {
                  console.log(response.farewell);
                });

                localStorage.setItem('diff1', '');
              }
            }

          }

          function callSendMessage() {
            if (k < ppuCount) {
              sendMessage();
              k++;
              againCallSendMessage();
            }
            else
              return;
          }

          function againCallSendMessage() {
            callSendMessage();
          }

          callSendMessage();
        }


        setTimeout(() => {
          location.href = "https://ha2.flica.net/online/mainmenu.cgi"
        }, timeConvertMin)

      }
      getAlertDataAgain(month_url);



      clearInterval(fourthThread);
    }
  }, 500);  
  
}

let oneDayTime = 24 * 3600 * 1000;
setTimeout(() => {
  location.href = "https://ha2.flica.net/ui/public/login";
}, oneDayTime);