import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
const Tag = ({ tagname, onFilter, onExclude, state }) => {
  // Couleur selon l’état
  const base = "flex gap-3 border text-white font-semibold items-center justify-around rounded-lg uppercase cursor-pointer bg-blue-800 border-amber-50";
  // const color =
  //   state === "filter"
  //     ? "bg-green-700 border-green-400"
  //     : state === "exclude"
  //     ? "bg-red-700 border-red-400"
  //     : "bg-blue-800 border-amber-50";

  return (
    <div className={base}>
      <button
        className={`btn btn-xs ${state == "filter"?"btn-success":"btn-ghost"}`}
        onClick={() => onFilter(tagname)}
      >
        <FontAwesomeIcon icon={faPlus} className="cursor-pointer" />
      </button>
      <span>{tagname}</span>
      <button
        className={`btn btn-xs  ${state == "exclude"?"btn-error":"btn-ghost"}`}
        onClick={() => onExclude(tagname)}
      >
       <FontAwesomeIcon icon={faMinus} className="cursor-pointer" />
      </button>
    </div>
  );
};

export default Tag;
