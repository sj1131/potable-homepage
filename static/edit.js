const editor = new EditorJS({ 
    holder: 'editorjs', 

    autofocus: true,

    tools: {
        // Header 설정
        header: {
            class: Header,
            config: {
                placeholder: '헤더 입력',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 3,
            },
            shortcut: 'CMD+SHIFT+H',
        },
        // linkTool: {
        //     class: LinkTool,
        //     config: {
        //         header: '', // get request header 선택사항
        //         //백엔드 데이터 가져오기( Cross Origin에 주의)
        //         endpoint: 'http://localhost:9004/editor/link',
        //     }
        // },
        raw: {
            class: RawTool,
            config: {
                placeholder: "텍스트 입력"
            }
        },
        simImg: {
            class: SimpleImage
            //No Config
        },
        image: {
            class: ImageTool,
            config: {
                // Your backend file uploader endpoint
                byFile: 'http://localhost:9004/uploadFile',

                // Your endpoint that provides uploading by Url
                byUrl: 'http://localhost:9004/fetchUrl',
                buttonContent: "이미지 업로드",
                actions: [
                    {
                        name: 'new_button',
                        icon: '<svg>...</svg>',
                        title: 'New Button',
                        toggle: true,
                        action: (name) => {
                            alert(`${name} button clicked`);
                        }
                    }
                ]
            }
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true
            // No Config
        },
        list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
                defaultStyle: 'unordered'
            }
        },
        embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
                services: {
                    youtube: true,
                    coub: true
                }
            }
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
                quotePlaceholder: '인용구 입력',
                captionPlaceholder: '발언자',
            },
        },
        table: {
            class: Table,
            inlineToolbar: true,
            config: {
                rows: 2,
                cols: 3,
                withHeadings: true
            },
        },
        nestedlist: {
            class: NestedList,
            inlineToolbar: true,
            config: {
                defaultStyle: 'unordered'
            },
        },
        delimiter: {
            class: Delimiter
            //No Config
        },
        warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
                titlePlaceholder: '제목',
                messagePlaceholder: '메시지',
            },
        },
        code: {
            class: CodeTool,
            placeholder: "코드 입력"
        },
        attaches: {
            class: AttachesTool,
            config: {
                /**
                 * Custom uploader
                 */
                uploader: {
                    /**
                     * Upload file to the server and return an uploaded image data
                     * @param {File} file - file selected from the device or pasted by drag-n-drop
                     * @return {Promise.<{success, file: {url}}>}
                     */
                    uploadByFile(file) {
                        // your own uploading logic here
                        return MyAjax.upload(file).then((response) => {
                            return {
                                success: 1,
                                file: {
                                    url: response.fileurl,
                                    // any data you want
                                    // for example: name, size, title
                                }
                            };
                        });
                    },
                }
            }
        },
        marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
            //No Config
        },
        inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C',
            //No Config
        },
        underline: {
            class: Underline
            //No Config
        },
        alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
                defaultType: 'primary',
                messagePlaceholder: 'Enter something',
            }
        }
    }
})