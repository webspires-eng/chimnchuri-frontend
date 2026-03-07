import { useQuery } from "@tanstack/react-query"
import { fetchOrderDates } from "../lib/api"

const useOrderDates = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["orderDates"],
        queryFn: fetchOrderDates,
    })

    return { data, isLoading, error }
}

export default useOrderDates
