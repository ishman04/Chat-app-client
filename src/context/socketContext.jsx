import { createContext, useEffect,useContext, useRef } from "react";
import { useAppStore } from "../store";
import { HOST } from "../utils/constants";
import {io} from "socket.io-client"

//context => way to store data globally across components
// Provider => component that gives data to its children
// useContext => hook to get the value inside any child component


const SocketContext = createContext(null)



export const useSocket = () => { //allows any child component to easily use a WebSocket connection without repeating logic. Lets us do const socket = useSocket() form anywhere in the app
    return useContext(SocketContext)
}

export const SocketProvider = ({children}) => {
    const socket = useRef(); //lets us store socket object across re renders without reinitializing it(holds actual socket connection)
    const {userInfo} = useAppStore();
    useEffect(() =>
        {
            if(userInfo){
                socket.current = io.connect(HOST, { //when userinfo available, sends user id's query parameter to identify them
                    withCredentials: true,
                    query:{
                        userId:userInfo.id
                        }
                    }
                )
                socket.current.on("connect", () => { //log when connected
                    console.log("Connected to socket server")
                }) 

                const handleRecieveMessage = (message) =>{
                    const {selectedChatData, selectedChatType, addMessage} = useAppStore();

                    if(selectedChatType !== undefined && selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id
                    ){
                        console.log(message)
                        addMessage(message)
                    }

                }
                socket.current.on("recieveMessage",handleRecieveMessage);
                return () => {
                    socket.current.disconnect(); // if user logs out or this component disappears, disconnect from server to clean up
                }
            }
        },[userInfo])
        return (
            //putting socket in context so other components can use
            <SocketContext.Provider value={socket.current}> 
                {children}
            </SocketContext.Provider>
        )
}

