import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Head from 'next/head'
import Draw from "./components/draw"

import styles from './styles/index.module.scss'

const View: NextPage = () => {
    const [sizeX,setSizeX] = useState(32)
    const [sizeY,setSizeY] = useState(32)
    const [list, setData] = useState([])
    const [color, setColor] = useState("#000")
    const [canMove, setCanMove] = useState(true)
    const router = useRouter()
    const textToArray = (text: any) => {
        let main = text.slice(1,-1).split(",")
        for (let i = 0; i < main.length; i++) {
            main[i] = "#"+main[i]
        }
        return main
    }
    useEffect(() => {
        if(router.query.data && !Array.isArray(router.query.data)) {
            setData(textToArray(router.query.data))
        }
    },[router.query])
    return (
        <div className={styles.main}>
            <Head>
                <title>Editor</title>
            </Head>
            <div className={styles.canvas}>
                <TransformWrapper
                minScale={0.1}
                disabled={false}
                limitToBounds={true}
                >
                    <TransformComponent>
                    <Draw x={sizeX} y={sizeY} data={list} color={color} move={setCanMove} draw={false}/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    )
}
export default View
