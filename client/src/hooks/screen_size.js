import { useState , useEffect } from "react";


export function useScreenSize(){
    const [size,setSize] = useState(window.innerWidth);

    useEffect(() =>{

        const handleSize = () =>{
            setSize(window.innerWidth)
        }

        window.addEventListener('resize',handleSize)

        return () => {window.removeEventListener('resize',handleSize)}
    },[])

    return size
}