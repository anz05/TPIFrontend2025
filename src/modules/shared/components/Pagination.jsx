import ResponsiveText from './ResponsiveText';

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

    <span className="text-[clamp(14px,2vw,18px)]">
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

    <ResponsiveText
        as="select"
        value={pageSize}
        onChange={(evt) => {
        setPageNumber(1);
        setPageSize(Number(evt.target.value));
        }}
        className="ml-3 bg-gray-200 px-2 py-1 rounded-md"
    >
        <option value="2">2</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
    </ResponsiveText>

    </div>
);
}
export default Pagination;
