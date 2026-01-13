import { useQuery } from '@apollo/client/react';
import { GET_TAGS } from "../graphql/queries";
import  TagFilter  from "./tagfilter";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
function Filter() {
  const { data, loading, error } = useQuery(GET_TAGS);

  if (loading)
    return <div className="loading loading-spinner loading-md text-center"></div>;

  if (error)
    return (
      <p className="text-xl text-center text-red-600">
        Error loading tags: {error.message}
      </p>
    );
    if (error) toast.error(error.message)
  return (
    <>
      <div className="border-2 card shadow-md bg-zinc-50 w-3/4 mx-auto my-4 glass text-black border-slate-950 p-3">
        <TagFilter tags={data.tags} />
      </div>
      <Toaster />
    </>
  );
}

export default Filter;