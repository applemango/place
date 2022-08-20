import { useEffect } from "react"
import React from "react"
import { useState } from "react"
import Image from "next/image";

import styles from "./styles/selector.module.scss"


type Props = {
    setColor: any
    colors: string[]
}
const Selector = ({ setColor, colors }:Props) => {
    return (
        <div className={styles.main}>
            <div>
                { colors.map((c:string, index:number) => (
                    <div
                    key={index}
                    className={styles.color}
                    style={{
                        backgroundColor: c
                    }}
                    onClick={() => {
                        setColor(c)
                    }}
                    >
                    </div>
                ))}
            </div>
    </div>
    )
}
export default Selector