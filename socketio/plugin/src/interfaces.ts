export interface iConfig {
    images: {
        granted: string,
        denied: string,
        prompt: string,
        recording: string,
    },
    form_inputs: Map<string,HTMLElement>,
    parent_html_element: HTMLElement | null,
    button_html_element: HTMLElement | null,
    search_html_element: HTMLInputElement | null,
    callbacks: iCallbacks
}

export interface iCallbacks {
    recognized: (str:string) => any,
    tts: (blob:any, text: string) => any
}


