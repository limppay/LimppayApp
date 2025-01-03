import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Banner() {
  return (
    <div className=" isolate flex items-center justify-center gap-x-6 overflow-hidden bg-desSec bg-opacity-20 px-6 py-2 sm:px-3.5 sm:before:flex-1">

      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-ter">
          <strong className="font-semibold">Limppay v1.0 (Beta) 2024</strong>
          <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          Ambiente de teste
        </p>
      </div>

    </div>
  )
}
