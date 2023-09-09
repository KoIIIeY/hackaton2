import * as RecordRTC from 'recordrtc';

class Icons {
}
Icons.RED = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0\" y=\"0\" viewBox=\"0 0 100 100\" xml:space=\"preserve\">" +
    "    <path d=\"M27.655 89.293l-4.44-2.563c-2.749-1.587-3.582-5.368-1.89-8.579L42.79 37.42l17.781 10.266L36.03 86.64c-1.935 3.071-5.625 4.24-8.375 2.653z\"" +
    "          fill=\"#333\" stroke=\"#333\" stroke-width=\"3.5\" stroke-miterlimit=\"10\"/>" +
    "    <circle transform=\"rotate(-56.895 60.4 27.443)\" cx=\"60.403\" cy=\"27.444\" fill=\"#e05164\" stroke=\"#333\"" +
    "            stroke-width=\"3.5\" stroke-miterlimit=\"10\" r=\"17.442\"/>" +
    "    <path d=\"M63.389 51.104L38.421 36.689a3.298 3.298 0 0 1-1.207-4.504l2.392-4.143a3.298 3.298 0 0 1 4.504-1.207l24.968 14.416a3.298 3.298 0 0 1 1.207 4.504l-2.392 4.143a3.298 3.298 0 0 1-4.504 1.206z\"" +
    "          fill=\"#666\" stroke=\"#333\" stroke-width=\"3.5\" stroke-miterlimit=\"10\"/>" +
    "    <path fill=\"none\" stroke=\"#333\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-miterlimit=\"10\"" +
    "          d=\"M41.257 16.39L79.55 38.499\"/></svg>";
Icons.GREEN = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0\" y=\"0\" viewBox=\"0 0 100 100\" xml:space=\"preserve\">" +
    "    <path d=\"M27.655 89.293l-4.44-2.563c-2.749-1.587-3.582-5.368-1.89-8.579L42.79 37.42l17.781 10.266L36.03 86.64c-1.935 3.071-5.625 4.24-8.375 2.653z\"" +
    "          fill=\"#333\" stroke=\"#333\" stroke-width=\"3.5\" stroke-miterlimit=\"10\"/>" +
    "    <circle transform=\"rotate(-56.895 60.4 27.443)\" cx=\"60.403\" cy=\"27.444\" fill=\"lightgreen\" stroke=\"#333\"" +
    "            stroke-width=\"3.5\" stroke-miterlimit=\"10\" r=\"17.442\"/>" +
    "    <path d=\"M63.389 51.104L38.421 36.689a3.298 3.298 0 0 1-1.207-4.504l2.392-4.143a3.298 3.298 0 0 1 4.504-1.207l24.968 14.416a3.298 3.298 0 0 1 1.207 4.504l-2.392 4.143a3.298 3.298 0 0 1-4.504 1.206z\"" +
    "          fill=\"#666\" stroke=\"#333\" stroke-width=\"3.5\" stroke-miterlimit=\"10\"/>" +
    "    <path fill=\"none\" stroke=\"#333\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-miterlimit=\"10\"" +
    "          d=\"M41.257 16.39L79.55 38.499\"/></svg>";
