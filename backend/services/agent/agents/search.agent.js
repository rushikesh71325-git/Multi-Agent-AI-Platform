import { searchTool } from "../config/tavily";

export const searchAgent = async (state) =>{
    try{
        const results = await searchTool.invoke(state.prompt);
        console.log(results);
        return {
            ...state,
            searchResults:results,
            images:results?.images || [],
        }
    }catch(err){
        console.log(err);
        return {
            ...state,
            searchResults:[],
            images:[],
        }
    }
    
}