export default function Error404() {
    return (
      <>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-prim">Error 404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl text-prim">Página não encontrada :/</h1>
            <p className="mt-6 text-base leading-7 text-gray-600 text-prim">Desculpe, não foi possível encontrar a página que você está procurando.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/"
                className="rounded-md p-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 border-bord flex gap-2 text-prim"
              >
                Voltar para tela inicial 
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </main>
      </>
    )
  }
  