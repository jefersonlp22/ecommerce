import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type Reponse<T> = [
    T,
    Dispatch<SetStateAction<T>>,
    any
];

/**
 * 
 * @param key Identifier name to property in localstorage
 * @param initialState Initial State to value
 */
function usePersistedState<T>(key: string, initialState: T): Reponse<T>{

    const [state, setState] = useState(()=>{        
        const storagedValue = localStorage.getItem(key);
        return storagedValue ? JSON.parse(storagedValue) : initialState;        
    });

    const getItem = (key: string) => {
        return localStorage.getItem(key);
    }

    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(state));
    },[key, state]);

    return [
        state, 
        setState,
        getItem
    ];        
};

export default usePersistedState;