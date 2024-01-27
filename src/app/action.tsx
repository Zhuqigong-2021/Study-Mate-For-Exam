"use server";

export const fetchNoteData = async (page: number) => {
  const response = await fetch(`/api/notes?noteId=&{noteId}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};
