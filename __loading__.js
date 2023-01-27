pc.script.createLoadingScreen(async function (app) {
    var showSplash = function (varyconData) {
        var parsedData = JSON.parse(varyconData);
        //This is hardcoded - needs to updated
        var logoUrl = parsedData.data.workspaces.playCanvas.contentTemplates.showRoom.contents[0].data.mainRoomContent.companyLogo.value.publicUrl;
 
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.id = 'application-logo';
        //logo.src = 'https://www.dl.dropboxusercontent.com/s/m7eh5b4ctqjt1cd/logo-MPX-landscape.svg';
        logo.src = logoUrl;
        wrapper.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

        var rbLogo = document.createElement('img');
        rbLogo.id = 'rb-logo';
        rbLogo.src = 'https://www.dl.dropboxusercontent.com/s/oib8pieyommejac/Recordbay_Logo.svg';
        wrapper.appendChild(rbLogo);
        rbLogo.onload = function () {
            splash.style.display = 'block';
        };

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #484848;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #ffffff;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% + 56px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '}',
            '',
            '#application-logo {',
            '   position: absolute;',
            '    top: calc(50% - 112px);',
            '    left: calc(50% - 240px);',
            '    width: 480px;',
            '  text-align: center;',
            '}',
            '',
            '#application-logo img {',
            '    width: 100%;',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#rb-logo{',
            '   position: absolute;',
            '    right: 10px;',
            '    width: 180px;',
            '    bottom: 10px;',
            '}',
            '',
            '#rb-logo img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #1d292c;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #00cca3;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };
    createCss();
    var jsonData = await fetchVaryconData();

    console.log("The json data is ",jsonData);
    showSplash(jsonData);

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);

   async function fetchVaryconData() {
        var responseData;
        var jsonFile = '{"query": "{ workspaces { playCanvas { contentTemplates { showRoom { contents { data { mainRoomContent { showRoomHeaders { elements { value } } companyLogo { value { publicUrl } } showRoomImages { elements { value { publicUrl } } } showRoomVideos { elements { value { publicUrl } } } } } } } } } }}"}';
        console.log("Json File",jsonFile);
        const response = await fetch('https://phoenix.recordbay.de/data',{
            method: 'GET',
            headers: {
           'Content-Type': 'text/plain',
           Accept: "*/*",
        },
    });
        //waits until the request completes...
        try {
            responseData = await response.text();
        }
        catch(err) {
            alert(err); // Failed to fetch
        }
        return responseData;
    }
});