export const CheckFeature = ({ label }: {
    label: string;
}) => {
    return (
        <div className="flex items-center gap-3 px-1">
            <div className="flex-shrink-0 text-green-500">
                <CheckMark />
            </div>
            <span className="text-slate-700 text-sm font-medium">{label}</span>
        </div>
    );
}

function CheckMark() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}