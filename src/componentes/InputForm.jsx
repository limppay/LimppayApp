export default function InputForm({label, text, name, type}) {
    return (
        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
            <label htmlFor={name} className="text-prim">{label}</label>
            <input id={name} name={name} type={type} placeholder={text} required className="border rounded-md border-bord p-3 pt-2 pb-2 "/>
        </div>
    )
}