import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useGet<T>(url: string, defaultValue: T){
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<T>(defaultValue)

    const chargeData = useCallback(async () => {
        setLoading(true)

        const res = await axios.get<T>(url)
        setData(res.data)

        setLoading(false)
    }, [url])

    useEffect(() => {
        chargeData()
    }, [chargeData])

    return [data, loading] as [T, boolean]
}