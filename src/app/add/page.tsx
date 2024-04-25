"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
}

type Option = {
  title: string;
  additionalPrice: number;
};

const initialInputs = {
  title: "",
  desc: "",
  price: 0,
  catSlug: "",
};

const initialOption = {
  title: "",
  additionalPrice: 0,
};

const AddPage = () => {
  const {data: session, status} = useSession();
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [option, setOption] = useState<Option>(initialOption);
  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File>();
  // const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  };

  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  }

  // cloudinaryに画像をアップロードする関数
  // 戻り値は画像のurl文字列
  const upload = async () => {
    const data = new FormData();
    data.append('file', file!);
    data.append('upload_preset', 'restaurant');
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dpodjvr9j/image/upload", {
        method: "POST",
        /* 
         * 何らかの理由でプリフライトリクエスト実行時にヘッダー情報を受け取らない場合エラーになる
         * headersをコメントアウトすることでアップロードすることができた
         * @see @link{https://support.cloudinary.com/hc/en-us/community/posts/360010811739-Access-Control-Allow-Origin}
        */
        // headers: {"Content-Type": "multipart/form-data"},
        body: data,
      });
      const resData = await res.json();
      return resData.url;
    } catch(error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = await upload();

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
          options,
        })
      });

      // if (formRef.current !== null) {
      //   formRef.current.reset();
      //   setInputs(initialInputs);
      //   setOptions([]);
      // }

      const data = await res.json();
      router.push(`/product/${data.id}`);
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="shadow-lg flex flex-wrap gap-4 p-8" onSubmit={handleSubmit}>
        <h1>Add New Product</h1>
        <div className="w-full flex flex-col gap-2">
          <label>Image</label>
          <input
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="file"
            onChange={handleChangeImg}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Title</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="title"/>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Desc</label>
          <textarea onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" name="desc"/>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Price</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="number" name="price"/>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Category</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="catSlug"/>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Options</label>
          <div>
            <input onChange={changeOption} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" placeholder="Title" name="title"/>
            <input onChange={changeOption} className="ring-1 ring-red-200 p-2 rounded-sm" type="number" placeholder="Additional Price" name="additionalPrice"/>
          </div>
          <div
            className="w-52 bg-red-500 text-white p-2 rounded-md"
            onClick={() => setOptions( prev => [...prev, option])}
            >
              Add Option
          </div>
        </div>
        <div>
          {options.map((item) => (
            <div className="ring-1 p-2 ring-red-500 rounded-md cursor-pointer" key={item.title} onClick={() => setOptions(options.filter((option) => option.title !== item.title))}>
              <span>{item.title}</span>
              <span>{item.additionalPrice}</span>
            </div>
          ))}
        </div>
        <div>
        </div>
        <button type="submit" className="p-2 w-full bg-red-500 text-white">Submit</button>
      </form>
    </div>
  )
}

export default AddPage