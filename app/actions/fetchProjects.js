'use server'

export default async function fetchProjects(userId, token) {

    const inputData = {
        userId: userId
    }

    const response = await fetch('https://weaver-server.vercel.app/protected', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`  // Include the token in Authorization header
        },
        body: JSON.stringify(inputData)
    });

    const result = await response.json();

    if (!response.ok) {
        return {
            message: "Error in fetching Request in getAllProjects by userId"
        };
    }

    return result;
}
