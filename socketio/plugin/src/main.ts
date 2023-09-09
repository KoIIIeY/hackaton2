import * as RecordRTC from 'recordrtc';
import { iConfig } from './interfaces';
// import { io, Socket } from "socket.io-client";
import Icons from "./icons";
import './style.css';

class SAWDVoiceCommand {

	stream: MediaStream | null = null;
	recorder: RecordRTC.StereoAudioRecorder | null  = null;
	stopTimeout: number = 0;
	blobs: any;

	dragStartMousePosition:any = {x: 0, y: 0};
	buttonOffset:any = {x: 0, y: 0};

	// socket: Socket<any,any> = io();

	currentPermissionStatus: PermissionStatus | null = null;

	config: iConfig = {

		form_inputs: new Map<string,HTMLInputElement>(),
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
			recognized: (str) => {},
			tts: (blob, text) => {}
		}

	};

	timeout: number = 25000;

	constructor(config:any = null) {
		this.config = {...this.config, ...config};
		this.checkPermissions();

		for(let elem of document.querySelectorAll("input,textarea,select")){
			const elemName = elem.getAttribute("name");
			this.config.form_inputs.set(elemName || '', elem as HTMLElement);
		}

		console.log('inputs list', this.config.form_inputs);

		// this.socket.onAny((event, data) => {
		// 	console.log('socket', event, data);
		// });

	}

	checkPermissions(){
		navigator.permissions.query(
			<PermissionDescriptor><unknown>{name: 'microphone'}
		).then((permissionStatus) => {

			this.currentPermissionStatus = permissionStatus;
			console.log('permission state:', permissionStatus.state); // granted, denied, prompt

			permissionStatus.onchange = (ev) => {
				console.log("Permission changed to " + permissionStatus.state);
				this.currentPermissionStatus = permissionStatus;
				this.redrawButtons();
			}

			this.redrawButtons();
		}).catch(err => {
			this.redrawButtons();
		})
	}

	redrawButtons(){

		if(!this.config.button_html_element){
			const button = document.createElement('a');
			button.classList.add('sawd_audio_button');
			this.config.button_html_element = button;
			this.changeButtonText(!!this.recorder);
		}

		if(this.config.parent_html_element){
			this.config.parent_html_element.append(this.config.button_html_element);
		}

		this.config.button_html_element.addEventListener('mousedown', () => {
			this.startRecording();
		});
		this.config.button_html_element.addEventListener('mouseup', () => {
			this.stopRecording();
		});

	}

	drag(e: { pageX: number; pageY: number; }) {
		this.buttonOffset.x = e.pageX - this.dragStartMousePosition.x;
		this.buttonOffset.y = e.pageY - this.dragStartMousePosition.y;
		this.moveButton();
	}

	moveButton(){
		if (this.config.button_html_element && "style" in this.config.button_html_element) {
			this.config.button_html_element.style.transform = `translate(${this.buttonOffset.x}px, ${this.buttonOffset.y}px)`;
		}
	}

	changeButtonText(recording:boolean){
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
			return
		}

		this.changeButtonText(true);

		navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
			if(this.currentPermissionStatus?.state == 'granted'){
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
			this.stopTimeout = window.setTimeout(
				() => this.stopRecording(),
				this.timeout
			);
		}


	}

	toString(value: number) {
		let val:string = value.toString();
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

	send(blob: string | Blob){
		let formData = new FormData();
		// formData.set('location', JSON.stringify(window.location.href));
		formData.append('audio_file', blob);
		// formData.set('channelId', this.socket.id);

		this.xhr('/asr?method=openai-whisper&task=transcribe&output=json&language=ru&encode=true', formData,  (response: string) => {
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

			let python = fetch('/text', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({texts: [resp['text']]})
			}).then(resPython => {
				resPython.json().then(text => {
					let respVoice = fetch('/api/tts?voice='+encodeURIComponent('ru_RU/multi_low#hajdurova')+'&noiseScale=0.667&noiseW=0.8&lengthScale=1&ssml=false&audioTarget=client&text='+encodeURIComponent(text.resp) ).then((res) => {
						res.blob().then(res => this.config.callbacks.tts(res, text.resp));
					});
				});

			})


			//
			// this.xhr('/api/tts?voice=ru_RU%2Fmulti_low%23hajdurova&noiseScale=0.667&noiseW=0.8&lengthScale=1&ssml=false&audioTarget=client', resp['text'], (resp: any) => {
			// 	console.log('resp:',resp);
			//
			// });

		});


	}

	xhr(url: string | URL, data: any, callback: { (response: string): void; (resp: any): void; (arg0: string): void; }) {
		const request = new XMLHttpRequest();
		request.onreadystatechange =  () => {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText);
			}
		};
		request.open('POST', url);
		request.send(data);
	}

}

export default SAWDVoiceCommand;

