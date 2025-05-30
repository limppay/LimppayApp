import OptionsForm from "./home/OptionsForm"

export default function SelectForm({label, name, options, text, register}) {
    return (
        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
            <label htmlFor={name} className="text-prim">{label}</label>
            <select  
            id={name}
             
            className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                <option value="" >{text}</option>
                {options.map((options, index) => (
                    <OptionsForm key={index} value={index} text={options.text}/>
                ))}
            </select>
            
        </div>
    )
}