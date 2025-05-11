import { createAuthSlice } from "./slice/auth-slice";
import { create } from 'zustand'

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
}))