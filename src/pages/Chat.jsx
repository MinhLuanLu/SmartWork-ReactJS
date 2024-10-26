import React from "react";
import Header from "../components/header";
import avataricon from "../assets/images/avataricon.png"
import { useEffect , useState} from "react";

export default function Chat(){

    const [FullName, setFullName] = useState('');
    const [Role, setRole] = useState('');
    const [Email, setEmail] = useState ('');
    const [Workplace, setWorkplace] = useState ([]);
    const [Info, setInfo] = useState([]);
    const [Employee, setEmployee] = useState([]);

    const [Message, setMessage] = useState('');
    const [Addmessage, setAddmessage] = useState([]);
    const [Add_receivermessage, setAdd_receivermessage] = useState([]);
    const [Receiver, setReceiver] = useState('');
    const [Image, setImage] = useState(null);
    
   

    useState(()=>{
        const getFullName = sessionStorage.getItem('FullName');
        const getRole = sessionStorage.getItem('Role');
        const getEmail = sessionStorage.getItem('Email');
        setRole(getRole);
        setFullName(getFullName);
        setEmail(getEmail);
    })

    useEffect(() =>{
        let info_list = [];
        async function Get_manager(item){
            const endpoint = `${import.meta.env.VITE_API_URL}api/Assignment`;
            const data = {"Email": Email, "Search_data": item};

            await fetch(endpoint, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response =>{
                if (response.ok){
                    return response.json();
                }
                if (response.status === 400){
                    return response.json().then(data =>{
                        if(data.message){
                            alert(data.message);
                            
                        }
                    })
                }
            })
            .then(data =>{
                if(data.message){

                    const employeeIndex = data.info.employee.indexOf(FullName);
                    if (employeeIndex !== -1) {
                        data.info.employee.splice(employeeIndex, 1);
                    }

                    info_list.push(data.info); 
                    setInfo(info_list);
                    setEmployee(data.info.employee);
                                    

                }
            })
        }

        
        async function Get_Workplace(){
            const endpoint = `${import.meta.env.VITE_API_URL}api/Workplace`;
            const getFullName = sessionStorage.getItem('FullName');
       
            const data = {"FullName": getFullName };
            await fetch(endpoint,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
                .then(response =>{
                    if (response.ok){
                        return response.json();
                    }
                    if (response.status === 400){
                        return response.json().then(data =>{
                            if(data.message){
                                console.log(data.message);
                                
                            }
                        })
                    }
                })
                    
                .then(data =>{
                    if(data.message){
                        console.log('Got Workplace Name...');
                        const workplaces = data.workplaces;
                        setWorkplace(workplaces);
                        
                        

                        const workplace_option = document.getElementById('workplace_option');
                        workplace_option.innerText = '';

                        for (let i = 0; i < workplaces.length; i++){
                            const create = document.createElement('option');
                            create.innerText = workplaces[i];
                            document.getElementById('workplace_option').appendChild(create);

                            Get_manager(workplaces[i]);
                            
                        }
                        
                        
                    }
                })
        }

        async function Check_Manger_Name(){
            const endpoint = `${import.meta.env.VITE_API_URL}api/Get_Manager`;
            const getFullName = sessionStorage.getItem('FullName');
       
            const data = {"FullName": getFullName };
            await fetch(endpoint,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
                .then(response =>{
                    if (response.ok){
                        return response.json();
                    }
                    if (response.status === 400){
                        return response.json().then(data =>{
                            if(data.message){
                                console.log(data.message);
                                
                            }
                        })
                    }
                })
                    
                .then(data =>{
                    if(data.message){
                        console.log('Got Manager Workplace Name...');
                        
                        const workplaces = data.workplaces;
                        setWorkplace(workplaces);
                        

                        const workplace_option = document.getElementById('workplace_option');
                        workplace_option.innerText = '';

                        for (let i = 0; i < workplaces.length; i++){
                            const create = document.createElement('option');
                            create.innerText = workplaces[i];
                            document.getElementById('workplace_option').appendChild(create);

                            Get_manager(workplaces[i]);
                            
                        }
                       
                        
                    }
                })
        }

        Get_Workplace();
        Check_Manger_Name();
    },[])

    function Message_value(event){
        let message = (event.target.value);
        setMessage(message);   
    }

    async function Choose_receiver(receiver){
        setReceiver(receiver);
        let strReceiver  = receiver.toString();
        let data = {
            "Receiver": strReceiver,
            "Sender": FullName,
        }
        const endpoint = `${import.meta.env.VITE_API_URL}api/Get_Conversation`;
            await fetch(endpoint,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res =>{
                if(res.ok){
                    return res.json();
                }
                if(res.status === 400){
                    alert(data.message);
                }
            })

            .then(data =>{
                if(data.message){
                    console.log(data.conversation);
                    setAdd_receivermessage(data.conversation);
                    Get_Message(FullName, strReceiver);                
                }
            })
    }

    async function Get_Message(fullname, strreceiver){
        const data = {
            "Sender": fullname,
            "Receiver": strreceiver,
            
        }
        
        const endpoint = `${import.meta.env.VITE_API_URL}api/Conversation`;
        await fetch(endpoint,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res =>{
            if(res.ok){
                return res.json();
            }
            if(res.status === 400){
                alert(data.message);
            }
        })

        .then(data =>{
            if(data.message){
                console.log(data.conversation);
                setAddmessage(data.conversation);
                setMessage('');
               
            }
        })
    }

    async function Send_message() {
        const now = new Date();
        const currentDate = now.toLocaleDateString();
        const currentTime = now.toLocaleTimeString();
        let time = `${currentDate} - ${currentTime}`;
        let strReceiver = Receiver.toString();
    
        if (Receiver === "") {
            alert('Choose who you want to send the message to.');
            return;
        }
    
        const formData = new FormData();
        formData.append('Sender', FullName);
        formData.append('Receiver', strReceiver);
        formData.append('Message', Message);
        formData.append('Sendingtime', time);
        if (Image) {
            formData.append('Image', Image);
        }
    
        console.log(...formData); // To check the form data before sending
    
        const endpoint = `${import.meta.env.VITE_API_URL}api/Conversation`;
        await fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            if (res.status === 400) {
                return res.json().then(data => {
                    alert(data.message);
                });
            }
        })
        .then(data => {
            if (data.message) {
                console.log(data.conversation);
                setAddmessage(data.conversation);
                setMessage('');
                //setImage(null); // Clear the image after sending the message
            }
        });
    }
    

    function Image_value(event) {
        setImage(event.target.files[0]);
    }


    return(
        <>
            <Header/>
            <div class="container mx-auto shadow-lg rounded-lg mt-28">
                
                <div class="px-5 py-5 flex justify-between items-center bg-white border-b-2">
                    <div class="font-semibold text-2xl ml-8">Chat with: {Receiver}</div>
                        
                        <div
                            class="h-5 w-5 p-2 bg-green-500 rounded-full text-white font-semibold flex items-center justify-center"
                        >
                            
                        </div>
                    </div>
                
                    <div class="flex flex-row justify-between bg-white">
                
                    <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    
                        <div class="border-b-2 py-4 px-2">
                            <input
                                type="text"
                                placeholder="Search your manager"
                                class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                            <label htmlFor="workplace_option" className="ml-8 font-bold">Select Your Workkplace</label>
                            <select name="workplace_option" id="workplace_option" className="mt-8 ml-2 border-2" >
            
                            </select>
                        </div>
                        
                        {Info.map((list, index) =>
                            <button onClick={() => Choose_receiver(list.contract_manager)}  key={index} class="flex flex-row py-4 px-2 items-center border-b-2">
                                <div class="w-1/4">
                                    <img
                                    src={avataricon}
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                    />
                                </div>
                                <div class="w-full">
                                    <div  class="text-lg font-semibold mr-32">{list.contract_manager}</div>
                                    <span class="text-gray-500 mr-24">{list.customer ? `Manage at ${list.customer}`: 'Loading information...'}</span>
                                </div>
                            </button>
                        )}

                        {Employee.map((employee, index) =>
                            <button onClick={() => Choose_receiver(employee)}  key={index} class="flex flex-row py-4 px-2 items-center border-b-2">
                                <div class="w-1/4">
                                    <img
                                    src={avataricon}
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                    />
                                </div>
                                <div class="w-full">
                                    <div  class="text-lg font-semibold mr-32">{employee}</div>
                                  
                                </div>
                            </button>
                        )}
                        
                </div>
                

                <div class="w-full px-5 flex flex-col justify-between">
                    <div class="flex flex-col mt-5">
                    {Addmessage.map((items, index) =>   
                        <div class="flex justify-end mb-4">
                        
                            <div key={index}
                            class="mr-2 py-3 px-4 w-auto bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                            >
                        
                            {items.Message}
                            
                            </div>
                           
                            {items.Image && (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${items.Image}`}
                                    alt="Message Attachment"
                                    className="mt-2"
                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                />
                            )}
                                        
                            
                            <img
                            src={avataricon}
                            class="object-cover h-8 w-8 rounded-full"
                            alt=""
                            />
                        </div>
                    )}
                    
                    {Add_receivermessage.map((items, index) => 
                        <div class="flex justify-start mb-4">
                                <img
                                src={avataricon}
                                class="object-cover h-8 w-8 rounded-full"
                                alt=""
                                />
                                <div key={index}
                                class="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                >
                                {items.Message}
                                
                                </div>
                                {items.Image && (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${items.Image}`}
                                    alt="Message Attachment"
                                    className="mt-2"
                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                />
                                )}
                        </div>
                    )}
                    </div>


                    <div class="flex">
                        <input
                            value={Message}
                            onChange={Message_value}
                            class="w-full bg-gray-300 py-5 px-3 rounded-xl"
                            type="text"
                            placeholder="type your message here..."
                        />
                        <div class="rounded-md border border-indigo-500 bg-gray-50 p-2 shadow-md w-24">
                            <label for="upload" class="flex flex-col items-center gap-1 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span class="text-gray-600 text-xs font-medium">Upload file</span>
                            </label>
                            <input id="upload" type="file" class="hidden" onChange={Image_value}/>
                        </div>

                        <button onClick={Send_message} type="button" class="text-white bg-blue-300 hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xl px-5 py-2.5 ml-2 mb-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-500">Send</button>
                    </div>


                </div>
                
                </div>
            </div>
        </>
    );
}