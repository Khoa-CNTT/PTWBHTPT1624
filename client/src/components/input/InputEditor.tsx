/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const InputEditor: React.FC<{
    value: string;
    label: string;
    setValue: React.Dispatch<React.SetStateAction<any>>;
}> = ({ value, setValue, label }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="flex justify-center w-full text-sm text-secondary">{label}</label>
            <Editor
                onChange={(e: any) => setValue((prev: any) => ({ ...prev, product_description: e.target.getContent() }))}
                apiKey={import.meta.env.VITE_REACT_APIKEY_TINYMCE}
                initialValue={`${value}`}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'print',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'visualchars',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'paste',
                        'wordcount',
                        'help',
                        'emoticons',
                        'codesample',
                        'hr',
                        'nonbreaking',
                        'pagebreak',
                        'toc',
                        'imagetools',
                        'textpattern',
                        'contextmenu',
                        'colorpicker',
                        'textcolor',
                        'directionality',
                        'autosave',
                        'quickbars',
                        'template',
                    ],
                    toolbar: [
                        'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify |',
                        'bullist numlist outdent indent | link image media table | removeformat | charmap emoticons | code fullscreen preview |',
                        'print searchreplace | insertdatetime hr pagebreak | toc anchor | ltr rtl | codesample | restoredraft | help',
                    ].join(' '),
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    color_map: [
                        '000000',
                        'Black',
                        'FFFFFF',
                        'White',
                        'FF0000',
                        'Red',
                        '00FF00',
                        'Green',
                        '0000FF',
                        'Blue',
                        'FFFF00',
                        'Yellow',
                        'FF00FF',
                        'Magenta',
                        '00FFFF',
                        'Cyan',
                        'FFA500',
                        'Orange',
                        '800080',
                        'Purple',
                    ],
                    color_cols: 5,
                    image_advtab: true,
                    file_picker_types: 'file image media',
                    automatic_uploads: true,
                    templates: [
                        { title: 'Basic Template', description: 'A simple starting point', content: '<p>This is a basic template.</p>' },
                        { title: 'FAQ Template', description: 'A template for FAQs', content: '<h2>FAQ</h2><ul><li>Question 1</li><li>Question 2</li></ul>' },
                    ],
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    quickbars_insert_toolbar: 'quickimage quicktable | hr pagebreak',
                    contextmenu: 'link image table',
                    table_toolbar:
                        'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                    image_caption: true,
                    image_title: true,
                    directionality: 'ltr',
                    paste_data_images: true,
                }}
            />
        </div>
    );
};

export default InputEditor;
