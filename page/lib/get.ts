import axios from "axios"
export async function get_data() {
    try {
        const res = await axios.get(`http://192.168.1.12:5000/get/data`)
        return res.data
    } catch (error) {
        console.error(error)
        return false
    }
}