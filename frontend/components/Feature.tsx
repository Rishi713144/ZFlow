export const Feature = ({ title, subtitle }: {
    title: string,
    subtitle: string
}) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-amber-600">
                <Check />
            </div>
            <div className="flex flex-col text-left">
                <div className="font-bold text-slate-900 text-sm italic">
                    {title}
                </div>
                <div className="text-slate-500 text-xs">
                    {subtitle}
                </div>
            </div>
        </div>
    );
}

function Check() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}