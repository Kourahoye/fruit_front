import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { GET_FRUIT, GET_TAGS, GET_ALL_COLORS } from "../graphql/queries";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ADD_TAG_TO_FRUIT, REMOVE_TAG_FROM_FRUIT, UPDATE_FRUIT, UPDATE_FRUIT_IMAGE } from "../graphql/mutations";
import Swal from "sweetalert2";
import { ArrowBigLeft, Edit, Minus } from "lucide-react";
import { Link } from 'react-router-dom';
const FruitInfos = () => {
    const params = useParams()
    const [newImage, setNewImage] = useState()
    const { data: allTgas, loading: loadtag, refetch: refetchTags } = useQuery(GET_TAGS);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [fruitColor, setFruitColor] = useState({})
    const [loadColors, { colorsLoading, data: dataColor }] = useLazyQuery(GET_ALL_COLORS);
    const { loading, data, called, refetch } = useQuery(GET_FRUIT, {
        variables: { id: parseInt(params.id) }
    })
    const [addTag] = useMutation(ADD_TAG_TO_FRUIT, {
        onCompleted: () => {
            toast.success(`Tag  added to fruit successfully`)
            refetch()
            refetchTags()
        },
        onError: (error) => {
            toast.error(`Error adding tag to fruit: ${error.message}`)
        },
    })
    const [removeTag] = useMutation(REMOVE_TAG_FROM_FRUIT, {
        onCompleted: () => {
            toast.success(`Tag removed from fruit successfully`)
            refetch()
            refetchTags()
        },
        onError: (error) => {
            toast.error(`Error removing tag from fruit: ${error.message}`)
        },
    })
    const [changeFruit] = useMutation(UPDATE_FRUIT,{
        onCompleted:(dataF)=>{
            console.log(dataF)
            refetch()
        }
    });

    const handleRemoveTag = (tagID) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are removing the tag`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let toastId = toast.loading("Removing filter...")
                removeTag({ variables: { fruitId: parseInt(params.id), tagId: parseInt(tagID) } }).then(() => {
                    toast.dismiss(toastId)
                })
            }
        })
    }
    const [updateFruitImage] = useMutation(UPDATE_FRUIT_IMAGE, {
        onCompleted: () => {
            toast.success(`Image updated successfully`)
            refetch()
            refetchTags()
        }
    })
    const handleUpdateImage = () => {
        if (!newImage) {
            toast.error("Please select an image first")
            return
        }
        updateFruitImage({ variables: { id: parseInt(params.id), image: newImage } })
    }


    // helpers: convert hex -> luminance -> contraste (renvoie "black" ou "white")
    const hexToRgb = (hex) => {
        const normalized = hex.replace("#", "");
        const bigint = parseInt(normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized, 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    const getLuminance = ({ r, g, b }) => {
        const srgb = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    };

    const getContrastColor = (hex) => {
        try {
            const rgb = hexToRgb(hex);
            const lum = getLuminance(rgb);
            // seuil 0.179 (WCAG guidance) -> renvoie black ou white
            return lum > 0.179 ? "#000000" : "#ffffff";
        } catch {
            return "#000000";
        }
    };
    const handleAddTagFilter = () => {
        let tagName = document.querySelector('input[name="metaframeworks"]:checked')?.getAttribute("aria-label");
        if (!tagName) {
            toast.error("Please select a tag to add")
            return
        }
        Swal.fire({
            title: 'Are you sure?',
            text: `You are adding the tag ${tagName}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let toastId = toast.loading("Adding filter...")
                addTag({ variables: {fruitName: data.getFruit.name, tagName: tagName } }).then(() => {
                    toast.dismiss(toastId)
                })
            }
        })
    }
    const setvalues = () => {
        const fruit = data.getFruit
        if (fruit) {
            setFruitColor(fruit.color)
            setName(fruit.name)
            setDescription(fruit.description)
            loadColors()
        }
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        document.getElementById('my_modal_3').close()
        Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
    if (result.isConfirmed) {
        changeFruit({variables:{id:parseInt(data.getFruit.id),name:name,description:description,color:parseInt(fruitColor.id)}})
    }else{
  Swal.fire("Annulation","Operation annuler")   
}
    })
    
    }
    return <div className="grid md:grid-cols-2 lg:grid-cols-3 space-x-2 space-y-3">

        <Link
            to="/fruits"
            className="absolute btn btn-xl btn-circle mb-4 flex items-center gap-2 left-10"
        >
            <ArrowBigLeft className="w-5 h-5" />
        </Link>


        {
            called && loading ? <div className="w-screen h-screen flex items-center justify-center text-center">
                <span className="loading loading-ring loading-xl"></span>
            </div>
                : data ? <div className="card  w-full md:w-96 h-96 bg-base-100 shadow-xl mx-auto my-auto">
                    {
                        data.getFruit.image ?
                            <figure><img src={`http://localhost:8000/${data.getFruit.image.url}`} alt={data.getFruit.name} /></figure>
                            : <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">N/A</div>
                    }
                    <div className="card-body">
                        <div className="card-title flex-col">
                            <span>{data.getFruit.name}</span>
                            <div className="flex items-start w-full">
                                {
                                    data.getFruit.tags.map((tag) => (
                                        <span key={tag.id} className="group badge badge-secondary ml-2 hover:pr-0">{tag.name}
                                            <button onClick={() => handleRemoveTag(tag.id)} className="badge hidden delay-75 duration-75 will-change-transform group-hover:inline transition-transform btn btn-neutral btn-xs btn-outline mr-0"> <Minus className="w-4" /></button>
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                        <p>{data.getFruit.description}</p>
                        <div className="card-actions justify-end">
                            <button className="btn" onClick={() => {
                                document.getElementById('my_modal_3').showModal()
                                setvalues()
                            }}>

                                <Edit />  {/* button for editing here and open moadal for edit *?}
                    {/* empêche le chevauchement et gère plusieurs couleurs */}
                            </button>
                            <div className="flex gap-2 flex-wrap items-center ">
                                {
                                    // supporte soit un objet couleur soit un tableau de couleurs
                                    Array.isArray(data.getFruit.color)
                                        ? data.getFruit.color.map((c, i) => (
                                            <span
                                                key={c.id ?? c.name ?? i}
                                                className="badge badge-outline font-semibold p-2"
                                                style={{
                                                    backgroundColor: c.hexCode,
                                                    color: getContrastColor(c.hexCode),
                                                    border: '1px solid rgba(0,0,0,0.12)'
                                                }}
                                                title={c.name}
                                            >
                                                {c.name}
                                            </span>
                                        ))
                                        : (() => {
                                            const c = data.getFruit.color;
                                            return (
                                                <span
                                                    className="badge badge-outline font-semibold p-2"
                                                    style={{
                                                        backgroundColor: c.hexCode,
                                                        color: getContrastColor(c.hexCode),
                                                        border: '1px solid rgba(0,0,0,0.12)'
                                                    }}
                                                    title={c.name}
                                                >
                                                    {c.name}
                                                </span>
                                            );
                                        })()
                                }
                            </div>
                        </div>
                    </div>
                </div> : <div className="w-full font-bold text-3xl text-center text-red-600"> Fruit not found </div>
        }
        {
            data &&
            <><div className="space-y-4 p-5 border border-gray-300 rounded-md shadow-md">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold uppercase">Ajouter des filtres</h1>
                    <div className="filter space-x-1 space-y-2">
                        <input className="btn filter-reset" type="radio" name="metaframeworks" aria-label="All" />
                        {called && data && loadtag ? <div className="text-center w-full"><span className="loading loading-spinner loading-md"></span></div>
                            : allTgas && allTgas.tags.length == 0 ? <div className="text-center text-red-600 text-xl"> No tag found </div>
                                : allTgas?.tags.map((tag) => (
                                    data?.getFruit.tags.find(t => t.id == tag.id) ? null :
                                        <input key={tag.id} className="btn" type="radio" name="metaframeworks" aria-label={tag.name} />
                                ))}

                        {data && allTgas && (JSON.stringify(data.getFruit.tags) == JSON.stringify(allTgas.tags)) ?
                            <div className="text-center text-green-600 text-xl">All tags added</div>
                            :
                            null}
                    </div>
                    <button className="btn btn-primary btn-outline btn-ghost" onClick={() => handleAddTagFilter()}>Appliquer</button>
                </div>
                <div className="space-y-1 space-x-1">
                    <h1 className="uppercase text-xl font-semibold">Change Image</h1>
                    <input type="file" className="file-input w-full max-w-xs" onChange={(e) => setNewImage(e.target.files[0])} />
                    <button className="btn btn-primary btn-outline btn-ghost" onClick={handleUpdateImage}>Changer</button>

                    <fieldset>
                        <legend className="fieldset-legend">Image (optional)</legend>
                        {!newImage ? <span className="text-xs opacity-60">You can upload an image file to represent the fruit.</span>
                            : <img src={URL.createObjectURL(newImage)} alt="Preview" className="w-32 h-32 object-cover rounded-md" />}
                    </fieldset>
                </div>
            </div>
                <dialog id="my_modal_3" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Modification!</h3>
                        <p className="py-4 text-xs">Press ESC key or click on ✕ button to close</p>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                            <div className="input validator w-full">
                                <span className="label">Nom</span>
                                <input name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Fruit name (e.g. Apple)" className="w-full" />
                            </div>
                            <div>
                                <div className="select validator w-full">
                                    <span className="label">Color</span>
                                    <select value={fruitColor.id} onChange={(e)=>setFruitColor(e.target.value)} required name="color" id="color">
                                        <option disabled  >Select color</option>
                                        {
                                            dataColor && dataColor.colors.map((color) => (
                                                <option key={`color ${color.id}`} value={color.id} >{color.name}</option>
                                            ))
                                        }
                                    </select>
                                    <div className="validator-hint">Select a color</div>
                                </div>
                                {
                                    colorsLoading && <span className="loading loading-spinner loading-xs"></span>
                                }
                            </div>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Description</legend>
                                <textarea name="description" id="description" className="w-full textarea" value={description} onChange={(e) => setDescription(e.currentTarget.value)}></textarea>
                            </fieldset>
                            <div className="modal-action">
                                <button type="submit" className="btn">
                                    <span>Modifier</span>
                                    {/* {
                                editing && <span className="loading loading-spinner loading-xs"></span>
                            } */}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog></>
        }

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

export default FruitInfos;