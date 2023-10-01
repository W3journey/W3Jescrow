"use server"
import { revalidatePath } from "next/cache"

export async function revalidateEscrowsPage() {
  revalidatePath("/escrows")
}
