import { useMutation, useQuery } from "@apollo/client/react"
import {  useState } from "react"
import { ADD_TAG,REMOVE_TAG,UPDATE_TAG } from "../graphql/mutations"
import {GET_TAGS }from "../graphql/queries"
import { PenSquareIcon, PlusIcon, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast"

const CreateTag = ()=>{
    const [name,setName] = useState("")
    const [newname,setNewname] = useState("")
    const [errorMsg, setErrorMsg] = useState("");
    const [succesMsg, setSucessMsg] = useState("");
    const [updatMsg, setUpdateMsg] = useState({success:false,message:"" });
    const [errDel,setErrDel] = useState({success:false,message:"" })
    const {data:allTgas, loading: loadtag ,error} = useQuery(GET_TAGS);


    const [update,{updating}] = useMutation(UPDATE_TAG,{
        onCompleted: (data) => {
            console.log(data)
            setUpdateMsg({
                success:data.updateTag.success,
                message:data.updateTag.message
            });

        },
        refetchQueries: ["GetTags"],
        onError: (e)=>{
            console.log(e)
            setUpdateMsg({
                success:false,
                message:e.message
            });
        }
    });
    const [deleteTag,{deleting}] = useMutation(REMOVE_TAG, {
        onCompleted: (data) => {
            setErrDel({
                success:data.deleteTag.success,
                message:data.deleteTag.message
            });
        },
        refetchQueries: ["GetTags"],
        onError: (e)=>{
            console.log(e)
        }
    })


    // const tags = allTgas?.tags || []
    const [addTag, {loading}] = useMutation(ADD_TAG,{
        onCompleted:(data) => {
            setSucessMsg(`Tag ${data.addTag.name} ajouter avec sucess`);
            setErrorMsg("");
        },
        refetchQueries: ["GetTags"],
        onError:(error) => {
            setErrorMsg(error.message);
            setSucessMsg("");
        }

    })
    const handleSubmit =(e)=>{
         e.preventDefault();
        setSucessMsg("")
        setErrorMsg("")
        addTag({ variables: {tagname:name} });
    }
    const handleupdate =(e)=>{
        e.preventDefault();
        setUpdateMsg({success:false,message:"" })
        let tagId = parseInt( document.getElementById('tagnameedit').value)
        update({ variables: {tagId:tagId, tagname:newname} });
    }
    const handledeleteTag = (e,id)=>{
        // let element = document.createElement("samp")
        // element.classList.add("loading","loading-sm" ,"loading-spinner")
        // e.currentTarget.parentElement.appendChild(element)
        e.currentTarget.firstChild.classList.add("blink")
        deleteTag({ variables: {tagId: parseInt(id)} });
        setTimeout(()=> setErrDel({success:false,message:""}),5000)
    }
    if (error) toast.error(error.message)
    return <div>
      
        <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Ajouter tag</h3>
            <p className="py-4 text-xs">Press ESC key or click the button below to close</p>
            <form onSubmit={handleSubmit} method="post" className="card p-4 flex flex-col justify-around gap-3 w-full">
            <div className="input w-full pl-0.5">
                <span className="glass p-1 rounded-l-sm">Name</span>
                <input type="text" name="name" className="w-full" onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
            <button type="submit" className="btn btn-sm btn-primary">
                <span>Ajouter</span>
                 <span className={`${loading ? "loading loading-spinner" : "hidden"}`}></span>
            </button>
            </div>
            {errorMsg && (
                <p className="alert alert-dash alert-error w-fit">{errorMsg}</p>
            )}

            {succesMsg && (
                <p className="alert alert-dash alert-success w-fit">{succesMsg}</p>
            )}
        </form>
            <div className="modal-action">
            <form method="dialog">
                <button className="btn">Close</button>
            </form>
            </div>
        </div>
        </dialog>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Modification de tag</h3>
            <p className="py-4 text-xs">Press ESC key or click the button below to close</p>
            <input type="hidden" id="tagnameedit" name="tagEditID" />
            <form onSubmit={handleupdate} method="post" className="card p-4 flex flex-col justify-around gap-3 w-full">
                <div className="input w-full pl-0.5">
                <span className="glass p-1 rounded-l-sm">New Name</span>
                <input type="text" name="name" className="w-full" onChange={(e)=>setNewname(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-sm btn-primary">
                <span>Modifier</span>
                 <span className={`${updating ? "loading loading-spinner" : "hidden"}`}></span>
            </button>
            {updatMsg.message ?
                updatMsg.success === false ? (
                <p className="alert alert-dash alert-error w-fit">{updatMsg.message}</p>
            ):
            (
                <p className="alert alert-dash alert-success w-fit">{updatMsg.message}</p>
            ):null}
            </form>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <div className="p-1 card">
            <h1 className="p-3 flex justify-center items-center gap-3">
                <span className="text-2xl dark:text-white font-semibold uppercase">Liste des tags </span>
                <button className="btn btn-sm" onClick={() => document.getElementById('my_modal_2').showModal()}>
                    <PlusIcon />
                </button>
            </h1>
            <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                {loadtag ? (
                    <tr>
                        <td colSpan={3} className="text-center">
                            <span className="loading loading-spinner loading-md"></span>
                        </td>
                    </tr>
                    ) : allTgas?.tags.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="text-center text-xl text-red-500">
                        No tags found
                        </td>
                    </tr>
                    ) : (
                        allTgas?.tags .map((t) => (
                            <tr key={`tag ${t.id}`}>
                                <td>{t.id}</td>
                                <td>{t.name}</td>
                                <td className="flex items-center align-middle">
                                    <button onClick={(e)=>handledeleteTag(e,t.id)}>
                                    <Trash />
                                </button>
                                <button onClick={() => {
                                    document.getElementById('tagnameedit').value = t.id;
                                    document.getElementById('my_modal_3').showModal()
                                }
                                }>
                                    <PenSquareIcon />
                                </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
            </table>
            { deleting && (
            <p className="alert alert-dash alert-info">
                Suppresion en cours...
            </p>)
            }
            {
                errDel.message ?
                errDel.success ?
                <span className="alert alert-dash alert-success"> {errDel.message} </span>
                :  <span className="alert alert-dash alert-error"> {errDel.message} </span>
                : null
            }
        </div>
        <Toaster />
    </div>
}

export default CreateTag;