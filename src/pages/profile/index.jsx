import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store'
import { IoArrowBack } from 'react-icons/io5'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { colors, getColor } from '../../lib/utils'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {toast} from 'sonner'
import { apiClient } from '../../lib/api-client'
import { UPDATE_PROFILE_ROUTE, ADD_PROFILE_IMAGE_ROUTE,HOST } from '../../utils/constants'
import StatusCodes from 'http-status-codes'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo,setUserInfo } = useAppStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null)

   useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`)
    }
   },[userInfo])

  const validateProfile = () => {
    if(!firstName){
      toast.error("First name is required")
      return false
    }
    if(!lastName){
      toast.error("Last name is required")
      return false
    }
    return true
  }

  const saveChanges = async () => {
    console.log(userInfo)
    if(validateProfile()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE,{
          firstName,lastName,color:selectedColor
        },{withCredentials:true})
        if(response.status == StatusCodes.OK){
          setUserInfo(response.data.data)
          toast.success("Profile updated successfully")
          navigate('/chat')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleNavigate = () => {
    if(userInfo.profileSetup){
      navigate('/chat');
    } else {
      toast.error("Please setup profile")
    }
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = async(event) => {
    const file = event.target.files[0];
    console.log({file});
    if(file){
      const formData = new FormData();
      formData.append("profile-image",file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials: true})
      if(response.status == StatusCodes.OK){
        setUserInfo(response.data.data)
        toast.success("Profile image updated successfully")
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file);
    }
      
  }

  const handleDeleteImage = async() =>{
    
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#111] text-white">
      <div className="w-[90vw] md:w-[85vw] lg:w-[70vw] xl:w-[60vw] flex flex-col gap-10 p-6 bg-[#111] rounded-3xl shadow-2xl">
        
        {/* Back Button */}
        <div>
          <IoArrowBack className="text-4xl lg:text-5xl text-white/80 cursor-pointer hover:text-white transition" onClick={handleNavigate} />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-8">
          
          {/* Avatar */}
          <div
            className="relative h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden border border-gray-700"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar>
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-5xl flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full transition"
              onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-xl" />
                ) : (
                  <FaPlus className="text-white text-xl" />
                )}
              </div>
            )}
            <input type='file' ref={fileInputRef} className='hidden' onChange={handleImageChange} name='profile-image' accept='.png, .jpeg, .jpg, .svg, .webp' />
          </div>

          {/* Form Fields */}
          <div className="w-full max-w-md flex flex-col gap-5">
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="bg-[#222] text-white border border-[#333] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#222] text-white border border-[#333] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#222] text-white border border-[#333] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            {/* Avatar Color Picker */}
            <div className="flex gap-4 mt-2 justify-center">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 rounded-full cursor-pointer border-2 transition-all duration-300 ${color} ${
                    selectedColor === index ? 'ring-2 ring-white' : 'ring-0'
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <Button className="bg-white text-black text-lg px-10 py-3 rounded-md hover:bg-gray-200 transition" onClick={saveChanges}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
