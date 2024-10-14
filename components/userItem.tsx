import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";


const UserItem = () => {
    return (
        <button className="flex items-center gap-2.5 border border-gray-200 py-4 px-2 rounded-lg">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
                <p className="text-[11px]">ADMINISTRATOR</p>
                <p className="text-[14px] w-full font-medium text-black truncate">Joseph Banda</p>
            </div>

            <div className="flex grow justify-end">
                <ChevronLeft size={20} color="#ABAAA9" />
            </div>
        </button>
    );
};

export default UserItem;