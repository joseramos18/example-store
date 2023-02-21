import axios from "axios";
import { Product } from "./types";
import Papa from "papaparse"

export default{
    list: async() :Promise<Product[]> => {
        return axios.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vS7kKAjlIfA26NFF1JXjq5cEvI9Jqhmb8tLpWjoGkEn4UxXp7IgvTVt53-4AUQd4A9Tq9mc7WnYYnWE/pub?output=csv",
        {responseType: "blob"})
        .then((response) => {
            return new Promise<Product[]>((resolve, reject) => {
                Papa.parse(response.data, {
                    header:true,
                    // complete:(results) => {
                    //     return resolve(results.data as Product[]);
                    // },
                    complete:(results) =>{
                        const products = results.data as Product[]
                        return resolve(products.map((product) => ({
                            ...product,
                            price: Number(product.price)
                        })))
                    },
                    error:(error) => {
                        return reject(error.message)
                    }
                })
            })
        })
    }
}