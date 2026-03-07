import { useQuery } from "@tanstack/react-query"
import { timeSlots } from "../lib/api"

const useTimeSlots = (orderDateId) => {

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["timeSlots", orderDateId],
        queryFn: () => timeSlots(orderDateId),
        enabled: !!orderDateId, // Only fetch when a date is selected
    })

    return { data, isLoading, error, refetch }
}

export default useTimeSlots