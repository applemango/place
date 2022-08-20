import { useEffect } from "react"
import React from "react"
import { useState } from "react"
import Image from "next/image";

import styles from "./styles/draw.module.scss"

import io from "socket.io-client";

let WS_DOMAIN: String = "192.168.1.12";
let WS_PORT: number = 5000;
let socket = io(`ws://${WS_DOMAIN}:${WS_PORT}`);

type Props = {
    data: Array<any>
    color: string
    x: number
    y: number
    move: Function
}
const Draw = ({ x, y, data, color, move }:Props) => {
    const [md, setMd] = useState(false)
    const [size, setSize] = useState(30)
    function draw_color(index: number) {
        socket.emit("json", {"position":index, "color":color})
        data[index] = color
    }
    return (
        <div className={styles.main}
        onMouseDown={() => {setMd(true)}}
        onMouseUp={() => {setMd(false)}}
        >
            <div className={styles.main_} style={{
                width: x*size
                ,height: y*size
            }}>
                { data.map((c, index) => (
                    <div key={index} className={styles.dot} style={{
                        backgroundColor: c == "0" ? "#fff" : c
                        ,width: size
                        ,height: size
                    }}
                    onMouseOver={() => {
                        if(md) {
                            move(false)
                            draw_color(index)
                        }
                    }}
                    onMouseDown={() => {
                        move(false)
                        draw_color(index)
                    }}
                    onMouseUp={() => {
                        move(true)
                    }}
                    ></div>
                )) }
            </div>
        </div>
    )
}
//socket.emit("json", {"position":index,"color":data[index] == "0" ? "#000" : "0"})
//data[index] = data[index] == "0" ? "#000" : "0"

//socket.emit("json", {"position":index,"color":data[index] == "0" ? "#000" : "0"})
//data[index] = data[index] == "0" ? "#000" : "0"
export default Draw