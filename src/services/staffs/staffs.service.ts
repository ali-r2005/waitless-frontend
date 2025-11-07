import { StaffRequest , StaffResponse , userSearchResponse } from "@/types/staff";
import serviceA from "@/lib/serviceA";

export const StaffService = {
    //search for user to add it to staff in the buisness the user that i search for i by default customers
    searchUser: async (name: string): Promise<userSearchResponse> => {
     const res = await serviceA.get<userSearchResponse>(`/api/users/search`,{params:{name}});
        return res.data;
    },

    //add user to staff in the buisness
    add_to_staff: async (user: number, staff: StaffRequest) => {
        const res = await serviceA.post(`/api/users/${user}/add-to-staff`, staff);
        return res.data ;
    },

     //the staff and the branch manager are both staffs
    //remove staff or branch manager from staff in the buisness
    remove_from_staff: async (user: number) => {
        const res = await serviceA.delete(`/api/users/${user}/remove-from-staff`);
        return res.data ;
    },

    //get all staff in the buisness
    get_staff: async (page: number = 1): Promise<StaffResponse> => {
        const res = await serviceA.get<StaffResponse>(`/api/staff?page=${page}`);
        console.log("get staffs",res.data);
        return res.data ;
    },

    //make staff role branch manager
    make_staff_branch_manager: async (user: number, branch: number) => {
        const res = await serviceA.post(`/api/users/${user}/branch-manager`, { branch });
        return res.data ;
    },

    //remove staff role branch manager
    remove_staff_branch_manager: async (user: number) => {
        const res = await serviceA.delete(`/api/branch-managers/${user}`);
        return res.data ;
    },

}