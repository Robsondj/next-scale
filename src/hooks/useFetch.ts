import { useEffect, useState } from "react";
import { UseFetchType, UseFetchDataType, PostReturnedDataType, ErrorType } from "../types"

const useFetch = (url: string, method: string): UseFetchType => {

    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_URL_API}${url}`, {
            method: method,
            headers: {
                ["Content-Type"]: "application/json",
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
          })
            .then((serverResponse) => {
                return serverResponse.json();
            })
            .then((response) => {
                setData(response.data);
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            });
    }, [url, method])

    return { data, error, loading }
}

const useGetFetch = (url: string): UseFetchType => useFetch(url, "GET")

// const usePostFetch = (url: string, body: Object | null): UseFetchType => useFetch(url, "POST", body)

const usePostFetch = (url: string): UseFetchDataType => {

    const [data, setData] = useState<PostReturnedDataType | undefined>()
    const [error, setError] = useState<undefined | string>(undefined)
    const [success, setSuccess] = useState<undefined | string>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

    const handleFetch = (method: string, body: Object, id: number | undefined) => {
        setLoading(true)
        setError(undefined)
        setSuccess(undefined)
        fetch(`${process.env.NEXT_PUBLIC_URL_API}${url}${id ? id : ""}`, {
            method: method,
            headers: {
                ["Content-Type"]: "application/json",
                Authorization: `Bearer ${process.env.API_TOKEN}`
            },
            body: JSON.stringify(body)
          })
            .then((serverResponse) => {
                if (serverResponse.status == 200) {
                    return serverResponse.json();
                }
                setError("Houve um erro ao salvar os dados.");
            })
            .then((response) => {
                setLoading(false)
                setSuccess("Dados salvos com sucesso!")
                setData(response.data);
            })
            .catch((err: ErrorType) => {
                setLoading(false)
                console.log("Request Error", err.message)
                setError("Houve um erro ao comunicar com a API.")
            });
    }

    const saveFetch = (body: Object, id: number | undefined) => {
        const method = id ? "PUT" : "POST";
        handleFetch(method, body, id)
    };
    
    const deleteFetch = (id: number) => {
        handleFetch("DELETE", {}, id);
    };

    return {
        data,
        success,
        loading,
        error,
        saveFetch,
        deleteFetch
    }
}

export  {
    useGetFetch,
    usePostFetch
};