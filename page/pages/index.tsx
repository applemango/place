import type { NextPage } from 'next'
import { useState, useEffect } from "react"
import Head from 'next/head'
import Image from 'next/image'
import styles from './styles/index.module.scss'
import io from "socket.io-client";

import Draw from "./components/draw"
import Selector from "./components/selector"

import axios from "axios"

import { get_data } from "../lib/get"

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

let WS_DOMAIN: String = "192.168.1.12";
let WS_PORT: number = 5000;
let socket = io(`ws://${WS_DOMAIN}:${WS_PORT}`);

const Home: NextPage = () => {
    async function get() {
        const res = await get_data();
        if(res) {
            setData(res.data)
        }
        console.log(res)
    }
    //async function get_data(){
    //    try {
    //        const res = await axios.get(`http://${WS_DOMAIN}:${WS_PORT}/get/data`)
    //        return res.data
    //    } catch (error) {
    //        console.error(error)
    //        return reset_list(sizeX, sizeY, "#fff")
    //    }
    //}
    const reset_list = (x:number, y:number, color:string) => {
        let r = []
        for (let i = 0; i < x*y; i++) {
            r.push(color)
        }
        return r
    }
    const [sizeX,setSizeX] = useState(32)
    const [sizeY,setSizeY] = useState(32)
    const [list, setData] = useState(reset_list(sizeX, sizeY, "#fff"))
    const [color, setColor] = useState("#000")
    const [colors, setColors] = useState(["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#78909C","#fff","#E0E0E0","#BDBDBD","#9E9E9E","#424242","#212121","#000"])
    const [canMove, setCanMove] = useState(true)
    const t = () => {
        socket.on("json", (d:any) => {
            //console.log(d)
            //change_dot(d.position,d.color)
            //setData((pre_count) => change_dot(pre_count,d.position,d.color))
            change_dot(d.position,d.color)
            //console.log(list)
        })
    }
    //const change_dot = (data:Array<any>, index:number, color:any) => {
    //    let c = data
    //    c[index] = color
    //    return c
    //}
    const change_dot = (i:number, color:string) => {
        setData(
            list.map((d:any, index:number) => (
                index == i ? color : d
            ))
        )
    }
    //const s = (d: any) => {
    //    socket.emit("json", d)
    //}
    t()
    console.log(list)
    useEffect(() => {
        get()
    },[])
    return (
        <div className={styles.main}>
            <Head>
                <title>Editor</title>
            </Head>
            <div className={styles.canvas}>
                <TransformWrapper
                minScale={0.1}
                disabled={!canMove}
                limitToBounds={false}
                >
                    <TransformComponent>
                    <Draw x={sizeX} y={sizeY} data={list} color={color} move={setCanMove}/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <Selector setColor={setColor} colors={colors} />
        </div>
    )
}
/*
setData(
                list.map((d:any, index:number) => (
                    index == 2 ? "#000" : list[index]
                ))
            )
*/
/*
<button onClick={() => {
    const r = Math.random()**5
    s({"Number":r})
}}>hello</button>
*/
export default Home
