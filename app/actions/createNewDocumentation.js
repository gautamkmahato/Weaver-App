
'use server'

export default async function createNewDocumentation(inputData, token){
    const response = await fetch('http:localhost:8000/api/v1/documentation/add/test/aaa', {
        method: 'POST', 
        headers: { 
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`  // Include the token in Authorization header
        },
        body: JSON.stringify(inputData) 
    });
    const result = await response.json(); 

    console.log(result)

    if(!response.ok){ 
        return {
            message: "Error in Inserting Data in createNewDocumentation",
            success: false
        }
    }
    return result;
}