import { InfoIcon, Plus } from "lucide-react";
import { GET_ALL_FRUITS,GET_ALL_COLORS } from "../graphql/queries";
import { useQuery, useMutation } from "@apollo/client/react";
import { ADD_FRUIT, DELETE_FRUIT } from "../graphql/mutations";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Fruits = () => {
    const navigate = useNavigate()
    const { loading: loadingFruits, data, refetch } = useQuery(GET_ALL_FRUITS);
    const { loading: loadingColor,error ,data: dataColor } = useQuery(GET_ALL_COLORS);
    const [addFruit, { loading: adding }] = useMutation(ADD_FRUIT);
    const [deleteFruit] = useMutation(DELETE_FRUIT);
    const [description, setDescripton] = useState("");
    const [file, setFile] = useState(null);

    const handleadd = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const colorId = parseInt(formData.get('color'));
    // console.log(file)
    addFruit({
        variables: {
            name:name,
            colorId:colorId,
            description:description,
            image:file
        },
    }).then(() => {
        refetch();
        e.target.reset();
        document.getElementById('my_modal_3').close();
        toast.success("Added successfully")
    }).catch((error) => {
        console.error('Error adding fruit:', error);
    });
    }

    const handleDeleteFruit = (child,id)=>{
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) {
                const _id = parseInt(id)
                child.classList.add("blink")
                const toastId = toast.loading("Deleting")
                deleteFruit({variables:{id:_id}}).then(()=>{
                    toast.dismiss(toastId)
                    toast.success("Deleted!")
                    refetch()
                })
            }})
    }
    if (error) toast.error(error.message)
    return <div>
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Add Fruit</h3>
                <p className="py-4 text-xs">Provide a fruit name and an icon (emoji or simple char)</p>
                <form onSubmit={handleadd} className="flex flex-col gap-2" encType="multipart/form-data">
                   <div className="input validator w-full">
                    <span className="label">Nom</span>
                     <input name="name" required placeholder="Fruit name (e.g. Apple)" className="w-full" />
                   </div>
                    <div>
                       <div className="select validator w-full">
                        <span className="label">Color</span>
                         <select required name="color" id="color">
                             {/* <option disabled>Select color</option> */}
                             {
                                 dataColor && dataColor.colors.map((color)=>(
                                     <option key={`color ${color.id}`} value={color.id} >{color.name}</option>
                                 ))
                             }
                         </select>
                         <div className="validator-hint">Select a color</div>
                       </div>
                         {
                            loadingColor && <span className="loading loading-spinner loading-xs"></span>
                        }
                    </div>
                    <fieldset className="fieldset">
                     <legend className="fieldset-legend">Description</legend>
                    <textarea name="description" id="description" className="w-full textarea" onChange={(e)=>setDescripton(e.currentTarget.value)}></textarea>
                    </fieldset>
                    <input type="file" className="file-input w-full max-w-xs" onChange={(e) => setFile(e.target.files[0])} />
                    <fieldset>
                        <legend className="fieldset-legend">Image (optional)</legend>
                        {
                            !file ? <span className="text-xs opacity-60">You can upload an image file to represent the fruit.</span>
                            : <img src={URL.createObjectURL(file)} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                        }
                    </fieldset>
                    <div className="modal-action">
                        <button type="submit" className="btn">
                            <span>Add</span>
                            {
                                adding && <span className="loading loading-spinner loading-xs"></span>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
        <h1 className="m-4 flex items-center justify-start gap-4">
            <span className="text-3xl">Liste des fruits</span>
            <button className="btn btn-xs btn-outline m-1" onClick={() => document.getElementById('my_modal_3').showModal()}>
                <Plus />
            </button>
        </h1>
        <ul className="list bg-base-100 rounded-box shadow-md w-full md:w-3/5 mx-auto">

            <li className="p-4 pb-2 text-lg opacity-60 tracking-wide">Fruit inventory</li>
            {
                loadingFruits ? <div className="text-center w-full">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
                :  data &&( data.fruits.length == 0 ?  <div className="text-center text-red-600 text-xl" > No fruit found </div> : data.fruits.map((fruit) => (
                    
                    <li className="list-row" key={`fruit ${fruit.id}`}>
                    <div className="flex space-x-2 items-center">

                    <div className="text-4xl font-thin opacity-30 tabular-nums dark:opacity-100 dark:text-white">{fruit.id}</div>
                    <div>
                        {
                            fruit.image ? <img src={`https://parinari.pythonanywhere.com//${fruit.image.url}`} alt={fruit.name} className="w-10 h-10 object-cover rounded-full"/> : <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">N/A</div>
                        }
                    </div>
                        </div>
                    <div>
                        <div>{fruit.name}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">{fruit.color.name}</div>
                    </div>
                    <p className="list-col-wrap text-xs">
                        {fruit.description}
                    </p>
                    {/* <button className="btn btn-square btn-ghost" aria-label="Edit Apple">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h6M4 13v7h7l9-9-7-7L4 13z" />
                        </svg>
                    </button> */}
                    <button onClick={(e)=>handleDeleteFruit(e.currentTarget.firstChild,fruit.id)} className="btn btn-square btn-ghost" aria-label="Delete Apple">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-7 4h10" />
                        </svg>
                    </button>
                    <button className="btn btn-square btn-ghost" aria-label="Info Apple" onClick={()=>{
                         navigate(`/fruit/${fruit.id}`)
                    }}>

                      <InfoIcon />
                    </button>
                </li>
                )
                ))
            }
        </ul>
         <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""//the toast all the screen
                toasterId="default"
                toastOptions={{
                  // Define default options
                  className: 'card shadow shadow-slate-950 ring ring-red-600 bg-white',
                  duration: 3000,
                  removeDelay: 3000,
                  style: {
                    background: '#FFFFFFFF',
                    color: '#000000',
                  },
        
                  // Default options for specific types
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: 'green',
                      secondary: 'black',
                    },
                  },
                }}
        />
    </div>
}

export default Fruits;