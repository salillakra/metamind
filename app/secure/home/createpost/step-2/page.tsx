"use client"
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const page = () => {
    const [value, setValue] = useState('');

    function submitHandler_Content(){
        console.log(value)
    }
    return <>
        <ReactQuill className='h-full text-white bg-black' theme="snow" value={value} onChange={setValue} />
        <div className="w-full flex justify-end">
            <Button onClick={submitHandler_Content} className='mx-3 z-10 ' size={"default"}>
                Continue
                <MoveRight />
            </Button>
        </div>

    </>;
}

export default page