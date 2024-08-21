export default function CheckForm({label, id, value}){
    return(
        <div className="m-3 mb-0 ml-0 flex gap-2">
            <input type="checkbox" name="dias[]" id={id} value={value} />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}