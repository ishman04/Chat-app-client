import { createAuthSlice } from "./slice/auth-slice";
import { create } from 'zustand'
import { createChatSlice } from "./slice/chat-slice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),  //...a = set,get,api(here we pass set to slice as is expected in slice function)
    ...createChatSlice(...a)
}))