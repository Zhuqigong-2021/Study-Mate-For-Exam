import React, { Dispatch, SetStateAction, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Check, Eraser, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
interface props {
  noteTitle: string[];
  colorClasses: string[];
  topicFilter: string;
  setTopicFilter: Dispatch<SetStateAction<any>>;
  setShowMatchingNote: Dispatch<SetStateAction<any>>;
  setFilterOutNote: Dispatch<SetStateAction<any[]>>;
}

const TopicFilter = ({
  noteTitle,
  colorClasses,
  topicFilter,
  setTopicFilter,
  setShowMatchingNote,
  setFilterOutNote,
}: props) => {
  const r = useTranslations("Report");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="mx-1 mt-1  flex items-center space-x-2 outline-none focus:border-none active:border-none md:mt-0"
          size={"sm"}
          variant="outline"
        >
          <Filter size={20} />
          <span>{r("filter.button")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {noteTitle.map((note, index) => {
          return (
            <DropdownMenuItem
              className="w-full"
              key={index}
              onClick={() => {
                setTopicFilter(note);
              }}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`${colorClasses[index]} mr-2 h-2 w-2 rounded-full`}
                  ></span>
                  <span>
                    {note.length < 5 ? note : note.substring(0, 3) + "."}
                  </span>
                </div>

                <span>
                  {topicFilter && topicFilter === note && <Check size={18} />}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem
          className="w-full"
          onClick={() => {
            setTopicFilter("");
            setFilterOutNote([]);
            setShowMatchingNote("");
          }}
        >
          <span className="flex items-center space-x-2">
            <Eraser size={12} />
            <span>{r("filter.clear")}</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TopicFilter;
