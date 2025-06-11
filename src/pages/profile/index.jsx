import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store'
import { IoArrowBack } from 'react-icons/io5'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { colors, getColor } from '../../lib/utils'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '../../lib/api-client'
import {
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  HOST,
} from '../../utils/constants'
import StatusCodes from 'http-status-codes'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`)
    } else {
      setImage(null)
    }
  }, [userInfo, setUserInfo])

  const validateProfile = () => {
    if (!firstName) {
      toast.error('First name is required')
      return false
    }
    if (!lastName) {
      toast.error('Last name is required')
      return false
    }
    return true
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        )
        if (response.status === StatusCodes.OK) {
          setUserInfo(response.data.data)
          toast.success('Profile updated successfully')
          navigate('/chat')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate('/chat')
    } else {
      toast.error('Please setup profile')
    }
  }

  const handleFileInputClick = () => fileInputRef.current.click()

  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('profile-image', file)

      const response = await apiClient.post(
        ADD_PROFILE_IMAGE_ROUTE,
        formData,
        { withCredentials: true }
      )

      if (response.status === StatusCodes.OK) {
        setUserInfo(response.data.data)
        toast.success('Profile image updated successfully')
      }

      const reader = new FileReader()
      reader.onload = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = async () => {
    const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
      withCredentials: true,
    })
    if (response.status === StatusCodes.OK) {
      setUserInfo(response.data.data)
      toast.success('Profile image deleted successfully')
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#111] text-white font-sans">
      <div className="w-[92vw] md:w-[80vw] lg:w-[60vw] xl:w-[50vw] bg-[#1a1a1a] rounded-3xl p-8 shadow-[0_0_25px_#000] space-y-10 border border-[#2f303b]">

        {/* Back */}
        <div className="flex items-center">
          <IoArrowBack
            className="text-3xl text-white/70 hover:text-white transition cursor-pointer"
            onClick={handleNavigate}
          />
        </div>

        {/* Profile Image & Upload */}
        <div className="flex flex-col items-center space-y-6">
          <div
            className="relative h-32 w-32 md:w-44 md:h-44 rounded-full border-4 border-[#333] shadow-inner"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar>
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-4xl flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.charAt(0)
                    : userInfo.email?.charAt(0)}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-xl" />
                ) : (
                  <FaPlus className="text-white text-xl" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpeg, .jpg, .svg, .webp"
            />
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="space-y-1">
            <label className="text-gray-300 text-sm">Email</label>
            <Input
              type="email"
              disabled
              value={userInfo.email}
              className="bg-[#222] text-white border border-[#444] px-4 py-3 rounded-md focus:ring-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-gray-300 text-sm">First Name</label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#222] text-white border border-[#444] px-4 py-3 rounded-md focus:ring-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-gray-300 text-sm">Last Name</label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#222] text-white border border-[#444] px-4 py-3 rounded-md focus:ring-white"
            />
          </div>

          {/* Color Picker */}
          <div className="flex justify-center gap-3 pt-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`h-8 w-8 rounded-full cursor-pointer border-2 transition-all ${color} ${
                  selectedColor === index ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => setSelectedColor(index)}
              ></div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={saveChanges}
            className="bg-white text-black text-lg px-8 py-3 rounded-lg hover:bg-gray-300 transition-all shadow-md"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
