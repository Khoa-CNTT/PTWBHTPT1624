/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
const InputEditor: React.FC<{
    value: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: React.Dispatch<React.SetStateAction<any>>;
}> = ({ value, setValue, label }) => {
    return (
        <div className="flex flex-col  gap-2">
            <label className="flex justify-center w-full  text-sm text-secondary">{label}</label>
            <Editor
                onChange={(e: any) => setValue((prev: any) => ({ ...prev, product_description: e.target.getContent() }))}
                apiKey={import.meta.env.VITE_REACT_APIKEY_TINYMCE}
                initialValue={`${value}`}
                init={{
                    height: 500,
                    menubar: false,
                    toolbar:
                        'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    plugins:
                        'print preview fullpage searchreplace autolink  visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
                }}
            />
        </div>
    );
};

export default InputEditor;
