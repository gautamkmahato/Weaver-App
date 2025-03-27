'use client'

import ErrorCard from '../../../_components/ErrorCard';
import LoadingSpinnerWithText from '../../../_components/LoadingSpinner';
import Test from '../../../_components/Test';
import fetchJsonData from '../../../actions/fetchJsonData';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function NewWindowDocumentationPage() {

    const [checkStatus, setCheckStatus] = useState(false);
    const [docIdStatus, setDocIdStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [apiData, setApiData] = useState('');

    const params = useParams();
    const docId = params.docId;
    const project_id = params.id;
    console.log(params);

    const { isSignedIn, user, isLoaded } = useUser();
    const { getToken } = useAuth();

    useEffect(() => {
        if (isLoaded && user){
            async function getJsonData() {
                // call the fetchJsonData function to check if the docId has jsonData or not
                setLoading(true);
                const token = await getToken();
                const jsonData = await fetchJsonData(docId, project_id, user?.id, token);
                console.log(jsonData)
                if(jsonData?.status){
                    if(jsonData[0]?.openapi_schema){
                        setDocIdStatus(true); 
                        setCheckStatus(true);
                        setLoading(false);
                        setApiData(jsonData[0].openapi_schema);
                    } else{
                        setDocIdStatus(true); 
                        setCheckStatus(false);
                        setLoading(false);
                    }
                } else{
                    setErrorMessage(jsonData?.message);
                    setDocIdStatus(false); 
                    setCheckStatus(false);
                    setLoading(false);
    
                }
            }
            getJsonData();
        }
        
    }, [docId, getToken, isLoaded, project_id, user]);

    if(loading){
        return(
            <>
                <LoadingSpinnerWithText />
            </>
        )
    }

    if (!isLoaded || !isSignedIn || !user) { 
        return(
            <>
                <div>
                    <p><span className="text-blue-700 font-semibold"><Link href='/sign-in'>Sign In</Link></span> in to view this page</p>
                </div>
            </>
        )
    }

    return (
        <>
            {docIdStatus ? <Test apiData={apiData} docId={docId} /> : 
                <>
                    <ErrorCard message="404 Documentation not found" btnText="Go to Homepage" />
                </>
            }
        </>
    )
}
