"use server";

import prisma from "@/lib/db/prisma";
export async function getNote(noteId: string) {
  try {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    return JSON.parse(JSON.stringify(note));
  } catch (err) {
    return { message: err };
  }
}
