import { useQuery } from "@tanstack/react-query"
import { fetchOrderDates } from "../lib/api"

const useOrderDates = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["orderDates"],
        queryFn: fetchOrderDates,
        staleTime: 30_000,
        refetchInterval: 30_000,
    })

    return { data, isLoading, error }
}

export default useOrderDates
