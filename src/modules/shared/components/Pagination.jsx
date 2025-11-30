import ResponsiveText from './ResponsiveText';
import SelectStatus from './SelectStatus';

function Pagination({pageNumber,totalPages,pageSize,setPageNumber,setPageSize
}) {
return (
    <div className="flex justify-center items-center mt-3 gap-3">

    <ResponsiveText
        as="button"
        disabled={pageNumber === 1}
        onClick={() => setPageNumber(pageNumber - 1)}
        className="bg-gray-200 px-3 py-1 rounded-md disabled:bg-gray-100"
    >
        Atrás
    </ResponsiveText>

    <span className="text-[clamp(18px,2vw,18px)]">
        {pageNumber} / {totalPages}
    </span>

    <ResponsiveText
        as="button"
        disabled={pageNumber === totalPages}
        onClick={() => setPageNumber(pageNumber + 1)}
        className="bg-gray-200 px-3 py-1 rounded-md disabled:bg-gray-100"
    >
        Siguiente
    </ResponsiveText>

    <SelectStatus
    value={pageSize}
    onChange={(value) => {
        setPageNumber(1);
        setPageSize(Number(value));
    }}
    options={[
        { value: 10, label: "10" },
        { value: 2, label: "2" },
        { value: 15, label: "15" },
        { value: 20, label: "20" }
    ]}
    />

    </div>
);
}
export default Pagination;
