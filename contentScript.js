let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url.indexOf("https://portal.azure.com/") > -1 || url.indexOf("console.aws.amazon.com") > -1) {
        onUrlChange();
    }
}).observe(document, { subtree: true, childList: true });
//receive message from background.js to refresh
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case 'refresh':
            onUrlChange();
            break;
        case 'refreshAWS':
            RefreshAWS(true);
            break;
        case 'blurAzure':
            blurAzure(true);
            break;
        case 'unblurAzure':
            blurAzure(false);
            break;
        case 'blurAWS':
            blurAWS(true);
            break;
        case 'unblurAWS':
            blurAWS(false);
            break;
    }
});
function blurAWS(flag) {
    if (flag) {
        document.getElementById('nav-usernameMenu').style.filter = "blur(7px)";
        document.getElementById('nav-usernameMenu').style.webkitFilter = "blur(7px)";
        //<div data-analytics="CostUsage"
        document.querySelectorAll('div[data-analytics="CostUsage"]')[0].style.filter = "blur(7px)";
        document.querySelectorAll('div[data-analytics="CostUsage"]')[0].style.webkitFilter = "blur(7px)";
    }
    else {
        document.getElementById('nav-usernameMenu').style.filter = "blur(0px)";
        document.getElementById('nav-usernameMenu').style.webkitFilter = "blur(0px)";
        if (document.querySelector('div[data-analytics="CostUsage"]') !== null) {
            document.querySelector('div[data-analytics="CostUsage"]').style.filter = "blur(0px)";
            document.querySelector('div[data-analytics="CostUsage"]').style.webkitFilter = "blur(0px)";
        }
    }
}
function blurAzure(flag) {
    if (flag) {
        document.querySelector('div.fxs-avatarmenu-tenant-container').style.filter = "blur(7px)";
        document.querySelector('div.fxs-avatarmenu-tenant-container').style.webkitFilter = "blur(7px)";
        //blur _tab_0_panel_0
        // h2.fxs-blade-title-titleText msportalfx-tooltip-overflow
        //if div.fxs-blade-title-toprow is not null, then blur it
        if (document.querySelector('div.fxs-blade-title-toprow') !== null) {
            document.querySelector('div.fxs-blade-title-toprow').style.filter = "blur(7px)";
            document.querySelector('div.fxs-blade-title-toprow').style.webkitFilter = "blur(7px)";
        }
        //if #_tab_0_panel_0 is not null, then blur it
        if (document.querySelector('#_tab_0_panel_0') !== null) {
            document.querySelector('#_tab_0_panel_0').style.filter = "blur(7px)";
            document.querySelector('#_tab_0_panel_0').style.webkitFilter = "blur(7px)";
        }
    }
    else {
        document.querySelector('div.fxs-avatarmenu-tenant-container').style.filter = "blur(0px)";
        document.querySelector('div.fxs-avatarmenu-tenant-container').style.webkitFilter = "blur(0px)";
        if (document.querySelector('div.fxs-blade-title-toprow') !== null) {
            document.querySelector('div.fxs-blade-title-toprow').style.filter = "blur(0px)";
            document.querySelector('div.fxs-blade-title-toprow').style.webkitFilter = "blur(0px)";
        }
        if (document.querySelector('#_tab_0_panel_0') !== null) {
            document.querySelector('#_tab_0_panel_0').style.filter = "blur(0px)";
            document.querySelector('#_tab_0_panel_0').style.webkitFilter = "blur(0px)";
        }
    }
}
function onUrlChange() {
    if (location.href.indexOf("https://portal.azure.com/") > -1) {
        //check if blur is checked
        var username = document.getElementById('_weave_e_23');
        var tenant = document.getElementById('_weave_e_24');
        if (tenant !== null) {
            console.log(tenant.textContent);
            //console.log(document.getElementsByClassName("fxs-avatarmenu-username")[0].innerText);
            chrome.storage.local.get('config', function (result) {
                if (result.config == undefined) {
                    result.config = [];
                }
                for (var i = 0; i < result.config.length; i++) {
                    //if cloudProvider is azure and tenantName is the same as the one in the page)
                    if (result.config[i].cloudProvider == 'azure') {
                        var tenantName = result.config[i].tenantName.toLowerCase();
                        if (tenant.textContent.toLowerCase().indexOf(tenantName) > -1) {
                            document.getElementById('_weave_e_1').style.backgroundColor = result.config[i].envColor;
                            document.getElementById('_weave_e_4').innerText = 'Microsoft Azure -' + result.config[i].customLabel.toUpperCase();
                        }
                    }
                }
            });
        }
    }
    else if (window.location.href.indexOf("console.aws.amazon.com") > -1) {
        RefreshAWS(false);
    }
}
function RefreshAWS(force) {
    chrome.storage.local.get('config', function (result) {
        if (result.config == undefined) {
            result.config = [];
        }
        for (var i = 0; i < result.config.length; i++) {
            if (result.config[i].cloudProvider == 'aws') {
                //remove - from the account name
                var accountName = result.config[i].accountName.toLowerCase().replace(/-/g, '');
                let loginsection = document.getElementById("awsc-navigation__more-menu--list").innerText;
                if (document.getElementById("awsc-navigation__more-menu--list") !== null) {
                    if (loginsection.toLowerCase().replace(/-/g, '').indexOf(accountName) > 0) {
                        document.querySelector("nav.globalNav-032").style.backgroundColor = result.config[i].envColor;
                        //append envName to loginsection if it is not already there
                        if (document.querySelector("#nav-home-link").innerText.toLowerCase().indexOf(result.config[i].customLabel.toLowerCase()) < 0) {
                            //create child span element with id customlabel with class globalNav-0381 globalNav-03123
                            var span = document.createElement("span");
                            span.id = "customlabel";
                            span.className = "globalNav-0381 globalNav-03123";
                            //make it bold
                            span.style.fontWeight = "bold";
                            span.innerText = result.config[i].customLabel.toUpperCase();
                            //if the span element does not exist, append it
                            if (document.getElementById("customlabel") == null) {
                                document.querySelector("#nav-home-link").appendChild(span);
                            }
                            //else replace it
                            else {
                                document.getElementById("customlabel").innerText = result.config[i].customLabel.toUpperCase();
                            }
                        } 
                    }
                }
            }
        }
    });
}
