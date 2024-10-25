import { deleteTeamMemberAction } from "@/app/(root)/settings/teams/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";

interface DeleteEntryProps {
    id: string;
}


const DeleteEntry = ({ id }: DeleteEntryProps) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true)

            const result = await deleteTeamMemberAction(id);

            if (result.success) {
                toast.success("Team member deleted successfully!");
            } else {
                toast.error("Error deleting team member");
            }
        } catch (error) {
            console.error("Error in handleDeleteTeamMember:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost">
                    <Trash2 size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-400" onClick={() => handleDelete(id)}>
                        {
                            isLoading ? "Deleting..." : "Continue"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEntry