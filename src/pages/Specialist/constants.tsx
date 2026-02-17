export const COLUMNS = [
    {
        header: "Name",
        accessor: "name",
    },
    {
        header: "Specialization",
        accessor: "specialization",
    },
    {
        header: "Degree",
        accessor: "degree",
    },
    {
        header: "Experience (Years)",
        accessor: "experienceYears",
    },
    {
        header: "Consultation Fee",
        accessor: "consultationFee",
    },
    {
        header: "Rating",
        accessor: "rating",
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "City",
        accessor: "city",
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (row: any) => row.isActive ? "Active" : "Inactive",
    },
    {
        header: "Verified",
        accessor: "isVerified",
        render: (row: any) => row.isVerified ? "Verified" : "Unverified",
    }
]
