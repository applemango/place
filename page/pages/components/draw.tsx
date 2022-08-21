import React from "react"
import { useState } from "react"

import io from "socket.io-client";

import { getUrl } from "../../lib/main"

import styles from "./styles/draw.module.scss"

let socket = io(getUrl("","ws"))

type Props = {
    data: Array<any>
    color: string
    x: number
    y: number
    move: Function
    draw?: boolean
}
const Draw = ({ x, y, data, color, move, draw = true }:Props) => {
    const [md, setMd] = useState(false)
    const [size, setSize] = useState(30)
    function draw_color(index: number) {
        if(!draw) return false
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
export default Draw