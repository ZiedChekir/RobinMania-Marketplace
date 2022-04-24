import Head from 'next/head'
import Image from 'next/image'
import Metamask from '../components/metamask'
export default function Home() {
  return (
    <div>
      <button className='btn'>Btt</button>
    
      <button
    className="btn-primary-sm"
>
    Button
</button>
<button
    className="px-4 py-2 text-sm text-white duration-150 bg-indigo-600 rounded-md hover:bg-indigo-700 active:shadow-lg"
>
  <Metamask/>
    Button
</button>
      </div>
  )
  
}
