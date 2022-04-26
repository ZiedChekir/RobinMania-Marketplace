import Metamask from '../components/metamask'
import Button from '@mui/material/Button';
import Hero from '../components/Hero';
export default function Home() {
  return (
    <div>
      <Hero />
      <Button variant="contained">Hello World</Button>
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
