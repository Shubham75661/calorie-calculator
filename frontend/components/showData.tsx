type data ={
    location : string | null;
    value : string | number;
    title : string;
}

export default function ShowData({location, value, title} : data){
    let src = `/animation/${location}.svg`
    return(
        <div className="h-30 w-30 object-cover flex flex-col items-center justify-center space-y-3 border-1 rounded-md shadow-xl">
            <img src={src} alt={value.toString()} className="w-10 h-10" />
            <h3 className="font-200 font-mono text-xs">{title}</h3>
            <h3 className="font-200 font-mono text-sm">{value}</h3>
        </div>
    )
}