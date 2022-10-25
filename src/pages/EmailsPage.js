import React, { useEffect, useState } from 'react'
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { CSVLink, CSVDownload } from "react-csv";

function EmailsPage() {

    const [emails, setEmails] = useState([])

    const GetEmails = async () => {
        const data = await getDocs(collection(db, "subscription_emails"), orderBy("timestamp", "asc"));
        setEmails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        //sort emails by timestamp

        console.log('DB : got emails');
    };
useEffect(()=>{
if(!emails) return
setEmails(emails.sort((a, b) => b.timestamp - a.timestamp));

},[emails])
    useEffect(() => {
        GetEmails();
    }, [])

    const [emailsWithReadableTime, setEmailsWithReadableTime] = useState([])
    useEffect(() => {
        if (!emails) return
        setEmailsWithReadableTime(emails.map((email, i) => {
            if (!email?.timestamp || !email || email == undefined) return
            return {
                ...email,
                timestamp: new Date(email.timestamp.seconds * 1000).toLocaleString(),
                id: i + 1
            }
        }))
    }, [emails])

    console.log({ emailsWithReadableTime })
    console.log({ emails })

    //downlaod csv 

    const headers = [
        {
            label: " ID", key: "id"
        },
        {
            label: " Email", key: "email"
        },
        {
            label: " Timestamp", key: "timestamp"
        },


    ]

    const testData = [
        {
            email: 'zaeaz@gmail.com',
            timestamp: '10/24/2022, 10:18:04 PM',
            id: 'U3oTCbjB1iIIc8bkQlwy'
        },
        {
            timestamp: '10/24/2022, 10:08:49 PM',
            email: 'azeaze',
            id: 'mV68nmph4yIclECiwsd7'
        },
        {
            email: 'azeazetestaze',
            timestamp: '10/24/2022, 10:10:42 PM',
            id: 'mWNEMyAvW5zFph3u2FUK'
        },
        {
            email: 'azeazetestazes',
            timestamp: '10/24/2022, 10:11:25 PM',
            id: 'odODF2tzlSY9a0GFmk6T'
        }

    ]




    const csvLink = {
        headers: headers,
        data: emailsWithReadableTime,
        filename: "csvfile.csv"
    }
    return (
        <div style={{ paddingTop: '50px', paddingBottom: '120px' }} >
            <h1 className='text-2xl w-[60%] text-left mb-8 ml-6  ' style={{ margin: 'auto', width: '90%', maxWidth: '800px', paddingBottom: '5px' }} >  Subscription Emails</h1>

            {emailsWithReadableTime && <CSVLink style={{ textDecoration: 'none', opacity: '0.9', width: '90%', maxWidth: '800px', display: 'flex', margin: 'auto', marginBottom: '20px' }} className='text-blue-500' {...csvLink}>Export to CSV</CSVLink>}
            <div class="flex flex-col" style={{ width: '90%', margin: "auto", maxWidth: '750px' }}>
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 inline-block max-w-3xl min-w-full  sm:px-6 lg:px-8">
                        <div class="overflow-hidden">
                            <table class="min-w-full">
                                <thead class="bg-white border-b">
                                    <tr>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-center ">
                                            #
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                                            Email
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                                            Timestamp
                                        </th>

                                    </tr>
                                </thead>
                                {emails && <tbody>
                                    {emails.map((email, i) => {
                                        if (!email.email) return
                                        return (
                                            <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    {email.email}
                                                </td>
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    {new Date(email.timestamp?.seconds * 1000).toLocaleString()}
                                                </td>

                                            </tr>
                                        )
                                    })}



                                </tbody>}
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EmailsPage