//cloudProviderChanged
function cloudProviderChanged() {
    var cloudProvider = document.getElementById("cloudProvider").value;
    var cloudProvider = document.getElementById("cloudProvider").value;
    if (cloudProvider == "azure") {
        document.getElementById("tenantName").style.display = "block";
        document.getElementById("accountName").style.display = "none";
    }
    else {
        document.getElementById("tenantName").style.display = "none";
        document.getElementById("accountName").style.display = "block";
    }
}
function blurAzure(flag) {
    if (flag) {
        sendMessageToContentScript('blurAzure');
    }
    else {
        sendMessageToContentScript('unblurAzure');
    }
}
function blurAWS(flag) {
    if (flag) {
        sendMessageToContentScript('blurAWS');
    }
    else {
        sendMessageToContentScript('unblurAWS');
    }
}
function deleteConfig(elt) {
    chrome.storage.local.get('config', function (result) {
        if (result.config == undefined) {
            result.config = [];
        }
        //remove row from html table envs
        //remove row from storage
        result.config.splice(elt, 1);
        chrome.storage.local.set({ 'config': result.config }, function () {
            Refresh();
        });
    });
}
function SaveConfig() {
    chrome.storage.local.get('config', function (result) {
        if (result.config == undefined) {
            result.config = [];
        }
        if (document.getElementById("envName").value != '') {
            var envName = document.getElementById("envName").value;
            var cloudProvider = document.getElementById("cloudProvider").value;
            var accountName = document.getElementById("accountName").value;
            var envColor = document.getElementById("envColor").value;
            var tenantName = document.getElementById("tenantName").value;
            var customLabel = document.getElementById("customLabel").value;
            var config = { envName: envName, cloudProvider: cloudProvider, accountName: accountName, envColor: envColor, tenantName: tenantName, customLabel: customLabel };
            result.config.push(config);
            chrome.storage.local.set({ 'config': result.config }, function () {
                Refresh();
            });
        }
    });
}
function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: message }, function (response) {
            console.log(response);
        });
    });
}
/* Reload the table with updated configuration from storage */
function Refresh() {
    //send message to content script to refresh active tab
    sendMessageToContentScript('refresh');
    //reload table
    chrome.storage.local.get('config', function (result) {
        if (result.config == undefined) {
            result.config = [];
        }
        document.getElementById("envsBody").innerHTML = "";
        for (let i = 0; i < result.config.length; i++) {
            (function () {
                var rowCount = document.getElementById("envsBody").rows.length;
                var row = document.getElementById("envsBody").insertRow(rowCount);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                cell1.innerHTML = result.config[i].envName;
                //on cell click make it editable
                cell1.onclick = function () {
                    //transport cell to input
                    var input = document.createElement("input");
                    input.type = "text";
                    input.value = result.config[i].envName;
                    //on hit enter save
                    input.addEventListener("keyup", function (event) {
                        if (event.keyCode === 13) {
                            event.preventDefault();
                            cell1.innerHTML = input.value;
                            result.config[i].envName = input.value;
                            chrome.storage.local.set({ 'config': result.config }, function () {
                                Refresh();
                            });
                        }
                    });
                    cell1.innerHTML = "";
                    cell1.appendChild(input);
                    input.focus();
                }
                cell2.innerHTML = result.config[i].cloudProvider;
                //transport cell to select
                cell2.onclick = function () {
                    var select = document.createElement("select");
                    select.id = "cloudProvider";
                    select.innerHTML = "<option value='azure'>Azure</option><option value='aws'>AWS</option>";
                    select.value = result.config[i].cloudProvider;
                    select.addEventListener("change", function (event) {
                        event.preventDefault();
                        cell2.innerHTML = select.value;
                        result.config[i].cloudProvider = select.value;
                        chrome.storage.local.set({ 'config': result.config }, function () {
                            Refresh();
                        });
                    });
                    cell2.innerHTML = "";
                    cell2.appendChild(select);
                    select.focus();
                }
                cell3.innerHTML = result.config[i].accountName;
                cell3.onclick = function () {
                    var input = document.createElement("input");
                    input.type = "text";
                    input.value = result.config[i].accountName;
                    input.addEventListener("keyup", function (event) {
                        if (event.keyCode === 13) {
                            event.preventDefault();
                            cell3.innerHTML = input.value;
                            result.config[i].accountName = input.value;
                            chrome.storage.local.set({ 'config': result.config }, function () {
                                Refresh();
                            });
                        }
                    });
                    cell3.innerHTML = "";
                    cell3.appendChild(input);
                    input.focus();
                }
                cell4.innerHTML = result.config[i].envColor;
                cell4.onclick = function () {
                    var input = document.createElement("input");
                    input.type = "color";
                    input.value = result.config[i].envColor;
                    input.addEventListener("change", function (event) {
                        event.preventDefault();
                        cell4.innerHTML = input.value;
                        result.config[i].envColor = input.value;
                        chrome.storage.local.set({ 'config': result.config }, function () {
                            Refresh();
                        });
                    });
                    cell4.innerHTML = "";
                    cell4.appendChild(input);
                    input.focus();
                }
                cell4.style.backgroundColor = result.config[i].envColor;
                cell5.innerHTML = result.config[i].tenantName;
                cell5.onclick = function () {
                    var input = document.createElement("input");
                    input.type = "text";
                    input.value = result.config[i].tenantName;
                    input.addEventListener("keyup", function (event) {
                        if (event.keyCode === 13) {
                            event.preventDefault();
                            cell5.innerHTML = input.value;
                            result.config[i].tenantName = input.value;
                            chrome.storage.local.set({ 'config': result.config }, function () {
                                Refresh();
                            });
                        }
                    });
                    cell5.innerHTML = "";
                    cell5.appendChild(input);
                    input.focus();
                }
                cell6.innerHTML = result.config[i].customLabel;
                cell6.onclick = function () {
                    var input = document.createElement("input");
                    input.type = "text";
                    input.value = result.config[i].customLabel;
                    input.addEventListener("keyup", function (event) {
                        if (event.keyCode === 13) {
                            event.preventDefault();
                            cell6.innerHTML = input.value;
                            result.config[i].customLabel = input.value;
                            chrome.storage.local.set({ 'config': result.config }, function () {
                                sendMessageToContentScript('refresh');
                                Refresh();
                            });
                        }
                    });
                    cell6.innerHTML = "";
                    cell6.appendChild(input);
                    input.focus();
                }
                var deletebtn = document.createElement("button");
                deletebtn.innerHTML = "Delete";
                deletebtn.id = i;
                cell7.appendChild(deletebtn);
            }
            )();
        }
        for (let i = 0; i < result.config.length; i++) {
            (function () {
                var deletebtn = document.getElementById(i);
                deletebtn.addEventListener("click", deleteConfig.bind(this, i));
            })();
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    //blur div.fxs-avatarmenu-tenant-container text add blur class
    //if blur id is checked
    //add  font-size: 40px;    filter: blur(3px);    -webkit-filter: blur(3px); to div.fxs-avatarmenu-tenant-container
    //hide #spinner-div
    document.getElementById("spinner-div").style.display = "none";
    document.getElementById("importURL").addEventListener("click", function () {
        //import file from the URL
        //create URL input below importURL button
        var input = document.createElement("input");
        input.type = "text";
        input.style.width = "50%";
        input.id = "url";
        input.placeholder = "Enter URL";
        document.getElementById("importURL").after(input);
        //create button to import
        var importbtn = document.createElement("button");
        //font awesome icon <i class="fa fa-download"></i>
        importbtn.innerHTML = "<i class='fa fa-download'></i>";
        //style button submit action-button
        importbtn.className = "action-button";
        //button width 80%
        importbtn.id = "importbtn";
        document.getElementById("url").after(importbtn);
        //add event listener to import button
        document.getElementById("importbtn").addEventListener("click", function () {
            document.getElementById("spinner-div").style.display = "block";
            var url = document.getElementById("url").value;
            var xhr = new XMLHttpRequest();
            //show #spinner-div
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    // JSON.parse does not evaluate the attacker's scripts.
                    var resp = JSON.parse(xhr.responseText);
                    chrome.storage.local.set({ 'config': resp }, function () {
                        Refresh();
                        document.getElementById("spinner-div").style.display = "none";
                    });
                }
            }
            xhr.send();
        }, false);
    }, false);
    document.getElementById("import").addEventListener("click", function () {
        //open file dialog
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = e => {
            // getting a hold of the file reference
            var file = e.target.files[0];
            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
                var content = readerEvent.target.result; // this is the content!
                var config = JSON.parse(content);
                chrome.storage.local.set({ 'config': config }, function () {
                    Refresh();
                });
            }
        }
        fileInput.click();
    }, false);
    document.getElementById("export").addEventListener("click", function () {
        chrome.storage.local.get('config', function (result) {
            if (result.config == undefined) {
                result.config = [];
            }
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.config));
            //create a download link
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "config.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    });
    Refresh();
    cloudProviderChanged();
    document.getElementById('blur').addEventListener('change', function (checkbox) {
        //get url from current tab
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var url = tabs[0].url;
            if (checkbox.target.checked) {
                //if url is opened is azure
                if (url.indexOf("portal.azure.com") > -1) {
                    blurAzure(true);
                }
                if (url.indexOf("console.aws.amazon.com") > -1) {
                    blurAWS(true);
                }
            }
            else {
                if (url.indexOf("portal.azure.com") > -1) {
                    blurAzure(false);
                }
                if (url.indexOf("console.aws.amazon.com") > -1) {
                    blurAWS(false);
                }
            }
        });
    });
    document.getElementById("cloudProvider").addEventListener("change", cloudProviderChanged);
    var form = document.getElementById("msform");
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        SaveConfig();
    });
});