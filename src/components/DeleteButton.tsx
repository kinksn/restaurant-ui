"use client"

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

export const DeleteButton = ({ id }: { id: string }) => {
  const {data:session, status} = useSession();
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
    });

    if(res.status === 200) {
      router.push('/');
      toast("The product was been deleted")
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  }

  // if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated' || !session?.user.isAdmin) return;

  return (
    <button className='bg-red-400 p-2 rounded-full absolute top-4 right-4' onClick={handleDelete} >
      <Image src="/close.png" alt='' width={20} height={20}/>
    </button>
  )
}