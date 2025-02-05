import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerifiedPage() {
    return (
        <section className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl text-primary font-bold">Email Verified</h2>
            <p className="text-muted-foreground mb-4">Your email has been verified.</p>
            <Link href="/" className={buttonVariants({ variant: "default" })}>
                Go to Home
            </Link>
        </section>
    );
}