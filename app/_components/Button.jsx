import { Plus } from 'lucide-react'
import React from 'react'

export default function Button({ name }) {
    return (
        <>
            <a
                className="inline-flex items-center gap-2 rounded border border-amber-600 bg-amber-600 px-8 py-3 text-white hover:bg-transparent hover:text-amber-600 focus:outline-none focus:ring active:text-amber-500"
                href="#"
            >
                <span className="text-sm font-medium"> {name} </span>
                <Plus />
            </a>
        </>
    )
}
