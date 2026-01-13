import { useState } from "react";
import Tag from "./tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLazyQuery } from "@apollo/client/react";
import { GET_FRUITS, GET_FRUITS_BY_TAGS } from "../graphql/queries";

const TagFilter = ({ tags = [] }) => {
  const [filter, setFilter] = useState([]);
  const [exclude, setExclude] = useState([]);

  // Charger tous les fruits
  const [loadAllFruits, { data: allFruits, loading: loadAll }] =
    useLazyQuery(GET_FRUITS);

  // Charger filtré
  const [loadFilteredFruits, { data: filteredFruits, loading: loadFiltered }] =
    useLazyQuery(GET_FRUITS_BY_TAGS);

  const fruits = filteredFruits?.getFruitByMultipleTag || allFruits?.fruits || [];

  const loading = loadAll || loadFiltered;

  const handleFilter = (tag) => {
    if (filter.includes(tag)) {
      setFilter((prev) => prev.filter((t) => t !== tag));
    } else {
      setFilter((prev) => [...prev, tag]);
      setExclude((prev) => prev.filter((t) => t !== tag));
    }
  };

  const handleExclude = (tag) => {
    if (exclude.includes(tag)) {
      setExclude((prev) => prev.filter((t) => t !== tag));
    } else {
      setExclude((prev) => [...prev, tag]);
      setFilter((prev) => prev.filter((t) => t !== tag));
    }
  };

  const sendFilters = () => {
    if (filter.length === 0 && exclude.length === 0) {
      loadAllFruits();
    } else {
      loadFilteredFruits({
        variables: {
          incl: filter,
          excl: exclude,
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* TAG LIST */}
      <div className="flex flex-wrap gap-3">
        {tags.map((t) => (
          <Tag
            key={"tag" + t.id}
            tagname={t.name}
            onFilter={handleFilter}
            onExclude={handleExclude}
            state={
              filter.includes(t.name)
                ? "filter"
                : exclude.includes(t.name)
                ? "exclude"
                : "none"
            }
          />
        ))}
      </div>

      {/* BUTTON */}
      <div className="mt-3">
        <button className="btn btn-info" onClick={sendFilters}>
          Chercher <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* DISPLAY FILTERS */}
      <div className="text-black mt-2">
        <h1>Filter</h1>
        <p>+ Inclus : {filter.join(", ") || "Aucun"}</p>
        <p>− Exclus : {exclude.join(", ") || "Aucun"}</p>
      </div>

      {/* FRUITS TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center "><span className="loading loading-spinner loading-md"></span></td>
              </tr>
            ) : fruits.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-xl text-red-500">
                  No fruits with these filters
                </td>
              </tr>
            ) : (
              fruits.map((fruit) => (
                <tr key={"fruit" + fruit.id}>
                  <td>{fruit.id}</td>
                  <td>{fruit.name}</td>
                  <td>
                    <span className="badge badge-info badge-sm">{fruit.nbTags}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagFilter;