import { useQuery,useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { GET_ALL_COLORS } from '../graphql/queries';
import { ADD_COLOR, DELETE_COLOR, UPDATE_COLOR_HEX, UPDATE_COLOR_NAME } from '../graphql/mutations';
import { PenBox, Plus, Trash } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Colors = () => {
  const [hexValue, setHexValue] = useState('#000000');
    const [name,setName] = useState("")
    const [newName,setNewName] = useState("")
    const [adderror,setAddError]=useState("") 
    const [hexValuechange,sethexValuechange] = useState("")
    const { loading,error, data, refetch } = useQuery(GET_ALL_COLORS);
    const [addColor, { data: dataColor,loading:adding,error:erroradd }] = useMutation(ADD_COLOR,
        {
            onCompleted:()=>{
                refetch()
            },
            onError:(e)=>{
                console.log(e)
                setAddError(e.message)
            }
        }
    );

    const [deleteColor,{loading:deleting}] = useMutation(DELETE_COLOR,{
        onCompleted:()=> refetch(),
        onError:(e)=>console.log(e)
    })


    const handleDeleteColor = (child,id)=>{
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
        deleteColor({variables:{id:_id}
        })
    }})
    }

    const [changHex,{loading:changingHexval}] = useMutation(UPDATE_COLOR_HEX,{
      onCompleted: ()=>{
        refetch()
         toast.success('Color hexcode changed successfully',)
      },
      onError:(e)=>{
        console.log(e)
      }
    })
    const [changeName,{loading:changingName}] = useMutation(UPDATE_COLOR_NAME,{
      onCompleted: ()=>{
        refetch()
         toast.success('Color name changed successfully',)
      },
      onError:(e)=>{
        console.log(e)
      }
    })

  const handleColorChange = (e) => {
    const hex1 = e.target.value;
    setHexValue(hex1);
    // console.log(hex); // Outputs: #RRGGBB format
  };
  const handleAddColor = (e)=>{
     e.preventDefault();
    addColor({variables:{name:name,hex:hexValue}})
  }
  const handleChangeHex = ()=>{
    document.getElementById('my_modal_4').close()
     Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
    if (result.isConfirmed) {
    let _id = parseInt(document.querySelector('#changeId').value)
    if (isNaN(_id)){
       toast.error('No color selected!')
    }else{
      changHex({variables:{id:_id,hexvalue:hexValuechange}})
    }
        }
    })
    
  }
  const handleChangeName = ()=>{
    document.getElementById('my_modal_4').close()
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let _id = parseInt(document.querySelector('#changeId').value)
        if (isNaN(_id)) {
          toast.error('No color selected!')
        } else {
          changeName({ variables: { id: _id, name: newName } })
        }
      }
    });
    
  }
  if (error) toast.error(error.message)
  return (
    <div>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Add color</h3>
            <p className="py-4 text-xs">Press ESC key or click on ✕ button to close</p>
            <form onSubmit={handleAddColor} className='flex flex-col space-y-2 mx-auto p-5 card w-full'>
        <label htmlFor="name" className="floating-label ">
          <span >Name</span>
          <input type="text" placeholder="Type here" className="w-full" onChange={(e)=>setName(e.target.value)} />
        </label>
        {/* hex code */}
        <label htmlFor="hexcode">Couleur</label>
        <input
          type="color"
          id="hexcode"
          name="hexcode"
          value={hexValue}
          onChange={handleColorChange}
        />
        
        <button type="submit" className="btn btn-sm btn-primary">
            <span>Add Color</span>
            {
                adding && <span className='loading loading-spinner'></span>
            }
        </button>
        {
            dataColor &&
            <div className='alert alert-dash alert-success'>Color {dataColor.addColor.name} added successfully</div>
        }
        {
            erroradd &&
            <div className='alert alert-error alert-dash'> {adderror} </div>
        }
      </form>
        </div>
        </dialog>
      
      
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Modification</h3>
          <p className="py-4 text-xs">Press ESC key or click the button below to close</p>
          <div  className='flex flex-col space-y-4 mx-auto p-5 card w-full'>
            <input type="hidden" id="changeId" />
       <div className='flex items-center justify-arround space-x-2'>
         <label htmlFor="name" className="floating-label border">
           <span >New Name</span>
           <input type="text" placeholder="Type here" className="w-full p-1" value={newName} onChange={(e)=>setNewName(e.target.value)} />
         </label>
         <button onClick={handleChangeName} className="btn btn-sm btn-primary">
            <span>Change</span>
            {
                changingName && <span className='loading loading-spinner'></span>
            }
        </button>
       </div>
        {/* hex code */}
        <div className='flex space-x-2 justify-arround items-center'>
          <div>Previous</div>
          <div id="previous" className=" w-5 h-5"></div>
          <label className='floating-label' htmlFor="hexcodechange">
          <span>Couleur</span>
          <input
            type="color"
            id="hexcodechange"
            name="hexcodechange"
            onChange={(e)=>sethexValuechange(e.target.value)}
            />
            </label>
             <button onClick={handleChangeHex} className="btn btn-sm btn-primary">
            <span>Change</span>
            {
                changingHexval && <span className='loading loading-spinner'></span>
            }
        </button>
        </div>
      </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <h1 className='flex items-center justify-center space-x-2'>
        <span className='text-3xl'>Liste des couleurs</span>
        <button className="btn btn-primary btn-ghost btn-outline btn-xs" onClick={() => document.getElementById('my_modal_3').showModal()}>
            <Plus />
        </button>
      </h1>
      <div className="overflow-x-auto">
        {/* ======================================== */}
        <ul className="list bg-base-100 rounded-box shadow-md w-full mx-auto md:w-3/5">
  
           {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>   */}
           {
             loading ? <div className='w-full text-center'><span className='loading loading-dots'></span></div>
            :  data && (data.colors.length == 0 ?  <div className='text-center w-full'>Aucune couleur</div>
            :  data.colors.map((color)=>(
                <li  className="list-row" key={`color ${color.id}`}>
                    <div className="text-4xl font-thin opacity-30 tabular-nums dark:opacity-100 dark:text-white">{color.id}</div>
                    <div className="list-col-grow font-semibold">
                    <div>{color.name}</div>
                    <div className="text-xs uppercase font-semibold opacity-60"> <div className=" w-4 h-4" style={{backgroundColor: `${color.hexCode}`}}></div></div>
                    </div>
                        <button onClick={(e)=> handleDeleteColor(e.currentTarget.firstChild,color.id)}>
                            <Trash />
                        </button>
                        <button  onClick={() => {
                          document.querySelector('#changeId').value = color.id;
                          document.querySelector('#previous').style.backgroundColor=color.hexCode;
                          sethexValuechange(color.hexCode)
                          setNewName(color.name)
                          document.getElementById('my_modal_4').showModal()
                          } }>
                             <PenBox />
                        </button>
                </li>
            )))
          }
          </ul>
          
        {
            deleting && <div className='text-center' >Deleting... <span className='loading loading-ball loading-md'></span> </div>
        }
      </div>
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
  );
};

export default Colors;