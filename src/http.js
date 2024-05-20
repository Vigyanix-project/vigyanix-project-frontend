import axios from "axios"
import { toast } from "react-toastify";

const base_url = process.env.REACT_APP_BASE_URL;

const makeHttpRequest = async (method, URL, data = null, params = null) => {
    try {
        const url = base_url + URL
        console.log(data)
        const res = await axios({
            method,
            url,
            data,
            params
        });
        toast.success(res?.data?.message);
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error)
        // throw error;
    }
}



export default makeHttpRequest;