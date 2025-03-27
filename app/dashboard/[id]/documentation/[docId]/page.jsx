'use client'


import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RedirectToSignIn, useAuth, useUser } from '@clerk/nextjs';
import fetchJsonData from '../../../../actions/fetchJsonData'
import LoadingSpinner from '../../../../_components/LoadingSpinner'
import UploadSchema from '../../../_components/UploadSchema'
import Test from '../../../../_components/Test'
import ErrorCard from '../../../../_components/ErrorCard';


 
export default function DocumentationPage() {

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
            async function checkJsonData() {
                // call the fetchJsonData function to check if the docId has jsonData or not
                setLoading(true);
                const token = await getToken(); 
                const jsonData = await fetchJsonData(docId, project_id, user?.id, token);
                console.log(jsonData);
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
            checkJsonData();
        }
        
    }, [docId, getToken, isLoaded, project_id, user]);

    if(loading){
        return(
            <>
                <LoadingSpinner />
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

    if (!isSignedIn) { 
        return(
          <>
            <RedirectToSignIn />
          </>
        ) 
    }

    return (
        <> 
            {docIdStatus ? (checkStatus ? <>
                <div className='bg-neutral-50'> 
                    {/* Base */}
                    <div className="flex justify-end mr-12 pt-8">
                        <Link
                            className="inline-block rounded border border-amber-600 bg-amber-600 px-12 py-3 text-sm font-medium text-white hover:bg-amber-700 hover:text-white focus:outline-none focus:ring active:text-orange-500"
                            href={`/documentation/${project_id}/${docId}`} target='_blank'
                            
                        >
                            Open in New Window
                        </Link>
                    </div>
                    <Test apiData={apiData} docId={docId} />
                </div>
            </> : <UploadSchema docId={docId} project_id={project_id} /> ) 
                : <ErrorCard message="404 not found" btnText="Go to Dashboard" />
            }
        </>
    )
}
