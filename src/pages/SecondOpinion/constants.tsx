import moment from "moment";

export const COLUMNS = [
    {
        header: "Full Name",
        accessor: "full_name",
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "Concern",
        accessor: "concern",
    },
    {
        header: "Medical Records",
        accessor: "medical_record",
        render: (data: any) => (
            <div className="flex flex-col gap-2">
                {data?.medical_record?.length > 0 ? (
                    data.medical_record.map((file: string, index: number) => (
                        <a
                            key={index}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1976d2", textDecoration: "underline" }}
                        >
                            File {index + 1}
                        </a>
                    ))
                ) : (
                    <span>No Files</span>
                )}
            </div>
        ),
    },
];
