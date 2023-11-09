import axios, {AxiosRequestConfig} from "axios";


export default class Api {
    static async get(url: string,options: AxiosRequestConfig){
        return await axios.get(url,options)
    }

    static async post(url: string,options: AxiosRequestConfig){
        return await axios.post(url,options)
    }

    static async delete(url: string,options: AxiosRequestConfig){
        return await axios.delete(url,options)
    }

    static async put(url: string,options: AxiosRequestConfig){
        return await axios.put(url,options)
    }
}