Icons.GREY = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0\" y=\"0\" viewBox=\"0 0 100 100\" xml:space=\"preserve\">" +
    "    <path d=\"M27.655 89.293l-4.44-2.563c-2.749-1.587-3.582-5.368-1.89-8.579L42.79 37.42l17.781 10.266L36.03 86.64c-1.935 3.071-5.625 4.24-8.375 2.653z\"" +
    "          fill=\"#333\" stroke=\"#333\" stroke-width=\"3.5\" stroke-miterlimit=\"10\"/>" +
    "    <circle transform=\"rotate(-56.895 60.4 27.443)\" cx=\"60.403\" cy=\"27.444\" fill=\"#e0e0e0\" stroke=\"#333\"" +
    "            stroke-width=\"3.5\" stroke-miterlimit=\"10\" r=\"17.442\"/>" +
    "    <path d=\"M63.389 51.104L38.421 36.689a3.298 3.298 0 0 1-1.207-4.504l2.392-4.143a3.298 3.298 0 0 1 4.504-1.207l24.968 14.416a3.298 3.298 0 0 1 1.207 4.504l-2.392 4.143a3.298 3.298 0 0 1-4.504 1.206z\"" +
    "          fill=\"#666\" stroke=\"#333\" stroke-width=\"3.5\" stroke-miterlimit=\"10\"/>" +
    "    <path fill=\"none\" stroke=\"#333\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-miterlimit=\"10\"" +
    "          d=\"M41.257 16.39L79.55 38.499\"/></svg>";

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\r\n.sawd_audio_button{\r\n    position:fixed;\r\n    width:60px;\r\n    height:60px;\r\n    bottom:65px;\r\n    right:11px;\r\n    background-color:#0C9;\r\n    color:#FFF;\r\n    border-radius:50px;\r\n    text-align:center;\r\n    box-shadow: 2px 2px 3px #999;\r\n}\r\n\r\n/*.sawd_audio_button>svg{*/\r\n/*    margin-top:22px;*/\r\n/*    width: 150px;*/\r\n/*    height: 150px;*/\r\n/*}*/";
styleInject(css_248z);

class SAWDVoiceCommand {
    constructor(config = null) {
        this.stream = null;
        this.recorder = null;
        this.stopTimeout = 0;
        this.dragStartMousePosition = { x: 0, y: 0 };
        this.buttonOffset = { x: 0, y: 0 };
        // socket: Socket<any,any> = io();
        this.currentPermissionStatus = null;
        this.config = {
            form_inputs: new Map(),
            parent_html_element: null,
            button_html_element: null,
            search_html_element: null,
            images: {
                prompt: Icons.RED,
                denied: Icons.RED,
                granted: Icons.GREY,
                recording: Icons.GREEN
            },
            callbacks: {
                recognized: (str) => { },
                tts: (blob, text) => { }
            }
        };
        this.timeout = 25000;
        this.config = Object.assign(Object.assign({}, this.config), config);
        this.checkPermissions();
        for (let elem of document.querySelectorAll("input,textarea,select")) {
            const elemName = elem.getAttribute("name");
            this.config.form_inputs.set(elemName || '', elem);
        }
        console.log('inputs list', this.config.form_inputs);
        // this.socket.onAny((event, data) => {
        // 	console.log('socket', event, data);
        // });
    }
    checkPermissions() {
        navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
            this.currentPermissionStatus = permissionStatus;
            console.log('permission state:', permissionStatus.state); // granted, denied, prompt
            permissionStatus.onchange = (ev) => {
                console.log("Permission changed to " + permissionStatus.state);
                this.currentPermissionStatus = permissionStatus;
                this.redrawButtons();
            };
            this.redrawButtons();
        }).catch(err => {
            this.redrawButtons();
        });
    }
    redrawButtons() {
        if (!this.config.button_html_element) {
            const button = document.createElement('a');
            button.classList.add('sawd_audio_button');
            this.config.button_html_element = button;
            this.changeButtonText(!!this.recorder);
        }
        if (this.config.parent_html_element) {
            this.config.parent_html_element.append(this.config.button_html_element);
        }
        this.config.button_html_element.addEventListener('mousedown', () => {
            this.startRecording();
        });
        this.config.button_html_element.addEventListener('mouseup', () => {
            this.stopRecording();
        });
    }
    drag(e) {
        this.buttonOffset.x = e.pageX - this.dragStartMousePosition.x;
        this.buttonOffset.y = e.pageY - this.dragStartMousePosition.y;
        this.moveButton();
    }
    moveButton() {
        if (this.config.button_html_element && "style" in this.config.button_html_element) {
            this.config.button_html_element.style.transform = `translate(${this.buttonOffset.x}px, ${this.buttonOffset.y}px)`;
        }
    }
    changeButtonText(recording) {
        // if(this.config.button_html_element){
        // 	if(recording){
        // 		this.config.button_html_element.innerHTML = this.config.images['recording'];
        // 	} else {
        // 		this.config.button_html_element.innerHTML = this.config.images[this.currentPermissionStatus?.state ?? 'denied'];
        // 	}
        //
        // }
    }
    startRecording() {
        if (this.recorder) {
            return;
        }
        this.changeButtonText(true);
        navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
            var _a;
            if (((_a = this.currentPermissionStatus) === null || _a === void 0 ? void 0 : _a.state) == 'granted') {
                this.stream = s;
                this.record();
            }
        }).catch(error => {
            console.log('start recording error', error);
        });
    }
    record() {
        if (this.stream) {
            this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
                type: 'audio',
                mimeType: 'audio/wav',
                numberOfAudioChannels: 1
            });
            this.recorder.record();
            this.stopTimeout = window.setTimeout(() => this.stopRecording(), this.timeout);
        }
    }
    toString(value) {
        let val = value.toString();
        if (!value) {
            val = '00';
        }
        if (value < 10) {
            val = '0' + value;
        }
        return val;
    }
    stopRecording() {
        this.changeButtonText(false);
        setTimeout(() => {
            if (this.recorder) {
                this.recorder.stop((blob) => {
                    this.stopMedia();
                    this.send(blob);
                });
            }
        }, 50);
    }
    stopMedia() {
        if (this.recorder) {
            this.recorder = null;
            window.clearTimeout(this.stopTimeout);
            if (this.stream) {
                this.stream.getAudioTracks().forEach(track => track.stop());
                this.stream = null;
            }
        }
    }
    abortRecording() {
        this.stopMedia();
    }
    send(blob) {
        let formData = new FormData();
        // formData.set('location', JSON.stringify(window.location.href));
        formData.append('audio_file', blob);
        // formData.set('channelId', this.socket.id);
        this.xhr('/asr?method=openai-whisper&task=transcribe&output=json&language=ru&encode=true', formData, (response) => {
            console.log(response);
            let resp = JSON.parse(response);
            this.config.callbacks.recognized(resp['text']);
            // this.socket.emit('gpt', {content: JSON.parse(response).text } as any);
            // let form = new FormData();
            // form.set('text', resp['text']);
            // form.set('voice', 'ru_RU/multi_low#hajdurova');
            // form.set('noiseScale', '0.667');
            // form.set('noiseW', '0.8');
            // form.set('lengthScale', '1');
            // form.set('ssml', 'false');
            // form.set('audioTarget', 'client');
            const train = document.getElementById('train');
            fetch('/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texts: [resp['text']], train: train.options[train.selectedIndex].text })
            }).then(resPython => {
                resPython.json().then(text => {
                    fetch('/api/tts?voice=' + encodeURIComponent('ru_RU/multi_low#hajdurova') + '&noiseScale=0&noiseW=0&lengthScale=0.7&ssml=false&audioTarget=client&text=' + encodeURIComponent(text.resp)).then((res) => {
                        res.blob().then(res => this.config.callbacks.tts(res, text.resp));
                    });
                });
            });
            //
            // this.xhr('/api/tts?voice=ru_RU%2Fmulti_low%23hajdurova&noiseScale=0.667&noiseW=0.8&lengthScale=1&ssml=false&audioTarget=client', resp['text'], (resp: any) => {
            // 	console.log('resp:',resp);
            //
            // });
        });
    }
    xhr(url, data, callback) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            }
        };
        request.open('POST', url);
        request.send(data);
    }
}

export { SAWDVoiceCommand as default };
