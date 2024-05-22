"use server";
import { getTranslations } from "next-intl/server";

export const fetchNoteData = async (page: number) => {
  const response = await fetch(`/api/notes?noteId=&{noteId}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

interface Params {
  locale: string;
}

interface Context {
  params: Params;
}
export async function generateMetadata({ params: { locale } }: Context) {
  const t = await getTranslations({ locale, namespace: "Homepage" });

  return {
    title: t("metadata.public"),
  };
}
