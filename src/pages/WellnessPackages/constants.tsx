export const COLUMNS = [
    {
        header: "Name",
        accessor: "name",
    },
    {
        header: "Category",
        accessor: "category",
    },
    {
        header: "Original Price",
        accessor: "originalPrice",
    },
    {
        header: "Discounted Price",
        accessor: "discountedPrice",
    },
    {
        header: "Total Tests",
        accessor: "totalTestsCount",
    },
    {
        header: "Order",
        accessor: "order",
    },
    {
        header: "Popular",
        accessor: "isPopular",
        render: (row: any) => row.isPopular ? "Yes" : "No",
    },
    {
        header: "Free Consultation",
        accessor: "hasFreeDoctorConsultation",
        render: (row: any) => row.hasFreeDoctorConsultation ? "Yes" : "No",
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (row: any) => row.isActive ? "Active" : "Inactive",
    },

]
