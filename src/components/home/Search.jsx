import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../context/MainContext';


const Search = () => {

    const [tag, setTag] = useState("")
    const { setLoadingDialog } = useContext(MainContext)
    const handleSearch = async (e) => {
        e.preventDefault()
        getByTag()
    }

    useEffect(() => {
        if (tag)
            getByTag()
    }, []);

    useEffect(() => {
        getByTag()
    }, []);

    const getByTag = async () => {
        setLoadingDialog(true)
        setLoadingDialog(false)
    }
    
    return (
        <div>
            <div className="mt-5 w-100 justify-content-center">
                <form onSubmit={(e) => handleSearch(e)} id="searchForm" className="d-flex shadow p-2 bg-white rounded-pill w-50 mx-auto">
                    <input id='search-input' className="text-info c1 border-0 mr-3 w-100" required="required" value={tag} onChange={(e) => setTag(e.target.value)} type="text" placeholder="جستجو کنید" />
                    <button id="searchIcon" className="border-0 btn themeColor">
                        <i className="fa fa-search text-info" ></i>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Search;