import React from "react"
import { useState } from "react"
import {useEffect, useRef} from 'react';

import io from "socket.io-client";

import { getUrl } from "../../lib/main"

import { DataToUrl } from "../../lib/data"

let socket = io(getUrl("","ws"))

type Props = {
    data: Array<any>
    color: string
    x: number
    y: number
    move: Function
    draw?: boolean
    setData?: Function
    offline?: boolean
    size?: number
}
const Draw = ({ x, y, data, color, move, draw = true, setData, offline = false, size = 32 }:Props) => {
    const [md, setMd] = useState(false)
    const [download, setDownload] = useState("")
    const [url, setUrl] = useState("")
    const [nowLocation, setNowLocation] = useState("")
    const canvasRef = useRef(null);
    const getContext = (): CanvasRenderingContext2D => {
        const canvas: any = canvasRef.current;
        return canvas.getContext('2d');
    };
    const getPosition = (e: React.MouseEvent<HTMLElement>):number => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const scale = width / (size * x)
        const mouseX = e.clientX - left
        const mouseY = e.clientY - top
        const X = Math.floor(mouseX / scale / size)
        const Y = Math.floor(mouseY / scale / size)
        const Position = Y * y + X
        return Position
    }
    const change_dot = (i:number, color:string):void => {
        if(!setData) return
        setData(
            data.map((d:any, index:number) => (
                index == i ? color : d
            ))
        )
    }
    const getDataUrl = ():void => {
        const canvas: any = canvasRef.current;
        setDownload(canvas.toDataURL("image/png"))
    }
    const draw_color = (index: number):void => {
        if(!draw) return
        if(offline) {
            change_dot(index, color)
            return
        }
        if(data[index] == color) return
        socket.emit("json", {"position":index, "color":color})
        data[index] = color
    }
    useEffect(() => {
        const ctx: CanvasRenderingContext2D = getContext();
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                ctx.fillStyle = data[i*y+j]
                ctx.fillRect(j*size,i*size,size,size)
            }
        }
    })
    useEffect(() => {
        setNowLocation(location.origin)
    },[])
    return (
        <div>
            <a onClick={getDataUrl} href={download} download="image.png" style={{color:"#fff" ,marginRight:"15px"}}>download</a>
            <a onMouseDown={() => {setUrl(DataToUrl(data))}} href={nowLocation + "/view?data=" + url} target="_blank" style={{color:"#fff"}}>copy link</a>
            <div
            onMouseDown={() => {setMd(true)}}
            onMouseUp={() => {setMd(false)}}
            >
                <canvas
                onMouseOver={(e: React.MouseEvent<HTMLElement>):void => {
                    if(!md) return
                    move(false)
                    draw_color(getPosition(e))
                }}
                onMouseMove={(e: React.MouseEvent<HTMLElement>):void => {
                    if(!md) return
                    move(false)
                    draw_color(getPosition(e))
                }}
                onMouseDown={(e: React.MouseEvent<HTMLElement>):void => {
                    move(false)
                    draw_color(getPosition(e))
                }}
                onMouseUp={() => {
                    move(true)
                }}
                width={size*x} height={size*y} ref={canvasRef}
                />
            </div>
        </div>
    );
}
export default Draw